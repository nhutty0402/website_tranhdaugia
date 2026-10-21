import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield, Clock, Zap, Heart, Share2, Eye, ZoomIn,
  ArrowLeft, Award, AlertTriangle, Check, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  ARTWORKS, AUCTION_SESSIONS, BID_HISTORY,
  QUICK_BID_STEPS, ROOM_TYPES, LIGHT_MODES,
  USERS, formatPrice, formatPriceFull, formatCountdown,
} from '../data/mockData';
import KYCBanner from '../components/KYCBanner';
import VerificationBadge from '../components/VerificationBadge';
import styles from './ArtworkDetailPage.module.css';

const TAB_ITEMS = ['Thông tin', 'Room View', 'Vệt cọ', 'Lịch sử đặt giá'];

const ArtworkDetailPage = ({ addToast, wishlisted, onWishlist, currentUser }) => {
  const { id } = useParams();
  const artwork = ARTWORKS.find(a => a.artwork_id === id) || ARTWORKS[0];
  const session = AUCTION_SESSIONS.find(s => s.artwork_id === artwork.artwork_id);
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

  useEffect(() => {
    if (!session) return;
    const iv = setInterval(() => setCountdown(formatCountdown(session.end_time)), 1000);
    return () => clearInterval(iv);
  }, [session]);

  const handleBid = (increment) => {
    if (!currentUser) { addToast('Vui lòng đăng nhập để đặt giá thầu!', 'warning'); return; }
    if ((currentUser.kyc_level || 0) < 2) {
      addToast('⚠️ Cần hoàn tất eKYC (Cấp L2) để đặt giá!', 'warning'); return;
    }
    if (!session || session.status !== 'live') return;

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
      addToast('🏆 Bạn đang dẫn đầu phiên đấu giá!', 'gold');
      if (bidListRef.current) bidListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
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
                {session?.status === 'live' && <span className="badge badge-live">LIVE</span>}
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
                <BidHistoryTab bids={bids} bidListRef={bidListRef} />
              )}
            </div>
          </div>

          {/* ===== RIGHT: Info & Auction ===== */}
          <div className={styles.rightCol}>
            {/* Artist */}
            <div className={styles.artistRow}>
              <img src={artist?.avatar || '/artist_avatar.png'} alt={artist?.full_name} className={styles.artistAvatar} />
              <div>
                <p className={styles.artistLabel}>Họa sĩ</p>
                <h5 className={styles.artistName}>{artwork.artist_name}</h5>
              </div>
              <span className="badge badge-verified" style={{ marginLeft: 'auto' }}>
                <Award size={10} /> Xác thực
              </span>
            </div>

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

            {/* Auction Box */}
            {session ? (
              <AuctionBox
                session={session}
                currentPrice={currentPrice}
                countdown={countdown}
                urgent={urgent}
                bids={bids}
                onBid={handleBid}
                placing={placing}
                artwork={artwork}
                addToast={addToast}
              />
            ) : (
              <BuyBox artwork={artwork} addToast={addToast} />
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

const BidHistoryTab = ({ bids, bidListRef }) => (
  <div className={styles.bidHistory} ref={bidListRef}>
    {bids.length === 0 && (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>Chưa có lượt đặt giá nào.</p>
    )}
    {bids.map((bid, i) => (
      <div key={bid.bid_id} className={`${styles.bidRow} ${bid.status === 'winning' ? styles.bidWinning : ''}`}>
        <div className={styles.bidRank}>#{i + 1}</div>
        <div className={styles.bidInfo}>
          <span className={styles.bidder}>{bid.bidder_name}</span>
          <span className={styles.bidTime}>
            {new Date(bid.placed_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <div className={styles.bidAmount}>
          <span className={styles.bidPrice}>{formatPrice(bid.bid_amount)}</span>
          {bid.status === 'winning' && <span className="badge badge-gold">Dẫn đầu</span>}
          {bid.is_auto_bid && <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Tự động</span>}
        </div>
      </div>
    ))}
  </div>
);

const AuctionBox = ({ session, currentPrice, countdown, urgent, bids, onBid, placing, artwork, addToast }) => (
  <div className={`${styles.auctionBox} ${urgent ? styles.auctionUrgent : ''}`}>
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

    <div className={styles.escrowNote}>
      <Shield size={12} color="var(--gold-primary)" />
      <span>Tiền được giữ trong Ví ký quỹ 72h sau khi nhận hàng</span>
    </div>
  </div>
);

const BuyBox = ({ artwork, addToast }) => (
  <div className={styles.buyBox}>
    <div className={styles.currentPrice}>
      <p className={styles.priceLabel}>Giá khởi điểm</p>
      <p className={styles.priceValue}>{formatPriceFull(artwork.current_price)}</p>
    </div>
    <button id="buy-now-btn" className={`btn btn-primary ${styles.confirmBidBtn}`}
      onClick={() => addToast('Vui lòng đăng nhập để mua tác phẩm!', 'info')}>
      Mua ngay
    </button>
  </div>
);

export default ArtworkDetailPage;
