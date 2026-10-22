import React, { useState, useEffect } from 'react';
import { X, Shield, ArrowRight, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatPrice, formatPriceFull } from '../data/mockData';
import styles from './LiveBidConfirmModal.module.css';

const LiveBidConfirmModal = ({
  artwork,
  currentPrice,
  bidIncrement,
  newPrice,
  onClose,
  onConfirm,
  submitting,
}) => {
  const [agreed, setAgreed] = useState(true);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, submitting]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-live-bid-title"
    >
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <span className="badge badge-live" style={{ fontSize: '0.68rem', alignSelf: 'flex-start' }}>
              ✦ Đấu giá trực tiếp · Live Auction
            </span>
            <h2 id="modal-live-bid-title" className={styles.headerTitle}>
              Xác nhận đặt giá thầu
            </h2>
          </div>
          <button
            className={`btn btn-icon btn-ghost ${styles.closeBtn}`}
            onClick={onClose}
            disabled={submitting}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Mini Artwork Info */}
          <div className={styles.artworkCard}>
            <img
              src={artwork.image}
              alt={artwork.title}
              className={styles.artworkThumb}
            />
            <div className={styles.artworkInfo}>
              <h4 className={styles.artworkTitle}>{artwork.title}</h4>
              <p className={styles.artworkArtist}>Họa sĩ: {artwork.artist_name}</p>
              <p className={styles.artworkMeta}>
                {artwork.medium} · {artwork.dimensions}
              </p>
            </div>
          </div>

          {/* Price Comparison */}
          <div className={styles.priceGrid}>
            <div className={styles.priceCol}>
              <p className={styles.priceLabel}>Giá hiện tại</p>
              <p className={styles.currentPriceVal}>{formatPrice(currentPrice)}</p>
            </div>

            <div className={styles.priceArrow} title="Tăng bước giá">
              <ArrowRight size={16} />
            </div>

            <div className={styles.newPriceCol}>
              <p className={styles.priceLabel}>Mức giá mới bạn đặt</p>
              <p className={styles.newPriceVal}>{formatPriceFull(newPrice)}</p>
            </div>
          </div>

          {/* Step Badge Row */}
          <div className={styles.stepBadgeRow}>
            <span className={styles.stepBadge}>
              <Zap size={13} /> Bước giá tăng thêm: +{formatPriceFull(bidIncrement)}
            </span>
            <span className={styles.guaranteeBadge}>
              <Shield size={13} /> Bảo chứng ví ký quỹ 72h
            </span>
          </div>

          {/* Legal Commitment Notice */}
          <div className={styles.commitmentBox}>
            <AlertCircle size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p className={styles.commitmentText}>
              <strong>Lưu ý quan trọng:</strong> Mức giá đặt mang tính ràng buộc pháp lý. Bạn cam kết thanh toán
              trong vòng <strong>48h</strong> qua Hợp đồng Escrow nếu là người trả giá cao nhất khi phiên đấu giá kết thúc.
            </p>
          </div>

          {/* Agreement Checkbox */}
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={submitting}
            />
            <span>
              Tôi xác nhận mức giá <strong style={{ color: 'var(--gold-primary)' }}>{formatPriceFull(newPrice)}</strong> và đồng ý tuân thủ quy chế đấu giá của Artisan Hub.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            id="confirm-submit-bid-btn"
            className={`btn btn-primary ${styles.confirmBtn}`}
            onClick={onConfirm}
            disabled={!agreed || submitting}
          >
            {submitting ? (
              <>
                <span className={styles.spinner} />
                Đang gửi lệnh thầu...
              </>
            ) : (
              <>
                <Zap size={16} />
                Xác nhận gửi giá thầu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveBidConfirmModal;
