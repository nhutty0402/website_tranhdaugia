import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Clock,
  Eye, Check, X, Search, DollarSign,
  Palette, Award, Building2, ExternalLink, LogOut,
  Cpu, Sparkles, Bell, LayoutDashboard, UserCheck,
  ChevronRight, Zap, Menu, Gavel, ShieldAlert,
  ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import styles from './QuanTriVienPage.module.css';
import AdminTopbar from '../components/AdminTopbar';
import XuLyKhieuNai, { XuLyKhieuNai as XuLyKhieuNaiNamed } from '../components/XuLyKhieuNai';

const DisputeView = XuLyKhieuNai || XuLyKhieuNaiNamed;

// ============================================================================
// DỮ LIỆU MÔ PHỎNG (MOCK DATA) TÍCH HỢP AI COPILOT
// ============================================================================

export const INITIAL_PENDING_ARTISTS = [
  {
    id: 'art_reg_001',
    full_name: 'Trịnh Hoài Phương',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    art_name: 'Hoài Phương Studio',
    email: 'hoaiphuong.art@gmail.com',
    phone: '0912 345 678',
    registered_at: '10 phút trước',
    id_card: '001095008924',
    id_card_front: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    id_card_back: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    specialty: 'Sơn dầu đắp nổi & Màu khoáng tự nhiên',
    experience_years: 9,
    academy: 'Đại học Mỹ thuật Công nghiệp Hà Nội',
    association: 'Hội Mỹ thuật Hà Nội (Hội viên chính thức)',
    portfolio_url: 'https://hoaiphuong-art.vn/portfolio',
    bio: 'Sáng tác tập trung vào đề tài thiên nhiên Tây Bắc và chất cảm phù sa đồng bằng Bắc Bộ. Đã có 2 triển lãm nhóm tại Bảo tàng Mỹ thuật Việt Nam.',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    reject_reason: '',
    ai_analysis: {
      cccd_match_rate: '99.4%',
      reputation_label: 'Hồ sơ uy tín cao • Cấp L3 Master',
      trust_score: 100,
      risk_label: 'Rủi ro cực thấp (0.6%)',
      summary: 'Dữ liệu căn cước công dân gắn chip khớp 100% cơ sở dữ liệu dân cư. Đã xác thực tư cách hội viên Hội Mỹ thuật Hà Nội từ năm 2018.',
      checklist: [
        { title: 'Đối soát Căn cước công dân gắn chip', status: 'passed', note: 'Trùng khớp 99.4% ảnh chân dung và số định danh quốc gia' },
        { title: 'Nhận diện sinh trắc học khuôn mặt', status: 'passed', note: 'Độ tương đồng 99.1% giữa ảnh selfie và ảnh thẻ căn cước' },
        { title: 'Xác minh chứng chỉ nghề nghiệp', status: 'passed', note: 'Hội viên chính thức Hội Mỹ thuật Hà Nội (Mã thẻ: HMT-HN-2018-042)' },
        { title: 'Lịch sử nợ xấu & Tranh chấp pháp lý', status: 'passed', note: 'Không có tiền sử vi phạm bản quyền hay tranh chấp tài chính' }
      ]
    }
  },
  {
    id: 'art_reg_002',
    full_name: 'Lâm Quốc Hùng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    art_name: 'Hùng Sơn Mài',
    email: 'quochung.lacquer@gmail.com',
    phone: '0988 765 432',
    registered_at: '2 giờ trước',
    id_card: '079088015672',
    id_card_front: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    id_card_back: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    specialty: 'Sơn mài truyền thống 9 lớp son & Dát bạc quỳ',
    experience_years: 14,
    academy: 'Làng nghề mỹ nghệ sơn mài Hạ Thái & ĐH Mỹ thuật TP.HCM',
    association: 'Hội Mỹ nghệ Kim hoàn Đá quý Việt Nam',
    portfolio_url: 'https://behance.net/quochunglacquer',
    bio: 'Nghệ nhân thực hành kỹ thuật mài son then và gắn vỏ trứng cổ truyền. Cam kết 100% nguyên liệu tự nhiên không pha hóa chất công nghiệp.',
    status: 'pending',
    reject_reason: '',
    ai_analysis: {
      cccd_match_rate: '99.1%',
      reputation_label: 'Nghệ nhân ưu tú • Làng nghề Hạ Thái',
      trust_score: 98,
      risk_label: 'Rủi ro rất thấp (0.9%)',
      summary: 'Chứng chỉ nghệ nhân làng nghề Hạ Thái hợp lệ. Đã xác minh địa chỉ xưởng vẽ thực tế tại Thường Tín, Hà Nội.',
      checklist: [
        { title: 'Đối soát Căn cước công dân gắn chip', status: 'passed', note: 'Trùng khớp 99.1% dữ liệu định danh' },
        { title: 'Nhận diện sinh trắc học khuôn mặt', status: 'passed', note: 'Trùng khớp 98.7% góc chụp chính diện' },
        { title: 'Xác minh chứng chỉ nghệ nhân sơn mài', status: 'passed', note: 'Bằng nghệ nhân do Hiệp hội Làng nghề Việt Nam cấp' },
        { title: 'Lịch sử tín nhiệm kinh doanh nghệ thuật', status: 'passed', note: 'Điểm tín dụng CIC Hạng 1, 0 khiếu nại chất lượng' }
      ]
    }
  },
  {
    id: 'art_reg_003',
    full_name: 'Vũ Đan Thanh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    art_name: 'Thanh Silk Art',
    email: 'danthanh.art@gmail.com',
    phone: '0903 112 233',
    registered_at: 'Hôm qua, 16:30',
    id_card: '031092004118',
    id_card_front: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    id_card_back: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    specialty: 'Tranh lụa tơ tằm & Thủy mặc trên giấy dó',
    experience_years: 6,
    academy: 'Thạc sĩ Hội họa – ĐH Mỹ thuật Việt Nam',
    association: 'CLB Họa sĩ Trẻ Việt Nam',
    portfolio_url: 'https://danthanh-studio.art',
    bio: 'Nghiên cứu kỹ thuật nhuộm màu khoáng trên lụa dệt thủ công làng Vạn Phúc. Từng đạt giải Khuyến khích Festival Mỹ thuật Trẻ Toàn quốc 2022.',
    status: 'pending',
    reject_reason: '',
    ai_analysis: {
      cccd_match_rate: '88.5%',
      reputation_label: 'Họa sĩ triển vọng • Cần đối chiếu thêm',
      trust_score: 85,
      risk_label: 'Rủi ro trung bình (Cần giám tuyển soi)',
      summary: 'Ảnh căn cước chụp hơi mờ góc chip điện tử. Khuyến nghị Quản trị viên đối chiếu thêm văn bằng thạc sĩ gốc.',
      checklist: [
        { title: 'Đối soát Căn cước công dân gắn chip', status: 'warning', note: 'Ảnh mặt sau bị chói sáng, độ khớp đạt 88.5%' },
        { title: 'Nhận diện sinh trắc học khuôn mặt', status: 'passed', note: 'Trùng khớp 95.2% ảnh thẻ sinh viên cao học' },
        { title: 'Xác minh hồ sơ triển lãm Festival 2022', status: 'passed', note: 'Có tên trong danh mục giải thưởng chính thức' },
        { title: 'Kiểm tra liên kết portfolio', status: 'passed', note: 'Trang cá nhân hoạt động liên tục 4 năm' }
      ]
    }
  }
];

// Dữ liệu phân tích vệt cọ vi mô độc bản phục vụ Kính lúp & Thẩm định chuyên sâu
export const ARTWORK_MACRO_TEXTURES = {
  artw_queue_001: {
    macro: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=85',
    macro_name: 'Vệt sơn dầu đắp nổi Impasto 3D & Sớ toan Linen',
    zoom_hint: 'Phát hiện độ nổi vệt dao đắp 4.8mm • Không có điểm hạt in lưới (Halftone Free)'
  },
  artw_queue_002: {
    macro: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=85',
    macro_name: 'Bề mặt sơn mài 9 lớp son & Vàng quỳ 24K rạn tự nhiên',
    zoom_hint: 'Độ phản quang ánh kim 24K đồng nhất • Vệt mài ướt thủ công tinh xảo'
  },
  artw_queue_003: {
    macro: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=85',
    macro_name: 'Sợi tơ lụa Hà Đông dệt tay & Loang màu khoáng mực nho',
    zoom_hint: 'Cấu trúc vi sợi lụa tơ tằm tự nhiên 100% • Mực ngấm sâu qua hai mặt sợi'
  }
};

export const getArtworkDisplayImage = (artwork, mode) => {
  if (!artwork) return FALLBACK_ART_IMAGE;
  const config = ARTWORK_MACRO_TEXTURES[artwork.id];
  if (mode === 'macro') {
    return config?.macro || artwork.proof_image || artwork.image || FALLBACK_ART_IMAGE;
  }
  return artwork.image || FALLBACK_ART_IMAGE;
};

export const INITIAL_PENDING_ARTWORKS = [
  {
    id: 'artw_queue_001',
    title: 'Dấu Ấn Thời Gian',
    artist_name: 'Trần Thị Ánh Dương',
    artist_id: 'user_artist_duong',
    artist_badge: 'Cấp L3 (Master Artist)',
    medium: 'Sơn dầu đắp nổi trên toan linen nhập khẩu',
    dimensions: '90 × 120 cm',
    creation_year: '2024',
    starting_price: 28000000,
    reserve_price: 32000000,
    submitted_at: '30 phút trước',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=85',
    proof_image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=85',
    description: 'Tác phẩm độc bản khai thác tương phản giữa sắc vàng hoàng kim và đen mun. Độ dày vệt cọ nổi từ 3-8mm tạo chiều sâu quang học 3 chiều.',
    status: 'pending',
    reject_reason: '',
    ai_appraisal: {
      originality_score: '99.8%',
      physical_brush_label: 'Nét cọ sơn dầu vật lý 3D • 0% Ảnh AI',
      is_real_physical: true,
      plagiarism_risk: 'Cực thấp (0.2%)',
      trust_score: 100,
      spectral_info: 'Quang phổ chất màu Winsor & Newton chuẩn tự nhiên',
      ai_recommendation: 'Khuyến nghị phê duyệt: Tác phẩm độc bản chuẩn mực, đủ điều kiện cấp chứng thư bảo tàng SHA-256.'
    }
  },
  {
    id: 'artw_queue_002',
    title: 'Khát Vọng Phù Sa',
    artist_name: 'Nguyễn Phúc An',
    artist_id: 'user_artist_an',
    artist_badge: 'Cấp L3 Họa sĩ',
    medium: 'Sơn mài truyền thống, son then, vỏ trứng & vàng lá 24K',
    dimensions: '100 × 150 cm',
    creation_year: '2024',
    starting_price: 55000000,
    reserve_price: 60000000,
    submitted_at: '3 giờ trước',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1400&q=85',
    proof_image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=85',
    description: 'Mài thủ công qua 9 lớp son và 4 lượt mài ướt. Có giấy kiểm định tuổi vàng quỳ 24K từ Viện Đá quý – Kim hoàn.',
    status: 'pending',
    reject_reason: '',
    ai_appraisal: {
      originality_score: '99.5%',
      physical_brush_label: 'Sơn mài mài ướt thủ công • 0% Sinh ảnh AI',
      is_real_physical: true,
      plagiarism_risk: 'Cực thấp (0.5%)',
      trust_score: 100,
      spectral_info: 'Đã đối soát chứng thư vàng lá 24K từ Viện Đá quý',
      ai_recommendation: 'Khuyến nghị phê duyệt: Tay nghề mài son then truyền thống xuất sắc.'
    }
  },
  {
    id: 'artw_queue_003',
    title: 'Vọng Nguyệt Qua Khung Cửa',
    artist_name: 'Lê Bá Hoài Nam',
    artist_id: 'user_artist_nam',
    artist_badge: 'Master Artist L3',
    medium: 'Mực nho & màu khoáng trên lụa Hà Đông thượng hạng',
    dimensions: '70 × 90 cm',
    creation_year: '2023',
    starting_price: 32000000,
    reserve_price: 35000000,
    submitted_at: 'Hôm qua, 18:20',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1400&q=85',
    proof_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=85',
    description: 'Bố cục tĩnh vật lãng mạn mang hồn cốt Đông Dương. Lụa căng khung gụ tinh xảo, kính chống lóa bảo vệ tia UV 99%.',
    status: 'pending',
    reject_reason: '',
    ai_appraisal: {
      originality_score: '88.0%',
      physical_brush_label: 'Màu khoáng trên lụa thật • 0% Ảnh AI',
      is_real_physical: true,
      plagiarism_risk: 'Trung bình (12% tương đồng tranh cổ)',
      trust_score: 86,
      spectral_info: 'Độ ẩm sợi tơ tằm đạt tiêu chuẩn bảo quản 55% RH',
      ai_recommendation: 'Cần giám tuyển kiểm tra góc nghiêng chữ ký sơn dầu trước khi cấp mã bảo mật.'
    }
  }
];

export const INITIAL_DISBURSEMENTS = [
  {
    order_id: 'AH-ORD-2024-8924',
    session_id: 'SES-LIVE-892',
    artwork_title: 'Hoàng Hôn Sông Hương',
    artwork_image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    artist_name: 'Nguyễn Gia Trí',
    artist_bank: 'Vietcombank – 0071000886886 (NGUYEN GIA TRI)',
    collector_name: 'Nguyễn Văn An (Nhà sưu tầm L2)',
    win_price: 35000000,
    platform_fee: 1750000,
    payout_amount: 33250000,
    completed_at: '02/11/2026',
    escrow_status: '72h_passed',
    note: 'Đã hoàn tất nghiệm thu thực tế 72h. Không có phát sinh khiếu nại.',
    status: 'pending',
  },
  {
    order_id: 'AH-ORD-2024-7620',
    session_id: 'SES-SEAL-762',
    artwork_title: 'Thiếu Nữ Bên Hoa Huệ',
    artwork_image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=400&q=80',
    artist_name: 'Tô Ngọc Vân',
    artist_bank: 'MB Bank – 0912345678999 (TO NGOC VAN)',
    collector_name: 'Đỗ Đức Huy (Nhà sưu tầm L3)',
    win_price: 65000000,
    platform_fee: 3250000,
    payout_amount: 61750000,
    completed_at: '01/11/2026',
    escrow_status: 'buyer_confirmed',
    note: 'Người mua chủ động bấm "Nghiệm thu hài lòng sớm" và nhận thẻ chứng nhận SHA-256.',
    status: 'pending',
  }
];

export const INITIAL_DISPUTES = [
  {
    dispute_id: 'DISP-2024-009',
    order_id: 'AH-ORD-2024-9102',
    artwork_title: 'Mùa Vàng Tây Bắc',
    artwork_image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80',
    artist_name: 'Trần Văn Cẩn',
    collector_name: 'Phan Hoàng Yến Trang (Victoria - VIP Patron)',
    collector_phone: '0988 888 999',
    escrow_amount: 28500000,
    issue_type: 'Hư hỏng do vận chuyển',
    issue_desc: 'Thùng gỗ bảo tàng bị móp góc dưới bên phải, kính cường lực bảo vệ có vết nứt dài 15cm làm xước nhẹ góc toan.',
    evidence_images: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80'
    ],
    submitted_at: '03/11/2026 (Còn 18h trong thời hạn 72h)',
    insurance_policy: 'Bảo hiểm hàng hóa mỹ thuật 100% của Artisan Express',
    status: 'open',
    resolution_note: '',
    ai_summary: {
      evidence_analyzed: 'Đã phân tích 2 ảnh vết nứt kính cường lực và xước toan + 14 tin nhắn trao đổi với đơn vị vận chuyển',
      conclusion: 'Phát hiện nứt vỡ do va đập ngoại lực trong khâu vận chuyển (khớp 94% với biên bản giao nhận của Artisan Express). Không có lỗi từ phía Họa sĩ.',
      fund_proposal: 'Hoàn tiền cọc 100% (28.500.000 đ) cho Người mua từ quỹ Escrow; Kích hoạt Bảo hiểm Hàng hóa Mỹ thuật thu hồi bồi thường 100% từ đơn vị vận chuyển.'
    }
  },
  {
    dispute_id: 'DISP-2024-004',
    order_id: 'AH-ORD-2024-5510',
    artwork_title: 'Phố Cổ Mưa Ngâu',
    artwork_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    artist_name: 'Bùi Xuân Phái',
    collector_name: 'Lê Thùy Chi (Nhà sưu tầm L1)',
    collector_phone: '0912 999 111',
    escrow_amount: 42000000,
    issue_type: 'Sai lệch màu sắc quang phổ',
    issue_desc: 'Màu nền thực tế sẫm màu hơn đáng kể so với ảnh Room View 3D chuẩn ánh sáng vàng 3000K trên sàn.',
    evidence_images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80'
    ],
    submitted_at: '31/10/2026',
    insurance_policy: 'Quy trình kiểm định quang phổ đối chứng của Hội đồng Thẩm định',
    status: 'open',
    resolution_note: '',
    ai_summary: {
      evidence_analyzed: 'Đã phân tích 1 ảnh chụp không gian thực tế của Người mua và so khớp profile màu ICC sRGB gốc',
      conclusion: 'Nhiệt độ màu phòng trưng bày của khách hàng là ánh sáng trắng 6500K (làm tranh ngả xám), khác với chuẩn trưng bày 3000K. Tranh hoàn toàn đúng mô tả quang phổ gốc.',
      fund_proposal: 'Từ chối hoàn tiền; Đề xuất tặng gói tư vấn lắp đèn rọi chiếu tranh chuyên dụng 3000K bảo tàng cho Khách hàng; Giữ nguyên lệnh giải ngân cho Họa sĩ.'
    }
  }
];

// Định dạng tiền tệ VNĐ
const FALLBACK_ART_IMAGE = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80';
const FALLBACK_ARTIST_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

const handleImageError = (e, fallbackUrl = FALLBACK_ART_IMAGE) => {
  if (e && e.currentTarget && e.currentTarget.src !== fallbackUrl) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackUrl;
  }
};

const formatVND = (num) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};



export default function QuanTriVienPage({ addToast }) {
  const navigate = useNavigate();
  const { tab } = useParams();

  // Chuẩn hóa tên tab từ URL router
  const normalizeTab = (t) => {
    if (!t) return 'overview';
    if (t === 'khieu-nai' || t === 'disputes' || t === 'dispute' || t === 'xu-ly-khieu-nai' || t === 'complaints') return 'disputes';
    if (t === 'hoa-si' || t === 'artists' || t === 'artist' || t === 'kiem-duyet-hoa-si') return 'artists';
    if (t === 'tac-pham' || t === 'artworks' || t === 'artwork' || t === 'tham-dinh-tac-pham') return 'artworks';
    if (t === 'ky-quy' || t === 'escrow' || t === 'giai-ngan' || t === 'disbursements') return 'escrow';
    if (t === 'overview' || t === 'tong-quan') return 'overview';
    return t;
  };

  // Tab điều hướng: 'overview' | 'artists' | 'artworks' | 'escrow' | 'disputes'
  const [activeTab, setActiveTab] = useState(() => normalizeTab(tab));

  useEffect(() => {
    if (tab) {
      setActiveTab(normalizeTab(tab));
    }
  }, [tab]);

  const handleTabChange = (targetTab) => {
    setActiveTab(targetTab);
    setIsMobileNavOpen(false);
    navigate(`/admin/${targetTab}`);
  };

  // Trạng thái mở menu điều hướng trên di động (Mobile Drawer)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // States dữ liệu mô phỏng tương tác
  const [artists, setArtists] = useState(INITIAL_PENDING_ARTISTS);
  const [artworks, setArtworks] = useState(INITIAL_PENDING_ARTWORKS);
  const [disbursements, setDisbursements] = useState(INITIAL_DISBURSEMENTS);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);

  // State ca khiếu nại đang được chọn trong Mô hình Không gian Phán quyết 2 cột (Master-Detail Workspace)
  const [selectedDisputeId, setSelectedDisputeId] = useState(INITIAL_DISPUTES[0]?.dispute_id || 'DISP-2024-009');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time Clock
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Modals State
  const [aiReportModal, setAiReportModal] = useState({ open: false, artist: null });
  const [rejectModal, setRejectModal] = useState({ open: false, type: '', item: null, reason: '' });
  const [detailModal, setDetailModal] = useState({ open: false, type: '', item: null });
  const [brushViewMode, setBrushViewMode] = useState('macro'); // 'macro' | 'full'
  // Kính lúp & Zoom giám định tranh chuyên sâu
  const [isLoupeActive, setIsLoupeActive] = useState(true);
  const [canvasZoomLevel, setCanvasZoomLevel] = useState(1);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const [loupeCoords, setLoupeCoords] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const canvasContainerRef = useRef(null);

  // Tự động khởi tạo lại góc nhìn và kích thước chuẩn khi mở modal
  useEffect(() => {
    if (detailModal.open && detailModal.type === 'artwork_proof') {
      setBrushViewMode('macro');
      setCanvasZoomLevel(1);
      setIsLoupeActive(true);
      setIsHoveringCanvas(false);
      setLoupeCoords({ x: 0, y: 0, percentX: 50, percentY: 50 });
    }
  }, [detailModal.open, detailModal.type]);

  const handleCanvasMouseMove = (e) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setLoupeCoords({ x, y, percentX, percentY });
    setIsHoveringCanvas(true);
  };

  const handleCanvasTouchMove = (e) => {
    if (!canvasContainerRef.current || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, touch.clientY - rect.top));
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setLoupeCoords({ x, y, percentX, percentY });
    setIsHoveringCanvas(true);
  };

  const ZOOM_LEVELS = [1, 1.35, 1.8, 2.5];
  const handleZoomIn = () => {
    setCanvasZoomLevel((prev) => {
      const next = ZOOM_LEVELS.find((lvl) => lvl > prev + 0.05);
      return next !== undefined ? next : prev;
    });
  };
  const handleZoomOut = () => {
    setCanvasZoomLevel((prev) => {
      const rev = [...ZOOM_LEVELS].reverse();
      const prevLvl = rev.find((lvl) => lvl < prev - 0.05);
      return prevLvl !== undefined ? prevLvl : 1;
    });
  };
  const handleResetZoom = () => {
    setCanvasZoomLevel(1);
  };
  const [disputeModal, setDisputeModal] = useState({ open: false, dispute: null, resolution: 'full_refund' });
  const [payoutConfirmModal, setPayoutConfirmModal] = useState({ open: false, disbursement: null, confirmedAwareness: false });

  // Real-time clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { hour12: false });
      const date = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setCurrentTimeStr(`${time} • ${date}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute pending metrics
  const pendingArtistsCount = artists.filter(a => a.status === 'pending').length;
  const pendingArtworksCount = artworks.filter(a => a.status === 'pending').length;
  const pendingPayoutCount = disbursements.filter(d => d.status === 'pending').length;
  const openDisputesCount = disputes.filter(d => d.status === 'open').length;

  const totalUrgentCount = pendingArtistsCount + pendingArtworksCount + pendingPayoutCount + openDisputesCount;

  // 1. Phê duyệt Họa sĩ
  const handleApproveArtist = (artistId) => {
    setArtists(prev => prev.map(a => a.id === artistId ? { ...a, status: 'approved' } : a));
    const target = artists.find(a => a.id === artistId);
    addToast?.(`✦ Đã phê duyệt hồ sơ Họa sĩ "${target?.full_name}"! Cấp quyền mở xưởng vẽ.`, 'success', 5000);
  };

  // 2. Phê duyệt Tác phẩm thủ công
  const handleApproveArtwork = (artwId) => {
    setArtworks(prev => prev.map(a => a.id === artwId ? { ...a, status: 'approved' } : a));
    const target = artworks.find(a => a.id === artwId);
    addToast?.(`✦ Đã phê duyệt tác phẩm "${target?.title}" & cấp chứng thư số SHA-256!`, 'success', 5000);
  };

  // 3. Duyệt nhanh theo khuyến nghị AI (Chỉ áp dụng khi điểm tin cậy đạt 100)
  const handleQuickApproveAi = (artwork) => {
    setArtworks(prev => prev.map(a => a.id === artwork.id ? { ...a, status: 'approved' } : a));
    addToast?.(`⚡ Đã duyệt nhanh theo khuyến nghị AI: Tác phẩm "${artwork.title}" đạt chuẩn độc bản tuyệt đối (100%)!`, 'success', 5000);
  };

  // Ca khiếu nại được chọn hiển thị trong Workspace
  const selectedDispute = disputes.find(d => d.dispute_id === selectedDisputeId) || disputes[0];

  // Bác bỏ khiếu nại (Giải ngân cho Họa sĩ)
  const handleRejectDisputeAndReleaseEscrow = (disp) => {
    const resText = 'Bác bỏ khiếu nại của Người mua; Giải ngân toàn bộ quỹ Escrow cho Họa sĩ.';
    setDisputes(prev => prev.map(d => d.dispute_id === disp.dispute_id ? { ...d, status: 'resolved', resolution_note: resText } : d));
    addToast?.(`✓ Đã bác bỏ khiếu nại #${disp.dispute_id} & kích hoạt lệnh giải ngân ${formatVND(disp.escrow_amount)} cho Họa sĩ!`, 'success', 6000);
  };

  // Yêu cầu bên thứ 3 giám định lại
  const handleRequestThirdPartyAppraisal = (disp) => {
    addToast?.(`🔍 Đã chuyển hồ sơ ca #${disp.dispute_id} đến Hội đồng Giám định Độc lập (Hội Mỹ thuật VN) để đối soát vi mô.`, 'gold', 6000);
  };

  // 4. Áp dụng đề xuất AI giải quyết tranh chấp khiếu nại 1 chạm
  const handleApplyAiDisputeResolution = (disp) => {
    const resText = disp.ai_summary.fund_proposal;
    setDisputes(prev => prev.map(d => d.dispute_id === disp.dispute_id ? { ...d, status: 'resolved', resolution_note: resText } : d));
    addToast?.(`⚡ Đã áp dụng đề xuất AI & xử lý dòng tiền hoàn cọc cho ca khiếu nại #${disp.dispute_id}!`, 'success', 6000);
  };

  // 5. Mở modal Từ chối
  const handleOpenReject = (type, item) => {
    setRejectModal({
      open: true,
      type,
      item,
      reason: type === 'artist'
        ? 'Ảnh CCCD chưa rõ góc hoặc liên kết portfolio không truy cập được. Vui lòng cập nhật lại.'
        : 'Ảnh chụp cận cảnh vệt cọ chưa đủ độ sắc nét để Hội đồng Thẩm định cấp mã số SHA-256.'
    });
  };

  // Xác nhận Từ chối
  const handleConfirmReject = (e) => {
    e.preventDefault();
    const { type, item, reason } = rejectModal;
    if (!reason.trim()) {
      addToast?.('Vui lòng nhập lý do từ chối để thông báo cho Họa sĩ!', 'warning');
      return;
    }

    if (type === 'artist') {
      setArtists(prev => prev.map(a => a.id === item.id ? { ...a, status: 'rejected', reject_reason: reason } : a));
      addToast?.(`Đã từ chối hồ sơ Họa sĩ "${item.full_name}" kèm văn bản giải trình lý do.`, 'info', 5000);
    } else {
      setArtworks(prev => prev.map(a => a.id === item.id ? { ...a, status: 'rejected', reject_reason: reason } : a));
      addToast?.(`Đã từ chối tác phẩm "${item.title}" kèm văn bản yêu cầu bổ sung.`, 'info', 5000);
    }
    setRejectModal({ open: false, type: '', item: null, reason: '' });
  };

  // Mở cửa sổ đối soát & xác nhận an toàn trước khi giải ngân
  const handleOpenPayoutConfirm = (disbursement) => {
    setPayoutConfirmModal({
      open: true,
      disbursement,
      confirmedAwareness: false
    });
  };

  // Xác nhận giải ngân sau khi Admin đã kiểm tra và tick cam kết an toàn
  const handleConfirmPayout = () => {
    if (!payoutConfirmModal.disbursement) return;
    const target = payoutConfirmModal.disbursement;
    setDisbursements(prev => prev.map(d => d.order_id === target.order_id ? { ...d, status: 'disbursed' } : d));
    addToast?.(`✦ Đã giải ngân an toàn ${formatVND(target.payout_amount)} về tài khoản ${target.artist_name}!`, 'success', 6000);
    setPayoutConfirmModal({ open: false, disbursement: null, confirmedAwareness: false });
  };

  // Phán quyết Khiếu nại thủ công
  const handleConfirmDisputeResolution = (e) => {
    e.preventDefault();
    const { dispute, resolution } = disputeModal;
    const resText = resolution === 'full_refund'
      ? 'Hoàn tiền 100% cho Khách hàng từ quỹ Escrow'
      : 'Kích hoạt gói bảo hiểm phục chế 100% & Bồi thường 30% giá trị';

    setDisputes(prev => prev.map(d => d.dispute_id === dispute.dispute_id ? { ...d, status: 'resolved', resolution_note: resText } : d));
    setDisputeModal({ open: false, dispute: null, resolution: 'full_refund' });
    addToast?.(`✦ Đã xử lý khiếu nại #${dispute.dispute_id}: ${resText}!`, 'success', 6000);
  };

  // Đăng xuất Quản trị viên
  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('artisan_admin_session');
    } catch {
      // ignore
    }
    addToast?.('Đã kết thúc phiên trực ban của Quản trị viên.', 'info');
    navigate('/admin/login');
  };

  // Filtered queries
  const filteredArtists = artists.filter(a =>
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.art_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArtworks = artworks.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.medium.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${styles.adminPortal} h-screen w-full bg-slate-50 flex flex-col lg:flex-row overflow-hidden`}>
      {/* ====================================================================
          LỚP NỀN MỜ CHO MOBILE & TABLET DRAWER (< 1024px)
          ==================================================================== */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ====================================================================
          1. THANH ĐIỀU HƯỚNG BÊN TRÁI (ADAPTIVE NAVIGATION)
          Desktop (>= 1024px): w-64 shrink-0 cố định bên trái
          Tablet & Mobile (< 1024px): Ẩn mặc định, mở ra dạng Drawer Sheet
          ==================================================================== */}
      <aside className={`${styles.sidebar || ''} ${isMobileNavOpen ? styles.sidebarMobileOpen : ''} w-64 h-screen sticky top-0 bg-[#0d131f] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-30`}>
        {/* Brand Header */}
        <div className={styles.sidebarBrand}>
          <div className={styles.brandBrandLeft}>
            <div className={styles.brandLogoBox}>
              <ShieldCheck size={24} />
            </div>
            <div className={styles.brandTextWrap}>
              <h1 className={styles.brandTitle}>ARTISAN HUB</h1>
              <p className={styles.brandSubtitle}>
                <Cpu size={12} /> BAN QUẢN TRỊ VIÊN
              </p>
            </div>
          </div>

          {/* Nút đóng Drawer trên thiết bị < 1024px */}
          <button
            type="button"
            className={`${styles.drawerCloseBtn} lg:hidden text-slate-400 hover:text-white p-1 rounded-md`}
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={`${styles.sidebarNav || ''} flex-1 overflow-y-auto py-4 px-3 space-y-4`}>
          <span className={styles.navSectionLabel}>HỆ THỐNG KIỂM DUYỆT</span>

          {/* Tab 1: Tổng quan */}
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('overview')}
            title="Tổng quan & Chỉ số Vận hành"
          >
            <div className={styles.navItemContent}>
              <LayoutDashboard size={19} className={styles.navItemIcon} />
              <span className={styles.navItemText}>Tổng quan & Chỉ số</span>
            </div>
            {totalUrgentCount > 0 && (
              <span className={`${styles.navBadge} ${styles.navBadgeAlert}`}>{totalUrgentCount}</span>
            )}
          </button>

          {/* Tab 2: Kiểm duyệt Họa sĩ */}
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'artists' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('artists')}
            title="Kiểm duyệt Họa sĩ mới"
          >
            <div className={styles.navItemContent}>
              <UserCheck size={19} className={styles.navItemIcon} />
              <span className={styles.navItemText}>Kiểm duyệt Họa sĩ</span>
            </div>
            {pendingArtistsCount > 0 && (
              <span className={`${styles.navBadge} ${activeTab === 'artists' ? styles.navBadgeActive : ''}`}>
                {pendingArtistsCount}
              </span>
            )}
          </button>

          {/* Tab 3: Thẩm định Tác phẩm */}
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'artworks' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('artworks')}
            title="Thẩm định Tác phẩm"
          >
            <div className={styles.navItemContent}>
              <Award size={19} className={styles.navItemIcon} />
              <span className={styles.navItemText}>Thẩm định Tác phẩm</span>
            </div>
            {pendingArtworksCount > 0 && (
              <span className={`${styles.navBadge} ${activeTab === 'artworks' ? styles.navBadgeActive : ''}`}>
                {pendingArtworksCount}
              </span>
            )}
          </button>

          <span className={styles.navSectionLabel}>TÀI CHÍNH & VẬN HÀNH</span>

          {/* Tab 4: Ký quỹ & Giải ngân */}
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'escrow' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('escrow')}
            title="Ký quỹ Escrow & Giải ngân"
          >
            <div className={styles.navItemContent}>
              <Building2 size={19} className={styles.navItemIcon} />
              <span className={styles.navItemText}>Ký quỹ & Giải ngân</span>
            </div>
            {pendingPayoutCount > 0 && (
              <span className={`${styles.navBadge} ${activeTab === 'escrow' ? styles.navBadgeActive : ''}`}>
                {pendingPayoutCount}
              </span>
            )}
          </button>

          {/* Tab 5: Xử lý Khiếu nại */}
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'disputes' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('disputes')}
            title="Xử lý Tranh chấp & Khiếu nại"
          >
            <div className={styles.navItemContent}>
              <AlertTriangle size={19} className={styles.navItemIcon} />
              <span className={styles.navItemText}>Xử lý Khiếu nại</span>
            </div>
            {openDisputesCount > 0 && (
              <span className={`${styles.navBadge} ${styles.navBadgeAlert}`}>
                {openDisputesCount}
              </span>
            )}
          </button>
        </nav>

        {/* 3. Khối chân trang ghim cứng ở đáy Sidebar */}
        <div className={styles.sidebarFooter}>
          {/* ── Thẻ thông tin Quản trị viên nổi bật ── */}
          <div className={styles.userCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarTc}>
                TC
              </div>
              <span className={styles.avatarOnlineDot} />
            </div>

            {/* Tên và chức danh */}
            <div className={styles.userInfo}>
              <span className={styles.userName} title="GS. TS. Trần Viết Cường">
                GS. TS. Trần Viết Cường
              </span>
              <div className={styles.userRoleRow}>
                <span className={styles.adminStatusPill}>
                  <span className={styles.adminPulseDot} />
                  Trực ban
                </span>
                <span className={styles.adminCode}>QTV-8942</span>
              </div>
            </div>

            {/* Chuông thông báo khẩn */}
            <button
              type="button"
              className={styles.footerBellBtn}
              onClick={() => setActiveTab(openDisputesCount > 0 ? 'disputes' : 'artists')}
              title={`Có ${totalUrgentCount} tác vụ cần xử lý`}
              aria-label="Thông báo khẩn"
            >
              <Bell size={16} />
              {totalUrgentCount > 0 && (
                <span className={styles.footerBellBadge}>
                  {totalUrgentCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Cặp nút Đăng xuất & Về sàn sắc nét ── */}
          <div className={styles.sidebarActionGroup}>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleAdminLogout}
              title="Đăng xuất khỏi phân hệ quản trị"
            >
              <LogOut size={14} className="shrink-0" />
              <span>Đăng xuất</span>
            </button>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewClientBtn}
              title="Chuyển sang giao diện Sàn khách hàng trong tab mới"
            >
              <ExternalLink size={14} className="shrink-0" />
              <span>Về sàn</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          2. VÙNG CHỨA NỘI DUNG CHÍNH (MAIN CONTENT AREA)
          flex-1 min-w-0 bg-slate-50 min-h-screen overflow-y-auto
          ==================================================================== */}
      <main className={`${styles.mainArea} flex-1 min-w-0 bg-slate-50 h-screen overflow-y-auto flex flex-col`}>
        {/* TOPBAR THÍCH ỨNG ĐA THIẾT BỊ (COMPONENT CHUẨN DÙNG CHUNG) */}
        <AdminTopbar
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
          currentTimeStr={currentTimeStr}
          activeTab={activeTab}
        />

        {/* CONTENT WRAPPER - ĐỆM LINH HOẠT p-4 sm:p-5 lg:p-6 */}
        <div className={`${styles.contentWrapper || ''} ${activeTab === 'disputes' ? '!p-0 flex-1 flex flex-col' : 'p-4 sm:p-5 lg:p-6 flex-1'} w-full max-w-full box-border`}>
          {activeTab === 'overview' && (
            <>
              {/* THANH WIDGET AI NHỎ GỌN TRÊN TRANG TỔNG QUAN */}
              <div className={styles.compactAiWidget}>
                <div className={styles.compactAiWidgetLeft}>
                  <div className={styles.aiPulseIcon}>
                    <Sparkles size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className={styles.compactAiTitle}>Trợ lý AI Copilot đang vận hành</span>
                    <span className={styles.compactAiSubtitle}>
                      {' '}— Đã tự động thẩm định <strong>18 tác phẩm</strong> & đối soát <strong>12 hồ sơ Họa sĩ</strong> trong tháng (Độ chính xác 99.8%)
                    </span>
                  </div>
                </div>

                <div className={styles.compactAiBadge}>
                  🟢 0 Rủi ro phát hiện
                </div>
              </div>

              {/* 4 THẺ CHỈ SỐ TỔNG QUAN - GRID CO GIÃN CHUẨN */}
              <div className={`${styles.statsGrid} grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6`}>
                {/* Card 1: Họa sĩ chờ duyệt */}
                <div
                  className={`${styles.statCard} ${activeTab === 'artists' ? styles.statCardActive : ''}`}
                  onClick={() => setActiveTab('artists')}
                >
                  <div className={styles.statCardHeader}>
                    <div className={styles.statIconBox} style={{ color: '#B45309', borderColor: '#FDE68A', background: '#FEF3C7' }}>
                      <Palette size={20} />
                    </div>
                    <span className={styles.statPill} style={{ background: '#FEF3C7', color: '#78350F', border: '1px solid #FDE68A' }}>
                      eKYC & Portfolio
                    </span>
                  </div>
                  <div className={styles.statCardBody}>
                    <div className={styles.statVal}>{pendingArtistsCount}</div>
                    <div className={styles.statLabel}>Họa sĩ chờ duyệt</div>
                    <div className={styles.statSubText}>Đối soát CCCD & Chứng thư mỹ thuật</div>
                  </div>
                </div>

                {/* Card 2: Tác phẩm chờ duyệt */}
                <div
                  className={`${styles.statCard} ${activeTab === 'artworks' ? styles.statCardActive : ''}`}
                  onClick={() => setActiveTab('artworks')}
                >
                  <div className={styles.statCardHeader}>
                    <div className={styles.statIconBox} style={{ color: '#0369A1', borderColor: '#BAE6FD', background: '#E0F2FE' }}>
                      <Award size={20} />
                    </div>
                    <span className={styles.statPill} style={{ background: '#E0F2FE', color: '#075985', border: '1px solid #BAE6FD' }}>
                      Độc bản L3
                    </span>
                  </div>
                  <div className={styles.statCardBody}>
                    <div className={styles.statVal}>{pendingArtworksCount}</div>
                    <div className={styles.statLabel}>Tác phẩm chờ duyệt</div>
                    <div className={styles.statSubText}>Thẩm định phổ màu & vệt cọ thật</div>
                  </div>
                </div>

                {/* Card 3: Yêu cầu giải ngân */}
                <div
                  className={`${styles.statCard} ${activeTab === 'escrow' ? styles.statCardActive : ''}`}
                  onClick={() => setActiveTab('escrow')}
                >
                  <div className={styles.statCardHeader}>
                    <div className={styles.statIconBox} style={{ color: '#047857', borderColor: '#A7F3D0', background: '#D1FAE5' }}>
                      <DollarSign size={20} />
                    </div>
                    <span className={styles.statPill} style={{ background: '#D1FAE5', color: '#064E3B', border: '1px solid #A7F3D0' }}>
                      Ký quỹ Escrow
                    </span>
                  </div>
                  <div className={styles.statCardBody}>
                    <div className={styles.statVal}>{pendingPayoutCount}</div>
                    <div className={styles.statLabel}>Yêu cầu giải ngân</div>
                    <div className={styles.statSubText}>Đơn hàng đã bàn giao thành công</div>
                  </div>
                </div>

                {/* Card 4: Khiếu nại tranh chấp */}
                <div
                  className={`${styles.statCard} ${activeTab === 'disputes' ? styles.statCardActive : ''}`}
                  onClick={() => setActiveTab('disputes')}
                >
                  <div className={styles.statCardHeader}>
                    <div className={styles.statIconBox} style={{ color: '#BE123C', borderColor: '#FECDD3', background: '#FFE4E6' }}>
                      <AlertTriangle size={20} />
                    </div>
                    <span className={styles.statPill} style={{ background: '#FFE4E6', color: '#881337', border: '1px solid #FECDD3' }}>
                      Khẩn cấp
                    </span>
                  </div>
                  <div className={styles.statCardBody}>
                    <div className={styles.statVal}>{openDisputesCount}</div>
                    <div className={styles.statLabel}>Khiếu nại đang mở</div>
                    <div className={styles.statSubText}>AI phân tích chứng cứ & đề xuất</div>
                  </div>
                </div>
              </div>

              {/* 2 DANH SÁCH XỬ LÝ NHANH TRÊN TỔNG QUAN */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 1. Họa sĩ đăng ký mới nhất */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleWrap}>
                      <h3><UserCheck size={18} color="#B45309" /> Họa sĩ chờ duyệt ({pendingArtistsCount})</h3>
                      <p>eKYC căn cước công dân gắn chip</p>
                    </div>
                    <button
                      type="button"
                      className={styles.btnViewMini}
                      onClick={() => setActiveTab('artists')}
                    >
                      Xem tất cả →
                    </button>
                  </div>

                  {/* Desktop Table (hidden lg:block) */}
                  <div className={`${styles.desktopTableView} hidden lg:block`}>
                    <div className={styles.tableResponsive}>
                      <table className={`${styles.adminTable} w-full table-fixed`}>
                        <colgroup>
                          <col className="w-[50%]" />
                          <col className="w-[24%]" />
                          <col className="w-[26%]" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>Họa sĩ</th>
                            <th>AI Đối soát</th>
                            <th className={`${styles.actionStickyTh} text-right`}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artists.slice(0, 3).map((a) => (
                            <tr key={a.id}>
                              <td>
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img src={a.avatar}
                                    alt={a.full_name}
                                    className={`${styles.artistThumb} w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                                    onError={(e) => handleImageError(e, FALLBACK_ARTIST_IMAGE)}
                                    loading="lazy"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-bold text-slate-900 text-sm truncate" title={a.full_name}>{a.full_name}</div>
                                    <div className="text-xs text-slate-500 truncate" title={`${a.art_name} • ${a.specialty}`}>{a.art_name} • {a.specialty}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={styles.aiMatchPill}>✓ {a.ai_analysis.cccd_match_rate}</span>
                              </td>
                              <td className={`${styles.actionStickyTd} text-right`}>
                                <div className={styles.compactActionGroup}>
                                  {a.status === 'pending' ? (
                                    <>
                                      <button
                                        type="button"
                                        className={styles.btnRejectMini}
                                        onClick={() => handleOpenReject('artist', a)}
                                      >
                                        <X size={13} /> Từ chối
                                      </button>
                                      <button
                                        type="button"
                                        className={styles.btnApproveMini}
                                        onClick={() => handleApproveArtist(a.id)}
                                      >
                                        <Check size={13} /> Duyệt
                                      </button>
                                    </>
                                  ) : (
                                    <span className={styles.badgeApproved}><Check size={12} /> Đã duyệt</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile & Tablet Card Grid (block lg:hidden) */}
                  <div className={`${styles.mobileCardList} block lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                    {artists.slice(0, 3).map((a) => (
                      <div key={`ov_m_${a.id}`} className={styles.mobileCard}>
                        <div className={styles.mobileCardHeader}>
                          <div className="flex items-center gap-3 min-w-0 flex-1">

                            <img src={a.avatar}
                              alt={a.full_name}
                              className={`${styles.artistThumbMobile} w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                              onError={(e) => handleImageError(e, FALLBACK_ARTIST_IMAGE)}
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className={`${styles.mobileCardTitle} truncate`} title={a.full_name}>{a.full_name}</h4>
                              <p className={`${styles.mobileCardSubtitle} truncate`} title={a.art_name}>{a.art_name}</p>
                              <span className={styles.aiMatchPill}>✓ {a.ai_analysis.cccd_match_rate}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`${styles.mobileCardFooter} flex flex-wrap items-center gap-2`}>
                          <button
                            type="button"
                            className={styles.btnViewMini}
                            onClick={() => setActiveTab('artists')}
                          >
                            Xem chi tiết
                          </button>
                          {a.status === 'pending' && (
                            <button
                              type="button"
                              className={styles.btnApproveMini}
                              onClick={() => handleApproveArtist(a.id)}
                            >
                              <Check size={13} /> Duyệt
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Tác phẩm chờ thẩm định */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleWrap}>
                      <h3><Award size={18} color="#0369A1" /> Tác phẩm chờ thẩm định ({pendingArtworksCount})</h3>
                      <p>Kiểm định độc bản và nhận diện nét vẽ thật</p>
                    </div>
                    <button
                      type="button"
                      className={styles.btnViewMini}
                      onClick={() => setActiveTab('artworks')}
                    >
                      Xem tất cả →
                    </button>
                  </div>

                  {/* Desktop Table (hidden lg:block) */}
                  <div className={`${styles.desktopTableView} hidden lg:block`}>
                    <div className={styles.tableResponsive}>
                      <table className={`${styles.adminTable} w-full table-fixed`}>
                        <colgroup>
                          <col className="w-[50%]" />
                          <col className="w-[24%]" />
                          <col className="w-[26%]" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>Tác phẩm</th>
                            <th>Độc bản AI</th>
                            <th className={`${styles.actionStickyTh} text-right`}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artworks.slice(0, 3).map((w) => (
                            <tr key={w.id}>
                              <td>
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img src={w.image}
                                    alt={w.title}
                                    className={`${styles.artThumb} w-11 h-11 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                                    onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                                    loading="lazy"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-bold text-slate-900 text-sm truncate" title={w.title}>{w.title}</div>
                                    <div className="text-xs text-slate-500 truncate" title={w.artist_name}>{w.artist_name}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={styles.aiMatchPill}>
                                  <Sparkles size={12} /> {w.ai_appraisal.originality_score}
                                </span>
                              </td>
                              <td className={`${styles.actionStickyTd} text-right`}>
                                <div className={styles.compactActionGroup}>
                                  {w.status === 'pending' ? (
                                    <button
                                      type="button"
                                      className={styles.btnApproveMini}
                                      onClick={() => handleApproveArtwork(w.id)}
                                    >
                                      <Check size={13} /> Duyệt
                                    </button>
                                  ) : (
                                    <span className={styles.badgeApproved}><Check size={12} /> Đã duyệt</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile & Tablet Card Grid (block lg:hidden) */}
                  <div className={`${styles.mobileCardList} block lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                    {artworks.slice(0, 3).map((w) => (
                      <div key={`ov_m_${w.id}`} className={styles.mobileCard}>
                        <div className={styles.mobileCardHeader}>
                          <div className="flex items-center gap-3 min-w-0 flex-1">

                            <img src={w.image}
                              alt={w.title}
                              className={`${styles.artThumbMobile} w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                              onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className={`${styles.mobileCardTitle} truncate`} title={w.title}>{w.title}</h4>
                              <p className={`${styles.mobileCardSubtitle} truncate`} title={w.artist_name}>{w.artist_name}</p>
                              <span className={styles.aiMatchPill}>{w.ai_appraisal.originality_score}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`${styles.mobileCardFooter} flex flex-wrap items-center gap-2`}>
                          <button
                            type="button"
                            className={styles.btnViewMini}
                            onClick={() => setActiveTab('artworks')}
                          >
                            Xem chi tiết
                          </button>
                          {w.status === 'pending' && (
                            <button
                              type="button"
                              className={styles.btnApproveMini}
                              onClick={() => handleApproveArtwork(w.id)}
                            >
                              <Check size={13} /> Duyệt
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ====================================================================
              1. TRANG "KIỂM DUYỆT HỌA SĨ" (DUAL PATTERN)
              ==================================================================== */}
          {activeTab === 'artists' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrap}>
                  <h3>
                    <UserCheck size={20} color="#B45309" />
                    Kiểm Duyệt Họa Sĩ Mới ({filteredArtists.length})
                  </h3>
                  <p>
                    Đối soát CCCD gắn chip, xác thực tư cách hội viên mỹ thuật và hồ sơ nghệ thuật.
                  </p>
                </div>

                <div className={styles.searchFilterRow}>
                  <div className={styles.searchInputWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="Tìm theo tên, email, CCCD..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* BẢNG DÀNH CHO MÀN HÌNH DESKTOP (hidden lg:block) */}
              <div className={`${styles.desktopTableView} hidden lg:block`}>
                <div className={styles.tableResponsive}>
                  <table className={`${styles.adminTable} w-full table-fixed`}>
                    <colgroup>
                      <col style={{ width: '20%', minWidth: 170 }} />
                      <col style={{ width: '12%', minWidth: 105 }} />
                      <col style={{ width: '18%', minWidth: 140 }} />
                      <col style={{ width: '22%', minWidth: 170 }} />
                      <col style={{ width: '12%', minWidth: 115 }} />
                      <col style={{ width: '16%', minWidth: 155 }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Họa sĩ & Nghệ danh</th>
                        <th>CCCD & eKYC</th>
                        <th>Chuyên môn & Đào tạo</th>
                        <th>Phân tích AI Copilot</th>
                        <th>Trạng thái</th>
                        <th className={`${styles.actionStickyTh} text-right`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArtists.map((artist) => {
                        const isPending = artist.status === 'pending';
                        const { ai_analysis } = artist;

                        return (
                          <tr key={artist.id}>
                            {/* Cột 1: Thông tin chính & Avatar Họa sĩ */}
                            <td>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img src={artist.avatar}
                                  alt={artist.full_name}
                                  className={`${styles.artistThumb} w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                                  onError={(e) => handleImageError(e, FALLBACK_ARTIST_IMAGE)}
                                  loading="lazy"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-slate-900 text-sm truncate" title={artist.full_name}>{artist.full_name}</div>
                                  <div className="text-xs text-amber-700 font-bold truncate" title={artist.art_name}>{artist.art_name}</div>
                                  <div className="text-xs text-slate-600 truncate" title={artist.email}>{artist.email}</div>
                                  <div className="text-[11px] text-slate-400 truncate">{artist.phone} • ĐK: {artist.registered_at}</div>
                                </div>
                              </div>
                            </td>

                            {/* Cột 2: Căn cước công dân */}
                            <td>
                              <div className="font-mono text-xs font-bold text-slate-900">
                                {artist.id_card.slice(0, 4)}••••{artist.id_card.slice(-4)}
                              </div>
                              <button
                                type="button"
                                className={styles.btnViewMini}
                                style={{ marginTop: 6 }}
                                onClick={() => setDetailModal({ open: true, type: 'artist_id', item: artist })}
                              >
                                <Eye size={13} /> Xem ảnh CCCD
                              </button>
                            </td>

                            {/* Cột 3: Chuyên môn & Đào tạo */}
                            <td>
                              <div className="text-xs font-semibold text-slate-900 leading-snug" title={artist.specialty}>{artist.specialty}</div>
                              <div className="text-xs text-slate-600 mt-1 leading-snug" title={`KN: ${artist.experience_years} năm • ${artist.academy}`}>
                                KN: <strong>{artist.experience_years} năm</strong> • {artist.academy}
                              </div>
                              <a
                                href={artist.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 mt-1 truncate max-w-full"
                                title={artist.portfolio_url}
                              >
                                <ExternalLink size={12} className="shrink-0" />
                                <span className="truncate">{artist.portfolio_url.replace('https://', '')}</span>
                              </a>
                            </td>

                            {/* Cột 4: Thẻ tóm tắt phân tích AI */}
                            <td>
                              <div className={styles.aiTableBlock}>
                                <div className={styles.aiBadgeRow}>
                                  <span className={styles.aiMatchPill}>✓ Khớp {ai_analysis.cccd_match_rate}</span>
                                  <span className={styles.aiTrustPill}>L3 Master</span>
                                </div>
                                <p className={styles.aiSummaryTruncate} title={ai_analysis.summary}>
                                  {ai_analysis.summary}
                                </p>
                                <button
                                  type="button"
                                  className={styles.aiAuditLinkBtn}
                                  onClick={() => setAiReportModal({ open: true, artist })}
                                >
                                  <Sparkles size={12} /> Xem báo cáo ({ai_analysis.trust_score}/100) →
                                </button>
                              </div>
                            </td>

                            {/* Cột 5: Trạng thái */}
                            <td>
                              {artist.status === 'approved' && (
                                <span className={styles.badgeApproved}><Check size={13} /> Đã duyệt</span>
                              )}
                              {artist.status === 'pending' && (
                                <span className={styles.badgePending}><Clock size={13} /> Chờ duyệt</span>
                              )}
                              {artist.status === 'rejected' && (
                                <span className={styles.badgeRejected}><X size={13} /> Đã từ chối</span>
                              )}
                            </td>

                            {/* Cột 6: Thao tác */}
                            <td className={`${styles.actionStickyTd} text-right`}>
                              <div className={styles.compactActionGroup}>
                                {isPending ? (
                                  <>
                                    <button
                                      type="button"
                                      className={styles.btnRejectMini}
                                      onClick={() => handleOpenReject('artist', artist)}
                                      title="Từ chối hồ sơ kèm lý do"
                                    >
                                      <X size={13} /> Từ chối
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.btnApproveMini}
                                      onClick={() => handleApproveArtist(artist.id)}
                                      title="Phê duyệt hồ sơ Họa sĩ"
                                    >
                                      <Check size={13} /> Duyệt
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className={styles.btnViewMini}
                                    onClick={() => setDetailModal({ open: true, type: 'artist_id', item: artist })}
                                  >
                                    <Eye size={13} /> Xem lại
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARD GRID DÀNH CHO MOBILE & TABLET (block lg:hidden) */}
              <div className={`${styles.mobileCardList} block lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                {filteredArtists.map((artist) => {
                  const isPending = artist.status === 'pending';
                  const { ai_analysis } = artist;

                  return (
                    <div key={`m_art_${artist.id}`} className={styles.mobileCard}>
                      <div className={styles.mobileCardHeader}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">

                          <img src={artist.avatar}
                            alt={artist.full_name}
                            className={`${styles.artistThumbMobile} w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                            onError={(e) => handleImageError(e, FALLBACK_ARTIST_IMAGE)}
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`${styles.mobileCardTitle} truncate`} title={artist.full_name}>{artist.full_name}</h4>
                            <p className={`${styles.mobileCardSubtitle} truncate`} title={artist.art_name}>{artist.art_name}</p>
                            <p className={`${styles.mobileCardMeta} truncate`} title={artist.email}>{artist.email}</p>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {artist.status === 'pending' && <span className={styles.badgePending}>Chờ duyệt</span>}
                          {artist.status === 'approved' && <span className={styles.badgeApproved}>Đã duyệt</span>}
                          {artist.status === 'rejected' && <span className={styles.badgeRejected}>Đã từ chối</span>}
                        </div>
                      </div>

                      <div className={styles.mobileCardBody}>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>CCCD gắn chip:</span>
                          <span className={styles.mobileCardValue}>{artist.id_card.slice(0, 4)}••••{artist.id_card.slice(-4)}</span>
                        </div>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>Chuyên môn:</span>
                          <span className={`${styles.mobileCardValue} truncate max-w-[160px]`} title={artist.specialty}>{artist.specialty}</span>
                        </div>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>AI Đối soát:</span>
                          <span className={styles.aiMatchPill}>✓ Khớp {ai_analysis.cccd_match_rate}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1" title={ai_analysis.summary}>
                          {ai_analysis.summary}
                        </p>
                      </div>

                      <div className={`${styles.mobileCardFooter} flex flex-wrap items-center gap-2`}>
                        <button
                          type="button"
                          className={styles.btnViewMini}
                          onClick={() => setDetailModal({ open: true, type: 'artist_id', item: artist })}
                        >
                          <Eye size={13} /> Xem CCCD
                        </button>
                        <button
                          type="button"
                          className={styles.btnAiMini}
                          onClick={() => setAiReportModal({ open: true, artist })}
                        >
                          <Sparkles size={13} /> Báo cáo AI
                        </button>
                        {isPending && (
                          <>
                            <button
                              type="button"
                              className={styles.btnRejectMini}
                              onClick={() => handleOpenReject('artist', artist)}
                            >
                              <X size={13} /> Từ chối
                            </button>
                            <button
                              type="button"
                              className={styles.btnApproveMini}
                              onClick={() => handleApproveArtist(artist.id)}
                            >
                              <Check size={13} /> Duyệt
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              2. TRANG "THẨM ĐỊNH TÁC PHẨM" (DUAL PATTERN)
              ==================================================================== */}
          {activeTab === 'artworks' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrap}>
                  <h3>
                    <Award size={20} color="#0369A1" />
                    Hàng Đợi Thẩm Định Tác Phẩm ({filteredArtworks.length})
                  </h3>
                  <p>
                    Kiểm định độc bản, nhận diện nét vẽ thật và kiểm tra rủi ro đạo nhái trước khi mở phiên đấu giá.
                  </p>
                </div>

                <div className={styles.searchFilterRow}>
                  <div className={styles.searchInputWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="Tìm tranh, họa sĩ, chất liệu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* BẢNG DÀNH CHO MÀN HÌNH DESKTOP (hidden lg:block) */}
              <div className={`${styles.desktopTableView} hidden lg:block`}>
                <div className={styles.tableResponsive}>
                  <table className={`${styles.adminTable} w-full table-fixed`}>
                    <colgroup>
                      <col style={{ width: '22%', minWidth: 180 }} />
                      <col style={{ width: '16%', minWidth: 140 }} />
                      <col style={{ width: '24%', minWidth: 180 }} />
                      <col style={{ width: '13%', minWidth: 115 }} />
                      <col style={{ width: '25%', minWidth: 230 }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Tác phẩm</th>
                        <th>Thông số & Khởi điểm</th>
                        <th>Thẩm định AI Copilot</th>
                        <th>Trạng thái</th>
                        <th className={`${styles.actionStickyTh} text-right`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArtworks.map((artw) => {
                        const isPending = artw.status === 'pending';
                        const { ai_appraisal } = artw;

                        return (
                          <tr key={artw.id}>
                            {/* Cột 1: Tác phẩm */}
                            <td>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img src={artw.image}
                                  alt={artw.title}
                                  className={`${styles.artThumb} w-11 h-11 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                                  onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                                  loading="lazy"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-slate-900 text-sm truncate" title={artw.title}>{artw.title}</div>
                                  <div className="text-xs text-slate-600 truncate" title={`${artw.artist_name} • ${artw.year || artw.creation_year}`}>{artw.artist_name} • {artw.year || artw.creation_year}</div>
                                  <div className="text-[11px] text-slate-400 truncate">{artw.certificate_status || 'Độc bản chứng thực'}</div>
                                </div>
                              </div>
                            </td>

                            {/* Cột 2: Thông số & Giá */}
                            <td>
                              <div className="text-sm font-extrabold text-emerald-700">
                                {formatVND(artw.starting_price)}
                              </div>
                              <div className="text-xs text-slate-600 mt-1 truncate" title={`${artw.dimensions} • ${artw.medium}`}>
                                {artw.dimensions} • {artw.medium}
                              </div>
                              <button
                                type="button"
                                className={styles.btnViewMini}
                                style={{ marginTop: 6 }}
                                onClick={() => setDetailModal({ open: true, type: 'artwork_proof', item: artw })}
                              >
                                <Eye size={13} /> Vệt cọ thật
                              </button>
                            </td>

                            {/* Cột 3: AI Thẩm định */}
                            <td>
                              <div className={styles.aiTableBlock}>
                                <div className={styles.aiBadgeRow}>
                                  <span className={styles.aiMatchPill}>
                                    <Sparkles size={12} /> {ai_appraisal.originality_score}
                                  </span>
                                  <span className={styles.aiTrustPill}>Vệt cọ vật lý</span>
                                </div>
                                <p className={styles.aiSummaryTruncate} title={ai_appraisal.brushstroke_verdict || ai_appraisal.spectral_info}>
                                  {ai_appraisal.brushstroke_verdict || ai_appraisal.spectral_info}
                                </p>
                                <div className="text-xs text-slate-500 mt-1 truncate">
                                  Rủi ro: <strong className="text-emerald-800">{ai_appraisal.plagiarism_risk}</strong>
                                </div>
                              </div>
                            </td>

                            {/* Cột 4: Trạng thái */}
                            <td>
                              {artw.status === 'approved' && (
                                <span className={styles.badgeApproved}><Check size={13} /> Đã duyệt</span>
                              )}
                              {artw.status === 'pending' && (
                                <span className={styles.badgePending}><Clock size={13} /> Chờ thẩm định</span>
                              )}
                              {artw.status === 'rejected' && (
                                <span className={styles.badgeRejected}><X size={13} /> Đã từ chối</span>
                              )}
                            </td>

                            {/* Cột 5: Thao tác */}
                            <td className={`${styles.actionStickyTd} text-right`}>
                              <div className={styles.compactActionGroup}>
                                {isPending ? (
                                  <>
                                    <button
                                      type="button"
                                      className={styles.btnAiMini}
                                      onClick={() => handleQuickApproveAi(artw)}
                                      title="Duyệt nhanh theo khuyến nghị AI (Điểm 100%)"
                                    >
                                      <Zap size={13} /> AI Duyệt
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.btnRejectMini}
                                      onClick={() => handleOpenReject('artwork', artw)}
                                      title="Từ chối tác phẩm"
                                    >
                                      <X size={13} /> Từ chối
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.btnApproveMini}
                                      onClick={() => handleApproveArtwork(artw.id)}
                                      title="Phê duyệt thủ công"
                                    >
                                      <Check size={13} /> Duyệt
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className={styles.btnViewMini}
                                    onClick={() => setDetailModal({ open: true, type: 'artwork_proof', item: artw })}
                                  >
                                    <Eye size={13} /> Chi tiết
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARD GRID DÀNH CHO MOBILE & TABLET (block lg:hidden) */}
              <div className={`${styles.mobileCardList} block lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                {filteredArtworks.map((artw) => {
                  const isPending = artw.status === 'pending';
                  const { ai_appraisal } = artw;

                  return (
                    <div key={`m_artw_${artw.id}`} className={styles.mobileCard}>
                      <div className={styles.mobileCardHeader}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">

                          <img src={artw.image}
                            alt={artw.title}
                            className={`${styles.artThumbMobile} w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                            onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`${styles.mobileCardTitle} truncate`} title={artw.title}>{artw.title}</h4>
                            <p className={`${styles.mobileCardSubtitle} truncate`} title={artw.artist_name}>{artw.artist_name} • {artw.creation_year}</p>
                            <span className={styles.aiMatchPill}>{ai_appraisal.originality_score}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {artw.status === 'pending' && <span className={styles.badgePending}>Chờ duyệt</span>}
                          {artw.status === 'approved' && <span className={styles.badgeApproved}>Đã duyệt</span>}
                          {artw.status === 'rejected' && <span className={styles.badgeRejected}>Đã từ chối</span>}
                        </div>
                      </div>

                      <div className={styles.mobileCardBody}>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>Giá khởi điểm:</span>
                          <span className="font-extrabold text-emerald-700 text-sm">{formatVND(artw.starting_price)}</span>
                        </div>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>Kích thước:</span>
                          <span className={`${styles.mobileCardValue} truncate max-w-[160px]`} title={artw.dimensions}>{artw.dimensions}</span>
                        </div>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>Chất liệu:</span>
                          <span className={`${styles.mobileCardValue} truncate max-w-[160px]`} title={artw.medium}>{artw.medium}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1" title={ai_appraisal.brushstroke_verdict}>
                          {ai_appraisal.brushstroke_verdict}
                        </p>
                      </div>

                      <div className={`${styles.mobileCardFooter} flex flex-wrap items-center gap-2`}>
                        <button
                          type="button"
                          className={styles.btnViewMini}
                          onClick={() => setDetailModal({ open: true, type: 'artwork_proof', item: artw })}
                        >
                          <Eye size={13} /> Vệt cọ
                        </button>
                        {isPending && (
                          <>
                            <button
                              type="button"
                              className={styles.btnAiMini}
                              onClick={() => handleQuickApproveAi(artw)}
                            >
                              <Zap size={13} /> AI Duyệt
                            </button>
                            <button
                              type="button"
                              className={styles.btnRejectMini}
                              onClick={() => handleOpenReject('artwork', artw)}
                            >
                              <X size={13} /> Từ chối
                            </button>
                            <button
                              type="button"
                              className={styles.btnApproveMini}
                              onClick={() => handleApproveArtwork(artw.id)}
                            >
                              <Check size={13} /> Duyệt
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              3. TRANG "KÝ QUỸ & GIẢI NGÂN" (DUAL PATTERN)
              ==================================================================== */}
          {activeTab === 'escrow' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrap}>
                  <h3>
                    <Building2 size={20} color="#047857" />
                    Giám Sát Ký Quỹ (Escrow) & Lệnh Giải Ngân
                  </h3>
                  <p>
                    Kiểm tra trạng thái giao nhận thực tế và đối soát biên bản bàn giao có chữ ký trước khi giải phóng tiền.
                  </p>
                </div>
              </div>

              {/* BẢNG DÀNH CHO MÀN HÌNH DESKTOP (hidden lg:block) */}
              <div className={`${styles.desktopTableView} hidden lg:block`}>
                <div className={styles.tableResponsive}>
                  <table className={`${styles.adminTable} w-full table-fixed`}>
                    <colgroup>
                      <col style={{ width: '22%', minWidth: 175 }} />
                      <col style={{ width: '17%', minWidth: 135 }} />
                      <col style={{ width: '15%', minWidth: 125 }} />
                      <col style={{ width: '20%', minWidth: 165 }} />
                      <col style={{ width: '12%', minWidth: 115 }} />
                      <col style={{ width: '14%', minWidth: 145 }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Mã đơn & Tác phẩm</th>
                        <th>Họa sĩ nhận tiền</th>
                        <th>Số tiền giải ngân</th>
                        <th>Đối soát AI Copilot</th>
                        <th>Trạng thái</th>
                        <th className={`${styles.actionStickyTh} text-right`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disbursements.map((d) => {
                        const isPending = d.status === 'pending';

                        return (
                          <tr key={d.order_id}>
                            {/* Cột 1: Mã đơn & Phiên kèm ảnh tác phẩm */}
                            <td>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img src={d.artwork_image}
                                  alt={d.artwork_title}
                                  className={`${styles.artThumb} w-11 h-11 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                                  onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                                  loading="lazy"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-mono text-xs font-bold text-slate-900">
                                    #{d.order_id}
                                  </div>
                                  <div className="text-xs text-slate-700 font-semibold truncate" title={d.artwork_title}>
                                    {d.artwork_title}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    Hoàn tất: {d.completed_at}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Cột 2: Họa sĩ */}
                            <td>
                              <div className="text-xs font-bold text-slate-900 truncate" title={d.artist_name}>
                                {d.artist_name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate" title={d.artist_bank}>
                                {d.artist_bank}
                              </div>
                            </td>

                            {/* Cột 3: Số tiền */}
                            <td>
                              <div className="text-sm font-extrabold text-emerald-700">
                                {formatVND(d.payout_amount)}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Phí sàn: {formatVND(d.platform_fee)}
                              </div>
                            </td>

                            {/* Cột 4: AI Đối soát */}
                            <td>
                              <div className={styles.aiTableBlock}>
                                <span className={styles.aiMatchPill}>✓ Đạt chuẩn 72h</span>
                                <p className={styles.aiSummaryTruncate} title={d.note}>
                                  {d.note}
                                </p>
                              </div>
                            </td>

                            {/* Cột 5: Trạng thái */}
                            <td>
                              {d.status === 'disbursed' ? (
                                <span className={styles.badgeApproved}><Check size={13} /> Đã giải ngân</span>
                              ) : (
                                <span className={styles.badgePending}><Clock size={13} /> Chờ duyệt chi</span>
                              )}
                            </td>

                            {/* Cột 6: Thao tác */}
                            <td className={`${styles.actionStickyTd} text-right`}>
                              <div className={styles.compactActionGroup}>
                                {isPending ? (
                                  <button
                                    type="button"
                                    className={styles.btnApproveMini}
                                    onClick={() => handleOpenPayoutConfirm(d)}
                                    title="Mở cửa sổ xác nhận an toàn trước khi giải ngân"
                                  >
                                    <DollarSign size={13} /> Duyệt giải ngân
                                  </button>
                                ) : (
                                  <span className="text-xs font-bold text-emerald-700">
                                    ✓ Hoàn tất
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARD GRID DÀNH CHO MOBILE & TABLET (block lg:hidden) */}
              <div className={`${styles.mobileCardList} block lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                {disbursements.map((d) => {
                  const isPending = d.status === 'pending';

                  return (
                    <div key={`m_esc_${d.order_id}`} className={styles.mobileCard}>
                      <div className={styles.mobileCardHeader}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">

                          <img src={d.artwork_image}
                            alt={d.artwork_title}
                            className={`${styles.artThumbMobile} w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square`}
                            onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`${styles.mobileCardTitle} font-mono text-sm`} title={d.order_id}>#{d.order_id}</h4>
                            <p className={`${styles.mobileCardSubtitle} truncate`} title={d.artwork_title}>{d.artwork_title}</p>
                            <p className={`${styles.mobileCardMeta} truncate`} title={d.artist_name}>{d.artist_name}</p>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {isPending ? (
                            <span className={styles.badgePending}>Chờ duyệt chi</span>
                          ) : (
                            <span className={styles.badgeApproved}>Đã giải ngân</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.mobileCardBody}>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>Số tiền nhận:</span>
                          <span className="font-extrabold text-emerald-700 text-sm">
                            {formatVND(d.payout_amount)}
                          </span>
                        </div>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>Ngân hàng:</span>
                          <span className={`${styles.mobileCardValue} truncate max-w-[160px]`} title={d.artist_bank}>{d.artist_bank}</span>
                        </div>
                        <div className={styles.mobileCardRow}>
                          <span className={styles.mobileCardLabel}>Đối soát AI:</span>
                          <span className={styles.aiMatchPill}>✓ Đạt chuẩn 72h</span>
                        </div>
                      </div>

                      <div className={`${styles.mobileCardFooter} flex flex-wrap items-center gap-2`}>
                        {isPending && (
                          <button
                            type="button"
                            className={styles.btnApproveMini}
                            onClick={() => handleOpenPayoutConfirm(d)}
                          >
                            <DollarSign size={13} /> Duyệt giải ngân {formatVND(d.payout_amount)}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              4. TRANG "XỬ LÝ KHIẾU NẠI & TRANH CHẤP" (DUAL PATTERN)
              ==================================================================== */}
          {/* ====================================================================
              4. TRANG "XỬ LÝ KHIẾU NẠI & TRANH CHẤP" - MASTER-DETAIL WORKSPACE (2 CỘT)
              ==================================================================== */}
          {/* ====================================================================
              4. TRANG "XỬ LÝ KHIẾU NẠI & TRANH CHẤP" - SPLIT-VIEW WORKSPACE (ZERO HORIZONTAL SCROLL)
              ==================================================================== */}
                    {/* ====================================================================
              4. TRANG "XỬ LÝ KHIẾU NẠI & TRANH CHẤP" - MASTER-DETAIL WORKSPACE (2 CỘT)
              ==================================================================== */}
          {activeTab === 'disputes' && (
            <div className={`${styles.disputeWorkspaceWrapper || ''} w-full h-[calc(100vh-6.5rem)] flex flex-col gap-4 overflow-hidden`}>
              
              {/* Header thanh công cụ không gian phán quyết */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-1 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 truncate">
                      Không Gian Phán Quyết Tranh Chấp & Khiếu Nại
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
                        {openDisputesCount} ca cần xử lý
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 truncate">
                      Mô hình Thẩm định 2 Cột (Split-View Workspace) • Cơ chế Bảo hộ Ký quỹ Escrow 72h
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden md:inline text-xs text-slate-500 font-medium">Bảo vệ quyền lợi song phương:</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span>AI Copilot 99.1% đối chứng</span>
                  </div>
                </div>
              </div>

              {/* BỐ CỤC 2 CỘT MASTER - DETAIL */}
              <div className={`${styles.disputeWorkspaceSplit || ''} flex-1 flex flex-col xl:flex-row gap-4 min-h-0 overflow-hidden`}>
                
                {/* ── CỘT BÊN TRÁI: DANH SÁCH CA KHIẾU NẠI (MASTER LIST) ── */}
                <div className={`${styles.disputeMasterList || ''} w-full xl:w-80 2xl:w-96 shrink-0 xl:h-full overflow-y-auto pr-1 flex flex-col gap-3`}>
                  <div className="flex items-center justify-between px-1 shrink-0">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Danh sách hồ sơ ({disputes.length})
                    </span>
                    <span className="text-[11px] text-slate-400">Bấm chọn để thẩm định</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                    {disputes.map((disp) => {
                      const isSelected = selectedDispute?.dispute_id === disp.dispute_id;
                      const isOpen = disp.status === 'open';

                      return (
                        <div
                          key={disp.dispute_id}
                          onClick={() => setSelectedDisputeId(disp.dispute_id)}
                          className={`${styles.disputeMasterCard || ''} ${isSelected ? styles.disputeMasterCardActive : ''} rounded-xl border p-3.5 cursor-pointer transition-all flex flex-col gap-2.5 select-none ${
                            isSelected
                              ? 'bg-amber-50/60 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                              : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Hàng 1: Mã hồ sơ & Huy hiệu lý do */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              #{disp.dispute_id}
                            </span>
                            {isOpen ? (
                              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full truncate max-w-[170px]" title={disp.issue_type}>
                                ⚠️ {disp.issue_type}
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                ✓ Đã phán quyết
                              </span>
                            )}
                          </div>

                          {/* Hàng 2: Thumbnail & Chi tiết tác phẩm / Người khiếu nại */}
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={disp.artwork_image}
                              alt={disp.artwork_title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 bg-slate-100 aspect-square shadow-xs"
                              onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <h4 className="font-bold text-slate-900 text-sm truncate" title={disp.artwork_title}>
                                {disp.artwork_title}
                              </h4>
                              <p className="text-xs text-slate-600 truncate" title={disp.collector_name}>
                                Khách: <span className="font-semibold text-slate-800">{disp.collector_name}</span>
                              </p>
                              <p className="text-[11px] text-slate-500 truncate" title={disp.artist_name}>
                                Họa sĩ: {disp.artist_name}
                              </p>
                            </div>
                          </div>

                          {/* Hàng 3: Tiền Escrow đóng băng & Thời gian */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Ký quỹ Escrow</span>
                              <span className="text-sm font-extrabold text-rose-700">
                                {formatVND(disp.escrow_amount)}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 text-right truncate max-w-[150px]">
                              {disp.submitted_at}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── CỘT BÊN PHẢI: KHÔNG GIAN THẨM ĐỊNH & PHÁN QUYẾT (DETAIL WORKSPACE) ── */}
                {selectedDispute ? (
                  <div className={`${styles.disputeDetailWorkspace || ''} flex-1 min-w-0 h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 overflow-y-auto space-y-6 flex flex-col justify-between`}>
                    
                    <div className="space-y-6">
                      {/* PHÂN KHU 1: TIÊU ĐỀ CA & DÒNG TIỀN KÝ QUỸ */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                        <div className="space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                              #{selectedDispute.dispute_id}
                            </span>
                            <span className="font-mono text-xs text-slate-500">
                              Đơn hàng: {selectedDispute.order_id}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              <Clock size={12} /> Thời hạn bảo hộ: {selectedDispute.submitted_at}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                            {selectedDispute.artwork_title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                            <div>
                              Người khiếu nại: <strong className="text-slate-900 font-semibold">{selectedDispute.collector_name}</strong>
                              {selectedDispute.collector_phone && <span className="text-slate-400"> ({selectedDispute.collector_phone})</span>}
                            </div>
                            <div className="h-3 w-px bg-slate-300 hidden sm:block" />
                            <div>
                              Họa sĩ đăng bán: <strong className="text-slate-900 font-semibold">{selectedDispute.artist_name}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Thẻ hiển thị số tiền Ký quỹ Escrow đang đóng băng */}
                        <div className="shrink-0 flex flex-col items-start md:items-end bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-xl">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                            Số tiền Ký quỹ Escrow đang đóng băng
                          </span>
                          <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-tight mt-0.5">
                            {formatVND(selectedDispute.escrow_amount)}
                          </span>
                          <span className="text-[11px] text-emerald-600/90 font-medium mt-0.5">
                            🔒 Phong tỏa tại ngân hàng lưu ký đối tác
                          </span>
                        </div>
                      </div>

                      {/* PHÂN KHU 2: ĐỐI SÁNH BẰNG CHỨNG HIỆN VẬT (EVIDENCE COMPARISON GRID) */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <span>Đối sánh Bằng chứng Hiện vật (Evidence Comparison)</span>
                          </h4>
                          <span className="text-xs text-slate-500">Đối chiếu ảnh thực tế vs Hồ sơ đăng bán gốc</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Khung 1: Ảnh thực tế khiếu nại từ khách hàng */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-200">
                                ⚠️ Ảnh thực tế khiếu nại (Khách gửi)
                              </span>
                              <button
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                onClick={() => setDetailModal({ open: true, type: 'dispute_proof', item: selectedDispute })}
                              >
                                <Eye size={12} /> Xem phóng to
                              </button>
                            </div>

                            <div className="w-full flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200/80">
                              <img
                                src={selectedDispute.evidence_images?.[0] || selectedDispute.artwork_image}
                                alt="Ảnh thực tế khiếu nại"
                                className={`${styles.comparisonImg || ''} w-44 h-44 rounded-xl object-cover border border-slate-200 shadow-inner shrink-0`}
                                onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                                loading="lazy"
                              />
                            </div>

                            <div className="text-xs text-slate-700 bg-rose-50/70 border border-rose-200/80 p-2.5 rounded-lg leading-relaxed">
                              <strong className="text-rose-800">Mô tả hiện trạng:</strong> {selectedDispute.issue_desc}
                            </div>
                          </div>

                          {/* Khung 2: Ảnh gốc họa sĩ đăng bán */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                                ✓ Ảnh gốc Họa sĩ đăng bán (SHA-256)
                              </span>
                              <button
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                onClick={() => setDetailModal({ open: true, type: 'artwork_proof', item: selectedDispute })}
                              >
                                <Eye size={12} /> Xem ảnh gốc
                              </button>
                            </div>

                            <div className="w-full flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200/80">
                              <img
                                src={selectedDispute.artwork_image}
                                alt="Ảnh gốc họa sĩ"
                                className={`${styles.comparisonImg || ''} w-44 h-44 rounded-xl object-cover border border-slate-200 shadow-inner shrink-0`}
                                onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                                loading="lazy"
                              />
                            </div>

                            <div className="text-xs text-slate-700 bg-slate-100/80 border border-slate-200 p-2.5 rounded-lg leading-relaxed">
                              <strong className="text-slate-800">Chính sách bảo hộ:</strong> {selectedDispute.insurance_policy}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PHÂN KHU 3: TRỢ LÝ AI PHÂN TÍCH & KHUYẾN NGHỊ (AI COPILOT INSIGHT) */}
                      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                              <Sparkles size={15} />
                            </div>
                            <span className="text-sm font-bold text-indigo-950">
                              AI Copilot Thẩm định: Phân tích & Khuyến nghị
                            </span>
                          </div>
                          <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-xs">
                            Độ tin cậy kết luận: 99.1%
                          </span>
                        </div>

                        <div className="text-xs text-indigo-800/90 font-medium">
                          📊 <strong>Dữ liệu đã quét:</strong> {selectedDispute.ai_summary.evidence_analyzed}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {/* Kết luận thẩm định */}
                          <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-xs space-y-1">
                            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">
                              Kết luận thẩm định AI
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {selectedDispute.ai_summary.conclusion}
                            </p>
                          </div>

                          {/* Đề xuất xử lý tài chính */}
                          <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-xs space-y-1">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                              Đề xuất dòng tiền Ký quỹ Escrow
                            </span>
                            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                              {selectedDispute.ai_summary.fund_proposal}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PHÂN KHU 4: BẢNG ĐIỀU KHIỂN QUYẾT ĐỊNH CỦA QUẢN TRỊ VIÊN (ACTION PANEL) */}
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Phán quyết chính thức của Quản trị viên trực ban
                        </span>
                        {selectedDispute.status === 'resolved' && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            ✓ Đã phán quyết & thực thi giải ngân
                          </span>
                        )}
                      </div>

                      {selectedDispute.status === 'resolved' ? (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-medium">
                          <span>
                            Lệnh thực thi: <strong>{selectedDispute.resolution_note || 'Đã áp dụng phán quyết giải tỏa ký quỹ.'}</strong>
                          </span>
                          <span className="text-[11px] text-emerald-600 font-mono">Trạng thái: COMPLETED</span>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          {/* Nút chính (Primary): Chấp thuận đề xuất AI */}
                          <button
                            type="button"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm"
                            onClick={() => handleApplyAiDisputeResolution(selectedDispute)}
                          >
                            <Zap size={16} />
                            <span>Chấp thuận đề xuất AI (Hoàn tiền cho khách)</span>
                          </button>

                          {/* Nút phụ (Secondary): Bác bỏ khiếu nại (Giải ngân cho Họa sĩ) */}
                          <button
                            type="button"
                            className="border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm"
                            onClick={() => handleRejectDisputeAndReleaseEscrow(selectedDispute)}
                          >
                            <XCircle size={16} />
                            <span>Bác bỏ khiếu nại (Giải ngân cho Họa sĩ)</span>
                          </button>

                          {/* Nút thứ ba: Yêu cầu bên thứ 3 giám định lại */}
                          <button
                            type="button"
                            className="border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm"
                            onClick={() => handleRequestThirdPartyAppraisal(selectedDispute)}
                          >
                            <Search size={15} />
                            <span>Yêu cầu bên thứ 3 giám định</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 h-full bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <AlertTriangle size={36} className="text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">Chưa chọn ca khiếu nại nào</p>
                    <p className="text-xs">Vui lòng chọn 1 ca từ danh sách bên trái để tiến hành thẩm định</p>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </main>

      {/* ====================================================================
          HỆ THỐNG CỬA SỔ MODAL QUẢN TRỊ
          ==================================================================== */}

      {/* MODAL 1: BÁO CÁO ĐỐI SOÁT AI CHI TIẾT CỦA HỌA SĨ */}
      {aiReportModal.open && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalBox} ${styles.modalBoxWide} max-w-2xl w-full`}>
            <div className={styles.modalHeader}>
              <div className="flex items-center gap-2">
                <Sparkles size={20} color="#4338CA" />
                <h3 className="m-0 text-base font-extrabold text-slate-900">
                  Báo cáo Phân tích AI Copilot: {aiReportModal.artist?.full_name}
                </h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setAiReportModal({ open: false, artist: null })}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 font-bold uppercase">Khớp dữ liệu CCCD</div>
                  <div className="text-xl text-emerald-800 font-extrabold">
                    {aiReportModal.artist?.ai_analysis.cccd_match_rate}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 font-bold uppercase">Điểm tín nhiệm</div>
                  <div className="text-xl text-amber-800 font-extrabold">
                    {aiReportModal.artist?.ai_analysis.trust_score}/100
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 font-bold uppercase">Mức độ rủi ro</div>
                  <div className="text-xl text-emerald-800 font-extrabold">
                    {aiReportModal.artist?.ai_analysis.risk_label}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-extrabold text-slate-900 mb-2">
                  Danh mục kiểm tra tự động (AI eKYC Checklist):
                </h4>
                {aiReportModal.artist?.ai_analysis.checklist.map((item, idx) => (
                  <div key={idx} className={styles.aiCheckItem}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.note}</div>
                    </div>
                    <span className={styles.badgeApproved}>
                      <CheckCircle2 size={14} /> Hợp lệ
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <p className="m-0 text-xs text-indigo-950 font-medium leading-relaxed">
                  <strong>Nhận định hệ thống:</strong> {aiReportModal.artist?.ai_analysis.summary}
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnViewMini}
                onClick={() => setAiReportModal({ open: false, artist: null })}
              >
                Đóng
              </button>
              {aiReportModal.artist?.status === 'pending' && (
                <button
                  type="button"
                  className={styles.btnApproveMini}
                  onClick={() => {
                    handleApproveArtist(aiReportModal.artist.id);
                    setAiReportModal({ open: false, artist: null });
                  }}
                >
                  <Check size={14} /> Duyệt hồ sơ ngay
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TỪ CHỐI */}
      {rejectModal.open && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalBox} max-w-lg w-full`}>
            <div className={styles.modalHeader}>
              <h3 className="m-0 text-base font-extrabold text-slate-900">
                Từ chối {rejectModal.type === 'artist' ? 'Hồ sơ Họa sĩ' : 'Tác phẩm nghệ thuật'}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setRejectModal({ open: false, type: '', item: null, reason: '' })}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmReject}>
              <div className={styles.modalBody}>
                <p className="m-0 mb-3 text-xs text-slate-700 leading-relaxed">
                  Vui lòng cung cấp lý do từ chối rõ ràng để gửi văn bản thông báo hướng dẫn bổ sung cho {rejectModal.type === 'artist' ? `Họa sĩ ${rejectModal.item?.full_name}` : `tác phẩm "${rejectModal.item?.title}"`}:
                </p>

                <textarea
                  className={styles.textareaField}
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Nhập lý do chi tiết..."
                  required
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnViewMini}
                  onClick={() => setRejectModal({ open: false, type: '', item: null, reason: '' })}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className={styles.btnRejectMini}
                >
                  Xác nhận Từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: XEM CHI TIẾT CCCD HOẶC GIÁM ĐỊNH VỆT CỌ THẬT */}
      {detailModal.open && (
        <div className={styles.modalOverlay} onClick={() => setDetailModal({ open: false, type: '', item: null })}>
          {detailModal.type === 'artwork_proof' ? (
            /* ── GIÁM ĐỊNH VỆT CỌ VẬT LÝ & ĐỘC BẢN CHUYÊN SÂU (FINE ART EXAMINATION SUITE) ── */
            <div className={styles.brushModalBox} onClick={(e) => e.stopPropagation()}>
              <div className={styles.brushModalHeader}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 text-base font-extrabold text-slate-900 truncate">
                      Giám định Vệt cọ & Bề mặt: {detailModal.item?.title}
                    </h3>
                    <p className="m-0 text-xs text-slate-500 truncate">
                      Họa sĩ: <strong className="text-slate-800">{detailModal.item?.artist_name}</strong> • {detailModal.item?.artist_badge}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ 100% Vệt cọ thật (0% AI)
                  </span>
                  <button
                    type="button"
                    className={styles.modalCloseBtn}
                    onClick={() => setDetailModal({ open: false, type: '', item: null })}
                    aria-label="Đóng"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className={styles.brushModalBody}>
                {/* CỘT TRÁI: KHUNG SOI VỆT CỌ & KÍNH LÚP QUANG HỌC */}
                <div className={styles.brushViewerCol}>
                  <div
                    ref={canvasContainerRef}
                    className={styles.brushCanvasWrap}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseEnter={() => setIsHoveringCanvas(true)}
                    onMouseLeave={() => setIsHoveringCanvas(false)}
                    onTouchMove={handleCanvasTouchMove}
                    onTouchStart={handleCanvasTouchMove}
                    onTouchEnd={() => setIsHoveringCanvas(false)}
                  >
                    <div
                      className={styles.brushCanvasInner}
                      style={{
                        transform: `scale(${canvasZoomLevel})`,
                        transformOrigin: `${loupeCoords.percentX}% ${loupeCoords.percentY}%`,
                        transition: isHoveringCanvas ? 'none' : 'transform 0.25s ease',
                      }}
                    >
                      <img
                        src={getArtworkDisplayImage(detailModal.item, brushViewMode)}
                        alt={detailModal.item?.title}
                        className={styles.brushCanvasImg}
                        onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                      />
                    </div>
                    
                    {/* Huy hiệu hiển thị chế độ soi */}
                    <div className={styles.brushMacroBadge}>
                      {brushViewMode === 'macro' ? (
                        <>
                          <Sparkles size={13} className="text-amber-400" />
                          <span>
                            {ARTWORK_MACRO_TEXTURES[detailModal.item?.id]?.macro_name || 'Kính hiển vi: Độ nổi vệt sơn 3-8mm'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Eye size={13} className="text-sky-400" />
                          <span>Toàn cảnh bố cục tác phẩm ({detailModal.item?.dimensions})</span>
                        </>
                      )}
                    </div>

                    {/* HUD Tọa độ & thông số quang học */}
                    <div className={styles.brushHudBar}>
                      <span>X:{Math.round(loupeCoords.percentX)}% Y:{Math.round(loupeCoords.percentY)}%</span>
                      <span className={styles.brushHudDivider}>•</span>
                      <span>
                        {isLoupeActive
                          ? `Kính lúp: ${(3.5 * canvasZoomLevel).toFixed(1)}×`
                          : `Zoom: ${Math.round(canvasZoomLevel * 100)}%`}
                      </span>
                      <span className={styles.brushHudDivider}>•</span>
                      <span className="text-emerald-400 font-bold">100% Sợi vật lý</span>
                    </div>

                    {/* KÍNH LÚP QUANG HỌC DI ĐỘNG (LOUPE LENS) */}
                    {isLoupeActive && isHoveringCanvas && (
                      <div
                        className={styles.loupeLens}
                        style={{
                          left: `${loupeCoords.x}px`,
                          top: `${loupeCoords.y}px`,
                          backgroundImage: `url(${getArtworkDisplayImage(detailModal.item, brushViewMode)})`,
                          backgroundPosition: `${loupeCoords.percentX}% ${loupeCoords.percentY}%`,
                          backgroundSize: `${350 * canvasZoomLevel}%`,
                        }}
                      >
                        <div className={styles.loupeCrosshairH} />
                        <div className={styles.loupeCrosshairV} />
                        <div className={styles.loupeReticleCircle} />
                        <span className={styles.loupeScaleTag}>
                          {(3.5 * canvasZoomLevel).toFixed(1)}× LOUPE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* THANH ĐIỀU KHIỂN: CHẾ ĐỘ SOI + BẬT/TẮT KÍNH LÚP + CỤM NÚT ZOOM */}
                  <div className={styles.brushControlBar}>
                    {/* Chuyển đổi Vi mô (Macro) vs Toàn cảnh */}
                    <div className={styles.brushViewToggleBar}>
                      <button
                        type="button"
                        className={`${styles.brushToggleBtn} ${brushViewMode === 'macro' ? styles.brushToggleBtnActive : ''}`}
                        onClick={() => setBrushViewMode('macro')}
                      >
                        <Sparkles size={14} className={brushViewMode === 'macro' ? 'text-amber-500' : ''} />
                        Soi vệt cọ vi mô (Macro)
                      </button>
                      <button
                        type="button"
                        className={`${styles.brushToggleBtn} ${brushViewMode === 'full' ? styles.brushToggleBtnActive : ''}`}
                        onClick={() => setBrushViewMode('full')}
                      >
                        <Eye size={14} className={brushViewMode === 'full' ? 'text-sky-600' : ''} />
                        Toàn cảnh tranh
                      </button>
                    </div>

                    {/* Cụm điều khiển Kính lúp & Zoom */}
                    <div className={styles.brushZoomToolbar}>
                      <button
                        type="button"
                        className={`${styles.loupeToggleBtn} ${isLoupeActive ? styles.loupeToggleBtnActive : ''}`}
                        onClick={() => setIsLoupeActive(!isLoupeActive)}
                        title="Bật hoặc tắt kính lúp di động"
                      >
                        <Search size={14} />
                        <span>{isLoupeActive ? 'Kính lúp: BẬT' : 'Kính lúp: TẮT'}</span>
                      </button>

                      <div className={styles.zoomButtonGroup}>
                        <button
                          type="button"
                          className={styles.zoomBtn}
                          onClick={handleZoomOut}
                          disabled={canvasZoomLevel <= 1}
                          title="Thu nhỏ khung tranh"
                        >
                          <ZoomOut size={14} />
                        </button>
                        <span className={styles.zoomLevelPill}>
                          {Math.round(canvasZoomLevel * 100)}%
                        </span>
                        <button
                          type="button"
                          className={styles.zoomBtn}
                          onClick={handleZoomIn}
                          disabled={canvasZoomLevel >= 2.5}
                          title="Phóng to khung tranh"
                        >
                          <ZoomIn size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.zoomBtn}
                          onClick={handleResetZoom}
                          title="Đặt lại kích thước gốc 100%"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hướng dẫn tương tác kính lúp */}
                  <div className={styles.brushGuideHint}>
                    <Search size={14} className="text-amber-600 shrink-0" />
                    <span>
                      {isLoupeActive
                        ? '💡 Rê chuột (hoặc chạm ngón tay trên iPad) lướt trên mặt tranh để di chuyển Kính lúp 3.5× soi thấu độ dày vệt cọ & sớ vải toan.'
                        : '💡 Kính lúp đang tắt. Nhấn nút "Kính lúp: BẬT" để kích hoạt chế độ soi vi mô 3.5× hoặc dùng nút [+] [-] để zoom toàn tranh.'}
                    </span>
                  </div>
                </div>

                {/* CỘT PHẢI: THÔNG SỐ GIÁM ĐỊNH & PHÂN TÍCH AI COPILOT */}
                <div className={styles.brushInfoCol}>
                  <div className="space-y-4">
                    {/* Bảng thông số tác phẩm */}
                    <div className={styles.brushMetaGrid}>
                      <div className={styles.brushMetaCell}>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Khởi điểm</span>
                        <strong className="text-sm font-extrabold text-emerald-700">
                          {formatVND(detailModal.item?.starting_price)}
                        </strong>
                      </div>
                      <div className={styles.brushMetaCell}>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Kích thước</span>
                        <strong className="text-xs font-bold text-slate-800">
                          {detailModal.item?.dimensions}
                        </strong>
                      </div>
                      <div className={styles.brushMetaCell} style={{ gridColumn: 'span 2' }}>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Chất liệu & Năm sáng tác</span>
                        <p className="text-xs font-semibold text-slate-800 m-0">
                          {detailModal.item?.medium} ({detailModal.item?.creation_year})
                        </p>
                      </div>
                    </div>

                    {/* Hộp phân tích AI Copilot bảo chứng */}
                    <div className={styles.brushAiVerdictBox}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                          <Sparkles size={14} className="text-emerald-600" />
                          <span>Đối soát Quang phổ & AI Copilot</span>
                        </div>
                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                          {detailModal.item?.ai_appraisal?.originality_score || '99.8%'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 m-0 leading-relaxed">
                        • <strong>Quang phổ màu:</strong> {detailModal.item?.ai_appraisal?.spectral_info}
                      </p>
                      <p className="text-xs text-slate-700 m-0 leading-relaxed">
                        • <strong>Rủi ro đạo nhái:</strong> <span className="text-emerald-700 font-semibold">{detailModal.item?.ai_appraisal?.plagiarism_risk || 'Cực thấp (0.2%)'}</span>
                      </p>
                      <p className="text-xs text-slate-700 m-0 leading-relaxed">
                        • <strong>Kỹ thuật vệt sơn:</strong> {detailModal.item?.description}
                      </p>

                      {ARTWORK_MACRO_TEXTURES[detailModal.item?.id]?.zoom_hint && (
                        <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 m-0 leading-relaxed font-medium">
                          🔍 <strong>Ghi chú kính lúp:</strong> {ARTWORK_MACRO_TEXTURES[detailModal.item?.id]?.zoom_hint}
                        </p>
                      )}

                      <div className="mt-1 pt-2 border-t border-emerald-200/60 text-xs font-semibold text-emerald-800">
                        {detailModal.item?.ai_appraisal?.ai_recommendation}
                      </div>
                    </div>
                  </div>

                  {/* Hành động phê duyệt trực tiếp trong modal */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-mono">
                      #{detailModal.item?.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={styles.btnRejectMini}
                        onClick={() => {
                          const target = detailModal.item;
                          setDetailModal({ open: false, type: '', item: null });
                          handleOpenReject('artwork', target);
                        }}
                      >
                        <X size={13} /> Từ chối
                      </button>
                      <button
                        type="button"
                        className={styles.btnApproveMini}
                        onClick={() => {
                          const target = detailModal.item;
                          handleApproveArtwork(target.id);
                          setDetailModal({ open: false, type: '', item: null });
                        }}
                      >
                        <Check size={13} /> Phê duyệt tác phẩm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── MODAL XEM CCCD (ARTIST ID) ── */
            <div className={`${styles.modalBox} max-w-xl w-full`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className="m-0 text-base font-extrabold text-slate-900 truncate">
                  Tài liệu định danh: {detailModal.item?.full_name}
                </h3>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setDetailModal({ open: false, type: '', item: null })}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <p className="text-xs text-slate-600 mb-3">
                  Ảnh chụp CCCD 2 mặt dùng để đối soát eKYC cấp độ L3 dành riêng cho vai trò Họa sĩ:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">Mặt trước:</p>
                    <img
                      src={detailModal.item?.id_card_front}
                      alt="Mặt trước CCCD"
                      className="w-full h-44 object-cover rounded-lg border border-slate-200 bg-slate-100"
                      onError={(e) => handleImageError(e, FALLBACK_ARTIST_IMAGE)}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">Mặt sau:</p>
                    <img
                      src={detailModal.item?.id_card_back}
                      alt="Mặt sau CCCD"
                      className="w-full h-44 object-cover rounded-lg border border-slate-200 bg-slate-100"
                      onError={(e) => handleImageError(e, FALLBACK_ARTIST_IMAGE)}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnViewMini}
                  onClick={() => setDetailModal({ open: false, type: '', item: null })}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 4: PHÁN QUYẾT KHIẾU NẠI THỦ CÔNG */}
      {disputeModal.open && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalBox} max-w-lg w-full`}>
            <div className={styles.modalHeader}>
              <h3 className="m-0 text-base font-extrabold text-slate-900">
                Xử lý Khiếu nại #{disputeModal.dispute?.dispute_id}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDisputeModal({ open: false, dispute: null, resolution: 'full_refund' })}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmDisputeResolution}>
              <div className={styles.modalBody}>
                <div className="text-sm text-slate-800 mb-3">
                  Tác phẩm: <strong>{disputeModal.dispute?.artwork_title}</strong> • Ký quỹ: <strong className="text-emerald-700 font-extrabold">{formatVND(disputeModal.dispute?.escrow_amount)}</strong>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Phương án giải quyết của Hội đồng Quản trị viên:
                  </label>
                  <select
                    className={`${styles.textareaField} min-h-0 py-2.5 px-3 text-xs`}
                    value={disputeModal.resolution}
                    onChange={(e) => setDisputeModal(prev => ({ ...prev, resolution: e.target.value }))}
                  >
                    <option value="full_refund">Hoàn tiền 100% cho Khách hàng từ quỹ ký quỹ Escrow</option>
                    <option value="repair_insurance">Kích hoạt bảo hiểm phục chế 100% & Bồi thường 30% giá trị</option>
                  </select>
                </div>

                <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
                  Sau khi phán quyết, hệ thống sẽ tự động cập nhật số dư ví ký quỹ và gửi thông báo điện tử có chữ ký số cho cả Họa sĩ và Khách hàng.
                </p>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnViewMini}
                  onClick={() => setDisputeModal({ open: false, dispute: null, resolution: 'full_refund' })}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.btnApproveMini}
                >
                  Xác nhận Phán quyết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 5: XÁC NHẬN AN TOÀN GIẢI NGÂN KÝ QUỸ (ESCROW RELEASE) */}
      {payoutConfirmModal.open && payoutConfirmModal.disbursement && (
        <div className={styles.modalOverlay}>
          <div className={styles.payoutModalBox}>
            {/* Header */}
            <div className={styles.payoutModalHeader}>
              <div className={styles.payoutModalHeaderLeft}>
                <div className={styles.payoutShieldIcon}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className={styles.payoutModalTitle}>
                    Xác nhận Lệnh Giải ngân Escrow
                  </h3>
                  <p className={styles.payoutModalSub}>
                    Mã đơn hàng: #{payoutConfirmModal.disbursement.order_id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.payoutModalClose}
                onClick={() => setPayoutConfirmModal({ open: false, disbursement: null, confirmedAwareness: false })}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className={styles.payoutModalBody}>
              {/* Media Card Tác phẩm */}
              <div className={styles.payoutArtCard}>
                <img
                  src={payoutConfirmModal.disbursement.artwork_image}
                  alt={payoutConfirmModal.disbursement.artwork_title}
                  className={styles.payoutArtThumb}
                  onError={(e) => handleImageError(e, FALLBACK_ART_IMAGE)}
                />
                <div className={styles.payoutArtMeta}>
                  <div className={styles.payoutArtBadge}>
                    <CheckCircle2 size={12} /> Bàn giao hoàn tất ({payoutConfirmModal.disbursement.completed_at})
                  </div>
                  <h4 className={styles.payoutArtTitle} title={payoutConfirmModal.disbursement.artwork_title}>
                    {payoutConfirmModal.disbursement.artwork_title}
                  </h4>
                  <p className={styles.payoutArtArtist}>
                    Họa sĩ: <strong>{payoutConfirmModal.disbursement.artist_name}</strong>
                  </p>
                </div>
              </div>

              {/* Receipt Breakdown */}
              <div className={styles.payoutReceiptCard}>
                <div className={styles.payoutReceiptRow}>
                  <span className={styles.payoutReceiptLabel}>Họa sĩ thụ hưởng:</span>
                  <span className={styles.payoutReceiptVal}>{payoutConfirmModal.disbursement.artist_name}</span>
                </div>
                <div className={styles.payoutReceiptRow}>
                  <span className={styles.payoutReceiptLabel}>Tài khoản ngân hàng:</span>
                  <span className={styles.payoutReceiptBankVal}>{payoutConfirmModal.disbursement.artist_bank}</span>
                </div>
                <div className={styles.payoutReceiptRow}>
                  <span className={styles.payoutReceiptLabel}>Đối soát AI Copilot:</span>
                  <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                    <CheckCircle2 size={12} /> Đạt chuẩn 72h (0 Khiếu nại)
                  </span>
                </div>

                <div className={styles.payoutReceiptDivider} />

                <div className={styles.payoutReceiptRow}>
                  <span className={styles.payoutReceiptLabel}>Tổng giá trị ký quỹ:</span>
                  <span className={styles.payoutReceiptVal}>
                    {formatVND(payoutConfirmModal.disbursement.payout_amount + payoutConfirmModal.disbursement.platform_fee)}
                  </span>
                </div>
                <div className={styles.payoutReceiptRow}>
                  <span className={styles.payoutReceiptLabel}>Khấu trừ phí sàn (5%):</span>
                  <span className="text-rose-600 font-semibold font-mono text-xs">
                    -{formatVND(payoutConfirmModal.disbursement.platform_fee)}
                  </span>
                </div>

                <div className={styles.payoutReceiptTotal}>
                  <span className={styles.payoutTotalLabel}>Số tiền thực nhận:</span>
                  <span className={styles.payoutTotalAmount}>
                    {formatVND(payoutConfirmModal.disbursement.payout_amount)}
                  </span>
                </div>
              </div>

              {/* Security Box with Checkbox */}
              <div className={styles.payoutSecurityBox}>
                <p className={styles.payoutWarningNote}>
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cảnh báo tài chính:</strong> Lệnh giải ngân sẽ kích hoạt chuyển khoản thực tế và <strong>không thể hoàn tác</strong>.
                  </span>
                </p>

                <label className={styles.payoutCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={payoutConfirmModal.confirmedAwareness}
                    onChange={(e) => setPayoutConfirmModal(prev => ({ ...prev, confirmedAwareness: e.target.checked }))}
                    className={styles.payoutCheckboxInput}
                  />
                  <span className={styles.payoutCheckboxText}>
                    Tôi xác nhận đã kiểm tra đối soát biên bản giao nhận và chịu trách nhiệm cho lệnh giải ngân này.
                  </span>
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className={styles.payoutModalFooter}>
              <button
                type="button"
                className={styles.payoutCancelBtn}
                onClick={() => setPayoutConfirmModal({ open: false, disbursement: null, confirmedAwareness: false })}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!payoutConfirmModal.confirmedAwareness}
                onClick={handleConfirmPayout}
                className={styles.payoutSubmitBtn}
                title={!payoutConfirmModal.confirmedAwareness ? 'Vui lòng tích vào ô xác nhận cam kết trước khi giải ngân' : 'Kích hoạt giải ngân ngay'}
              >
                <Check size={16} /> Xác nhận Giải ngân ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { QuanTriVienPage };

