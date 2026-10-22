import React, { useState } from 'react';
import {
  X, Upload, Image, CheckCircle, Shield, AlertCircle,
  Sparkles, FileText, Palette
} from 'lucide-react';
import { ARTWORKS, formatPriceFull } from '../data/mockData';
import styles from './UploadArtworkModal.module.css';

const SAMPLE_ARTWORK_IMAGES = [
  '/artwork_1.png',
  '/hero_artwork.png',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?w=800&auto=format&fit=crop',
];

const MEDIUM_OPTIONS = [
  'Sơn dầu trên canvas',
  'Sơn mài truyền thống',
  'Acrylic trên toan',
  'Màu nước trên giấy dó',
  'Chất liệu tổng hợp & Vàng lá',
  'Điêu khắc đồng / Gỗ',
];

const STYLE_OPTIONS = [
  'Trừu tượng',
  'Hiện thực',
  'Biểu hiện',
  'Tối giản',
  'Đương đại',
  'Ấn tượng',
];

const UploadArtworkModal = ({ onClose, onSuccess, currentUser, addToast }) => {
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState(MEDIUM_OPTIONS[0]);
  const [style, setStyle] = useState(STYLE_OPTIONS[0]);
  const [dimensions, setDimensions] = useState('80 × 120 cm');
  const [creationYear, setCreationYear] = useState(new Date().getFullYear());
  const [reservePrice, setReservePrice] = useState(25000000);
  const [bidIncrement, setBidIncrement] = useState(1000000);
  const [curatorStatement, setCuratorStatement] = useState('');
  const [artworkImage, setArtworkImage] = useState('/artwork_1.png');
  const [textureImage, setTextureImage] = useState('/artwork_1.png');
  const [legalAgreed, setLegalAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageFileChange = (e, setImage) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast?.('Vui lòng nhập tên tác phẩm!', 'warning');
      return;
    }
    if (!legalAgreed) {
      addToast?.('Vui lòng tích xác nhận cam kết bản quyền độc bản!', 'warning');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const newArtwork = {
        artwork_id: `aw_${Date.now()}`,
        artist_id: currentUser?.user_id || 'u2',
        artist_name: currentUser?.full_name || 'Họa sĩ xác thực',
        title: title.trim(),
        medium,
        dimensions: dimensions.trim() || '80 × 120 cm',
        creation_year: Number(creationYear),
        dominant_color: '#D4AF37',
        reserve_price: Number(reservePrice),
        current_price: Number(reservePrice),
        image: artworkImage,
        texture_map_url: textureImage || artworkImage,
        curator_statement: curatorStatement.trim() || 'Tác phẩm độc bản được thẩm định trực tiếp bởi ban chuyên môn Artisan Hub.',
        tags: [style, medium.split(' ')[0], 'Độc bản'],
        style,
        is_auction: true,
        is_featured: false,
        views: 1,
        likes: 0,
      };

      // Push into ARTWORKS mock array so other components can render it
      ARTWORKS.unshift(newArtwork);

      setSubmitting(false);
      addToast?.(
        `✦ Đã đăng tải thành công tác phẩm "${newArtwork.title}" vào bộ sưu tập!`,
        'gold',
        5000
      );
      onSuccess?.(newArtwork);
      onClose();
    }, 800);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <span className="badge badge-gold" style={{ fontSize: '0.68rem', alignSelf: 'flex-start' }}>
              ✦ Dành cho Họa sĩ · Artist Portal
            </span>
            <h2 className={styles.headerTitle}>Đăng tải tác phẩm tranh độc bản</h2>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className={styles.formBody}>
          {/* Tên tranh */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tên tác phẩm <span className={styles.labelRequired}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="VD: Hơi Thở Của Đất, Hoàng Hôn Sông Hồng..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Thể loại & Phong cách */}
          <div className={styles.formRow2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Chất liệu thể loại</label>
              <select
                className={styles.select}
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
              >
                {MEDIUM_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Trường phái nghệ thuật</label>
              <select
                className={styles.select}
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {STYLE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kích thước & Năm sáng tác */}
          <div className={styles.formRow2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Kích thước (Cao × Rộng cm)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="VD: 80 × 120 cm hoặc 100 × 100 cm"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Năm sáng tác</label>
              <input
                type="number"
                className={styles.input}
                min="1980"
                max="2030"
                value={creationYear}
                onChange={(e) => setCreationYear(e.target.value)}
              />
            </div>
          </div>

          {/* Upload Dropzones */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Hình ảnh tác phẩm & Vệt cọ Macro <span className={styles.labelRequired}>*</span>
            </label>
            <div className={styles.uploadSection}>
              {/* Ảnh toàn cảnh tranh */}
              <div
                className={`${styles.uploadBox} ${artworkImage ? styles.uploadBoxHasImage : ''}`}
              >
                {artworkImage ? (
                  <>
                    <img src={artworkImage} alt="Ảnh tác phẩm" className={styles.previewImg} />
                    <div className={styles.replaceOverlay}>
                      <Upload size={18} />
                      <span>Thay đổi ảnh tranh</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>
                      <Image size={20} />
                    </div>
                    <p className={styles.uploadTitle}>Tải ảnh tác phẩm toàn cảnh</p>
                    <p className={styles.uploadHint}>JPG, PNG độ phân giải cao</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={styles.hiddenFileInput}
                  onChange={(e) => handleImageFileChange(e, setArtworkImage)}
                />
              </div>

              {/* Ảnh macro vệt cọ */}
              <div
                className={`${styles.uploadBox} ${textureImage ? styles.uploadBoxHasImage : ''}`}
              >
                {textureImage ? (
                  <>
                    <img src={textureImage} alt="Ảnh vệt cọ" className={styles.previewImg} />
                    <div className={styles.replaceOverlay}>
                      <Palette size={18} />
                      <span>Thay đổi ảnh texture</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>
                      <Palette size={20} />
                    </div>
                    <p className={styles.uploadTitle}>Tải ảnh Macro vệt cọ (Texture)</p>
                    <p className={styles.uploadHint}>Chụp cận cảnh chi tiết lớp sơn</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={styles.hiddenFileInput}
                  onChange={(e) => handleImageFileChange(e, setTextureImage)}
                />
              </div>
            </div>

            {/* Quick sample pick for testing */}
            <div className={styles.samplePickRow}>
              <span>Hoặc chọn ảnh mẫu nhanh:</span>
              {SAMPLE_ARTWORK_IMAGES.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Sample ${idx}`}
                  className={styles.sampleThumb}
                  onClick={() => {
                    setArtworkImage(img);
                    setTextureImage(img);
                  }}
                  title="Chọn ảnh mẫu này"
                />
              ))}
            </div>
          </div>

          {/* Giá khởi điểm & Bước giá */}
          <div className={styles.formRow2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giá khởi điểm dự kiến (VNĐ) <span className={styles.labelRequired}>*</span>
              </label>
              <input
                type="number"
                className={styles.input}
                step="500000"
                min="1000000"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)' }}>
                {formatPriceFull(reservePrice)}
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Bước giá tối thiểu (VNĐ)</label>
              <input
                type="number"
                className={styles.input}
                step="100000"
                min="500000"
                value={bidIncrement}
                onChange={(e) => setBidIncrement(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {formatPriceFull(bidIncrement)}
              </span>
            </div>
          </div>

          {/* Lời tự sự / Ý niệm sáng tác */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Ý niệm nghệ thuật & Thông điệp tác phẩm</label>
            <textarea
              className={styles.textarea}
              placeholder="Chia sẻ nguồn cảm hứng, chất liệu đặc biệt, cảm xúc tác giả..."
              value={curatorStatement}
              onChange={(e) => setCuratorStatement(e.target.value)}
            />
          </div>

          {/* Legal commitment */}
          <div className={styles.commitmentBox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={legalAgreed}
                onChange={(e) => setLegalAgreed(e.target.checked)}
              />
              <span>
                <strong>Cam kết độc bản:</strong> Tôi cam đoan tác phẩm này do chính tôi sáng tác độc bản,
                không sao chép và chịu hoàn toàn trách nhiệm pháp lý theo Luật Sở hữu Trí tuệ Việt Nam.
              </span>
            </label>
          </div>
        </form>

        {/* Footer */}
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
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!legalAgreed || submitting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 200, justifyContent: 'center' }}
          >
            {submitting ? (
              <>
                <span className={styles.spinner} />
                Đang lưu hồ sơ tranh...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Đăng tác phẩm & Lưu hồ sơ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadArtworkModal;
