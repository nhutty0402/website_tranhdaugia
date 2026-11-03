import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, Package, Award, Clock, Shield, ArrowRight,
  CheckCircle, Download, QrCode, ExternalLink, Lock,
  PlusCircle, LayoutDashboard, Trophy, MessageSquare, AlertCircle, TrendingUp, LogOut, Palette,
  ShieldAlert, CheckCircle2, RotateCcw, Settings as SettingsIcon, UserCog,
  Truck, Copy, Check, Search, Filter, Receipt, FileText, ChevronRight, Eye, ShieldCheck, MapPin, Phone, CreditCard, Sparkles, Printer, X
} from 'lucide-react';
import {
  ARTWORKS, AUCTION_SESSIONS, BID_HISTORY, CERTIFICATES,
  ESCROW_ORDERS, formatPrice, formatPriceFull
} from '../data/mockData';
import CreateAuctionModal from '../components/CreateAuctionModal';
import ArtistSessionDashboardModal from '../components/ArtistSessionDashboardModal';
import SealedBidModal from '../components/SealedBidModal';
import UploadArtworkModal from '../components/UploadArtworkModal';
import ConfirmDeliveryModal from '../components/ConfirmDeliveryModal';
import ReportIssueModal from '../components/ReportIssueModal';
import styles from './ProfilePage.module.css';

const PROFILE_TABS = [
  'Bộ sưu tập',
  'Phiên của tôi',
  'Quản lý tác phẩm',
  'Đơn hàng & Ký quỹ',
  'Chứng chỉ số',
  'Cài đặt'
];

const ProfilePage = ({ currentUser, addToast, onLogout, onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCertTarget, setSelectedCertTarget] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    if (location.state?.tab) return location.state.tab;
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'orders' || params.get('tab') === 'don-hang') return 'Đơn hàng & Ký quỹ';
    return 'Phiên của tôi';
  });

  React.useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      if (location.state?.targetCert || location.state?.artworkId) {
        setSelectedCertTarget(location.state.targetCert || location.state);
      }
    }
  }, [location.state]);
  const [createAuctionOpen, setCreateAuctionOpen] = useState(false);
  const [uploadArtworkOpen, setUploadArtworkOpen] = useState(false);
  const [artworksVersion, setArtworksVersion] = useState(0);
  const [dashboardSession, setDashboardSession] = useState(null);
  const [raiseBidSession, setRaiseBidSession] = useState(null);

  if (!currentUser) {
    return (
      <div className={styles.notLoggedIn}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(197, 160, 89, 0.1)',
          border: '1px solid rgba(197, 160, 89, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold-primary)',
          boxShadow: '0 0 28px rgba(197, 160, 89, 0.15)',
          marginBottom: 8
        }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontFamily: "var(--font-brand, 'Playfair Display', serif)", fontSize: '1.6rem' }}>
          Hồ Sơ & Bộ Sưu Tập Cá Nhân
        </h2>
        <p style={{ maxWidth: 480, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Vui lòng đăng nhập để xem và quản lý bộ sưu tập theo dõi, phiên đấu giá kín, đơn hàng ký quỹ Escrow 72h và chứng chỉ số SHA-256 của bạn.
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: 12 }}
          onClick={onLoginClick}
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 80 }}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className="container">
          <div className={styles.profileHero}>
            <div className={styles.avatarWrap}>
              <img src={currentUser.avatar} alt={currentUser.full_name} className={styles.avatar} />
              <div className={styles.avatarBadge}>
                <CheckCircle size={14} />
              </div>
            </div>
            <div className={styles.profileInfo}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h1 className={styles.profileName}>{currentUser.full_name}</h1>
                <span className="badge badge-verified">
                  <Shield size={10} /> {currentUser.role === 'artist' ? 'Họa sĩ xác thực' : 'Nhà sưu tầm (Collector)'}
                </span>
                <span className="badge badge-gold">
                  Cấp L{currentUser.kyc_level || 3} eKYC
                </span>
              </div>
              <p className={styles.profileUsername}>@{currentUser.username}</p>
              <div className={styles.profileStats}>
                {[
                  { value: '2', label: 'Tác phẩm sở hữu' },
                  { value: '4', label: 'Phiên tham gia (Kín & Live)' },
                  { value: '₫57.5M', label: 'Tổng giá trị sưu tầm' },
                ].map(({ value, label }) => (
                  <div key={label} className={styles.profileStat}>
                    <span className={styles.profileStatVal}>{value}</span>
                    <span className={styles.profileStatLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.profileHeroActions}>
              {currentUser.role === 'artist' && (
                <>
                  <button
                    id="profile-upload-artwork-btn"
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: 'var(--border-gold)' }}
                    onClick={() => setUploadArtworkOpen(true)}
                  >
                    <Palette size={16} color="var(--gold-primary)" /> Đăng tác phẩm mới
                  </button>
                  <button
                    id="profile-create-auction-btn"
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={() => setCreateAuctionOpen(true)}
                  >
                    <PlusCircle size={16} /> Tạo phiên đấu giá
                  </button>
                </>
              )}
              {/* <button
                id="profile-logout-hero-btn"
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderColor: 'rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                }}
                onClick={() => {
                  onLogout?.();
                  navigate('/');
                }}
              >
                <LogOut size={16} /> Đăng xuất
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Tabs */}
        <div className={styles.tabs} style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 6 }}>
          {PROFILE_TABS.map(tab => (
            <button
              key={tab}
              id={`profile-tab-${tab.replace(/\s/g, '-')}`}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'Bộ sưu tập' && <CollectionTab addToast={addToast} />}
        {activeTab === 'Phiên của tôi' && (
          <MyAuctionsTab
            currentUser={currentUser}
            onRaiseBid={(sess, existingBid, artwork) => {
              setRaiseBidSession({ session: sess, existingBid, artwork });
            }}
            addToast={addToast}
          />
        )}
        {activeTab === 'Quản lý tác phẩm' && (
          <ArtistArtworkManagementTab
            currentUser={currentUser}
            onOpenCreate={() => setCreateAuctionOpen(true)}
            onOpenUpload={() => setUploadArtworkOpen(true)}
            onOpenDashboard={(sess) => setDashboardSession(sess)}
            artworksVersion={artworksVersion}
            addToast={addToast}
          />
        )}
        {activeTab === 'Đơn hàng & Ký quỹ' && (
          <OrdersAndEscrowTab
            addToast={addToast}
            onViewCertificates={(certTarget) => {
              setSelectedCertTarget(certTarget);
              setActiveTab('Chứng chỉ số');
            }}
            highlightOrderId={location.state?.highlightOrderId}
          />
        )}
        {activeTab === 'Chứng chỉ số' && (
          <CertificatesTab
            addToast={addToast}
            selectedCertTarget={selectedCertTarget}
            currentUser={currentUser}
            onNavigateToArtwork={(artId) => navigate(`/artwork/${artId}?owned=true`, { state: { isOwned: true } })}
            onNavigateToOrders={() => setActiveTab('Đơn hàng & Ký quỹ')}
          />
        )}
        {activeTab === 'Cài đặt' && (
          <SettingsTab
            user={currentUser}
            addToast={addToast}
            onLogout={onLogout}
            navigate={navigate}
          />
        )}
      </div>

      {/* Upload Artwork Modal (Task 4) */}
      {uploadArtworkOpen && (
        <UploadArtworkModal
          currentUser={currentUser}
          onClose={() => setUploadArtworkOpen(false)}
          onSuccess={(newArtwork) => {
            setArtworksVersion(v => v + 1);
          }}
          addToast={addToast}
        />
      )}

      {/* Create Auction Modal */}
      {createAuctionOpen && (
        <CreateAuctionModal
          currentUser={currentUser}
          onClose={() => setCreateAuctionOpen(false)}
          onSuccess={(newSession) => {
            AUCTION_SESSIONS.unshift(newSession);
            addToast(`✦ Tạo phiên đấu giá thành công cho phiên ${newSession.session_id}!`, 'gold');
          }}
        />
      )}

      {/* Artist Dashboard Modal */}
      {dashboardSession && (
        <ArtistSessionDashboardModal
          session={dashboardSession}
          artwork={ARTWORKS.find(a => a.artwork_id === dashboardSession.artwork_id) || ARTWORKS[0]}
          bids={BID_HISTORY.filter(b => b.session_id === dashboardSession.session_id)}
          onClose={() => setDashboardSession(null)}
          onContactWinner={(sid, bid) => {
            dashboardSession.winner_contacted_at = new Date().toISOString();
          }}
          onCreateEscrow={(sess, art, bid) => {
            addToast(`✦ Đã chuyển sang tạo đơn Escrow bảo chứng cho tác phẩm "${art.title}"!`, 'gold');
            setActiveTab('Đơn hàng & Ký quỹ');
          }}
          onEndSessionNow={(sid) => {
            dashboardSession.status = 'ended';
          }}
          addToast={addToast}
        />
      )}

      {/* Sealed Bid / Raise Bid Modal (Flow 4) */}
      {raiseBidSession && (
        <SealedBidModal
          session={raiseBidSession.session}
          artwork={raiseBidSession.artwork}
          existingBid={raiseBidSession.existingBid}
          currentUser={currentUser}
          onClose={() => setRaiseBidSession(null)}
          onSubmitBid={(bidData) => {
            // Update or prepend bid in BID_HISTORY
            const found = BID_HISTORY.find(b => b.session_id === raiseBidSession.session.session_id && b.bidder_id === currentUser.user_id);
            if (found) {
              found.bid_amount = bidData.bid_amount;
              found.last_raised_at = new Date().toISOString();
              if (bidData.note) found.notes = bidData.note;
            } else {
              BID_HISTORY.unshift({
                bid_id: `sb_${Date.now()}`,
                session_id: raiseBidSession.session.session_id,
                bidder_id: currentUser.user_id,
                bidder_name: currentUser.full_name,
                bid_amount: bidData.bid_amount,
                placed_at: new Date().toISOString(),
                is_auto_bid: false,
                status: 'submitted',
                is_visible_to_public: false,
                last_raised_at: new Date().toISOString(),
                notes: bidData.note,
              });
            }
            addToast(`✦ Đã tăng giá kín thành công lên ${formatPriceFull(bidData.bid_amount)}!`, 'gold', 5000);
          }}
        />
      )}
    </main>
  );
};


/* ===== OWNED ARTWORK DETAILS MODAL (COLLECTION TAB) ===== */
const OwnedArtworkModal = ({ artwork, onClose, addToast }) => {
  if (!artwork) return null;

  return (
    <div className={styles.invoiceModalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.invoiceModalBox} style={{ maxWidth: 720 }}>
        {/* Header */}
        <div className={styles.invoiceHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-verified" style={{ background: 'rgba(46,204,113,0.18)', color: '#2ECC71', border: '1px solid rgba(46,204,113,0.4)', fontWeight: 600 }}>
                <CheckCircle2 size={12} /> BẠN ĐÃ SỞ HỮU
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                ✦ Độc bản 1/1
              </span>
            </div>
            <h3 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              {artwork.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gold-light)' }}>
              bởi Họa sĩ <strong>{artwork.artist_name}</strong>
            </p>
          </div>
          <button
            className="btn btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Đóng"
            style={{ borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Image */}
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#000' }}>
            <img src={artwork.image} alt={artwork.title} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
          </div>

          {/* Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Kích thước chuẩn:</span>
                <strong>{artwork.dimensions}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Chất liệu & Kỹ thuật:</span>
                <strong>{artwork.medium}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Năm sáng tác:</span>
                <strong>{artwork.creation_year}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Phong cách mỹ thuật:</span>
                <strong>{artwork.style || 'Trừu tượng / Đương đại'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Quy cách bảo tồn:</span>
                <span style={{ color: 'var(--text-primary)', textAlign: 'right' }}>Khung sồi tự nhiên, kính lọc 99% UV</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tình trạng vật lý:</span>
                <span style={{ color: '#2ECC71', fontWeight: 600 }}>Hoàn hảo (100% Mint)</span>
              </div>
            </div>

            {/* Curator note */}
            {artwork.curator_statement && (
              <div style={{
                background: 'rgba(212, 175, 55, 0.04)',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: '0.78rem'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--gold-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Award size={14} /> Ý niệm sáng tác của Họa sĩ
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{artwork.curator_statement}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Proof info */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 12,
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: '0.76rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Chứng chỉ số SHA-256:</span>{' '}
            <strong style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>AH-CERT-2024-0042</strong>
          </div>
          <span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>
            Bảo chứng bản quyền trọn đời
          </span>
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => addToast?.('✦ Đã tải tài liệu hồ sơ thẩm định tác phẩm (PDF)!', 'success')}
          >
            <Download size={14} /> Tải hồ sơ giám định (PDF)
          </button>
          <Link
            to={`/artwork/${artwork.artwork_id}?owned=true`}
            state={{ isOwned: true }}
            className="btn btn-secondary"
          >
            <Eye size={14} /> Mở trang chi tiết 3D & Vệt cọ
          </Link>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const CollectionTab = ({ addToast }) => {
  const ownedArtworks = ARTWORKS.slice(0, 2);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  return (
    <div className={styles.tabContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 className={styles.tabTitle} style={{ margin: '0 0 6px' }}>Bộ sưu tập của tôi</h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Danh sách tác phẩm nghệ thuật độc bản bạn đã mua và sở hữu toàn quyền. Xem thông số chi tiết, nguồn gốc xuất xứ và thẻ chứng nhận số SHA-256.
          </p>
        </div>
        <span className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          👑 {ownedArtworks.length} Tác phẩm sở hữu
        </span>
      </div>

      <div className={styles.collectionGrid}>
        {ownedArtworks.map(artwork => (
          <div key={artwork.artwork_id} className={styles.collectionCard}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img src={artwork.image} alt={artwork.title} className={styles.collectionImg} />
              <span className="badge badge-verified" style={{ position: 'absolute', top: 12, left: 12, backdropFilter: 'blur(8px)', background: 'rgba(46,204,113,0.85)', color: '#fff', border: 'none', fontWeight: 600 }}>
                <CheckCircle2 size={11} /> Đã sở hữu
              </span>
              <span className="badge badge-gold" style={{ position: 'absolute', top: 12, right: 12 }}>
                Độc bản
              </span>
            </div>
            <div className={styles.collectionInfo}>
              <h3 className={styles.collectionTitle}>{artwork.title}</h3>
              <p className={styles.collectionArtist}>bởi <strong>{artwork.artist_name}</strong></p>
              <p className={styles.collectionMeta}>{artwork.medium} · {artwork.dimensions} · {artwork.creation_year}</p>
              <div className={styles.collectionFooter}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Giá trị định giá: <strong style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>{formatPrice(artwork.current_price)}</strong>
                </span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {/* <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedArtwork(artwork)}
                    title="Xem nhanh thông tin tác phẩm đã sở hữu"
                  >
                    <Eye size={12} /> Xem nhanh
                  </button> */}
                  <Link
                    to={`/artwork/${artwork.artwork_id}?owned=true`}
                    state={{ isOwned: true }}
                    className="btn btn-secondary btn-sm"
                    title="Xem chi tiết đầy đủ sản phẩm đã sở hữu"
                  >
                    Chi tiết <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Owned Artwork Quick View Modal */}
      {selectedArtwork && (
        <OwnedArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          addToast={addToast}
        />
      )}
    </div>
  );
};

/* ===== 8.6 MÀN HÌNH 4: Phiên của tôi (Collector - Flow 4) ===== */
const MyAuctionsTab = ({ currentUser, onRaiseBid, addToast }) => {
  // Find sessions user placed bids on or mock participant sessions
  const userBids = BID_HISTORY.filter(b => b.bidder_id === currentUser.user_id);
  const mySessionIds = new Set(userBids.map(b => b.session_id));
  
  // Include at least the sealed auction as4_sealed & live as1 for demo
  if (mySessionIds.size === 0) {
    mySessionIds.add('as4_sealed');
    mySessionIds.add('as1');
  }

  const participatedSessions = AUCTION_SESSIONS.filter(s => mySessionIds.has(s.session_id));

  return (
    <div className={styles.tabContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className={styles.tabTitle} style={{ margin: 0 }}>Phiên đấu giá của tôi</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Theo dõi danh sách các phiên đấu giá kín (Sealed-bid) và phiên công khai bạn đã nộp giá thầu
          </p>
        </div>
        <Link to="/auction" className="btn btn-secondary btn-sm">
          Khám phá thêm phiên <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {participatedSessions.map(session => {
          const artwork = ARTWORKS.find(a => a.artwork_id === session.artwork_id) || ARTWORKS[0];
          const myBid = userBids.find(b => b.session_id === session.session_id) || {
            bid_amount: session.auction_type === 'sealed' ? 23500000 : 22500000,
            placed_at: new Date(Date.now() - 3600000).toISOString(),
            status: session.auction_type === 'sealed' ? 'submitted' : 'winning',
          };

          const isSealed = session.auction_type === 'sealed';
          const isEnded = session.status === 'ended' || new Date(session.end_time) <= new Date();

          let statusBadge = null;
          if (isEnded) {
            if (myBid.status === 'winning') {
              statusBadge = <span className="badge badge-gold"><Trophy size={12} /> CHIẾN THẮNG</span>;
            } else {
              statusBadge = <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>ĐÃ KẾT THÚC</span>;
            }
          } else {
            if (isSealed) {
statusBadge = (
  <span
    className="badge badge-gold"
    style={{ fontSize: "10px", padding: "8px 8px", gap: "4px" }}
  >
    <Lock size={8} /> ĐÃ GỬI HỒ SƠ KÍN
  </span>
);            } else if (myBid.status === 'winning') {
              statusBadge = <span className="badge badge-live">DẪN ĐẦU</span>;
            } else {
              statusBadge = <span className="badge badge-secondary">ĐÃ BỊ VƯỢT</span>;
            }
          }

          return (
            <div
              key={session.session_id}
              className={styles.myAuctionItem}
              style={{
                border: isSealed ? '1px solid var(--border-gold)' : undefined,
              }}
            >
              <div className={styles.myAuctionArtwork}>
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className={styles.myAuctionArtworkImg}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {isSealed ? (
                      <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}><Lock size={10} /> Phiên Kín</span>
                    ) : (
                      <span className="badge badge-live" style={{ fontSize: '0.68rem' }}>Live</span>
                    )}
                    {statusBadge}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 2px', fontFamily: 'var(--font-brand)', color: 'var(--text-primary)' }}>
                    {artwork.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Họa sĩ: {artwork.artist_name} · Đóng lúc: {new Date(session.end_time).toLocaleDateString('vi-VN')} {new Date(session.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className={styles.myAuctionRight}>
                <div className={styles.myAuctionBidBlock}>
                  <span className={styles.myAuctionBidLabel}>
                    {isSealed ? 'Giá kín bạn đặt' : 'Mức giá đã đặt'}
                  </span>
                  <p className={styles.myAuctionBidAmount}>
                    {formatPriceFull(myBid.bid_amount)}
                  </p>
                  <span className={styles.myAuctionBidSub}>
                    {isSealed ? 'Mã hóa bí mật một chiều' : 'Lượt đặt gần nhất'}
                  </span>
                </div>

                <div className={styles.myAuctionActions}>
                  {/* Flow 4: Nút "Tăng giá" nếu phiên kín đang diễn ra */}
                  {isSealed && !isEnded && (
                    <button
                      id={`btn-raise-bid-${session.session_id}`}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => onRaiseBid?.(session, myBid, artwork)}
                    >
                      <TrendingUp size={13} /> Tăng giá
                    </button>
                  )}
                  <Link to={`/artwork/${artwork.artwork_id}`} className="btn btn-secondary btn-sm">
                    Xem phiên <ArrowRight size={13} />
                  </Link>
                  {isEnded && myBid.status === 'winning' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => addToast('Chuyển tới tạo lệnh thanh toán Escrow bảo chứng 72h!', 'gold')}
                    >
                      <Shield size={13} /> Tạo Escrow
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===== 8.6 MÀN HÌNH 5 & FLOW 5: Quản lý tác phẩm & Phiên của Họa sĩ ===== */
const ArtistArtworkManagementTab = ({ currentUser, onOpenCreate, onOpenUpload, onOpenDashboard, artworksVersion, addToast }) => {
  const artistArtworks = ARTWORKS.filter(a => a.artist_id === currentUser.user_id || currentUser.role === 'artist');

  return (
    <div className={styles.tabContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className={styles.tabTitle} style={{ margin: 0 }}>Quản lý tác phẩm & Phiên đấu giá</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Flow 5: Họa sĩ thiết lập phiên kín (Sealed-bid), giám sát danh sách giá thầu cao→thấp và kết nối Escrow
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            id="btn-tab-upload-artwork"
            className="btn btn-secondary btn-sm"
            onClick={onOpenUpload}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'var(--border-gold)' }}
          >
            <Palette size={14} color="var(--gold-primary)" /> Đăng tác phẩm mới
          </button>
          <button
            id="btn-tab-create-auction"
            className="btn btn-primary btn-sm"
            onClick={onOpenCreate}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <PlusCircle size={14} /> Tạo phiên đấu giá mới
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {artistArtworks.map(art => {
          const session = AUCTION_SESSIONS.find(s => s.artwork_id === art.artwork_id);
          const bids = session ? BID_HISTORY.filter(b => b.session_id === session.session_id) : [];
          const isSealed = session?.auction_type === 'sealed';
          const isEnded = session && (session.status === 'ended' || new Date(session.end_time) <= new Date());

          return (
            <div
              key={art.artwork_id}
              style={{
                background: 'var(--bg-elevated)',
                border: session ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <img
                  src={art.image}
                  alt={art.title}
                  style={{ width: 84, height: 84, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-verified">Độc bản</span>
                    {session ? (
                      isSealed ? (
                        <span className="badge badge-gold"><Lock size={10} /> ĐẤU GIÁ KÍN</span>
                      ) : (
                        <span className="badge badge-live">LIVE PUBLIC</span>
                      )
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>Chưa mở phiên</span>
                    )}
                    {session && isEnded && (
                      <span className="badge" style={{ background: 'rgba(46,204,113,0.15)', color: '#2ECC71' }}>Hết giờ nhận giá</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', fontFamily: 'var(--font-brand)', color: 'var(--text-primary)' }}>
                    {art.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {art.medium} · {art.dimensions} · Giá niêm yết: {formatPriceFull(art.current_price)}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {session ? (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {isSealed ? 'Số hồ sơ kín đã nhận' : 'Giá cao nhất'}
                    </span>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>
                      {isSealed ? `${bids.length} hồ sơ thầu` : formatPriceFull(session.current_highest_price)}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Mã phiên: {session.session_id}
                    </span>
                  </div>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tác phẩm sẵn sàng</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  {session ? (
                    <button
                      id={`btn-open-dashboard-${art.artwork_id}`}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={() => onOpenDashboard(session)}
                    >
                      <LayoutDashboard size={14} /> Dashboard phiên (Bảng giá thầu)
                    </button>
                  ) : (
                    <button
                      id={`btn-create-for-${art.artwork_id}`}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={onOpenCreate}
                    >
                      <PlusCircle size={14} /> Tạo phiên đấu giá
                    </button>
                  )}
                  <Link to={`/artwork/${art.artwork_id}`} className="btn btn-ghost btn-sm">
                    Xem tranh
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const OrderDetailModal = ({ order, onClose, addToast }) => {
  if (!order) return null;

  return (
    <div className={styles.invoiceModalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.invoiceModalBox}>
        {/* Header */}
        <div className={styles.invoiceHeader}>
          <div>
            <div className={styles.invoiceBrand}>ARTISAN HUB</div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Biên lai điện tử & Xác thực thanh toán bảo chứng
            </p>
          </div>
          <button
            className="btn btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Đóng"
            style={{ borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Invoice Meta */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '14px 16px',
          fontSize: '0.8rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Mã đơn hàng:</span>{' '}
            <strong style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>#{order.orderId}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Mã giao dịch:</span>{' '}
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{order.txId || order.orderId}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Thời gian:</span>{' '}
            <strong>{new Date(order.paidAt).toLocaleString('vi-VN')}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Phương thức:</span>{' '}
            <strong style={{ textTransform: 'uppercase' }}>
              {order.paymentMethod === 'escrow' ? 'Ký quỹ Escrow 72h' : order.paymentMethod === 'banking' ? 'VietQR 24/7' : 'Thẻ quốc tế'}
            </strong>
          </div>
        </div>

        {/* Recipient info */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.03)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: 12,
          padding: '14px 16px',
          fontSize: '0.82rem'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--gold-light)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} /> Thông tin giao nhận bảo hiểm
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Người nhận:</span> {order.deliveryInfo?.name}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>Số điện thoại:</span> {order.deliveryInfo?.phone}</div>
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: 'var(--text-muted)' }}>Địa chỉ:</span> {order.deliveryInfo?.address}, {order.deliveryInfo?.city}
            </div>
            {order.deliveryInfo?.note && (
              <div style={{ gridColumn: '1 / -1', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ghi chú:</span> "{order.deliveryInfo.note}"
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Table */}
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th>Khoản mục</th>
              <th>Chi tiết</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>{order.title}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Họa sĩ: {order.artist_name} · {order.medium} ({order.dimensions})
                </div>
              </td>
              <td>1 tác phẩm độc bản</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{formatPriceFull(order.winPrice || Math.round(order.grandTotal * 0.95))}</td>
            </tr>
            <tr>
              <td>Đóng gói kiện gỗ bảo tàng</td>
              <td>Kiện gỗ thông xông hơi khử trùng chống ẩm</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{formatPriceFull(order.packagingFee || 850000)}</td>
            </tr>
            <tr>
              <td>Bảo hiểm vận chuyển mỹ thuật 100%</td>
              <td>Bảo hiểm rủi ro toàn diện trong hành trình</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{formatPriceFull(order.insuranceFee || 450000)}</td>
            </tr>
            <tr>
              <td>Phí nền tảng bảo chứng Artisan Hub</td>
              <td>Miễn phí ưu đãi phiên đấu giá</td>
              <td style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>0 ₫ (Miễn phí)</td>
            </tr>
            <tr className={styles.invoiceTotalRow}>
              <td colSpan="2">TỔNG CỘNG ĐÃ THANH TOÁN</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem' }}>{formatPriceFull(order.grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Blockchain proof */}
        <div style={{
          padding: '12px 14px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 10,
          fontSize: '0.72rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-primary)', fontWeight: 600 }}>
            <ShieldCheck size={14} /> Xác thực Hợp đồng Ký quỹ & Băm SHA-256
          </div>
          <div style={{ color: 'var(--text-muted)', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
            HASH: {order.hash || '0x8f2c3d5a7b1e4c9f0a2d4e6b8c0e2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d'}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => addToast?.('Biên lai VAT điện tử đã được tải xuống máy!', 'success')}
          >
            <Printer size={15} /> In / Tải PDF
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Đóng biên lai
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersAndEscrowTab = ({ addToast, onViewCertificates, highlightOrderId }) => {
  const DEFAULT_MOCK_ORDERS = [
    {
      orderId: 'AH-ORD-2024-8924',
      txId: 'AH-89241042',
      artworkId: 'aw2',
      title: 'Hoàng Hôn Sông Hương',
      artist_name: 'Nguyễn Gia Trí',
      image: '/gallery_2.png',
      medium: 'Sơn mài truyền thống & Vàng quỳ 24K',
      dimensions: '90 x 120 cm',
      creation_year: '2023',
      winPrice: 35000000,
      packagingFee: 850000,
      insuranceFee: 450000,
      grandTotal: 36300000,
      paidAt: '2026-11-02T14:30:00.000Z',
      paymentMethod: 'escrow',
      deliveryInfo: {
        name: 'Nguyễn Văn An',
        phone: '0912345678',
        address: '128 Đường Xuân Diệu, P. Quảng An, Tây Hồ',
        city: 'Hà Nội',
        note: 'Giao giờ hành chính, gọi trước 30 phút để chuẩn bị phòng trưng bày.'
      },
      status: 'escrow_locked',
      escrowState: 'locked',
      trackingCode: 'AH-EXPRESS-928410',
      certificateId: 'AH-CERT-2024-0042',
      hash: '0x8f2c3d5a7b1e4c9f0a2d4e6b8c0e2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d',
      carrier: 'Artisan Hub Logistics - Chuyên vận chuyển Tác Phẩm Mỹ Thuật & Bảo hiểm 100%',
    },
    {
      orderId: 'AH-ORD-2024-9102',
      txId: 'AH-91028341',
      artworkId: 'aw1',
      title: 'Mùa Vàng Tây Bắc',
      artist_name: 'Trần Văn Cẩn',
      image: '/gallery_1.png',
      medium: 'Sơn dầu trên toan (Oil on canvas)',
      dimensions: '80 x 100 cm',
      creation_year: '2024',
      winPrice: 28500000,
      packagingFee: 650000,
      insuranceFee: 350000,
      grandTotal: 29500000,
      paidAt: '2026-11-03T08:45:00.000Z',
      paymentMethod: 'banking',
      deliveryInfo: {
        name: 'Nguyễn Văn An',
        phone: '0912345678',
        address: '128 Đường Xuân Diệu, P. Quảng An, Tây Hồ',
        city: 'Hà Nội',
        note: 'Đóng thùng gỗ 2 lớp chống va đập.'
      },
      status: 'shipping',
      escrowState: 'locked',
      trackingCode: 'AH-EXPRESS-834112',
      certificateId: 'AH-CERT-2024-0089',
      hash: '0x3a5e7c9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5',
      carrier: 'Artisan Express - Xe chuyên dụng điều hòa nhiệt ẩm',
    },
    {
      orderId: 'AH-ORD-2024-7620',
      txId: 'AH-76201945',
      artworkId: 'aw3',
      title: 'Thiếu Nữ Bên Hoa Huệ',
      artist_name: 'Tô Ngọc Vân',
      image: '/gallery_3.png',
      medium: 'Sơn mài phục dựng cao cấp',
      dimensions: '75 x 95 cm',
      creation_year: '2022',
      winPrice: 65000000,
      packagingFee: 1200000,
      insuranceFee: 800000,
      grandTotal: 67000000,
      paidAt: '2026-10-25T16:20:00.000Z',
      paymentMethod: 'card',
      deliveryInfo: {
        name: 'Nguyễn Văn An',
        phone: '0912345678',
        address: '128 Đường Xuân Diệu, P. Quảng An, Tây Hồ',
        city: 'Hà Nội',
        note: 'Đã nghiệm thu hài lòng và lưu kho sưu tập cá nhân.'
      },
      status: 'completed',
      escrowState: 'released',
      trackingCode: 'AH-EXPRESS-719302',
      certificateId: 'AH-CERT-2024-0015',
      hash: '0x1f4a7c0d2e5b8a1c4e7b0d3f6a9c2e5b8d1f4a7c0e3b6d9f2a5c8e1b4d7f0a3',
      carrier: 'Artisan Hub Logistics - Đã bàn giao trọn vẹn',
    }
  ];

  const [orders, setOrders] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('artisan_orders') || '[]');
      if (stored.length === 0) return DEFAULT_MOCK_ORDERS;
      const storedIds = new Set(stored.map(o => o.orderId));
      const rest = DEFAULT_MOCK_ORDERS.filter(o => !storedIds.has(o.orderId));
      return [...stored, ...rest];
    } catch {
      return DEFAULT_MOCK_ORDERS;
    }
  });

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Modals
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [reportOrder, setReportOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  const handleCopy = (text, id, label = 'mã') => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    addToast?.(`Đã sao chép ${label}: ${text}`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmRelease = () => {
    if (!confirmOrder) return;
    const targetOrder = confirmOrder;
    const updated = orders.map(o => {
      if (o.orderId === targetOrder.orderId) {
        return { ...o, status: 'completed', escrowState: 'released' };
      }
      return o;
    });
    setOrders(updated);
    try {
      localStorage.setItem('artisan_orders', JSON.stringify(updated));
    } catch {}
    setConfirmOrder(null);
    addToast?.(`✦ Nghiệm thu thành công! Tiền ký quỹ ${formatPriceFull(targetOrder.grandTotal)} đã giải ngân về ví Họa sĩ ${targetOrder.artist_name}.`, 'success', 6000);
  };

  const handleDisputeSubmit = (reportData) => {
    if (!reportOrder) return;
    const updated = orders.map(o => {
      if (o.orderId === reportOrder.orderId) {
        return { ...o, status: 'disputed', escrowState: 'disputed', disputeInfo: reportData };
      }
      return o;
    });
    setOrders(updated);
    try {
      localStorage.setItem('artisan_orders', JSON.stringify(updated));
    } catch {}
    setReportOrder(null);
    addToast?.(`⚠️ Đã tạm dừng ký quỹ đơn #${reportOrder.orderId} & gửi hồ sơ sang Ban giám định L3.`, 'warning', 6000);
  };

  const handleCancelDispute = (orderId) => {
    const updated = orders.map(o => {
      if (o.orderId === orderId) {
        return { ...o, status: 'escrow_locked', escrowState: 'locked', disputeInfo: null };
      }
      return o;
    });
    setOrders(updated);
    try {
      localStorage.setItem('artisan_orders', JSON.stringify(updated));
    } catch {}
    addToast?.('Đã khôi phục quy trình nghiệm thu 72h bình thường.', 'info');
  };

  // Metrics calculation
  const totalCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const activeCount = orders.filter(o => o.status !== 'completed').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'in_transit' && order.status === 'completed') return false;
    if (filter === 'completed' && order.status !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = order.title?.toLowerCase().includes(q);
      const matchArtist = order.artist_name?.toLowerCase().includes(q);
      const matchId = order.orderId?.toLowerCase().includes(q);
      const matchTracking = order.trackingCode?.toLowerCase().includes(q);
      return matchTitle || matchArtist || matchId || matchTracking;
    }
    return true;
  });

  return (
    <div className={styles.tabContent}>
      <div className={styles.ordersContainer}>
        {/* Header */}
        <div className={styles.ordersHeader}>
          <h2 className={styles.tabTitle}>Đơn hàng đã thanh toán & Ký quỹ Escrow</h2>
          <p className={styles.ordersSubtitle}>
            Theo dõi hành trình bảo chứng tác phẩm nghệ thuật: từ khâu kiểm định tình trạng, đóng kiện gỗ bảo tàng, vận chuyển bảo hiểm 100% đến nghiệm thu 72h và nhận Thẻ chứng nhận số SHA-256.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className={styles.ordersStatsGrid}>
          <div className={styles.orderStatCard}>
            <div className={styles.statIconBox}>
              <Package size={22} />
            </div>
            <div>
              <p className={styles.statVal}>{totalCount}</p>
              <p className={styles.statLabel}>Đơn đã thanh toán</p>
            </div>
          </div>

          <div className={styles.orderStatCard}>
            <div className={styles.statIconBox} style={{ color: 'var(--gold-primary)', borderColor: 'rgba(212,175,55,0.4)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <p className={styles.statVal} style={{ fontSize: '1.1rem', color: 'var(--gold-primary)' }}>
                {formatPrice(totalSpent)}
              </p>
              <p className={styles.statLabel}>Tổng giá trị sở hữu</p>
            </div>
          </div>

          <div className={styles.orderStatCard}>
            <div className={styles.statIconBox} style={{ color: '#F39C12', borderColor: 'rgba(243,156,18,0.3)', background: 'rgba(243,156,18,0.1)' }}>
              <Clock size={22} />
            </div>
            <div>
              <p className={styles.statVal} style={{ color: '#F39C12' }}>{activeCount}</p>
              <p className={styles.statLabel}>Đang vận chuyển & Ký quỹ</p>
            </div>
          </div>

          <div className={styles.orderStatCard}>
            <div className={styles.statIconBox} style={{ color: '#2ECC71', borderColor: 'rgba(46,204,113,0.3)', background: 'rgba(46,204,113,0.1)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className={styles.statVal} style={{ color: '#2ECC71' }}>{completedCount}</p>
              <p className={styles.statLabel}>Đã nghiệm thu & Cấp thẻ</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className={styles.ordersToolbar}>
          <div className={styles.filterGroup}>
            <button
              className={`${styles.filterPill} ${filter === 'all' ? styles.filterPillActive : ''}`}
              onClick={() => setFilter('all')}
            >
              Tất cả ({totalCount})
            </button>
            <button
              className={`${styles.filterPill} ${filter === 'in_transit' ? styles.filterPillActive : ''}`}
              onClick={() => setFilter('in_transit')}
            >
              Đang ký quỹ & Vận chuyển ({activeCount})
            </button>
            <button
              className={`${styles.filterPill} ${filter === 'completed' ? styles.filterPillActive : ''}`}
              onClick={() => setFilter('completed')}
            >
              Đã hoàn tất ({completedCount})
            </button>
          </div>

          <div className={styles.searchBox}>
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm theo tên tranh, họa sĩ, mã đơn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 20,
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Không tìm thấy đơn hàng phù hợp
            </p>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>
              Hãy thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc hiển thị.
            </p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isHighlighted = highlightOrderId === order.orderId || highlightOrderId === order.txId;
            const isReleased = order.escrowState === 'released' || order.status === 'completed';
            const isDisputed = order.escrowState === 'disputed' || order.status === 'disputed';
            const isLocked = !isReleased && !isDisputed;

            return (
              <div
                key={order.orderId}
                id={`order-${order.orderId}`}
                className={`${styles.orderItemCard} ${isHighlighted ? styles.orderItemHighlighted : ''}`}
              >
                {isHighlighted && (
                  <div className={styles.highlightRibbon}>
                    <Sparkles size={12} /> Đơn hàng vừa thanh toán
                  </div>
                )}

                {/* Card Top: Order Code, Badges, Price */}
                <div className={styles.orderCardHeader}>
                  <div className={styles.orderIdSection}>
                    <span className={styles.orderIdText}>#{order.orderId}</span>
                    <button
                      className={styles.copyIconBtn}
                      onClick={() => handleCopy(order.orderId, order.orderId, 'mã đơn hàng')}
                      title="Sao chép mã đơn hàng"
                    >
                      {copiedId === order.orderId ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                    </button>

                    {/* Status Pill */}
                    {isReleased && (
                      <span className="badge" style={{ background: 'rgba(46,204,113,0.15)', color: '#2ECC71', border: '1px solid rgba(46,204,113,0.3)' }}>
                        <CheckCircle2 size={11} /> Đã nghiệm thu & Hoàn tất
                      </span>
                    )}
                    {isLocked && order.status === 'shipping' && (
                      <span className="badge" style={{ background: 'rgba(52,152,219,0.15)', color: '#3498db', border: '1px solid rgba(52,152,219,0.3)' }}>
                        <Truck size={11} /> Đang vận chuyển bảo hiểm
                      </span>
                    )}
                    {isLocked && order.status !== 'shipping' && (
                      <span className="badge" style={{ background: 'rgba(243,156,18,0.15)', color: '#F39C12', border: '1px solid rgba(243,156,18,0.3)' }}>
                        <Clock size={11} /> Đang ký quỹ Escrow 72h
                      </span>
                    )}
                    {isDisputed && (
                      <span className="badge" style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }}>
                        <ShieldAlert size={11} /> Tạm dừng ký quỹ · Đang khiếu nại
                      </span>
                    )}

                    {/* Payment Method Badge */}
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      <CreditCard size={11} />{' '}
                      {order.paymentMethod === 'escrow' ? 'Ký quỹ Escrow' : order.paymentMethod === 'banking' ? 'VietQR 24/7' : 'Thẻ Visa/Master'}
                    </span>

                    <span className={styles.orderDateText}>
                      <Clock size={12} /> {new Date(order.paidAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className={styles.orderHeaderRight}>
                    <p className={styles.orderPriceBig}>{formatPriceFull(order.grandTotal)}</p>
                  </div>
                </div>

                {/* Card Middle: Artwork Info + Delivery Details */}
                <div className={styles.orderContentGrid}>
                  {/* Artwork Snapshot */}
                  <div className={styles.artworkSection}>
                    <div className={styles.artworkImgWrap}>
                      <img src={order.image} alt={order.title} className={styles.artworkImg} />
                    </div>
                    <div className={styles.artworkMetaInfo}>
                      <h3 className={styles.artworkTitleText}>{order.title}</h3>
                      <p className={styles.artworkArtistLine}>
                        bởi <strong>{order.artist_name}</strong>
                        <span className="badge badge-verified" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                          <Shield size={9} /> Xác thực
                        </span>
                      </p>
                      <p className={styles.artworkSpecText}>
                        {order.medium} · {order.dimensions} · {order.creation_year}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Snapshot */}
                  <div className={styles.deliverySnapshot}>
                    <div className={styles.deliveryTitle}>
                      <Truck size={13} /> Địa chỉ nhận hàng & Vận đơn
                    </div>
                    <p className={styles.deliveryRow}>
                      <span>Người nhận:</span> <strong>{order.deliveryInfo?.name}</strong> ({order.deliveryInfo?.phone})
                    </p>
                    <p className={styles.deliveryRow}>
                      <span>Địa chỉ:</span> {order.deliveryInfo?.address}, {order.deliveryInfo?.city}
                    </p>
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className={styles.trackingBadge}>
                        Mã vận đơn: {order.trackingCode}
                      </span>
                      <button
                        className={styles.copyIconBtn}
                        onClick={() => handleCopy(order.trackingCode, `track-${order.orderId}`, 'mã vận đơn')}
                        title="Sao chép mã vận đơn"
                      >
                        {copiedId === `track-${order.orderId}` ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4-Step Escrow & Delivery Progress */}
                <div className={styles.escrowProgress} style={{ marginTop: 4 }}>
                  {/* Step 1: Payment */}
                  <div className={styles.escrowStep}>
                    <div className={`${styles.stepDot} ${styles.stepDone}`}>
                      <CheckCircle size={14} />
                    </div>
                    <div className={styles.stepInfo}>
                      <p className={styles.stepLabel}>Đã thanh toán</p>
                      <p className={styles.stepDesc}>Cổng thanh toán xác nhận</p>
                    </div>
                  </div>
                  <div className={styles.stepLine} />

                  {/* Step 2: Crate & Inspection */}
                  <div className={styles.escrowStep}>
                    <div className={`${styles.stepDot} ${styles.stepDone}`}>
                      <CheckCircle size={14} />
                    </div>
                    <div className={styles.stepInfo}>
                      <p className={styles.stepLabel}>Đóng kiện gỗ</p>
                      <p className={styles.stepDesc}>Niêm phong chống ẩm</p>
                    </div>
                  </div>
                  <div className={styles.stepLine} />

                  {/* Step 3: Transit */}
                  <div className={styles.escrowStep}>
                    {isReleased ? (
                      <div className={`${styles.stepDot} ${styles.stepDone}`}>
                        <CheckCircle size={14} />
                      </div>
                    ) : (
                      <div className={`${styles.stepDot} ${styles.stepDone}`}>
                        <Truck size={14} />
                      </div>
                    )}
                    <div className={styles.stepInfo}>
                      <p className={styles.stepLabel}>Vận chuyển bảo hiểm</p>
                      <p className={styles.stepDesc}>Đã giao tới tư gia</p>
                    </div>
                  </div>
                  <div className={styles.stepLine} />

                  {/* Step 4: 72h Escrow & Inspection */}
                  <div className={styles.escrowStep}>
                    {isReleased ? (
                      <div className={`${styles.stepDot} ${styles.stepDone}`}>
                        <CheckCircle size={14} />
                      </div>
                    ) : isDisputed ? (
                      <div className={`${styles.stepDot} ${styles.stepDisputed}`}>
                        <ShieldAlert size={14} />
                      </div>
                    ) : (
                      <div className={`${styles.stepDot} ${styles.stepActive}`}>
                        <Clock size={14} />
                      </div>
                    )}
                    <div className={styles.stepInfo}>
                      <p className={styles.stepLabel}>Nghiệm thu 72h</p>
                      <p className={styles.stepDesc}>
                        {isReleased
                          ? 'Đã nghiệm thu hài lòng'
                          : isDisputed
                          ? 'Đang tạm dừng thẩm định'
                          : 'Đang mở kiểm tra tranh'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banner Notifications */}
                {isReleased && (
                  <div className={styles.escrowSuccessBox}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--success)' }}>
                        ✦ Hợp đồng Escrow đã hoàn tất giải ngân
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Số tiền <strong>{formatPriceFull(order.grandTotal)}</strong> đã giải ngân về ví Họa sĩ {order.artist_name}. Quyền sở hữu độc bản và Thẻ chứng nhận số SHA-256 đã kích hoạt toàn quyền cho bạn.
                      </p>
                    </div>
                    {onViewCertificates && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => onViewCertificates?.(order)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Xem Thẻ chứng nhận số →
                      </button> 
                    )}
                  </div>
                )}

                {isDisputed && (
                  <div className={styles.escrowDisputeBox}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#e74c3c' }}>
                        ⚠️ Đơn hàng đang trong trạng thái xem xét khiếu nại (#{order.orderId})
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                        Khoản ký quỹ <strong>{formatPriceFull(order.grandTotal)}</strong> được bảo lưu an toàn. Ban thẩm định L3 sẽ liên hệ bạn và Họa sĩ trong 24 giờ.
                      </p>
                    </div>
                    <button
                      className="btn btn-ghost"
                      onClick={() => handleCancelDispute(order.orderId)}
                      style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RotateCcw size={14} /> Hủy khiếu nại
                    </button>
                  </div>
                )}

                {/* Actions Bottom Bar */}
                <div className={styles.orderActionsRow}>
                  <div className={styles.orderActionsLeft}>
                    {isLocked && (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => setConfirmOrder(order)}
                        >
                          <CheckCircle size={15} /> Xác nhận đã nhận hàng
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => setReportOrder(order)}
                        >
                          <ShieldAlert size={15} /> Báo cáo vấn đề
                        </button>
                      </>
                    )}
                    {isReleased && onViewCertificates && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => onViewCertificates?.(order)}
                      >
                        <Award size={15} /> Thẻ chứng nhận SHA-256
                      </button>
                    )}
                  </div>

                  <div className={styles.orderActionsRight}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setDetailOrder(order)}
                    >
                      <Receipt size={15} /> Xem chi tiết hóa đơn
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => addToast?.(`Đã tải xuống biên lai điện tử VAT đơn #${order.orderId}`, 'success')}
                    >
                      <Download size={15} /> Tải biên lai
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Slip-Prevention Modals */}
      {confirmOrder && (
        <ConfirmDeliveryModal
          order={confirmOrder}
          artwork={{
            title: confirmOrder.title,
            artist_name: confirmOrder.artist_name,
            image: confirmOrder.image,
            medium: confirmOrder.medium,
            dimensions: confirmOrder.dimensions,
          }}
          onClose={() => setConfirmOrder(null)}
          onConfirmRelease={handleConfirmRelease}
        />
      )}

      {reportOrder && (
        <ReportIssueModal
          order={reportOrder}
          artwork={{
            title: reportOrder.title,
            artist_name: reportOrder.artist_name,
            image: reportOrder.image,
            medium: reportOrder.medium,
            dimensions: reportOrder.dimensions,
          }}
          onClose={() => setReportOrder(null)}
          onSubmitReport={handleDisputeSubmit}
        />
      )}

      {/* Order Detail & Invoice Modal */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          addToast={addToast}
        />
      )}
    </div>
  );
};

const getAllPurchasedCertificates = (currentUser) => {
  // 1. Default purchased/owned artworks certificates
  const defaultList = [
    {
      certificate_id: 'AH-CERT-2024-0042',
      qr_verify_code: 'AH-CERT-2024-0042',
      artwork_id: 'aw2',
      orderId: 'AH-ORD-2024-8924',
      title: 'Hoàng Hôn Sông Hương',
      artist_name: 'Nguyễn Gia Trí',
      image: '/gallery_2.png',
      medium: 'Sơn mài truyền thống & Vàng quỳ 24K',
      dimensions: '90 x 120 cm',
      creation_year: '2023',
      current_price: 35000000,
      ownership_hash: 'SHA-256:8f2c3d5a7b1e4c9f0a2d4e6b8c0e2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d',
      digital_signature: 'ECDSA-secp256k1:3046022100d4b8f4a2e1c9f3a7b2e8d1c4f6a3b9e2d7c1f4a8b3e6d9c2f5a1b4e7d0c3f6a9',
      issued_date: '02/11/2026',
      status: 'active',
      provenance_chain: [
        { owner: 'Nguyễn Gia Trí (Họa sĩ tác giả)', date: '15/03/2023', type: 'Sáng tác hoàn thiện tại xưởng' },
        { owner: 'Hội đồng giám định Artisan Hub L3', date: '20/09/2024', type: 'Giám định bảo tàng & Niêm phong' },
        { owner: 'Hợp đồng Escrow bảo chứng 72h (#AH-ORD-2024-8924)', date: '02/11/2026', type: 'Giao dịch bảo đảm' },
        { owner: currentUser?.full_name || 'Nhà sưu tầm (Bạn)', date: '03/11/2026', type: 'Xác lập quyền sở hữu vĩnh viễn' },
      ]
    },
    {
      certificate_id: 'AH-CERT-2024-0015',
      qr_verify_code: 'AH-CERT-2024-0015',
      artwork_id: 'aw3',
      orderId: 'AH-ORD-2024-7620',
      title: 'Thiếu Nữ Bên Hoa Huệ',
      artist_name: 'Tô Ngọc Vân',
      image: '/gallery_3.png',
      medium: 'Sơn mài phục dựng cao cấp',
      dimensions: '75 x 95 cm',
      creation_year: '2022',
      current_price: 65000000,
      ownership_hash: 'SHA-256:1f4a7c0d2e5b8a1c4e7b0d3f6a9c2e5b8d1f4a7c0e3b6d9f2a5c8e1b4d7f0a3',
      digital_signature: 'ECDSA-secp256k1:2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
      issued_date: '25/10/2026',
      status: 'active',
      provenance_chain: [
        { owner: 'Tô Ngọc Vân (Họa sĩ tác giả)', date: '10/05/2022', type: 'Sáng tác nguyên tác' },
        { owner: 'Artisan Hub Gallery Archive', date: '15/08/2024', type: 'Lưu trữ & Bảo tồn' },
        { owner: 'Hợp đồng Escrow (#AH-ORD-2024-7620)', date: '25/10/2026', type: 'Nghiệm thu hoàn tất' },
        { owner: currentUser?.full_name || 'Nhà sưu tầm (Bạn)', date: '25/10/2026', type: 'Xác lập quyền sở hữu vĩnh viễn' },
      ]
    },
    {
      certificate_id: 'AH-CERT-2024-0089',
      qr_verify_code: 'AH-CERT-2024-0089',
      artwork_id: 'aw1',
      orderId: 'AH-ORD-2024-9102',
      title: 'Mùa Vàng Tây Bắc',
      artist_name: 'Trần Văn Cẩn',
      image: '/gallery_1.png',
      medium: 'Sơn dầu trên toan (Oil on canvas)',
      dimensions: '80 x 100 cm',
      creation_year: '2024',
      current_price: 28500000,
      ownership_hash: 'SHA-256:3a5e7c9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5',
      digital_signature: 'ECDSA-secp256k1:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      issued_date: '03/11/2026',
      status: 'active',
      provenance_chain: [
        { owner: 'Trần Văn Cẩn (Họa sĩ tác giả)', date: '12/01/2024', type: 'Sáng tác hoàn thiện' },
        { owner: 'Hội đồng giám định Artisan Hub L3', date: '18/09/2024', type: 'Niêm phong kiện gỗ bảo tàng' },
        { owner: 'Hợp đồng chuyển nhượng (#AH-ORD-2024-9102)', date: '03/11/2026', type: 'Thanh toán hoàn tất' },
        { owner: currentUser?.full_name || 'Nhà sưu tầm (Bạn)', date: '03/11/2026', type: 'Xác lập quyền sở hữu vĩnh viễn' },
      ]
    }
  ];

  // 2. Load custom orders from localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('artisan_orders') || '[]');
    const storedCerts = stored.map(o => ({
      certificate_id: o.certificateId || `AH-CERT-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      qr_verify_code: o.certificateId || `AH-CERT-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      artwork_id: o.artworkId,
      orderId: o.orderId,
      title: o.title,
      artist_name: o.artist_name,
      image: o.image,
      medium: o.medium,
      dimensions: o.dimensions,
      creation_year: o.creation_year,
      current_price: o.grandTotal,
      ownership_hash: o.hash ? `SHA-256:${o.hash.replace('0x', '')}` : 'SHA-256:7f9a1c3e5b7d9f1a3c5e7b9d1f3a5e7c9b1d3f5a7c9e1b3d5f7a9c1e3b5d',
      digital_signature: `ECDSA-secp256k1:${(o.hash || '30460221').substring(0, 32)}...`,
      issued_date: new Date(o.paidAt || Date.now()).toLocaleDateString('vi-VN'),
      status: 'active',
      provenance_chain: [
        { owner: `${o.artist_name} (Họa sĩ tác giả)`, date: `${o.creation_year || '2024'}-04-10`, type: 'Sáng tác khởi tạo' },
        { owner: 'Artisan Hub Curator & Authentication L3', date: '2024-09-20', type: 'Kiểm định & Cấp mã bảo chứng' },
        { owner: `Đơn hàng thanh toán #${o.orderId}`, date: new Date(o.paidAt || Date.now()).toLocaleDateString('vi-VN'), type: 'Giao dịch hoàn tất' },
        { owner: currentUser?.full_name || 'Nhà sưu tầm (Bạn)', date: new Date(o.paidAt || Date.now()).toLocaleDateString('vi-VN'), type: 'Xác lập quyền sở hữu vĩnh viễn' },
      ]
    }));

    const existingOrderIds = new Set(storedCerts.map(c => c.orderId));
    const rest = defaultList.filter(d => !existingOrderIds.has(d.orderId));
    return [...storedCerts, ...rest];
  } catch {
    return defaultList;
  }
};

const CertificatesTab = ({
  addToast,
  selectedCertTarget,
  currentUser,
  onNavigateToArtwork,
  onNavigateToOrders
}) => {
  const allCertificates = React.useMemo(() => {
    return getAllPurchasedCertificates(currentUser);
  }, [currentUser]);

  const [activeCertId, setActiveCertId] = useState(() => {
    if (selectedCertTarget) {
      const match = allCertificates.find(c =>
        c.certificate_id === selectedCertTarget.certificateId ||
        c.artwork_id === selectedCertTarget.artworkId ||
        c.orderId === selectedCertTarget.orderId ||
        c.title === selectedCertTarget.title
      );
      if (match) return match.certificate_id;
    }
    return allCertificates[0]?.certificate_id || 'AH-CERT-2024-0042';
  });

  React.useEffect(() => {
    if (selectedCertTarget) {
      const match = allCertificates.find(c =>
        c.certificate_id === selectedCertTarget.certificateId ||
        c.artwork_id === selectedCertTarget.artworkId ||
        c.orderId === selectedCertTarget.orderId ||
        c.title === selectedCertTarget.title
      );
      if (match) setActiveCertId(match.certificate_id);
    }
  }, [selectedCertTarget, allCertificates]);

  const activeCert = allCertificates.find(c => c.certificate_id === activeCertId) || allCertificates[0];
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key, label) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    addToast?.(`Đã sao chép ${label}!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className={styles.tabContent}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 className={styles.tabTitle} style={{ margin: '0 0 6px' }}>Thẻ chứng nhận số & Quyền sở hữu độc bản</h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: 740, lineHeight: 1.5 }}>
            Mỗi tác phẩm bạn mua trên Artisan Hub đều được cấp một Thẻ chứng nhận số SHA-256 bất biến, gắn liền với chữ ký nghệ sĩ và chuỗi lịch sử nguồn gốc xuất xứ trọn đời.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            📜 {allCertificates.length} Thẻ chứng nhận đã cấp
          </span>
          <span className="badge badge-verified" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            🛡️ SHA-256 Verified
          </span>
        </div>
      </div>

      {/* Selector of purchased products */}
      <div style={{ marginBottom: 10, fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Package size={14} /> Danh sách tác phẩm đã mua ({allCertificates.length}):
      </div>
      <div className={styles.certSelectorRow}>
        {allCertificates.map(c => {
          const isSelected = c.certificate_id === activeCert.certificate_id;
          return (
            <button
              key={c.certificate_id}
              type="button"
              className={`${styles.certSelectorItem} ${isSelected ? styles.certSelectorItemActive : ''}`}
              onClick={() => setActiveCertId(c.certificate_id)}
            >
              <img src={c.image} alt={c.title} className={styles.certThumb} />
              <div className={styles.certSelectorInfo}>
                <p className={styles.certSelectorTitle}>{c.title}</p>
                <p className={styles.certSelectorArtist}>{c.artist_name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span className={styles.certSelectorCode}>#{c.certificate_id}</span>
                  <span className="badge badge-verified" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Đã cấp</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Certificate Card */}
      <div className={styles.certCard}>
        {/* Certificate Header */}
        <div className={styles.certHeader}>
          <div className={styles.certBrand}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-brand)', color: 'var(--gold-primary)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.12em' }}>
                ARTISAN HUB
              </span>
              <span className="badge badge-verified" style={{ background: 'rgba(46,204,113,0.18)', color: '#2ECC71', border: '1px solid rgba(46,204,113,0.4)' }}>
                <CheckCircle2 size={11} /> ĐÃ KÍCH HOẠT QUYỀN SỞ HỮU
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, letterSpacing: '0.04em' }}>
              Digital Certificate of Authenticity & Ownership (COA)
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Đơn vị bảo chứng: Hội đồng giám định mỹ thuật Artisan Hub (Cấp L3 Verified)
            </p>
          </div>

          <div className={styles.certQr}>
            <div style={{ background: '#fff', padding: 8, borderRadius: 8, display: 'inline-flex' }}>
              <QrCode size={56} color="#121214" />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600, textAlign: 'center', marginTop: '6px', margin: '4px 0 0' }}>
              {activeCert.qr_verify_code}
            </p>
          </div>
        </div>

        {/* Artwork Snapshot */}
        <div className={styles.certArtwork}>
          <img src={activeCert.image} alt={activeCert.title} className={styles.certImg} style={{ width: 100, height: 75 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <h3 className={styles.certArtTitle} style={{ fontSize: '1.2rem', margin: 0 }}>{activeCert.title}</h3>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>✦ Độc bản 1/1</span>
            </div>
            <p className={styles.certMeta} style={{ color: 'var(--gold-light)', fontWeight: 500, margin: '4px 0' }}>
              Sáng tác bởi Họa sĩ <strong>{activeCert.artist_name}</strong>
            </p>
            <p className={styles.certMeta}>
              {activeCert.medium} · {activeCert.dimensions} · {activeCert.creation_year}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Chủ sở hữu hiện tại: <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.full_name || 'Bạn'}</strong></span>
              {activeCert.current_price && (
                <span>Giá trị bảo chứng: <strong style={{ color: 'var(--gold-primary)' }}>{formatPriceFull(activeCert.current_price)}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Cryptographic Fields */}
        <div className={styles.certFields}>
          {[
            { label: 'Mã định danh chứng chỉ (Certificate ID)', value: activeCert.certificate_id, key: 'id' },
            { label: 'Mã băm toàn vẹn bản quyền (SHA-256 Ownership Hash)', value: activeCert.ownership_hash, key: 'hash' },
            { label: 'Chữ ký điện tử Họa sĩ (ECDSA Digital Signature)', value: activeCert.digital_signature, key: 'sig' },
            { label: 'Mã giao dịch / Hợp đồng đơn hàng đã mua', value: `#${activeCert.orderId || 'AH-ORD-2024-8924'}`, key: 'order' },
          ].map(({ label, value, key }) => (
            <div key={label} className={styles.certField}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.certLabel}>{label}</span>
                <button
                  type="button"
                  className={styles.copyIconBtn}
                  onClick={() => handleCopy(value, key, label)}
                  title="Sao chép"
                  style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
                >
                  {copiedKey === key ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                </button>
              </div>
              <code className={styles.certValue}>{value}</code>
            </div>
          ))}
        </div>

        {/* Provenance Chain */}
        <div className={styles.certProvenance}>
          <h4 className={styles.provenanceTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} /> Chuỗi nguồn gốc xuất xứ & Chuyển giao quyền sở hữu (Provenance Chain)
          </h4>
          {activeCert.provenance_chain.map((item, i) => (
            <div key={i} className={styles.provenanceRow}>
              <div className={`${styles.provDot} ${i === activeCert.provenance_chain.length - 1 ? styles.provDotActive : ''}`} />
              <div>
                <p className={styles.provOwner} style={{ color: i === activeCert.provenance_chain.length - 1 ? 'var(--gold-primary)' : 'var(--text-primary)' }}>
                  {item.owner}
                </p>
                <p className={styles.provMeta}>{item.date} · {item.type}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.certActions} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => addToast?.(`✦ Đã tải Thẻ chứng nhận số SHA-256 tác phẩm "${activeCert.title}" (PDF)!`, 'success', 5000)}
          >
            <Download size={16} /> Tải chứng chỉ PDF chính thức
          </button>
          {/* <button
            className="btn btn-secondary"
            onClick={() => handleCopy(`https://artisanhub.art/verify/${activeCert.certificate_id}`, 'link', 'liên kết xác thực')}
          >
            <ExternalLink size={16} /> Sao chép link xác thực công khai
          </button>
          {onNavigateToArtwork && (
            <button
              className="btn btn-ghost"
              onClick={() => onNavigateToArtwork(activeCert.artwork_id)}
            >
              <Eye size={16} /> Xem trang tác phẩm 3D
            </button>
          )} */}
          {/* {onNavigateToOrders && (
            <button
              className="btn btn-ghost"
              onClick={onNavigateToOrders}
            >
              <Receipt size={16} /> Xem đơn hàng thanh toán
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ user, addToast, onLogout, navigate }) => (
  <div className={styles.tabContent}>
    <h2 className={styles.tabTitle}>Cài đặt tài khoản</h2>

    <div className={styles.settingsWrapper}>
      {/* Profile Info Form */}
      <div className={styles.settingsForm}>
        {/* Form Header */}
        <div className={styles.settingsFormHeader}>
          <div className={styles.settingsFormIcon}>
            <UserCog size={20} />
          </div>
          <div>
            <p className={styles.settingsFormTitle}>Thông tin cá nhân</p>
            <p className={styles.settingsFormSubtitle}>Cập nhật thông tin hồ sơ được hiển thị trên nền tảng Artisan Hub</p>
          </div>
        </div>

        {/* Fields */}
        {[
          { label: 'Họ và tên', value: user.full_name, id: 'settings-name', type: 'text' },
          { label: 'Email', value: user.email, id: 'settings-email', type: 'email' },
          { label: 'Username', value: user.username, id: 'settings-username', type: 'text' },
        ].map(({ label, value, id, type }) => (
          <div key={id} className={styles.formGroup}>
            <label htmlFor={id} className={styles.formLabel}>{label}</label>
            <input id={id} type={type} className="input" defaultValue={value} />
          </div>
        ))}

        {/* Save row */}
        <div className={styles.settingsSaveRow}>
          <button
            className="btn btn-primary"
            onClick={() => addToast('Đã cập nhật thông tin tài khoản thành công!', 'success')}
          >
            <CheckCircle size={15} /> Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Danger Zone / Logout */}
      <div className={styles.dangerZone}>
        <h3 className={styles.dangerTitle}>
          <LogOut size={18} /> Quản lý phiên đăng nhập
        </h3>
        <p className={styles.dangerDesc}>
          Đăng xuất khỏi phiên làm việc hiện tại trên thiết bị này. Dữ liệu bộ sưu tập, hồ sơ đấu giá kín và đơn hàng ký quỹ của bạn vẫn được lưu trữ an toàn trên Artisan Hub.
        </p>
        <div>
          <button
            id="settings-logout-btn"
            className="btn btn-danger"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            onClick={() => {
              onLogout?.();
              navigate('/');
            }}
          >
            <LogOut size={16} /> Đăng xuất tài khoản
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePage;
