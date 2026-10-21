import React, { useState } from 'react';
import { Shield, ChevronRight, X } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import styles from './KYCBanner.module.css';

/**
 * Shows an inline banner prompting the user to upgrade their KYC level.
 * Appears on pages requiring higher permissions.
 */
const KYCBanner = ({ currentLevel = 0, requiredLevel = 2, onUpgrade, onDismiss }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || currentLevel >= requiredLevel) return null;

  const MESSAGES = {
    1: {
      title: 'Xác minh số điện thoại để theo dõi đấu giá',
      desc: 'Hoàn tất cấp L1 – chỉ mất 1 phút với OTP SMS.',
      color: '#60B4F6',
      bg: 'rgba(96,180,246,0.06)',
      border: 'rgba(96,180,246,0.2)',
    },
    2: {
      title: 'Hoàn tất eKYC để đặt giá không giới hạn',
      desc: 'Chụp CCCD 2 mặt + selfie liveness – quy trình tự động, kết quả trong vài phút.',
      color: '#2ECC71',
      bg: 'rgba(46,204,113,0.06)',
      border: 'rgba(46,204,113,0.2)',
    },
    3: {
      title: 'Hoàn tất hồ sơ Họa sĩ để đăng bán tác phẩm',
      desc: 'Nộp portfolio và hồ sơ cho Ban Curator duyệt – thường trong 3–5 ngày làm việc.',
      color: '#A78BFA',
      bg: 'rgba(167,139,250,0.06)',
      border: 'rgba(167,139,250,0.2)',
    },
  };

  const cfg = MESSAGES[requiredLevel] || MESSAGES[2];

  return (
    <div
      className={styles.banner}
      style={{ background: cfg.bg, borderColor: cfg.border }}
      role="status"
    >
      <Shield size={16} color={cfg.color} style={{ flexShrink: 0 }} />
      <div className={styles.content}>
        <p className={styles.title} style={{ color: cfg.color }}>{cfg.title}</p>
        <p className={styles.desc}>{cfg.desc}</p>
        <div className={styles.levels}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cấp hiện tại:</span>
          <VerificationBadge level={currentLevel} size="sm" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→ Cần đạt:</span>
          <VerificationBadge level={requiredLevel} size="sm" />
        </div>
      </div>
      <button
        id={`kyc-upgrade-l${requiredLevel}`}
        className="btn btn-sm"
        style={{
          background: cfg.color,
          color: '#0D0D0F',
          fontWeight: 700,
          flexShrink: 0,
          border: 'none',
        }}
        onClick={onUpgrade}
      >
        Nâng cấp ngay <ChevronRight size={14} />
      </button>
      <button
        className={styles.dismiss}
        onClick={() => { setDismissed(true); onDismiss?.(); }}
        aria-label="Đóng"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default KYCBanner;
