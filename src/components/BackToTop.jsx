import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import styles from './BackToTop.module.css';

/**
 * BackToTop - Nút cuộn lên đầu trang chuẩn Museum Grade cho Artisan Hub
 * Thiết kế tinh tế, biểu tượng mũi tên hướng thượng thanh thoát trên bệ đỡ nghệ thuật,
 * loại bỏ hoàn toàn cảm giác lồng khung chật chội, đạt chuẩn nhận diện tức thì (Heuristic H2/H6).
 */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
    <div className={styles.container}>
      <button
        type="button"
        id="back-to-top-btn"
        className={styles.button}
        onClick={scrollToTop}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Cuộn lên đầu trang"
        title="Cuộn lên đầu trang"
      >
        <div className={styles.iconWrapper}>
          <ChevronUp size={20} strokeWidth={2.4} className={styles.chevronIcon} />
          <span className={styles.pedestalLine} />
        </div>
        <span className={styles.haloGlow} />
      </button>

      {/* Tooltip nghệ thuật xuất hiện khi hover */}
      <span className={`${styles.tooltip} ${showTooltip ? styles.tooltipVisible : ''}`}>
        Lên đầu trang
      </span>
    </div>
  );
};

export default BackToTop;
