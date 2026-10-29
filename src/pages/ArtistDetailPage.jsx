import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck, Award, MapPin, Copy, Check, Play, Pause,
  Share2, Heart, ArrowRight, Clock, Trophy, Eye, Sparkles,
  Zap, AlertCircle, X, ChevronRight, CheckCircle2, Sliders,
  Palette, UserCheck, Phone, Mail, FileText, DollarSign,
  Maximize2, RefreshCw
} from 'lucide-react';
import { USERS, ARTWORKS, AUCTION_SESSIONS, formatPrice, formatPriceFull, formatCountdown } from '../data/mockData';
import styles from './ArtistDetailPage.module.css';

/* ============================================================
   FALLBACK / EXTENDED MOCK DATA FOR DEMO & UCD COMPLIANCE
   ============================================================ */
const DEFAULT_ARTIST_EXTRA = {
  hash_sha256: '0x8f2a93c4e1b7d5a89201f4c3b2e5a7d90148e6f1a8c903b417e2c5d9e7f12a4b',
  highlight_work: 'Bình Minh Trên Biển Đông',
  highlight_award: 'Huy chương Vàng Triển lãm Mỹ thuật Toàn quốc 2024',
  record_hammer_price: 145000000,
  clearance_rate: '96.4%',
  total_settled: '27/28 tác phẩm',
  audio_duration: 75, // 1:15s
  audio_quote: 'Hội họa độc bản không chỉ là sự hòa sắc trên toan, mà là hành trình lưu giữ rung cảm thuần khiết nhất của tâm hồn trước thiên nhiên.',
  studio_photos: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop',
  ],
  education_timeline: [
    { year: '2012', desc: 'Tốt nghiệp Thủ khoa chuyên ngành Sơn dầu, Đại học Mỹ thuật Việt Nam.' },
    { year: '2016', desc: 'Triển lãm cá nhân "Sắc Màu Phù Sa", Trung tâm Văn hóa Pháp L’Espace Hà Nội.' },
    { year: '2021', desc: 'Giải thưởng Nghệ sĩ Trẻ Đương đại Xuất sắc, Singapore Art Forum.' },
    { year: '2024', desc: 'Định danh xưởng vẽ Cấp L3 & Cấp chứng thư số SHA-256 trên sàn Artisan Hub.' },
  ],
  past_hammer_records: [
    {
      id: 'past_1',
      title: 'Hoàng Hôn Sông Hồng',
      medium: 'Sơn dầu trên toan',
      year: 2023,
      hammer_price: 145000000,
      buyer_code: 'Nhà sưu tầm #8392 (Hà Nội)',
      closed_date: '15/10/2024',
      image: '/artwork_1.png',
      certificate_id: 'AH-CERT-8392-VN',
    },
    {
      id: 'past_2',
      title: 'Mùa Gặt Ven Đê',
      medium: 'Sơn mài trên gỗ',
      year: 2023,
      hammer_price: 88000000,
      buyer_code: 'Nhà sưu tầm #1049 (TP.HCM)',
      closed_date: '02/09/2024',
      image: '/artwork_2.png',
      certificate_id: 'AH-CERT-1049-VN',
    },
    {
      id: 'past_3',
      title: 'Hơi Thở Phố Cổ',
      medium: 'Tranh lụa truyền thống',
      year: 2022,
      hammer_price: 62000000,
      buyer_code: 'Nhà sưu tầm #5512 (Đà Nẵng)',
      closed_date: '24/06/2024',
      image: '/artwork_4.png',
      certificate_id: 'AH-CERT-5512-VN',
    },
  ],
};

const TAB_CONFIG = [
  { id: 'active', label: 'Đang đấu giá' },
  { id: 'past', label: 'Lịch sử gõ búa' },
  { id: 'available', label: 'Tác phẩm có sẵn' },
  { id: 'studio', label: 'Không gian xưởng vẽ' },
];

const ArtistDetailPage = ({ addToast, currentUser }) => {
  const { id } = useParams();

  // Find artist from mock database or fallback to primary artist
  const artistData = useMemo(() => {
    const found = USERS.find((u) => u.user_id === id && u.role === 'artist');
    return found || USERS.find((u) => u.role === 'artist') || USERS[1];
  }, [id]);

  const artistExtra = DEFAULT_ARTIST_EXTRA;

  // Find all artworks created by this artist
  const artistArtworks = useMemo(() => {
    const list = ARTWORKS.filter(
      (a) => a.artist_id === artistData.user_id || a.artist_name === artistData.full_name
    );
    // If empty in mock, return sample artworks
    return list.length > 0 ? list : ARTWORKS.slice(0, 4);
  }, [artistData]);

  // Tab State
  const [activeTab, setActiveTab] = useState('active');

  // SHA-256 Copy State (UX: 1-Click Copy with visual feedback)
  const [copiedHash, setCopiedHash] = useState(false);

  // Audio Voice Statement State (UX: Simulated Waveform & Playback)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(24); // 24s played demo

  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);

  // Sticky Floating Action Bar Visibility (Fitts's Law ergonomics)
  const [stickyVisible, setStickyVisible] = useState(false);

  // Commission Drawer State
  const [commissionOpen, setCommissionOpen] = useState(false);

  // Quick Room View Modal State
  const [roomViewArtwork, setRoomViewArtwork] = useState(null);

  // Texture Zoom State (Tab 4)
  const [textureZoom, setTextureZoom] = useState(1);

  // Track scroll position to show sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 340) {
        setStickyVisible(true);
      } else {
        setStickyVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Audio Progress Simulation (No autoplay, only when clicked)
  useEffect(() => {
    let interval = null;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= artistExtra.audio_duration) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, artistExtra.audio_duration]);

  // Handle 1-Click SHA-256 Copy
  const handleCopyHash = () => {
    navigator.clipboard?.writeText(artistExtra.hash_sha256);
    setCopiedHash(true);
    addToast?.(
      '✦ Đã sao chép mã băm định danh SHA-256 của Họa sĩ để tra cứu trên sổ cái!',
      'gold',
      4000
    );
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Handle Follow Toggle
  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      addToast?.(`✦ Đã theo dõi Họa sĩ ${artistData.full_name}! Bạn sẽ nhận thông báo khi có phiên đấu giá mới.`, 'gold');
    } else {
      addToast?.(`Đã bỏ theo dõi ${artistData.full_name}.`, 'info');
    }
  };

  // Filter Active Auctions vs Available Works
  const activeAuctions = useMemo(() => {
    return artistArtworks
      .map((art) => {
        const sess = AUCTION_SESSIONS.find((s) => s.artwork_id === art.artwork_id);
        return { artwork: art, session: sess };
      })
      .filter((item) => item.session && (item.session.status === 'live' || item.session.status === 'upcoming'));
  }, [artistArtworks]);

  return (
    <main className={styles.pageContainer}>
      {/* ===== BREADCRUMB ===== */}
      <div className={styles.breadcrumbWrap}>
        <div className="container">
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link to="/artists" className={styles.breadcrumbLink}>Họa sĩ xác thực</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbActive}>{artistData.full_name}</span>
          </nav>
        </div>
      </div>

      {/* ===== HERO SECTION (ABOVE-THE-FOLD TRUST & COGNITIVE IMPACT) ===== */}
      <section className={styles.heroSection}>
        <img
          src={artistExtra.studio_photos[0]}
          alt="Studio Background"
          className={styles.heroAmbientBg}
          loading="lazy"
        />

        <div className="container">
          <div className={styles.heroContent}>
            {/* Top Identity Row */}
            <div className={styles.heroMainRow}>
              <div className={styles.artistIdentity}>
                {/* Avatar with Verified L3 Studio Badge */}
                <div className={styles.avatarWrapper}>
                  <img
                    src={artistData.avatar || '/artist_avatar.png'}
                    alt={artistData.full_name}
                    className={styles.avatarImg}
                  />
                  <div className={styles.onlinePulseDot} title="Họa sĩ đang trực tuyến tại Studio" />
                  <div className={styles.avatarBadgeL3} title="Định danh xưởng vẽ Cấp L3">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                {/* Identity & Studio Address */}
                <div className={styles.identityText}>
                  <div className={styles.identityBadgeRow}>
                    <span className={styles.l3Badge}>
                      <ShieldCheck size={13} /> XƯỞNG VẼ ĐỊNH DANH L3
                    </span>
                    <span className={styles.curatorBadge}>
                      <Award size={13} /> HỘI VIÊN MỸ THUẬT VN
                    </span>
                  </div>

                  <h1 className={styles.artistFullName}>{artistData.full_name}</h1>

                  <p className={styles.studioAddressRow}>
                    <MapPin size={14} color="#D4AF37" />
                    <span>{artistData.studio_address || '12 Ngõ Hàng Bông, Hoàn Kiếm, Hà Nội'}</span>
                  </p>

                  {/* SHA-256 Hash 1-Click Copy */}
                  <div className={styles.hashRow}>
                    <button
                      type="button"
                      className={styles.hashBadge}
                      onClick={handleCopyHash}
                      title="Nhấp để sao chép mã băm giám định SHA-256"
                      aria-label="Sao chép mã SHA-256"
                    >
                      <span className={styles.hashLabel}>Mã định danh SHA-256:</span>
                      <code className={styles.hashCode}>
                        {artistExtra.hash_sha256.slice(0, 10)}...{artistExtra.hash_sha256.slice(-8)}
                      </code>
                      {copiedHash ? (
                        <Check size={14} className={styles.copyIconSuccess} />
                      ) : (
                        <Copy size={14} color="#D4AF37" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Hero Action CTAs (Fitts's Law Thumb-Friendly Target) */}
              <div className={styles.heroActions}>
                <button
                  type="button"
                  id="btn-hero-commission"
                  className={`btn btn-primary ${styles.heroCommissionBtn}`}
                  onClick={() => setCommissionOpen(true)}
                >
                  <Sparkles size={16} />
                  Ủy thác sáng tác
                </button>

                <button
                  type="button"
                  id="btn-hero-follow"
                  className={`btn ${isFollowing ? 'btn-secondary' : 'btn-ghost'} ${styles.heroFollowBtn}`}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={16} color="#D4AF37" />
                      Đang theo dõi
                    </>
                  ) : (
                    <>
                      <Heart size={16} />
                      Theo dõi
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="btn-hero-share"
                  className={`btn btn-ghost btn-icon ${styles.heroShareBtn}`}
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    addToast?.('Đã sao chép liên kết hồ sơ họa sĩ!', 'info');
                  }}
                  title="Chia sẻ hồ sơ"
                  aria-label="Chia sẻ hồ sơ"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* 3 Above-The-Fold Trust Anchors / Market KPI Cards */}
            <div className={styles.kpiGrid}>
              {/* Anchor 1: Tác phẩm tiêu biểu */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiTop}>
                  <span className={styles.kpiLabel}>Tác phẩm tiêu biểu</span>
                  <Trophy size={16} className={styles.kpiIcon} />
                </div>
                <h4 className={styles.kpiVal}>{artistExtra.highlight_work}</h4>
                <p className={styles.kpiSub}>{artistExtra.highlight_award}</p>
              </div>

              {/* Anchor 2: Chỉ số thanh khoản (Kỷ lục gõ búa) */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiTop}>
                  <span className={styles.kpiLabel}>Kỷ lục gõ búa cao nhất</span>
                  <Zap size={16} className={styles.kpiIcon} />
                </div>
                <h4 className={styles.kpiVal}>{formatPriceFull(artistExtra.record_hammer_price)}</h4>
                <p className={styles.kpiSub}>Giao dịch bảo chứng qua Hợp đồng Escrow</p>
              </div>

              {/* Anchor 3: Tỷ lệ thanh khoản */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiTop}>
                  <span className={styles.kpiLabel}>Tỷ lệ thanh khoản thành công</span>
                  <ShieldCheck size={16} className={styles.kpiIcon} />
                </div>
                <h4 className={styles.kpiVal}>{artistExtra.clearance_rate}</h4>
                <p className={styles.kpiSub}>{artistExtra.total_settled} đã chuyển nhượng</p>
              </div>
            </div>

            {/* Audio Voice Statement Player (Simulated Waveform) */}
            <div className={styles.audioStatementCard}>
              <div className={styles.audioLeft}>
                <button
                  type="button"
                  id="btn-toggle-artist-audio"
                  className={styles.audioPlayBtn}
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  aria-label={isPlayingAudio ? 'Tạm dừng tuyên ngôn' : 'Nghe tuyên ngôn nghệ sĩ'}
                >
                  {isPlayingAudio ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
                </button>

                <div className={styles.audioTitleWrap}>
                  <p className={styles.audioTitle}>Tuyên ngôn nghệ thuật từ Họa sĩ (Audio Voice Statement)</p>
                  <p className={styles.audioSubtitle}>"{artistExtra.audio_quote}"</p>
                </div>
              </div>

              {/* Waveform Pulse Animation */}
              <div className={styles.waveformWrap} aria-hidden="true">
                {[14, 22, 10, 26, 18, 12, 28, 20, 16, 24, 12, 28, 16, 22, 10, 26, 18, 14, 20, 12].map(
                  (h, i) => (
                    <div
                      key={i}
                      className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarPlaying : ''}`}
                      style={{
                        height: `${h}px`,
                        animationDelay: `${(i * 0.08).toFixed(2)}s`,
                      }}
                    />
                  )
                )}
              </div>

              {/* Duration Time */}
              <span className={styles.audioTime}>
                {Math.floor(audioProgress / 60)}:{String(audioProgress % 60).padStart(2, '0')} / 1:15
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4-TAB NAVIGATION (MINIMAL CURATORIAL) ===== */}
      <div className="container">
        <nav className={styles.tabsNav} role="tablist">
          {TAB_CONFIG.map((tab) => {
            const count =
              tab.id === 'active'
                ? activeAuctions.length
                : tab.id === 'past'
                ? artistExtra.past_hammer_records.length
                : tab.id === 'available'
                ? artistArtworks.length
                : null;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`artist-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                {count !== null && <span className={styles.tabBadgeCount}>{count}</span>}
              </button>
            );
          })}
        </nav>

        {/* ===== TAB CONTENTS ===== */}
        <div className={styles.tabContentArea}>
          {/* TAB 1: ĐANG ĐẤU GIÁ (ACTIVE AUCTIONS) */}
          {activeTab === 'active' && (
            <div className={styles.auctionsGrid}>
              {activeAuctions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#948E85' }}>
                  <Clock size={36} color="#D4AF37" style={{ marginBottom: 12 }} />
                  <h3>Hiện tại Họa sĩ chưa có phiên đấu giá nào đang mở</h3>
                  <p>Bạn có thể gửi yêu cầu Ủy thác sáng tác độc bản hoặc xem các tác phẩm có sẵn.</p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 16 }}
                    onClick={() => setCommissionOpen(true)}
                  >
                    Ủy thác sáng tác ngay
                  </button>
                </div>
              ) : (
                activeAuctions.map(({ artwork, session }) => (
                  <ActiveAuctionCard
                    key={artwork.artwork_id}
                    artwork={artwork}
                    session={session}
                  />
                ))
              )}
            </div>
          )}

          {/* TAB 2: LỊCH SỬ GÕ BÚA (PAST HAMMER PRICES) */}
          {activeTab === 'past' && (
            <div className={styles.pastHammerTableCard}>
              <div className={styles.tableHeaderRow}>
                <div>Tác phẩm</div>
                <div>Thông tin chi tiết</div>
                <div>Giá chốt gõ búa</div>
                <div>Nhà sưu tầm bảo mật</div>
                <div>Ngày chốt phiên</div>
                <div>Bảo chứng</div>
              </div>

              {artistExtra.past_hammer_records.map((record) => (
                <div key={record.id} className={styles.tableBodyRow}>
                  <img src={record.image} alt={record.title} className={styles.tableThumb} loading="lazy" />
                  <div>
                    <h5 className={styles.tableTitleMain}>{record.title}</h5>
                    <p className={styles.tableMediumSub}>
                      {record.medium} · Sáng tác năm {record.year}
                    </p>
                  </div>
                  <div>
                    <span className={styles.hammerPriceVal}>
                      {formatPriceFull(record.hammer_price)}
                    </span>
                  </div>
                  <div>
                    <span className={styles.anonymizedBuyer}>
                      <ShieldCheck size={13} color="#2ECC71" />
                      {record.buyer_code}
                    </span>
                  </div>
                  <div style={{ color: '#948E85', fontSize: '0.8rem' }}>
                    {record.closed_date}
                  </div>
                  <div>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                      COA Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TÁC PHẨM CÓ SẴN (AVAILABLE COLLECTION) */}
          {activeTab === 'available' && (
            <div className={styles.collectionGrid}>
              {artistArtworks.map((artwork) => (
                <AvailableArtworkCard
                  key={artwork.artwork_id}
                  artwork={artwork}
                  onQuickLook={(art) => setRoomViewArtwork(art)}
                />
              ))}
            </div>
          )}

          {/* TAB 4: KHÔNG GIAN XƯỞNG VẼ (STUDIO FOOTAGE & PROCESS) */}
          {activeTab === 'studio' && (
            <div className={styles.studioSection}>
              {/* Studio Story & Photos */}
              <div className={styles.studioStoryGrid}>
                <div className={styles.studioBioBox}>
                  <h3 className={styles.studioBioTitle}>Triết lý sáng tác & Hành trình nghệ thuật</h3>
                  <p className={styles.studioBioParagraph}>
                    {artistData.artist_bio ||
                      'Họa sĩ sơn dầu & lụa với hơn 12 năm gắn bó cùng toan vẽ. Tác phẩm phản ánh sự giao thoa giữa mỹ thuật truyền thống Á Đông và nhịp đập đương đại.'}
                  </p>

                  <h4 style={{ color: '#F2EEE8', fontSize: '0.95rem', margin: '20px 0 10px' }}>
                    Dấu ấn triển lãm & Giải thưởng
                  </h4>
                  <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, color: '#B8B0A0', fontSize: '0.84rem' }}>
                    {artistExtra.education_timeline.map((item, idx) => (
                      <li key={idx}>
                        <strong style={{ color: '#D4AF37' }}>{item.year}:</strong> {item.desc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.studioPhotoGrid}>
                  {artistExtra.studio_photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Không gian xưởng vẽ ${i + 1}`}
                      className={styles.studioPhoto}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>

              {/* Impasto Texture Zoom Box */}
              <div className={styles.textureViewerCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-brand, serif)', margin: '0 0 4px', color: '#F2EEE8' }}>
                      Cận cảnh vệt cọ nổi (Impasto Texture Exploration)
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#948E85' }}>
                      Kiểm tra độ dày lớp sơn, kết cấu toan vải và kỹ thuật tạo khối độc bản của Họa sĩ
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3].map((z) => (
                      <button
                        key={z}
                        className={`btn btn-sm ${textureZoom === z ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTextureZoom(z)}
                      >
                        Phóng đại ×{z}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.textureWrap}>
                  <img
                    src={artistArtworks[0]?.texture_map_url || artistArtworks[0]?.image || '/artwork_1.png'}
                    alt="Impasto Texture"
                    className={styles.textureImg}
                    style={{ transform: `scale(${textureZoom})`, transformOrigin: 'center center' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== STICKY FLOATING ACTION BAR (FITTS'S LAW MOBILE ERGONOMICS) ===== */}
      {/* <aside
        className={`${styles.stickyBottomBar} ${stickyVisible ? styles.stickyBottomBarVisible : ''}`}
        aria-label="Thanh hành động nhanh"
      >
        <div className="container">
          <div className={styles.stickyBarContent}>
            <div className={styles.stickyBarLeft}>
              <img
                src={artistData.avatar || '/artist_avatar.png'}
                alt={artistData.full_name}
                className={styles.stickyBarAvatar}
              />
              <div>
                <h5 className={styles.stickyBarArtistName}>{artistData.full_name}</h5>
                <p className={styles.stickyBarStatus}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#2ECC71' }} />
                  Nhận ủy thác sáng tác (Q4/2024)
                </p>
              </div>
            </div>

            <div className={styles.stickyBarActions}>
              <button
                type="button"
                id="btn-sticky-commission"
                className="btn btn-primary"
                onClick={() => setCommissionOpen(true)}
              >
                <Sparkles size={15} />
                Ủy thác sáng tác
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setActiveTab('active');
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
              >
                Xem các phiên mở
              </button>
            </div>
          </div>
        </div>
      </aside> */}

      {/* ===== FRICTIONLESS COMMISSION DRAWER ===== */}
      {commissionOpen && (
        <CommissionDrawer
          artist={artistData}
          onClose={() => setCommissionOpen(false)}
          addToast={addToast}
        />
      )}

      {/* ===== QUICK ROOM VIEW MODAL ===== */}
      {roomViewArtwork && (
        <QuickRoomViewModal
          artwork={roomViewArtwork}
          onClose={() => setRoomViewArtwork(null)}
        />
      )}
    </main>
  );
};

/* ============================================================
   SUB-COMPONENT: ACTIVE AUCTION CARD (WITH TICKING COUNTDOWN)
   ============================================================ */
const ActiveAuctionCard = ({ artwork, session }) => {
  const [countdown, setCountdown] = useState(session ? formatCountdown(session.end_time) : null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!session) return;
    const iv = setInterval(() => {
      setCountdown(formatCountdown(session.end_time));
    }, 1000);
    return () => clearInterval(iv);
  }, [session]);

  const urgent = countdown && countdown.total < 3600000; // Under 60 mins turns urgent red

  return (
    <article className={`${styles.auctionCard} ${urgent ? styles.urgentAuctionCard : ''}`}>
      <div className={styles.auctionImgWrap}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        <img
          src={artwork.image}
          alt={artwork.title}
          className={styles.auctionImg}
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        <div className={styles.auctionBadgeOverlay}>
          {session?.auction_type === 'sealed' ? (
            <span className="badge badge-gold">✦ PHIÊN KÍN</span>
          ) : (
            <span className="badge badge-live">● ĐANG LIVE</span>
          )}
          <span className="badge badge-verified">Độc bản</span>
        </div>
      </div>

      <div className={styles.auctionBody}>
        <h3 className={styles.auctionTitle}>{artwork.title}</h3>
        <p className={styles.auctionMeta}>
          {artwork.medium} · {artwork.dimensions}
        </p>

        {/* Real-time countdown timer */}
        {countdown && (
          <div className={`${styles.countdownClock} ${urgent ? styles.countdownUrgent : ''}`}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} color={urgent ? '#FF4757' : '#D4AF37'} />
              {urgent ? 'KHẨN CẤP: Sắp kết thúc' : 'Thời gian còn lại:'}
            </span>
            <span className={styles.countdownDigits}>
              {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
            </span>
          </div>
        )}

        <div className={styles.auctionPriceRow}>
          <div>
            <p className={styles.currentBidLabel}>Giá cao nhất hiện tại</p>
            <p className={styles.currentBidAmount}>
              {formatPriceFull(session?.current_highest_price || artwork.current_price)}
            </p>
          </div>
          <div>
            <p className={styles.stepHint}>
              Bước giá: +{formatPrice(session?.bid_increment || 500000)}
            </p>
          </div>
        </div>

        <Link
          to={`/artwork/${artwork.artwork_id}`}
          className={`btn btn-primary ${styles.bidCTAButton}`}
        >
          <Zap size={15} />
          Vào phòng đấu giá ngay
        </Link>
      </div>
    </article>
  );
};

/* ============================================================
   SUB-COMPONENT: AVAILABLE ARTWORK CARD
   ============================================================ */
const AvailableArtworkCard = ({ artwork, onQuickLook }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article className={styles.auctionCard}>
      <div className={styles.auctionImgWrap}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        <img
          src={artwork.image}
          alt={artwork.title}
          className={styles.auctionImg}
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        <div className={styles.auctionBadgeOverlay}>
          <span className="badge badge-gold">Tác phẩm có sẵn</span>
        </div>
      </div>

      <div className={styles.auctionBody}>
        <h3 className={styles.auctionTitle}>{artwork.title}</h3>
        <p className={styles.auctionMeta}>
          {artwork.medium} · {artwork.dimensions} · {artwork.creation_year}
        </p>

        <div className={styles.auctionPriceRow}>
          <div>
            <p className={styles.currentBidLabel}>Giá niêm yết sở hữu</p>
            <p className={styles.currentBidAmount}>{formatPriceFull(artwork.current_price)}</p>
          </div>
          <div>
            <button
              type="button"
              className={`btn btn-ghost ${styles.roomViewTriggerBtn}`}
              onClick={() => onQuickLook(artwork)}
              title="Ướm tranh lên tường thử"
            >
              <Eye size={13} />
              Ướm phòng
            </button>
          </div>
        </div>

        <Link
          to={`/artwork/${artwork.artwork_id}`}
          className="btn btn-secondary"
          style={{ width: '100%', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          Xem chi tiết <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
};

/* ============================================================
   SUB-COMPONENT: FRICTIONLESS COMMISSION DRAWER
   ============================================================ */
const CommissionDrawer = ({ artist, onClose, addToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Phong cảnh trừu tượng',
    dimension: '80 × 120 cm',
    budget: '50.000.000',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validate form inline
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Vui lòng nhập họ và tên của bạn.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Vui lòng cung cấp số điện thoại để họa sĩ liên hệ.';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      errs.phone = 'Số điện thoại không đúng định dạng Việt Nam.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Vui lòng nhập email nhận bản thảo.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Địa chỉ email không hợp lệ.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      addToast?.(
        `✦ Đã gửi yêu cầu ủy thác sáng tác thành công tới Họa sĩ ${artist.full_name}! Studio sẽ liên hệ lại trong vòng 24 giờ.`,
        'gold',
        6000
      );
      onClose();
    }, 900);
  };

  return (
    <div
      className={styles.drawerBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.drawerPanel}>
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div>
            <h3 className={styles.drawerTitle}>Ủy thác sáng tác độc bản</h3>
            <p className={styles.drawerSubtitle}>
              Gửi yêu cầu tới Họa sĩ {artist.full_name} · Tiếp nhận đơn đặt hàng độc quyền
            </p>
          </div>
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={onClose}
            disabled={submitting}
            aria-label="Đóng bảng ủy thác"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className={styles.drawerBody}>
          {/* 3-Step Transparent Process Banner */}
          <div className={styles.stepBanner}>
            <div className={styles.stepItem}>
              <span className={styles.stepNum}>1</span>
              <span>Ý tưởng & Kích thước</span>
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.stepItem}>
              <span className={styles.stepNum}>2</span>
              <span>Phác thảo & Báo giá</span>
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.stepItem}>
              <span className={styles.stepNum}>3</span>
              <span>Ký quỹ Escrow 100%</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.commissionForm}>
            {/* Họ và tên */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Họ và tên Nhà sưu tầm *</label>
              <input
                type="text"
                className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
                placeholder="VD: Nguyễn Văn An"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <p className={styles.fieldErrorText}>
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* SĐT & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Số điện thoại *</label>
                <input
                  type="tel"
                  className={`${styles.formInput} ${errors.phone ? styles.formInputError : ''}`}
                  placeholder="0912 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && (
                  <p className={styles.fieldErrorText}>
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email nhận phác thảo *</label>
                <input
                  type="email"
                  className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
                  placeholder="collector@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && (
                  <p className={styles.fieldErrorText}>
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Chủ đề & Kích thước */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Chủ đề mong muốn</label>
                <select
                  className={styles.formSelect}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Phong cảnh trừu tượng">Phong cảnh trừu tượng</option>
                  <option value="Chân dung gia đình">Chân dung sơn dầu</option>
                  <option value="Tĩnh vật & Hoa sen">Tĩnh vật & Hoa sen</option>
                  <option value="Biển đảo & Quê hương">Biển đảo & Quê hương</option>
                  <option value="Phong thủy kiến trúc">Phong thủy kiến trúc</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kích thước dự kiến</label>
                <select
                  className={styles.formSelect}
                  value={formData.dimension}
                  onChange={(e) => setFormData({ ...formData, dimension: e.target.value })}
                >
                  <option value="60 × 80 cm">60 × 80 cm</option>
                  <option value="80 × 120 cm">80 × 120 cm</option>
                  <option value="100 × 150 cm">100 × 150 cm</option>
                  <option value="120 × 200 cm">120 × 200 cm (Đại sảnh)</option>
                </select>
              </div>
            </div>

            {/* Ngân sách dự kiến */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ngân sách đầu tư dự kiến (VNĐ)</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="VD: 50.000.000 VNĐ"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>

            {/* Yêu cầu đặc biệt */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ghi chú chi tiết về không gian treo tranh</label>
              <textarea
                className={styles.formTextarea}
                rows={3}
                placeholder="Mô tả phong cách nội thất, hướng ánh sáng, mong muốn màu sắc chủ đạo..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Escrow Guarantee Notice */}
            <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: '#B8B0A0', lineHeight: 1.5 }}>
              <ShieldCheck size={14} color="#D4AF37" style={{ display: 'inline', marginRight: 6 }} />
              <strong>Chính sách Artisan Escrow:</strong> Bạn chỉ thanh toán khi đã duyệt phác thảo ưng ý. Tiền cọc được khóa bảo chứng trong ví 72h cho tới khi nhận tranh thực tế.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary ${styles.submitCommissionBtn}`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="spinner" />
                  Đang chuyển tiếp tới Studio...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Gửi yêu cầu ủy thác sáng tác
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SUB-COMPONENT: QUICK ROOM VIEW MODAL (IN-PAGE PREVIEW)
   ============================================================ */
const QuickRoomViewModal = ({ artwork, onClose }) => {
  return (
    <div
      className={styles.quickLookBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.quickLookModal}>
        <div className={styles.quickLookHeader}>
          <div>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-brand, serif)', color: '#F2EEE8' }}>
              Mô phỏng ướm tranh thực tế (Room View 1:1)
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#948E85' }}>
              {artwork.title} · {artwork.dimensions} · Tỷ lệ chuẩn phòng khách
            </p>
          </div>
          <button
            type="button"
            className="btn btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.quickLookPreview}>
          <img
            src={artwork.image}
            alt={artwork.title}
            className={styles.quickLookArtwork}
          />
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#101014' }}>
          <span style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600 }}>
            {formatPriceFull(artwork.current_price)}
          </span>
          <Link
            to={`/artwork/${artwork.artwork_id}`}
            className="btn btn-primary btn-sm"
          >
            Xem trang chi tiết tác phẩm <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailPage;
