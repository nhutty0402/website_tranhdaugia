import React, { useState } from 'react';

const DISPUTES_DATA = {
  'DISP-001': {
    id: 'DISP-001',
    dispute_id: 'DISP-2024-009',
    artwork_title: 'Mùa Vàng Tây Bắc',
    collector_name: 'Phan Hoàng Yến Trang',
    escrow_amount_formatted: '28.500.000 đ',
    issue_type: 'Hư hỏng vận chuyển',
    issue_badge_class: 'bg-rose-50 text-rose-700 border-rose-200',
    thumb: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150',
    actual_image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400',
    original_image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=400',
    ai_reason: 'Nứt vỡ khung do vận chuyển, không có lỗi từ phía họa sĩ.',
    ai_solution: 'Hoàn cọc 100% cho người mua từ quỹ Escrow và kích hoạt bảo hiểm.'
  },
  'DISP-002': {
    id: 'DISP-002',
    dispute_id: 'DISP-2024-004',
    artwork_title: 'Phố Cổ Mưa Ngâu',
    collector_name: 'Lê Thùy Chi',
    escrow_amount_formatted: '42.000.000 đ',
    issue_type: 'Sai lệch màu sắc',
    issue_badge_class: 'bg-amber-50 text-amber-700 border-amber-200',
    thumb: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=150',
    actual_image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400',
    original_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400',
    ai_reason: 'Ánh sáng phòng trưng bày 6500K làm tranh ngả xám, khác với ánh sáng chuẩn 3000K của bảo tàng.',
    ai_solution: 'Bác bỏ khiếu nại, giữ nguyên lệnh giải ngân 42.000.000 đ cho họa sĩ và tặng gói đèn 3000K cho người mua.'
  }
};

export function XuLyKhieuNai({ addToast }) {
  const [activeId, setActiveId] = useState('DISP-001');
  const [resolvedStatus, setResolvedStatus] = useState({});

  const curr = DISPUTES_DATA[activeId] || DISPUTES_DATA['DISP-001'];
  const isResolved = resolvedStatus[activeId];

  const handleApproveRefund = () => {
    setResolvedStatus(prev => ({ ...prev, [activeId]: 'approved' }));
    if (typeof addToast === 'function') {
      addToast(`⚡ Đã chấp thuận đề xuất AI: Hoàn cọc 100% (${curr?.escrow_amount_formatted || ''}) cho khách hàng ca #${curr?.dispute_id || ''}!`, 'success');
    }
  };

  const handleRejectDispute = () => {
    setResolvedStatus(prev => ({ ...prev, [activeId]: 'rejected' }));
    if (typeof addToast === 'function') {
      addToast(`✓ Đã bác bỏ khiếu nại ca #${curr?.dispute_id || ''} & khởi tạo giải ngân ${curr?.escrow_amount_formatted || ''} cho Họa sĩ!`, 'info');
    }
  };

  return (
    <div className="flex-1 min-w-0 bg-slate-50 min-h-screen overflow-y-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-4">
      {/* CỘT TRÁI: DANH SÁCH RÚT GỌN */}
      <div className="w-full lg:w-80 bg-white rounded-xl border border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-xs h-fit lg:max-h-[calc(100vh-8rem)]">
        <div className="p-3 border-b border-slate-200 font-bold text-slate-800 text-sm flex items-center justify-between bg-slate-50/50">
          <span>Danh sách khiếu nại (2)</span>
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Escrow Phán quyết
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* Card mẫu 1 */}
          <div
            onClick={() => setActiveId('DISP-001')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${activeId === 'DISP-001' ? 'border-amber-500 bg-amber-50/40 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
          >
            <div className="flex gap-2.5 items-center">
              <img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150" alt="Mùa Vàng Tây Bắc" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">Mùa Vàng Tây Bắc</p>
                <p className="text-[11px] text-slate-500 font-mono">#DISP-2024-009</p>
                <p className="text-xs font-semibold text-emerald-700">28.500.000 đ</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-rose-50 text-rose-700 rounded border border-rose-200">
                Hư hỏng vận chuyển
              </span>
              {resolvedStatus['DISP-001'] && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✓ Đã phán quyết
                </span>
              )}
            </div>
          </div>

          {/* Card mẫu 2 */}
          <div
            onClick={() => setActiveId('DISP-002')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${activeId === 'DISP-002' ? 'border-amber-500 bg-amber-50/40 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
          >
            <div className="flex gap-2.5 items-center">
              <img src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=150" alt="Phố Cổ Mưa Ngâu" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">Phố Cổ Mưa Ngâu</p>
                <p className="text-[11px] text-slate-500 font-mono">#DISP-2024-004</p>
                <p className="text-xs font-semibold text-emerald-700">42.000.000 đ</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 rounded border border-amber-200">
                Sai lệch màu sắc
              </span>
              {resolvedStatus['DISP-002'] && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✓ Đã phán quyết
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: KHÔNG GIAN PHÁN QUYẾT */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200 p-5 flex flex-col space-y-4 shadow-xs">
        {/* Tiêu đề & Ký quỹ */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">{curr.artwork_title}</h2>
            <p className="text-xs text-slate-500">Mã ca: #{curr.dispute_id} • Người mua: {curr.collector_name}</p>
          </div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-700">
            Ký quỹ: {curr.escrow_amount_formatted}
          </div>
        </div>

        {/* Khung đối chiếu 2 ảnh */}
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2">Ảnh đối chứng hiện vật</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-lg p-2 text-center bg-slate-50">
              <img src={curr.actual_image} alt="Ảnh thực tế nhận hàng" className="w-full h-44 object-cover rounded mb-1 border border-slate-200" />
              <span className="text-[11px] text-slate-500">Ảnh thực tế nhận hàng</span>
            </div>
            <div className="border border-slate-200 rounded-lg p-2 text-center bg-slate-50">
              <img src={curr.original_image} alt="Ảnh gốc của họa sĩ" className="w-full h-44 object-cover rounded mb-1 border border-slate-200" />
              <span className="text-[11px] text-slate-500">Ảnh gốc của họa sĩ</span>
            </div>
          </div>
        </div>

        {/* Hộp phân tích AI */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs space-y-1">
          <p className="font-bold text-indigo-900">Trợ lý AI Đề xuất (Độ tin cậy: 99.1%)</p>
          <p className="text-slate-700">- Nguyên nhân: {curr.ai_reason}</p>
          <p className="text-slate-700 font-semibold">- Giải pháp: {curr.ai_solution}</p>
        </div>

        {/* Trạng thái đã giải quyết hoặc Nút hành động ở đáy */}
        {isResolved ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center justify-between mt-auto">
            <span>
              ✓ Đã hoàn tất phán quyết: {isResolved === 'approved' ? 'Chấp thuận hoàn cọc 100% cho khách' : 'Bác bỏ khiếu nại, giải ngân cho Họa sĩ'}
            </span>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200">HOÀN TẤT</span>
          </div>
        ) : (
          <div className="pt-2 flex flex-col sm:flex-row gap-3 mt-auto">
            <button
              type="button"
              onClick={handleApproveRefund}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Chấp thuận đề xuất AI (Hoàn tiền)
            </button>
            <button
              type="button"
              onClick={handleRejectDispute}
              className="flex-1 py-2.5 px-3 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Bác bỏ khiếu nại (Giải ngân cho Họa sĩ)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default XuLyKhieuNai;
