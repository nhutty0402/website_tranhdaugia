import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, ShieldCheck, Lock, AlertTriangle, ArrowRight,
  CheckCircle2, Fingerprint, KeyRound, QrCode, Sparkles,
  RefreshCw, X, ChevronRight, Check, AlertCircle, FileText
} from 'lucide-react';
import { formatPrice, formatPriceFull } from '../data/mockData';
import styles from './DepositEscrowModal.module.css';

const STEP_LABELS = [
  'Nghĩa vụ tài chính',
  'Chốt chặn ý thức',
  'Xác thực đa yếu tố',
  'Cấp quyền phòng đấu'
];

const REQUIRED_PHRASE = 'TÔI CAM KẾT KHÓA CỌC';

const DepositEscrowModal = ({
  artwork,
  session,
  currentUser,
  onClose,
  onSuccess,
  addToast,
}) => {
  // Current Step: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState(1);

  // Financial calculations
  const basePrice = session?.current_highest_price || session?.min_bid || artwork?.reserve_price || 20000000;
  const depositRate = 0.15; // 15% deposit
  const depositAmount = Math.round(basePrice * depositRate);
  const appraisalFee = 0; // Free for eKYC verified users
  const totalLocked = depositAmount + appraisalFee;

  // Step 2 Friction State
  const [frictionMode, setFrictionMode] = useState('slider'); // 'slider' | 'phrase'
  const [phraseInput, setPhraseInput] = useState('');
  const [sliderProgress, setSliderProgress] = useState(0); // 0 to 100
  const [sliderCompleted, setSliderCompleted] = useState(false);
  const sliderTrackRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Step 3 MFA State
  const [mfaType, setMfaType] = useState('biometric'); // 'biometric' | 'otp'
  const [isScanningBio, setIsScanningBio] = useState(false);
  const [bioVerified, setBioVerified] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  // Step 4 Escrow Pass Info
  const [passData, setPassData] = useState(null);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && currentStep !== 3) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, onClose]);

  // Touch & Mouse Drag handlers for Friction Slider (Step 2)
  const handleSliderMove = (clientX) => {
    if (!sliderTrackRef.current || sliderCompleted) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const trackWidth = rect.width - 56; // minus thumb diameter
    const offsetX = Math.max(0, Math.min(clientX - rect.left, trackWidth));
    const percent = Math.round((offsetX / trackWidth) * 100);
    setSliderProgress(percent);

    if (percent >= 92) {
      setSliderProgress(100);
      setSliderCompleted(true);
      isDraggingRef.current = false;
      addToast?.('✦ Đã hoàn tất chốt chặn ý thức!', 'gold', 3000);
    }
  };

  const handleMouseDown = () => {
    if (sliderCompleted) return;
    isDraggingRef.current = true;
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDraggingRef.current) {
        handleSliderMove(e.clientX);
      }
    };
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (!sliderCompleted) {
          setSliderProgress(0); // Snap back if not completed
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [sliderCompleted]);

  // Biometric Scan Trigger (Step 3)
  const handleTriggerBiometric = () => {
    setIsScanningBio(true);
    setTimeout(() => {
      setIsScanningBio(false);
      setBioVerified(true);
      completeDepositEscrow();
    }, 1400);
  };

  // OTP Handling (Step 3)
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }

    // If all 6 digits entered
    if (newDigits.every((d) => d !== '')) {
      verifyOtpCode(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  const verifyOtpCode = (code) => {
    setOtpSubmitting(true);
    setTimeout(() => {
      setOtpSubmitting(false);
      completeDepositEscrow();
    }, 800);
  };

  // Complete Deposit & Generate Access Pass
  const completeDepositEscrow = () => {
    const pass = {
      passId: `PASS-${Date.now().toString().slice(-6)}`,
      escrowId: `ESC-AH-${Date.now().toString().slice(-8)}`,
      hash: '0x4f8a91b2c3d4e5f60718293a4b5c6d7e8f901234',
      lockedAmount: totalLocked,
      artworkId: artwork?.artwork_id,
      timestamp: new Date().toISOString(),
      userName: currentUser?.full_name || 'Nhà sưu tầm VIP',
    };
    setPassData(pass);
    setCurrentStep(4);
    addToast?.('🎉 Đã ký quỹ thành công & Cấp quyền phòng đấu giá!', 'gold', 5000);
  };

  const handleFinishAndEnter = () => {
    onSuccess?.(passData);
    onClose();
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && currentStep !== 4) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.stepBadge}>
              <Shield size={12} /> Bước {currentStep}/4 · Friction with Purpose
            </span>
            <h2 className={styles.title}>
              {currentStep === 1 && 'Nghĩa vụ tài chính & Ký quỹ Escrow'}
              {currentStep === 2 && 'Chốt chặn hành vi chống bấm nhầm'}
              {currentStep === 3 && 'Xác thực ký quỹ đa yếu tố (MFA)'}
              {currentStep === 4 && 'Chứng nhận ký quỹ & Thẻ phòng đấu'}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Đóng modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* 4-Step Progress Bar */}
        <div className={styles.stepperTrack}>
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isActive = currentStep === stepNum;
            return (
              <div key={label} className={styles.stepperItem}>
                <div
                  className={`${styles.stepperBar} ${
                    isDone ? styles.stepperBarDone : isActive ? styles.stepperBarActive : ''
                  }`}
                />
                <span
                  className={`${styles.stepperLabel} ${
                    isActive ? styles.stepperLabelActive : ''
                  }`}
                >
                  {stepNum}. {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className={styles.body}>
          {/* ============================================================
             BƯỚC 1: TÓM TẮT NGHĨA VỤ TÀI CHÍNH (FINANCIAL BREAKDOWN)
             ============================================================ */}
          {currentStep === 1 && (
            <>
              {/* Artwork Preview Card */}
              <div className={styles.artworkCardMini}>
                <img
                  src={artwork?.image || '/artwork_1.png'}
                  alt={artwork?.title}
                  className={styles.artworkThumb}
                />
                <div>
                  <h4 className={styles.artworkTitle}>{artwork?.title}</h4>
                  <p className={styles.artworkMeta}>
                    Họa sĩ: {artwork?.artist_name} · {artwork?.medium}
                  </p>
                </div>
              </div>

              {/* Financial Calculation Table */}
              <div className={styles.financialTable}>
                <div className={styles.financialRow}>
                  <span style={{ color: '#B8B0A0' }}>Giá sàn khởi điểm phiên:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {formatPriceFull(basePrice)}
                  </span>
                </div>

                <div className={styles.financialRow}>
                  <span style={{ color: '#B8B0A0' }}>Tỷ lệ ký quỹ bảo chứng pháp lý:</span>
                  <span style={{ color: '#D4AF37', fontWeight: 600 }}>
                    15% giá khởi điểm
                  </span>
                </div>

                <div className={styles.financialRow}>
                  <span style={{ color: '#B8B0A0' }}>Phí bảo hiểm & Thẩm định tác phẩm:</span>
                  <span style={{ color: '#2ECC71', fontWeight: 600 }}>
                    Miễn phí (Thành viên L2 eKYC)
                  </span>
                </div>

                <div className={`${styles.financialRow} ${styles.financialTotalRow}`}>
                  <span className={styles.totalLabel}>
                    Tổng số tiền tạm khóa trong Ví ký quỹ (Escrow):
                  </span>
                  <span className={styles.totalAmount}>
                    {formatPriceFull(totalLocked)}
                  </span>
                </div>
              </div>

              {/* Legal Notice */}
              <div className={styles.termNoticeBox}>
                <AlertCircle size={20} color="#3498DB" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Chính sách hoàn cọc bảo chứng 100%:</strong>
                  <ul style={{ paddingLeft: 18, margin: '6px 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>
                      Tiền cọc được <strong>hoàn trả 100% tự động trong 2 giờ</strong> sau khi phiên đấu giá kết thúc nếu bạn không phải người trúng thầu.
                    </li>
                    <li>
                      Nếu trúng đấu giá, số tiền cọc được khấu trừ thẳng vào giá thanh toán tác phẩm.
                    </li>
                    <li>
                      Trường hợp cố tình bỏ cọc sau 48h, tiền ký quỹ sẽ được bồi hoàn cho Họa sĩ theo quy chế sàn.
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* ============================================================
             BƯỚC 2: CHỐT CHẶN HÀNH VI CHỐNG BẤM VÔ THỨC (INTERACTION FRICTION)
             ============================================================ */}
          {currentStep === 2 && (
            <div className={styles.frictionContainer}>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <Lock size={36} color="#D4AF37" style={{ marginBottom: 8 }} />
                <h3 style={{ margin: '0 0 6px', color: '#F2EEE8' }}>
                  Xác nhận ý thức trước khi khóa tiền
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#948E85', lineHeight: 1.6 }}>
                  Để bảo vệ bạn khỏi các cú chạm vô ý trên màn hình cảm ứng, hệ thống yêu cầu xác nhận chủ động bằng hành động kéo trượt (Slide-to-Confirm).
                </p>
              </div>

              {/* Slider Drag to Confirm (Friction with Purpose) */}
              <div
                ref={sliderTrackRef}
                className={styles.sliderTrack}
                onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                onTouchEnd={() => {
                  if (!sliderCompleted) setSliderProgress(0);
                }}
              >
                <div
                  className={styles.sliderFill}
                  style={{ width: `${sliderProgress}%` }}
                />

                <span className={styles.sliderText}>
                  {sliderCompleted ? (
                    <span style={{ color: '#2ECC71', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={16} /> ĐÃ MỞ CHỐT CAM KẾT
                    </span>
                  ) : (
                    'Kéo sang phải để mở chốt cam kết →'
                  )}
                </span>

                <div
                  className={styles.sliderThumb}
                  style={{
                    transform: `translateX(${(sliderProgress / 100) * 440}px)`,
                    background: sliderCompleted ? '#2ECC71' : '#D4AF37',
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {sliderCompleted ? <Check size={20} /> : <ArrowRight size={20} />}
                </div>
              </div>

              {/* Alternative Mode: Type Phrase */}
              <div className={styles.phraseCard}>
                <p className={styles.phraseTitle}>
                  <AlertTriangle size={15} />
                  Hoặc nhập thủ công cụm từ bảo chứng:
                </p>
                <p className={styles.phraseInstruction}>
                  Nhập chính xác: <span className={styles.requiredPhrase}>{REQUIRED_PHRASE}</span>
                </p>
                <input
                  type="text"
                  className={styles.phraseInput}
                  placeholder="Nhập vào đây..."
                  value={phraseInput}
                  onChange={(e) => setPhraseInput(e.target.value.toUpperCase())}
                />
              </div>
            </div>
          )}

          {/* ============================================================
             BƯỚC 3: XÁC THỰC KÝ QUỸ ĐA YẾU TỐ (MFA / BIOMETRICS)
             ============================================================ */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* MFA Mode Toggle */}
              <div className={styles.mfaTabs}>
                <button
                  type="button"
                  className={`${styles.mfaTabBtn} ${mfaType === 'biometric' ? styles.mfaTabBtnActive : ''}`}
                  onClick={() => setMfaType('biometric')}
                >
                  <Fingerprint size={16} />
                  Sinh trắc học (Touch/Face ID)
                </button>
                <button
                  type="button"
                  className={`${styles.mfaTabBtn} ${mfaType === 'otp' ? styles.mfaTabBtnActive : ''}`}
                  onClick={() => setMfaType('otp')}
                >
                  <KeyRound size={16} />
                  Mã bảo mật Smart OTP
                </button>
              </div>

              {/* Mode 1: Biometric Scan */}
              {mfaType === 'biometric' && (
                <div className={styles.biometricBox}>
                  <div
                    className={styles.scannerCircle}
                    onClick={handleTriggerBiometric}
                    title="Nhấn để quét sinh trắc học"
                  >
                    {isScanningBio && <div className={styles.scanLine} />}
                    {bioVerified ? (
                      <CheckCircle2 size={44} color="#2ECC71" />
                    ) : (
                      <Fingerprint size={48} color="#D4AF37" />
                    )}
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#F2EEE8' }}>
                      {isScanningBio ? 'Đang giải mã sinh trắc học...' : bioVerified ? 'Xác thực thành công!' : 'Chạm vào cảm biến vân tay'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#948E85' }}>
                      Mô phỏng WebAuthn FIDO2 chuẩn bảo mật ngân hàng
                    </p>
                  </div>

                  {!bioVerified && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleTriggerBiometric}
                      disabled={isScanningBio}
                    >
                      {isScanningBio ? 'Đang xác thực...' : 'Quét vân tay / Face ID'}
                    </button>
                  )}
                </div>
              )}

              {/* Mode 2: 6-Digit OTP */}
              {mfaType === 'otp' && (
                <div className={styles.otpContainer}>
                  <p className={styles.otpHint}>
                    Nhập mã xác thực 6 chữ số vừa gửi đến số điện thoại định danh của bạn
                  </p>

                  <div className={styles.otpInputRow}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={styles.otpDigit}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        disabled={otpSubmitting}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      const demoCode = ['1', '2', '3', '4', '5', '6'];
                      setOtpDigits(demoCode);
                      verifyOtpCode('123456');
                    }}
                    style={{ fontSize: '0.75rem', color: '#D4AF37' }}
                  >
                    ✦ Điền nhanh mã thử nghiệm: 123456
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
             BƯỚC 4: TRẠNG THÁI KHÓA CỌC & CẤP QUYỀN PHÒNG ĐẤU (SUCCESS PASS)
             ============================================================ */}
          {currentStep === 4 && passData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Bidding Access Pass Card */}
              <div className={styles.accessPassCard}>
                <div className={styles.passHeader}>
                  <span className={styles.passBrand}>ARTISAN HUB · ACCESS PASS</span>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                    <ShieldCheck size={12} /> ĐÃ KHÓA KÝ QUỸ
                  </span>
                </div>

                <div className={styles.passQrRow}>
                  <div className={styles.passQrCode}>
                    <QrCode size={68} color="#0A0A0C" />
                  </div>
                  <div className={styles.passDetails}>
                    <p className={styles.passNumber}>Hồ sơ thẻ: {passData.passId}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#F3E5AB' }}>
                      Nhà sưu tầm: <strong>{passData.userName}</strong>
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#2ECC71' }}>
                      Số tiền ký quỹ: <strong>{formatPriceFull(passData.lockedAmount)}</strong>
                    </p>
                    <p className={styles.passHash}>
                      Mã Escrow: {passData.escrowId}
                    </p>
                  </div>
                </div>

                <div className={styles.passBadgeRow}>
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                    ✦ Cấp quyền phòng đấu giá VIP
                  </span>
                  <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                    Bảo chứng ví 72h
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: '#948E85', fontSize: '0.82rem' }}>
                Hệ thống đã tự động cấp quyền đặt giá thầu không giới hạn cho bạn đối với phiên đấu giá tác phẩm <strong>"{artwork?.title}"</strong>.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          {currentStep === 1 && (
            <>
              <button
                type="button"
                className={`btn btn-secondary ${styles.cancelBtn}`}
                onClick={onClose}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className={`btn btn-primary ${styles.nextBtn}`}
                onClick={() => setCurrentStep(2)}
              >
                Chấp thuận nghĩa vụ tài chính <ArrowRight size={16} />
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <button
                type="button"
                className={`btn btn-secondary ${styles.cancelBtn}`}
                onClick={() => setCurrentStep(1)}
              >
                ← Quay lại
              </button>
              <button
                type="button"
                className={`btn btn-primary ${styles.nextBtn}`}
                disabled={!sliderCompleted && phraseInput.trim() !== REQUIRED_PHRASE}
                onClick={() => setCurrentStep(3)}
              >
                Tiến hành xác thực bảo mật (Bước 3/4) <ArrowRight size={16} />
              </button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <button
                type="button"
                className={`btn btn-secondary ${styles.cancelBtn}`}
                onClick={() => setCurrentStep(2)}
              >
                ← Quay lại
              </button>
              <span style={{ fontSize: '0.75rem', color: '#948E85' }}>
                Bảo mật mã hóa đầu cuối SHA-256
              </span>
            </>
          )}

          {currentStep === 4 && (
            <button
              type="button"
              className={`btn btn-primary ${styles.nextBtn}`}
              style={{ width: '100%', justifyContent: 'center', minHeight: 48 }}
              onClick={handleFinishAndEnter}
            >
              <Sparkles size={16} />
              Vào phòng đấu giá & Bắt đầu đặt giá ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositEscrowModal;
