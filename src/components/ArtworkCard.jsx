import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatCountdown } from '../data/mockData';
import { Heart, Eye, Clock, Shield, ArrowRight, Lock } from 'lucide-react';
import styles from './ArtworkCard.module.css';

const ArtworkCard = ({ artwork, session, onWishlist, wishlisted }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const endTime = session?.end_time;
  const isSealed = session?.auction_type === 'sealed';
  const isLive = session?.status === 'live' && !isSealed;
  const isUpcoming = session?.status === 'upcoming';

  return (
    <Link
      to={`/artwork/${artwork.artwork_id}`}
      className={`card ${styles.card}`}
      id={`artwork-card-${artwork.artwork_id}`}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      {/* Image area */}
      <div className={styles.imageWrap}>
        {!imageLoaded && (
          <div
            className={`skeleton ${styles.skeletonPlaceholder}`}
            aria-hidden="true"
          />
        )}
        <img
            src={artwork.image}
            alt={artwork.title}
            className={`${styles.image} ${imageLoaded ? styles.imageLoaded : styles.imageHidden}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        {/* Overlay on hover */}
        <div className={styles.overlay}>
          <span className="btn btn-primary btn-sm">
            Xem chi tiết <ArrowRight size={14} />
          </span>
        </div>

        {/* Top badges */}
        <div className={styles.topBadges}>
          {isSealed && (
            <span className="badge badge-sealed">
              <Lock size={11} /> ĐẤU GIÁ KÍN
            </span>
          )}
          {isLive && <span className="badge badge-live">LIVE</span>}
          {isUpcoming && (
            <span className="badge badge-upcoming">
              <Clock size={11} /> SẮP MỞ
            </span>
          )}
          {artwork.is_featured && (
            <span className="badge badge-featured">✦ NỔI BẬT</span>
          )}
        </div>

        {/* Wishlist btn */}
        <button
          id={`wishlist-${artwork.artwork_id}`}
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={(e) => { e.preventDefault(); onWishlist?.(artwork.artwork_id); }}
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

        <h3 className={styles.title}>{artwork.title}</h3>
        <span
          className={styles.artist}
          onClick={(e) => e.preventDefault()}
        >{artwork.artist_name}</span>

        <div className={styles.tags}>
          {artwork.tags.slice(0, 2).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          <span className={styles.dims}>{artwork.dimensions}</span>
        </div>

        <div className={styles.footer}>
          <div>
            <p className={styles.priceLabel}>
              {isSealed ? 'Giá khởi điểm (Kín)' : isLive ? 'Giá hiện tại' : 'Giá khởi điểm'}
            </p>
            <p className={styles.price}>
              {isSealed ? formatPrice(session?.min_bid || artwork.reserve_price) : formatPrice(artwork.current_price)}
            </p>
          </div>
          <div className={styles.trustBadge}>
            <Shield size={12} color="var(--gold-primary)" />
            <span>Đã xác thực</span>
          </div>
        </div>

        {/* Countdown for live & sealed auctions */}
        {(isLive || isSealed) && endTime && <AuctionCountdown endTime={endTime} />}
      </div>
    </Link>
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
