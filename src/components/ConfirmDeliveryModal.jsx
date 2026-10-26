import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle,
  X, ArrowRight, Lock, FileCheck2, Box, Eye
} from 'lucide-react';
import { formatPriceFull } from '../data/mockData';
import styles from './ConfirmDeliveryModal.module.css';

const ConfirmDeliveryModal = ({
  order,
  artwork,
  onClose,
  onConfirmRelease,
}) => {
  // Checklists to prevent unconscious slips
  const [checkedBox, setCheckedBox] = useState(false);
  const [checkedCert, setCheckedCert] = useState(false);
  const [checkedRelease, setCheckedRelease] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, submitting]);

  const canConfirm = checkedBox && checkedCert && checkedRelease;

  const handleConfirm = () => {
    if (!canConfirm || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onConfirmRelease();
      setSubmitting(false);
    }, 700);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delivery-title"
    >
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <div className={styles.badgeShield}>
              <ShieldCheck size={14} /> Chốt chặn an toàn Escrow 72h
            </div>
            <h2 id="confirm-delivery-title" className={styles.title}>
              Xác nhận Nghiệm thu & Giải ngân
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

        {/* Artwork & Order Snapshot */}
        <div className={styles.orderSummary}>
          <div className={styles.artPreview}>
            <img src={artwork?.image || '/artwork_2.png'} alt={artwork?.title} className={styles.artImg} />
            <div>
              <p className={styles.artTitle}>{artwork?.title || 'Sen Hồ Tây'}</p>
              <p className={styles.artArtist}>Họa sĩ: <strong>{artwork?.artist_name || 'Nguyễn Phúc An'}</strong></p>
              <p className={styles.artOrderCode}>Mã ký quỹ: #{order?.escrow_id?.toUpperCase() || 'ESC1'}</p>
            </div>
          </div>
          <div className={styles.payoutAmountBox}>
            <span className={styles.amountLabel}>Số tiền giải ngân cho Họa sĩ:</span>
            <span className={styles.amountValue}>{formatPriceFull(order?.amount_locked || 35000000)}</span>
          </div>
        </div>

        {/* Warning Callout */}
        <div className={styles.warningBox}>
          <AlertTriangle size={20} className={styles.warningIcon} />
          <div>
            <p className={styles.warningTitle}>Hành động tài chính có hiệu lực tức thì</p>
            <p className={styles.warningDesc}>
              Sau khi bạn xác nhận, toàn bộ <strong>{formatPriceFull(order?.amount_locked || 35000000)}</strong> trong ví ký quỹ sẽ được chuyển thẳng về tài khoản Họa sĩ và <strong>không thể thu hồi hoặc hoàn tác</strong>.
            </p>
          </div>
        </div>

        {/* Conscious Checklist - Friction with Purpose */}
        <div className={styles.checklistSection}>
          <p className={styles.checklistTitle}>
            Vui lòng tự kiểm tra các mục bên dưới để kích hoạt nút giải ngân:
          </p>

          <label className={`${styles.checkItem} ${checkedBox ? styles.checkItemActive : ''}`}>
            <input
              type="checkbox"
              checked={checkedBox}
              onChange={(e) => setCheckedBox(e.target.checked)}
              disabled={submitting}
            />
            <div className={styles.checkContent}>
              <div className={styles.checkHead}>
                <Box size={14} className={styles.iconGold} />
                <span>1. Đã mở kiện gỗ & kiểm tra tác phẩm nguyên vẹn</span>
              </div>
              <p className={styles.checkSub}>Khung tranh, bề mặt sơn mài/dầu không trầy xước, nứt vỡ trong quá trình vận chuyển.</p>
            </div>
          </label>

          <label className={`${styles.checkItem} ${checkedCert ? styles.checkItemActive : ''}`}>
            <input
              type="checkbox"
              checked={checkedCert}
              onChange={(e) => setCheckedCert(e.target.checked)}
              disabled={submitting}
            />
            <div className={styles.checkContent}>
              <div className={styles.checkHead}>
                <FileCheck2 size={14} className={styles.iconGold} />
                <span>2. Đã đối chiếu Thẻ chứng nhận số SHA-256</span>
              </div>
              <p className={styles.checkSub}>Mã băm trên mặt sau tranh và chữ ký gốc của nghệ nhân hoàn toàn trùng khớp.</p>
            </div>
          </label>

          <label className={`${styles.checkItem} ${checkedRelease ? styles.checkItemActive : ''}`}>
            <input
              type="checkbox"
              checked={checkedRelease}
              onChange={(e) => setCheckedRelease(e.target.checked)}
              disabled={submitting}
            />
            <div className={styles.checkContent}>
              <div className={styles.checkHead}>
                <Lock size={14} className={styles.iconGold} />
                <span>3. Đồng ý kết thúc thời gian 72h nghiệm thu và giải ngân</span>
              </div>
              <p className={styles.checkSub}>Tôi hiểu quyền khiếu nại tranh chấp sẽ chấm dứt sau khi hoàn tất bước này.</p>
            </div>
          </label>
        </div>

        {/* Modal Actions */}
        <div className={styles.footerActions}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Tôi cần thêm thời gian xem xét
          </button>

          <button
            type="button"
            className={`btn ${canConfirm ? 'btn-primary' : 'btn-disabled'} ${styles.submitBtn}`}
            onClick={handleConfirm}
            disabled={!canConfirm || submitting}
          >
            {submitting ? (
              <span>Đang tiến hành giải ngân...</span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>{canConfirm ? 'Xác nhận giải ngân ngay' : 'Tick đủ 3 mục để giải ngân'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeliveryModal;
