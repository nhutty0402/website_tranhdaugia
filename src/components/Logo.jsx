import React from 'react';
import styles from './Logo.module.css';

/**
 * Logo - Biểu tượng thương hiệu độc quyền của Artisan Hub
 * Thiết kế: Khung tranh sơn mài mạ vàng hoàng gia (Royal Beveled Frame),
 * kết hợp Monogram chữ 'A' cách điệu mũi bút lông nghệ thuật và giác cắt kim cương độc bản.
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
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Dải gradient vàng kim loại hoàng gia đa tầng */}
            <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#AA771C" />
              <stop offset="75%" stopColor="#F3E5AB" />
              <stop offset="100%" stopColor="#996515" />
            </linearGradient>

            <linearGradient id="frameBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 230, 150, 0.9)" />
              <stop offset="50%" stopColor="rgba(197, 160, 89, 0.5)" />
              <stop offset="100%" stopColor="rgba(138, 90, 20, 0.8)" />
            </linearGradient>

            <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(212, 175, 55, 0.25)" />
              <stop offset="100%" stopColor="rgba(10, 10, 12, 0.85)" />
            </linearGradient>

            {/* Hiệu ứng bóng sáng vàng */}
            <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#D4AF37" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Khung bên ngoài (Beveled Art Frame - hình thoi bo góc tinh tế) */}
          <rect
            x="4"
            y="4"
            width="36"
            height="36"
            rx="9"
            fill="url(#innerGlow)"
            stroke="url(#frameBorder)"
            strokeWidth="1.5"
            className={styles.frameRect}
          />

          {/* Vạch viền tinh tế phía trong tạo chiều sâu khung tranh */}
          <rect
            x="7"
            y="7"
            width="30"
            height="30"
            rx="6.5"
            fill="none"
            stroke="rgba(212, 175, 55, 0.22)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* 4 Góc khảm nẹp vàng phong cách gallery cổ điển */}
          <path d="M 6 12 L 6 6 L 12 6" stroke="url(#goldMetallic)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 38 12 L 38 6 L 32 6" stroke="url(#goldMetallic)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 6 32 L 6 38 L 12 38" stroke="url(#goldMetallic)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 38 32 L 38 38 L 32 38" stroke="url(#goldMetallic)" strokeWidth="1.2" strokeLinecap="round" />

          {/* Monogram Nghệ Thuật: Chữ 'A' cách điệu bút vẽ hoàng gia */}
          {/* Cánh trái 'A' thanh mảnh */}
          <path
            d="M 22 11 L 13 32"
            stroke="url(#goldMetallic)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#royalGlow)"
          />

          {/* Cánh phải 'A' nét đậm thư pháp */}
          <path
            d="M 22 11 L 31 32"
            stroke="url(#goldMetallic)"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#royalGlow)"
          />

          {/* Nét gạch ngang 'A' uốn lượn như vệt sơn dầu nghệ thuật */}
          <path
            d="M 16 24 C 19 22.5, 25 25.5, 28 24"
            stroke="#FFF2B2"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Giác cắt kim cương đỉnh chóp - biểu tượng cho tác phẩm độc bản đỉnh cao */}
          <path
            d="M 22 9 L 23.5 11 L 22 12.5 L 20.5 11 Z"
            fill="#FFF9D2"
            filter="url(#royalGlow)"
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
