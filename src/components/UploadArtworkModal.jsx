import React, { useState } from 'react';
import {
  X, Upload, Image, CheckCircle, Shield, AlertCircle,
  Sparkles, FileText, Palette, Gavel, Lock, Tag, Clock, Info
} from 'lucide-react';
import { ARTWORKS, AUCTION_SESSIONS, formatPriceFull } from '../data/mockData';
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

const SALE_FORMAT_OPTIONS = [
  {
    id: 'live_auction',
    label: 'Đấu giá trực tiếp',
    badge: 'Live Auction',
    icon: Gavel,
    desc: 'Phòng đấu giá trực tuyến thời gian thực, người mua cạnh tranh công khai từng bước giá.',
    accent: '#F59E0B'
  },
  {
    id: 'sealed_auction',
    label: 'Đấu giá kín',
    badge: 'Sealed-Bid',
    icon: Lock,
    desc: 'Người mua bỏ giá thầu bí mật độc lập, mở thầu tự động cùng lúc, bảo mật tuyệt đối.',
    accent: '#38BDF8'
  },
  {
    id: 'direct_sale',
    label: 'Bán tranh bình thường',
    badge: 'Fixed Price',
    icon: Tag,
    desc: 'Bán trực tiếp theo giá niêm yết cố định, mua ngay không qua đấu giá, ký quỹ Escrow 72h.',
    accent: '#10B981'
  }
];

const UploadArtworkModal = ({ onClose, onSuccess, currentUser, addToast }) => {
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState(MEDIUM_OPTIONS[0]);
  const [style, setStyle] = useState(STYLE_OPTIONS[0]);
  const [dimensions, setDimensions] = useState('80 × 120 cm');
  const [creationYear, setCreationYear] = useState(new Date().getFullYear());

  // 3 Hình thức đăng bán: 'live_auction' | 'sealed_auction' | 'direct_sale'
  const [saleType, setSaleType] = useState('live_auction');

  // Giá & Thông số tương ứng theo từng hình thức
  const [reservePrice, setReservePrice] = useState(25000000);
  const [bidIncrement, setBidIncrement] = useState(1000000);
  const [auctionDuration, setAuctionDuration] = useState('3_days');
  const [sealedDeposit, setSealedDeposit] = useState(2500000);
  const [sealedDeadline, setSealedDeadline] = useState('7_days');
  const [allowOffers, setAllowOffers] = useState(true);
  const [shippingReadyDays, setShippingReadyDays] = useState('24h');

  const [curatorStatement, setCuratorStatement] = useState('');
  const [artworkImage, setArtworkImage] = useState('/artwork_1.png');
  const [textureImage, setTextureImage] = useState('/artwork_1.png');
  const [legalAgreed, setLegalAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePriceChange = (newVal) => {
    const val = Number(newVal) || 0;
    setReservePrice(val);
    setSealedDeposit(Math.round(val * 0.1));
  };

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
        artist_name: currentUser?.full_name || 'Trần Thị Ánh Dương',
        title: title.trim(),
        medium,
        dimensions: dimensions.trim() || '80 × 120 cm',
        creation_year: Number(creationYear),
        dominant_color: '#D4AF37',
        reserve_price: Number(reservePrice),
        current_price: Number(reservePrice),
        price_val: Number(reservePrice),
        image: artworkImage,
        texture_map_url: textureImage || artworkImage,
        curator_statement: curatorStatement.trim() || 'Tác phẩm độc bản được thẩm định trực tiếp bởi ban chuyên môn Artisan Hub.',
        tags: [style, medium.split(' ')[0], 'Độc bản'],
        style,

        // Thuộc tính hình thức đăng bán
        sale_format: saleType,
        is_auction: saleType !== 'direct_sale',
        auction_type: saleType === 'sealed_auction' ? 'sealed' : (saleType === 'live_auction' ? 'live' : null),
        bid_increment: saleType === 'live_auction' ? Number(bidIncrement) : null,
        auction_duration: saleType === 'live_auction' ? auctionDuration : null,
        sealed_deposit: saleType === 'sealed_auction' ? Number(sealedDeposit) : null,
        sealed_deadline: saleType === 'sealed_auction' ? sealedDeadline : null,
        allow_offers: saleType === 'direct_sale' ? allowOffers : null,
        shipping_ready_days: saleType === 'direct_sale' ? shippingReadyDays : null,

        is_featured: false,
        post_status: 'selling',
        views: 1,
        likes: 0,
        posted_date: 'Hôm nay'
      };

      // Đưa tác phẩm vào danh mục ARTWORKS
      ARTWORKS.unshift(newArtwork);

      // Nếu là hình thức đấu giá, khởi tạo phiên tương ứng trong AUCTION_SESSIONS
      if (saleType !== 'direct_sale') {
        const durationHours = saleType === 'sealed_auction'
          ? (sealedDeadline === '3_days' ? 72 : (sealedDeadline === '14_days' ? 336 : 168))
          : (auctionDuration === '24h' ? 24 : (auctionDuration === '5_days' ? 120 : (auctionDuration === '7_days' ? 168 : 72)));

        AUCTION_SESSIONS.unshift({
          session_id: `as_${Date.now()}`,
          artwork_id: newArtwork.artwork_id,
          auction_type: saleType === 'sealed_auction' ? 'sealed' : 'live',
          min_bid: Number(reservePrice),
          has_no_starting_price: false,
          is_bid_visible_public: saleType === 'live_auction',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + durationHours * 3600000).toISOString(),
          bid_increment: saleType === 'live_auction' ? Number(bidIncrement) : 0,
          current_highest_price: Number(reservePrice),
          winner_id: null,
          winner_contacted_at: null,
          status: 'live',
        });
      }

      setSubmitting(false);

      const successToastMsg = saleType === 'live_auction'
        ? `✦ Đã đăng tải tác phẩm và khởi tạo phòng Đấu giá trực tiếp cho "${newArtwork.title}"!`
        : saleType === 'sealed_auction'
          ? `✦ Đã đăng tải tác phẩm và mở phiên Đấu giá kín (Sealed-Bid) cho "${newArtwork.title}"!`
          : `✦ Đã đăng bài và niêm yết bán trực tiếp tác phẩm "${newArtwork.title}" thành công!`;

      addToast?.(successToastMsg, 'gold', 5000);
      onSuccess?.(newArtwork);
      onClose();
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
    >
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <span className="badge badge-gold" style={{ fontSize: '0.68rem', alignSelf: 'flex-start' }}>
              ✦ Cổng Họa Sĩ Đăng Bài Tác Phẩm
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
              placeholder="VD: Hơi Thở Của Đất, Hoàng Hôn Sông Hồng, Vũ Điệu Ánh Sáng..."
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
                      <span>Thay đổi ảnh vệt cọ</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>
                      <Palette size={20} />
                    </div>
                    <p className={styles.uploadTitle}>Tải ảnh chụp vệt cọ cận cảnh</p>
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

          {/* =================================================================
              3 HÌNH THỨC ĐĂNG BÁN: ĐẤU GIÁ TRỰC TIẾP, ĐẤU GIÁ KÍN, BÁN BÌNH THƯỜNG
              ================================================================= */}
          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <label className={styles.label}>
                Hình thức phân phối & Đăng bán <span className={styles.labelRequired}>*</span>
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                Chọn 1 trong 3 cơ chế
              </span>
            </div>

            <div className={styles.saleFormatGrid}>
              {SALE_FORMAT_OPTIONS.map((opt) => {
                const isSelected = saleType === opt.id;
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    className={`${styles.saleFormatCard} ${isSelected ? styles.saleFormatCardActive : ''}`}
                    onClick={() => setSaleType(opt.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.saleFormatTop}>
                      <div
                        className={styles.saleFormatIconBox}
                        style={{
                          background: isSelected ? `${opt.accent}22` : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? opt.accent : 'var(--text-muted)',
                          borderColor: isSelected ? `${opt.accent}66` : 'rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span
                        className={styles.saleFormatBadge}
                        style={{
                          background: isSelected ? `${opt.accent}18` : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? opt.accent : '#94A3B8',
                          borderColor: isSelected ? `${opt.accent}44` : 'rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        {opt.badge}
                      </span>
                    </div>

                    <h4 className={styles.saleFormatTitle} style={{ color: isSelected ? '#FFFFFF' : 'var(--text-primary)' }}>
                      {opt.label}
                    </h4>
                    <p className={styles.saleFormatDesc}>{opt.desc}</p>

                    <div className={styles.saleFormatRadio}>
                      <span
                        className={`${styles.radioIndicator} ${isSelected ? styles.radioIndicatorActive : ''}`}
                        style={{ borderColor: isSelected ? opt.accent : 'rgba(255, 255, 255, 0.25)' }}
                      >
                        {isSelected && <span className={styles.radioDot} style={{ background: opt.accent }} />}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isSelected ? opt.accent : '#64748B' }}>
                        {isSelected ? 'Đang kích hoạt' : 'Chọn hình thức này'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================================
              CÁC TRƯỜNG NHẬP THÔNG SỐ TƯƠNG ỨNG VỚI TỪNG HÌNH THỨC
              ================================================================= */}

          {/* TRƯỜNG HỢP 1: ĐẤU GIÁ TRỰC TIẾP */}
          {saleType === 'live_auction' && (
            <>
              <div className={styles.formRow2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Giá khởi điểm phiên Live (VNĐ) <span className={styles.labelRequired}>*</span>
                  </label>
                  <input
                    type="number"
                    className={styles.input}
                    step="500000"
                    min="1000000"
                    value={reservePrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 600 }}>
                    {formatPriceFull(reservePrice)}
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Bước giá tối thiểu mỗi lượt trả (VNĐ)</label>
                  <input
                    type="number"
                    className={styles.input}
                    step="100000"
                    min="500000"
                    value={bidIncrement}
                    onChange={(e) => setBidIncrement(e.target.value)}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    +{formatPriceFull(bidIncrement)} / lượt tăng
                  </span>
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Thời lượng phiên đấu giá Live</label>
                  <select
                    className={styles.select}
                    value={auctionDuration}
                    onChange={(e) => setAuctionDuration(e.target.value)}
                  >
                    <option value="24h">24 giờ (Đấu giá hỏa tốc)</option>
                    <option value="3_days">3 ngày (Tiêu chuẩn phổ biến)</option>
                    <option value="5_days">5 ngày (Tác phẩm trọng điểm)</option>
                    <option value="7_days">7 ngày (Tuần lễ đấu giá quốc tế)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Cơ chế chống đẩy giá ảo (Anti-Sniping)</label>
                  <input
                    type="text"
                    disabled
                    className={styles.input}
                    value="Tự động gia hạn 3 phút nếu có bid phút cuối"
                    style={{ opacity: 0.85, background: 'rgba(255, 255, 255, 0.03)', color: '#F1F5F9' }}
                  />
                </div>
              </div>

              <div className={styles.saleFormatBanner}>
                <Gavel size={18} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
                <span>
                  <strong>Phòng đấu giá trực tiếp:</strong> Khi phiên bắt đầu, toàn bộ nhà sưu tầm xác thực có thể tham gia trả giá công khai thời gian thực. Giá trả cao nhất tại thời điểm đếm ngược kết thúc sẽ là người trúng đấu giá.
                </span>
              </div>
            </>
          )}

          {/* TRƯỜNG HỢP 2: ĐẤU GIÁ KÍN (SEALED-BID) */}
          {saleType === 'sealed_auction' && (
            <>
              <div className={styles.formRow2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Giá sàn kỳ vọng tối thiểu (VNĐ) <span className={styles.labelRequired}>*</span>
                  </label>
                  <input
                    type="number"
                    className={styles.input}
                    step="500000"
                    min="1000000"
                    value={reservePrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.74rem', color: '#38BDF8', fontWeight: 600 }}>
                    {formatPriceFull(reservePrice)} (Giá bảo lưu bí mật)
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tiền ký quỹ đặt cọc tham gia (VNĐ)</label>
                  <input
                    type="number"
                    className={styles.input}
                    step="500000"
                    min="1000000"
                    value={sealedDeposit}
                    onChange={(e) => setSealedDeposit(Number(e.target.value))}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Ký quỹ bảo chứng: {formatPriceFull(sealedDeposit)} (~10% giá sàn)
                  </span>
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Thời hạn chót nộp giá thầu kín</label>
                  <select
                    className={styles.select}
                    value={sealedDeadline}
                    onChange={(e) => setSealedDeadline(e.target.value)}
                  >
                    <option value="3_days">3 ngày (Thu thập phiếu kín nhanh)</option>
                    <option value="7_days">7 ngày (Chuẩn thẩm định bảo mật)</option>
                    <option value="14_days">14 ngày (Triển lãm tranh độc bản lớn)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Cơ chế mở hòm phiếu</label>
                  <input
                    type="text"
                    disabled
                    className={styles.input}
                    value="Mã hóa SHA-256, tự động mở thầu đồng thời"
                    style={{ opacity: 0.85, background: 'rgba(255, 255, 255, 0.03)', color: '#F1F5F9' }}
                  />
                </div>
              </div>

              <div className={styles.saleFormatBanner}>
                <Lock size={18} style={{ color: '#38BDF8', flexShrink: 0, marginTop: 1 }} />
                <span>
                  <strong>Quy chuẩn Đấu giá kín:</strong> Mức giá người mua đưa ra hoàn toàn bí mật, không đối thủ nào biết trước. Hết thời hạn quy định, hệ thống tự động đối chiếu các phiếu thầu hợp lệ và trao quyền mua cho người trả giá cao nhất trên mức giá sàn kỳ vọng của họa sĩ.
                </span>
              </div>
            </>
          )}

          {/* TRƯỜNG HỢP 3: BÁN TRANH BÌNH THƯỜNG (DIRECT SALE / FIXED PRICE) */}
          {saleType === 'direct_sale' && (
            <>
              <div className={styles.formRow2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Giá bán niêm yết (VNĐ) <span className={styles.labelRequired}>*</span>
                  </label>
                  <input
                    type="number"
                    className={styles.input}
                    step="500000"
                    min="1000000"
                    value={reservePrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>
                    {formatPriceFull(reservePrice)} (Mua ngay không chờ đợi)
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Chính sách đề xuất giá (Thương lượng)</label>
                  <select
                    className={styles.select}
                    value={allowOffers ? 'yes' : 'no'}
                    onChange={(e) => setAllowOffers(e.target.value === 'yes')}
                  >
                    <option value="yes">Cho phép người mua gửi đề nghị giá (Thương lượng)</option>
                    <option value="no">Bán đúng giá niêm yết (Không thương lượng)</option>
                  </select>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {allowOffers ? '✓ Người mua có thể thương lượng mức giá với bạn' : '✓ Cố định mức giá, thanh toán mua ngay lập tức'}
                  </span>
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Thời gian chuẩn bị đóng gói xuất xưởng</label>
                  <select
                    className={styles.select}
                    value={shippingReadyDays}
                    onChange={(e) => setShippingReadyDays(e.target.value)}
                  >
                    <option value="24h">Trong vòng 24 giờ sau khi Escrow xác nhận tiền</option>
                    <option value="48h">Trong vòng 48 giờ sau khi Escrow xác nhận tiền</option>
                    <option value="72h">Trong vòng 72 giờ (Dành cho tranh cỡ lớn)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Bảo chứng giao dịch</label>
                  <input
                    type="text"
                    disabled
                    className={styles.input}
                    value="Ký quỹ trung gian Escrow 72h chống gian lận"
                    style={{ opacity: 0.85, background: 'rgba(255, 255, 255, 0.03)', color: '#F1F5F9' }}
                  />
                </div>
              </div>

              <div className={styles.saleFormatBanner}>
                <Tag size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }} />
                <span>
                  <strong>Quy chuẩn Bán tranh bình thường:</strong> Tác phẩm sẽ được niêm yết công khai trên Gallery với nút "Mua ngay". Nhà sưu tầm thanh toán tiền vào tài khoản ký quỹ trung gian Escrow, bạn đóng thùng bàn giao cho đội xe chuyên dụng và tiền sẽ tự động giải ngân sau 72h người mua nghiệm thu.
                </span>
              </div>
            </>
          )}

          {/* Lời tự sự / Ý niệm sáng tác */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Ý niệm nghệ thuật & Thông điệp tác phẩm</label>
            <textarea
              className={styles.textarea}
              placeholder="Chia sẻ nguồn cảm hứng, chất liệu đặc biệt, cảm xúc tác giả gửi gắm trong tác phẩm..."
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
                <strong>Cam kết độc bản:</strong> Tôi cam đoan tác phẩm này do chính tôi sáng tác độc bản 1/1,
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
                Đang khởi tạo hồ sơ tác phẩm...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                {saleType === 'live_auction'
                  ? 'Đăng tác phẩm & Mở phòng đấu giá'
                  : saleType === 'sealed_auction'
                    ? 'Đăng tác phẩm & Mở đấu giá kín'
                    : 'Đăng tác phẩm & Niêm yết bán ngay'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadArtworkModal;
