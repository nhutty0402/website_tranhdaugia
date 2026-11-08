import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, User, Menu, X, ChevronDown, LogOut,
  Compass, Gavel, Palette, Landmark, Sun, Moon, ShieldCheck,
  Receipt, Truck, PlusCircle
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import Logo from './Logo';
import styles from './Navbar.module.css';

const PUBLIC_NAV_LINKS = [
  {
    label: 'Khám phá',
    path: '/gallery',
    icon: Compass,
  },
  {
    label: 'Đấu giá',
    path: '/auction',
    icon: Gavel,
    isLive: true,
  },
  {
    label: 'Họa sĩ',
    path: '/artists',
    icon: Palette,
  },
];

const ARTIST_NAV_LINKS = [
  {
    label: 'Quản lý bài đăng',
    path: '/profile?tab=artworks',
    tabSlug: 'artworks',
    icon: Palette,
  },
  {
    label: 'Quản lý đơn hàng',
    path: '/profile?tab=orders',
    tabSlug: 'orders',
    icon: Receipt,
  },
  {
    label: 'Quản lý vận chuyển',
    path: '/profile?tab=shipping',
    tabSlug: 'shipping',
    icon: Truck,
  },
  {
    label: 'Hồ sơ họa sĩ',
    path: '/profile?tab=profile',
    tabSlug: 'profile',
    icon: User,
  },
];

const getArtistTabSlug = (search) => {
  const params = new URLSearchParams(search);
  const t = params.get('tab');
  if (t === 'orders' || t === 'don-hang') return 'orders';
  if (t === 'shipping' || t === 'van-chuyen') return 'shipping';
  if (t === 'profile' || t === 'kyc') return 'profile';
  return 'artworks';
};

const Navbar = ({ user, onLoginClick, onRegisterClick, onLogout, theme = 'dark', onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isLight = theme === 'light';
  const userMenuRef = useRef(null);

  const isArtist = user?.role === 'artist';
  const navLinks = isArtist ? ARTIST_NAV_LINKS : PUBLIC_NAV_LINKS;
  const currentArtistTabSlug = getArtistTabSlug(location.search);



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
    setSearchOpen(false);
  }, [location.pathname]);

  // Close search/menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.inner}>
          {/* Logo "ARTISAN HUB" */}
          <Link to={isArtist ? "/profile?tab=artworks" : "/"} className={styles.logoLink} aria-label="Artisan Hub Trang chủ">
            <Logo size="md" />
          </Link>

          {/* Center Navigation Menu (Chỉ hiển thị cho Khách / Nhà sưu tầm, Họa sĩ sử dụng thanh điều hướng ngay dưới trang Profile) */}
          {!isArtist && (
            <nav className={styles.navContainer} aria-label="Menu chính">
              <ul className={styles.navLinks}>
                {PUBLIC_NAV_LINKS.map(link => {
                  const isActive = location.pathname === link.path;
                  const IconComp = link.icon;
                  return (
                    <li key={link.label} className={styles.navItem}>
                      <Link
                        to={link.path}
                        className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                      >
                        <div className={styles.navIconWrapper}>
                          <IconComp size={16} strokeWidth={1.5} className={styles.navItemIcon} />
                        </div>
                        <div className={styles.navTextCol}>
                          <div className={styles.navLabelRow}>
                            <span className={styles.navLabel}>{link.label}</span>
                            {link.isLive && (
                              <span className={styles.liveBadge}>
                                <span className={styles.livePulse} />
                                LIVE
                              </span>
                            )}
                          </div>
                          {link.subLabel && <span className={styles.navSubLabel}>{link.subLabel}</span>}
                        </div>
                        <span className={styles.activeGlowLine} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Right Utility Buttons */}
          <div className={styles.actions}>
            {isArtist ? (
              /* GIAO DIỆN TINH GỌN BẢO TÀNG CHO HỌA SĨ: TÌM KIẾM, LỜI CHÀO & ĐĂNG XUẤT NHANH */
              <>
                <button
                  id="nav-search-btn"
                  className={styles.iconBtn}
                  onClick={() => { setSearchOpen(!searchOpen); setUserMenuOpen(false); }}
                  aria-label="Tìm kiếm trong bài đăng"
                  title="Tìm kiếm tác phẩm của bạn"
                >
                  <Search size={18} strokeWidth={1.4} />
                </button>

                <div className={styles.artistControls}>
                  <Link
                    to="/profile?tab=profile"
                    className={styles.artistGreeting}
                    id="nav-artist-greeting"
                    title="Xem Hồ sơ họa sĩ & Không gian trưng bày"
                  >
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"}
                      alt={user?.full_name || "Họa sĩ"}
                      className={styles.artistGreetingAvatar}
                    />
                    <div className={styles.artistGreetingTextGroup}>
                      <span className={styles.artistGreetingPrefix}>Xin chào,&nbsp;</span>
                      <span className={styles.artistGreetingName}>
                        <span className={styles.nameFull}>Họa sĩ {user?.full_name || 'Trần Thị Ánh Dương'}</span>
                        <span className={styles.nameShort}>Họa sĩ {user?.full_name ? user.full_name.split(' ').slice(-2).join(' ') : 'Ánh Dương'}</span>
                      </span>
                    </div>
                    <VerificationBadge level={user?.kyc_level || 3} size="sm" showLabel={false} />
                  </Link>

                  <button
                    type="button"
                    id="nav-quick-logout-btn"
                    className={styles.quickLogoutBtn}
                    onClick={() => {
                      onLogout?.();
                      navigate('/');
                    }}
                    title="Đăng xuất nhanh khỏi hệ thống"
                    aria-label="Đăng xuất nhanh"
                  >
                    <LogOut size={15} strokeWidth={2} />
                    <span className={styles.quickLogoutLabel}>Đăng xuất</span>
                  </button>
                </div>
              </>
            ) : (
              /* GIAO DIỆN CHO KHÁCH & NHÀ SƯU TẦM */
              <>
                <button
                  id="nav-search-btn"
                  className={styles.iconBtn}
                  onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); setUserMenuOpen(false); }}
                  aria-label="Tìm kiếm tác phẩm"
                  title="Tìm kiếm tác phẩm nghệ thuật"
                >
                  <Search size={18} strokeWidth={1.4} />
                </button>

                {user ? (
                  <div className={styles.userMenuWrapper} ref={userMenuRef}>
                    <button
                      type="button"
                      id="nav-profile-btn"
                      className={`${styles.userChip} ${userMenuOpen ? styles.userChipActive : ''}`}
                      onClick={() => { setUserMenuOpen(!userMenuOpen); setMobileOpen(false); }}
                      aria-expanded={userMenuOpen}
                      aria-label="Menu tài khoản"
                    >
                      <img src={user.avatar} alt={user.full_name} className={styles.avatar} />
                      <span className={styles.userChipMeta}>
                        <span className={styles.userName}>{user.full_name}</span>
                        <VerificationBadge level={user.kyc_level || 0} size="sm" showLabel={false} />
                        <ChevronDown
                          size={14}
                          strokeWidth={1.5}
                          className={`${styles.chevron} ${userMenuOpen ? styles.chevronRotated : ''}`}
                        />
                      </span>
                    </button>

                    {/* Dropdown Menu cho Collector */}
                    {userMenuOpen && (
                      <div className={styles.userDropdown} id="nav-user-dropdown">
                        <div className={styles.dropdownHeader}>
                          <img src={user.avatar} alt={user.full_name} className={styles.dropdownAvatar} />
                          <div className={styles.dropdownUserInfo}>
                            <div className={styles.dropdownName}>{user.full_name}</div>
                            <div className={styles.dropdownMeta}>
                              <span className={styles.dropdownRole}>Nhà sưu tầm</span>
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

                        <Link
                          to="/quan-tri"
                          className={styles.dropdownItem}
                          id="dropdown-quan-tri-link"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShieldCheck size={15} color="var(--gold-primary)" />
                          <span>Giao diện Quản trị viên</span>
                        </Link>

                        <div className={styles.dropdownDivider} />

                        <button
                          type="button"
                          id="nav-logout-btn"
                          className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout?.();
                            navigate('/');
                          }}
                        >
                          <LogOut size={15} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.authGroup}>
                    <button
                      id="nav-register-btn"
                      className={styles.btnRegister}
                      onClick={onRegisterClick}
                    >
                      Đăng ký
                    </button>
                    <button
                      id="nav-login-btn"
                      className={styles.btnLogin}
                      onClick={onLoginClick}
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}

                <button
                  className={styles.menuBtn}
                  onClick={() => { setMobileOpen(!mobileOpen); setUserMenuOpen(false); }}
                  aria-label="Mở menu di động"
                >
                  {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <>
            <div className={styles.searchBackdrop} onClick={() => setSearchOpen(false)} />
            <div className={styles.searchBar}>
              <div className={styles.searchInner}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  id="nav-search-input"
                  autoFocus
                  className={styles.searchInput}
                  placeholder={isArtist ? "Tìm trong bài đăng của bạn..." : "Tìm kiếm tranh, họa sĩ, phong cách..."}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      if (isArtist) {
                        navigate(`/profile?tab=artworks&search=${encodeURIComponent(e.target.value.trim())}`);
                      } else {
                        navigate(`/gallery?q=${encodeURIComponent(e.target.value.trim())}`);
                      }
                      setSearchOpen(false);
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.searchCloseBtn}
                  onClick={() => setSearchOpen(false)}
                  aria-label="Đóng tìm kiếm"
                >
                  <X size={16} />
                </button>
                <kbd className={styles.searchKbd} onClick={() => setSearchOpen(false)}>ESC</kbd>
              </div>
            </div>
          </>
        )}

        {/* Mobile nav (Dành riêng cho Khách / Nhà sưu tầm) */}
        {!isArtist && mobileOpen && (
          <div className={styles.mobileMenu}>
            {PUBLIC_NAV_LINKS.map(link => {
              const isActive = location.pathname === link.path;
              const IconComp = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className={styles.mobileLinkLeft}>
                    <IconComp size={18} strokeWidth={1.5} color="var(--gold-primary)" />
                    <div>
                      <div className={styles.mobileLinkLabel}>
                        {link.label}
                        {link.isLive && (
                          <span className={styles.liveBadge} style={{ transform: 'scale(0.85)' }}>
                            <span className={styles.livePulse} />
                            LIVE
                          </span>
                        )}
                      </div>
                      {link.subLabel && <div className={styles.mobileLinkSub}>{link.subLabel}</div>}
                    </div>
                  </div>
                </Link>
              );
            })}

            {user ? (
              <div className={styles.mobileUserSection}>
                <div className={styles.mobileUserInfo}>
                  <img src={user.avatar} alt={user.full_name} className={styles.avatar} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.full_name}
                      </span>
                      <VerificationBadge level={user.kyc_level || 0} size="sm" showLabel={false} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', marginTop: 2 }}>
                      {user.role === 'artist' ? 'Họa sĩ xác thực' : 'Nhà sưu tầm (Collector)'}
                    </div>
                  </div>
                </div>
                <Link
                  to={isArtist ? "/profile?tab=profile" : "/profile"}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <User size={16} /> {isArtist ? 'Profile & Không gian họa sĩ' : 'Xem hồ sơ & Bộ sưu tập'}
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
              <div className={styles.mobileAuthRow}>
                <button
                  className={styles.btnRegister}
                  style={{ width: '100%', textAlign: 'center', padding: '10px' }}
                  onClick={() => { onRegisterClick(); setMobileOpen(false); }}
                >
                  Đăng ký
                </button>
                <button
                  className={styles.btnLogin}
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={() => { onLoginClick(); setMobileOpen(false); }}
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        )}
      </header>
      {/* Spacer */}
      <div className={styles.navbarSpacer} />
    </>
  );
};

export default Navbar;
