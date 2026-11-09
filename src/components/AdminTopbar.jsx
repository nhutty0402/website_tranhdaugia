import React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import styles from '../pages/QuanTriVienPage.module.css';

export default function AdminTopbar({
  isMobileNavOpen,
  setIsMobileNavOpen,
  currentTimeStr,
  activeTab = 'overview'
}) {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'overview':
        return 'Tổng quan & Chỉ số Vận hành';
      case 'artists':
        return 'Kiểm duyệt Họa sĩ';
      case 'artworks':
        return 'Thẩm định Tác phẩm';
      case 'escrow':
        return 'Ký quỹ & Giải ngân';
      case 'disputes':
        return 'Xử lý Khiếu nại';
      default:
        return 'Tổng quan & Chỉ số Vận hành';
    }
  };

  return (
    <header className={`${styles.topbar || ''} flex items-center justify-between w-full h-14 px-3 sm:px-6 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs shrink-0`}>
      {/* Bên trái: Breadcrumb điều hướng trang */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          className={`${styles.mobileMenuBtn || ''} lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 shrink-0`}
          onClick={() => setIsMobileNavOpen?.(!isMobileNavOpen)}
          aria-label="Mở menu điều hướng"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb điều hướng */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 font-medium min-w-0">
          <span className="text-slate-400 font-normal shrink-0">Ban Quản trị</span>
          <ChevronRight size={12} className="text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-[120px] sm:max-w-none">
            {getTabTitle(activeTab)}
          </span>
        </div>
      </div>

      {/* Bên phải: Đồng hồ hiển thị thời gian thực nhỏ gọn với nhãn trạng thái xanh "Hệ thống trực tuyến" */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[11px] sm:text-xs font-mono font-medium text-slate-700 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse shrink-0" />
          <span className="hidden sm:inline text-slate-500 font-sans text-[11px] font-semibold">Hệ thống trực tuyến •</span>
          <span className="font-semibold text-slate-800">{currentTimeStr || '00:40:52 • 05/11/2026'}</span>
        </div>
      </div>
    </header>
  );
}

export { AdminTopbar };

