import React from 'react';
import { BadgeCheck, Shield, Brush, Phone } from 'lucide-react';

const LEVEL_CONFIG = {
  0: { label: 'L0 – Email', color: '#9CA3AF', icon: null,        bg: 'rgba(156,163,175,0.1)',  border: 'rgba(156,163,175,0.25)' },
  1: { label: 'L1 – SĐT',  color: '#60B4F6', icon: Phone,       bg: 'rgba(96,180,246,0.1)',   border: 'rgba(96,180,246,0.3)'  },
  2: { label: 'L2 – eKYC', color: '#2ECC71', icon: Shield,      bg: 'rgba(46,204,113,0.1)',   border: 'rgba(46,204,113,0.3)'  },
  3: { label: 'L3 – Họa sĩ', color: '#A78BFA', icon: Brush,    bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.3)' },
};

/**
 * @param {number}  level   0-3
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} showLabel
 */
const VerificationBadge = ({ level = 0, size = 'md', showLabel = true }) => {
  const cfg = LEVEL_CONFIG[Math.min(level, 3)] || LEVEL_CONFIG[0];
  const Icon = cfg.icon;

  const iconSize  = size === 'sm' ? 10 : size === 'lg' ? 16 : 12;
  const fontSize  = size === 'sm' ? '0.6rem' : size === 'lg' ? '0.85rem' : '0.7rem';
  const padding   = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 14px' : '3px 10px';
  const radius    = size === 'lg' ? 24 : 20;

  return (
    <span
      title={`Cấp xác minh ${cfg.label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding,
        borderRadius: radius,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}
    >
      {Icon ? <Icon size={iconSize} /> : <BadgeCheck size={iconSize} />}
      {showLabel && cfg.label}
    </span>
  );
};

/**
 * Stacked badges showing all achieved levels
 */
export const VerificationStack = ({ level = 0, size = 'sm' }) => (
  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
    {Array.from({ length: Math.min(level + 1, 4) }, (_, i) => (
      <VerificationBadge key={i} level={i} size={size} showLabel={false} />
    ))}
  </div>
);

export default VerificationBadge;
