import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, X, ShieldAlert, Upload, CheckCircle2,
  HelpCircle, Camera, FileText
} from 'lucide-react';
import { formatPriceFull } from '../data/mockData';
import styles from './ReportIssueModal.module.css';

const ISSUE_REASONS = [
  { id: 'damage', label: 'Kiện gỗ/Tranh bị nứt vỡ, ẩm mốc do vận chuyển' },
  { id: 'mismatch', label: 'Tác phẩm sai khác đáng kể so với ảnh và mô tả triển lãm' },
  { id: 'authenticity', label: 'Nghi ngờ chữ ký, tem niêm phong hoặc chứng thư số SHA-256' },
  { id: 'missing', label: 'Thiếu giấy chứng nhận hoặc phụ kiện đi kèm' },
  { id: 'other', label: 'Vấn đề phát sinh khác' },
];

const ReportIssueModal = ({
  order,
  artwork,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [hasPhotos, setHasPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, submitting]);

  const canSubmit = selectedReason.trim() !== '' && description.trim().length >= 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmitReport({
        reason: selectedReason,
        description,
        hasPhotos,
      });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-issue-title"
    >
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <div className={styles.badgeDispute}>
              <ShieldAlert size={14} /> Tạm dừng ký quỹ · Mở khiếu nại
            </div>
            <h2 id="report-issue-title" className={styles.title}>
              Báo cáo sự cố tác phẩm #{order?.escrow_id?.toUpperCase() || 'ESC1'}
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

        {/* Protection Note */}
        <div className={styles.infoBanner}>
          <AlertTriangle size={18} className={styles.infoIcon} />
          <p className={styles.infoText}>
            Nếu bạn vô tình click nhầm nút, hãy bấm <strong>"Hủy bỏ"</strong> để tiếp tục thời gian nghiệm thu 72h. Nếu bạn gửi báo cáo, khoản ký quỹ <strong>{formatPriceFull(order?.amount_locked || 35000000)}</strong> sẽ lập tức được <strong>đóng băng</strong> để Ban giám định L3 thẩm định.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Reason Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              1. Chọn nguyên nhân sự cố <span className={styles.required}>*</span>
            </label>
            <div className={styles.reasonList}>
              {ISSUE_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={`${styles.reasonItem} ${selectedReason === r.id ? styles.reasonItemActive : ''}`}
                >
                  <input
                    type="radio"
                    name="dispute_reason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={() => setSelectedReason(r.id)}
                    disabled={submitting}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              2. Mô tả chi tiết tình trạng thực tế <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Vui lòng mô tả cụ thể vị trí trầy xước, vết nứt bề mặt hoặc điểm sai khác so với thông tin triển lãm... (tối thiểu 10 ký tự)"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
            <span className={styles.charCount}>
              {description.length}/10 ký tự tối thiểu
            </span>
          </div>

          {/* Evidence Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              3. Đính kèm ảnh/video mở kiện gỗ (Khuyến nghị)
            </label>
            <div
              className={`${styles.uploadBox} ${hasPhotos ? styles.uploadBoxDone : ''}`}
              onClick={() => !submitting && setHasPhotos(!hasPhotos)}
            >
              {hasPhotos ? (
                <div className={styles.uploadDone}>
                  <CheckCircle2 size={24} className={styles.iconSuccess} />
                  <span>Đã tải lên 2 ảnh mở kiện gỗ & tem niêm phong (Click để gỡ)</span>
                </div>
              ) : (
                <div className={styles.uploadPrompt}>
                  <Camera size={22} className={styles.uploadIcon} />
                  <span>Nhấn để chọn ảnh bằng chứng hoặc quay video unboxing hiện trường</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.footerActions}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy bỏ (Tôi click nhầm)
            </button>

            <button
              type="submit"
              className={`btn btn-danger ${styles.submitBtn}`}
              disabled={!canSubmit || submitting}
            >
              {submitting ? 'Đang gửi hồ sơ...' : 'Đóng băng Escrow & Gửi thẩm định'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;
