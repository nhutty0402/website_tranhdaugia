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
import ProfilePage from './pages/ProfilePage';

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
        <Route path="/profile" element={<ProfilePage {...sharedProps} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

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
    </BrowserRouter>
  );
};

// Simple About page
const AboutPage = () => (
  <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 80 }}>
    <div style={{ background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-base) 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 40px' }}>
      <div className="container">
        <span className="section-label">Về chúng tôi</span>
        <h1 style={{ margin: '8px 0 12px' }}>Artisan Hub</h1>
      </div>
    </div>
    <div className="container-sm" style={{ paddingTop: 48 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {[
          {
            title: 'Sứ mệnh của chúng tôi',
            content: 'Artisan Hub được tạo ra để giải quyết 3 rào cản lớn nhất của thị trường tranh độc bản trực tuyến: niềm tin về tính xác thực, trải nghiệm thị giác chân thực và cơ chế giao dịch an toàn.',
          },
          {
            title: 'Cơ chế bảo vệ 3 lớp',
            content: 'Mỗi tác phẩm trên Artisan Hub đều trải qua quy trình xác thực nghiêm ngặt: họa sĩ chụp tranh kèm mã ngẫu nhiên, tiền được khóa trong ví ký quỹ 72 giờ, và mọi giao dịch đều được bảo chứng bằng chứng chỉ số SHA-256.',
          },
          {
            title: 'Đồ án môn học',
            content: 'Dự án này được phát triển như một đồ án môn Thiết kế Giao diện Người dùng Đồ họa, với đầy đủ User Research, Design System, High-Fidelity UI và Prototype theo quy trình UCD.',
          },
        ].map(({ title, content }) => (
          <div key={title} style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 32,
            borderLeft: '3px solid var(--gold-primary)',
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 12 }}>{title}</h3>
            <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  </main>
);

export default App;
