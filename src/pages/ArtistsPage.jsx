import React from 'react';
import { Link } from 'react-router-dom';
import { Award, MapPin, Star, ArrowRight } from 'lucide-react';
import { USERS, ARTWORKS } from '../data/mockData';
import styles from './ArtistsPage.module.css';

const ArtistsPage = ({ addToast }) => {
  const artists = USERS.filter(u => u.role === 'artist');

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 80 }}>
      <div className={styles.pageHeader}>
        <div className="container">
          <span className="section-label">Cộng đồng sáng tạo</span>
          <h1 className={styles.pageTitle}>Họa sĩ</h1>
          <p className={styles.pageDesc}>{artists.length} họa sĩ đã được xác thực trên Artisan Hub</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        <div className={styles.artistsGrid}>
          {artists.map(artist => {
            const works = ARTWORKS.filter(a => a.artist_id === artist.user_id);
            return (
              <div key={artist.user_id} className={`card ${styles.artistCard}`} id={`artist-${artist.user_id}`}>
                {/* Cover */}
                <div className={styles.artistCover}>
                  {works[0] && <img src={works[0].image} alt="" className={styles.coverImg} />}
                  <div className={styles.coverOverlay} />
                </div>

                {/* Profile */}
                <div className={styles.artistProfile}>
                  <div className={styles.avatarWrap}>
                    <img src={artist.avatar} alt={artist.full_name} className={styles.avatar} />
                    <span className={styles.verifiedBadge}><Award size={12} /></span>
                  </div>

                  <div className={styles.artistInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Link to={`/artists/${artist.user_id}`} style={{ textDecoration: 'none' }}>
                        <h3 className={styles.artistName}>{artist.full_name}</h3>
                      </Link>
                      <span className="badge badge-verified" style={{ fontSize: '0.6rem' }}>Xác thực L3</span>
                    </div>
                    <div className={styles.artistMeta}>
                      <span className={styles.metaItem}>
                        <MapPin size={11} /> {artist.studio_address?.split(',').slice(-2).join(',').trim()}
                      </span>
                      <span className={styles.metaItem}>
                        <Star size={11} /> {works.length} tác phẩm
                      </span>
                    </div>
                    <p className={styles.artistBio}>{artist.artist_bio}</p>
                  </div>

                  {/* Works preview */}
                  <div className={styles.worksPreview}>
                    {works.slice(0, 3).map(work => (
                      <Link key={work.artwork_id} to={`/artwork/${work.artwork_id}`} className={styles.workThumb}>
                        <img src={work.image} alt={work.title} />
                      </Link>
                    ))}
                  </div>

                  <div className={styles.artistFooter}>
                    <button
                      id={`follow-${artist.user_id}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() => addToast(`Đã theo dõi ${artist.full_name}!`, 'gold')}
                    >
                      Theo dõi
                    </button>
                    <Link to={`/artists/${artist.user_id}`} className="btn btn-primary btn-sm">
                      Xem hồ sơ Họa sĩ <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default ArtistsPage;
