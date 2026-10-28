import React, { useState, useRef, useEffect } from 'react';
import {
  X, Palette, Eye, EyeOff, Shield, Award, AlertCircle,
  ArrowLeft, CheckCircle2, RefreshCw, KeyRound, Check
} from 'lucide-react';
import { USERS } from '../data/mockData';
import Logo from './Logo';
import styles from './LoginModal.module.css';

/**
 * LoginModal with:
 * 1. Login view + Full inline error validation & Toast feedback
 * 2. 3-step Forgot & Reset password flow:
 *    - Step 1: Input email to request OTP
 *    - Step 2: Input 6-digit OTP + New Password & Confirm Password (with strength indicator)
 *    - Step 3: Success announcement view with direct button back to Login
 */
const LoginModal = ({ onClose, onLogin, onOpenRegister, addToast }) => {
  // Views: 'login' | 'forgot' | 'reset' | 'reset-success'
  const [view, setView] = useState('login');

  // Login form state
  const [email, setEmail] = useState('minh@example.com');
  const [password, setPassword] = useState('password');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Forgot password flow state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Reset password flow state
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [resetErrors, setResetErrors] = useState({});
  const [resetLoading, setResetLoading] = useState(false);

  // OTP inputs refs
  const otpRefs = Array.from({ length: 6 }, () => useRef(null));

  useEffect(() => {
    if (view !== 'reset' || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [view, countdown]);

  /* ─────────────────────────────────────────────
     LOGIN SUBMISSION & VALIDATION
  ───────────────────────────────────────────── */
  const validateLoginForm = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email.trim()) {
      setEmailError('Vui lòng nhập địa chỉ email');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Địa chỉ email không đúng định dạng');
      valid = false;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu tối thiểu 6 ký tự');
      valid = false;
    }

    return valid;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setLoading(true);
    setGeneralError('');

    setTimeout(() => {
      // Find matching user in USERS mock database
      const foundUser = USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      // If user exists and password is valid (for demo: accept 'password' or any non-empty >= 6 chars)
      if (foundUser && password.length >= 6) {
        onLogin(foundUser);
        setLoading(false);
        onClose();
      } else {
        setLoading(false);
        setGeneralError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại!');
        setEmailError('Thông tin đăng nhập không hợp lệ');
        setPasswordError('Thông tin đăng nhập không hợp lệ');
        if (addToast) {
          addToast('⚠️ Đăng nhập thất bại: Email hoặc mật khẩu không chính xác!', 'error', 4000);
        }
      }
    }, 900);
  };

  /* ─────────────────────────────────────────────
     FORGOT PASSWORD STEP 1: REQUEST OTP
  ───────────────────────────────────────────── */
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotEmailError('');

    if (!forgotEmail.trim()) {
      setForgotEmailError('Vui lòng nhập email tài khoản của bạn');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      setForgotEmailError('Email không hợp lệ');
      return;
    }

    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setView('reset');
      setCountdown(60);
      setOtp('');
      if (addToast) {
        addToast(`Mã xác thực OTP đã được gửi đến ${forgotEmail}`, 'info');
      }
    }, 900);
  };

  /* ─────────────────────────────────────────────
     RESET PASSWORD STEP 2: VERIFY OTP & UPDATE PWD
  ───────────────────────────────────────────── */
  const handleOtpChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = (otp.padEnd(6, ' ')).split('');
    next[idx] = char;
    setOtp(next.join('').trimEnd());
    setOtpError(false);
    if (char && idx < 5) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const next = [...otp.split('')];
        next[idx] = '';
        setOtp(next.join(''));
      } else if (idx > 0) {
        otpRefs[idx - 1].current?.focus();
      }
    }
  };

  const validateResetForm = () => {
    const errs = {};
    if (otp.length < 6) errs.otp = 'Vui lòng nhập đủ 6 chữ số OTP';
    if (newPassword.length < 8) errs.newPassword = 'Mật khẩu mới tối thiểu 8 ký tự';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    setResetErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!validateResetForm()) return;

    setResetLoading(true);
    setTimeout(() => {
      // Demo: OTP 123456 or any 6 digits
      if (otp === '123456' || otp.length === 6) {
        setResetLoading(false);
        setView('reset-success');
        if (addToast) {
          addToast('🎉 Đặt lại mật khẩu thành công!', 'success');
        }
      } else {
        setResetLoading(false);
        setOtpError(true);
        if (addToast) {
          addToast('Mã OTP không đúng, vui lòng thử lại!', 'error');
        }
      }
    }, 1000);
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 460 }}>
        <div className={styles.modalInner}>
          {/* Close button */}
          <button className={`btn btn-icon btn-ghost ${styles.closeBtn}`} onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <Logo size="lg" />
          </div>

          {/* =========================================================
              VIEW 1: ĐĂNG NHẬP (LOGIN)
             ========================================================= */}
          {view === 'login' && (
            <>
              <h2 className={styles.title}>Chào mừng trở lại</h2>
              <p className={styles.subtitle}>Đăng nhập để khám phá và sưu tầm nghệ thuật độc bản</p>

              {/* General Login Error Alert */}
              {generalError && (
                <div className={styles.loginAlert}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{generalError}</span>
                </div>
              )}

              {/* Quick Demo Switcher */}
              {/* <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-gold)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  ⚡ Đăng nhập nhanh kiểm thử:
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px 8px' }}
                    onClick={() => {
                      setEmail('tran@example.com');
                      setPassword('password');
                      setEmailError('');
                      setPasswordError('');
                      setGeneralError('');
                    }}
                  >
                    🎨 Họa sĩ Dương
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px 8px' }}
                    onClick={() => {
                      setEmail('minh@example.com');
                      setPassword('password');
                      setEmailError('');
                      setPasswordError('');
                      setGeneralError('');
                    }}
                  >
                    💼 Collector Khôi
                  </button>
                </div>
              </div> */}

              <form onSubmit={handleLoginSubmit} className={styles.form} noValidate>
                {/* Email Input */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    className={`input ${emailError ? styles.inputError : ''}`}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    disabled={loading}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                      if (generalError) setGeneralError('');
                    }}
                    required
                  />
                  {emailError && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {emailError}
                    </span>
                  )}
                </div>

                {/* Password Input */}
                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className={styles.label} htmlFor="login-password">Mật khẩu</label>
                    <button
                      type="button"
                      id="login-forgot-pwd-btn"
                      className={styles.switchBtn}
                      style={{ fontWeight: 400, textDecoration: 'none', opacity: 0.8 }}
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotEmailError('');
                        setView('forgot');
                      }}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className={styles.pwdWrap}>
                    <input
                      id="login-password"
                      className={`input ${passwordError ? styles.inputError : ''}`}
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      disabled={loading}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                        if (generalError) setGeneralError('');
                      }}
                      required
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPwd(!showPwd)}
                      tabIndex={-1}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {passwordError}
                    </span>
                  )}
                </div>

                {/* Submit button with loading state */}
                <button
                  id="login-submit"
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className={styles.spinner} /> Đang đăng nhập...</>
                  ) : 'Đăng nhập'}
                </button>
                {/* Quick-select Demo Profiles */}
                {/* <div style={{ marginTop: 14 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>⚡ CHỌN NHANH HỒ SƠ ĐĂNG KÝ MẪU:</span>
                    <span>Click để tự điền</span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 6
                  }}>
                    {USERS.map(u => (
                      <button
                        key={u.user_id}
                        type="button"
                        onClick={() => {
                          setEmail(u.email);
                          setPassword('password123');
                          setEmailError('');
                          setPasswordError('');
                          setGeneralError('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 8px',
                          background: email === u.email ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                          border: email === u.email ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 8,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 200ms ease',
                        }}
                      >
                        <img
                          src={u.avatar}
                          alt={u.full_name}
                          style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {u.full_name.split(' ').slice(-2).join(' ')}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: u.role === 'artist' ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
                            {u.badge_label || u.role}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div> */}
              </form>

              <div className={styles.divider} style={{ margin: '16px 0 12px' }}>
                <span>hoặc</span>
              </div>

              {/* Link to Register Modal */}
              <p className={styles.switchMode}>
                Chưa có tài khoản?{' '}
                <button
                  id="open-register"
                  type="button"
                  className={styles.switchBtn}
                  onClick={() => { onClose(); onOpenRegister?.(); }}
                >
                  Đăng ký với xác minh 4 cấp
                </button>
              </p>

              {/* <div className={styles.trustNote}>
                <Award size={12} color="var(--gold-primary)" />
                <span>Nền tảng được bảo chứng bởi cơ chế 3 lớp. Giao dịch ký quỹ an toàn tuyệt đối.</span>
              </div> */}
            </>
          )}

          {/* =========================================================
              VIEW 2: QUÊN MẬT KHẨU (FORGOT PASSWORD - BƯỚC 1)
             ========================================================= */}
          {view === 'forgot' && (
            <>
              <div className={styles.subHeader}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setView('login')}
                >
                  <ArrowLeft size={14} /> Quay lại Đăng nhập
                </button>
              </div>

              <h2 className={styles.title}>Quên mật khẩu?</h2>
              <p className={styles.subtitle}>
                Nhập địa chỉ email đăng ký tài khoản để nhận mã OTP khôi phục mật khẩu.
              </p>

              <form onSubmit={handleForgotSubmit} className={styles.form} noValidate>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="forgot-email">Email tài khoản</label>
                  <input
                    id="forgot-email"
                    className={`input ${forgotEmailError ? styles.inputError : ''}`}
                    type="email"
                    placeholder="your@email.com"
                    value={forgotEmail}
                    disabled={forgotLoading}
                    onChange={e => {
                      setForgotEmail(e.target.value);
                      if (forgotEmailError) setForgotEmailError('');
                    }}
                    required
                  />
                  {forgotEmailError && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {forgotEmailError}
                    </span>
                  )}
                </div>

                <button
                  id="forgot-submit-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? (
                    <><span className={styles.spinner} /> Đang gửi mã OTP...</>
                  ) : 'Gửi mã xác minh OTP'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <button
                  type="button"
                  className={styles.switchBtn}
                  onClick={() => setView('login')}
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </>
          )}

          {/* =========================================================
              VIEW 3: ĐẶT LẠI MẬT KHẨU (RESET PASSWORD - BƯỚC 2)
             ========================================================= */}
          {view === 'reset' && (
            <>
              <div className={styles.subHeader}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setView('forgot')}
                >
                  <ArrowLeft size={14} /> Quay lại
                </button>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setView('login')}
                >
                  Đăng nhập
                </button>
              </div>

              <h2 className={styles.title}>Đặt lại mật khẩu mới</h2>
              <p className={styles.subtitle}>
                Nhập mã OTP 6 số đã gửi tới <strong>{forgotEmail}</strong> và đặt mật khẩu mới.
              </p>

              <form onSubmit={handleResetSubmit} className={styles.form} noValidate>
                {/* OTP Input Section */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mã xác thực OTP (6 chữ số)</label>
                  <div className={styles.otpRow}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        id={`reset-otp-${i}`}
                        className={`${styles.otpBox} ${otpError ? styles.otpBoxError : ''} ${otp[i] ? styles.otpBoxFilled : ''}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[i] || ''}
                        onChange={e => handleOtpChange(e, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>
                  {otpError && (
                    <span className={styles.errorText} style={{ justifyContent: 'center' }}>
                      <AlertCircle size={12} /> Mã OTP không hợp lệ hoặc đã hết hạn
                    </span>
                  )}
                  <div className={styles.otpMeta}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Demo: nhập 123456</span>
                    <button
                      type="button"
                      className={styles.resendBtn}
                      disabled={countdown > 0}
                      onClick={() => {
                        setCountdown(60);
                        if (addToast) addToast(`Đã gửi lại mã OTP tới ${forgotEmail}!`, 'info');
                      }}
                    >
                      <RefreshCw size={11} /> {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại OTP'}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reset-new-pwd">Mật khẩu mới</label>
                  <div className={styles.pwdWrap}>
                    <input
                      id="reset-new-pwd"
                      className={`input ${resetErrors.newPassword ? styles.inputError : ''}`}
                      type={showNewPwd ? 'text' : 'password'}
                      placeholder="Tối thiểu 8 ký tự"
                      value={newPassword}
                      disabled={resetLoading}
                      onChange={e => {
                        setNewPassword(e.target.value);
                        if (resetErrors.newPassword) setResetErrors(prev => ({ ...prev, newPassword: '' }));
                      }}
                      required
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      tabIndex={-1}
                    >
                      {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  <ResetPasswordStrength pwd={newPassword} />
                  {resetErrors.newPassword && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {resetErrors.newPassword}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reset-confirm-pwd">Xác nhận mật khẩu mới</label>
                  <div className={styles.pwdWrap}>
                    <input
                      id="reset-confirm-pwd"
                      className={`input ${resetErrors.confirmPassword ? styles.inputError : ''}`}
                      type={showConfirmPwd ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      disabled={resetLoading}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (resetErrors.confirmPassword) setResetErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      required
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      tabIndex={-1}
                    >
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {resetErrors.confirmPassword && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {resetErrors.confirmPassword}
                    </span>
                  )}
                </div>

                <button
                  id="reset-submit-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <><span className={styles.spinner} /> Đang cập nhật mật khẩu...</>
                  ) : 'Xác nhận đổi mật khẩu'}
                </button>
              </form>
            </>
          )}

          {/* =========================================================
              VIEW 4: THÀNH CÔNG (SUCCESS - BƯỚC 3)
             ========================================================= */}
          {view === 'reset-success' && (
            <div className={styles.successCard}>
              <div className={styles.successIconWrap}>
                <CheckCircle2 size={36} color="var(--success)" />
              </div>

              <span className="badge" style={{ background: 'var(--success-muted)', color: 'var(--success)', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                THÀNH CÔNG
              </span>

              <h2 className={styles.title}>Đổi mật khẩu thành công!</h2>
              <p className={styles.subtitle}>
                Mật khẩu tài khoản của bạn đã được cập nhật an toàn. Bây giờ bạn có thể đăng nhập ngay với mật khẩu mới.
              </p>

              <button
                id="reset-success-login-btn"
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginTop: 12 }}
                onClick={() => {
                  setPassword('');
                  setView('login');
                }}
              >
                Quay lại đăng nhập ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** Password strength sub-component for Reset view */
const ResetPasswordStrength = ({ pwd }) => {
  const checks = [
    { label: '8+ ký tự', ok: pwd.length >= 8 },
    { label: 'Chữ hoa', ok: /[A-Z]/.test(pwd) },
    { label: 'Số', ok: /\d/.test(pwd) },
    { label: 'Ký tự đặc biệt', ok: /[!@#$%^&*]/.test(pwd) },
  ];
  const score = checks.filter(c => c.ok).length;
  const levels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];
  const colors = ['', 'var(--danger)', 'var(--warning)', '#3498DB', 'var(--success)'];

  if (!pwd) return null;
  return (
    <div className={styles.pwdStrength}>
      <div className={styles.pwdBars}>
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            className={styles.pwdBar}
            style={{ background: n <= score ? colors[score] : 'var(--border-subtle)' }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: colors[score], fontSize: '0.7rem', fontWeight: 600 }}>Độ an toàn: {levels[score]}</span>
      </div>
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

export default LoginModal;
