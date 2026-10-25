import React, { useState, useEffect } from 'react';
import styles from './BackToTop.module.css';

/**
 * BackToTop - Nút cuộn trang thiết kế Khung tranh mạ vàng lồng nét cọ hướng thượng
 * Biểu tượng rõ ràng, sắc nét và nhận diện ngay lập tức chức năng cuộn trang.
 */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      id="back-to-top-btn"
      className={styles.frameButton}
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
    >
      <svg
        className={styles.iconSvg}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="artGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
        </defs>

        {/* Khung tranh mỹ thuật bo góc hình thoi tinh tế */}
        <rect
          x="2"
          y="2"
          width="24"
          height="24"
          rx="6"
          stroke="rgba(212, 175, 55, 0.4)"
          strokeWidth="1.2"
          className={styles.frameBorder}
        />

        {/* Nét vẽ đỉnh nhọn mũi tên chữ V phong cách cọ vẽ thư pháp */}
        <path
          d="M 8.5 15 L 14 9.5 L 19.5 15"
          stroke="url(#artGoldGradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.arrowChevron}
        />

        {/* Cán bút / Vệt sơn thẳng đứng thanh thoát */}
        <path
          d="M 14 10 L 14 19.5"
          stroke="url(#artGoldGradient)"
          strokeWidth="2.2"
          strokeLinecap="round"
          className={styles.arrowStem}
        />

        {/* Giác cắt điểm nhấn đỉnh mũi cọ */}
        <circle
          cx="14"
          cy="6.5"
          r="1"
          fill="#FFF9D2"
          className={styles.topDot}
        />
      </svg>
      <span className={styles.haloGlow} />
    </button>
  );
};

export default BackToTop;
