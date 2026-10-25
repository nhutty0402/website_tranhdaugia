import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, HeartHandshake } from 'lucide-react';
import Logo from './Logo';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Phòng tranh Gallery', path: '/gallery' },
      { label: 'Đấu giá trực tiếp', path: '/auction' },
      { label: 'Danh mục họa sĩ', path: '/artists' },
    ],
  },
  {
    title: 'Bảo chứng',
    links: [
      { label: 'Về Artisan Hub', path: '/about' },
      { label: 'Ký quỹ Escrow 72H', path: '/about' },
      { label: 'Chứng thư SHA-256', path: '/about' },
    ],
  },
  {
    title: 'Pháp lý & Hỗ trợ',
    links: [
      { label: 'Quy chế sàn', path: '/about' },
      { label: 'Bảo mật dữ liệu', path: '/about' },
      { label: 'Quyền tác giả', path: '/about' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className={styles.footerRoot}>
      {/* 4 huy hiệu bảo chứng thu gọn dạng 1 thanh ngang tinh tế */}
      <div className={styles.trustStrip}>
        <div className="container">
          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <ShieldCheck size={16} color="var(--gold-primary)" />
              <span>Chứng thư số SHA-256</span>
            </div>
            <div className={styles.trustItem}>
              <Lock size={16} color="var(--gold-primary)" />
              <span>Ký quỹ Escrow 72 Giờ</span>
            </div>
            <div className={styles.trustItem}>
              <Award size={16} color="var(--gold-primary)" />
              <span>Họa sĩ giám định L3</span>
            </div>
            <div className={styles.trustItem}>
              <HeartHandshake size={16} color="var(--gold-primary)" />
              <span>Bảo hiểm vận chuyển 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thân Footer gọn gàng */}
      <div className={styles.mainFooter}>
        <div className="container">
          <div className={styles.footerFlex}>
            {/* Cột Trái: Logo & Tóm tắt ngắn gọn */}
            <div className={styles.brandBox}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Logo size="md" subtitle="AUCTION & GALLERY" />
              </Link>
              <p className={styles.brandText}>
                Nền tảng triển lãm số và đấu giá tranh nghệ thuật độc bản. Kết nối các danh họa đương đại và giới sưu tầm với quy chuẩn bảo chứng bảo tàng.
              </p>
              <div className={styles.contactCompact}>
                <span>Hotline: <strong>(+84) 28 3822 8899</strong></span>
                <span className={styles.contactDot}>·</span>
                <span>curator@artisanhub.gallery</span>
              </div>
            </div>

            {/* Cột Phải: Các liên kết điều hướng 3 cột gọn nhẹ */}
            <div className={styles.linksGroup}>
              {FOOTER_LINKS.map((col, idx) => (
                <div key={idx} className={styles.linkCol}>
                  <h5 className={styles.colHeader}>{col.title}</h5>
                  <ul className={styles.linkList}>
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <Link to={link.path} className={styles.linkItem}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.thinDivider} />

          {/* Dòng Bản quyền dưới cùng */}
          <div className={styles.bottomRow}>
            <p className={styles.copyright}>
              © 2024 - 2026 <strong>Artisan Hub</strong>. Đồ án môn Thiết kế Giao diện Người dùng.
            </p>
            <div className={styles.bottomTags}>
              <span>Vietnam Fine Art</span>
              <span className={styles.bottomDot}>·</span>
              <span>Protected Provenance</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
