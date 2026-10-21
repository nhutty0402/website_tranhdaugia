import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Palette, Search, Bell, User, Menu, X, ChevronDown,
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Khám phá', path: '/gallery' },
  { label: 'Đấu giá', path: '/auction' },
  { label: 'Họa sĩ', path: '/artists' },
  { label: 'Về chúng tôi', path: '/about' },
];

const Navbar = ({ user, onLoginClick, onRegisterClick }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Palette size={20} color="#D4AF37" />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>ARTISAN</span>
              <span className={styles.logoSub}>HUB</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className={styles.navLinks}>
            {NAV_LINKS.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className={styles.actions}>
            <button
              id="nav-search-btn"
              className={`btn btn-icon btn-ghost ${styles.iconBtn}`}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
            </button>

            <button id="nav-bell-btn" className={`btn btn-icon btn-ghost ${styles.iconBtn}`} aria-label="Thông báo">
              <div style={{ position: 'relative' }}>
                <Bell size={18} />
                <span className={styles.notifDot} />
              </div>
            </button>

            {user ? (
              <Link to="/profile" className={styles.userChip} id="nav-profile">
                <img src={user.avatar} alt={user.full_name} className={styles.avatar} />
                <span className={styles.userName}>{user.full_name.split(' ').slice(-1)[0]}</span>
                <VerificationBadge level={user.kyc_level || 0} size="sm" showLabel={false} />
                <ChevronDown size={14} />
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button id="nav-register-btn" className="btn btn-secondary btn-sm" onClick={onRegisterClick}>
                  Đăng ký
                </button>
                <button id="nav-login-btn" className="btn btn-primary btn-sm" onClick={onLoginClick}>
                  Đăng nhập
                </button>
              </div>
            )}

            <button
              className={`btn btn-icon btn-ghost ${styles.menuBtn}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className={styles.searchBar}>
            <div className={styles.searchInner}>
              <Search size={16} color="var(--text-muted)" />
              <input
                id="nav-search-input"
                autoFocus
                className={styles.searchInput}
                placeholder="Tìm kiếm tác phẩm, họa sĩ, phong cách..."
              />
              <kbd className={styles.searchKbd}>ESC</kbd>
            </div>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={styles.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <button className="btn btn-primary" onClick={() => { onLoginClick(); setMobileOpen(false); }}>
                Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div style={{ height: 72 }} />
    </>
  );
};

export default Navbar;
