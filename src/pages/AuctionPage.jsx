import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Zap, ArrowRight, Trophy, Users, Lock, PlusCircle, Shield, EyeOff, Palette } from 'lucide-react';
import {
  ARTWORKS, AUCTION_SESSIONS, BID_HISTORY, QUICK_BID_STEPS,
  formatPrice, formatPriceFull, formatCountdown,
} from '../data/mockData';
import CreateAuctionModal from '../components/CreateAuctionModal';
import UploadArtworkModal from '../components/UploadArtworkModal';
import styles from './AuctionPage.module.css';

const AuctionPage = ({ addToast, currentUser }) => {
  const [sessions, setSessions] = useState(AUCTION_SESSIONS);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const livePublicSessions = sessions.filter(s => s.status === 'live' && s.auction_type !== 'sealed');
  const sealedSessions = sessions.filter(s => s.auction_type === 'sealed');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');

  const handleCreateSuccess = (newSession) => {
    setSessions(prev => [newSession, ...prev]);
    addToast('✦ Đã kích hoạt phiên đấu giá thành công!', 'gold');
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 80 }}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="section-label">Sàn đấu giá</span>
            <h1 className={styles.pageTitle}>Sàn Đấu Giá Trực Tuyến</h1>
            <p className={styles.pageDesc}>Tham gia đấu giá công khai hoặc nộp hồ sơ đấu giá kín (Sealed-bid) có bảo chứng</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {currentUser?.role === 'artist' && (
              <button
                id="btn-upload-artwork-auction-page"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'var(--border-gold)' }}
                onClick={() => setUploadModalOpen(true)}
              >
                <Palette size={16} color="var(--gold-primary)" /> Đăng tác phẩm mới
              </button>
            )}
            <button
              id="btn-create-auction-page"
              className="btn btn-primary"
              onClick={() => {
                if (!currentUser) {
                  addToast('Vui lòng đăng nhập với tư cách Họa sĩ để tạo phiên!', 'warning');
                  return;
                }
                setCreateModalOpen(true);
              }}
            >
              <PlusCircle size={16} /> Tạo phiên đấu giá mới
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        {/* Phiên Đấu Giá Kín (Sealed-bid) */}
        {sealedSessions.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div className={styles.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={12} /> SEALED-BID
                </span>
                <h2>Phiên Đấu Giá Kín (Bảo mật giá thầu)</h2>
              </div>
            </div>

            <div className={styles.sessionsGrid}>
              {sealedSessions.map(session => {
                const artwork = ARTWORKS.find(a => a.artwork_id === session.artwork_id);
                if (!artwork) return null;
                return (
                  <SealedAuctionCard
                    key={session.session_id}
                    session={session}
                    artwork={artwork}
                    currentUser={currentUser}
                    addToast={addToast}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Live Public Sessions */}
        <div className={styles.sectionHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge badge-live">LIVE</span>
            <h2>Đấu giá Công khai Trực tiếp</h2>
          </div>
        </div>

        <div className={styles.sessionsGrid}>
          {livePublicSessions.map(session => {
            const artwork = ARTWORKS.find(a => a.artwork_id === session.artwork_id);
            if (!artwork) return null;
            return (
              <LiveAuctionCard
                key={session.session_id}
                session={session}
                artwork={artwork}
                addToast={addToast}
                currentUser={currentUser}
              />
            );
          })}
        </div>

        {/* Upcoming */}
        {upcomingSessions.length > 0 && (
          <>
            <div className={styles.sectionHeader} style={{ marginTop: 60 }}>
              <h2>Sắp khai mạc</h2>
            </div>
            <div className={styles.sessionsGrid}>
              {upcomingSessions.map(session => {
                const artwork = ARTWORKS.find(a => a.artwork_id === session.artwork_id);
                if (!artwork) return null;
                return <UpcomingCard key={session.session_id} session={session} artwork={artwork} />;
              })}
            </div>
          </>
        )}
      </div>

      {createModalOpen && (
        <CreateAuctionModal
          currentUser={currentUser}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {uploadModalOpen && (
        <UploadArtworkModal
          currentUser={currentUser}
          onClose={() => setUploadModalOpen(false)}
          onSuccess={(newArtwork) => {
            addToast(`✦ Tác phẩm "${newArtwork.title}" đã được lưu vào hồ sơ tranh của bạn!`, 'gold', 5000);
          }}
          addToast={addToast}
        />
      )}
    </main>
  );
};

const LiveAuctionCard = ({ session, artwork, addToast, currentUser }) => {
  const [price, setPrice] = useState(session.current_highest_price);
  const [countdown, setCountdown] = useState(formatCountdown(session.end_time));
  const [bids, setBids] = useState(BID_HISTORY.filter(b => b.session_id === session.session_id));
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setCountdown(formatCountdown(session.end_time)), 1000);
    return () => clearInterval(iv);
  }, [session.end_time]);

  const handleBid = (step) => {
    if (!currentUser) { addToast('Vui lòng đăng nhập để đặt giá thầu!', 'warning'); return; }
    const newPrice = price + step;
    setPlacing(true);
    setTimeout(() => {
      setPrice(newPrice);
      setBids(prev => [{
        bid_id: `b${Date.now()}`,
        session_id: session.session_id,
        bidder_name: currentUser.full_name.split(' ').slice(-2).join(' '),
        bid_amount: newPrice,
        placed_at: new Date().toISOString(),
        status: 'winning',
      }, ...prev.map(b => ({ ...b, status: 'outbid' }))]);
      setPlacing(false);
      addToast('🏆 Bạn đang dẫn đầu phiên đấu giá!', 'gold');
    }, 700);
  };

  const urgent = countdown.total < 3600000;

  return (
    <div className={`${styles.liveCard} ${urgent ? styles.urgentCard : ''}`}>
      {/* Artwork image */}
      <div className={styles.cardImage}>
        <img src={artwork.image} alt={artwork.title} className={styles.artImg} />
        <div className={styles.imageOverlay}>
          <Link to={`/artwork/${artwork.artwork_id}`} className="btn btn-primary btn-sm">
            Xem tác phẩm <ArrowRight size={14} />
          </Link>
        </div>
        <div className={styles.imageBadges}>
          <span className="badge badge-live">LIVE</span>
        </div>
      </div>

      {/* Card body */}
      <div className={styles.cardBody}>
        <div>
          <h3 className={styles.artTitle}>{artwork.title}</h3>
          <p className={styles.artArtist}>{artwork.artist_name} · {artwork.medium}</p>
        </div>

        {/* Countdown */}
        <div className={styles.countdown} style={{ borderColor: urgent ? 'rgba(255,71,87,0.4)' : 'rgba(212,175,55,0.25)' }}>
          <Clock size={14} color={urgent ? 'var(--live)' : 'var(--gold-primary)'} />
          <div className={styles.countdownBlocks}>
            {[
              { v: countdown.hours, l: 'GIỜ' },
              { v: countdown.minutes, l: 'PHÚT' },
              { v: countdown.seconds, l: 'GIÂY' },
            ].map(({ v, l }) => (
              <div key={l} className={styles.countdownBlock}>
                <span className={styles.countdownNum} style={{ color: urgent ? 'var(--live)' : 'var(--gold-primary)' }}>
                  {String(v).padStart(2, '0')}
                </span>
                <span className={styles.countdownLabel}>{l}</span>
              </div>
            ))}
          </div>
          <div className={styles.bidStats}>
            <Users size={12} />
            <span>{bids.length} lượt</span>
          </div>
        </div>

        {/* Current price */}
        <div className={styles.priceRow}>
          <div>
            <p className={styles.priceLabel}>Giá hiện tại</p>
            <p className={styles.priceValue}>{formatPrice(price)}</p>
          </div>
          {bids[0] && (
            <div className={styles.leadBidder}>
              <Trophy size={12} color="#D4AF37" />
              <span>{bids[0].bidder_name}</span>
            </div>
          )}
        </div>

        {/* Quick bids */}
        <div className={styles.quickBids}>
          {QUICK_BID_STEPS.slice(0, 3).map(step => (
            <button
              key={step}
              id={`auction-bid-${session.session_id}-${step}`}
              className={`btn btn-secondary btn-sm ${styles.quickBid}`}
              onClick={() => handleBid(step)}
              disabled={placing}
            >
              +{formatPrice(step)}
            </button>
          ))}
          <button
            id={`auction-confirm-${session.session_id}`}
            className={`btn btn-primary btn-sm ${styles.quickBid}`}
            onClick={() => handleBid(QUICK_BID_STEPS[1])}
            disabled={placing}
          >
            {placing ? <span className={styles.spinner} /> : <><Zap size={12} /> Đặt giá</>}
          </button>
        </div>

        {/* Recent bids */}
        <div className={styles.recentBids}>
          {bids.slice(0, 3).map((bid, i) => (
            <div key={bid.bid_id} className={styles.bidRow}>
              <span className={styles.bidder}>{bid.bidder_name}</span>
              <span className={styles.bidAmount} style={{ color: i === 0 ? 'var(--gold-primary)' : 'var(--text-secondary)' }}>
                {formatPrice(bid.bid_amount)}
              </span>
              <span className={styles.bidTime}>
                {new Date(bid.placed_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UpcomingCard = ({ session, artwork }) => {
  const [countdown, setCountdown] = useState(formatCountdown(session.start_time));

  useEffect(() => {
    const iv = setInterval(() => setCountdown(formatCountdown(session.start_time)), 1000);
    return () => clearInterval(iv);
  }, [session.start_time]);

  return (
    <div className={styles.upcomingCard}>
      <div className={styles.upcomingImage}>
        <img src={artwork.image} alt={artwork.title} className={styles.artImg} style={{ filter: 'brightness(0.5)' }} />
        <div className={styles.upcomingOverlay}>
          <span className="badge" style={{ background: 'rgba(52,152,219,0.2)', color: '#3498DB', border: '1px solid rgba(52,152,219,0.4)' }}>
            <Clock size={10} /> SẮP KHAI MẠC
          </span>
          <p className={styles.upcomingTimer}>
            {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>nữa bắt đầu</p>
        </div>
      </div>
      <div className={styles.upcomingInfo}>
        <h3 className={styles.artTitle}>{artwork.title}</h3>
        <p className={styles.artArtist}>{artwork.artist_name}</p>
        <div className={styles.priceRow}>
          <div>
            <p className={styles.priceLabel}>Giá khởi điểm</p>
            <p className={styles.priceValue}>{formatPrice(session.current_highest_price)}</p>
          </div>
          <button className="btn btn-secondary btn-sm">Đặt lịch nhắc</button>
        </div>
      </div>
    </div>
  );
};

const SealedAuctionCard = ({ session, artwork, currentUser, addToast }) => {
  const [countdown, setCountdown] = useState(formatCountdown(session.end_time));
  const bids = BID_HISTORY.filter(b => b.session_id === session.session_id);
  const totalBidders = new Set(bids.map(b => b.bidder_id || b.bidder_name)).size;

  useEffect(() => {
    const iv = setInterval(() => setCountdown(formatCountdown(session.end_time)), 1000);
    return () => clearInterval(iv);
  }, [session.end_time]);

  const urgent = countdown.total < 3600000;

  return (
    <div className={`${styles.liveCard}`} style={{ borderColor: 'var(--border-gold)', background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(26,26,30,0.9) 100%)' }}>
      {/* Artwork image */}
      <div className={styles.cardImage}>
        <img src={artwork.image} alt={artwork.title} className={styles.artImg} />
        <div className={styles.imageOverlay}>
          <Link to={`/artwork/${artwork.artwork_id}`} className="btn btn-primary btn-sm">
            Chi tiết & Ra giá kín <ArrowRight size={14} />
          </Link>
        </div>
        <div className={styles.imageBadges}>
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Lock size={11} /> ĐẤU GIÁ KÍN
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className={styles.cardBody}>
        <div>
          <h3 className={styles.artTitle}>{artwork.title}</h3>
          <p className={styles.artArtist}>{artwork.artist_name} · {artwork.medium}</p>
        </div>

        {/* Countdown */}
        <div className={styles.countdown} style={{ borderColor: urgent ? 'rgba(255,71,87,0.4)' : 'rgba(212,175,55,0.25)' }}>
          <Clock size={14} color={urgent ? 'var(--live)' : 'var(--gold-primary)'} />
          <div className={styles.countdownBlocks}>
            {[
              { v: countdown.hours, l: 'GIỜ' },
              { v: countdown.minutes, l: 'PHÚT' },
              { v: countdown.seconds, l: 'GIÂY' },
            ].map(({ v, l }) => (
              <div key={l} className={styles.countdownBlock}>
                <span className={styles.countdownNum} style={{ color: urgent ? 'var(--live)' : 'var(--gold-primary)' }}>
                  {String(v).padStart(2, '0')}
                </span>
                <span className={styles.countdownLabel}>{l}</span>
              </div>
            ))}
          </div>
          <div className={styles.bidStats}>
            <Users size={12} />
            <span>{totalBidders} người gửi</span>
          </div>
        </div>

        {/* Secret price notice */}
        <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px dashed var(--border-gold)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <EyeOff size={18} color="var(--gold-primary)" />
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Giá khởi điểm: {formatPriceFull(session.min_bid || artwork.reserve_price)}
            </p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Giá thầu được bảo mật bí mật cho tới khi đóng phiên
            </p>
          </div>
        </div>

        <Link
          to={`/artwork/${artwork.artwork_id}`}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Lock size={15} /> Nộp hồ sơ giá kín
        </Link>
      </div>
    </div>
  );
};

export default AuctionPage;
