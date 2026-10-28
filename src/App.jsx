import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import CommunityChatDrawer from './components/CommunityChatDrawer';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(new Set());
  const { toasts, addToast, removeToast } = useToast();

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
    addToast(`Chào mừng trở lại, ${user.full_name.split(' ').slice(-1)[0]}! 🎨`, 'success');
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    const levelLabels = ['', 'L1 SĐT', 'L2 eKYC', 'L3 Họa sĩ'];
    const lvl = user.kyc_level || 0;
    const levelText = lvl > 0 ? ` – Cấp ${levelLabels[lvl]} đã xác minh!` : '';
    addToast(`🎉 Chào mừng, ${user.full_name.split(' ').slice(-1)[0]}!${levelText}`, 'success', 5000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('Đã đăng xuất. Hẹn gặp lại!', 'info');
  };

  const sharedProps = {
    currentUser,
    wishlisted,
    onWishlist: handleWishlist,
    addToast,
    onLoginClick: () => setLoginOpen(true),
    onRegisterClick: () => setRegisterOpen(true),
    onLogout: handleLogout,
  };

  return (
    <BrowserRouter>
      {/* Auto Reset Scroll on route change */}
      <ScrollToTop />

      <Navbar
        user={currentUser}
        onLoginClick={() => setLoginOpen(true)}
        onRegisterClick={() => setRegisterOpen(true)}
        onLogout={handleLogout}
      />

      <Routes>
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
      </Routes>

      {/* Global Luxury Art Footer */}
      <Footer />

      {/* Login Modal */}
      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onLogin={handleLogin}
          onOpenRegister={() => setRegisterOpen(true)}
          addToast={addToast}
        />
      )}

      {/* Register Modal (multi-step) */}
      {registerOpen && (
        <RegisterModal
          onClose={() => setRegisterOpen(false)}
          onRegister={handleRegister}
          onOpenLogin={() => setLoginOpen(true)}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Community Salon Chat between Artists & Collectors */}
      <CommunityChatDrawer
        currentUser={currentUser}
        onLoginClick={() => setLoginOpen(true)}
      />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </BrowserRouter>
  );
};

export default App;
