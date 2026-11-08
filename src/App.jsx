import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { useToast } from './hooks/useToast';

import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import AuctionPage from './pages/AuctionPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import ProfilePage from './pages/ProfilePage';
import QuanTriVienPage from './pages/QuanTriVienPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import CommunityChatDrawer from './components/CommunityChatDrawer';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/quan-tri');

  const [currentUser, setCurrentUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(new Set());
  const [theme, setTheme] = useState('dark');
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.removeItem('artisan_theme');
  }, []);

  const toggleTheme = () => {
    addToast('✦ Giao diện hiện tại: Dark Luxury Gallery chuẩn bảo tàng.', 'gold', 3000);
  };

  const handleWishlist = (artworkId) => {
    setWishlisted(prev => {
      const next = new Set(prev);
      if (next.has(artworkId)) {
        next.delete(artworkId);
        addToast('Đã xóa khỏi bộ sưu tập theo dõi', 'info');
      } else {
        next.add(artworkId);
        addToast('✦ Đã thêm vào bộ sưu tập theo dõi!', 'gold');
      }
      return next;
    });
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    addToast(`Chào mừng trở lại, ${user.full_name.split(' ').slice(-1)[0]}! ✨`, 'success');
    if (user.role === 'artist') {
      navigate('/profile?tab=artworks');
    }
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    const levelLabels = ['', 'L1 SĐT', 'L2 Định danh', 'L3 Họa sĩ'];
    const lvl = user.kyc_level || 0;
    const levelText = lvl > 0 ? ` • Cấp ${levelLabels[lvl]} đã xác minh!` : '';
    addToast(`🎉 Chào mừng, ${user.full_name.split(' ').slice(-1)[0]}!${levelText}`, 'success', 5000);
    if (user.role === 'artist') {
      navigate('/profile?tab=artworks');
    }
  };

  const handleSwitchToCollector = (collectorUser) => {
    const userToSet = collectorUser || {
      user_id: 'u1',
      username: 'minh_collector',
      email: 'minh@example.com',
      role: 'collector',
      full_name: 'Nguyễn Minh Khôi',
      collector_type: 'Nhà sưu tầm tư nhân',
      verification_badge: true,
      kyc_level: 2,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      badge_label: 'Cấp L2',
    };
    setCurrentUser(userToSet);
    addToast(`✦ Đã chuyển sang vai Nhà sưu tầm (${userToSet.full_name.split(' ').slice(-1)[0]} · L2)!`, 'success');
    navigate('/gallery');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('Đã đăng xuất. Hẹn gặp lại!', 'info');
  };

  const handleUpdateUser = (updatedFields) => {
    setCurrentUser(prev => prev ? { ...prev, ...updatedFields } : null);
  };

  const sharedProps = {
    currentUser,
    wishlisted,
    onWishlist: handleWishlist,
    addToast,
    onLoginClick: () => setLoginOpen(true),
    onRegisterClick: () => setRegisterOpen(true),
    onSwitchToCollector: handleSwitchToCollector,
    onLogout: handleLogout,
    onUpdateUser: handleUpdateUser,
  };

  return (
    <>
      {/* Tự động Reset cuộn trang khi chuyển hướng */}
      <ScrollToTop />

      {/* CHỈ HIỂN THỊ NAVBAR CHO KHÁCH HÀNG Ở ROUTE CÔNG CỘNG (ẨN HOÀN TOÀN TRÊN PHÂN HỆ QUẢN TRỊ) */}
      {!isAdminRoute && (
        <Navbar
          user={currentUser}
          onLoginClick={() => setLoginOpen(true)}
          onRegisterClick={() => setRegisterOpen(true)}
          onLogout={handleLogout}
          addToast={addToast}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      <Routes>
        {/* TUYẾN ĐƯỜNG CÔNG CỘNG CHO KHÁCH HÀNG & HỌA SĨ */}
        <Route path="/" element={<HomePage {...sharedProps} />} />
        <Route path="/gallery" element={<GalleryPage {...sharedProps} />} />
        <Route path="/artwork/:id" element={<ArtworkDetailPage {...sharedProps} />} />
        <Route path="/auction" element={<AuctionPage {...sharedProps} />} />
        <Route path="/auction/:sessionId" element={<AuctionPage {...sharedProps} />} />
        <Route path="/artists" element={<ArtistsPage {...sharedProps} />} />
        <Route path="/artists/:id" element={<ArtistDetailPage {...sharedProps} />} />
        <Route path="/artist/:id" element={<ArtistDetailPage {...sharedProps} />} />
        <Route path="/profile" element={<ProfilePage {...sharedProps} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/checkout/:artworkId" element={<CheckoutPage {...sharedProps} />} />

        {/* TUYẾN ĐƯỜNG CHUYÊN BIỆT CHO PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN PORTAL ĐỘC LẬP) */}
        <Route path="/admin/login" element={<AdminLoginPage addToast={addToast} />} />
        <Route path="/quan-tri/dang-nhap" element={<AdminLoginPage addToast={addToast} />} />
        <Route path="/admin" element={<QuanTriVienPage {...sharedProps} />} />
        <Route path="/quan-tri" element={<QuanTriVienPage {...sharedProps} />} />
        <Route path="/admin/:tab" element={<QuanTriVienPage {...sharedProps} />} />
        <Route path="/quan-tri/:tab" element={<QuanTriVienPage {...sharedProps} />} />
      </Routes>

      {/* CHỈ HIỂN THỊ FOOTER CHO KHÁCH HÀNG (ẨN HOÀN TOÀN TRÊN PHÂN HỆ QUẢN TRỊ) */}
      {!isAdminRoute && <Footer />}

      {/* Modal Đăng nhập Khách hàng */}
      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onLogin={handleLogin}
          onOpenRegister={() => setRegisterOpen(true)}
          addToast={addToast}
        />
      )}

      {/* Modal Đăng ký Khách hàng / Họa sĩ */}
      {registerOpen && (
        <RegisterModal
          onClose={() => setRegisterOpen(false)}
          onRegister={handleRegister}
          onOpenLogin={() => setLoginOpen(true)}
        />
      )}

      {/* Thông báo Toast toàn cục */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* WIDGET TƯ VẤN KHÁCH HÀNG (ẨN HOÀN TOÀN TRÊN PHÂN HỆ QUẢN TRỊ VIÊN & HỌA SĨ) */}
      {!isAdminRoute && currentUser?.role !== 'artist' && (
        <CommunityChatDrawer
          currentUser={currentUser}
          onLoginClick={() => setLoginOpen(true)}
        />
      )}

      {/* Nút BackToTop (Ẩn trên phân hệ Quản trị viên) */}
      {!isAdminRoute && <BackToTop />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
