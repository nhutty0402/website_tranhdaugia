import React, { useState } from 'react';
import {
  X, Lock, Globe, Shield, Calendar, DollarSign,
  AlertCircle, CheckCircle, ArrowRight, Eye, Info
} from 'lucide-react';
import { ARTWORKS, formatPriceFull } from '../data/mockData';
import styles from './CreateAuctionModal.module.css';

const CreateAuctionModal = ({ onClose, onSuccess, artistArtworks, currentUser }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Preview & Confirm

  // Available artworks for artist (either created by artist or available in list)
  const availableArtworks = artistArtworks && artistArtworks.length > 0 
    ? artistArtworks 
    : ARTWORKS.filter(a => a.artist_id === currentUser?.user_id || currentUser?.role === 'artist');

  const [selectedArtworkId, setSelectedArtworkId] = useState(availableArtworks[0]?.artwork_id || ARTWORKS[0].artwork_id);
  const [auctionType, setAuctionType] = useState('sealed'); // 'sealed' | 'live'
  const [minBid, setMinBid] = useState(20000000);
  const [bidIncrement, setBidIncrement] = useState(500000);

  // Default start: now, end: 3 days from now
  const now = new Date();
  const defaultStart = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const future = new Date(now.getTime() + 3 * 24 * 3600000);
  const defaultEnd = new Date(future.getTime() - future.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [isBidVisiblePublic, setIsBidVisiblePublic] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedArtwork = ARTWORKS.find(a => a.artwork_id === selectedArtworkId) || availableArtworks[0] || ARTWORKS[0];

  const handleNextToPreview = (e) => {
    e.preventDefault();
    if (new Date(endTime) <= new Date(startTime)) {
      alert('Thời gian kết thúc phải diễn ra sau thời gian bắt đầu!');
      return;
    }
    setStep(2);
  };

  const handleConfirmCreate = () => {
    setSubmitting(true);
    setTimeout(() => {
      const newSession = {
        session_id: `as_${Date.now()}`,
        artwork_id: selectedArtwork.artwork_id,
        auction_type: auctionType,
        min_bid: Number(minBid),
        bid_increment: Number(bidIncrement),
        is_bid_visible_public: auctionType === 'live' ? true : isBidVisiblePublic,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        current_highest_price: Number(minBid),
        winner_id: null,
        winner_contacted_at: null,
        status: new Date(startTime) <= new Date() ? 'live' : 'upcoming',
      };
      setSubmitting(false);
      onSuccess(newSession);
      onClose();
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <span className="badge badge-gold">✦ Flow 5 · Họa sĩ quản trị</span>
            <h2 className={styles.headerTitle}>
              {step === 1 ? 'Tạo phiên đấu giá tác phẩm' : 'Xem trước & Xác nhận phiên'}
            </h2>
          </div>
          <button className={`btn btn-icon btn-ghost ${styles.closeBtn}`} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className={styles.stepProgress}>
          <div className={`${styles.stepIndicator} ${step >= 1 ? styles.stepActive : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span>Thiết lập thông số</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepIndicator} ${step >= 2 ? styles.stepActive : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span>Xem trước & Kích hoạt</span>
          </div>
        </div>

        {/* STEP 1: Form thiết lập */}
        {step === 1 && (
          <form onSubmit={handleNextToPreview} className={styles.formBody}>
            {/* Chọn tác phẩm */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Chọn tác phẩm đấu giá</label>
              <select
                id="select-artwork"
                className="input"
                value={selectedArtworkId}
                onChange={e => setSelectedArtworkId(e.target.value)}
              >
                {availableArtworks.map(art => (
                  <option key={art.artwork_id} value={art.artwork_id}>
                    {art.title} ({art.medium} · {art.dimensions})
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn loại phiên: Công khai vs Kín */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Hình thức đấu giá</label>
              <div className={styles.typeSelectorGrid}>
                {/* Option 1: Phiên kín (Sealed-bid) */}
                <div
                  id="type-sealed"
                  className={`${styles.typeCard} ${auctionType === 'sealed' ? styles.typeSelected : ''}`}
                  onClick={() => {
                    setAuctionType('sealed');
                    setIsBidVisiblePublic(false);
                  }}
                >
                  <div className={styles.typeCardHeader}>
                    <div className={styles.typeIconWrap}>
                      <Lock size={18} color="var(--gold-primary)" />
                    </div>
                    <div>
                      <h4 className={styles.typeName}>Phiên Đấu Giá Kín (Sealed-bid)</h4>
                      <span className={styles.typeTag}>Được khuyến nghị cho tác phẩm độc bản</span>
                    </div>
                  </div>
                  <p className={styles.typeDesc}>
                    Các nhà sưu tầm ra giá bí mật một lần duy nhất. Giá thầu được bảo mật tuyệt đối, chỉ họa sĩ mới có quyền mở bảng xếp hạng thầu và lựa chọn liên hệ người thắng.
                  </p>
                </div>

                {/* Option 2: Phiên công khai (Live) */}
                <div
                  id="type-live"
                  className={`${styles.typeCard} ${auctionType === 'live' ? styles.typeSelected : ''}`}
                  onClick={() => {
                    setAuctionType('live');
                    setIsBidVisiblePublic(true);
                  }}
                >
                  <div className={styles.typeCardHeader}>
                    <div className={styles.typeIconWrap}>
                      <Globe size={18} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <h4 className={styles.typeName}>Phiên Công Khai Trực Tiếp (Live)</h4>
                      <span className={styles.typeTagMuted}>Đua giá realtime 1-chạm</span>
                    </div>
                  </div>
                  <p className={styles.typeDesc}>
                    Mọi người đều nhìn thấy giá cao nhất theo thời gian thực và tự do nâng giá theo bước thầu.
                  </p>
                </div>
              </div>
            </div>

            {/* Giá khởi điểm & Bước giá */}
            <div className={styles.gridTwo}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  <DollarSign size={14} /> Giá khởi điểm (VND)
                </label>
                <input
                  id="input-min-bid"
                  type="number"
                  className="input"
                  min={1000000}
                  step={500000}
                  value={minBid}
                  onChange={e => setMinBid(e.target.value)}
                  required
                />
                <span className={styles.helperText}>{formatPriceFull(Number(minBid) || 0)}</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Bước giá tối thiểu (VND)</label>
                <input
                  id="input-bid-increment"
                  type="number"
                  className="input"
                  min={100000}
                  step={100000}
                  value={bidIncrement}
                  onChange={e => setBidIncrement(e.target.value)}
                  required
                />
                <span className={styles.helperText}>{formatPriceFull(Number(bidIncrement) || 0)}</span>
              </div>
            </div>

            {/* Thời gian Bắt đầu & Kết thúc */}
            <div className={styles.gridTwo}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  <Calendar size={14} /> Ngày giờ bắt đầu
                </label>
                <input
                  id="input-start-time"
                  type="datetime-local"
                  className="input"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  <Calendar size={14} /> Ngày giờ kết thúc
                </label>
                <input
                  id="input-end-time"
                  type="datetime-local"
                  className="input"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Sealed Specific options */}
            {auctionType === 'sealed' && (
              <div className={styles.sealedAlert}>
                <Info size={16} color="var(--gold-primary)" />
                <p>
                  <strong>Quy tắc phiên kín:</strong> Giá thầu của các Collector sẽ được giấu kín (is_bid_visible_public = false). 
                  Khi hết giờ phiên, Artist được quyền xem danh sách xếp hạng giá thầu từ cao xuống thấp để duyệt và liên hệ người thắng tạo đơn Escrow.
                </p>
              </div>
            )}

            <div className={styles.footerActions}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Hủy bỏ
              </button>
              <button id="btn-next-preview" type="submit" className="btn btn-primary">
                Xem trước & Xác nhận <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Preview & Confirm */}
        {step === 2 && (
          <div className={styles.previewContainer}>
            <div className={styles.previewCard}>
              <img
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                className={styles.previewImage}
              />
              <div className={styles.previewDetails}>
                <div className={styles.previewBadgeRow}>
                  {auctionType === 'sealed' ? (
                    <span className="badge badge-gold" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Lock size={12} /> ĐẤU GIÁ KÍN (SEALED-BID)
                    </span>
                  ) : (
                    <span className="badge badge-live">LIVE AUCTION</span>
                  )}
                  <span className="badge badge-verified">Độc bản</span>
                </div>

                <h3 className={styles.previewTitle}>{selectedArtwork.title}</h3>
                <p className={styles.previewArtist}>{selectedArtwork.artist_name || currentUser?.full_name}</p>
                <p className={styles.previewSpecs}>
                  {selectedArtwork.medium} · {selectedArtwork.dimensions} · {selectedArtwork.creation_year}
                </p>

                <div className={styles.previewGrid}>
                  <div className={styles.previewMetric}>
                    <span className={styles.metricLabel}>Giá khởi điểm</span>
                    <span className={styles.metricValue}>{formatPriceFull(Number(minBid))}</span>
                  </div>
                  <div className={styles.previewMetric}>
                    <span className={styles.metricLabel}>Bước giá</span>
                    <span className={styles.metricValue}>+{formatPriceFull(Number(bidIncrement))}</span>
                  </div>
                  <div className={styles.previewMetric}>
                    <span className={styles.metricLabel}>Mở lúc</span>
                    <span className={styles.metricTime}>{new Date(startTime).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className={styles.previewMetric}>
                    <span className={styles.metricLabel}>Đóng lúc</span>
                    <span className={styles.metricTime}>{new Date(endTime).toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                <div className={styles.securityBox}>
                  <Shield size={16} color="var(--success)" />
                  <span>
                    Bảo đảm ký quỹ 72 giờ qua Escrow Smart Contract và mã xác thực SHA-256 sau khi chốt phiên.
                  </span>
                </div>
              </div>
            </div>

            <label className={styles.confirmCheckboxLabel}>
              <input
                id="checkbox-agreement"
                type="checkbox"
                checked={agreementChecked}
                onChange={e => setAgreementChecked(e.target.checked)}
              />
              <span>
                Tôi xác nhận thông tin tác phẩm và cam kết tuân thủ quy chế bảo mật đấu giá kín của Artisan Hub.
              </span>
            </label>

            <div className={styles.footerActions}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                Quay lại sửa
              </button>
              <button
                id="btn-confirm-create"
                type="button"
                className="btn btn-primary"
                disabled={!agreementChecked || submitting}
                onClick={handleConfirmCreate}
              >
                {submitting ? 'Đang kích hoạt...' : 'Kích hoạt phiên đấu giá ngay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAuctionModal;
