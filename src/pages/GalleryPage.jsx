import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, List, X, RotateCcw, Palette } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';
import { ARTWORKS, AUCTION_SESSIONS, FILTER_STYLES, FILTER_PRICE_RANGES } from '../data/mockData';
import styles from './GalleryPage.module.css';

const GalleryPage = ({ wishlisted, onWishlist }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Tất cả');
  const [selectedPrice, setSelectedPrice] = useState(FILTER_PRICE_RANGES[0]);
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [sortBy, setSortBy] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getSession = (artworkId) => AUCTION_SESSIONS.find(s => s.artwork_id === artworkId);

  const filtered = ARTWORKS.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStyle = selectedStyle === 'Tất cả' || a.style === selectedStyle || a.tags.includes(selectedStyle);
    const matchesPrice = a.current_price >= selectedPrice.min && a.current_price <= selectedPrice.max;
    return matchesSearch && matchesStyle && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.current_price - b.current_price;
    if (sortBy === 'price-desc') return b.current_price - a.current_price;
    if (sortBy === 'newest') return b.creation_year - a.creation_year;
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={`container ${styles.headerInner}`}>
          <span className={styles.sectionLabel}>TRIỂN LÃM SỐ HOÀNG GIA</span>
          <h1 className={styles.pageTitle}>Khám phá Tác phẩm</h1>
          <p className={styles.pageDesc}>
          Kiệt tác hội họa độc bản được thẩm định & bảo chứng chứng thư số SHA-256 từ các danh họa hàng đầu.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {/* Search & Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <Search size={16} color="var(--text-muted)" />
            <input
              id="gallery-search"
              className={styles.searchInput}
              placeholder="Tìm tranh, họa sĩ, phong cách..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)', display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.filterControls}>
            <select
              id="gallery-sort"
              className={`input select ${styles.sortSelect}`}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="featured">Nổi bật</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>

            <button
              id="gallery-filter-btn"
              className={`btn btn-ghost ${filtersOpen ? styles.filterBtnActive : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={16} /> Bộ lọc
              {(selectedStyle !== 'Tất cả' || selectedPrice !== FILTER_PRICE_RANGES[0]) && (
                <span className={styles.filterBadge}>!</span>
              )}
            </button>

            <div className={styles.viewToggle}>
              <button
                id="view-grid"
                className={`btn btn-icon ${viewMode === 'grid' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                id="view-list"
                className={`btn btn-icon ${viewMode === 'list' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Extended filters */}
        {filtersOpen && (
          <div className={styles.extFilters}>
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>Phong cách nghệ thuật</p>
              <div className={styles.filterTags}>
                {FILTER_STYLES.map(style => (
                  <button
                    key={style}
                    id={`filter-style-${style}`}
                    className={`tag ${selectedStyle === style ? 'active' : ''}`}
                    onClick={() => setSelectedStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>Khoảng giá</p>
              <div className={styles.filterTags}>
                {FILTER_PRICE_RANGES.map(range => (
                  <button
                    key={range.label}
                    id={`filter-price-${range.label}`}
                    className={`tag ${selectedPrice.label === range.label ? 'active' : ''}`}
                    onClick={() => setSelectedPrice(range)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result count */}
        <div className={styles.resultMeta}>
          <p>{filtered.length} tác phẩm</p>
          {(selectedStyle !== 'Tất cả' || selectedPrice !== FILTER_PRICE_RANGES[0]) && (
            <button
              className={styles.clearFilter}
              onClick={() => { setSelectedStyle('Tất cả'); setSelectedPrice(FILTER_PRICE_RANGES[0]); }}
            >
              Xóa bộ lọc <X size={12} />
            </button>
          )}
        </div>

        {/* Artwork grid */}
        {filtered.length > 0 ? (
          <div className={viewMode === 'grid' ? styles.grid : styles.listGrid}>
            {filtered.map(artwork => (
              <ArtworkCard
                key={artwork.artwork_id}
                artwork={artwork}
                session={getSession(artwork.artwork_id)}
                wishlisted={wishlisted.has(artwork.artwork_id)}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <Palette size={32} />
            </div>
            <h3>Không tìm thấy kiệt tác phù hợp</h3>
            <p>
              Không có tác phẩm nào khớp với từ khóa tìm kiếm <strong>"{searchQuery}"</strong> hoặc các tiêu chí bộ lọc đã chọn.
            </p>
            <div className={styles.emptySuggestions}>
              <span className={styles.emptySuggestLabel}>Khám phá nhanh:</span>
              {['Sơn dầu', 'Sơn mài', 'Tranh lụa', 'Trừu tượng'].map(style => (
                <button
                  key={style}
                  type="button"
                  className="tag"
                  style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStyle(style);
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 8 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedStyle('Tất cả');
                setSelectedPrice(FILTER_PRICE_RANGES[0]);
              }}
            >
              <RotateCcw size={15} /> Đặt lại tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default GalleryPage;
