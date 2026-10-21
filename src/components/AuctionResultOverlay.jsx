import React from 'react';
import {
  Trophy, Frown, Shield, ArrowRight, X, Sparkles, MessageSquare
} from 'lucide-react';
import { formatPriceFull } from '../data/mockData';
import styles from './AuctionResultOverlay.module.css';

const AuctionResultOverlay = ({
  isWinner,
  artwork,
  session,
  winningBid,
  userBid,
  onClose,
  onCreateEscrow,
  onContactArtist
}) => {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${styles.resultModal} ${isWinner ? styles.winnerBorder : styles.loserBorder}`}>
        <button className={`btn btn-icon btn-ghost ${styles.closeBtn}`} onClick={onClose}>
          <X size={18} />
        </button>

        {isWinner ? (
          /* WINNER VIEW */
          <div className={styles.innerContent}>
            <div className={styles.iconCircleWinner}>
              <Trophy size={42} color="#D4AF37" />
              <Sparkles size={20} className={styles.sparkleIcon} />
            </div>

            <span className="badge badge-gold">✦ CHÚC MỪNG CHIẾN THẮNG ✦</span>
            <h2 className={styles.titleWinner}>Bạn đã thắng phiên đấu giá kín!</h2>
            <p className={styles.subtitle}>
              Hồ sơ ra giá của bạn đã được Họa sĩ lựa chọn và dẫn đầu phiên đấu giá tác phẩm:
            </p>

            <div className={styles.artSnippet}>
              <img src={artwork.image} alt={artwork.title} className={styles.artThumb} />
              <div className={styles.artMeta}>
                <h4 className={styles.artName}>{artwork.title}</h4>
                <p className={styles.artArtist}>Họa sĩ: {artwork.artist_name}</p>
                <p className={styles.winningAmount}>
                  Mức giá trúng: <strong>{formatPriceFull(winningBid?.bid_amount || session.current_highest_price)}</strong>
                </p>
              </div>
            </div>

            <div className={styles.escrowGuide}>
              <Shield size={18} color="var(--success)" />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Bước tiếp theo: Tiến hành mở hợp đồng ký quỹ <strong>Escrow 72h</strong>. Tiền của bạn sẽ được bảo chứng tuyệt đối cho đến khi tác phẩm được vận chuyển an toàn tới tay bạn.
              </div>
            </div>

            <div className={styles.actionRow}>
              <button className="btn btn-secondary" onClick={onContactArtist}>
                <MessageSquare size={16} /> Nhắn tin cho Họa sĩ
              </button>
              <button id="btn-proceed-escrow" className="btn btn-primary" onClick={onCreateEscrow}>
                Tạo hợp đồng Escrow <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* NON-WINNER VIEW */
          <div className={styles.innerContent}>
            <div className={styles.iconCircleLoser}>
              <Frown size={38} color="var(--text-muted)" />
            </div>

            <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
              KẾT QUẢ PHIÊN ĐẤU GIÁ KÍN
            </span>
            <h2 className={styles.titleLoser}>Rất tiếc, bạn chưa trúng phiên này</h2>
            <p className={styles.subtitle}>
              Cảm ơn bạn đã tham gia phiên đấu giá kín tác phẩm <strong>"{artwork.title}"</strong>.
            </p>

            <div className={styles.artSnippet}>
              <img src={artwork.image} alt={artwork.title} className={styles.artThumb} />
              <div className={styles.artMeta}>
                <h4 className={styles.artName}>{artwork.title}</h4>
                <p className={styles.artArtist}>Họa sĩ: {artwork.artist_name}</p>
                {userBid && (
                  <p className={styles.artMinBid}>
                    Mức giá bạn đã nộp: <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{formatPriceFull(userBid.bid_amount)}</span>
                  </p>
                )}
                <p className={styles.winningAmount}>
                  Mức giá thắng phiên: <strong>{formatPriceFull(winningBid?.bid_amount || session.current_highest_price)}</strong>
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '8px 0' }}>
              Nhiều tác phẩm độc bản khác của họa sĩ và triển lãm đang chờ bạn khám phá!
            </p>

            <div className={styles.actionRow}>
              <button className="btn btn-ghost" onClick={onClose}>
                Đóng
              </button>
              <a href="/gallery" className="btn btn-secondary">
                Khám phá triển lãm khác <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionResultOverlay;
