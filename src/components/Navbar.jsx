import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Palette, Search, Bell, User, Menu, X, ChevronDown, LogOut,
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Khám phá', path: '/gallery' },
  { label: 'Đấu giá', path: '/auction' },
  { label: 'Họa sĩ', path: '/artists' },
  { label: 'Về chúng tôi', path: '/about' },
];

const Navbar = ({ user, onLoginClick, onRegisterClick, onLogout }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

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
              <div className={styles.userMenuWrapper} ref={userMenuRef}>
                <button
                  type="button"
                  id="nav-profile-btn"
                  className={`${styles.userChip} ${userMenuOpen ? styles.userChipActive : ''}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-label="Menu tài khoản"
                >
                  <img src={user.avatar} alt={user.full_name} className={styles.avatar} />
                  <span className={styles.userName}>{user.full_name.split(' ').slice(-1)[0]}</span>
                  <VerificationBadge level={user.kyc_level || 0} size="sm" showLabel={false} />
                  <ChevronDown
                    size={14}
                    className={`${styles.chevron} ${userMenuOpen ? styles.chevronRotated : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className={styles.userDropdown} id="nav-user-dropdown">
                    <div className={styles.dropdownHeader}>
                      <img src={user.avatar} alt={user.full_name} className={styles.dropdownAvatar} />
                      <div className={styles.dropdownUserInfo}>
                        <div className={styles.dropdownName}>{user.full_name}</div>
                        <div className={styles.dropdownMeta}>
                          <span className={styles.dropdownRole}>
                            {user.role === 'artist' ? 'Họa sĩ xác thực' : 'Nhà sưu tầm'}
                          </span>
                          <span className={styles.dropdownKyc}>Cấp L{user.kyc_level || 0}</span>
                        </div>
                        <div className={styles.dropdownEmail}>{user.email}</div>
                      </div>
                    </div>

                    <div className={styles.dropdownDivider} />

                    <Link
                      to="/profile"
                      className={styles.dropdownItem}
                      id="dropdown-profile-link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={15} color="var(--gold-primary)" />
                      <span>Hồ sơ & Bộ sưu tập</span>
                    </Link>

                    <div className={styles.dropdownDivider} />

                    <button
                      type="button"
                      id="nav-logout-btn"
                      className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout?.();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
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

            {user ? (
              <div className={styles.mobileUserSection}>
                <div className={styles.mobileUserInfo}>
                  <img src={user.avatar} alt={user.full_name} className={styles.avatar} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {user.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>
                      {user.role === 'artist' ? 'Họa sĩ xác thực' : 'Nhà sưu tầm (Collector)'}
                    </div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <User size={16} /> Xem hồ sơ & Bộ sưu tập
                </Link>
                <button
                  id="mobile-logout-btn"
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    marginTop: 6,
                  }}
                  onClick={() => {
                    setMobileOpen(false);
                    onLogout?.();
                  }}
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            ) : (
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
