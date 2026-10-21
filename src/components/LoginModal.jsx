import React, { useState } from 'react';
import { X, Palette, Eye, EyeOff, Shield, Award, BadgeCheck } from 'lucide-react';
import { USERS } from '../data/mockData';
import styles from './LoginModal.module.css';

const LoginModal = ({ onClose, onLogin, onOpenRegister }) => {
  const [mode] = useState('login'); // login only – register via RegisterModal
  const [email, setEmail] = useState('minh@example.com');
  const [password, setPassword] = useState('password');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.email === email) || USERS[0];
      onLogin(user);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 460 }}>
        <div className={styles.modalInner}>
          {/* Close */}
          <button className={`btn btn-icon btn-ghost ${styles.closeBtn}`} onClick={onClose}>
            <X size={18} />
          </button>

          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}><Palette size={22} color="#D4AF37" /></div>
            <span className={styles.logoText}>ARTISAN HUB</span>
          </div>

          <h2 className={styles.title}>Chào mừng trở lại</h2>
          <p className={styles.subtitle}>Đăng nhập để khám phá và sưu tầm nghệ thuật độc bản</p>

          {/* Quick login hint */}
          {/* {mode === 'login' && (
            <div className={styles.demoHint}>
              <Shield size={12} color="var(--gold-primary)" />
              <span>Demo: <strong>minh@example.com</strong> / bất kỳ mật khẩu nào</span>
            </div>
          )} */}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label} htmlFor="login-password">Mật khẩu</label>
                <button type="button" className={styles.switchBtn} style={{ fontWeight: 400, textDecoration: 'none', opacity: 0.7 }}>
                  Quên mật khẩu?
                </button>
              </div>
              <div className={styles.pwdWrap}>
                <input
                  id="login-password"
                  className="input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              disabled={loading}
            >
              {loading ? (
                <><span className={styles.spinner} /> Đang xử lý...</>
              ) : 'Đăng nhập'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>hoặc tiếp tục với</span>
          </div>

          {/* <div className={styles.socialBtns}>
            <button className="btn btn-ghost" style={{ flex: 1 }} id="google-login">
              <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="" /> Google
            </button>
            <button className="btn btn-ghost" style={{ flex: 1 }} id="facebook-login">
              <span style={{ color: '#1877F2' }}>f</span> Facebook
            </button>
          </div> */}

          <p className={styles.switchMode}>
            Chưa có tài khoản?{' '}
            <button
              id="open-register"
              className={styles.switchBtn}
              onClick={() => { onClose(); onOpenRegister?.(); }}
            >
              Đăng ký với xác minh 4 cấp
            </button>
          </p>

          <div className={styles.trustNote}>
            <Award size={12} color="var(--gold-primary)" />
            <span>Nền tảng được bảo vệ bởi cơ chế 3 lớp. Thông tin của bạn an toàn tuyệt đối.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
