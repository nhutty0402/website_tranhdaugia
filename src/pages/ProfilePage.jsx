import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, Package, Award, Clock, Shield, ArrowRight,
  CheckCircle, Download, QrCode, ExternalLink, Lock,
  PlusCircle, LayoutDashboard, Trophy, MessageSquare, AlertCircle, TrendingUp, LogOut, Palette,
  ShieldAlert, CheckCircle2, RotateCcw, Settings as SettingsIcon, UserCog,
  Truck, Copy, Check, Search, Filter, Receipt, FileText, ChevronRight, Eye, ShieldCheck, MapPin, Phone, CreditCard, Sparkles, Printer, X, DollarSign, Wallet, Building2, Send, ChevronDown
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
  'Tác phẩm & Phiên đấu giá',
  'Ví & Doanh thu',
  'Hồ sơ & Xác thực'
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
    if (isArtist) {
      if (location.state?.tab === 'Quản lý tác phẩm') return 'Tác phẩm & Phiên đấu giá';
      if (location.state?.tab === 'Đơn hàng & Ký quỹ' || location.state?.tab === 'wallet') return 'Ví & Doanh thu';
      if (location.state?.tab === 'Cài đặt' || location.state?.tab === 'Chứng chỉ số' || location.state?.tab === 'profile') return 'Hồ sơ & Xác thực';
      if (location.state?.tab && ARTIST_TABS.includes(location.state.tab)) return location.state.tab;
      const params = new URLSearchParams(location.search);
      if (params.get('tab') === 'wallet' || params.get('tab') === 'revenue') return 'Ví & Doanh thu';
      if (params.get('tab') === 'profile' || params.get('tab') === 'kyc') return 'Hồ sơ & Xác thực';
      return 'Tác phẩm & Phiên đấu giá';
    } else {
      if (location.state?.tab === 'Bộ sưu tập' || location.state?.tab === 'Chứng chỉ số') return 'Bộ sưu tập & Chứng chỉ số';
      if (location.state?.tab === 'Đơn hàng & Ký quỹ' || location.state?.tab === 'orders' || location.state?.tab === 'Phiên của tôi') return 'Đơn hàng & Ký quỹ';
      if (location.state?.tab === 'Cài đặt' || location.state?.tab === 'profile') return 'Hồ sơ & Bảo mật';
      if (location.state?.tab && COLLECTOR_TABS.includes(location.state.tab)) return location.state.tab;
      const params = new URLSearchParams(location.search);
      if (params.get('tab') === 'orders' || params.get('tab') === 'don-hang') return 'Đơn hàng & Ký quỹ';
      if (params.get('tab') === 'profile' || params.get('tab') === 'settings') return 'Hồ sơ & Bảo mật';
      return 'Bộ sưu tập & Chứng chỉ số';
    }
  });

  React.useEffect(() => {
    if (isArtist) {
      if (!ARTIST_TABS.includes(activeTab)) {
        setActiveTab('Tác phẩm & Phiên đấu giá');
      }
    } else {
      if (!COLLECTOR_TABS.includes(activeTab)) {
        setActiveTab('Bộ sưu tập & Chứng chỉ số');
      }
    }
  }, [currentUser?.role, isArtist]);

  React.useEffect(() => {
    if (location.state?.tab) {
      if (isArtist) {
        if (location.state.tab === 'Quản lý tác phẩm') setActiveTab('Tác phẩm & Phiên đấu giá');
        else if (location.state.tab === 'Đơn hàng & Ký quỹ' || location.state.tab === 'wallet') setActiveTab('Ví & Doanh thu');
        else if (location.state.tab === 'Cài đặt' || location.state.tab === 'Chứng chỉ số') setActiveTab('Hồ sơ & Xác thực');
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
    { value: '4', label: 'Phiên đấu giá thành công' },
    { value: '₫185.0M', label: 'Tổng doanh thu bán' },
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
                <>
                  <button
                    id="profile-upload-artwork-btn"
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={() => setUploadArtworkOpen(true)}
                  >
                    <Palette size={16} /> Đăng tác phẩm mới
                  </button>
                  <button
                    id="profile-create-auction-btn"
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: 'var(--border-gold)' }}
                    onClick={() => setCreateAuctionOpen(true)}
                  >
                    <PlusCircle size={16} /> Tạo phiên đấu giá
                  </button>
                </>
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
        {/* Streamlined Tabs: 3 tabs max per role */}
        <div className={styles.tabs} style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 6 }}>
          {currentTabs.map(tab => (
            <button
              key={tab}
              id={`profile-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ARTIST TAB 1: Tác phẩm & Phiên đấu giá */}
        {isArtist && activeTab === 'Tác phẩm & Phiên đấu giá' && (
          <ArtistArtworkManagementTab
            currentUser={currentUser}
            onOpenCreate={() => setCreateAuctionOpen(true)}
            onOpenUpload={() => setUploadArtworkOpen(true)}
            onOpenDashboard={(sess) => setDashboardSession(sess)}
            artworksVersion={artworksVersion}
            addToast={addToast}
          />
        )}

        {/* ARTIST TAB 2: Ví & Doanh thu */}
        {isArtist && activeTab === 'Ví & Doanh thu' && (
          <ArtistWalletAndRevenueTab
            currentUser={currentUser}
            addToast={addToast}
          />
        )}

        {/* ARTIST TAB 3: Hồ sơ & Xác thực */}
        {isArtist && activeTab === 'Hồ sơ & Xác thực' && (
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
   TAB 1: TÁC PHẨM & PHIÊN ĐẤU GIÁ (Artist Artwork & Auction Management)
   - Đã xóa bỏ cụm nút bấm trùng lặp ở thanh tiêu đề bên dưới
   - Tích hợp bộ lọc trạng thái & tìm kiếm nhanh
   ========================================================================== */
const ArtistArtworkManagementTab = ({ currentUser, onOpenCreate, onOpenUpload, onOpenDashboard, artworksVersion, addToast }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const artistArtworks = ARTWORKS.filter(a => a.artist_id === currentUser.user_id || currentUser.role === 'artist');

  const filteredArtworks = artistArtworks.filter(art => {
    const session = AUCTION_SESSIONS.find(s => s.artwork_id === art.artwork_id);
    const isEnded = session && (session.status === 'ended' || new Date(session.end_time) <= new Date());
    const isActive = session && !isEnded;

    if (filter === 'active' && !isActive) return false;
    if (filter === 'draft' && session) return false;
    if (filter === 'ended' && !isEnded) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return art.title.toLowerCase().includes(q) || art.medium.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCount = artistArtworks.filter(art => {
    const s = AUCTION_SESSIONS.find(sess => sess.artwork_id === art.artwork_id);
    return s && s.status !== 'ended' && new Date(s.end_time) > new Date();
  }).length;

  const endedCount = artistArtworks.filter(art => {
    const s = AUCTION_SESSIONS.find(sess => sess.artwork_id === art.artwork_id);
    return s && (s.status === 'ended' || new Date(s.end_time) <= new Date());
  }).length;

  const draftCount = artistArtworks.filter(art => !AUCTION_SESSIONS.find(sess => sess.artwork_id === art.artwork_id)).length;

  return (
    <div className={styles.tabContent}>
      {/* Header: ĐÃ DỌN DẸP HÀNG NÚT BẤM TRÙNG LẶP */}
      <div style={{ marginBottom: 24 }}>
        <h2 className={styles.tabTitle} style={{ margin: 0 }}>Quản lý tác phẩm & Phiên đấu giá</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Theo dõi hồ sơ kiểm định, giám sát danh sách giá thầu trong các phiên kín (Sealed-Bid) & trực tiếp (Live), và quản lý toàn bộ tác phẩm độc bản.
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
            { id: 'all', label: `Tất cả (${artistArtworks.length})` },
            { id: 'active', label: `Đang mở phiên (${activeCount})` },
            { id: 'draft', label: `Chờ mở phiên (${draftCount})` },
            { id: 'ended', label: `Đã gõ búa / Đã bán (${endedCount})` },
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

      {/* Artwork List */}
      {filteredArtworks.length === 0 ? (
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
            Không tìm thấy tác phẩm trong danh mục này
          </p>
          <p style={{ fontSize: '0.8rem', margin: 0 }}>
            Hãy thử đổi bộ lọc hoặc sử dụng nút "Đăng tác phẩm mới" ở góc trên để thêm sáng tác vào gallery.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredArtworks.map(art => {
            const session = AUCTION_SESSIONS.find(s => s.artwork_id === art.artwork_id);
            const bids = session ? BID_HISTORY.filter(b => b.session_id === session.session_id) : [];
            const isSealed = session?.auction_type === 'sealed';
            const isEnded = session && (session.status === 'ended' || new Date(session.end_time) <= new Date());
            const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.bid_amount)) : (session?.current_bid || art.current_price);

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
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 280, flex: 1 }}>
                  <img
                    src={art.image}
                    alt={art.title}
                    style={{ width: 88, height: 88, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span className="badge badge-verified">Độc bản 1/1</span>
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
                        <span className="badge" style={{ background: 'rgba(46,204,113,0.15)', color: '#2ECC71', border: '1px solid rgba(46,204,113,0.3)' }}>
                          <CheckCircle2 size={10} /> Đã gõ búa thành công
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', fontFamily: 'var(--font-brand)', color: 'var(--text-primary)' }}>
                      {art.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {art.medium} · {art.dimensions} {isSealed ? '· Đấu giá kín: ' : '· Giá khởi điểm: '}
                      <strong style={{ color: 'var(--gold-primary)' }}>
                        {isSealed ? 'Tự do đề xuất giá (Không giá khởi điểm)' : formatPriceFull(art.current_price)}
                      </strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  {session && (
                    <div style={{ textAlign: 'right', minWidth: 160 }}>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isEnded ? 'Giá gõ búa chốt phiên' : (isSealed ? 'Biên độ định giá (Min ~ Max)' : 'Giá cao nhất hiện tại')}
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                        {isSealed && bids.length > 0 && !isEnded
                          ? `${formatPrice(Math.min(...bids.map(b => b.bid_amount)))} ~ ${formatPrice(highestBid)}`
                          : formatPriceFull(highestBid)}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {bids.length} lượt đề xuất giá
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {session ? (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        onClick={() => onOpenDashboard(session)}
                        title="Mở bảng điều khiển quản trị phiên đấu giá"
                      >
                        <LayoutDashboard size={14} /> Bảng điều khiển phiên
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        onClick={onOpenCreate}
                        title="Tạo phiên đấu giá mới cho tác phẩm này"
                      >
                        <PlusCircle size={14} /> Mở phiên đấu giá
                      </button>
                    )}
                    <Link
                      to={`/artwork/${art.artwork_id}`}
                      className="btn btn-ghost btn-sm"
                      title="Xem trang chi tiết tác phẩm"
                    >
                      <Eye size={14} /> Xem tác phẩm
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   TAB 2: VÍ & DOANH THU (Artist Wallet & Escrow Revenue Management)
   - Theo dõi số dư khả dụng, số dư đang ký quỹ Escrow 72h
   - Lệnh rút tiền về ngân hàng
   - Lịch sử dòng tiền và các phiên bán thành công
   ========================================================================== */
const ArtistWalletAndRevenueTab = ({ currentUser, addToast }) => {
  const [availableBalance, setAvailableBalance] = useState(112500000);
  const [escrowBalance] = useState(72500000);
  const [totalRevenue] = useState(185000000);
  const [withdrawnTotal, setWithdrawnTotal] = useState(85000000);

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBank, setWithdrawBank] = useState('vcb');
  const [filter, setFilter] = useState('all');

  const [payouts, setPayouts] = useState([
    {
      id: 'WD-2024-081',
      date: '28/10/2026 14:20',
      bank: 'Vietcombank ****6886',
      amount: 50000000,
      status: 'completed',
      type: 'withdraw',
      note: 'Rút về tài khoản ngân hàng chính chủ qua Napas 247'
    },
    {
      id: 'WD-2024-055',
      date: '15/10/2026 09:45',
      bank: 'Vietcombank ****6886',
      amount: 35000000,
      status: 'completed',
      type: 'withdraw',
      note: 'Rút về tài khoản ngân hàng chính chủ qua Napas 247'
    }
  ]);

  const escrowSales = [
    {
      id: 'AH-ORD-2024-8924',
      title: 'Hoàng Hôn Sông Hương',
      image: '/gallery_2.png',
      buyer: 'Nguyễn Văn An (VIP Patron L2)',
      winPrice: 35000000,
      feeRate: '5%',
      platformFee: 1750000,
      netAmount: 33250000,
      status: 'escrow_locked',
      timeLeft: 'Còn 34 giờ 15 phút',
      statusText: 'Đang khóa Escrow 72h (chờ người mua nghiệm thu)',
      date: '02/11/2026'
    },
    {
      id: 'AH-ORD-2024-9102',
      title: 'Mùa Vàng Tây Bắc',
      image: '/gallery_1.png',
      buyer: 'Phan Hoàng Yến Trang (VIP Patron L3)',
      winPrice: 28500000,
      feeRate: '5%',
      platformFee: 1425000,
      netAmount: 27075000,
      status: 'escrow_locked',
      timeLeft: 'Còn 58 giờ 40 phút',
      statusText: 'Đang khóa Escrow 72h (đang vận chuyển xe chuyên dụng)',
      date: '03/11/2026'
    },
    {
      id: 'AH-ORD-2024-7620',
      title: 'Thiếu Nữ Bên Hoa Huệ',
      image: '/gallery_3.png',
      buyer: 'Đỗ Đức Huy (Collector L2)',
      winPrice: 65000000,
      feeRate: '5%',
      platformFee: 3250000,
      netAmount: 61750000,
      status: 'released',
      statusText: 'Đã giải ngân về số dư khả dụng (Đã qua 72h nghiệm thu)',
      date: '25/10/2026'
    },
    {
      id: 'AH-ORD-2024-6812',
      title: 'Bình Minh Trên Biển Đông',
      image: '/gallery_hero.png',
      buyer: 'Lê Thùy Chi (Patron L1)',
      winPrice: 60000000,
      feeRate: '5%',
      platformFee: 3000000,
      netAmount: 57000000,
      status: 'withdrawn',
      statusText: 'Đã giải ngân & Đã rút về ngân hàng',
      date: '12/10/2026'
    }
  ];

  const handleConfirmWithdraw = (e) => {
    e.preventDefault();
    const num = parseInt(withdrawAmount.replace(/\D/g, ''), 10);
    if (isNaN(num) || num <= 0) {
      addToast?.('Vui lòng nhập số tiền hợp lệ để rút!', 'warning');
      return;
    }
    if (num > availableBalance) {
      addToast?.('Số tiền rút vượt quá số dư khả dụng hiện có!', 'warning');
      return;
    }
    if (num < 500000) {
      addToast?.('Số tiền rút tối thiểu là 500.000 ₫', 'warning');
      return;
    }

    setAvailableBalance(prev => prev - num);
    setWithdrawnTotal(prev => prev + num);
    const newTx = {
      id: `WD-${Date.now().toString().slice(-6)}`,
      date: 'Vừa xong',
      bank: 'Vietcombank ****6886',
      amount: num,
      status: 'completed',
      type: 'withdraw',
      note: 'Lệnh rút tiền qua Napas 247 đã hoàn tất'
    };
    setPayouts(prev => [newTx, ...prev]);
    setWithdrawModalOpen(false);
    setWithdrawAmount('');
    addToast?.(`✦ Tạo lệnh rút ${formatPriceFull(num)} thành công! Tiền đang được chuyển về Vietcombank ****6886.`, 'success', 5000);
  };

  const filteredSales = escrowSales.filter(sale => {
    if (filter === 'escrow_locked' && sale.status !== 'escrow_locked') return false;
    if (filter === 'released' && sale.status !== 'released') return false;
    return true;
  });

  return (
    <div className={styles.tabContent}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 className={styles.tabTitle} style={{ margin: 0 }}>Ví tài khoản & Dòng tiền doanh thu</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Theo dõi doanh thu bán tranh, cơ chế ký quỹ trung gian Escrow 72h chống gian lận và tạo lệnh rút tiền về tài khoản ngân hàng chính chủ.
        </p>
      </div>

      {/* 4 Financial Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 28
      }}>
        {/* Số dư khả dụng */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.12) 0%, var(--bg-elevated) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 14,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Số dư khả dụng (Có thể rút)
              </span>
              <Wallet size={20} color="var(--gold-primary)" />
            </div>
            <p style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, fontFamily: 'var(--font-display)' }}>
              {formatPriceFull(availableBalance)}
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}
            onClick={() => setWithdrawModalOpen(true)}
          >
            <Send size={14} /> Rút tiền về ngân hàng
          </button>
        </div>

        {/* Đang ký quỹ Escrow 72h */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid rgba(243, 156, 18, 0.35)',
          borderRadius: 14,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Đang ký quỹ Escrow 72h
              </span>
              <Lock size={20} color="#F39C12" />
            </div>
            <p style={{ fontSize: '1.7rem', fontWeight: 800, color: '#F39C12', margin: 0, fontFamily: 'var(--font-display)' }}>
              {formatPriceFull(escrowBalance)}
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#2ECC71" /> Bảo chứng trung gian an toàn 100%
          </span>
        </div>

        {/* Tổng doanh thu tích lũy */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 14,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tổng doanh thu bán
              </span>
              <TrendingUp size={20} color="#2ECC71" />
            </div>
            <p style={{ fontSize: '1.7rem', fontWeight: 800, color: '#2ECC71', margin: 0, fontFamily: 'var(--font-display)' }}>
              {formatPriceFull(totalRevenue)}
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            4 tác phẩm đã giao dịch thành công
          </span>
        </div>

        {/* Đã rút về tài khoản */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 14,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Đã rút về tài khoản
              </span>
              <Receipt size={20} color="var(--text-secondary)" />
            </div>
            <p style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
              {formatPriceFull(withdrawnTotal)}
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            2 lệnh chuyển khoản đã hoàn tất
          </span>
        </div>
      </div>

      {/* Escrow Inflow Tracker */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>
              Dòng tiền từ các phiên bán tác phẩm (Escrow Inflow)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Minh bạch chi tiết giá gõ búa, phí sàn (5%), số tiền thực nhận và thời gian mở khóa Escrow 72h.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setFilter('all')}
              className={`${styles.filterPill} ${filter === 'all' ? styles.filterPillActive : ''}`}
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('escrow_locked')}
              className={`${styles.filterPill} ${filter === 'escrow_locked' ? styles.filterPillActive : ''}`}
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
            >
              Đang giữ Escrow
            </button>
            <button
              onClick={() => setFilter('released')}
              className={`${styles.filterPill} ${filter === 'released' ? styles.filterPillActive : ''}`}
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
            >
              Đã giải ngân
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredSales.map(sale => (
            <div
              key={sale.id}
              style={{
                background: 'var(--bg-elevated)',
                border: sale.status === 'escrow_locked' ? '1px solid rgba(243, 156, 18, 0.4)' : '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img
                  src={sale.image}
                  alt={sale.title}
                  style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      #{sale.id}
                    </span>
                    {sale.status === 'escrow_locked' ? (
                      <span className="badge" style={{ background: 'rgba(243, 156, 18, 0.15)', color: '#F39C12', border: '1px solid rgba(243, 156, 18, 0.3)' }}>
                        <Clock size={11} /> {sale.timeLeft}
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ECC71', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                        <CheckCircle2 size={11} /> Đã vào ví khả dụng
                      </span>
                    )}
                  </div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>
                    {sale.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Người mua: <span style={{ color: 'var(--text-secondary)' }}>{sale.buyer}</span> · Ngày bán: {sale.date}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 24 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Giá gõ búa: <span style={{ textDecoration: 'none' }}>{formatPriceFull(sale.winPrice)}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#E74C3C' }}>
                    Phí sàn (5%): -{formatPriceFull(sale.platformFee)}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-primary)', marginTop: 2 }}>
                    Thực nhận: {formatPriceFull(sale.netAmount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal & Payout History */}
      <div>
        <h3 style={{ margin: '0 0 14px', fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>
          Lịch sử lệnh rút tiền về tài khoản ngân hàng
        </h3>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 14,
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 18px' }}>Mã lệnh</th>
                <th style={{ padding: '12px 18px' }}>Thời gian</th>
                <th style={{ padding: '12px 18px' }}>Tài khoản nhận</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Số tiền rút</th>
                <th style={{ padding: '12px 18px', textAlign: 'center' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((tx, idx) => (
                <tr key={tx.id} style={{ borderBottom: idx < payouts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>{tx.id}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>{tx.date}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-primary)' }}>{tx.bank}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                    -{formatPriceFull(tx.amount)}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span className="badge" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ECC71', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                      <CheckCircle2 size={11} /> Thành công
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {withdrawModalOpen && (
        <div
          className={styles.invoiceModalOverlay}
          onClick={(e) => e.target === e.currentTarget && setWithdrawModalOpen(false)}
        >
          <div className={styles.invoiceModalBox} style={{ maxWidth: 480 }}>
            <div className={styles.invoiceHeader}>
              <div>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                  <Wallet size={11} /> RÚT TIỀN NHANH NAPAS 247
                </span>
                <h3 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                  Lệnh Rút Tiền Về Ngân Hàng
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Số dư khả dụng hiện tại: <strong style={{ color: 'var(--gold-light)' }}>{formatPriceFull(availableBalance)}</strong>
                </p>
              </div>
              <button
                className="btn btn-icon btn-ghost"
                onClick={() => setWithdrawModalOpen(false)}
                aria-label="Đóng"
                style={{ borderRadius: '50%' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Nhập số tiền muốn rút (VNĐ)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ví dụ: 20000000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gold-primary)' }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {[10000000, 20000000, 50000000, availableBalance].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                      onClick={() => setWithdrawAmount(val.toString())}
                    >
                      {val === availableBalance ? 'Tất cả' : `${val / 1000000}M`}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tài khoản thụ hưởng:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>Vietcombank (****6886)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Chủ tài khoản:</span>
                  <strong>TRAN THI ANH DUONG</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phí xử lý giao dịch:</span>
                  <span style={{ color: '#2ECC71', fontWeight: 600 }}>0 VNĐ (Miễn phí)</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setWithdrawModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Send size={15} /> Xác nhận rút tiền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   TAB 3: HỒ SƠ & XÁC THỰC (Artist Profile, Identity & Credentials Verification)
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
      {/* Header tinh gọn */}
      <div style={{ marginBottom: 28 }}>
        <h2 className={styles.tabTitle} style={{ margin: 0 }}>Hồ sơ Họa sĩ & Thẩm định Xác thực</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Quản lý định danh eKYC Cấp L3, bản sắc sáng tác mỹ thuật và tài khoản ngân hàng nhận tiền giải ngân.
        </p>
      </div>

      {/* Lưới 2 Cột cân đối, thoáng mắt */}
      <div className={styles.kycLayout}>
        {/* ==============================================
            CỘT 1 (BÊN TRÁI): BẢN SẮC & CHUYÊN MÔN MỸ THUẬT
            ============================================== */}
        <div className={styles.kycColumn}>
          {/* 1. Tuyên ngôn nghệ thuật (Artist Statement) */}
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

            <div className={styles.statementAreaWrap}>
              <div className={styles.statementQuoteMark}>“</div>
              <textarea
                className={styles.statementTextarea}
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Nhập tuyên ngôn nghệ thuật, triết lý sáng tác và nguồn cảm hứng của bạn..."
              />
            </div>
          </div>

          {/* 2. Hồ sơ chuyên môn & Bằng cấp */}
          <div className={styles.kycCard}>
            <div className={styles.kycCardHeader}>
              <div className={styles.kycHeaderLeft}>
                <div className={styles.kycIconBox} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' }}>
                  <Award size={20} />
                </div>
                <div className={styles.kycTitleWrap}>
                  <h3 className={styles.kycCardTitle}>Chứng nhận Chuyên môn</h3>
                  <span className={styles.kycCardSubtitle}>Hội đồng Mỹ thuật & Hiệp hội Giám định xác thực</span>
                </div>
              </div>
            </div>

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

        {/* ==============================================
            CỘT 2 (BÊN PHẢI): ĐỊNH DANH EKYC, TÀI KHOẢN & BẢO MẬT
            ============================================== */}
        <div className={styles.kycColumn}>
          {/* 1. Thẻ Định danh eKYC Cấp L3 (Master Verified) */}
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

            {/* 3 chip đặc quyền L3 tinh gọn thay vì đoạn văn dài */}
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

          {/* 2. Tài khoản ngân hàng nhận tiền */}
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

          {/* 3. Cài đặt bảo mật & Đăng xuất */}
          <div className={styles.kycCard} style={{ padding: '18px 24px', gap: 14 }}>
            <div className={styles.securityItem}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>
                  Xác thực 2 lớp (2FA)
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Bảo vệ rút tiền & tạo phiên đấu giá</span>
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

export default ProfilePage;
