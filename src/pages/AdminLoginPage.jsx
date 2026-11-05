import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, Mail, Key, ShieldAlert, ArrowRight,
  RefreshCw, CheckCircle2, ArrowLeft, Cpu, UserCheck
} from 'lucide-react';
import styles from './AdminLoginPage.module.css';

const DEFAULT_DEMO_ACCOUNT = {
  admin_id: 'QTV-8942',
  email: 'quantri@artisanhub.vn',
  full_name: 'GS. TS. Trần Viết Cường',
  role: 'MASTER_CURATOR',
  role_title: 'Chủ tịch Hội đồng Giám sát & Quản trị viên Trưởng',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  login_at: new Date().toISOString()
};

export default function AdminLoginPage({ addToast }) {
  const navigate = useNavigate();

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCodeBadge, setActiveCodeBadge] = useState('889-214');
  const [existingSession, setExistingSession] = useState(null);

  // Check if session already exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('artisan_admin_session');
      if (saved) {
        setExistingSession(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Quick 1-click fill test credentials
  const handleQuickFill = () => {
    setEmailOrId('quantri@artisanhub.vn');
    setPassword('QuanTriVien@2026');
    setTwoFactorCode(activeCodeBadge.replace('-', ''));
    if (addToast) {
      addToast('✦ Đã tự động điền tài khoản Quản trị viên mẫu an toàn.', 'info', 2500);
    }
  };

  const handleRefresh2FA = () => {
    const random6 = Math.floor(100000 + Math.random() * 900000).toString();
    const formatted = `${random6.slice(0, 3)}-${random6.slice(3)}`;
    setActiveCodeBadge(formatted);
    if (addToast) {
      addToast(`Mã 2FA bảo mật mới: ${formatted}`, 'gold', 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailOrId.trim()) {
      addToast?.('Vui lòng nhập Mã định danh hoặc Email quản trị viên!', 'warning');
      return;
    }
    if (!password) {
      addToast?.('Vui lòng nhập mật khẩu quản trị viên!', 'warning');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const sessionData = {
        ...DEFAULT_DEMO_ACCOUNT,
        input_credential: emailOrId.trim(),
        login_at: new Date().toISOString()
      };
      try {
        localStorage.setItem('artisan_admin_session', JSON.stringify(sessionData));
      } catch (err) {
        console.error(err);
      }

      addToast?.('✦ Xác thực Quản trị viên thành công! Chào mừng trở lại phiên trực ban.', 'success', 3500);
      navigate('/admin');
    }, 700);
  };

  const handleLogoutExisting = () => {
    localStorage.removeItem('artisan_admin_session');
    setExistingSession(null);
    addToast?.('Đã hủy phiên làm việc cũ. Vui lòng đăng nhập lại.', 'info');
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.bgAura} />
      <div className={styles.gridPattern} />

      <div className={styles.loginCard}>
        {/* Header with Emblem */}
        <div className={styles.cardHeader}>
          <div className={styles.logoBadge}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <span className={styles.portalTag}>
              <Cpu size={12} /> ARTISAN HUB MANAGEMENT PORTAL
            </span>
            <h1 className={styles.portalTitle}>Đăng Nhập Quản Trị Viên</h1>
            <p className={styles.portalDesc}>
              Khu vực bảo mật cao cấp dành riêng cho Hội đồng Giám sát và Ban Quản trị viên vận hành sàn đấu giá.
            </p>
          </div>
        </div>

        {/* Existing active session prompt if available */}
        {existingSession && (
          <div style={{
            background: 'rgba(197, 160, 89, 0.08)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {existingSession.full_name} ({existingSession.admin_id})
                </p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8' }}>
                  Phiên trực ban đang hoạt động
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={{
                  background: 'var(--gold-primary, #C5A059)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#0D0D0F',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Vào Bảng Quản Trị →
              </button>
              <button
                type="button"
                onClick={handleLogoutExisting}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 6,
                  color: '#CBD5E1',
                  fontSize: '0.72rem',
                  padding: '5px 8px',
                  cursor: 'pointer'
                }}
              >
                Đổi tài khoản
              </button>
            </div>
          </div>
        )}

        {/* Main Secure Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Field 1: Admin ID or Email */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.formLabel}>Mã định danh hoặc Email quản trị</label>
              <span className={styles.labelHelper}>Ví dụ: QTV-8942</span>
            </div>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.formInput}
                placeholder="quantri@artisanhub.vn hoặc QTV-..."
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.formLabel}>Mật khẩu bảo mật</label>
              <span className={styles.labelHelper}>Tối thiểu 8 ký tự</span>
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type="password"
                className={styles.formInput}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* Field 3: 2FA Security Token */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.formLabel}>Mã xác thực 2FA nội bộ</label>
              <div className={styles.twoFaBox}>
                <span className={styles.codeBadge} onClick={handleRefresh2FA} title="Bấm để tạo mã mới">
                  <RefreshCw size={11} /> Token: {activeCodeBadge}
                </span>
              </div>
            </div>
            <div className={styles.inputWrapper}>
              <Key size={16} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.formInput}
                placeholder="Nhập 6 số xác thực (hoặc token trên)"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                maxLength={7}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className={styles.securityNotice}>
            <ShieldAlert size={16} color="#C5A059" style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Mọi tác vụ truy cập và phán quyết thẩm định đều được giám sát thời gian thực bởi <strong>Trợ lý AI Ops</strong> và ghi sổ cái bất biến Audit Log SHA-256.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="spin" />
                Đang xác thực thẻ phân quyền...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Đăng nhập Hệ thống Quản trị
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Quick Demo Fill Button */}
          <button
            type="button"
            className={styles.quickDemoBtn}
            onClick={handleQuickFill}
          >
            <UserCheck size={14} color="#C5A059" />
            ⚡ Điền nhanh tài khoản Quản trị viên mẫu (GS. TS. Trần Viết Cường)
          </button>
        </form>

        {/* Back Link to Customer Art Marketplace */}
        <div className={styles.backLinkRow}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={14} />
            Quay lại Cổng Khách hàng & Triển lãm công chúng
          </Link>
        </div>

        {/* Security Footnote */}
        <div className={styles.securityFootnote}>
          <span className={styles.footTag}>
            <ShieldCheck size={12} color="#10B981" /> ISO/IEC 27001
          </span>
          <span className={styles.footTag}>
            Mã hóa SSL 256-Bit
          </span>
          <span className={styles.footTag}>
            Bảo mật cấp Doanh nghiệp
          </span>
        </div>
      </div>
    </div>
  );
}

