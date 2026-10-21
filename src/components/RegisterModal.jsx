import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Palette, Eye, EyeOff, Shield, Award, ChevronRight,
  Phone, Camera, Upload, Check, Clock, AlertCircle,
  User, Brush, Building2, FileText, RefreshCw, Lock,
  BadgeCheck, Info, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import styles from './RegisterModal.module.css';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const ROLES = [
  {
    id: 'collector',
    icon: User,
    label: 'Nhà sưu tầm',
    sublabel: 'Khám phá, đặt giá và sở hữu tranh độc bản',
    color: '#D4AF37',
    perks: ['Xem tranh & Room View', 'Đặt giá đấu giá', 'Thanh toán Escrow an toàn'],
  },
  {
    id: 'artist',
    icon: Brush,
    label: 'Họa sĩ',
    sublabel: 'Đăng bán, mở phiên đấu giá và nhận thanh toán',
    color: '#A78BFA',
    perks: ['Đăng tranh độc bản', 'Tạo phiên đấu giá Live / Kín', 'Nhận tiền qua Escrow'],
  },
];

const STEPS_COLLECTOR = [
  { id: 'role',    label: 'Vai trò',   short: 'L0' },
  { id: 'account', label: 'Tài khoản', short: 'L0' },
  { id: 'email',   label: 'Xác nhận email', short: 'L0' },
  { id: 'phone',   label: 'Số điện thoại',  short: 'L1' },
  { id: 'kyc',     label: 'Định danh eKYC', short: 'L2' },
  { id: 'done',    label: 'Hoàn tất',  short: '✓'  },
];

const STEPS_ARTIST = [
  { id: 'role',    label: 'Vai trò',   short: 'L0' },
  { id: 'account', label: 'Tài khoản', short: 'L0' },
  { id: 'email',   label: 'Xác nhận email', short: 'L0' },
  { id: 'phone',   label: 'Số điện thoại',  short: 'L1' },
  { id: 'kyc',     label: 'Định danh eKYC', short: 'L2' },
  { id: 'profile', label: 'Hồ sơ họa sĩ',  short: 'L3' },
  { id: 'pending', label: 'Chờ duyệt',      short: '⏳' },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/** Progress Stepper */
const Stepper = ({ steps, currentIndex }) => (
  <div className={styles.stepper}>
    {steps.map((step, i) => {
      const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
      return (
        <React.Fragment key={step.id}>
          <div className={`${styles.stepItem} ${styles[`stepItem_${state}`]}`}>
            <div className={styles.stepDot}>
              {state === 'done' ? <Check size={12} /> : <span>{step.short}</span>}
            </div>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`${styles.stepLine} ${i < currentIndex ? styles.stepLineDone : ''}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/** OTP 6-box Input */
const OTPInput = ({ value, onChange, hasError }) => {
  const refs = Array.from({ length: 6 }, () => useRef(null));

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (value[idx]) {
        const next = [...value.split('')];
        next[idx] = '';
        onChange(next.join(''));
      } else if (idx > 0) {
        refs[idx - 1].current?.focus();
      }
    }
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = (value.padEnd(6, ' ')).split('');
    next[idx] = char;
    onChange(next.join('').trimEnd());
    if (char && idx < 5) refs[idx + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className={styles.otpRow}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          id={`otp-box-${i}`}
          className={`${styles.otpBox} ${hasError ? styles.otpBoxError : ''} ${value[i] ? styles.otpBoxFilled : ''}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

/** Upload Zone */
const UploadZone = ({ id, label, hint, accept, value, onChange }) => {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ file, url });
  };

  return (
    <div
      id={id}
      className={`${styles.uploadZone} ${drag ? styles.uploadDragging : ''} ${value ? styles.uploadDone : ''}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => !value && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
      {value ? (
        <div className={styles.uploadPreview}>
          {value.url && value.file?.type?.startsWith('image/') ? (
            <img src={value.url} alt={label} className={styles.uploadPreviewImg} />
          ) : (
            <FileText size={32} color="var(--gold-primary)" />
          )}
          <div className={styles.uploadPreviewInfo}>
            <p className={styles.uploadPreviewName}>{value.file?.name}</p>
            <button
              className={styles.uploadReplace}
              onClick={e => { e.stopPropagation(); onChange(null); }}
            >
              <RefreshCw size={12} /> Thay ảnh
            </button>
          </div>
          <div className={styles.uploadCheckmark}><Check size={14} /></div>
        </div>
      ) : (
        <div className={styles.uploadEmpty}>
          <div className={styles.uploadIcon}><Upload size={24} color="var(--gold-primary)" /></div>
          <p className={styles.uploadLabel}>{label}</p>
          <p className={styles.uploadHint}>{hint}</p>
        </div>
      )}
    </div>
  );
};

/** Password strength indicator */
const PasswordStrength = ({ pwd }) => {
  const checks = [
    { label: '8+ ký tự', ok: pwd.length >= 8 },
    { label: 'Chữ hoa', ok: /[A-Z]/.test(pwd) },
    { label: 'Số', ok: /\d/.test(pwd) },
    { label: 'Ký tự đặc biệt', ok: /[!@#$%^&*]/.test(pwd) },
  ];
  const score = checks.filter(c => c.ok).length;
  const levels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];
  const colors = ['', '#E74C3C', '#F39C12', '#3498DB', '#2ECC71'];

  if (!pwd) return null;
  return (
    <div className={styles.pwdStrength}>
      <div className={styles.pwdBars}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} className={styles.pwdBar}
            style={{ background: n <= score ? colors[score] : 'var(--border-subtle)' }} />
        ))}
      </div>
      <span style={{ color: colors[score], fontSize: '0.7rem', fontWeight: 600 }}>{levels[score]}</span>
      <div className={styles.pwdChecks}>
        {checks.map(c => (
          <span key={c.label} className={`${styles.pwdCheck} ${c.ok ? styles.pwdCheckOk : ''}`}>
            <Check size={10} /> {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Privacy explanation box */
const PrivacyBox = ({ items }) => (
  <div className={styles.privacyBox}>
    <div className={styles.privacyHeader}>
      <Lock size={14} color="var(--gold-primary)" />
      <span>Tại sao chúng tôi cần thông tin này?</span>
    </div>
    {items.map(item => (
      <div key={item.field} className={styles.privacyItem}>
        <Shield size={10} color="var(--text-muted)" />
        <span><strong>{item.field}:</strong> {item.reason}</span>
      </div>
    ))}
    <p className={styles.privacyNote}>
      Theo Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân. Artisan Hub không chia sẻ dữ liệu với bên thứ ba ngoài mục đích xác minh danh tính.
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   STEP SCREENS
───────────────────────────────────────────── */

const StepRole = ({ selected, onSelect, onNext }) => (
  <div className={styles.stepContent}>
    <div className={styles.stepHeader}>
      <h2 className={styles.stepTitle}>Bạn tham gia với vai trò nào?</h2>
      <p className={styles.stepDesc}>Bạn có thể thêm vai trò Họa sĩ sau khi đã đăng ký Nhà sưu tầm.</p>
    </div>
    <div className={styles.roleGrid}>
      {ROLES.map(role => {
        const Icon = role.icon;
        const active = selected === role.id;
        return (
          <button
            key={role.id}
            id={`role-${role.id}`}
            className={`${styles.roleCard} ${active ? styles.roleCardActive : ''}`}
            style={active ? { '--role-color': role.color, borderColor: role.color } : {}}
            onClick={() => onSelect(role.id)}
          >
            <div className={styles.roleIcon} style={{ background: `${role.color}15`, border: `1px solid ${role.color}30` }}>
              <Icon size={28} color={role.color} />
            </div>
            <h3 className={styles.roleLabel}>{role.label}</h3>
            <p className={styles.roleSublabel}>{role.sublabel}</p>
            <ul className={styles.rolePerks}>
              {role.perks.map(p => (
                <li key={p}><Check size={11} color={role.color} /> {p}</li>
              ))}
            </ul>
            {active && <div className={styles.roleCheck}><Check size={16} /></div>}
          </button>
        );
      })}
    </div>
    <button
      id="role-next"
      className="btn btn-primary"
      style={{ width: '100%', padding: 14 }}
      disabled={!selected}
      onClick={onNext}
    >
      Tiếp tục <ChevronRight size={16} />
    </button>
  </div>
);

const StepAccount = ({ data, setData, onNext, onBack }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.fullName?.trim()) e.fullName = 'Vui lòng nhập họ tên';
    if (!data.email?.includes('@')) e.email = 'Email không hợp lệ';
    if ((data.password?.length || 0) < 8) e.password = 'Mật khẩu tối thiểu 8 ký tự';
    if (data.password !== data.confirm) e.confirm = 'Mật khẩu xác nhận không khớp';
    if (!agreed) e.agree = 'Vui lòng đồng ý điều khoản';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Tạo tài khoản</h2>
        <p className={styles.stepDesc}>Cấp L0 – Thông tin cơ bản để bắt đầu hành trình nghệ thuật của bạn.</p>
        <div className={styles.levelBadge} style={{ '--lvl-color': '#D4AF37' }}>
          <BadgeCheck size={12} /> Cấp L0 – Truy cập cơ bản
        </div>
      </div>

      <div className={styles.formStack}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="reg-name">Họ và tên <span className={styles.required}>*</span></label>
          <input
            id="reg-name"
            className={`input ${errors.fullName ? styles.inputError : ''}`}
            placeholder="Nguyễn Văn A"
            value={data.fullName || ''}
            onChange={e => setData(d => ({ ...d, fullName: e.target.value }))}
          />
          {errors.fullName && <p className={styles.errorMsg}><AlertCircle size={12} /> {errors.fullName}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="reg-email">Email <span className={styles.required}>*</span></label>
          <input
            id="reg-email"
            className={`input ${errors.email ? styles.inputError : ''}`}
            type="email"
            placeholder="your@email.com"
            value={data.email || ''}
            onChange={e => setData(d => ({ ...d, email: e.target.value }))}
          />
          {errors.email && <p className={styles.errorMsg}><AlertCircle size={12} /> {errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="reg-pwd">Mật khẩu <span className={styles.required}>*</span></label>
          <div className={styles.pwdWrap}>
            <input
              id="reg-pwd"
              className={`input ${errors.password ? styles.inputError : ''}`}
              type={showPwd ? 'text' : 'password'}
              placeholder="Tối thiểu 8 ký tự"
              value={data.password || ''}
              onChange={e => setData(d => ({ ...d, password: e.target.value }))}
              style={{ paddingRight: 44 }}
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(s => !s)}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrength pwd={data.password || ''} />
          {errors.password && <p className={styles.errorMsg}><AlertCircle size={12} /> {errors.password}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="reg-confirm">Xác nhận mật khẩu <span className={styles.required}>*</span></label>
          <div className={styles.pwdWrap}>
            <input
              id="reg-confirm"
              className={`input ${errors.confirm ? styles.inputError : ''}`}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              value={data.confirm || ''}
              onChange={e => setData(d => ({ ...d, confirm: e.target.value }))}
              style={{ paddingRight: 44 }}
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(s => !s)}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirm && <p className={styles.errorMsg}><AlertCircle size={12} /> {errors.confirm}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.checkRow} ${errors.agree ? styles.checkRowError : ''}`}>
            <input
              id="reg-agree"
              type="checkbox"
              className={styles.checkbox}
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
            <span>
              Tôi đồng ý với <a href="#" className={styles.link}>Điều khoản sử dụng</a> và{' '}
              <a href="#" className={styles.link}>Chính sách bảo mật</a> của Artisan Hub.
            </span>
          </label>
          {errors.agree && <p className={styles.errorMsg}><AlertCircle size={12} /> {errors.agree}</p>}
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button>
        <button id="account-next" className="btn btn-primary" style={{ flex: 1 }} onClick={() => validate() && onNext()}>
          Tạo tài khoản <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const StepEmailVerify = ({ email, onNext, onResend }) => {
  const [checking, setChecking] = useState(false);

  const handleVerified = () => {
    setChecking(true);
    setTimeout(() => { setChecking(false); onNext(); }, 1200);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <div className={styles.bigIcon} style={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.3)' }}>
          <span style={{ fontSize: '2.5rem' }}>📬</span>
        </div>
        <h2 className={styles.stepTitle}>Xác nhận email</h2>
        <p className={styles.stepDesc}>
          Chúng tôi đã gửi link xác nhận đến <strong style={{ color: 'var(--gold-primary)' }}>{email}</strong>.
          Vui lòng kiểm tra hộp thư và nhấn vào link xác nhận.
        </p>
      </div>

      <div className={styles.infoBox}>
        <Info size={14} color="var(--gold-primary)" />
        <div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Không thấy email?</p>
          <p style={{ margin: 0 }}>Kiểm tra thư mục Spam hoặc Junk Mail. Link có hiệu lực trong 24 giờ.</p>
        </div>
      </div>

      <div className={styles.stepActions}>
        <button id="resend-email" className="btn btn-ghost" onClick={onResend}>
          <RefreshCw size={14} /> Gửi lại email
        </button>
        <button
          id="email-verified-btn"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={handleVerified}
          disabled={checking}
        >
          {checking
            ? <><span className={styles.spinner} /> Đang kiểm tra...</>
            : <><CheckCircle2 size={16} /> Tôi đã xác nhận email</>
          }
        </button>
      </div>
    </div>
  );
};

const StepPhone = ({ data, setData, onNext, onBack }) => {
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendOtp = () => {
    if (!data.phone || data.phone.length < 9) {
      setPhoneError('Số điện thoại không hợp lệ');
      return;
    }
    setPhoneError('');
    setSent(true);
    setCountdown(60);
    setOtp('');
    setHasError(false);
  };

  const verifyOtp = () => {
    // Demo: correct OTP = "123456"
    if (otp.length < 6) return;
    setVerifying(true);
    setTimeout(() => {
      if (otp === '123456') {
        setVerifying(false);
        onNext();
      } else {
        setHasError(true);
        setVerifying(false);
        setOtp('');
      }
    }, 1000);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Xác minh số điện thoại</h2>
        <p className={styles.stepDesc}>Cấp L1 – Bảo vệ tài khoản và nâng hạn mức đặt giá.</p>
        <div className={styles.levelBadge} style={{ '--lvl-color': '#60B4F6' }}>
          <Phone size={12} /> Cấp L1 – Nâng hạn mức đặt giá
        </div>
      </div>

      <PrivacyBox items={[
        { field: 'Số điện thoại', reason: 'Nhận OTP xác minh và thông báo đấu giá quan trọng. Không dùng cho quảng cáo.' },
      ]} />

      <div className={styles.formStack}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="reg-phone">Số điện thoại</label>
          <div className={styles.phoneRow}>
            <div className={styles.phonePrefix}>🇻🇳 +84</div>
            <input
              id="reg-phone"
              className={`input ${phoneError ? styles.inputError : ''}`}
              type="tel"
              placeholder="9x xxx xxxx"
              value={data.phone || ''}
              onChange={e => setData(d => ({ ...d, phone: e.target.value.replace(/\D/g, '') }))}
              style={{ borderRadius: '0 8px 8px 0' }}
            />
          </div>
          {phoneError && <p className={styles.errorMsg}><AlertCircle size={12} /> {phoneError}</p>}
        </div>

        {!sent ? (
          <button id="send-otp" className="btn btn-secondary" style={{ width: '100%' }} onClick={sendOtp}>
            <Phone size={16} /> Gửi mã OTP
          </button>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>Nhập mã OTP 6 số</label>
            <OTPInput value={otp} onChange={setOtp} hasError={hasError} />
            {hasError && (
              <p className={styles.errorMsg}><AlertCircle size={12} /> Mã OTP không đúng. Vui lòng thử lại.</p>
            )}
            <div className={styles.otpMeta}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Demo: nhập <strong style={{ color: 'var(--gold-primary)' }}>123456</strong>
              </span>
              <button
                id="resend-otp"
                className={styles.resendBtn}
                onClick={sendOtp}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : <><RefreshCw size={12} /> Gửi lại</>}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.stepActions}>
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button>
        <button
          id="phone-verify-btn"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={verifyOtp}
          disabled={!sent || otp.length < 6 || verifying}
        >
          {verifying
            ? <><span className={styles.spinner} /> Đang xác minh...</>
            : <><Check size={16} /> Xác minh</>
          }
        </button>
      </div>
    </div>
  );
};

const StepKYC = ({ data, setData, onNext, onBack, onSkip }) => {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [consent, setConsent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [liveness, setLiveness] = useState(null); // null | 'checking' | 'passed' | 'failed'

  const allUploaded = front && back && selfie && consent;

  const handleSubmit = () => {
    if (!allUploaded) return;
    setProcessing(true);
    setLiveness('checking');
    setTimeout(() => {
      setLiveness('passed');
      setTimeout(() => { setProcessing(false); onNext(); }, 800);
    }, 2000);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Định danh eKYC</h2>
        <p className={styles.stepDesc}>Cấp L2 – Đặt giá không giới hạn, đấu giá kín và thanh toán Escrow.</p>
        <div className={styles.levelBadge} style={{ '--lvl-color': '#2ECC71' }}>
          <Shield size={12} /> Cấp L2 – Đặt giá không giới hạn
        </div>
      </div>

      <PrivacyBox items={[
        { field: 'Ảnh CCCD/CMND', reason: 'Xác minh danh tính thật theo quy định giao dịch tài chính. Chỉ lưu mã băm, không lưu số gốc.' },
        { field: 'Selfie liveness', reason: 'Đảm bảo người đăng ký là người thật, chống giả mạo bằng ảnh in.' },
        { field: 'Tên tài khoản NH', reason: 'Tên phải khớp với tên định danh để bảo vệ thanh toán Escrow.' },
      ]} />

      <div className={styles.uploadGrid}>
        <div className={styles.uploadItem}>
          <p className={styles.uploadTitle}><span className={styles.uploadNum}>1</span> Mặt trước CCCD</p>
          <UploadZone
            id="upload-id-front"
            label="Kéo thả hoặc nhấn để chọn"
            hint="JPG, PNG · Tối đa 5MB · Rõ nét, đủ 4 góc"
            accept="image/*"
            value={front}
            onChange={setFront}
          />
        </div>
        <div className={styles.uploadItem}>
          <p className={styles.uploadTitle}><span className={styles.uploadNum}>2</span> Mặt sau CCCD</p>
          <UploadZone
            id="upload-id-back"
            label="Kéo thả hoặc nhấn để chọn"
            hint="JPG, PNG · Tối đa 5MB · Rõ nét, đủ 4 góc"
            accept="image/*"
            value={back}
            onChange={setBack}
          />
        </div>
        <div className={`${styles.uploadItem} ${styles.uploadItemWide}`}>
          <p className={styles.uploadTitle}><span className={styles.uploadNum}>3</span> Selfie kèm CCCD (Liveness check)</p>
          <UploadZone
            id="upload-selfie"
            label="Kéo thả hoặc nhấn để chọn"
            hint="Chụp rõ mặt + CCCD cầm trên tay · Ánh sáng đủ · Không đeo kính đen"
            accept="image/*"
            value={selfie}
            onChange={setSelfie}
          />
        </div>
      </div>

      {/* Liveness result */}
      {liveness && (
        <div className={`${styles.livenessBox} ${styles[`liveness_${liveness}`]}`}>
          {liveness === 'checking' && <><span className={styles.spinner} style={{ borderTopColor: '#60B4F6' }} /> Hệ thống đang kiểm tra liveness...</>}
          {liveness === 'passed' && <><CheckCircle2 size={16} /> Liveness check thành công! Đang chuyển bước...</>}
          {liveness === 'failed' && <><AlertCircle size={16} /> Không nhận ra khuôn mặt. Vui lòng thử lại với ảnh rõ hơn.</>}
        </div>
      )}

      <label className={`${styles.checkRow}`}>
        <input
          id="kyc-consent"
          type="checkbox"
          className={styles.checkbox}
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
        />
        <span>Tôi đồng ý cung cấp thông tin định danh theo <a href="#" className={styles.link}>Điều khoản eKYC</a> và hiểu rằng dữ liệu được bảo vệ theo Nghị định 13/2023/NĐ-CP.</span>
      </label>

      <div className={styles.stepActions}>
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button>
        <button id="skip-kyc" className="btn btn-ghost" onClick={onSkip}>Bỏ qua (làm sau)</button>
        <button
          id="kyc-submit"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={handleSubmit}
          disabled={!allUploaded || processing}
        >
          {processing
            ? <><span className={styles.spinner} /> Đang xử lý...</>
            : <><Shield size={16} /> Gửi xác minh</>
          }
        </button>
      </div>
    </div>
  );
};

const StepArtistProfile = ({ data, setData, onNext, onBack }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [process, setProcess] = useState(null);

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Hồ sơ Họa sĩ</h2>
        <p className={styles.stepDesc}>Cấp L3 – Đăng bán tranh, mở phiên đấu giá và nhận thanh toán.</p>
        <div className={styles.levelBadge} style={{ '--lvl-color': '#A78BFA' }}>
          <Brush size={12} /> Cấp L3 – Họa sĩ xác thực
        </div>
      </div>

      <div className={styles.formStack}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="art-bio">Tiểu sử nghệ thuật <span className={styles.required}>*</span></label>
          <textarea
            id="art-bio"
            className="input"
            rows={4}
            placeholder="Mô tả phong cách sáng tác, kinh nghiệm, triển lãm đã tham dự..."
            value={data.bio || ''}
            onChange={e => setData(d => ({ ...d, bio: e.target.value }))}
            style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="art-studio">Địa chỉ xưởng vẽ <span className={styles.required}>*</span></label>
          <input
            id="art-studio"
            className="input"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            value={data.studio || ''}
            onChange={e => setData(d => ({ ...d, studio: e.target.value }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="art-bank">Tên tài khoản nhận tiền <span className={styles.required}>*</span></label>
          <input
            id="art-bank"
            className="input"
            placeholder="Phải khớp với tên đã định danh CCCD"
            value={data.bankName || ''}
            onChange={e => setData(d => ({ ...d, bankName: e.target.value }))}
          />
          <p className={styles.fieldHint}>
            <Lock size={11} /> Tên tài khoản phải khớp với tên định danh eKYC để bảo vệ thanh toán.
          </p>
        </div>

        <div className={styles.uploadItem}>
          <p className={styles.uploadTitle}><span className={styles.uploadNum}>1</span> Portfolio (PDF hoặc ảnh)</p>
          <UploadZone
            id="upload-portfolio"
            label="Upload portfolio nghệ thuật"
            hint="PDF, JPG, PNG · Tối đa 20MB"
            accept="image/*,.pdf"
            value={portfolio}
            onChange={setPortfolio}
          />
        </div>

        <div className={styles.uploadItem}>
          <p className={styles.uploadTitle}><span className={styles.uploadNum}>2</span> Ảnh/Video quá trình sáng tác</p>
          <UploadZone
            id="upload-process"
            label="Upload ảnh xưởng vẽ hoặc video sáng tác"
            hint="JPG, PNG, MP4 · Tối đa 50MB"
            accept="image/*,video/*"
            value={process}
            onChange={setProcess}
          />
        </div>
      </div>

      <div className={styles.stepActions}>
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button>
        <button
          id="artist-submit"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => data.bio && data.studio && onNext()}
          disabled={!data.bio || !data.studio}
        >
          <Building2 size={16} /> Gửi hồ sơ để duyệt
        </button>
      </div>
    </div>
  );
};

const StepDone = ({ role, kycLevel, onClose }) => {
  const isArtist = role === 'artist';
  return (
    <div className={styles.stepContent}>
      <div className={styles.doneCenter}>
        <div className={styles.doneIcon}>🎉</div>
        <h2 className={styles.stepTitle}>
          {isArtist ? 'Hồ sơ đã được gửi!' : 'Chào mừng đến Artisan Hub!'}
        </h2>
        <p className={styles.stepDesc}>
          {isArtist
            ? 'Ban Curator sẽ xem xét hồ sơ trong vòng 3–5 ngày làm việc. Bạn sẽ nhận thông báo kết quả qua email và ứng dụng.'
            : 'Tài khoản của bạn đã sẵn sàng. Hãy bắt đầu khám phá nghệ thuật!'}
        </p>

        <div className={styles.levelsSummary}>
          {[
            { lvl: 'L0', label: 'Email xác nhận', color: '#D4AF37', done: kycLevel >= 0 },
            { lvl: 'L1', label: 'SĐT xác minh', color: '#60B4F6', done: kycLevel >= 1 },
            { lvl: 'L2', label: 'eKYC định danh', color: '#2ECC71', done: kycLevel >= 2 },
            { lvl: 'L3', label: 'Họa sĩ xác thực', color: '#A78BFA', done: kycLevel >= 3 },
          ].map(({ lvl, label, color, done }) => (
            <div key={lvl} className={`${styles.levelRow} ${done ? styles.levelRowDone : ''}`} style={done ? { '--lvl-color': color } : {}}>
              {done ? <CheckCircle2 size={16} color={color} /> : <div className={styles.levelDot} />}
              <span className={styles.levelLvl} style={done ? { color } : {}}>{lvl}</span>
              <span className={styles.levelLabel}>{label}</span>
              {done && <span className={styles.levelDoneTag} style={{ color, borderColor: `${color}40`, background: `${color}10` }}>Đạt</span>}
            </div>
          ))}
        </div>

        {isArtist && (
          <div className={styles.pendingBox}>
            <Clock size={16} color="#F39C12" />
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Trạng thái: Đang xét duyệt</p>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>Trong thời gian chờ, bạn vẫn có thể sử dụng các tính năng L0–L2.</p>
            </div>
          </div>
        )}

        <button id="done-close" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onClose}>
          {isArtist ? 'Về trang chủ' : 'Bắt đầu khám phá'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN MODAL
───────────────────────────────────────────── */
const RegisterModal = ({ onClose, onRegister }) => {
  const [role, setRole] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [accountData, setAccountData] = useState({});
  const [artistData, setArtistData] = useState({});
  const [kycLevel, setKycLevel] = useState(0);

  const steps = role === 'artist' ? STEPS_ARTIST : STEPS_COLLECTOR;
  const currentStep = steps[stepIndex];

  const next = () => setStepIndex(i => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex(i => Math.max(i - 1, 0));

  const handleRoleNext = () => {
    if (!role) return;
    next();
  };

  const handleAccountNext = () => {
    setKycLevel(0);
    next();
  };

  const handleEmailNext = () => {
    next();
  };

  const handlePhoneNext = () => {
    setKycLevel(l => Math.max(l, 1));
    next();
  };

  const handleKYCNext = () => {
    setKycLevel(l => Math.max(l, 2));
    next();
  };

  const handleKYCSkip = () => {
    next();
  };

  const handleArtistNext = () => {
    setKycLevel(l => Math.max(l, 3));
    next();
  };

  const handleDone = () => {
    const newUser = {
      user_id: `u_${Date.now()}`,
      username: accountData.email?.split('@')[0] || 'user',
      email: accountData.email || 'user@example.com',
      role,
      full_name: accountData.fullName || 'Người dùng mới',
      kyc_level: kycLevel,
      verification_badge: kycLevel >= 2,
      avatar: '/artist_avatar.png',
      ...(role === 'artist' ? { artist_bio: artistData.bio, studio_address: artistData.studio } : {}),
    };
    onRegister(newUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${styles.registerModal}`}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <Link_Logo />
          <button className={`btn btn-icon btn-ghost ${styles.closeBtn}`} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Stepper (after role chosen) */}
        {role && stepIndex > 0 && (
          <div className={styles.stepperWrap}>
            <Stepper steps={steps} currentIndex={stepIndex} />
          </div>
        )}

        {/* Step content */}
        {currentStep?.id === 'role'    && <StepRole selected={role} onSelect={setRole} onNext={handleRoleNext} />}
        {currentStep?.id === 'account' && <StepAccount data={accountData} setData={setAccountData} onNext={handleAccountNext} onBack={back} />}
        {currentStep?.id === 'email'   && <StepEmailVerify email={accountData.email} onNext={handleEmailNext} onResend={() => {}} />}
        {currentStep?.id === 'phone'   && <StepPhone data={accountData} setData={setAccountData} onNext={handlePhoneNext} onBack={back} />}
        {currentStep?.id === 'kyc'     && <StepKYC data={accountData} setData={setAccountData} onNext={handleKYCNext} onBack={back} onSkip={handleKYCSkip} />}
        {currentStep?.id === 'profile' && <StepArtistProfile data={artistData} setData={setArtistData} onNext={handleArtistNext} onBack={back} />}
        {(currentStep?.id === 'done' || currentStep?.id === 'pending') && (
          <StepDone role={role} kycLevel={kycLevel} onClose={handleDone} />
        )}
      </div>
    </div>
  );
};

const Link_Logo = () => (
  <div className={styles.logo}>
    <div className={styles.logoIcon}><Palette size={20} color="#D4AF37" /></div>
    <span className={styles.logoText}>ARTISAN HUB</span>
  </div>
);

export default RegisterModal;
