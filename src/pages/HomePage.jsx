import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Zap, Shield, Eye, Search, ChevronDown,
  Star, Award, Clock, Users, TrendingUp,
} from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';
import { ARTWORKS, AUCTION_SESSIONS, formatPrice, formatCountdown } from '../data/mockData';
import styles from './HomePage.module.css';

const FEATURES = [
  {
    icon: Eye,
    title: 'Room View 3D',
    desc: 'Ướm tranh lên tường theo tỷ lệ thật 1:1, chọn phòng và ánh sáng 3000K.',
    color: '#D4AF37',
  },
  {
    icon: Zap,
    title: 'Đấu giá trực tiếp',
    desc: 'Đồng hồ đếm ngược thực, đặt giá 1 chạm, cập nhật theo giây.',
    color: '#FF4757',
  },
  {
    icon: Shield,
    title: 'Bảo vệ 3 lớp',
    desc: 'Xác thực hiện vật thật, ví ký quỹ 72h, bồi hoàn 100% nếu tranh giả.',
    color: '#2ECC71',
  },
];

const STATS = [
  { value: '1,247', label: 'Tác phẩm độc bản', icon: Star },
  { value: '89', label: 'Họa sĩ xác thực', icon: Award },
  { value: '3,580', label: 'Nhà sưu tầm', icon: Users },
  { value: '₫12.4B', label: 'Tổng giá trị giao dịch', icon: TrendingUp },
];

const HeroCountdown = () => {
  const session = AUCTION_SESSIONS.find(s => s.status === 'live');
  const [time, setTime] = useState(session ? formatCountdown(session.end_time) : null);

  useEffect(() => {
    if (!session) return;
    const iv = setInterval(() => setTime(formatCountdown(session.end_time)), 1000);
    return () => clearInterval(iv);
  }, []);

  if (!time) return null;

  return (
    <div className={styles.heroCountdown}>
      <span className="badge badge-live" style={{ fontSize: '0.7rem' }}>LIVE AUCTION</span>
      <div className={styles.countdownBlocks}>
        {[
          { v: time.hours, l: 'GIỜ' },
          { v: time.minutes, l: 'PHÚT' },
          { v: time.seconds, l: 'GIÂY' },
        ].map(({ v, l }) => (
          <div key={l} className={styles.countdownBlock}>
            <span className={styles.countdownNum}>{String(v).padStart(2, '0')}</span>
            <span className={styles.countdownLabel}>{l}</span>
          </div>
        ))}
      </div>
      <Link to="/auction" className="btn btn-primary btn-sm" id="hero-join-auction">
        Vào phòng đấu giá <ArrowRight size={14} />
      </Link>
    </div>
  );
};

const HomePage = ({ onLoginClick, wishlisted, onWishlist }) => {
  const featuredArtworks = ARTWORKS.filter(a => a.is_featured);
  const allArtworks = ARTWORKS.slice(0, 4);

  const getSession = (artworkId) => AUCTION_SESSIONS.find(s => s.artwork_id === artworkId);

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img src="/hero_artwork.png" alt="Artisan Hub – Triển lãm nghệ thuật số" className={styles.heroBgImg} />
          <div className={styles.heroBgOverlay} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
              <span className="badge badge-gold">✦ Nền tảng nghệ thuật số #1</span>
              <span className="badge badge-verified">
                <Shield size={10} /> Bảo chứng 100%
              </span>
            </div>

            <h1 className={styles.heroTitle}>
              Khám phá &<br />
              <span className={styles.heroGold}>Sưu tầm Nghệ thuật</span><br />
              Độc bản
            </h1>

            <p className={styles.heroDesc}>
              Nền tảng triển lãm số và đấu giá tranh nghệ thuật độc bản với cơ chế
              bảo vệ 3 lớp. Mỗi tác phẩm được xác thực hiện vật, bảo đảm tính duy nhất
              bằng chứng chỉ số SHA-256.
            </p>

            <div className={styles.heroActions}>
              <Link to="/gallery" className="btn btn-primary btn-lg" id="hero-explore-btn">
                Khám phá tác phẩm <ArrowRight size={18} />
              </Link>
              <button className="btn btn-secondary btn-lg" onClick={onLoginClick} id="hero-signup-btn">
                Bắt đầu miễn phí
              </button>
            </div>

            <HeroCountdown />
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroCardStack}>
              <div className={`glass ${styles.heroArtCard}`}>
                <img src="/artwork_1.png" alt="Bình Minh Trên Biển Đông" className={styles.heroArt} />
                <div className={styles.heroArtInfo}>
                  <span className="badge badge-live">LIVE</span>
                  <h4 className={styles.heroArtTitle}>Bình Minh Trên Biển Đông</h4>
                  <p className={styles.heroArtPrice}>{formatPrice(22500000)}</p>
                </div>
              </div>
              <div className={`glass ${styles.heroArtCard2}`}>
                <img src="/artwork_2.png" alt="Sen Hồ Tây" className={styles.heroArt} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className={styles.scrollCue}>
          <ChevronDown size={20} color="var(--text-muted)" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className={styles.statCard}>
                <Icon size={20} color="var(--gold-primary)" />
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ===== FEATURES ===== */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Tính năng cốt lõi</span>
            <h2>Ba giá trị nền tảng của Artisan Hub</h2>
            <p>Chúng tôi giải quyết triệt để 3 rào cản lớn nhất của thị trường tranh độc bản trực tuyến.</p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`glass-gold ${styles.featureCard}`} style={{ '--delay': `${i * 0.1}s` }}>
                <div className={styles.featureIcon} style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <div className={styles.featureLine} style={{ background: f.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE AUCTIONS ===== */}
      <section className={`section ${styles.auctionSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Đang diễn ra</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <h2>Phiên đấu giá trực tiếp</h2>
              <Link to="/auction" className="btn btn-secondary" id="view-all-auction">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className={styles.artworkGrid}>
            {featuredArtworks.map(artwork => (
              <ArtworkCard
                key={artwork.artwork_id}
                artwork={artwork}
                session={getSession(artwork.artwork_id)}
                wishlisted={wishlisted.has(artwork.artwork_id)}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Triển lãm</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <h2>Tác phẩm nổi bật</h2>
              <Link to="/gallery" className="btn btn-secondary" id="view-all-gallery">
                Khám phá thêm <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className={styles.artworkGrid4}>
            {allArtworks.map(artwork => (
              <ArtworkCard
                key={artwork.artwork_id}
                artwork={artwork}
                session={getSession(artwork.artwork_id)}
                wishlisted={wishlisted.has(artwork.artwork_id)}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section className={`section ${styles.trustSection}`}>
        <div className="container-sm">
          <div className={styles.trustCard}>
            <div className={styles.trustBadges}>
              {[
                { icon: '🔐', title: 'Xác thực hiện vật', desc: 'Chụp tranh kèm mã ngẫu nhiên tại xưởng vẽ' },
                { icon: '💰', title: 'Ví ký quỹ 72h', desc: 'Khóa tiền 72h sau khi nhận hàng để nghiệm thu' },
                { icon: '🛡️', title: 'Bồi hoàn 100%', desc: 'Hội đồng thẩm định & cấp chứng chỉ số SHA-256' },
              ].map(item => (
                <div key={item.title} className={styles.trustItem}>
                  <span className={styles.trustEmoji}>{item.icon}</span>
                  <div>
                    <h4 className={styles.trustItemTitle}>{item.title}</h4>
                    <p className={styles.trustItemDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.trustCta}>
              <h2>Giao dịch an toàn.<br /><span className="gold-text">Tuyệt đối.</span></h2>
              <p>Mỗi tác phẩm đều có Thẻ chứng nhận số với mã băm SHA-256 và chữ ký số họa sĩ. Tra cứu nguồn gốc mọi lúc, mọi nơi.</p>
              <button className="btn btn-primary btn-lg" onClick={onLoginClick} id="trust-cta-btn">
                Bắt đầu sưu tầm ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <h3 className="gold-text" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.15em' }}>ARTISAN HUB</h3>
              <p>Nền tảng triển lãm số & đấu giá tranh nghệ thuật độc bản. Kết nối họa sĩ và nhà sưu tầm trong một không gian số sang trọng, an toàn và minh bạch.</p>
            </div>
            <div className={styles.footerLinks}>
              {[
                { title: 'Nền tảng', links: ['Khám phá', 'Đấu giá', 'Họa sĩ', 'Bộ sưu tập'] },
                { title: 'Hỗ trợ', links: ['Hướng dẫn', 'Chính sách', 'Liên hệ', 'FAQ'] },
                { title: 'Pháp lý', links: ['Điều khoản', 'Bảo mật', 'Chứng nhận', 'Quy trình'] },
              ].map(col => (
                <div key={col.title} className={styles.footerCol}>
                  <h5 className={styles.footerColTitle}>{col.title}</h5>
                  {col.links.map(l => (
                    <a key={l} href="#" className={styles.footerLink}>{l}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <hr className="divider" />
          <div className={styles.footerBottom}>
            <p>© 2024 Artisan Hub. Mọi quyền được bảo lưu.</p>
            <p>Đồ án môn Thiết kế Giao diện Người dùng Đồ họa</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
