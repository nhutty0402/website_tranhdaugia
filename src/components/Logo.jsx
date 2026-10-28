import React from 'react';
import styles from './Logo.module.css';

/**
 * Logo - Biểu tượng nghệ thuật Artisan Hub
 * Thiết kế: Khung gallery mạ vàng tinh xảo, Monogram 'A' nét cọ thư pháp nghệ thuật hoàng gia,
 * kết hợp giác cắt kim cương độc bản và nhận diện thương hiệu cao cấp.
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
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Dải gradient vàng kim loại hoàng gia sang trọng */}
            <linearGradient id="artisanGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="25%" stopColor="#F5D77F" />
              <stop offset="55%" stopColor="#C5A059" />
              <stop offset="85%" stopColor="#E2BD6E" />
              <stop offset="100%" stopColor="#9E7324" />
            </linearGradient>

            <linearGradient id="artisanBrushStroke" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFBE6" />
              <stop offset="30%" stopColor="#EDCE7B" />
              <stop offset="70%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#8C5E16" />
            </linearGradient>

            <linearGradient id="artisanFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 248, 220, 0.85)" />
              <stop offset="45%" stopColor="rgba(197, 160, 89, 0.45)" />
              <stop offset="100%" stopColor="rgba(140, 94, 22, 0.75)" />
            </linearGradient>

            <linearGradient id="artisanInnerBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(30, 26, 18, 0.6)" />
              <stop offset="100%" stopColor="rgba(10, 10, 10, 0.9)" />
            </linearGradient>

            {/* Hiệu ứng hào quang vàng nghệ thuật */}
            <filter id="brushGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#D4AF37" floodOpacity="0.4" />
            </filter>
            
            <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FFF8DC" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Khung viền Gallery mạ vàng tinh xảo */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="11"
            fill="url(#artisanInnerBg)"
            stroke="url(#artisanFrameGrad)"
            strokeWidth="1.2"
            className={styles.frameRect}
          />

          {/* Chỉ viền nội bộ tạo chiều sâu khung tranh */}
          <rect
            x="7.5"
            y="7.5"
            width="33"
            height="33"
            rx="8"
            fill="none"
            stroke="rgba(212, 175, 55, 0.22)"
            strokeWidth="0.75"
            strokeDasharray="3 2"
          />

          {/* 4 Góc nẹp khảm vàng phong cách bảo tàng nghệ thuật */}
          <path d="M 6.5 13 L 6.5 7 L 12.5 7" stroke="url(#artisanGoldMain)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 41.5 13 L 41.5 7 L 35.5 7" stroke="url(#artisanGoldMain)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 6.5 35 L 6.5 41 L 12.5 41" stroke="url(#artisanGoldMain)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 41.5 35 L 41.5 41 L 35.5 41" stroke="url(#artisanGoldMain)" strokeWidth="1.2" strokeLinecap="round" />

          {/* Monogram 'A' nghệ thuật - Nét cọ thư pháp (Artistic Brushstroke) */}
          {/* Cánh trái 'A': Nét thanh mảnh, uốn lượn mềm mại */}
          <path
            d="M 15 35 C 16.5 34.5, 18 31, 21.5 20 C 22.8 16, 23.6 13, 24 11.5"
            stroke="url(#artisanBrushStroke)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#brushGlow)"
          />

          {/* Cánh phải 'A': Vết cọ sơn dầu đậm nét, chuyển nhịp dày mỏng tinh tế */}
          <path
            d="M 23.8 11.5 C 24.5 12, 26 17, 28.5 23.5 C 31 30, 32.8 33.5, 34 35 C 34.6 35.8, 33.5 36.2, 32.2 35.5 C 30.5 34.2, 28.8 29.5, 26.8 23 C 25.2 17.8, 24.2 13.5, 23.8 11.5 Z"
            fill="url(#artisanBrushStroke)"
            filter="url(#brushGlow)"
          />

          {/* Chân đế chữ A bên trái - nét phết cọ nghệ sĩ */}
          <path
            d="M 13.5 35 C 14.8 35.2, 16.2 34.8, 17 33.5"
            stroke="url(#artisanGoldMain)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Nét gạch ngang cách điệu dải lụa / vệt sơn dầu mềm mại */}
          <path
            d="M 18 26.2 C 21 24.8, 25 27.2, 29.5 25.2"
            stroke="url(#artisanGoldMain)"
            strokeWidth="1.8"
            strokeLinecap="round"
            filter="url(#brushGlow)"
          />

          {/* Giác cắt kim cương / Tinh hoa hội tụ tại đỉnh chóp */}
          <path
            d="M 24 8 L 25.5 10 L 24 12 L 22.5 10 Z"
            fill="#FFFCE8"
            filter="url(#starGlow)"
          />
        </svg>
        <span className={styles.auraLight}></span>
      </div>

      {showText && (
        <div className={styles.brandDetails}>
          <div className={styles.brandTitleRow}>
            <span className={styles.brandNamePrimary}>ARTISAN</span>
            <span className={styles.brandNameAccent}>HUB</span>
          </div>
          {subtitle && <span className={styles.brandTagline}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default Logo;

