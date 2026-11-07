import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, Package, Award, Clock, Shield, ArrowRight,
  CheckCircle, Download, QrCode, ExternalLink, Lock,
  PlusCircle, LayoutDashboard, Trophy, MessageSquare, AlertCircle, TrendingUp, LogOut, Palette,
  ShieldAlert, CheckCircle2, RotateCcw, Settings as SettingsIcon, UserCog,
  Truck, Copy, Check, Search, Filter, Receipt, FileText, ChevronRight, Eye, ShieldCheck, MapPin, Phone, CreditCard, Sparkles, Printer, X, DollarSign, Wallet, Building2, Send, ChevronDown,
  Edit3, Trash2
} from 'lucide-react';
import {
  ARTWORKS, AUCTION_SESSIONS, BID_HISTORY, formatPrice, formatPriceFull
} from '../data/mockData';
import CreateAuctionModal from '../components/CreateAuctionModal';
import ArtistSessionDashboardModal from '../components/ArtistSessionDashboardModal';
import UploadArtworkModal from '../components/UploadArtworkModal';
import ConfirmDeliveryModal from '../components/ConfirmDeliveryModal';
import ReportIssueModal from '../components/ReportIssueModal';
import SealedBidModal from '../components/SealedBidModal';
import styles from './ProfilePage.module.css';

const ARTIST_TABS = [
  'Quản lý bài đăng',
  'Quản lý đơn hàng',
  'Vận chuyển',
  'Hồ sơ họa sĩ'
];

const COLLECTOR_TABS = [
  'Bộ sưu tập & Chứng chỉ số',
  'Đơn hàng & Ký quỹ',
  'Hồ sơ & Bảo mật'
];

const ProfilePage = ({ currentUser, addToast, onLogout, onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isArtist = currentUser?.role === 'artist';
  const currentTabs = isArtist ? ARTIST_TABS : COLLECTOR_TABS;

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (isArtist) {
      if (tabParam === 'artworks' || tabParam === 'posts' || tabParam === 'bai-dang' || location.state?.tab === 'Quản lý bài đăng' || location.state?.tab === 'Tác phẩm & Phiên đấu giá') return 'Quản lý bài đăng';
      if (tabParam === 'orders' || tabParam === 'don-hang' || location.state?.tab === 'Quản lý đơn hàng' || location.state?.tab === 'Ví & Doanh thu') return 'Quản lý đơn hàng';
      if (tabParam === 'shipping' || tabParam === 'van-chuyen' || location.state?.tab === 'Vận chuyển') return 'Vận chuyển';
      if (tabParam === 'profile' || tabParam === 'kyc' || location.state?.tab === 'Hồ sơ họa sĩ' || location.state?.tab === 'Hồ sơ & Xác thực') return 'Hồ sơ họa sĩ';
      if (location.state?.tab && ARTIST_TABS.includes(location.state.tab)) return location.state.tab;
      return 'Quản lý bài đăng';
    } else {
      if (location.state?.tab === 'Bộ sưu tập' || location.state?.tab === 'Chứng chỉ số') return 'Bộ sưu tập & Chứng chỉ số';
      if (location.state?.tab === 'Đơn hàng & Ký quỹ' || location.state?.tab === 'orders' || location.state?.tab === 'Phiên của tôi') return 'Đơn hàng & Ký quỹ';
      if (location.state?.tab === 'Cài đặt' || location.state?.tab === 'profile') return 'Hồ sơ & Bảo mật';
      if (location.state?.tab && COLLECTOR_TABS.includes(location.state.tab)) return location.state.tab;
      if (tabParam === 'orders' || tabParam === 'don-hang') return 'Đơn hàng & Ký quỹ';
      if (tabParam === 'profile' || tabParam === 'settings') return 'Hồ sơ & Bảo mật';
      return 'Bộ sưu tập & Chứng chỉ số';
    }
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (isArtist) {
      if (tabParam === 'artworks' || tabParam === 'posts' || tabParam === 'bai-dang') setActiveTab('Quản lý bài đăng');
      else if (tabParam === 'orders' || tabParam === 'don-hang') setActiveTab('Quản lý đơn hàng');
      else if (tabParam === 'shipping' || tabParam === 'van-chuyen') setActiveTab('Vận chuyển');
      else if (tabParam === 'profile' || tabParam === 'kyc') setActiveTab('Hồ sơ họa sĩ');
      else if (!ARTIST_TABS.includes(activeTab)) setActiveTab('Quản lý bài đăng');
    } else {
      if (tabParam === 'orders' || tabParam === 'don-hang') setActiveTab('Đơn hàng & Ký quỹ');
      else if (tabParam === 'profile' || tabParam === 'settings') setActiveTab('Hồ sơ & Bảo mật');
      else if (!COLLECTOR_TABS.includes(activeTab)) setActiveTab('Bộ sưu tập & Chứng chỉ số');
    }
  }, [location.search, isArtist]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'upload' && isArtist) {
      setUploadArtworkOpen(true);
    }
  }, [location.search, isArtist]);

  React.useEffect(() => {
    const handleOpenUpload = () => setUploadArtworkOpen(true);
    window.addEventListener('open-artist-upload', handleOpenUpload);
    return () => window.removeEventListener('open-artist-upload', handleOpenUpload);
  }, []);

  React.useEffect(() => {
    if (location.state?.tab) {
      if (isArtist) {
        if (location.state.tab === 'Quản lý tác phẩm' || location.state.tab === 'Quản lý bài đăng' || location.state.tab === 'Tác phẩm & Phiên đấu giá') setActiveTab('Quản lý bài đăng');
        else if (location.state.tab === 'Đơn hàng & Ký quỹ' || location.state.tab === 'Quản lý đơn hàng' || location.state.tab === 'wallet') setActiveTab('Quản lý đơn hàng');
        else if (location.state.tab === 'Vận chuyển' || location.state.tab === 'shipping') setActiveTab('Vận chuyển');
        else if (location.state.tab === 'Cài đặt' || location.state.tab === 'Hồ sơ họa sĩ' || location.state.tab === 'Hồ sơ & Xác thực') setActiveTab('Hồ sơ họa sĩ');
        else if (ARTIST_TABS.includes(location.state.tab)) setActiveTab(location.state.tab);
      } else {
        if (location.state.tab === 'Bộ sưu tập' || location.state.tab === 'Chứng chỉ số') setActiveTab('Bộ sưu tập & Chứng chỉ số');
        else if (location.state.tab === 'Đơn hàng & Ký quỹ' || location.state.tab === 'orders' || location.state.tab === 'Phiên của tôi') setActiveTab('Đơn hàng & Ký quỹ');
        else if (location.state.tab === 'Cài đặt' || location.state.tab === 'profile') setActiveTab('Hồ sơ & Bảo mật');
        else if (COLLECTOR_TABS.includes(location.state.tab)) setActiveTab(location.state.tab);
      }
    }
  }, [location.state, isArtist]);

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
          Hồ Sơ & Không Gian Tài Khoản
        </h2>
        <p style={{ maxWidth: 480, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Vui lòng đăng nhập để quản lý tác phẩm độc bản, theo dõi các phiên đấu giá kín (Sealed-Bid) & công khai (Live), giám sát hợp đồng bảo chứng Escrow 72h và Thẻ chứng nhận số SHA-256.
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

  // Artist metrics
  const artistStats = [
    { value: '6', label: 'Tác phẩm đã đăng' },
    { value: '4', label: 'Đơn hàng đã bán' },
    { value: '₫185.0M', label: 'Doanh thu bán tranh' },
  ];

  // Collector metrics
  const collectorStats = [
    { value: '3', label: 'Tác phẩm sở hữu' },
    { value: '5', label: 'Phiên tham gia (Kín & Live)' },
    { value: '₫125.0M', label: 'Tổng giá trị sưu tầm' },
  ];

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
                {isArtist ? (
                  <span className="badge badge-verified">
                    <ShieldCheck size={12} /> Họa sĩ xác thực (Master Artist)
                  </span>
                ) : (
                  <span className="badge badge-verified">
                    <Award size={12} /> {currentUser.collector_type || 'Nhà sưu tầm tư nhân (Collector)'}
                  </span>
                )}
                <span className="badge badge-gold">
                  Cấp L{currentUser.kyc_level || (isArtist ? 3 : 2)} eKYC
                </span>
              </div>
              <p className={styles.profileUsername}>@{currentUser.username}</p>

              {/* Dynamic metrics based on role */}
              <div className={styles.profileStats}>
                {(isArtist ? artistStats : collectorStats).map(({ value, label }) => (
                  <div key={label} className={styles.profileStat}>
                    <span className={styles.profileStatVal}>{value}</span>
                    <span className={styles.profileStatLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions: Strictly separated by role */}
            <div className={styles.profileHeroActions}>
              {isArtist ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.22)',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#4ade80'
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)' }} />
                  <span>Kênh họa sĩ đang hoạt động</span>
                </div>
              ) : (
                <>
                  <Link
                    to="/auction"
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Search size={16} /> Khám phá sàn đấu giá
                  </Link>
                  <button
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: 'var(--border-gold)' }}
                    onClick={() => setActiveTab('Bộ sưu tập & Chứng chỉ số')}
                  >
                    <Package size={16} color="var(--gold-primary)" /> Bộ sưu tập của tôi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Streamlined Tabs: 4 tabs for Artist, 3 tabs for Collector */}
        <div className={styles.tabs} style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 6 }}>
          {currentTabs.map(tab => (
            <button
              key={tab}
              id={`profile-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => {
                setActiveTab(tab);
                if (isArtist) {
                  const tabMap = {
                    'Quản lý bài đăng': 'artworks',
                    'Quản lý đơn hàng': 'orders',
                    'Vận chuyển': 'shipping',
                    'Hồ sơ họa sĩ': 'profile',
                  };
                  navigate(`/profile?tab=${tabMap[tab] || 'artworks'}`, { replace: true });
                } else {
                  const tabMap = {
                    'Bộ sưu tập & Chứng chỉ số': 'collection',
                    'Đơn hàng & Ký quỹ': 'orders',
                    'Hồ sơ & Bảo mật': 'settings',
                  };
                  navigate(`/profile?tab=${tabMap[tab] || 'collection'}`, { replace: true });
                }
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ARTIST TAB 1: Quản lý bài đăng */}
        {isArtist && activeTab === 'Quản lý bài đăng' && (
          <ArtistPostManagementTab
            currentUser={currentUser}
            onOpenUpload={() => setUploadArtworkOpen(true)}
            artworksVersion={artworksVersion}
            addToast={addToast}
          />
        )}

        {/* ARTIST TAB 2: Quản lý đơn hàng */}
        {isArtist && activeTab === 'Quản lý đơn hàng' && (
          <ArtistOrderManagementTab
            currentUser={currentUser}
            onGoToShipping={() => setActiveTab('Vận chuyển')}
            addToast={addToast}
          />
        )}

        {/* ARTIST TAB 3: Vận chuyển */}
        {isArtist && activeTab === 'Vận chuyển' && (
          <ArtistShippingTab
            currentUser={currentUser}
            addToast={addToast}
          />
        )}

        {/* ARTIST TAB 4: Hồ sơ họa sĩ */}
        {isArtist && activeTab === 'Hồ sơ họa sĩ' && (
          <ArtistProfileAndVerificationTab
            user={currentUser}
            addToast={addToast}
            onLogout={onLogout}
            navigate={navigate}
          />
        )}

        {/* COLLECTOR TAB 1: Bộ sưu tập & Chứng chỉ số */}
        {!isArtist && activeTab === 'Bộ sưu tập & Chứng chỉ số' && (
          <CollectorCollectionAndCertificatesTab
            currentUser={currentUser}
            addToast={addToast}
            navigate={navigate}
          />
        )}

        {/* COLLECTOR TAB 2: Đơn hàng & Ký quỹ */}
        {!isArtist && activeTab === 'Đơn hàng & Ký quỹ' && (
          <CollectorOrdersAndAuctionsTab
            currentUser={currentUser}
            addToast={addToast}
            onRaiseBid={(sess, existingBid, artwork) => {
              setRaiseBidSession({ session: sess, existingBid, artwork });
            }}
            onViewCertificates={(order) => {
              setActiveTab('Bộ sưu tập & Chứng chỉ số');
            }}
          />
        )}

        {/* COLLECTOR TAB 3: Hồ sơ & Bảo mật */}
        {!isArtist && activeTab === 'Hồ sơ & Bảo mật' && (
          <CollectorProfileAndSecurityTab
            user={currentUser}
            addToast={addToast}
            onLogout={onLogout}
            navigate={navigate}
          />
        )}
      </div>

      {/* Upload Artwork Modal (Artist) */}
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

      {/* Create Auction Modal (Artist) */}
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
            addToast(`✦ Đã chuyển sang quản lý tiền Escrow bảo chứng cho tác phẩm "${art.title}"!`, 'gold');
            setActiveTab('Ví & Doanh thu');
          }}
          onEndSessionNow={(sid) => {
            dashboardSession.status = 'ended';
          }}
          addToast={addToast}
        />
      )}

      {/* Sealed Bid / Raise Bid Modal (Collector) */}
      {raiseBidSession && (
        <SealedBidModal
          session={raiseBidSession.session}
          artwork={raiseBidSession.artwork}
          existingBid={raiseBidSession.existingBid}
          currentUser={currentUser}
          onClose={() => setRaiseBidSession(null)}
          onSubmitBid={(bidData) => {
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
            setRaiseBidSession(null);
          }}
        />
      )}
    </main>
  );
};


/* ===== COLLECTOR COMPONENTS & MODALS ===== */

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


/* ==========================================================================
   COLLECTOR TAB 1: BỘ SƯU TẬP & CHỨNG CHỈ SỐ (Collection & SHA-256 Certificates)
   ========================================================================== */
const CollectorCollectionAndCertificatesTab = ({ currentUser, addToast, navigate }) => {
  const [subTab, setSubTab] = useState('collection'); // 'collection' | 'certs'
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [focusedCertId, setFocusedCertId] = useState('AH-CERT-2024-0042');

  const ownedArtworks = React.useMemo(() => {
    return ARTWORKS.filter(a => a.artwork_id === 'aw2' || a.artwork_id === 'aw1' || a.artwork_id === 'aw3');
  }, []);

  const allCerts = React.useMemo(() => {
    return getAllPurchasedCertificates(currentUser);
  }, [currentUser]);

  return (
    <div className={styles.tabContent}>
      {/* Sub-navigation Pills */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn ${subTab === 'collection' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem' }}
          onClick={() => setSubTab('collection')}
        >
          <Package size={16} /> Tác phẩm độc bản đã sở hữu ({ownedArtworks.length})
        </button>
        <button
          type="button"
          className={`btn ${subTab === 'certs' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem' }}
          onClick={() => setSubTab('certs')}
        >
          <ShieldCheck size={16} /> Thẻ chứng nhận số SHA-256 ({allCerts.length})
        </button>
      </div>

      {subTab === 'collection' && (
        <>
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
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedArtwork(artwork)}
                        title="Xem nhanh thông tin tác phẩm"
                      >
                        <Eye size={12} /> Xem nhanh
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          const targetCert = allCerts.find(c => c.artwork_id === artwork.artwork_id);
                          if (targetCert) setFocusedCertId(targetCert.certificate_id);
                          setSubTab('certs');
                        }}
                        title="Xem chứng chỉ số SHA-256"
                        style={{ color: 'var(--gold-primary)' }}
                      >
                        <ShieldCheck size={12} /> Chứng nhận
                      </button>
                      <Link
                        to={`/artwork/${artwork.artwork_id}?owned=true`}
                        state={{ isOwned: true }}
                        className="btn btn-secondary btn-sm"
                        title="Xem chi tiết đầy đủ & 3D vệt cọ"
                      >
                        Chi tiết <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Owned Artwork Modal */}
          {selectedArtwork && (
            <OwnedArtworkModal
              artwork={selectedArtwork}
              onClose={() => setSelectedArtwork(null)}
              addToast={addToast}
            />
          )}
        </>
      )}

      {subTab === 'certs' && (
        <CertificatesTab
          addToast={addToast}
          selectedCertTarget={{ certificateId: focusedCertId }}
          currentUser={currentUser}
          onNavigateToArtwork={(artId) => navigate(`/artwork/${artId}?owned=true`, { state: { isOwned: true } })}
          onNavigateToOrders={() => {}}
        />
      )}
    </div>
  );
};

/* ==========================================================================
   COLLECTOR TAB 2: ĐƠN HÀNG & KÝ QUỸ (Orders, 72h Escrow & Participated Bids)
   ========================================================================== */
const CollectorOrdersAndAuctionsTab = ({ currentUser, addToast, onRaiseBid, onViewCertificates }) => {
  const [subTab, setSubTab] = useState('orders'); // 'orders' | 'auctions'

  return (
    <div className={styles.tabContent}>
      {/* Sub-navigation Pills */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn ${subTab === 'orders' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem' }}
          onClick={() => setSubTab('orders')}
        >
          <Shield size={16} /> Đơn hàng Ký quỹ Escrow 72h (3)
        </button>
        <button
          type="button"
          className={`btn ${subTab === 'auctions' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem' }}
          onClick={() => setSubTab('auctions')}
        >
          <TrendingUp size={16} /> Phiên đấu giá đang ra giá (2)
        </button>
      </div>

      {subTab === 'orders' && (
        <OrdersAndEscrowTab
          addToast={addToast}
          onViewCertificates={onViewCertificates}
        />
      )}

      {subTab === 'auctions' && (
        <MyAuctionsTab
          currentUser={currentUser}
          onRaiseBid={onRaiseBid}
          addToast={addToast}
        />
      )}
    </div>
  );
};

/* ==========================================================================
   COLLECTOR TAB 3: HỒ SƠ & BẢO MẬT (Collector eKYC L2, Delivery Address, Bank, 2FA)
   ========================================================================== */
const CollectorProfileAndSecurityTab = ({ user, addToast, onLogout, navigate }) => {
  const [copiedBank, setCopiedBank] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [collectorBio, setCollectorBio] = useState('Yêu thích các tác phẩm sơn dầu đắp nổi và sơn mài truyền thống độc bản, chú trọng tính pháp lý minh bạch và Thẻ chứng nhận số SHA-256 bảo chứng.');

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedBank(true);
    addToast?.('Đã sao chép số tài khoản hoàn tiền Napas!', 'success');
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <div className={styles.tabContent}>
      {/* Title */}
      <div className={styles.kycTabHeader}>
        <div>
          <h2 className={styles.tabTitle} style={{ margin: '0 0 4px' }}>Hồ sơ Nhà sưu tầm & Cài đặt bảo mật</h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Quản lý thông tin định danh eKYC Cấp L2, địa chỉ giao nhận mỹ thuật bảo hiểm và tài khoản hoàn tiền ký quỹ tự động.
          </p>
        </div>
        <span className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Award size={14} /> VIP Private Collector
        </span>
      </div>

      <div className={styles.kycTwoColGrid}>
        {/* CỘT 1 (BÊN TRÁI): THÔNG TIN & ĐỊA CHỈ GIAO NHẬN */}
        <div className={styles.kycColumn}>
          {/* 1. Thông tin cá nhân & Gu thẩm mỹ */}
          <div className={styles.kycCard}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(197, 160, 89, 0.12)', color: 'var(--gold-primary)' }}>
                  <UserCog size={20} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Thông tin Nhà sưu tầm</h3>
                  <span className={styles.kycCardSubtitle}>Hồ sơ hiển thị trong các phiên đấu giá kín</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setPreferencesSaved(true);
                  addToast?.('Đã lưu thông tin cá nhân thành công!', 'success');
                  setTimeout(() => setPreferencesSaved(false), 2500);
                }}
                style={{ fontSize: '0.75rem' }}
              >
                {preferencesSaved ? <Check size={14} color="var(--success)" /> : 'Lưu'}
              </button>
            </div>

            <div className={styles.credentialsList}>
              <div className={styles.credentialRow}>
                <span className={styles.credentialLabel}>Họ và tên thật</span>
                <span className={styles.credentialValue}>{user.full_name}</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credentialLabel}>Phân loại thành viên</span>
                <span className={styles.credentialValue} style={{ color: 'var(--gold-light)' }}>
                  {user.collector_type || 'Nhà sưu tầm tư nhân (Private Collector)'}
                </span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credentialLabel}>Email liên hệ</span>
                <span className={styles.credentialValue}>{user.email}</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credentialLabel}>Trường phái quan tâm</span>
                <div className={styles.materialTags}>
                  <span className={styles.materialTag}>Độc bản 1/1</span>
                  <span className={styles.materialTag}>Sơn mài 9 lớp</span>
                  <span className={styles.materialTag}>Sơn dầu đắp nổi</span>
                  <span className={styles.materialTag}>Mỹ thuật Đông Dương</span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
                Ghi chú thẩm mỹ & Triết lý sưu tầm:
              </label>
              <textarea
                className={styles.statementTextarea}
                rows={3}
                value={collectorBio}
                onChange={(e) => setCollectorBio(e.target.value)}
                placeholder="Nhập ghi chú phong cách và không gian trưng bày..."
              />
            </div>
          </div>

          {/* 2. Địa chỉ giao nhận bảo hiểm mặc định */}
          <div className={styles.kycCard}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' }}>
                  <MapPin size={20} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Địa chỉ Giao nhận Bảo hiểm</h3>
                  <span className={styles.kycCardSubtitle}>Tiêu chuẩn vận chuyển điều hòa mỹ thuật cao cấp</span>
                </div>
              </div>
            </div>

            <div className={styles.credentialsList}>
              <div className={styles.credentialRow}>
                <span className={styles.credentialLabel}>Người nhận</span>
                <span className={styles.credentialValue}><strong>{user.full_name}</strong> (091***4567)</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credentialLabel}>Địa chỉ tư gia</span>
                <span className={styles.credentialValue}>128 Đường Xuân Diệu, P. Quảng An, Tây Hồ, Hà Nội</span>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credentialLabel}>Quy chuẩn đóng gói</span>
                <span className={styles.credentialValue} style={{ color: 'var(--text-secondary)' }}>Kiện gỗ thông xông hơi khử trùng chống ẩm, xe điều hòa 55% RH</span>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT 2 (BÊN PHẢI): ĐỊNH DANH EKYC, TÀI KHOẢN & BẢO MẬT */}
        <div className={styles.kycColumn}>
          {/* 1. Thẻ Định danh Nhà sưu tầm Cấp L2 */}
          <div className={`${styles.kycCard} ${styles.kycCardGold}`}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(197, 160, 89, 0.15)', color: 'var(--gold-primary)' }}>
                  <Award size={22} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Định danh Nhà sưu tầm Cấp L2</h3>
                  <span style={{ fontSize: '0.74rem', color: '#2ECC71', fontWeight: 600 }}>
                    ✓ Đã kiểm định sinh trắc học VNeID
                  </span>
                </div>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                COLLECTOR VERIFIED
              </span>
            </div>

            <div className={styles.idGrid}>
              <div className={styles.idCell}>
                <span className={styles.idCellLabel}>Họ và tên</span>
                <strong className={styles.idCellValue}>{user.full_name}</strong>
              </div>
              <div className={styles.idCell}>
                <span className={styles.idCellLabel}>Mã định danh</span>
                <strong className={styles.idCellValue} style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>
                  VN-COL-2024-042
                </strong>
              </div>
              <div className={styles.idCell}>
                <span className={styles.idCellLabel}>CCCD gắn chip</span>
                <strong className={styles.idCellValue} style={{ fontFamily: 'var(--font-mono)' }}>
                  079***004521
                </strong>
              </div>
              <div className={styles.idCell}>
                <span className={styles.idCellLabel}>Liên hệ xác thực</span>
                <strong className={styles.idCellValue} style={{ color: '#2ECC71' }}>
                  Chính chủ 100%
                </strong>
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 700 }}>
                Đặc quyền Nhà sưu tầm Cấp L2
              </span>
              <div className={styles.privilegeRow}>
                <span className={styles.privilegePill}>
                  <span>⚡</span> Đấu giá kín không giới hạn
                </span>
                <span className={styles.privilegePill}>
                  <span>📜</span> Thẻ chứng nhận số SHA-256
                </span>
                <span className={styles.privilegePill}>
                  <span>🛡️</span> Ký quỹ Escrow bảo vệ 72h
                </span>
              </div>
            </div>
          </div>

          {/* 2. Tài khoản hoàn tiền ký quỹ (Napas 247) */}
          <div className={styles.kycCard}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                  <Building2 size={20} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Tài khoản Hoàn tiền Ký quỹ</h3>
                  <span className={styles.kycCardSubtitle}>Tự động hoàn cọc trong 5 phút nếu phiên không trúng</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => addToast?.('Chức năng cập nhật tài khoản yêu cầu xác thực OTP bảo mật!', 'info')}
                style={{ fontSize: '0.75rem' }}
              >
                Thay đổi
              </button>
            </div>

            <div className={styles.bankCardBox}>
              <div className={styles.bankCardHeader}>
                <span className={styles.bankBrandName}>VIETCOMBANK</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--gold-light)', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '2px 8px', borderRadius: 4, background: 'rgba(197, 160, 89, 0.08)' }}>
                  Tài khoản nhận tiền
                </span>
              </div>
              <div className={styles.bankAccNumber}>
                <span>0071 0008 8688 6</span>
                <button
                  type="button"
                  className={styles.copyIconBtn}
                  onClick={() => handleCopy('0071000886886')}
                  title="Sao chép số tài khoản"
                >
                  {copiedBank ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                </button>
              </div>
              <div className={styles.bankCardFooter}>
                <span>Chủ TK: <strong style={{ color: 'var(--text-primary)' }}>{user.full_name?.toUpperCase()}</strong></span>
                <span>Chi nhánh: Sở Giao Dịch Hà Nội</span>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              ✓ Hoàn trả tức thời 100% tiền đặt cọc qua cổng Napas 247 khi kết thúc phiên đấu giá kín.
            </p>
          </div>

          {/* 3. Cài đặt bảo mật & Đăng xuất */}
          <div className={styles.kycCard} style={{ padding: '18px 24px', gap: 14 }}>
            <div className={styles.securityItem}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>
                  Xác thực 2 lớp (2FA)
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Bảo vệ nộp hồ sơ đấu giá kín & giải ngân</span>
              </div>
              <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ECC71', fontSize: '0.72rem' }}>
                Đang bật
              </span>
            </div>

            <div className={styles.securityItem}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>
                  Đổi mật khẩu
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Cập nhật lần cuối 30 ngày trước</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => addToast?.('Liên kết đổi mật khẩu đã gửi về email!', 'info')}
                style={{ fontSize: '0.75rem' }}
              >
                Đổi mật khẩu
              </button>
            </div>

            <div className={styles.securityItem} style={{ borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: 14, marginTop: 4 }}>
              <div>
                <span style={{ display: 'block', color: '#f87171', fontWeight: 600, fontSize: '0.84rem' }}>
                  Đăng xuất tài khoản
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Thoát phiên làm việc trên thiết bị này</span>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}
                onClick={() => {
                  onLogout?.();
                  navigate('/');
                }}
              >
                <LogOut size={13} /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ==========================================================================
   TAB 1: QUẢN LÝ BÀI ĐĂNG (Artist Post & Artwork Management)
   - Đăng bài mới, xem, sửa thông tin, xóa bài đăng
   - Lọc theo: Tất cả, Đang bán, Đã bán, Chờ duyệt
   ========================================================================== */
const ArtistPostManagementTab = ({ currentUser, onOpenUpload, artworksVersion, addToast }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [deleteConfirmArtwork, setDeleteConfirmArtwork] = useState(null);

  const [posts, setPosts] = useState(() => {
    const list = ARTWORKS.filter(a => a.artist_id === currentUser.user_id || currentUser.role === 'artist');
    return list.map((art, idx) => ({
      ...art,
      post_status: idx === 1 || idx === 3 ? 'sold' : (idx === 4 ? 'pending' : 'selling'),
      price_val: art.current_price || art.price || 25000000,
      views: 120 + idx * 45,
      likes: 24 + idx * 11,
      posted_date: '02/11/2026'
    }));
  });

  React.useEffect(() => {
    const list = ARTWORKS.filter(a => a.artist_id === currentUser.user_id || currentUser.role === 'artist');
    setPosts(list.map((art, idx) => ({
      ...art,
      post_status: art.post_status || (idx === 1 || idx === 3 ? 'sold' : (idx === 4 ? 'pending' : 'selling')),
      price_val: art.price_val || art.current_price || art.price || 25000000,
      views: art.views || (120 + idx * 45),
      likes: art.likes || (24 + idx * 11),
      posted_date: art.posted_date || '02/11/2026'
    })));
  }, [artworksVersion]);

  const handleDelete = (artId) => {
    setPosts(prev => prev.filter(p => p.artwork_id !== artId));
    setDeleteConfirmArtwork(null);
    addToast?.('✦ Đã xóa bài đăng tác phẩm thành công!', 'info');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingArtwork) return;
    setPosts(prev => prev.map(p => p.artwork_id === editingArtwork.artwork_id ? editingArtwork : p));
    addToast?.(`✦ Cập nhật bài đăng "${editingArtwork.title}" thành công!`, 'success');
    setEditingArtwork(null);
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'selling' && post.post_status !== 'selling') return false;
    if (filter === 'sold' && post.post_status !== 'sold') return false;
    if (filter === 'pending' && post.post_status !== 'pending') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return post.title.toLowerCase().includes(q) || (post.medium && post.medium.toLowerCase().includes(q));
    }
    return true;
  });

  const sellingCount = posts.filter(p => p.post_status === 'selling').length;
  const soldCount = posts.filter(p => p.post_status === 'sold').length;
  const pendingCount = posts.filter(p => p.post_status === 'pending').length;

  return (
    <div className={styles.tabContent}>
      {/* Header */}
      <div style={{
        marginBottom: 20
      }}>
        <h2 className={styles.tabTitle} style={{ margin: 0 }}>Quản lý bài đăng tác phẩm</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Đăng bài sáng tác mới, theo dõi lượt xem, quản lý trạng thái niêm yết và chỉnh sửa thông tin tranh.
        </p>
      </div>

      {/* Toolbar & Filter Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Tất cả (${posts.length})` },
            { id: 'selling', label: `Đang bán (${sellingCount})` },
            { id: 'sold', label: `Đã bán (${soldCount})` },
            { id: 'pending', label: `Chờ duyệt (${pendingCount})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`${styles.filterPill} ${filter === f.id ? styles.filterPillActive : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.searchBox} style={{ maxWidth: 280 }}>
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên tranh, chất liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Post List */}
      {filteredPosts.length === 0 ? (
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 16,
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <Palette size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Không tìm thấy bài đăng nào
          </p>
          <p style={{ fontSize: '0.8rem', margin: '0 0 16px' }}>
            Bạn có thể đăng bài tác phẩm mới để chia sẻ với cộng đồng nhà sưu tầm.
          </p>
          <button className="btn btn-primary btn-sm" onClick={onOpenUpload}>
            <PlusCircle size={14} /> Đăng bài mới ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredPosts.map(art => {
            const isSold = art.post_status === 'sold';
            const isPending = art.post_status === 'pending';

            return (
              <div
                key={art.artwork_id}
                style={{
                  background: 'var(--bg-elevated)',
                  border: isSold ? '1px solid rgba(197, 160, 89, 0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                  transition: 'border-color 0.2s ease, transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 280, flex: 1 }}>
                  <img
                    src={art.image}
                    alt={art.title}
                    style={{ width: 84, height: 84, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>Độc bản 1/1</span>
                      {isSold ? (
                        <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ECC71', border: '1px solid rgba(46, 204, 113, 0.3)', fontSize: '0.7rem' }}>
                          <CheckCircle2 size={11} /> Đã bán
                        </span>
                      ) : isPending ? (
                        <span className="badge" style={{ background: 'rgba(243, 156, 18, 0.15)', color: '#F39C12', border: '1px solid rgba(243, 156, 18, 0.3)', fontSize: '0.7rem' }}>
                          <Clock size={11} /> Chờ duyệt
                        </span>
                      ) : (
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                          ● Đang niêm yết bán
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', fontFamily: 'var(--font-brand)', color: 'var(--text-primary)' }}>
                      {art.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {art.medium} · {art.dimensions} · Sáng tác năm {art.year || 2026}
                    </p>
                    <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>👁️ {art.views} lượt xem</span>
                      <span>❤️ {art.likes} lượt thích</span>
                      <span>📅 Ngày đăng: {art.posted_date}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right', minWidth: 140 }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isSold ? 'Giá đã bán' : 'Giá niêm yết'}
                    </span>
                    <p style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                      {formatPriceFull(art.price_val)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Link
                      to={`/artwork/${art.artwork_id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
                      title="Xem trang chi tiết bài đăng"
                    >
                      <Eye size={14} /> Xem bài
                    </Link>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
                      onClick={() => setEditingArtwork({ ...art })}
                      title="Chỉnh sửa bài đăng"
                    >
                      <Edit3 size={14} /> Sửa
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#ef4444' }}
                      onClick={() => setDeleteConfirmArtwork(art)}
                      title="Xóa bài đăng tác phẩm"
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Artwork Modal */}
      {editingArtwork && (
        <div className={styles.invoiceModalOverlay} onClick={(e) => e.target === e.currentTarget && setEditingArtwork(null)}>
          <div className={styles.invoiceModalBox} style={{ maxWidth: 560 }}>
            <div className={styles.invoiceHeader}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                  Chỉnh sửa bài đăng
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Cập nhật thông tin tác phẩm "${editingArtwork.title}"
                </p>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setEditingArtwork(null)} style={{ borderRadius: '50%' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Tên tác phẩm *
                </label>
                <input
                  type="text"
                  className="input"
                  value={editingArtwork.title}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Chất liệu
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingArtwork.medium}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, medium: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Kích thước
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingArtwork.dimensions}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, dimensions: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Giá bán niêm yết (VNĐ) *
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={editingArtwork.price_val}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, price_val: parseInt(e.target.value, 10) || 0 })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Trạng thái bài đăng
                  </label>
                  <select
                    className="input"
                    value={editingArtwork.post_status}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, post_status: e.target.value })}
                    style={{ background: 'var(--bg-elevated)' }}
                  >
                    <option value="selling">Đang bán</option>
                    <option value="sold">Đã bán</option>
                    <option value="pending">Chờ duyệt</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingArtwork(null)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Check size={16} /> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmArtwork && (
        <div className={styles.invoiceModalOverlay} onClick={(e) => e.target === e.currentTarget && setDeleteConfirmArtwork(null)}>
          <div className={styles.invoiceModalBox} style={{ maxWidth: 440 }}>
            <h3 style={{ margin: '0 0 10px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trash2 size={20} /> Xác nhận xóa bài đăng
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Bạn có chắc chắn muốn xóa bài đăng <strong>"${deleteConfirmArtwork.title}"</strong>? Tác phẩm này sẽ không còn hiển thị trên gallery công khai.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setDeleteConfirmArtwork(null)}>
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirmArtwork.artwork_id)}
                style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   TAB 2: QUẢN LÝ ĐƠN HÀNG (Artist Order & Sales Management)
   - Giám sát các đơn hàng mua tranh từ collector
   - Tiền ký quỹ Escrow bảo chứng 72h
   - Bàn giao vận chuyển & xuất hóa đơn VAT điện tử
   ========================================================================== */
const ArtistOrderManagementTab = ({ currentUser, onGoToShipping, addToast }) => {
  const [filter, setFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [orders] = useState([
    {
      order_id: 'AH-ORD-2024-8924',
      created_at: '02/11/2026 14:30',
      artwork_id: 'aw2',
      title: 'Hoàng Hôn Sông Hương',
      image: '/gallery_2.png',
      buyer_name: 'Nguyễn Văn An',
      buyer_level: 'Patron Cấp L2',
      buyer_phone: '0903.882.194',
      buyer_address: '128 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      amount: 35000000,
      escrow_status: 'locked',
      escrow_text: 'Đang khóa Escrow 72h (Chờ giao hàng)',
      shipping_status: 'ready',
      shipping_code: 'AH-EXP-892401',
      vat_status: 'ready'
    },
    {
      order_id: 'AH-ORD-2024-9102',
      created_at: '03/11/2026 09:15',
      artwork_id: 'aw1',
      title: 'Mùa Vàng Tây Bắc',
      image: '/gallery_1.png',
      buyer_name: 'Phan Hoàng Yến Trang',
      buyer_level: 'VIP Patron Cấp L3',
      buyer_phone: '0918.423.901',
      buyer_address: 'Biệt thự đảo Vườn Mai, Khu đô thị Ecopark, Văn Giang, Hưng Yên',
      amount: 28500000,
      escrow_status: 'locked',
      escrow_text: 'Đang khóa Escrow 72h (Đang vận chuyển xe chuyên dụng)',
      shipping_status: 'in_transit',
      shipping_code: 'AH-EXP-928410',
      vat_status: 'ready'
    },
    {
      order_id: 'AH-ORD-2024-7620',
      created_at: '25/10/2026 16:40',
      artwork_id: 'aw3',
      title: 'Thiếu Nữ Bên Hoa Huệ',
      image: '/gallery_3.png',
      buyer_name: 'Đỗ Đức Huy',
      buyer_level: 'Collector Cấp L2',
      buyer_phone: '0982.771.029',
      buyer_address: '45 Lê Duẩn, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng',
      amount: 65000000,
      escrow_status: 'completed',
      escrow_text: 'Đã giải ngân 100% vào số dư khả dụng',
      shipping_status: 'delivered',
      shipping_code: 'AH-EXP-762019',
      vat_status: 'issued'
    },
    {
      order_id: 'AH-ORD-2024-6410',
      created_at: '12/10/2026 11:20',
      artwork_id: 'aw4',
      title: 'Bình Minh Trên Biển Đông',
      image: '/gallery_hero.png',
      buyer_name: 'Lê Thùy Chi',
      buyer_level: 'Patron Cấp L1',
      buyer_phone: '0933.119.824',
      buyer_address: '22 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, TP. Hà Nội',
      amount: 60000000,
      escrow_status: 'completed',
      escrow_text: 'Đã hoàn tất & Đã rút về ngân hàng',
      shipping_status: 'delivered',
      shipping_code: 'AH-EXP-641052',
      vat_status: 'issued'
    }
  ]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'ready' && order.shipping_status !== 'ready') return false;
    if (filter === 'in_transit' && order.shipping_status !== 'in_transit') return false;
    if (filter === 'completed' && order.escrow_status !== 'completed') return false;
    return true;
  });

  return (
    <div className={styles.tabContent}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 className={styles.tabTitle} style={{ margin: 0 }}>Quản lý đơn hàng mua tranh</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Theo dõi các đơn hàng phát sinh, cơ chế ký quỹ trung gian Escrow 72h chống gian lận và xuất hóa đơn VAT điện tử.
        </p>
      </div>

      {/* 3 Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-gold)',
          borderRadius: 14,
          padding: '18px 20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tổng đơn hàng
            </span>
            <Receipt size={18} color="var(--gold-primary)" />
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, fontFamily: 'var(--font-display)' }}>
            4 đơn hàng
          </p>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
            100% người mua đã thanh toán tiền vào sàn
          </span>
        </div>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid rgba(243, 156, 18, 0.4)',
          borderRadius: 14,
          padding: '18px 20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Đang ký quỹ Escrow (Chờ giao)
            </span>
            <Lock size={18} color="#F39C12" />
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F39C12', margin: 0, fontFamily: 'var(--font-display)' }}>
            ₫72.500.000
          </p>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
            Tự động giải ngân sau 72h nghiệm thu
          </span>
        </div>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid rgba(46, 204, 113, 0.35)',
          borderRadius: 14,
          padding: '18px 20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Doanh thu đã giải ngân
            </span>
            <CheckCircle2 size={18} color="#2ECC71" />
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2ECC71', margin: 0, fontFamily: 'var(--font-display)' }}>
            ₫112.500.000
          </p>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
            Đã thanh toán về số dư khả dụng
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `Tất cả đơn (${orders.length})` },
          { id: 'ready', label: 'Chờ giao hàng (1)' },
          { id: 'in_transit', label: 'Đang vận chuyển (1)' },
          { id: 'completed', label: 'Đã hoàn tất (2)' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`${styles.filterPill} ${filter === f.id ? styles.filterPillActive : ''}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredOrders.map(order => {
          const isCompleted = order.escrow_status === 'completed';
          const isReady = order.shipping_status === 'ready';
          const isInTransit = order.shipping_status === 'in_transit';

          return (
            <div
              key={order.order_id}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                paddingBottom: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                    {order.order_id}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Đặt lúc: {order.created_at}
                  </span>
                </div>
                <div>
                  {isCompleted ? (
                    <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ECC71', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                      <CheckCircle2 size={12} /> Hoàn tất đơn hàng
                    </span>
                  ) : isInTransit ? (
                    <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      <Truck size={12} /> Đang giao xe chuyên dụng
                    </span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(243, 156, 18, 0.15)', color: '#F39C12', border: '1px solid rgba(243, 156, 18, 0.3)' }}>
                      <Clock size={12} /> Chờ bàn giao xe vận chuyển
                    </span>
                  )}
                </div>
              </div>

              {/* Order Body */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
              }}>
                {/* Product info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 280, flex: 1 }}>
                  <img
                    src={order.image}
                    alt={order.title}
                    style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>
                      {order.title}
                    </h4>
                    <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Người mua: <strong>{order.buyer_name}</strong> ({order.buyer_level}) · ĐT: {order.buyer_phone}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      📍 Giao đến: {order.buyer_address}
                    </p>
                  </div>
                </div>

                {/* Amount & Escrow text */}
                <div style={{ textAlign: 'right', minWidth: 160 }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Giá trị đơn hàng
                  </span>
                  <p style={{ margin: '2px 0 4px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                    {formatPriceFull(order.amount)}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: isCompleted ? '#2ECC71' : '#F39C12', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <ShieldCheck size={12} /> {order.escrow_text}
                  </span>
                </div>
              </div>

              {/* Order Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 10,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: 12,
                flexWrap: 'wrap'
              }}>
                {isReady && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
                    onClick={onGoToShipping}
                  >
                    <Truck size={14} /> Bàn giao vận chuyển ({order.shipping_code})
                  </button>
                )}

                {isInTransit && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', borderColor: 'var(--border-gold)' }}
                    onClick={onGoToShipping}
                  >
                    <Truck size={14} /> Tra cứu vận đơn ({order.shipping_code})
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
                  onClick={() => setSelectedInvoice(order)}
                >
                  <FileText size={14} /> Xuất hóa đơn VAT
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* VAT Invoice Modal */}
      {selectedInvoice && (
        <ArtistVatInvoiceModal
          order={selectedInvoice}
          artistName={currentUser?.full_name || 'Họa sĩ Artisan Hub'}
          onClose={() => setSelectedInvoice(null)}
          addToast={addToast}
        />
      )}
    </div>
  );
};

/* ==========================================================================
   TAB 3: QUẢN LÝ VẬN CHUYỂN (Artist Shipping & Art Logistics Management)
   - Tiêu chuẩn đóng thùng gỗ định hình & xe chuyên dụng kiểm soát nhiệt ẩm
   - Thao tác: Xác nhận đã đóng thùng gỗ -> bàn giao tài xế
   - Thông tin tài xế, mã vận đơn, biển số xe
   ========================================================================== */
const ArtistShippingTab = ({ currentUser, addToast }) => {
  const [shipments, setShipments] = useState([
    {
      code: 'AH-EXP-892401',
      order_id: 'AH-ORD-2024-8924',
      title: 'Hoàng Hôn Sông Hương',
      image: '/gallery_2.png',
      dimensions: '80 x 120 cm (Khung gỗ sồi tự nhiên)',
      recipient_name: 'Nguyễn Văn An',
      recipient_phone: '0903.882.194',
      destination: '128 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      status: 'pending_packaging',
      carrier: 'Artisan Hub Fine Art Logistics',
      packaging_standard: 'Thùng gỗ sồi định hình hun trùng + Màng xốp EPS 5 lớp chống ẩm',
      driver_name: 'Đang chờ bàn giao',
      driver_phone: '1900 8824',
      eta: 'Dự kiến giao 2 ngày sau khi bàn giao xe'
    },
    {
      code: 'AH-EXP-928410',
      order_id: 'AH-ORD-2024-9102',
      title: 'Mùa Vàng Tây Bắc',
      image: '/gallery_1.png',
      dimensions: '100 x 150 cm (Sơn mài phủ bóng bảo vệ)',
      recipient_name: 'Phan Hoàng Yến Trang',
      recipient_phone: '0918.423.901',
      destination: 'Biệt thự đảo Vườn Mai, KĐT Ecopark, Văn Giang, Hưng Yên',
      status: 'in_transit',
      carrier: 'Fine Art Express (Xe kiểm soát vi khí hậu)',
      vehicle_plate: '29C-782.19',
      driver_name: 'Trần Quốc Dũng',
      driver_phone: '0912.839.201',
      eta: 'Hôm nay - Dự kiến 16:30',
      temperature: '21.5°C • Độ ẩm 54% (Ổn định)',
      packaging_standard: 'Thùng gỗ đóng đai thép + Niêm phong số điện tử SHA-256'
    },
    {
      code: 'AH-EXP-762019',
      order_id: 'AH-ORD-2024-7620',
      title: 'Thiếu Nữ Bên Hoa Huệ',
      image: '/gallery_3.png',
      dimensions: '90 x 120 cm (Sơn dầu đắp nổi)',
      recipient_name: 'Đỗ Đức Huy',
      recipient_phone: '0982.771.029',
      destination: '45 Lê Duẩn, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng',
      status: 'delivered',
      carrier: 'Fine Art Express Line 2',
      delivered_at: '26/10/2026 10:15',
      driver_name: 'Nguyễn Văn Cường',
      driver_phone: '0934.551.229',
      packaging_standard: 'Đã hoàn tất nghiệm thu & Đồng kiểm nguyên trạng 100%'
    }
  ]);

  const handleConfirmPackaging = (code) => {
    setShipments(prev => prev.map(s => {
      if (s.code === code) {
        return {
          ...s,
          status: 'ready_for_pickup',
          driver_name: 'Đội xe Fine Art Express #04',
          driver_phone: '0908.112.449',
          eta: 'Tài xế sẽ đến nhận kiện thùng gỗ trong 45 phút'
        };
      }
      return s;
    }));
    addToast?.(`✦ Đã xác nhận hoàn tất đóng thùng gỗ cho vận đơn ${code}! Đội xe chuyên dụng đang đến nhận tranh.`, 'success', 5000);
  };

  return (
    <div className={styles.tabContent}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 className={styles.tabTitle} style={{ margin: 0 }}>Quản lý vận chuyển tác phẩm mỹ thuật</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Giám sát quy trình giao nhận tranh với tiêu chuẩn thùng gỗ định hình chống sốc, xe chuyên dụng kiểm soát nhiệt ẩm và bảo hiểm 100%.
        </p>
      </div>

      {/* 4-Step Standard Guide */}
      <div style={{
        background: 'rgba(197, 160, 89, 0.05)',
        border: '1px solid rgba(197, 160, 89, 0.25)',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <ShieldCheck size={18} color="var(--gold-primary)" />
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quy trình giao nhận tác phẩm độc bản đạt chuẩn bảo tàng
          </h4>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          fontSize: '0.78rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-primary)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>1</span>
            <span><strong>Đóng gói thùng gỗ:</strong> Họa sĩ đóng thùng định hình + bọc 5 lớp màng xốp khí chống va đập.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-primary)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>2</span>
            <span><strong>Bàn giao xe chuyên dụng:</strong> Xe tải có hệ thống chống sốc bóng hơi và camera giám sát kiện hàng.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-primary)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>3</span>
            <span><strong>Kiểm soát nhiệt ẩm:</strong> Buồng xe giữ nhiệt độ 20-24°C, độ ẩm 50-60% bảo vệ lớp sơn và toan tranh.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-primary)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>4</span>
            <span><strong>Đồng kiểm & Ký nhận:</strong> Người mua mở thùng đồng kiểm hiện trạng, ký biên bản bàn giao an toàn.</span>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {shipments.map(s => {
          const isPending = s.status === 'pending_packaging';
          const isReadyPickup = s.status === 'ready_for_pickup';
          const isInTransit = s.status === 'in_transit';
          const isDelivered = s.status === 'delivered';

          return (
            <div
              key={s.code}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              {/* Parcel Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                paddingBottom: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
                    {s.code}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Mã đơn: {s.order_id}
                  </span>
                </div>

                <div>
                  {isDelivered ? (
                    <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ECC71', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                      <CheckCircle2 size={12} /> Đã giao thành công
                    </span>
                  ) : isInTransit ? (
                    <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      <Truck size={12} /> Đang trên xe giao hàng
                    </span>
                  ) : isReadyPickup ? (
                    <span className="badge" style={{ background: 'rgba(197, 160, 89, 0.2)', color: 'var(--gold-primary)', border: '1px solid var(--border-gold)' }}>
                      <Check size={12} /> Sẵn sàng bàn giao cho xe
                    </span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(243, 156, 18, 0.15)', color: '#F39C12', border: '1px solid rgba(243, 156, 18, 0.3)' }}>
                      <Package size={12} /> Chờ đóng gói thùng gỗ
                    </span>
                  )}
                </div>
              </div>

              {/* Parcel Body */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
                alignItems: 'center'
              }}>
                {/* Artwork info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img
                    src={s.image}
                    alt={s.title}
                    style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>
                      {s.title}
                    </h4>
                    <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Quy cách: {s.dimensions}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                      📦 {s.packaging_standard}
                    </p>
                  </div>
                </div>

                {/* Delivery details */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Người nhận: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{s.recipient_name}</strong> ({s.recipient_phone})
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Địa chỉ: </span>
                    <span>{s.destination}</span>
                  </div>
                  {s.vehicle_plate && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Xe vận chuyển: </span>
                      <strong style={{ color: 'var(--gold-primary)' }}>{s.vehicle_plate}</strong> ({s.carrier})
                    </div>
                  )}
                  {s.temperature && (
                    <div style={{ color: '#2ECC71', fontSize: '0.75rem' }}>
                      🌡️ {s.temperature}
                    </div>
                  )}
                  {s.delivered_at && (
                    <div style={{ color: '#2ECC71', fontSize: '0.75rem' }}>
                      ✓ Đã ký nhận lúc: {s.delivered_at}
                    </div>
                  )}
                </div>
              </div>

              {/* Parcel Footer Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: 12
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {s.driver_name !== 'Đang chờ bàn giao' && (
                    <span>Tài xế phụ trách: <strong>{s.driver_name}</strong> ({s.driver_phone})</span>
                  )}
                  {s.eta && <span style={{ marginLeft: 12, color: 'var(--gold-light)' }}>⏱ {s.eta}</span>}
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {isPending && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
                      onClick={() => handleConfirmPackaging(s.code)}
                    >
                      <Package size={14} /> Xác nhận đã đóng thùng gỗ chống ẩm
                    </button>
                  )}

                  {isInTransit && (
                    <a
                      href={`tel:${s.driver_phone}`}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', textDecoration: 'none' }}
                      onClick={() => addToast?.(`Đang kết nối cuộc gọi đến tài xế ${s.driver_name} (${s.driver_phone})...`, 'info')}
                    >
                      <Phone size={14} /> Gọi tài xế ({s.driver_phone})
                    </a>
                  )}

                  {isDelivered && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
                      onClick={() => addToast?.('Biên bản giao nhận điện tử đã lưu trữ an toàn trên hệ thống!', 'info')}
                    >
                      <FileText size={14} /> Biên bản bàn giao đã ký
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

/* ==========================================================================
   MODAL HÓA ĐƠN ĐIỆN TỬ VAT (Electronic VAT Invoice Modal)
   ========================================================================== */
const ArtistVatInvoiceModal = ({ order, artistName, onClose, addToast }) => {
  if (!order) return null;

  const invoiceNo = `INV-2026-${order.order_id.replace(/\D/g, '') || '892401'}`;
  const vatRate = 0.08;
  const subtotal = Math.round(order.amount / (1 + vatRate));
  const vatAmount = order.amount - subtotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.invoiceModalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.invoiceModalBox} style={{ maxWidth: 700, padding: 32 }}>
        {/* Modal Top Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
            HÓA ĐƠN ĐIỆN TỬ HỢP LỆ (BỘ TÀI CHÍNH)
          </span>
          <button className="btn btn-icon btn-ghost" onClick={onClose} style={{ borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {/* Invoice Paper Layout */}
        <div style={{
          background: '#fff',
          color: '#1a1a1a',
          borderRadius: 12,
          padding: '28px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Paper Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #b8860b', paddingBottom: 16, marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#8b6914', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#555' }}>
              Bản thể hiện của hóa đơn điện tử chuyển đổi theo Nghị định 123/2020/NĐ-CP
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8, fontSize: '0.76rem', color: '#666' }}>
              <span>Mẫu số: <strong>01GTKT0/001</strong></span>
              <span>Ký hiệu: <strong>AH/26E</strong></span>
              <span>Số HĐ: <strong style={{ color: '#b8860b' }}>{invoiceNo}</strong></span>
            </div>
          </div>

          {/* Seller & Buyer details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: '0.8rem', marginBottom: 18, borderBottom: '1px dashed #ccc', paddingBottom: 16 }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#777', textTransform: 'uppercase', fontWeight: 700 }}>Đơn vị bán hàng:</span>
              <p style={{ margin: '4px 0 2px', fontWeight: 700, fontSize: '0.88rem', color: '#111' }}>{artistName}</p>
              <p style={{ margin: '0 0 2px', color: '#555' }}>Mã số thuế: 8401928401-001</p>
              <p style={{ margin: 0, color: '#555' }}>Địa chỉ: Studio Nghệ thuật Fine Art, Hà Nội</p>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#777', textTransform: 'uppercase', fontWeight: 700 }}>Đơn vị mua hàng:</span>
              <p style={{ margin: '4px 0 2px', fontWeight: 700, fontSize: '0.88rem', color: '#111' }}>{order.buyer_name}</p>
              <p style={{ margin: '0 0 2px', color: '#555' }}>Điện thoại: {order.buyer_phone}</p>
              <p style={{ margin: 0, color: '#555' }}>Địa chỉ nhận: {order.buyer_address}</p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left' }}>STT</th>
                <th style={{ padding: '8px 10px', textAlign: 'left' }}>Tên tác phẩm & Quy cách</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>ĐVT</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Đơn giá</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>1</td>
                <td style={{ padding: '10px' }}>
                  <strong>{order.title}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#777' }}>Tác phẩm nghệ thuật độc bản 1/1 có chứng chỉ số SHA-256</div>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>Bức</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{formatPriceFull(subtotal)}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600 }}>{formatPriceFull(subtotal)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', fontSize: '0.82rem', marginBottom: 18 }}>
            <div style={{ width: 260, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Cộng tiền hàng:</span>
              <strong>{formatPriceFull(subtotal)}</strong>
            </div>
            <div style={{ width: 260, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Thuế suất GTGT (8%):</span>
              <strong>{formatPriceFull(vatAmount)}</strong>
            </div>
            <div style={{ width: 260, display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #b8860b', paddingTop: 6, fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 700, color: '#8b6914' }}>Tổng tiền thanh toán:</span>
              <strong style={{ color: '#b8860b' }}>{formatPriceFull(order.amount)}</strong>
            </div>
          </div>

          {/* Digital Signature stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: 14, fontSize: '0.75rem', color: '#666' }}>
            <div>
              <span style={{ display: 'block', fontWeight: 700, color: '#2ECC71' }}>✓ KÝ SỐ ĐIỆN TỬ BỞI ARTISAN HUB</span>
              <span>Ngày ký: {order.created_at}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span>Cổng tra cứu: <strong>hoadon.artisan-hub.vn</strong></span>
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={handlePrint}
          >
            <Printer size={15} /> In hóa đơn VAT
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   TAB 4: HỒ SƠ HỌA SĨ (Artist Profile & Verification)
   - Tối giản hóa thông tin, phân chia 2 cột cân đối, chống ngợp chữ
   - Cột trái: Tuyên ngôn sáng tác & Chứng nhận chuyên môn
   - Cột phải: Định danh eKYC Cấp L3, Thẻ ngân hàng & Bảo mật
   ========================================================================== */
const ArtistProfileAndVerificationTab = ({ user, addToast, onLogout, navigate }) => {
  const [statement, setStatement] = useState(
    'Nghệ thuật là hành trình đối thoại giữa chất cảm tự nhiên và tâm thức đương đại. Mỗi vệt màu đắp nổi là một nhịp thở của tự nhiên và linh hồn của di sản mỹ thuật Việt Nam.'
  );
  const [statementSaved, setStatementSaved] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const handleSaveStatement = () => {
    setStatementSaved(true);
    addToast?.('✦ Đã lưu tuyên ngôn sáng tác của Họa sĩ thành công!', 'success');
    setTimeout(() => setStatementSaved(false), 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedBank(true);
    addToast?.('Đã sao chép số tài khoản!', 'success');
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <div className={styles.tabContent}>
      {/* Header tinh gọn & đẳng cấp */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 className={styles.tabTitle} style={{ margin: 0 }}>Hồ sơ Họa sĩ & Xác thực Chuyên môn</h2>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Quản lý định danh Master Artist Cấp L3, bản sắc sáng tác mỹ thuật, tài khoản thụ hưởng và bảo mật.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-verified" style={{ padding: '6px 12px' }}>
            <ShieldCheck size={13} /> Master Artist Verified
          </span>
          <span className="badge badge-gold" style={{ padding: '6px 12px' }}>
            Cấp L3 eKYC
          </span>
        </div>
      </div>

      <div className={styles.profileSectionStack}>
        {/* =========================================================
            HÀNG 1: BẢN SẮC NGHỆ THUẬT & CHỨNG NHẬN CHUYÊN MÔN (2 CỘT CÂN ĐỐI 50-50)
            ========================================================= */}
        <div className={styles.profileGridTwo}>
          {/* Card 1: Tuyên ngôn sáng tác */}
          <div className={styles.kycCard}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(197, 160, 89, 0.12)', color: 'var(--gold-primary)' }}>
                  <Palette size={20} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Tuyên ngôn Sáng tác</h3>
                  <span className={styles.kycCardSubtitle}>Phong cách & triết lý hội họa gửi đến giới mộ điệu</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveStatement}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', padding: '6px 14px' }}
              >
                {statementSaved ? <CheckCircle size={14} /> : <Sparkles size={14} />}
                {statementSaved ? 'Đã lưu' : 'Lưu tuyên ngôn'}
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
              <div className={styles.statementAreaWrap} style={{ flex: 1, minHeight: 140 }}>
                <div className={styles.statementQuoteMark}>“</div>
                <textarea
                  className={styles.statementTextarea}
                  rows={4}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Nhập tuyên ngôn nghệ thuật, triết lý sáng tác và nguồn cảm hứng của bạn..."
                  style={{ minHeight: 90 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>✦ Hiển thị công khai trong trang tác phẩm & phòng đấu giá</span>
                <span>{statement.length} ký tự</span>
              </div>
            </div>
          </div>

          {/* Card 2: Chứng nhận Chuyên môn */}
          <div className={styles.kycCard}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' }}>
                  <Award size={20} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Chứng nhận Chuyên môn</h3>
                  <span className={styles.kycCardSubtitle}>Hội đồng Mỹ thuật & Giám định xác thực</span>
                </div>
              </div>
              <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>
                <Check size={12} /> Đã kiểm định
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className={styles.credentialsList}>
                <div className={styles.credentialRow}>
                  <span className={styles.credentialLabel}>Hiệp hội nghề nghiệp</span>
                  <span className={styles.credentialValue}>Hội Mỹ thuật Việt Nam (Mã: VNA-2018-092)</span>
                </div>
                <div className={styles.credentialRow}>
                  <span className={styles.credentialLabel}>Đào tạo chính quy</span>
                  <span className={styles.credentialValue}>Thạc sĩ Mỹ thuật – ĐH Mỹ thuật Việt Nam</span>
                </div>
                <div className={styles.credentialRow}>
                  <span className={styles.credentialLabel}>Chất liệu thế mạnh</span>
                  <div className={styles.materialTags}>
                    <span className={styles.materialTag}>Sơn mài 9 lớp</span>
                    <span className={styles.materialTag}>Sơn dầu đắp nổi</span>
                  </div>
                </div>
                <div className={styles.credentialRow}>
                  <span className={styles.credentialLabel}>Giải thưởng tiêu biểu</span>
                  <span className={styles.credentialValue} style={{ color: 'var(--gold-light)' }}>
                    Giải Nhì Triển lãm Toàn quốc 2020
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            HÀNG 2: ĐỊNH DANH PHÁP LÝ EKYC & TÀI KHOẢN THỤ HƯỞNG (2 CỘT CÂN ĐỐI 50-50)
            ========================================================= */}
        <div className={styles.profileGridTwo}>
          {/* Card 3: Thẻ Định danh eKYC Cấp L3 (Master Verified) */}
          <div className={`${styles.kycCard} ${styles.kycCardGold}`}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(197, 160, 89, 0.15)', color: 'var(--gold-primary)' }}>
                  <ShieldCheck size={22} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Định danh Họa sĩ Cấp L3</h3>
                  <span style={{ fontSize: '0.74rem', color: '#2ECC71', fontWeight: 600 }}>
                    ✓ Đã kiểm định sinh trắc học VNeID
                  </span>
                </div>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                MASTER VERIFIED
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
              {/* 4 ô thông số cô đọng */}
              <div className={styles.idGrid}>
                <div className={styles.idCell}>
                  <span className={styles.idCellLabel}>Họ và tên</span>
                  <strong className={styles.idCellValue}>{user.full_name}</strong>
                </div>
                <div className={styles.idCell}>
                  <span className={styles.idCellLabel}>Mã định danh ICOM</span>
                  <strong className={styles.idCellValue} style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>
                    VN-ART-8942-L3
                  </strong>
                </div>
                <div className={styles.idCell}>
                  <span className={styles.idCellLabel}>CCCD gắn chip</span>
                  <strong className={styles.idCellValue} style={{ fontFamily: 'var(--font-mono)' }}>
                    079***004521
                  </strong>
                </div>
                <div className={styles.idCell}>
                  <span className={styles.idCellLabel}>Liên hệ xác thực</span>
                  <strong className={styles.idCellValue} style={{ color: '#2ECC71' }}>
                    Chính chủ 100%
                  </strong>
                </div>
              </div>

              {/* 3 chip đặc quyền L3 */}
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 700 }}>
                  Đặc quyền Họa sĩ Cấp L3
                </span>
                <div className={styles.privilegeRow}>
                  <span className={styles.privilegePill}>
                    <span>⚡</span> Đấu giá kín (Sealed-Bid)
                  </span>
                  <span className={styles.privilegePill}>
                    <span>📜</span> Chứng nhận số SHA-256
                  </span>
                  <span className={styles.privilegePill}>
                    <span>🛡️</span> Ký quỹ Escrow 72h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Tài khoản ngân hàng nhận tiền */}
          <div className={styles.kycCard}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                  <Building2 size={20} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Tài khoản Thụ hưởng</h3>
                  <span className={styles.kycCardSubtitle}>Đã đối soát trùng khớp tên CCCD (AML Safe)</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => addToast?.('Chức năng cập nhật tài khoản yêu cầu xác thực OTP bảo mật!', 'info')}
                style={{ fontSize: '0.75rem' }}
              >
                Thay đổi
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              {/* Thẻ ngân hàng tối giản */}
              <div className={styles.bankCardBox}>
                <div className={styles.bankCardHeader}>
                  <span className={styles.bankBrandName}>VIETCOMBANK</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--gold-light)', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '2px 8px', borderRadius: 4, background: 'rgba(197, 160, 89, 0.08)' }}>
                    Tài khoản chính
                  </span>
                </div>
                <div className={styles.bankAccNumber}>
                  <span>0071 0008 8688 6</span>
                  <button
                    type="button"
                    className={styles.copyIconBtn}
                    onClick={() => handleCopy('0071000886886')}
                    title="Sao chép số tài khoản"
                  >
                    {copiedBank ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className={styles.bankCardFooter}>
                  <span>Chủ TK: <strong style={{ color: 'var(--text-primary)' }}>{user.full_name?.toUpperCase()}</strong></span>
                  <span>Chi nhánh: Sở Giao Dịch Hà Nội</span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                ✓ Tự động giải ngân qua Napas 247 sau khi người mua hoàn tất nghiệm thu 72h.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            HÀNG 3: BẢO MẬT & QUẢN LÝ PHIÊN (CARD NGANG TRẢI DÀI 100%, 3 Ô CÂN ĐỐI)
            ========================================================= */}
        <div className={styles.profileCardFull}>
          <div className={styles.kycCardHeader} style={{ paddingBottom: 14 }}>
            <div className={styles.kycHeaderLeft}>
              <div className={styles.kycIconBox} style={{ background: 'rgba(197, 160, 89, 0.1)', color: 'var(--gold-primary)' }}>
                <Shield size={20} />
              </div>
              <div className={styles.kycTitleWrap}>
                <h3 className={styles.kycCardTitle}>Bảo mật & Quản lý Phiên làm việc</h3>
                <span className={styles.kycCardSubtitle}>Quản lý phương thức bảo mật 2 lớp, mật khẩu và phiên đăng nhập</span>
              </div>
            </div>
          </div>

          <div className={styles.securityGridThree}>
            {/* Ô 1: 2FA */}
            <div className={styles.securityBox}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.88rem' }}>
                  Xác thực 2 lớp (2FA)
                </span>
                <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Bảo vệ rút tiền & xác thực phiên đấu giá
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trạng thái</span>
                <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ECC71', fontSize: '0.72rem' }}>
                  ✓ Đang bật
                </span>
              </div>
            </div>

            {/* Ô 2: Đổi mật khẩu */}
            <div className={styles.securityBox}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.88rem' }}>
                  Mật khẩu đăng nhập
                </span>
                <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Cập nhật lần cuối 30 ngày trước
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bảo mật cao</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => addToast?.('Liên kết đổi mật khẩu đã gửi về email!', 'info')}
                  style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>

            {/* Ô 3: Đăng xuất */}
            <div className={styles.securityBox} style={{ borderColor: 'rgba(239, 68, 68, 0.15)' }}>
              <div>
                <span style={{ display: 'block', color: '#f87171', fontWeight: 600, fontSize: '0.88rem' }}>
                  Đăng xuất tài khoản
                </span>
                <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Thoát phiên làm việc trên thiết bị này
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(239,68,68,0.1)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phiên hiện tại</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', padding: '4px 12px' }}
                  onClick={() => {
                    onLogout?.();
                    navigate('/');
                  }}
                >
                  <LogOut size={13} /> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
