import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Shield, Clock, Zap, Heart, Share2, Eye, ZoomIn,
  ArrowLeft, Award, AlertTriangle, Check, ChevronLeft, ChevronRight,
  Lock, EyeOff, LayoutDashboard, Trophy, MessageSquare, ShieldCheck
} from 'lucide-react';
import {
  ARTWORKS, AUCTION_SESSIONS, BID_HISTORY,
  QUICK_BID_STEPS, ROOM_TYPES, LIGHT_MODES,
  USERS, formatPrice, formatPriceFull, formatCountdown,
} from '../data/mockData';
import KYCBanner from '../components/KYCBanner';
import VerificationBadge from '../components/VerificationBadge';
import SealedBidModal from '../components/SealedBidModal';
import LiveBidConfirmModal from '../components/LiveBidConfirmModal';
import DepositEscrowModal from '../components/DepositEscrowModal';
import ArtistSessionDashboardModal from '../components/ArtistSessionDashboardModal';
import AuctionResultOverlay from '../components/AuctionResultOverlay';
import styles from './ArtworkDetailPage.module.css';

const TAB_ITEMS = ['Thông tin', 'Room View', 'Vệt cọ', 'Lịch sử đặt giá'];

const ArtworkDetailPage = ({ addToast, wishlisted, onWishlist, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artwork = ARTWORKS.find(a => a.artwork_id === id) || ARTWORKS[0];
  const [session, setSession] = useState(AUCTION_SESSIONS.find(s => s.artwork_id === artwork.artwork_id));
  const artist = USERS.find(u => u.user_id === artwork.artist_id);

  const [activeTab, setActiveTab] = useState('Thông tin');
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0]);
  const [selectedLight, setSelectedLight] = useState(LIGHT_MODES[0]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [bids, setBids] = useState(BID_HISTORY.filter(b => b.session_id === session?.session_id));
  const [currentPrice, setCurrentPrice] = useState(session?.current_highest_price || artwork.current_price);
  const [countdown, setCountdown] = useState(session ? formatCountdown(session.end_time) : null);
  const [placing, setPlacing] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(wishlisted?.has(artwork.artwork_id));
  const bidListRef = useRef(null);

  // Live Bid Confirm Modal & Outbid simulation state (Tasks 1 & 3)
  const [liveConfirmOpen, setLiveConfirmOpen] = useState(false);
  const [pendingBidIncrement, setPendingBidIncrement] = useState(QUICK_BID_STEPS[1]);
  const [outbidAlert, setOutbidAlert] = useState(false);
  const outbidTimerRef = useRef(null);

  // Flow 5 Sealed Auction Modals state
  const [sealedBidModalOpen, setSealedBidModalOpen] = useState(false);
  const [artistDashboardOpen, setArtistDashboardOpen] = useState(false);
  const [resultOverlayOpen, setResultOverlayOpen] = useState(false);

  // Escrow Deposit Verification (Friction with Purpose) state
  const [depositLocked, setDepositLocked] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [escrowPass, setEscrowPass] = useState(null);

  const isArtistOwner = currentUser && (currentUser.user_id === artwork.artist_id || currentUser.role === 'artist');
  const isSealedAuction = session?.auction_type === 'sealed';

  // Clean up outbid simulation timer on unmount
  useEffect(() => {
    return () => {
      if (outbidTimerRef.current) clearTimeout(outbidTimerRef.current);
    };
  }, []);

  // Check if current user has placed a sealed bid
  const mySealedBid = currentUser ? bids.find(b => b.bidder_id === currentUser.user_id) : null;
  const isSessionEnded = session?.status === 'ended' || (countdown && countdown.total <= 0);

  // Sealed auction bidding submission (Flow 4)
  const handleSealedBidSubmit = (bidData) => {
    if (bidData.is_raise) {
      setBids(prev => prev.map(b => {
        if (b.bidder_id === bidData.bidder_id) {
          return {
            ...b,
            bid_amount: bidData.bid_amount,
            last_raised_at: new Date().toISOString(),
            notes: bidData.note || b.notes,
          };
        }
        return b;
      }));
      addToast('✦ Đã tăng giá thầu thành công! Giá mới của bạn được giữ bí mật.', 'gold', 5000);
    } else {
      const newBid = {
        bid_id: `sb_${Date.now()}`,
        session_id: session.session_id,
        bidder_id: bidData.bidder_id,
        bidder_name: bidData.bidder_name,
        bid_amount: bidData.bid_amount,
        placed_at: new Date().toISOString(),
        is_auto_bid: false,
        status: 'submitted',
        is_visible_to_public: false,
        last_raised_at: new Date().toISOString(),
        notes: bidData.note,
      };
      setBids(prev => [newBid, ...prev]);
      addToast('✦ Đã gửi giá thành công! Mức giá của bạn được giữ bí mật, không thể rút.', 'gold', 5000);
    }
  };

  const handleContactWinner = (sessionId, bid) => {
    setSession(prev => ({ ...prev, winner_contacted_at: new Date().toISOString() }));
  };

  const handleCreateEscrow = (sess, art, bid) => {
    addToast(`✦ Đã mở hợp đồng Escrow bảo chứng 72h cho ${bid?.bidder_name || 'người thắng'}!`, 'gold', 6000);
  };

  const handleEndSessionNow = (sessionId) => {
    setSession(prev => ({ ...prev, status: 'ended' }));
  };

  useEffect(() => {
    if (!session) return;
    const iv = setInterval(() => setCountdown(formatCountdown(session.end_time)), 1000);
    return () => clearInterval(iv);
  }, [session]);

  // Request bid confirmation dialog (Task 1)
  const handleOpenLiveBidConfirm = (increment) => {
    if (!currentUser) {
      addToast('Vui lòng đăng nhập để đặt giá thầu!', 'warning');
      return;
    }
    if ((currentUser.kyc_level || 0) < 2) {
      addToast('⚠️ Cần hoàn tất eKYC (Cấp L2) để đặt giá!', 'warning');
      return;
    }
    if (!session || session.status !== 'live') return;

    // Check deposit escrow status (Friction with Purpose)
    if (!depositLocked) {
      addToast('⚠️ Bạn cần thực hiện Ký quỹ bảo chứng 15% (Escrow) để mở quyền đặt giá!', 'warning', 5000);
      setDepositModalOpen(true);
      return;
    }

    setPendingBidIncrement(increment);
    setLiveConfirmOpen(true);
  };

  // Confirm bid from modal and trigger outbid simulation (Tasks 1 & 3)
  const handleConfirmLiveBid = () => {
    const increment = pendingBidIncrement;
    const newPrice = currentPrice + increment;
    setPlacing(true);

    setTimeout(() => {
      setCurrentPrice(newPrice);
      const newBid = {
        bid_id: `b${Date.now()}`,
        session_id: session.session_id,
        bidder_id: currentUser.user_id,
        bidder_name: currentUser.full_name.split(' ').slice(-2).join(' '),
        bid_amount: newPrice,
        placed_at: new Date().toISOString(),
        is_auto_bid: false,
        status: 'winning',
      };
      setBids(prev => [newBid, ...prev.map(b => ({ ...b, status: 'outbid' }))]);
      setPlacing(false);
      setLiveConfirmOpen(false);
      addToast('🏆 Bạn đang dẫn đầu phiên đấu giá!', 'gold', 5000);
      if (bidListRef.current) bidListRef.current.scrollTo({ top: 0, behavior: 'smooth' });

      // Outbid Simulation (Task 3: random from 15s to 25s)
      if (outbidTimerRef.current) clearTimeout(outbidTimerRef.current);
      const delay = Math.floor(Math.random() * 10000) + 15000;
      outbidTimerRef.current = setTimeout(() => {
        const botIncrement = 500000;
        const outbidPrice = newPrice + botIncrement;
        setCurrentPrice(outbidPrice);
        const botBid = {
          bid_id: `b_bot_${Date.now()}`,
          session_id: session.session_id,
          bidder_id: 'u_vip_collector',
          bidder_name: 'Hoàng Long (Collector VIP)',
          bid_amount: outbidPrice,
          placed_at: new Date().toISOString(),
          is_auto_bid: false,
          status: 'winning',
        };
        setBids(prev => [botBid, ...prev.map(b => ({ ...b, status: 'outbid' }))]);
        addToast(
          `⚠️ CẢNH BÁO: Mức giá của bạn vừa bị vượt qua! Giá hiện tại là ${formatPriceFull(outbidPrice)}`,
          'danger',
          7000
        );
        setOutbidAlert(true);
        setTimeout(() => setOutbidAlert(false), 4000);
      }, delay);
    }, 700);
  };

  const urgent = countdown && countdown.total < 3600000;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <Link to="/gallery" className={styles.backLink}>
            <ArrowLeft size={16} /> Quay lại triển lãm
          </Link>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* ===== LEFT: Image & Tabs ===== */}
          <div className={styles.leftCol}>
            {/* Main image */}
            <div className={styles.mainImageWrap}>
              <img
                src={artwork.image}
                alt={artwork.title}
                className={styles.mainImage}
                style={{ transform: `scale(${zoomLevel})` }}
              />

              {/* Image controls */}
              <div className={styles.imageControls}>
                <button
                  id="zoom-in"
                  className={`btn btn-icon btn-ghost ${styles.zoomBtn}`}
                  onClick={() => setZoomLevel(z => Math.min(z + 0.5, 4))}
                  title="Phóng to"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  id="zoom-reset"
                  className={`btn btn-ghost ${styles.zoomBtn}`}
                  onClick={() => setZoomLevel(1)}
                  style={{ fontSize: '0.7rem', padding: '6px 10px' }}
                >
                  {(zoomLevel * 100).toFixed(0)}%
                </button>
              </div>

              {/* Badges */}
              <div className={styles.imageBadges}>
                {isSealedAuction ? (
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Lock size={11} /> PHIÊN KÍN
                  </span>
                ) : session?.status === 'live' ? (
                  <span className="badge badge-live">LIVE</span>
                ) : null}
                <span className="badge badge-gold">✦ Độc bản</span>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TAB_ITEMS.map(tab => (
                <button
                  key={tab}
                  id={`tab-${tab.replace(/\s/g, '-')}`}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className={styles.tabContent}>
              {activeTab === 'Thông tin' && (
                <InfoTab artwork={artwork} artist={artist} />
              )}
              {activeTab === 'Room View' && (
                <RoomViewTab
                  artwork={artwork}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  selectedLight={selectedLight}
                  setSelectedLight={setSelectedLight}
                />
              )}
              {activeTab === 'Vệt cọ' && (
                <TextureTab artwork={artwork} />
              )}
              {activeTab === 'Lịch sử đặt giá' && (
                <BidHistoryTab
                  bids={bids}
                  bidListRef={bidListRef}
                  isSealed={isSealedAuction}
                  isArtist={isArtistOwner}
                  currentUser={currentUser}
                />
              )}
            </div>
          </div>

          {/* ===== RIGHT: Info & Auction ===== */}
          <div className={styles.rightCol}>
            {/* Artist */}
            <Link to={`/artists/${artwork.artist_id || 'u2'}`} className={styles.artistRow} style={{ textDecoration: 'none' }}>
              <img src={artist?.avatar || '/artist_avatar.png'} alt={artist?.full_name} className={styles.artistAvatar} />
              <div>
                <p className={styles.artistLabel}>Họa sĩ</p>
                <h5 className={styles.artistName}>{artwork.artist_name}</h5>
              </div>
              <span className="badge badge-verified" style={{ marginLeft: 'auto' }}>
                <Award size={10} /> Xác thực L3
              </span>
            </Link>

            {/* Title & meta */}
            <h1 className={styles.title}>{artwork.title}</h1>
            <p className={styles.medium}>{artwork.medium} · {artwork.dimensions} · {artwork.creation_year}</p>

            <div className={styles.tags}>
              {artwork.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <Eye size={14} color="var(--text-muted)" />
                <span>{artwork.views} lượt xem</span>
              </div>
              <div className={styles.statItem}>
                <Heart size={14} color="var(--text-muted)" />
                <span>{artwork.likes} yêu thích</span>
              </div>
              <div className={styles.statItem}>
                <Shield size={14} color="var(--gold-primary)" />
                <span style={{ color: 'var(--gold-primary)' }}>Đã xác thực</span>
              </div>
            </div>

            <hr className="divider" style={{ margin: '20px 0' }} />

            {/* Auction Box (Sealed vs Live vs Buy) */}
            {session ? (
              isSealedAuction ? (
                <SealedAuctionBox
                  session={session}
                  artwork={artwork}
                  countdown={countdown}
                  urgent={urgent}
                  bids={bids}
                  currentUser={currentUser}
                  isArtistOwner={isArtistOwner}
                  mySealedBid={mySealedBid}
                  onOpenSealedBid={() => {
                    if (!currentUser) { addToast('Vui lòng đăng nhập để ra giá kín!', 'warning'); return; }
                    if ((currentUser.kyc_level || 0) < 2) {
                      addToast('⚠️ Cần hoàn tất eKYC (Cấp L2) để tham gia đấu giá kín!', 'warning'); return;
                    }
                    setSealedBidModalOpen(true);
                  }}
                  onOpenArtistDashboard={() => setArtistDashboardOpen(true)}
                  onOpenResult={() => setResultOverlayOpen(true)}
                />
              ) : (
                <AuctionBox
                  session={session}
                  currentPrice={currentPrice}
                  countdown={countdown}
                  urgent={urgent}
                  bids={bids}
                  onBid={handleOpenLiveBidConfirm}
                  placing={placing}
                  artwork={artwork}
                  addToast={addToast}
                  outbidAlert={outbidAlert}
                  depositLocked={depositLocked}
                  escrowPass={escrowPass}
                  onOpenDeposit={() => setDepositModalOpen(true)}
                  navigate={navigate}
                  currentUser={currentUser}
                />
              )
            ) : (
              <BuyBox artwork={artwork} addToast={addToast} navigate={navigate} />
            )}

            {/* Action buttons */}
            <div className={styles.actionBtns}>
              <button
                id={`wishlist-detail-${artwork.artwork_id}`}
                className={`btn btn-ghost ${isWishlisted ? styles.wishlisted : ''}`}
                onClick={() => { setIsWishlisted(!isWishlisted); onWishlist?.(artwork.artwork_id); }}
                style={{ flex: 1 }}
              >
                <Heart size={16} fill={isWishlisted ? '#D4AF37' : 'none'} color={isWishlisted ? '#D4AF37' : undefined} />
                {isWishlisted ? 'Đã lưu' : 'Lưu tác phẩm'}
              </button>
              <button id="share-btn" className="btn btn-ghost" style={{ flex: 1 }}>
                <Share2 size={16} /> Chia sẻ
              </button>
              <button id="report-btn" className="btn btn-danger" title="Báo cáo tranh giả">
                <AlertTriangle size={16} />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={styles.trustBox}>
              {[
                { icon: Shield, text: 'Đã xác thực hiện vật tại xưởng vẽ', color: '#2ECC71' },
                { icon: Clock, text: 'Ví ký quỹ 72h sau khi nhận hàng', color: '#D4AF37' },
                { icon: Award, text: 'Kèm chứng chỉ số SHA-256', color: '#3498DB' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className={styles.trustItem}>
                  <Icon size={14} color={color} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Sealed Auction */}
      {sealedBidModalOpen && (
        <SealedBidModal
          artwork={artwork}
          session={session}
          existingBid={mySealedBid}
          currentUser={currentUser}
          onClose={() => setSealedBidModalOpen(false)}
          onSubmitBid={handleSealedBidSubmit}
        />
      )}

      {artistDashboardOpen && (
        <ArtistSessionDashboardModal
          session={session}
          artwork={artwork}
          bids={bids}
          onClose={() => setArtistDashboardOpen(false)}
          onContactWinner={handleContactWinner}
          onCreateEscrow={handleCreateEscrow}
          onEndSessionNow={handleEndSessionNow}
          addToast={addToast}
        />
      )}

      {resultOverlayOpen && (
        <AuctionResultOverlay
          isWinner={mySealedBid?.status === 'winning' || bids[0]?.bidder_id === currentUser?.user_id}
          artwork={artwork}
          session={session}
          winningBid={bids[0]}
          userBid={mySealedBid}
          onClose={() => setResultOverlayOpen(false)}
          onCreateEscrow={() => handleCreateEscrow(session, artwork, bids[0])}
          onContactArtist={() => addToast(`Đã gửi tin nhắn tới họa sĩ ${artwork.artist_name}`, 'success')}
        />
      )}

      {/* Live Bid Confirm Modal (Task 1) */}
      {liveConfirmOpen && (
        <LiveBidConfirmModal
          artwork={artwork}
          currentPrice={currentPrice}
          bidIncrement={pendingBidIncrement}
          newPrice={currentPrice + pendingBidIncrement}
          onClose={() => setLiveConfirmOpen(false)}
          onConfirm={handleConfirmLiveBid}
          submitting={placing}
        />
      )}

      {/* 2-Step Deposit Verification Modal (Friction with Purpose) */}
      {depositModalOpen && (
        <DepositEscrowModal
          artwork={artwork}
          session={session}
          currentUser={currentUser}
          onClose={() => setDepositModalOpen(false)}
          onSuccess={(pass) => {
            setDepositLocked(true);
            setEscrowPass(pass);
          }}
          addToast={addToast}
        />
      )}
    </main>
  );
};

/* ===== Sub-components ===== */

const InfoTab = ({ artwork, artist }) => (
  <div className={styles.infoTab}>
    <div className={styles.infoGrid}>
      {[
        ['Chất liệu', artwork.medium],
        ['Kích thước', artwork.dimensions],
        ['Năm sáng tác', artwork.creation_year],
        ['Phong cách', artwork.style],
      ].map(([k, v]) => (
        <div key={k} className={styles.infoItem}>
          <span className={styles.infoKey}>{k}</span>
          <span className={styles.infoVal}>{v}</span>
        </div>
      ))}
    </div>
    <div className={styles.curatorStatement}>
      <p className={styles.curatorLabel}>Nhận định của ban thẩm định</p>
      <blockquote className={styles.quote}>{artwork.curator_statement}</blockquote>
    </div>
    {artist && (
      <div className={styles.artistBio}>
        <div className={styles.artistBioHeader}>
          <img src={artist.avatar} alt={artist.full_name} className={styles.artistBioAvatar} />
          <div>
            <h4>{artist.full_name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{artist.studio_address}</p>
          </div>
        </div>
        <p className={styles.artistBioText}>{artist.artist_bio}</p>
      </div>
    )}
  </div>
);

const RoomViewTab = ({ artwork, selectedRoom, setSelectedRoom, selectedLight, setSelectedLight }) => {
  return (
    <div className={styles.roomView}>
      <div className={styles.roomPreview} style={{ background: selectedRoom.bg }}>
        {/* Simulated room */}
        <div className={styles.roomWall}>
          <div className={styles.roomFrame} style={{
            filter: selectedLight.id === 'spotlight' ? 'brightness(1.15) contrast(1.05)' :
                    selectedLight.id === 'evening' ? 'brightness(0.85) sepia(0.2)' : 'none'
          }}>
            <img src={artwork.image} alt="Room view" className={styles.roomArtwork} />
          </div>
          <div className={styles.roomShadow} />
          {selectedLight.id === 'spotlight' && <div className={styles.spotlightBeam} />}
        </div>
        <div className={styles.roomFloor} />
        <div className={styles.scaleTag}>{artwork.dimensions}</div>
      </div>

      <div className={styles.roomControls}>
        <div>
          <p className={styles.controlLabel}>Chọn phòng</p>
          <div className={styles.controlRow}>
            {ROOM_TYPES.map(room => (
              <button
                key={room.id}
                id={`room-${room.id}`}
                className={`btn btn-sm ${selectedRoom.id === room.id ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setSelectedRoom(room)}
              >
                {room.icon} {room.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className={styles.controlLabel}>Chế độ ánh sáng</p>
          <div className={styles.controlRow}>
            {LIGHT_MODES.map(light => (
              <button
                key={light.id}
                id={`light-${light.id}`}
                className={`btn btn-sm ${selectedLight.id === light.id ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setSelectedLight(light)}
              >
                {light.icon} {light.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TextureTab = ({ artwork }) => {
  const [zoom, setZoom] = useState(1);
  return (
    <div className={styles.textureTab}>
      <div className={styles.textureViewer}>
        <img
          src={artwork.texture_map_url}
          alt="Vệt cọ chi tiết"
          className={styles.textureImg}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        />
        <div className={styles.textureBadge}>
          Macro Zoom ×{zoom.toFixed(1)}
        </div>
      </div>
      <div className={styles.zoomControls}>
        <p className={styles.controlLabel}>Mức độ phóng to</p>
        <div className={styles.controlRow}>
          {[1, 2, 3, 4].map(z => (
            <button
              key={z}
              id={`zoom-x${z}`}
              className={`btn btn-sm ${zoom === z ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setZoom(z)}
            >
              ×{z}
            </button>
          ))}
        </div>
        <p className={styles.textureNote}>
          Phóng đại hiển thị chất liệu sơn, độ dày vệt cọ và texture bề mặt canvas. Tác phẩm thực tế có chiều sâu và vệt cọ nổi (impasto).
        </p>
      </div>
    </div>
  );
};

const BidHistoryTab = ({ bids, bidListRef, isSealed, isArtist, currentUser }) => (
  <div className={styles.bidHistory} ref={bidListRef}>
    {isSealed && (
      <div style={{ background: 'rgba(212,175,55,0.08)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-gold)', marginBottom: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <Lock size={12} style={{ display: 'inline', marginRight: 6 }} color="var(--gold-primary)" />
        {isArtist
          ? 'Chế độ Họa sĩ: Bạn có toàn quyền xem giá thầu từ cao xuống thấp của các Collector.'
          : 'Chế độ phiên kín: Mức giá của người khác được ẩn bảo mật (chỉ bạn thấy giá của chính mình).'}
      </div>
    )}
    {bids.length === 0 && (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>Chưa có lượt đặt giá nào.</p>
    )}
    {bids.map((bid, i) => {
      const isMyBid = currentUser && bid.bidder_id === currentUser.user_id;
      const canSeePrice = !isSealed || isArtist || isMyBid;

      return (
        <div key={bid.bid_id} className={`${styles.bidRow} ${bid.status === 'winning' ? styles.bidWinning : ''}`}>
          <div className={styles.bidRank}>#{i + 1}</div>
          <div className={styles.bidInfo}>
            <span className={styles.bidder}>
              {isMyBid ? `${bid.bidder_name} (Bạn)` : isSealed ? 'Nhà sưu tầm bảo mật' : bid.bidder_name}
            </span>
            <span className={styles.bidTime}>
              {new Date(bid.placed_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <div className={styles.bidAmount}>
            <span className={styles.bidPrice}>
              {canSeePrice ? formatPrice(bid.bid_amount) : '•••••••• ₫'}
            </span>
            {bid.status === 'winning' && canSeePrice && <span className="badge badge-gold">Dẫn đầu</span>}
            {isSealed && !canSeePrice && (
              <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                Đã khóa
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

const AuctionBox = ({
  session, currentPrice, countdown, urgent, bids, onBid, placing,
  artwork, addToast, outbidAlert, depositLocked, escrowPass, onOpenDeposit,
  navigate, currentUser
}) => {
  const isLiveEnded = session.status !== 'live' || (countdown && countdown.total <= 0);
  const isUserWinning = currentUser && bids.length > 0 && bids[0]?.bidder_id === currentUser.user_id;

  return (
    <div className={`${styles.auctionBox} ${urgent ? styles.auctionUrgent : ''} ${outbidAlert ? styles.outbidFlash : ''}`}>
      <div className={styles.auctionHeader}>
        <span className="badge badge-live">LIVE AUCTION</span>
        <div className={styles.auctionTime}>
          <Clock size={14} color={urgent ? 'var(--live)' : 'var(--gold-primary)'} />
          {countdown && (
            <span style={{ color: urgent ? 'var(--live)' : 'var(--gold-primary)', fontFamily: 'var(--font-mono, monospace)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
              {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>còn lại</span>
        </div>
      </div>

      <div className={styles.currentPrice}>
        <p className={styles.priceLabel}>Giá cao nhất hiện tại</p>
        <p className={styles.priceValue}>{formatPriceFull(currentPrice)}</p>
        <p className={styles.bidCount}>{bids.length} lượt đặt giá</p>
      </div>

      {/* Deposit Escrow Status & Callout (Friction with Purpose) */}
      {!depositLocked ? (
        <div className={styles.depositBanner}>
          <div className={styles.depositBannerHeader}>
            <span className="badge badge-gold" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Shield size={12} /> YÊU CẦU KÝ QUỸ ĐẶT CỌC 15%
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Friction with Purpose</span>
          </div>
          <p className={styles.depositBannerDesc}>
            Ký quỹ tạm khóa <strong>{formatPriceFull(Math.round(currentPrice * 0.15))}</strong> trong ví Escrow (hoàn trả 100% tự động nếu không trúng thầu) để kích hoạt quyền đặt giá.
          </p>
          <button
            id="open-deposit-btn"
            type="button"
            className="btn btn-primary btn-sm"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            onClick={onOpenDeposit}
          >
            <Shield size={14} /> Ký quỹ bảo chứng 15% & Mở quyền phòng đấu
          </button>
        </div>
      ) : (
        <div className={styles.depositUnlockedBanner}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={styles.unlockedIconBadge}>
                <ShieldCheck size={18} color="#2ECC71" />
              </div>
              <div>
                <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                  ✦ ĐÃ KHÓA CỌC KÝ QUỸ ESCROW 15%
                </span>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                  Mã thẻ: <strong>{escrowPass?.passId || 'VIP-ESCROW-8942'}</strong> · Cấp quyền VIP
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}
              onClick={onOpenDeposit}
            >
              Xem thẻ Pass
            </button>
          </div>
        </div>
      )}

      <div className={styles.quickBids}>
        <p className={styles.controlLabel}>Đặt giá nhanh</p>
        <div className={styles.quickBidGrid}>
          {QUICK_BID_STEPS.map(step => (
            <button
              key={step}
              id={`quick-bid-${step}`}
              className={`btn btn-secondary ${styles.quickBidBtn}`}
              onClick={() => onBid(step)}
              disabled={placing || session.status !== 'live'}
            >
              +{formatPrice(step)}
            </button>
          ))}
        </div>
      </div>

      <button
        id="confirm-bid-btn"
        className={`btn btn-primary ${styles.confirmBidBtn}`}
        onClick={() => onBid(QUICK_BID_STEPS[1])}
        disabled={placing || session.status !== 'live'}
      >
        {placing ? (
          <><span className={styles.spinner} /> Đang xử lý...</>
        ) : (
          <><Zap size={16} /> Xác nhận đặt giá +{formatPrice(QUICK_BID_STEPS[1])}</>
        )}
      </button>

      {/* Checkout CTA when user is the current winner */}
      {isUserWinning && navigate && (
        <button
          id="checkout-winner-btn"
          type="button"
          onClick={() => navigate(`/checkout/${artwork.artwork_id}`)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 16px rgba(46,204,113,0.35)',
          }}
        >
          💳 Bạn đang dẫn đầu – Thanh toán ngay
        </button>
      )}

      <div className={styles.escrowNote}>
        <Shield size={12} color="var(--gold-primary)" />
        <span>Tiền được giữ trong Ví ký quỹ 72h sau khi nhận hàng</span>
      </div>
    </div>
  );
};

const SealedAuctionBox = ({
  session,
  artwork,
  countdown,
  urgent,
  bids,
  currentUser,
  isArtistOwner,
  mySealedBid,
  onOpenSealedBid,
  onOpenArtistDashboard,
  onOpenResult,
}) => {
  const now = new Date();
  const isBeforeStart = new Date(session.start_time) > now;
  const isEnded = session.status === 'ended' || new Date(session.end_time) <= now || (countdown && countdown.total <= 0);
  const totalBidders = new Set(bids.map(b => b.bidder_id || b.bidder_name)).size;

  return (
    <div className={styles.sealedBox}>
      {/* Badge khóa & Trạng thái (Mục 8.3) */}
      <div className={styles.sealedBadgeHeader}>
        <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Lock size={12} /> ĐẤU GIÁ KÍN
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isEnded ? (
            <span className="badge" style={{ background: 'rgba(231,76,60,0.15)', color: 'var(--danger)', border: '1px solid rgba(231,76,60,0.3)' }}>
              ĐÃ KẾT THÚC
            </span>
          ) : isBeforeStart ? (
            <span className="badge" style={{ background: 'rgba(52,152,219,0.15)', color: '#3498DB', border: '1px solid rgba(52,152,219,0.3)' }}>
              <Clock size={10} /> SẮP MỞ
            </span>
          ) : (
            <span className="badge badge-live">ĐANG DIỄN RA</span>
          )}
        </div>
      </div>

      {/* Đồng hồ Mở / Đóng lúc */}
      <div className={styles.sealedTimes}>
        <div className={styles.timeCol}>
          <span className={styles.timeLabel}>
            <Clock size={11} color="var(--gold-primary)" /> Mở lúc
          </span>
          <span className={styles.timeVal}>
            {new Date(session.start_time).toLocaleDateString('vi-VN')} {new Date(session.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={styles.timeCol}>
          <span className={styles.timeLabel}>
            <Clock size={11} color="var(--live)" /> Đóng lúc
          </span>
          <span className={styles.timeVal}>
            {new Date(session.end_time).toLocaleDateString('vi-VN')} {new Date(session.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Countdown timer if live */}
      {!isEnded && countdown && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(212,175,55,0.06)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thời gian còn lại nộp giá:</span>
          <span style={{ color: urgent ? 'var(--live)' : 'var(--gold-primary)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, fontSize: '1rem' }}>
            {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* KHÔNG hiển thị giá hiện tại - Chỉ hiển thị Card bảo mật và Giá khởi điểm */}
      <div className={styles.hiddenPriceCard}>
        <div className={styles.hiddenIconWrap}>
          <EyeOff size={22} color="var(--gold-primary)" />
        </div>
        <div>
          <h4 className={styles.hiddenMainText}>
            Giá thầu bảo mật tuyệt đối
          </h4>
          <p className={styles.hiddenSubText}>
            Giá hiện tại được ẩn với công chúng. Giá khởi điểm: <strong>{formatPriceFull(session.min_bid || artwork.reserve_price)}</strong>.
            Hiện có <strong>{totalBidders} nhà sưu tầm</strong> đã gửi hồ sơ.
          </p>
        </div>
      </div>

      {/* Collector has already bid */}
      {mySealedBid && (
        <div className={styles.userSubmittedBidBox}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hồ sơ của bạn</span>
            <p style={{ margin: '2px 0 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>
              Đã nộp: {formatPriceFull(mySealedBid.bid_amount)}
            </p>
          </div>
          <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>
            <Check size={12} /> Đã mã hóa
          </span>
        </div>
      )}

      {/* Artist management section if current user is owner or artist */}
      {isArtistOwner && (
        <div className={styles.artistManageNotice}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutDashboard size={16} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Bạn là Họa sĩ tạo phiên này.
            </span>
          </div>
          <button
            id="btn-open-artist-dashboard"
            className="btn btn-secondary btn-sm"
            onClick={onOpenArtistDashboard}
          >
            Mở Dashboard phiên
          </button>
        </div>
      )}

      {/* CTA Button */}
      {isEnded ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            id="btn-view-sealed-result"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={onOpenResult}
          >
            <Trophy size={16} /> Xem thông báo kết quả phiên
          </button>
          {isArtistOwner && (
            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={onOpenArtistDashboard}
            >
              Xem bảng xếp hạng thầu & Tạo Escrow
            </button>
          )}
        </div>
      ) : isBeforeStart ? (
        <button
          className="btn btn-secondary"
          style={{ width: '100%', padding: '16px', fontSize: '0.95rem', cursor: 'not-allowed', opacity: 0.7 }}
          disabled
        >
          <Clock size={16} /> Phiên sắp mở (Chưa đến giờ nhận giá)
        </button>
      ) : isArtistOwner ? (
        <button
          className="btn btn-secondary"
          style={{ width: '100%', padding: '16px', fontSize: '0.95rem', cursor: 'not-allowed', opacity: 0.8 }}
          disabled
          title="Chủ tranh không được phép tự đặt giá vào tranh của mình"
        >
          <Shield size={16} /> Chủ tranh không được tự đặt giá
        </button>
      ) : (
        <button
          id="btn-open-sealed-bid-modal"
          className="btn btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={onOpenSealedBid}
        >
          <Lock size={16} /> {mySealedBid ? 'Tăng giá kín của bạn' : 'Đặt giá kín'}
        </button>
      )}

      <div className={styles.escrowNote}>
        <Shield size={12} color="var(--gold-primary)" />
        <span>Giao dịch an toàn 100% qua Hợp đồng Escrow ký quỹ 72 giờ của Artisan Hub</span>
      </div>
    </div>
  );
};

const BuyBox = ({ artwork, addToast, navigate }) => (
  <div className={styles.buyBox}>
    <div className={styles.currentPrice}>
      <p className={styles.priceLabel}>Giá khởi điểm</p>
      <p className={styles.priceValue}>{formatPriceFull(artwork.current_price)}</p>
    </div>
    <button
      id="buy-now-btn"
      className={`btn btn-primary ${styles.confirmBidBtn}`}
      style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      onClick={() => {
        if (navigate) navigate(`/checkout/${artwork.artwork_id}`);
        else addToast('Vui lòng đăng nhập để mua tác phẩm!', 'info');
      }}
    >
      💳 Thanh toán ngay
    </button>
  </div>
);

export default ArtworkDetailPage;

