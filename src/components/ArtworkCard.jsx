import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatCountdown } from '../data/mockData';
import { Heart, Eye, Zap, Clock, Shield, ArrowRight } from 'lucide-react';
import styles from './ArtworkCard.module.css';

const ArtworkCard = ({ artwork, session, onWishlist, wishlisted }) => {
  const endTime = session?.end_time;
  const isLive = session?.status === 'live';
  const isUpcoming = session?.status === 'upcoming';

  return (
    <div className={`card ${styles.card}`} id={`artwork-card-${artwork.artwork_id}`}>
      {/* Image area */}
      <div className={styles.imageWrap}>
        <Link to={`/artwork/${artwork.artwork_id}`}>
          <img
            src={artwork.image}
            alt={artwork.title}
            className={styles.image}
            loading="lazy"
          />
        </Link>
        {/* Overlay on hover */}
        <div className={styles.overlay}>
          <Link to={`/artwork/${artwork.artwork_id}`} className="btn btn-primary btn-sm">
            Xem chi tiết <ArrowRight size={14} />
          </Link>
          {isLive && (
            <Link to={`/auction/${session?.session_id}`} className="btn btn-secondary btn-sm">
              <Zap size={14} /> Vào phòng đấu giá
            </Link>
          )}
        </div>

        {/* Top badges */}
        <div className={styles.topBadges}>
          {isLive && <span className="badge badge-live">LIVE</span>}
          {isUpcoming && (
            <span className="badge" style={{ background: 'rgba(52,152,219,0.15)', color: '#3498DB', border: '1px solid rgba(52,152,219,0.3)' }}>
              <Clock size={10} /> SẮP MỞ
            </span>
          )}
          {artwork.is_featured && (
            <span className="badge badge-gold">✦ NỔI BẬT</span>
          )}
        </div>

        {/* Wishlist btn */}
        <button
          id={`wishlist-${artwork.artwork_id}`}
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={() => onWishlist?.(artwork.artwork_id)}
          aria-label="Thêm vào yêu thích"
        >
          <Heart size={16} fill={wishlisted ? '#D4AF37' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.meta}>
          <span className="section-label" style={{ fontSize: '0.65rem' }}>{artwork.medium}</span>
          <div className={styles.stats}>
            <span className={styles.stat}><Eye size={12} />{artwork.views}</span>
          </div>
        </div>

        <Link to={`/artwork/${artwork.artwork_id}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.title}>{artwork.title}</h3>
        </Link>
        <Link to={`/artists`} className={styles.artist}>{artwork.artist_name}</Link>

        <div className={styles.tags}>
          {artwork.tags.slice(0, 2).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          <span className={styles.dims}>{artwork.dimensions}</span>
        </div>

        <div className={styles.footer}>
          <div>
            <p className={styles.priceLabel}>{isLive ? 'Giá hiện tại' : 'Giá khởi điểm'}</p>
            <p className={styles.price}>{formatPrice(artwork.current_price)}</p>
          </div>
          <div className={styles.trustBadge}>
            <Shield size={12} color="var(--gold-primary)" />
            <span>Đã xác thực</span>
          </div>
        </div>

        {/* Countdown for live auctions */}
        {isLive && endTime && <AuctionCountdown endTime={endTime} />}
      </div>
    </div>
  );
};

const AuctionCountdown = ({ endTime }) => {
  const [time, setTime] = React.useState(formatCountdown(endTime));

  React.useEffect(() => {
    const iv = setInterval(() => setTime(formatCountdown(endTime)), 1000);
    return () => clearInterval(iv);
  }, [endTime]);

  const urgent = time.total < 3600000;

  return (
    <div className={styles.countdown} style={{ borderColor: urgent ? 'rgba(255,71,87,0.3)' : 'rgba(212,175,55,0.2)' }}>
      <Clock size={12} color={urgent ? 'var(--live)' : 'var(--gold-primary)'} />
      <span style={{ color: urgent ? 'var(--live)' : 'var(--gold-primary)' }}>
        {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')} còn lại
      </span>
    </div>
  );
};

export default ArtworkCard;
