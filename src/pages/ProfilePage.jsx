import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Package, Award, Clock, Shield, ArrowRight,
  CheckCircle, Download, QrCode, ExternalLink, Lock,
  PlusCircle, LayoutDashboard, Trophy, MessageSquare, AlertCircle, TrendingUp, LogOut
} from 'lucide-react';
import {
  ARTWORKS, AUCTION_SESSIONS, BID_HISTORY, CERTIFICATES,
  ESCROW_ORDERS, formatPrice, formatPriceFull
} from '../data/mockData';
import CreateAuctionModal from '../components/CreateAuctionModal';
import ArtistSessionDashboardModal from '../components/ArtistSessionDashboardModal';
import SealedBidModal from '../components/SealedBidModal';
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
  const [activeTab, setActiveTab] = useState('Phiên của tôi');
  const [createAuctionOpen, setCreateAuctionOpen] = useState(false);
  const [dashboardSession, setDashboardSession] = useState(null);
  const [raiseBidSession, setRaiseBidSession] = useState(null);

  if (!currentUser) {
    return (
      <div className={styles.notLoggedIn}>
        <span style={{ fontSize: '3rem' }}>🔐</span>
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem và quản lý bộ sưu tập, phiên đấu giá kín, đơn hàng và chứng chỉ số của bạn.</p>
        <button
          className="btn btn-primary"
          style={{ marginTop: 16 }}
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
                <button
                  id="profile-create-auction-btn"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => setCreateAuctionOpen(true)}
                >
                  <PlusCircle size={16} /> Tạo phiên đấu giá
                </button>
              )}
              <button
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
              </button>
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
            onOpenDashboard={(sess) => setDashboardSession(sess)}
            addToast={addToast}
          />
        )}
        {activeTab === 'Đơn hàng & Ký quỹ' && <EscrowTab addToast={addToast} />}
        {activeTab === 'Chứng chỉ số' && <CertificatesTab addToast={addToast} />}
        {activeTab === 'Cài đặt' && (
          <SettingsTab
            user={currentUser}
            addToast={addToast}
            onLogout={onLogout}
            navigate={navigate}
          />
        )}
      </div>

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

const CollectionTab = ({ addToast }) => {
  const ownedArtworks = ARTWORKS.slice(0, 2);
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Bộ sưu tập của tôi</h2>
      <div className={styles.collectionGrid}>
        {ownedArtworks.map(artwork => (
          <div key={artwork.artwork_id} className={styles.collectionCard}>
            <img src={artwork.image} alt={artwork.title} className={styles.collectionImg} />
            <div className={styles.collectionInfo}>
              <span className="badge badge-verified" style={{ alignSelf: 'flex-start' }}>Đã sở hữu</span>
              <h3 className={styles.collectionTitle}>{artwork.title}</h3>
              <p className={styles.collectionArtist}>{artwork.artist_name}</p>
              <p className={styles.collectionMeta}>{artwork.medium} · {artwork.dimensions}</p>
              <div className={styles.collectionFooter}>
                <span className={styles.collectionPrice}>{formatPrice(artwork.current_price)}</span>
                <Link to={`/artwork/${artwork.artwork_id}`} className="btn btn-secondary btn-sm">
                  Xem <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
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
              statusBadge = <span className="badge badge-gold"><Lock size={11} /> ĐÃ GỬI HỒ SƠ KÍN</span>;
            } else if (myBid.status === 'winning') {
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
                background: 'var(--bg-elevated)',
                border: isSealed ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {isSealed ? 'Giá kín bạn đặt' : 'Mức giá đã đặt'}
                  </span>
                  <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatPriceFull(myBid.bid_amount)}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {isSealed ? 'Mã hóa bí mật một chiều' : 'Lượt đặt gần nhất'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
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
const ArtistArtworkManagementTab = ({ currentUser, onOpenCreate, onOpenDashboard, addToast }) => {
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
        <button id="btn-tab-create-auction" className="btn btn-primary btn-sm" onClick={onOpenCreate}>
          <PlusCircle size={14} /> Tạo phiên đấu giá mới
        </button>
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

const EscrowTab = ({ addToast }) => {
  const order = ESCROW_ORDERS[0];
  const artwork = ARTWORKS.find(a => a.artwork_id === 'aw2');

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Đơn hàng & Ví ký quỹ</h2>

      <div className={styles.escrowCard}>
        <div className={styles.escrowHeader}>
          <div>
            <span className="badge" style={{ background: 'rgba(243,156,18,0.15)', color: '#F39C12', border: '1px solid rgba(243,156,18,0.3)' }}>
              <Clock size={10} /> Đang ký quỹ
            </span>
            <h3 className={styles.escrowTitle}>#{order.escrow_id.toUpperCase()}</h3>
          </div>
          <div className={styles.escrowAmount}>
            <p className={styles.priceLabel}>Số tiền ký quỹ</p>
            <p className={styles.escrowPrice}>{formatPriceFull(order.amount_locked)}</p>
          </div>
        </div>

        <div className={styles.escrowProgress}>
          <div className={styles.escrowStep}>
            <div className={`${styles.stepDot} ${styles.stepDone}`}><CheckCircle size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Thanh toán</p>
              <p className={styles.stepDesc}>Đã thanh toán thành công</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.escrowStep}>
            <div className={`${styles.stepDot} ${styles.stepDone}`}><CheckCircle size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Vận chuyển</p>
              <p className={styles.stepDesc}>Kiện gỗ chuyên dụng đang trên đường</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.escrowStep}>
            <div className={`${styles.stepDot} ${styles.stepActive}`}><Clock size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Nghiệm thu 72h</p>
              <p className={styles.stepDesc}>Còn 48 giờ để xác nhận nhận hàng</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.escrowStep}>
            <div className={styles.stepDot}><Shield size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Giải ngân</p>
              <p className={styles.stepDesc}>Chưa hoàn tất</p>
            </div>
          </div>
        </div>

        <div className={styles.escrowActions}>
          <button className="btn btn-primary" onClick={() => addToast('Đã xác nhận nhận hàng! Tiền sẽ được giải ngân.', 'success')}>
            <CheckCircle size={16} /> Xác nhận đã nhận hàng
          </button>
          <button className="btn btn-danger" onClick={() => addToast('Đã gửi yêu cầu tranh chấp đến ban thẩm định.', 'warning')}>
            Báo cáo vấn đề
          </button>
        </div>
      </div>
    </div>
  );
};

const CertificatesTab = ({ addToast }) => {
  const cert = CERTIFICATES[0];
  const artwork = ARTWORKS.find(a => a.artwork_id === cert.artwork_id);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Thẻ chứng nhận số</h2>

      <div className={styles.certCard}>
        <div className={styles.certHeader}>
          <div className={styles.certBrand}>
            <span style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em' }}>
              ARTISAN HUB
            </span>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Digital Certificate of Authenticity</p>
          </div>
          <div className={styles.certQr}>
            <QrCode size={48} color="var(--gold-primary)" />
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>{cert.qr_verify_code}</p>
          </div>
        </div>

        <div className={styles.certArtwork}>
          <img src={artwork?.image} alt={artwork?.title} className={styles.certImg} />
          <div>
            <h3 className={styles.certArtTitle}>{artwork?.title}</h3>
            <p className={styles.certMeta}>{artwork?.medium} · {artwork?.dimensions} · {artwork?.creation_year}</p>
            <p className={styles.certMeta} style={{ color: 'var(--gold-primary)' }}>By {artwork?.artist_name}</p>
          </div>
        </div>

        <div className={styles.certFields}>
          {[
            { label: 'Certificate ID', value: cert.certificate_id.toUpperCase() },
            { label: 'Chữ ký số SHA-256', value: cert.ownership_hash.substring(0, 48) + '...' },
            { label: 'Chữ ký nghệ sĩ', value: cert.digital_signature.substring(0, 40) + '...' },
          ].map(({ label, value }) => (
            <div key={label} className={styles.certField}>
              <span className={styles.certLabel}>{label}</span>
              <code className={styles.certValue}>{value}</code>
            </div>
          ))}
        </div>

        <div className={styles.certProvenance}>
          <h4 className={styles.provenanceTitle}>Lịch sử chuyển nhượng (Provenance Chain)</h4>
          {cert.provenance_chain.map((item, i) => (
            <div key={i} className={styles.provenanceRow}>
              <div className={`${styles.provDot} ${i === cert.provenance_chain.length - 1 ? styles.provDotActive : ''}`} />
              <div>
                <p className={styles.provOwner}>{item.owner}</p>
                <p className={styles.provMeta}>{item.date} · {item.type}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.certActions}>
          <button className="btn btn-primary" onClick={() => addToast('Đã tải chứng chỉ PDF!', 'success')}>
            <Download size={16} /> Tải chứng chỉ PDF
          </button>
          <button className="btn btn-secondary" onClick={() => addToast('Đã sao chép link xác thực!', 'info')}>
            <ExternalLink size={16} /> Chia sẻ link xác thực
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ user, addToast, onLogout, navigate }) => (
  <div className={styles.tabContent}>
    <h2 className={styles.tabTitle}>Cài đặt tài khoản</h2>
    <div className={styles.settingsForm}>
      {[
        { label: 'Họ và tên', value: user.full_name, id: 'settings-name' },
        { label: 'Email', value: user.email, id: 'settings-email' },
        { label: 'Username', value: user.username, id: 'settings-username' },
      ].map(({ label, value, id }) => (
        <div key={id} className={styles.formGroup}>
          <label className={styles.formLabel}>{label}</label>
          <input id={id} className="input" defaultValue={value} />
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => addToast('Đã cập nhật thông tin!', 'success')}>
        Lưu thay đổi
      </button>
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
);

export default ProfilePage;
