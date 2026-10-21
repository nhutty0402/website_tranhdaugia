import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Package, Award, Clock, Shield, ArrowRight,
  CheckCircle, Download, QrCode, ExternalLink,
} from 'lucide-react';
import { ARTWORKS, CERTIFICATES, ESCROW_ORDERS, formatPrice, formatPriceFull } from '../data/mockData';
import styles from './ProfilePage.module.css';

const PROFILE_TABS = ['Bộ sưu tập', 'Đơn hàng & Ký quỹ', 'Chứng chỉ số', 'Cài đặt'];

const ProfilePage = ({ currentUser, addToast }) => {
  const [activeTab, setActiveTab] = useState('Bộ sưu tập');

  if (!currentUser) {
    return (
      <div className={styles.notLoggedIn}>
        <span style={{ fontSize: '3rem' }}>🔐</span>
        <h2>Đăng nhập để xem hồ sơ</h2>
        <p>Quản lý bộ sưu tập, đơn hàng và chứng chỉ số của bạn.</p>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 80 }}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className="container">
          <div className={styles.profileHero}>
            <div className={styles.avatarWrap}>
              <img src={currentUser.avatar} alt={currentUser.full_name} className={styles.avatar} />
              <div className={styles.avatarBadge}>
                <CheckCircle size={14} />
              </div>
            </div>
            <div className={styles.profileInfo}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h1 className={styles.profileName}>{currentUser.full_name}</h1>
                <span className="badge badge-verified">
                  <Shield size={10} /> Tài khoản xác thực
                </span>
              </div>
              <p className={styles.profileUsername}>@{currentUser.username}</p>
              <div className={styles.profileStats}>
                {[
                  { value: '2', label: 'Tác phẩm sở hữu' },
                  { value: '5', label: 'Phiên đã tham gia' },
                  { value: '₫57.5M', label: 'Tổng giá trị sưu tầm' },
                ].map(({ value, label }) => (
                  <div key={label} className={styles.profileStat}>
                    <span className={styles.profileStatVal}>{value}</span>
                    <span className={styles.profileStatLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {PROFILE_TABS.map(tab => (
            <button
              key={tab}
              id={`profile-tab-${tab.replace(/\s/g, '-')}`}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'Bộ sưu tập' && <CollectionTab addToast={addToast} />}
        {activeTab === 'Đơn hàng & Ký quỹ' && <EscrowTab addToast={addToast} />}
        {activeTab === 'Chứng chỉ số' && <CertificatesTab addToast={addToast} />}
        {activeTab === 'Cài đặt' && <SettingsTab user={currentUser} addToast={addToast} />}
      </div>
    </main>
  );
};

const CollectionTab = ({ addToast }) => {
  const ownedArtworks = ARTWORKS.slice(0, 2);
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Bộ sưu tập của tôi</h2>
      <div className={styles.collectionGrid}>
        {ownedArtworks.map(artwork => (
          <div key={artwork.artwork_id} className={styles.collectionCard}>
            <img src={artwork.image} alt={artwork.title} className={styles.collectionImg} />
            <div className={styles.collectionInfo}>
              <span className="badge badge-verified" style={{ alignSelf: 'flex-start' }}>Đã sở hữu</span>
              <h3 className={styles.collectionTitle}>{artwork.title}</h3>
              <p className={styles.collectionArtist}>{artwork.artist_name}</p>
              <p className={styles.collectionMeta}>{artwork.medium} · {artwork.dimensions}</p>
              <div className={styles.collectionFooter}>
                <span className={styles.collectionPrice}>{formatPrice(artwork.current_price)}</span>
                <Link to={`/artwork/${artwork.artwork_id}`} className="btn btn-secondary btn-sm">
                  Xem <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EscrowTab = ({ addToast }) => {
  const order = ESCROW_ORDERS[0];
  const artwork = ARTWORKS.find(a => a.artwork_id === 'aw2');

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Đơn hàng & Ví ký quỹ</h2>

      <div className={styles.escrowCard}>
        <div className={styles.escrowHeader}>
          <div>
            <span className="badge" style={{ background: 'rgba(243,156,18,0.15)', color: '#F39C12', border: '1px solid rgba(243,156,18,0.3)' }}>
              <Clock size={10} /> Đang ký quỹ
            </span>
            <h3 className={styles.escrowTitle}>#{order.escrow_id.toUpperCase()}</h3>
          </div>
          <div className={styles.escrowAmount}>
            <p className={styles.priceLabel}>Số tiền ký quỹ</p>
            <p className={styles.escrowPrice}>{formatPriceFull(order.amount_locked)}</p>
          </div>
        </div>

        <div className={styles.escrowProgress}>
          <div className={styles.escrowStep}>
            <div className={`${styles.stepDot} ${styles.stepDone}`}><CheckCircle size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Thanh toán</p>
              <p className={styles.stepDesc}>Đã thanh toán thành công</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.escrowStep}>
            <div className={`${styles.stepDot} ${styles.stepDone}`}><CheckCircle size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Vận chuyển</p>
              <p className={styles.stepDesc}>Kiện gỗ chuyên dụng đang trên đường</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.escrowStep}>
            <div className={`${styles.stepDot} ${styles.stepActive}`}><Clock size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Nghiệm thu 72h</p>
              <p className={styles.stepDesc}>Còn 48 giờ để xác nhận nhận hàng</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.escrowStep}>
            <div className={styles.stepDot}><Shield size={14} /></div>
            <div>
              <p className={styles.stepLabel}>Giải ngân</p>
              <p className={styles.stepDesc}>Chưa hoàn tất</p>
            </div>
          </div>
        </div>

        <div className={styles.escrowActions}>
          <button className="btn btn-primary" onClick={() => addToast('Đã xác nhận nhận hàng! Tiền sẽ được giải ngân.', 'success')}>
            <CheckCircle size={16} /> Xác nhận đã nhận hàng
          </button>
          <button className="btn btn-danger" onClick={() => addToast('Đã gửi yêu cầu tranh chấp đến ban thẩm định.', 'warning')}>
            Báo cáo vấn đề
          </button>
        </div>
      </div>
    </div>
  );
};

const CertificatesTab = ({ addToast }) => {
  const cert = CERTIFICATES[0];
  const artwork = ARTWORKS.find(a => a.artwork_id === cert.artwork_id);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Thẻ chứng nhận số</h2>

      <div className={styles.certCard}>
        <div className={styles.certHeader}>
          <div className={styles.certBrand}>
            <span style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em' }}>
              ARTISAN HUB
            </span>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Digital Certificate of Authenticity</p>
          </div>
          <div className={styles.certQr}>
            <QrCode size={48} color="var(--gold-primary)" />
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>{cert.qr_verify_code}</p>
          </div>
        </div>

        <div className={styles.certArtwork}>
          <img src={artwork?.image} alt={artwork?.title} className={styles.certImg} />
          <div>
            <h3 className={styles.certArtTitle}>{artwork?.title}</h3>
            <p className={styles.certMeta}>{artwork?.medium} · {artwork?.dimensions} · {artwork?.creation_year}</p>
            <p className={styles.certMeta} style={{ color: 'var(--gold-primary)' }}>By {artwork?.artist_name}</p>
          </div>
        </div>

        <div className={styles.certFields}>
          {[
            { label: 'Certificate ID', value: cert.certificate_id.toUpperCase() },
            { label: 'Chữ ký số SHA-256', value: cert.ownership_hash.substring(0, 48) + '...' },
            { label: 'Chữ ký nghệ sĩ', value: cert.digital_signature.substring(0, 40) + '...' },
          ].map(({ label, value }) => (
            <div key={label} className={styles.certField}>
              <span className={styles.certLabel}>{label}</span>
              <code className={styles.certValue}>{value}</code>
            </div>
          ))}
        </div>

        <div className={styles.certProvenance}>
          <h4 className={styles.provenanceTitle}>Lịch sử chuyển nhượng (Provenance Chain)</h4>
          {cert.provenance_chain.map((item, i) => (
            <div key={i} className={styles.provenanceRow}>
              <div className={`${styles.provDot} ${i === cert.provenance_chain.length - 1 ? styles.provDotActive : ''}`} />
              <div>
                <p className={styles.provOwner}>{item.owner}</p>
                <p className={styles.provMeta}>{item.date} · {item.type}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.certActions}>
          <button className="btn btn-primary" onClick={() => addToast('Đã tải chứng chỉ PDF!', 'success')}>
            <Download size={16} /> Tải chứng chỉ PDF
          </button>
          <button className="btn btn-secondary" onClick={() => addToast('Đã sao chép link xác thực!', 'info')}>
            <ExternalLink size={16} /> Chia sẻ link xác thực
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ user, addToast }) => (
  <div className={styles.tabContent}>
    <h2 className={styles.tabTitle}>Cài đặt tài khoản</h2>
    <div className={styles.settingsForm}>
      {[
        { label: 'Họ và tên', value: user.full_name, id: 'settings-name' },
        { label: 'Email', value: user.email, id: 'settings-email' },
        { label: 'Username', value: user.username, id: 'settings-username' },
      ].map(({ label, value, id }) => (
        <div key={id} className={styles.formGroup}>
          <label className={styles.formLabel}>{label}</label>
          <input id={id} className="input" defaultValue={value} />
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => addToast('Đã cập nhật thông tin!', 'success')}>
        Lưu thay đổi
      </button>
    </div>
  </div>
);

export default ProfilePage;
