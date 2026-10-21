import React, { useState } from 'react';
import {
  X, Lock, Shield, CheckCircle, AlertCircle,
  EyeOff, Award, ArrowRight, DollarSign, Info
} from 'lucide-react';
import { formatPriceFull, formatPrice } from '../data/mockData';
import styles from './SealedBidModal.module.css';

const SealedBidModal = ({ artwork, session, existingBid, onClose, onSubmitBid, currentUser }) => {
  const [step, setStep] = useState(1); // 1: Input Bid, 2: Commitment & Confirmation
  const reservePrice = session?.min_bid || artwork.reserve_price || 18000000;
  
  // Rule 8.2: Giá đặt phải >= reserve_price. Nếu đã đặt trước đó, chỉ được tăng giá (> existingBid.bid_amount), không được hạ hoặc rút.
  const minRequired = existingBid ? existingBid.bid_amount + (session?.bid_increment || 500000) : reservePrice;
  const [bidAmount, setBidAmount] = useState(existingBid ? minRequired : reservePrice);
  const [note, setNote] = useState(existingBid?.notes || '');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check if owner is trying to bid on their own artwork
  const isOwner = currentUser && (currentUser.user_id === artwork.artist_id || currentUser.user_id === artwork.owner_id);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (isOwner) {
      alert('Chủ tranh không được phép tự đặt giá vào tác phẩm của chính mình!');
      return;
    }
    if (Number(bidAmount) < minRequired) {
      if (existingBid) {
        alert(`Quy tắc phiên kín: Bạn chỉ được TĂNG GIÁ, không được hạ giá hoặc rút. Mức giá mới phải từ ${formatPriceFull(minRequired)} trở lên.`);
      } else {
        alert(`Giá thầu kín phải tối thiểu bằng giá khởi điểm (${formatPriceFull(minRequired)})`);
      }
      return;
    }
    setStep(2);
  };

  const handleConfirmSubmission = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmitBid({
        bid_amount: Number(bidAmount),
        note: note.trim(),
        bidder_name: currentUser?.full_name || 'Nhà sưu tầm bí mật',
        bidder_id: currentUser?.user_id || 'u_guest',
        is_raise: Boolean(existingBid),
      });
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Lock size={12} /> ĐẤU GIÁ KÍN (SEALED-BID)
            </span>
            <h2 className={styles.headerTitle}>
              {step === 1 ? 'Nộp hồ sơ ra giá kín' : 'Cam kết bí mật & Xác nhận'}
            </h2>
          </div>
          <button className={`btn btn-icon btn-ghost ${styles.closeBtn}`} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Artwork summary banner */}
        <div className={styles.artworkSummary}>
          <img src={artwork.image} alt={artwork.title} className={styles.artworkThumb} />
          <div className={styles.artworkInfo}>
            <h4 className={styles.artTitle}>{artwork.title}</h4>
            <p className={styles.artArtist}>Họa sĩ: {artwork.artist_name}</p>
            <p className={styles.artMinBid}>
              Giá khởi điểm sàn: <strong>{formatPriceFull(minRequired)}</strong>
            </p>
          </div>
        </div>

        {/* STEP 1: Nhập giá */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className={styles.formContent}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="sealed-bid-amount">
                <DollarSign size={16} /> Mức giá bạn muốn đặt (VND)
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="sealed-bid-amount"
                  type="number"
                  className="input"
                  min={minRequired}
                  step={500000}
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  required
                />
              </div>
              <p className={styles.helperPriceText}>
                Số tiền bằng chữ: <strong>{formatPriceFull(Number(bidAmount) || 0)}</strong>
              </p>
            </div>

            {/* Quick Increment suggestions */}
            <div className={styles.quickStepsWrap}>
              <span className={styles.quickLabel}>Gợi ý nhanh trên mức khởi điểm:</span>
              <div className={styles.quickButtons}>
                {[1000000, 3000000, 5000000, 10000000].map(add => (
                  <button
                    key={add}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setBidAmount(minRequired + add)}
                  >
                    +{formatPrice(add)}
                  </button>
                ))}
              </div>
            </div>

            {/* Ghi chú hoặc lời nhắn cho Artist */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="sealed-bid-note">
                Lời nhắn riêng cho Họa sĩ (Không bắt buộc)
              </label>
              <textarea
                id="sealed-bid-note"
                className="input"
                rows={3}
                placeholder="VD: Tôi mong muốn sưu tầm để trưng bày tại triển lãm gia đình, cam kết đặt cọc và thanh toán ngay..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <div className={styles.secrecyNotice}>
              <EyeOff size={16} color="var(--gold-primary)" />
              <p>
                <strong>Quy chế bảo mật giá:</strong> Mức giá này được mã hóa và lưu trữ bí mật. 
                Không có bất kỳ người tham gia nào khác nhìn thấy giá của bạn. Chỉ khi phiên kết thúc, 
                Họa sĩ mới mở bảng xếp hạng giá thầu.
              </p>
            </div>

            <div className={styles.footerActions}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Hủy bỏ
              </button>
              <button id="btn-proceed-commitment" type="submit" className="btn btn-primary">
                Tiếp tục cam kết <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Commitment & Final Confirmation */}
        {step === 2 && (
          <div className={styles.confirmContent}>
            <div className={styles.reviewBox}>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Mức giá thầu kín</span>
                <span className={styles.reviewValueBig}>{formatPriceFull(Number(bidAmount))}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Trạng thái bảo mật</span>
                <span className={styles.reviewStatus}>
                  <Lock size={12} /> Mã hóa một chiều · Bảo mật tuyệt đối
                </span>
              </div>
              {note && (
                <div className={styles.reviewRowNotes}>
                  <span className={styles.reviewLabel}>Lời nhắn gửi Họa sĩ</span>
                  <p className={styles.reviewNoteText}>"{note}"</p>
                </div>
              )}
            </div>

            {/* Commitment checks */}
            <div className={styles.commitmentCard}>
              <h4 className={styles.commitmentTitle}>
                <Shield size={16} color="var(--gold-primary)" /> Cam kết đấu giá kín có trách nhiệm
              </h4>
              <ul className={styles.commitmentList}>
                <li><strong>Giá của bạn được giữ bí mật, không thể rút hoặc hạ giá</strong> trong suốt phiên.</li>
                <li>Bạn có quyền tăng giá bất kỳ lúc nào trước khi phiên kết thúc.</li>
                <li>Chủ sở hữu tác phẩm chỉ mở xem bảng giá thầu khi phiên kết thúc.</li>
                <li>Nếu là người trả giá cao nhất khi hết giờ, giao dịch sẽ hoàn tất qua <strong>Ví ký quỹ Escrow 72h</strong>.</li>
              </ul>
            </div>

            <label className={styles.agreementLabel}>
              <input
                id="checkbox-sealed-agreement"
                type="checkbox"
                checked={agreementChecked}
                onChange={e => setAgreementChecked(e.target.checked)}
              />
              <span>
                Tôi xác nhận mức giá <strong>{formatPriceFull(Number(bidAmount))}</strong> là chính xác: <em>"Giá của bạn được giữ bí mật, không thể rút"</em>.
              </span>
            </label>

            <div className={styles.footerActions}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                Quay lại
              </button>
              <button
                id="btn-submit-sealed-bid"
                type="button"
                className="btn btn-primary"
                disabled={!agreementChecked || submitting}
                onClick={handleConfirmSubmission}
              >
                {submitting ? 'Đang gửi hồ sơ mã hóa...' : 'Xác nhận nộp giá thầu kín'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SealedBidModal;
