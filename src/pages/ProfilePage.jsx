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
import styles from './ProfilePage.module.css';

const PROFILE_TABS = [
  'Tác phẩm & Phiên đấu giá',
  'Ví & Doanh thu',
  'Hồ sơ & Xác thực'
];

const ProfilePage = ({ currentUser, addToast, onLogout, onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.state?.tab) {
      if (location.state.tab === 'Quản lý tác phẩm') return 'Tác phẩm & Phiên đấu giá';
      if (location.state.tab === 'Đơn hàng & Ký quỹ' || location.state.tab === 'wallet') return 'Ví & Doanh thu';
      if (location.state.tab === 'Cài đặt' || location.state.tab === 'Chứng chỉ số' || location.state.tab === 'profile') return 'Hồ sơ & Xác thực';
      return location.state.tab;
    }
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'wallet' || params.get('tab') === 'revenue' || params.get('tab') === 'don-hang') return 'Ví & Doanh thu';
    if (params.get('tab') === 'profile' || params.get('tab') === 'kyc') return 'Hồ sơ & Xác thực';
    return 'Tác phẩm & Phiên đấu giá';
  });

  React.useEffect(() => {
    if (location.state?.tab) {
      if (location.state.tab === 'Quản lý tác phẩm') setActiveTab('Tác phẩm & Phiên đấu giá');
      else if (location.state.tab === 'Đơn hàng & Ký quỹ' || location.state.tab === 'wallet') setActiveTab('Ví & Doanh thu');
      else if (location.state.tab === 'Cài đặt' || location.state.tab === 'Chứng chỉ số') setActiveTab('Hồ sơ & Xác thực');
      else setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const [createAuctionOpen, setCreateAuctionOpen] = useState(false);
  const [uploadArtworkOpen, setUploadArtworkOpen] = useState(false);
  const [artworksVersion, setArtworksVersion] = useState(0);
  const [dashboardSession, setDashboardSession] = useState(null);

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
          Hồ Sơ & Không Gian Họa Sĩ
        </h2>
        <p style={{ maxWidth: 480, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Vui lòng đăng nhập để quản lý tác phẩm độc bản, giám sát các phiên đấu giá kín (Sealed-Bid) & công khai (Live), theo dõi dòng tiền ký quỹ Escrow 72h và thông tin định danh eKYC Cấp L3.
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

  // Artist metrics standardized
  const artistStats = [
    { value: '6', label: 'Tác phẩm đã đăng' },
    { value: '4', label: 'Phiên đấu giá thành công' },
    { value: '₫185.0M', label: 'Tổng doanh thu bán' },
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
                <span className="badge badge-verified">
                  <ShieldCheck size={12} /> Họa sĩ xác thực (Master Artist)
                </span>
                <span className="badge badge-gold">
                  Cấp L{currentUser.kyc_level || 3} eKYC
                </span>
              </div>
              <p className={styles.profileUsername}>@{currentUser.username}</p>

              {/* Requirement 1: Chuẩn hóa bộ chỉ số thống kê của Họa sĩ */}
              <div className={styles.profileStats}>
                {artistStats.map(({ value, label }) => (
                  <div key={label} className={styles.profileStat}>
                    <span className={styles.profileStatVal}>{value}</span>
                    <span className={styles.profileStatLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirement 3: Chỉ giữ đúng 1 cụm hành động ở góc trên: Nút chính "Đăng tác phẩm mới" và nút phụ "Tạo phiên đấu giá" */}
            <div className={styles.profileHeroActions}>
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
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Requirement 2: Tinh gọn hệ thống Tab điều hướng: gom lại còn 3 tab tối ưu */}
        <div className={styles.tabs} style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 6 }}>
          {PROFILE_TABS.map(tab => (
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

        {/* Tab 1: Tác phẩm & Phiên đấu giá */}
        {activeTab === 'Tác phẩm & Phiên đấu giá' && (
          <ArtistArtworkManagementTab
            currentUser={currentUser}
            onOpenCreate={() => setCreateAuctionOpen(true)}
            onOpenUpload={() => setUploadArtworkOpen(true)}
            onOpenDashboard={(sess) => setDashboardSession(sess)}
            artworksVersion={artworksVersion}
            addToast={addToast}
          />
        )}

        {/* Tab 2: Ví & Doanh thu */}
        {activeTab === 'Ví & Doanh thu' && (
          <ArtistWalletAndRevenueTab
            currentUser={currentUser}
            addToast={addToast}
          />
        )}

        {/* Tab 3: Hồ sơ & Xác thực */}
        {activeTab === 'Hồ sơ & Xác thực' && (
          <ArtistProfileAndVerificationTab
            user={currentUser}
            addToast={addToast}
            onLogout={onLogout}
            navigate={navigate}
          />
        )}
      </div>

      {/* Upload Artwork Modal */}
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
            addToast(`✦ Đã chuyển sang quản lý tiền Escrow bảo chứng cho tác phẩm "${art.title}"!`, 'gold');
            setActiveTab('Ví & Doanh thu');
          }}
          onEndSessionNow={(sid) => {
            dashboardSession.status = 'ended';
          }}
          addToast={addToast}
        />
      )}
    </main>
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
                      {art.medium} · {art.dimensions} · Giá khởi điểm: <strong style={{ color: 'var(--gold-primary)' }}>{formatPriceFull(art.current_price)}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  {session && (
                    <div style={{ textAlign: 'right', minWidth: 140 }}>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isEnded ? 'Giá gõ búa chốt phiên' : (isSealed ? 'Giá kín dẫn đầu' : 'Giá cao nhất hiện tại')}
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                        {formatPriceFull(highestBid)}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {bids.length} lượt đặt giá thầu
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
