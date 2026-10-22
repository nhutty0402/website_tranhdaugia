import React from 'react';
import { CheckCircle, Trophy, AlertTriangle, Info, X } from 'lucide-react';

const ToastIcon = ({ type }) => {
  const config = {
    gold: { icon: Trophy, color: '#D4AF37', bg: 'rgba(212,175,55,0.15)' },
    success: { icon: CheckCircle, color: '#2ECC71', bg: 'rgba(46,204,113,0.15)' },
    warning: { icon: AlertTriangle, color: '#F39C12', bg: 'rgba(243,156,18,0.15)' },
    danger: { icon: AlertTriangle, color: '#FF4757', bg: 'rgba(255,71,87,0.2)' },
    info: { icon: Info, color: '#3498DB', bg: 'rgba(52,152,219,0.15)' },
  };
  const { icon: Icon, color, bg } = config[type] || config.gold;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={18} color={color} />
    </div>
  );
};

const Toast = ({ toast, onRemove }) => (
  <div className="toast" role="alert">
    <ToastIcon type={toast.type} />
    <div style={{ flex: 1 }}>
      <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
        {toast.message}
      </p>
    </div>
    <button
      onClick={() => onRemove(toast.id)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-muted)', padding: 4,
        display: 'flex', alignItems: 'center',
      }}
    >
      <X size={14} />
    </button>
  </div>
);

const ToastContainer = ({ toasts, onRemove }) => (
  <div className="toast-container">
    {toasts.map(toast => (
      <Toast key={toast.id} toast={toast} onRemove={onRemove} />
    ))}
  </div>
);

export default ToastContainer;
