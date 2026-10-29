import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, CreditCard, Smartphone, Wallet,
  ChevronRight, ChevronDown, ChevronUp, Lock, Check,
  AlertTriangle, Info, ArrowLeft, Clock,
  CheckCircle2, RefreshCw, Copy, Star,
  Receipt, Package, Truck, FileCheck, Eye, EyeOff,
  BadgeCheck, Zap
} from 'lucide-react';
import { ARTWORKS, AUCTION_SESSIONS, USERS, formatPriceFull } from '../data/mockData';
import styles from './CheckoutPage.module.css';

// ── Payment Method Config ──────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Thẻ tín dụng / Ghi nợ',
    icon: '💳',
    brands: ['Visa', 'Mastercard', 'JCB', 'AMEX'],
    desc: 'Thanh toán ngay, an toàn với mã OTP',
    feeLabel: 'Miễn phí',
  },
  {
    id: 'momo',
    label: 'Ví MoMo',
    icon: '🌸',
    brands: [],
    desc: 'Quét QR hoặc nhập SĐT ví MoMo',
    feeLabel: 'Miễn phí',
  },
  {
    id: 'vnpay',
    label: 'VNPay',
    icon: '🏦',
    brands: ['QR', 'ATM', 'Internet Banking'],
    desc: 'Thanh toán qua cổng VNPay an toàn',
    feeLabel: 'Miễn phí',
  },
  {
    id: 'bank',
    label: 'Chuyển khoản ngân hàng',
    icon: '🏛️',
    brands: ['VCB', 'Techcombank', 'BIDV', 'MB Bank'],
    desc: 'Chuyển khoản trực tiếp, xử lý trong 1–2 giờ',
    feeLabel: 'Miễn phí',
  },
];

const BANK_INFO = {
  bankName: 'Techcombank (TCB)',
  accountNo: '1901 2468 0001 9999',
  accountName: 'CONG TY TNHH ARTISAN HUB VIET NAM',
  branch: 'Chi nhánh Hoàn Kiếm, Hà Nội',
  note: 'THANHTOAN-AW1-2026',
};

const MOMO_QR = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo://payment?phone=0901234567';

const STEPS = ['Thông tin giao hàng', 'Phương thức thanh toán', 'Xác nhận & Thanh toán'];

function formatCardNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val) {
  const d = val.replace(/\D/g, '').slice(0, 4);
  if (d.length >= 3) return d.slice(0, 2) + '/' + d.slice(2);
  return d;
}
function calcFee(amount, method) {
  return method === 'card' ? Math.round(amount * 0.022) : 0;
}

// ══════════════════════════════════════════════════════════════════════
export default function CheckoutPage({ currentUser, addToast }) {
  const { artworkId } = useParams();
  const navigate = useNavigate();

  const artwork = ARTWORKS.find(a => a.artwork_id === artworkId) || ARTWORKS[0];
  const session = AUCTION_SESSIONS.find(s => s.artwork_id === artwork.artwork_id);
  const artist = USERS.find(u => u.user_id === artwork.artist_id);

  const winPrice = session?.current_highest_price || artwork.current_price;
  const platformFee = Math.round(winPrice * 0.03);
  const packagingFee = 350000;
  const insuranceFee = Math.round(winPrice * 0.005);
  const subtotal = winPrice + platformFee + packagingFee + insuranceFee;

  const [txId] = useState(() => 'AH-' + Math.floor(10000000 + Math.random() * 90000000));
  const [step, setStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentDone, setPaymentDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [timer, setTimer] = useState(15 * 60);
  const [copied, setCopied] = useState(null);
  const [showCVV, setShowCVV] = useState(false);
  const [collapseOrder, setCollapseOrder] = useState(false);
  const timerRef = useRef(null);

  const [delivery, setDelivery] = useState({
    name: currentUser?.full_name || '',
    phone: '',
    address: '',
    city: 'Hà Nội',
    note: '',
  });

  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '', saveCard: false });
  const [cardError, setCardError] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (paymentDone) return;
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [paymentDone]);

  const timerDisplay = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;
  const timerUrgent = timer < 180;

  const feeForMethod = calcFee(subtotal, selectedMethod);
  const grandTotal = subtotal + feeForMethod;

  const validateDelivery = () => {
    if (!delivery.name.trim()) { addToast?.('Vui lòng nhập họ tên người nhận', 'error'); return false; }
    if (!/^0\d{9}$/.test(delivery.phone.replace(/\s/g, ''))) { addToast?.('Số điện thoại không hợp lệ', 'error'); return false; }
    if (!delivery.address.trim()) { addToast?.('Vui lòng nhập địa chỉ nhận hàng', 'error'); return false; }
    return true;
  };

  const validateCard = () => {
    const errs = {};
    if (card.number.replace(/\s/g, '').length < 16) errs.number = 'Số thẻ phải đủ 16 chữ số';
    if (!card.name.trim()) errs.name = 'Nhập tên chủ thẻ';
    const [m, y] = (card.expiry || '/').split('/');
    if (!m || !y || Number(m) < 1 || Number(m) > 12) errs.expiry = 'Ngày hết hạn không hợp lệ';
    if (!/^\d{3,4}$/.test(card.cvv)) errs.cvv = 'CVV không hợp lệ';
    setCardError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 0) {
      if (!validateDelivery()) return;
      setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 1) {
      setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePay = async () => {
    if (selectedMethod === 'card') {
      if (!otpSent) {
        if (!validateCard()) return;
        setOtpSent(true);
        addToast?.('📱 Mã OTP đã được gửi đến SĐT đăng ký!', 'success');
        return;
      }
      const otp = otpDigits.join('');
      if (otp.length < 6) { addToast?.('Vui lòng nhập đủ 6 số OTP', 'error'); return; }
      if (otp !== '123456') { addToast?.('Mã OTP không đúng. Demo: 123456', 'error'); return; }
    }
    setProcessing(true);
    clearInterval(timerRef.current);
    await new Promise(r => setTimeout(r, 2200));
    setProcessing(false);
    setPaymentDone(true);
    addToast?.('🎉 Thanh toán thành công! Artisan Hub sẽ liên hệ trong 24h.', 'gold', 7000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleOtpChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(0, 1);
    const next = [...otpDigits]; next[i] = v; setOtpDigits(next);
    if (v && i < 5) otpRefs[i + 1].current?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs[i - 1].current?.focus();
  };

  // ── SUCCESS PAGE ───────────────────────────────────────────────────
  if (paymentDone) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successAnim}>
            <div className={styles.successRing} />
            <div className={styles.successCheck}><CheckCircle2 size={56} /></div>
          </div>
          <h1 className={styles.successTitle}>Thanh toán thành công!</h1>
          <p className={styles.successSub}>Mã giao dịch: <strong>{txId}</strong></p>
          <div className={styles.successArtwork}>
            <img src={artwork.image} alt={artwork.title} />
            <div>
              <div className={styles.successArtworkTitle}>{artwork.title}</div>
              <div className={styles.successArtworkBy}>bởi {artwork.artist_name}</div>
              <div className={styles.successArtworkPrice}>{formatPriceFull(grandTotal)}</div>
            </div>
          </div>
          <div className={styles.successTimeline}>
            {[
              { icon: <FileCheck size={16} />, label: 'Giao dịch xác nhận', time: 'Vừa xong', done: true },
              { icon: <BadgeCheck size={16} />, label: 'Artisan Hub kiểm tra & đóng gói', time: '1–2 ngày làm việc', done: false },
              { icon: <Truck size={16} />, label: 'Vận chuyển bảo hiểm chuyên nghiệp', time: '3–5 ngày', done: false },
              { icon: <Package size={16} />, label: 'Giao tận tay, kèm Chứng Nhận NFT', time: 'Sau giao hàng', done: false },
            ].map((item, i) => (
              <div key={i} className={`${styles.timelineItem} ${item.done ? styles.timelineDone : ''}`}>
                <div className={styles.timelineDot}>{item.done ? <Check size={12} /> : item.icon}</div>
                {i < 3 && <div className={styles.timelineLine} />}
                <div className={styles.timelineText}>
                  <span>{item.label}</span>
                  <span className={styles.timelineTime}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.successActions}>
            <button className={styles.btnPrimary} onClick={() => navigate('/profile')}>Xem đơn hàng của tôi</button>
            <button className={styles.btnGhost} onClick={() => navigate('/gallery')}>Khám phá thêm tác phẩm</button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN LAYOUT ────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Quay lại
          </button>
          <div className={styles.secureLabel}><Lock size={14} /> Thanh toán bảo mật SSL 256-bit</div>
          <div className={`${styles.timer} ${timerUrgent ? styles.timerUrgent : ''}`}>
            <Clock size={14} />
            <span>Giữ chỗ còn: <strong>{timerDisplay}</strong></span>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className={styles.stepBar}>
        {STEPS.map((s, i) => (
          <div key={i} className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
            <div className={styles.stepCircle}>{i < step ? <Check size={14} /> : <span>{i + 1}</span>}</div>
            <span className={styles.stepLabel}>{s}</span>
            {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        {/* ══ LEFT COLUMN ══ */}
        <div className={styles.leftCol}>

          {/* STEP 0: Delivery */}
          {step === 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Truck size={20} className={styles.cardHeaderIcon} />
                <h2 className={styles.cardTitle}>Thông tin giao hàng</h2>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Họ và tên người nhận <span className={styles.req}>*</span></label>
                  <input id="checkout-name" className={styles.input} placeholder="Nguyễn Văn A" value={delivery.name} onChange={e => setDelivery({ ...delivery, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Số điện thoại <span className={styles.req}>*</span></label>
                  <input id="checkout-phone" className={styles.input} placeholder="0901 234 567" value={delivery.phone} onChange={e => setDelivery({ ...delivery, phone: e.target.value })} maxLength={11} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Địa chỉ nhận hàng <span className={styles.req}>*</span></label>
                <input id="checkout-address" className={styles.input} placeholder="Số nhà, đường, phường/xã, quận/huyện" value={delivery.address} onChange={e => setDelivery({ ...delivery, address: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tỉnh / Thành phố</label>
                <select id="checkout-city" className={styles.select} value={delivery.city} onChange={e => setDelivery({ ...delivery, city: e.target.value })}>
                  {['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Huế', 'Nha Trang', 'Đà Lạt'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ghi chú giao hàng</label>
                <textarea id="checkout-note" className={styles.textarea} placeholder="Ghi chú thêm cho nhân viên giao hàng..." value={delivery.note} onChange={e => setDelivery({ ...delivery, note: e.target.value })} rows={3} />
              </div>
              <div className={styles.serviceOptions}>
                <label className={styles.checkRow}>
                  <input type="checkbox" defaultChecked />
                  <div>
                    <span className={styles.checkLabel}>Bảo hiểm vận chuyển chuyên tác phẩm nghệ thuật</span>
                    <span className={styles.checkPrice}>+{formatPriceFull(insuranceFee)}</span>
                  </div>
                </label>
                <label className={styles.checkRow}>
                  <input type="checkbox" defaultChecked />
                  <div>
                    <span className={styles.checkLabel}>Đóng gói cao cấp – hộp gỗ chống va đập, bọc nhung</span>
                    <span className={styles.checkPrice}>+{formatPriceFull(packagingFee)}</span>
                  </div>
                </label>
              </div>
              <div className={styles.infoBox}>
                <Info size={15} />
                <span>Thời gian giao hàng dự kiến: <strong>3–5 ngày làm việc</strong>. Vận chuyển do đội ngũ chuyên biệt tác phẩm nghệ thuật của Artisan Hub đảm nhận.</span>
              </div>
              <button id="checkout-next-delivery" className={styles.btnNextStep} onClick={handleNextStep}>
                Tiếp theo: Phương thức thanh toán <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 1: Payment Method */}
          {step === 1 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Wallet size={20} className={styles.cardHeaderIcon} />
                <h2 className={styles.cardTitle}>Chọn phương thức thanh toán</h2>
              </div>
              <div className={styles.methodList}>
                {PAYMENT_METHODS.map(m => (
                  <label key={m.id} className={`${styles.methodCard} ${selectedMethod === m.id ? styles.methodSelected : ''}`}>
                    <input type="radio" name="payMethod" value={m.id} checked={selectedMethod === m.id} onChange={() => setSelectedMethod(m.id)} />
                    <span className={styles.methodIcon}>{m.icon}</span>
                    <div className={styles.methodBody}>
                      <div className={styles.methodName}>{m.label}</div>
                      <div className={styles.methodDesc}>{m.desc}</div>
                      {m.brands.length > 0 && (
                        <div className={styles.methodBrands}>
                          {m.brands.map(b => <span key={b} className={styles.brand}>{b}</span>)}
                        </div>
                      )}
                    </div>
                    <div className={styles.methodFee}>
                      <span className={styles.feeFree}>{m.feeLabel}</span>
                      {selectedMethod === m.id && <div className={styles.methodCheckBadge}><Check size={12} /></div>}
                    </div>
                  </label>
                ))}
              </div>

              {/* Card Form */}
              {selectedMethod === 'card' && (
                <div className={styles.cardForm}>
                  <div className={styles.cardPreview}>
                    <div className={styles.cardPreviewChip} />
                    <div className={styles.cardPreviewNumber}>
                      {card.number ? card.number.padEnd(19, '·') : '•••• •••• •••• ••••'}
                    </div>
                    <div className={styles.cardPreviewBottom}>
                      <div>
                        <div className={styles.cardPreviewSmall}>Chủ thẻ</div>
                        <div className={styles.cardPreviewName}>{card.name || 'TÊN CHỦ THẺ'}</div>
                      </div>
                      <div>
                        <div className={styles.cardPreviewSmall}>Hết hạn</div>
                        <div className={styles.cardPreviewExpiry}>{card.expiry || 'MM/YY'}</div>
                      </div>
                      <div className={styles.cardPreviewBrand}>VISA</div>
                    </div>
                  </div>
                  <div className={styles.cardFields}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Số thẻ</label>
                      <div className={styles.inputIcon}>
                        <CreditCard size={16} className={styles.inputIconLeft} />
                        <input id="card-number" className={`${styles.input} ${cardError.number ? styles.inputError : ''}`} placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })} maxLength={19} />
                      </div>
                      {cardError.number && <span className={styles.fieldError}>{cardError.number}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tên chủ thẻ (in hoa)</label>
                      <input id="card-name" className={`${styles.input} ${cardError.name ? styles.inputError : ''}`} placeholder="NGUYEN VAN A" value={card.name} onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })} />
                      {cardError.name && <span className={styles.fieldError}>{cardError.name}</span>}
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Ngày hết hạn</label>
                        <input id="card-expiry" className={`${styles.input} ${cardError.expiry ? styles.inputError : ''}`} placeholder="MM/YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })} maxLength={5} />
                        {cardError.expiry && <span className={styles.fieldError}>{cardError.expiry}</span>}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>CVV / CVC</label>
                        <div className={styles.inputIcon}>
                          <input id="card-cvv" className={`${styles.input} ${cardError.cvv ? styles.inputError : ''}`} placeholder="•••" type={showCVV ? 'text' : 'password'} value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} maxLength={4} />
                          <button type="button" className={styles.inputIconRight} onClick={() => setShowCVV(v => !v)}>
                            {showCVV ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {cardError.cvv && <span className={styles.fieldError}>{cardError.cvv}</span>}
                      </div>
                    </div>
                    <label className={styles.checkRowSmall}>
                      <input type="checkbox" checked={card.saveCard} onChange={e => setCard({ ...card, saveCard: e.target.checked })} />
                      <span>Lưu thẻ cho lần thanh toán tiếp theo (mã hóa an toàn)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* MoMo */}
              {selectedMethod === 'momo' && (
                <div className={styles.qrSection}>
                  <div className={styles.qrBox}>
                    <img src={MOMO_QR} alt="MoMo QR" className={styles.qrImg} />
                    <div className={styles.qrInstructions}>
                      <div className={styles.qrStep}>① Mở app MoMo → Quét QR</div>
                      <div className={styles.qrStep}>② Kiểm tra số tiền: <strong>{formatPriceFull(grandTotal)}</strong></div>
                      <div className={styles.qrStep}>③ Xác nhận thanh toán trên điện thoại</div>
                    </div>
                  </div>
                  <div className={styles.qrOr}>— hoặc nhập SĐT ví MoMo —</div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Số điện thoại ví MoMo</label>
                    <input id="momo-phone" className={styles.input} placeholder="0901 234 567" maxLength={11} />
                  </div>
                </div>
              )}

              {/* VNPay */}
              {selectedMethod === 'vnpay' && (
                <div className={styles.vnpaySection}>
                  <div className={styles.vnpayLogo}>
                    <span className={styles.vnpayBadge}>VNPay</span>
                    <span className={styles.vnpayTagline}>Thanh toán nhanh, an toàn</span>
                  </div>
                  <div className={styles.vnpayOptions}>
                    {['QR Code', 'ATM / Thẻ nội địa', 'Internet Banking', 'Thẻ quốc tế'].map(opt => (
                      <label key={opt} className={styles.vnpayOpt}>
                        <input type="radio" name="vnpayType" defaultChecked={opt === 'QR Code'} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div className={styles.infoBox}>
                    <Info size={14} />
                    <span>Bạn sẽ được chuyển đến cổng thanh toán VNPay bảo mật sau khi xác nhận đơn hàng.</span>
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              {selectedMethod === 'bank' && (
                <div className={styles.bankSection}>
                  <div className={styles.bankTitle}>Thông tin tài khoản nhận tiền</div>
                  {[
                    { label: 'Ngân hàng', value: BANK_INFO.bankName, key: 'bank' },
                    { label: 'Số tài khoản', value: BANK_INFO.accountNo, key: 'acc' },
                    { label: 'Tên tài khoản', value: BANK_INFO.accountName, key: 'name' },
                    { label: 'Chi nhánh', value: BANK_INFO.branch, key: 'branch' },
                    { label: 'Nội dung CK', value: BANK_INFO.note, key: 'note', highlight: true },
                    { label: 'Số tiền', value: formatPriceFull(grandTotal), key: 'amount', highlight: true },
                  ].map(row => (
                    <div key={row.key} className={`${styles.bankRow} ${row.highlight ? styles.bankRowHighlight : ''}`}>
                      <span className={styles.bankLabel}>{row.label}</span>
                      <span className={styles.bankValue}>{row.value}</span>
                      <button className={styles.copyBtn} onClick={() => copyText(row.value, row.key)} title="Sao chép">
                        {copied === row.key ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  ))}
                  <div className={styles.bankWarning}>
                    <AlertTriangle size={15} />
                    <span>Ghi đúng nội dung chuyển khoản <strong>{BANK_INFO.note}</strong> để hệ thống tự động xác nhận. Thời gian xử lý 1–2 giờ trong giờ hành chính.</span>
                  </div>
                </div>
              )}

              <div className={styles.stepNav}>
                <button className={styles.btnBack} onClick={() => setStep(0)}><ArrowLeft size={16} /> Quay lại</button>
                <button id="checkout-next-payment" className={styles.btnNextStep} onClick={handleNextStep}>
                  Xem lại & Xác nhận <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Confirm & Pay */}
          {step === 2 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <ShieldCheck size={20} className={styles.cardHeaderIcon} />
                <h2 className={styles.cardTitle}>Xác nhận & Hoàn tất thanh toán</h2>
              </div>

              <div className={styles.confirmSection}>
                <div className={styles.confirmSectionTitle}><Truck size={15} /> Giao hàng đến</div>
                <div className={styles.confirmDetail}>
                  <strong>{delivery.name}</strong> · {delivery.phone}<br />
                  {delivery.address}, {delivery.city}
                  {delivery.note && <><br /><em className={styles.confirmNote}>"{delivery.note}"</em></>}
                </div>
                <button className={styles.editBtn} onClick={() => setStep(0)}>Chỉnh sửa</button>
              </div>

              <div className={styles.confirmSection}>
                <div className={styles.confirmSectionTitle}>
                  {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.icon}{' '}
                  {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}
                </div>
                {selectedMethod === 'card' && card.number && (
                  <div className={styles.confirmDetail}>
                    Thẻ kết thúc **** {card.number.replace(/\s/g, '').slice(-4)}
                  </div>
                )}
                <button className={styles.editBtn} onClick={() => setStep(1)}>Thay đổi</button>
              </div>

              {/* OTP */}
              {selectedMethod === 'card' && otpSent && (
                <div className={styles.otpSection}>
                  <div className={styles.otpTitle}><Smartphone size={16} /> Nhập mã OTP từ ngân hàng</div>
                  <div className={styles.otpHint}>Mã OTP đã được gửi đến SĐT đăng ký thẻ. Demo: nhập <strong>123456</strong></div>
                  <div className={styles.otpInputRow}>
                    {otpDigits.map((d, i) => (
                      <input key={i} ref={otpRefs[i]} id={`otp-${i}`} className={styles.otpInput} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKey(i, e)} />
                    ))}
                  </div>
                  <button className={styles.resendBtn} onClick={() => addToast?.('📱 Đã gửi lại OTP!', 'info')}>
                    <RefreshCw size={13} /> Gửi lại OTP
                  </button>
                </div>
              )}

              <div className={styles.securityRow}>
                {['SSL 256-bit', 'PCI DSS', 'Bảo vệ người mua', '3D Secure'].map(b => (
                  <span key={b} className={styles.securityBadge}><ShieldCheck size={12} /> {b}</span>
                ))}
              </div>

              <p className={styles.terms}>
                Bằng cách nhấn "Thanh toán ngay", bạn đồng ý với{' '}
                <a href="#terms" className={styles.termsLink}>Điều khoản sử dụng</a> và{' '}
                <a href="#privacy" className={styles.termsLink}>Chính sách bảo mật</a> của Artisan Hub.
                Giao dịch được bảo vệ bởi hệ thống Escrow tự động.
              </p>

              <div className={styles.stepNav}>
                <button className={styles.btnBack} onClick={() => { setStep(1); setOtpSent(false); }}><ArrowLeft size={16} /> Quay lại</button>
                <button id="checkout-pay-btn" className={`${styles.btnPay} ${processing ? styles.btnPayProcessing : ''}`} onClick={handlePay} disabled={processing}>
                  {processing ? (
                    <><RefreshCw size={18} className={styles.spinning} /> Đang xử lý...</>
                  ) : selectedMethod === 'card' && !otpSent ? (
                    <><Smartphone size={18} /> Gửi OTP & Xác nhận</>
                  ) : (
                    <><Zap size={18} /> Thanh toán ngay – {formatPriceFull(grandTotal)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT COLUMN – Order Summary ══ */}
        <div className={styles.rightCol}>
          <div className={styles.orderCard}>
            <button className={styles.orderToggle} onClick={() => setCollapseOrder(v => !v)}>
              <span className={styles.orderTitle}><Receipt size={17} /> Tóm tắt đơn hàng</span>
              {collapseOrder ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
            </button>
            {!collapseOrder && (
              <>
                <div className={styles.orderArtwork}>
                  <div className={styles.orderImgWrap}>
                    <img src={artwork.image} alt={artwork.title} className={styles.orderImg} />
                    <div className={styles.orderWinBadge}><Star size={11} /> Người thắng</div>
                  </div>
                  <div className={styles.orderArtworkInfo}>
                    <div className={styles.orderArtworkTitle}>{artwork.title}</div>
                    <div className={styles.orderArtworkBy}>bởi {artwork.artist_name}</div>
                    <div className={styles.orderArtworkMeta}>{artwork.medium} · {artwork.dimensions}</div>
                    <div className={styles.orderArtworkYear}>{artwork.creation_year}</div>
                  </div>
                </div>
                <div className={styles.orderArtist}>
                  <img src={artist?.avatar} alt={artist?.full_name} className={styles.orderArtistAvatar} />
                  <div>
                    <div className={styles.orderArtistName}>{artist?.full_name}</div>
                    <div className={styles.orderArtistBadge}><BadgeCheck size={12} /> Họa sĩ xác minh</div>
                  </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}><span>Giá đấu thắng</span><span>{formatPriceFull(winPrice)}</span></div>
                  <div className={styles.priceRow}><span>Phí nền tảng (3%)</span><span>{formatPriceFull(platformFee)}</span></div>
                  <div className={styles.priceRow}><span>Đóng gói cao cấp</span><span>{formatPriceFull(packagingFee)}</span></div>
                  <div className={styles.priceRow}><span>Bảo hiểm vận chuyển (0.5%)</span><span>{formatPriceFull(insuranceFee)}</span></div>
                  {feeForMethod > 0 && (
                    <div className={styles.priceRow}><span>Phí cổng thanh toán (2.2%)</span><span>{formatPriceFull(feeForMethod)}</span></div>
                  )}
                  <div className={styles.divider} />
                  <div className={styles.priceRowTotal}>
                    <span>Tổng thanh toán</span>
                    <span className={styles.grandTotal}>{formatPriceFull(grandTotal)}</span>
                  </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.certBox}>
                  <div className={styles.certTitle}><FileCheck size={15} /> Đi kèm tác phẩm</div>
                  <ul className={styles.certList}>
                    <li><Check size={12} /> Chứng nhận Quyền sở hữu NFT</li>
                    <li><Check size={12} /> Hồ sơ xuất xứ (Provenance) có chữ ký</li>
                    <li><Check size={12} /> Tem xác thực Artisan Hub (chống làm giả)</li>
                    <li><Check size={12} /> Hóa đơn điện tử VAT</li>
                  </ul>
                </div>
                <div className={styles.trustBadges}>
                  <div className={styles.trustBadge}><ShieldCheck size={14} /> Giao dịch an toàn</div>
                  <div className={styles.trustBadge}><Package size={14} /> Hoàn tiền 7 ngày</div>
                  <div className={styles.trustBadge}><BadgeCheck size={14} /> Xác minh chính hãng</div>
                </div>
              </>
            )}
          </div>
          <div className={styles.helpBox}>
            <span>Cần hỗ trợ?</span>
            <a href="tel:0901234567" className={styles.helpLink}>📞 0901 234 567</a>
            <span className={styles.helpSep}>|</span>
            <a href="mailto:support@artisanhub.vn" className={styles.helpLink}>✉️ support@artisanhub.vn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
