import React from 'react';
import styles from './Logo.module.css';

/**
 * Logo - Biểu tượng thương hiệu Artisan Hub đẳng cấp
 * Tái thiết kế: Monogram 'A' mạ vàng hoàng gia nổi bật,
 * viên kim cương bảo chứng đỉnh chóp, khung ấn dấu bảo tàng (Museum Seal),
 * tương phản cao trên nền tối, nhận diện thương hiệu tức thì.
 */
const Logo = ({
  size = 'md',        // 'sm' | 'md' | 'lg' | 'hero'
  showText = true,    // hiển thị kèm tên thương hiệu hay chỉ icon
  subtitle = 'AUCTION & GALLERY', // tagline phụ sang trọng
  className = '',
}) => {
  return (
    <div className={`${styles.logoContainer} ${styles[size]} ${className}`}>
      <div className={styles.iconWrapper}>
        <svg
          className={styles.svgSymbol}
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Dải gradient vàng kim loại hoàng kim 5 điểm sáng bóng */}
            <linearGradient id="artisanGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#FFF2B8" />
              <stop offset="45%" stopColor="#F5D061" />
              <stop offset="75%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#8F6218" />
            </linearGradient>

            {/* Gradient viền nẹp khảm vàng */}
            <linearGradient id="artisanGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF7D6" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="60%" stopColor="#8C6016" />
              <stop offset="85%" stopColor="#FBE399" />
              <stop offset="100%" stopColor="#B3862B" />
            </linearGradient>

            {/* Nền trong của ấn dấu nghệ thuật - gradient đa tầng có ánh sáng tâm */}
            <radialGradient id="artisanEmblemBg" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#2E2619" />
              <stop offset="55%" stopColor="#1C1813" />
              <stop offset="100%" stopColor="#0E0D0C" />
            </radialGradient>

            {/* Hiệu ứng phát quang vàng kim */}
            <filter id="royalGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#D4AF37" floodOpacity="0.6" />
            </filter>

            {/* Hiệu ứng tỏa sáng kim cương */}
            <filter id="diamondSparkle" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#FFFDF0" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* 1. KHUNG ẤN DẤU BẢO TÀNG (MUSEUM SEAL) */}
          <rect
            x="3"
            y="3"
            width="46"
            height="46"
            rx="13"
            fill="url(#artisanEmblemBg)"
            stroke="url(#artisanGoldBorder)"
            strokeWidth="1.8"
            className={styles.frameRect}
          />

          {/* 2. CHỈ NẸP KHUNG TRANH NỘI BỘ */}
          <rect
            x="6.5"
            y="6.5"
            width="39"
            height="39"
            rx="9.5"
            fill="none"
            stroke="rgba(212, 175, 55, 0.45)"
            strokeWidth="0.8"
          />

          {/* 4 ĐIỂM CHỐT VÀNG NGHỆ THUẬT Ở 4 GÓC */}
          <circle cx="9" cy="9" r="1.3" fill="#FFF2B8" />
          <circle cx="43" cy="9" r="1.3" fill="#FFF2B8" />
          <circle cx="9" cy="43" r="1.3" fill="#FFF2B8" />
          <circle cx="43" cy="43" r="1.3" fill="#FFF2B8" />

          {/* 3. MONOGRAM 'A' HOÀNG GIA ĐỘC BẢN */}
          {/* Chân đế trái (Serif) */}
          <path d="M 14 38.5 L 21 38.5" stroke="url(#artisanGoldLight)" strokeWidth="1.8" strokeLinecap="round" />
          
          {/* Cánh trái chữ A (Nét thanh) */}
          <path
            d="M 17.5 38.5 L 26 15"
            stroke="url(#artisanGoldLight)"
            strokeWidth="2.2"
            strokeLinecap="round"
            filter="url(#royalGoldGlow)"
          />

          {/* Cánh phải chữ A (Nét đậm hoàng gia, chuyển nhịp dày dặn) */}
          <path
            d="M 26 15 L 34.5 38.5"
            stroke="url(#artisanGoldLight)"
            strokeWidth="3.6"
            strokeLinecap="round"
            filter="url(#royalGoldGlow)"
          />

          {/* Chân đế phải (Serif) */}
          <path d="M 31 38.5 L 38 38.5" stroke="url(#artisanGoldLight)" strokeWidth="2.2" strokeLinecap="round" />

          {/* Nét gạch ngang cách điệu vệt cọ sơn dầu vắt ngang */}
          <path
            d="M 20.5 29 C 23.5 27.5, 28 30.5, 32.5 28.5"
            stroke="url(#artisanGoldLight)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#royalGoldGlow)"
          />

          {/* 4. VIÊN KIM CƯƠNG BẢO CHỨNG TẠI ĐỈNH CHÓP */}
          <path
            d="M 26 8.5 L 28.2 12 L 26 15.5 L 23.8 12 Z"
            fill="#FFFFFF"
            filter="url(#diamondSparkle)"
          />
          <circle cx="26" cy="12" r="1" fill="#FFF8DC" />
        </svg>
        <span className={styles.auraLight}></span>
      </div>

      {showText && (
        <div className={styles.brandDetails}>
          <div className={styles.brandTitleRow}>
            <span className={styles.brandNamePrimary}>ARTISAN</span>
            <span className={styles.brandNameAccent}>HUB</span>
          </div>
          {subtitle && (
            <div className={styles.taglineRow}>
              <span className={styles.taglineDot}>◆</span>
              <span className={styles.brandTagline}>{subtitle}</span>
              <span className={styles.taglineDot}>◆</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
