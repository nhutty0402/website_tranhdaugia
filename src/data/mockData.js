// Artisan Hub – Mock Data
// 8 Core Entities matching the database schema

export const USERS = [
  {
    user_id: 'u1',
    username: 'minh_collector',
    email: 'minh@example.com',
    role: 'collector',
    full_name: 'Nguyễn Minh Khôi',
    verification_badge: true,
    avatar: '/artist_avatar.png',
  },
  {
    user_id: 'u2',
    username: 'tran_artist',
    email: 'tran@example.com',
    role: 'artist',
    full_name: 'Trần Thị Ánh Dương',
    artist_bio: 'Họa sĩ sơn dầu & lụa, 12 năm kinh nghiệm. Tốt nghiệp Đại học Mỹ thuật Hà Nội. Tác phẩm được triển lãm tại Paris, Singapore và Hà Nội.',
    studio_address: '12 Ngõ Hàng Bông, Hoàn Kiếm, Hà Nội',
    verification_badge: true,
    avatar: '/artist_avatar.png',
  },
  {
    user_id: 'u3',
    username: 'nguyen_artist',
    email: 'nguyen@example.com',
    role: 'artist',
    full_name: 'Nguyễn Phúc An',
    artist_bio: 'Chuyên tranh sơn mài truyền thống kết hợp thẩm mỹ đương đại. 8 năm kinh nghiệm, triển lãm Hội Mỹ thuật Việt Nam.',
    studio_address: '45 Đường Nguyễn Du, Quận 1, TP. HCM',
    verification_badge: true,
    avatar: '/artist_avatar.png',
  },
];

export const ARTWORKS = [
  {
    artwork_id: 'aw1',
    artist_id: 'u2',
    artist_name: 'Trần Thị Ánh Dương',
    title: 'Bình Minh Trên Biển Đông',
    medium: 'Sơn dầu trên canvas',
    dimensions: '80 × 120 cm',
    creation_year: 2024,
    dominant_color: '#D4AF37',
    reserve_price: 15000000,
    current_price: 22500000,
    image: '/artwork_1.png',
    texture_map_url: '/artwork_1.png',
    curator_statement: 'Tác phẩm ghi lại khoảnh khắc bình minh rực rỡ trên vùng biển phía Đông, với các lớp sơn dầu dày tạo chiều sâu và ánh sáng tuyệt vời.',
    tags: ['Trừu tượng', 'Sơn dầu', 'Phong cảnh'],
    style: 'Trừu tượng',
    is_auction: true,
    is_featured: true,
    views: 1247,
    likes: 89,
  },
  {
    artwork_id: 'aw2',
    artist_id: 'u3',
    artist_name: 'Nguyễn Phúc An',
    title: 'Sen Hồ Tây',
    medium: 'Sơn mài trên gỗ',
    dimensions: '60 × 90 cm',
    creation_year: 2024,
    dominant_color: '#8B1A1A',
    reserve_price: 28000000,
    current_price: 35000000,
    image: '/artwork_2.png',
    texture_map_url: '/artwork_2.png',
    curator_statement: 'Tác phẩm sơn mài truyền thống với vàng lá và bạc lá, thể hiện vẻ đẹp thanh khiết của hoa sen Hồ Tây qua góc nhìn đương đại.',
    tags: ['Sơn mài', 'Hoa sen', 'Truyền thống'],
    style: 'Sơn mài',
    is_auction: true,
    is_featured: true,
    views: 892,
    likes: 134,
  },
  {
    artwork_id: 'aw3',
    artist_id: 'u2',
    artist_name: 'Trần Thị Ánh Dương',
    title: 'Thành Phố Về Đêm',
    medium: 'Sơn dầu trên canvas',
    dimensions: '100 × 70 cm',
    creation_year: 2023,
    dominant_color: '#1A237E',
    reserve_price: 18000000,
    current_price: 18000000,
    image: '/artwork_3.png',
    texture_map_url: '/artwork_3.png',
    curator_statement: 'Góc nhìn trừu tượng về đô thị hiện đại qua đêm, với các mảng màu xanh indigo và ánh đèn phản chiếu trên mặt nước.',
    tags: ['Đô thị', 'Đêm', 'Trừu tượng'],
    style: 'Hiện đại',
    is_auction: false,
    is_featured: false,
    views: 654,
    likes: 67,
  },
  {
    artwork_id: 'aw4',
    artist_id: 'u3',
    artist_name: 'Nguyễn Phúc An',
    title: 'Áo Dài Tím',
    medium: 'Tranh lụa',
    dimensions: '50 × 80 cm',
    creation_year: 2024,
    dominant_color: '#6A1B9A',
    reserve_price: 12000000,
    current_price: 16500000,
    image: '/artwork_4.png',
    texture_map_url: '/artwork_4.png',
    curator_statement: 'Bức tranh lụa tinh xảo khắc họa hình ảnh người phụ nữ Việt Nam trong tà áo dài tím, là sự hòa quyện giữa truyền thống và đương đại.',
    tags: ['Lụa', 'Áo dài', 'Nhân vật'],
    style: 'Lụa',
    is_auction: true,
    is_featured: false,
    views: 423,
    likes: 98,
  },
];

export const AUCTION_SESSIONS = [
  {
    session_id: 'as1',
    artwork_id: 'aw1',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() + 7200000 + 1800000).toISOString(), // ~2.5h from now
    bid_increment: 500000,
    current_highest_price: 22500000,
    winner_id: null,
    status: 'live',
  },
  {
    session_id: 'as2',
    artwork_id: 'aw2',
    start_time: new Date(Date.now() - 7200000).toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(), // 1h from now
    bid_increment: 1000000,
    current_highest_price: 35000000,
    winner_id: null,
    status: 'live',
  },
  {
    session_id: 'as3',
    artwork_id: 'aw4',
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    bid_increment: 500000,
    current_highest_price: 12000000,
    winner_id: null,
    status: 'upcoming',
  },
];

export const BID_HISTORY = [
  { bid_id: 'b1', session_id: 'as1', bidder_id: 'u1', bidder_name: 'N.M.Khôi', bid_amount: 22500000, placed_at: new Date(Date.now() - 180000).toISOString(), is_auto_bid: false, status: 'winning' },
  { bid_id: 'b2', session_id: 'as1', bidder_id: 'u4', bidder_name: 'P.V.Long', bid_amount: 21500000, placed_at: new Date(Date.now() - 600000).toISOString(), is_auto_bid: false, status: 'outbid' },
  { bid_id: 'b3', session_id: 'as1', bidder_id: 'u5', bidder_name: 'L.T.Hoa', bid_amount: 20000000, placed_at: new Date(Date.now() - 1200000).toISOString(), is_auto_bid: true, status: 'outbid' },
  { bid_id: 'b4', session_id: 'as1', bidder_id: 'u6', bidder_name: 'T.Q.Bình', bid_amount: 18500000, placed_at: new Date(Date.now() - 2400000).toISOString(), is_auto_bid: false, status: 'outbid' },
  { bid_id: 'b5', session_id: 'as1', bidder_id: 'u1', bidder_name: 'N.M.Khôi', bid_amount: 17000000, placed_at: new Date(Date.now() - 3600000).toISOString(), is_auto_bid: false, status: 'outbid' },
];

export const CERTIFICATES = [
  {
    certificate_id: 'cert1',
    artwork_id: 'aw2',
    current_owner_id: 'u1',
    digital_signature: '3046022100d4b8f4a2e1c9f3a7b2e8d1c4f6a3b9e2d7c1f4a8b3e6d9c2f5a1b4e7d0c3f6a9',
    ownership_hash: 'SHA-256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    provenance_chain: [
      { owner: 'Nguyễn Phúc An (Artist)', date: '2024-03-15', type: 'Creation' },
      { owner: 'Artisan Hub Escrow', date: '2024-09-20', type: 'Auction' },
      { owner: 'Nguyễn Minh Khôi', date: '2024-09-22', type: 'Purchase' },
    ],
    qr_verify_code: 'AH-CERT-2024-0042',
  },
];

export const ESCROW_ORDERS = [
  {
    escrow_id: 'esc1',
    session_id: 'as2',
    buyer_id: 'u1',
    seller_id: 'u3',
    amount_locked: 35000000,
    release_countdown: new Date(Date.now() + 172800000).toISOString(), // 48h remaining
    dispute_status: 'none',
    payout_status: 'locked',
  },
];

export const QUICK_BID_STEPS = [500000, 1000000, 2000000, 5000000];

export const ROOM_TYPES = [
  { id: 'living', label: 'Phòng khách', icon: '🛋️', bg: '#2C2420' },
  { id: 'bedroom', label: 'Phòng ngủ', icon: '🛏️', bg: '#1E2C24' },
  { id: 'office', label: 'Phòng làm việc', icon: '💼', bg: '#1E2428' },
  { id: 'gallery', label: 'Phòng trưng bày', icon: '🖼️', bg: '#1A1A1E' },
];

export const LIGHT_MODES = [
  { id: 'spotlight', label: 'Đèn rọi 3000K', icon: '💡' },
  { id: 'daylight', label: 'Ánh sáng ban ngày', icon: '☀️' },
  { id: 'evening', label: 'Hoàng hôn 2700K', icon: '🌇' },
];

export const FILTER_STYLES = ['Tất cả', 'Trừu tượng', 'Sơn mài', 'Lụa', 'Hiện đại', 'Truyền thống'];
export const FILTER_PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: 0, max: Infinity },
  { label: 'Dưới 15 triệu', min: 0, max: 15000000 },
  { label: '15 – 30 triệu', min: 15000000, max: 30000000 },
  { label: '30 – 60 triệu', min: 30000000, max: 60000000 },
  { label: 'Trên 60 triệu', min: 60000000, max: Infinity },
];

export const formatPrice = (price) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1).replace('.0', '')} triệu ₫`;
  }
  return `${price.toLocaleString('vi-VN')} ₫`;
};

export const formatPriceFull = (price) =>
  price.toLocaleString('vi-VN') + ' ₫';

export const formatCountdown = (endTime) => {
  const diff = Math.max(0, new Date(endTime) - new Date());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds, total: diff };
};
