import React, { useState } from 'react';
import {
  X, Trophy, Users, Shield, ArrowRight,
  CheckCircle, MessageSquare, ExternalLink, Calendar,
  Clock, DollarSign, Lock, AlertCircle, Eye
} from 'lucide-react';
import { formatPriceFull, formatCountdown } from '../data/mockData';
import styles from './ArtistSessionDashboardModal.module.css';

const ArtistSessionDashboardModal = ({
  session,
  artwork,
  bids,
  onClose,
  onContactWinner,
  onCreateEscrow,
  onEndSessionNow,
  addToast
}) => {
  // Sort bids high to low
  const sortedBids = [...(bids || [])].sort((a, b) => b.bid_amount - a.bid_amount);
  const highestBid = sortedBids[0];
  const totalParticipants = new Set(sortedBids.map(b => b.bidder_id || b.bidder_name)).size;

  const [selectedBid, setSelectedBid] = useState(highestBid);
  const [showEscrowConfirm, setShowEscrowConfirm] = useState(false);
  const [sessionState, setSessionState] = useState(session.status); // 'live' | 'ended'
  const isEnded = sessionState === 'ended' || new Date(session.end_time) <= new Date();

  const handleManualEndSession = () => {
    setSessionState('ended');
    if (onEndSessionNow) onEndSessionNow(session.session_id);
    addToast('Đã kết thúc phiên đấu giá kín! Hệ thống thông báo người chiến thắng.', 'gold');
  };

  const handleContactWinner = (bid) => {
    setSelectedBid(bid);
    onContactWinner(session.session_id, bid);
    addToast(`✦ Đã gửi thông báo liên hệ tới ${bid.bidder_name}!`, 'success');
  };

  const handleOpenEscrow = (bid) => {
    onCreateEscrow(session, artwork, bid);
    addToast(`✦ Đã tạo lệnh Escrow bảo chứng cho tác phẩm "${artwork.title}"!`, 'gold');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-gold">
                <Lock size={12} /> BẢNG ĐIỀU KHIỂN PHIÊN KÍN
              </span>
              {isEnded ? (
                <span className="badge" style={{ background: 'rgba(46,204,113,0.15)', color: '#2ECC71', border: '1px solid rgba(46,204,113,0.3)' }}>
                  ĐÃ HOÀN TẤT
                </span>
              ) : (
                <span className="badge badge-live">ĐANG NHẬN GIÁ</span>
              )}
            </div>
            <h2 className={styles.headerTitle}>{artwork.title}</h2>
            <p className={styles.headerSubtitle}>
              Mã phiên: <code className={styles.code}>{session.session_id}</code> · Họa sĩ độc quyền quản lý
            </p>
          </div>
          <button className={`btn btn-icon btn-ghost ${styles.closeBtn}`} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Top Summary Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <Users size={14} color="var(--gold-primary)" /> Số người tham gia
            </span>
            <span className={styles.metricValue}>{totalParticipants} người</span>
            <span className={styles.metricSub}>{sortedBids.length} lượt nộp hồ sơ</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <Trophy size={14} color="var(--gold-primary)" /> Giá thầu dẫn đầu
            </span>
            <span className={styles.metricValueGold}>
              {highestBid ? formatPriceFull(highestBid.bid_amount) : 'Chưa có'}
            </span>
            <span className={styles.metricSub}>
              {highestBid ? `Bởi ${highestBid.bidder_name}` : 'Chờ hồ sơ'}
            </span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <Clock size={14} color="var(--gold-primary)" /> Trạng thái thời gian
            </span>
            <span className={styles.metricValue}>
              {isEnded ? 'Hết giờ nhận giá' : 'Đang mở'}
            </span>
            <span className={styles.metricSub}>
              Đóng: {new Date(session.end_time).toLocaleDateString('vi-VN')} {new Date(session.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Status Alert if Session is Live vs Ended */}
        {!isEnded ? (
          <div className={styles.liveNotice}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Lock size={16} color="var(--gold-primary)" />
              <span>Phiên đấu giá đang tiếp nhận hồ sơ bí mật từ các nhà sưu tầm.</span>
            </div>
            <button
              id="btn-fast-end-session"
              className="btn btn-secondary btn-sm"
              onClick={handleManualEndSession}
              title="Đóng phiên ngay để chốt người thắng và chuyển giao đoạn Escrow"
            >
              Chốt phiên ngay (Hết giờ)
            </button>
          </div>
        ) : (
          <div className={styles.endedNotice}>
            <Trophy size={20} color="var(--gold-primary)" />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 2px', color: 'var(--text-primary)' }}>
                Phiên đã kết thúc! Người thắng cao nhất: {highestBid?.bidder_name}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Mức giá chiến thắng: <strong>{formatPriceFull(highestBid?.bid_amount || 0)}</strong>. 
                Hãy liên hệ người thắng hoặc tạo ngay đơn ký quỹ Escrow 72h.
              </p>
            </div>
            {session.winner_contacted_at ? (
              <span className="badge badge-verified">
                <CheckCircle size={12} /> Đã liên hệ
              </span>
            ) : (
              <button
                id="btn-contact-top-winner"
                className="btn btn-primary btn-sm"
                onClick={() => handleContactWinner(highestBid)}
              >
                <MessageSquare size={14} /> Liên hệ người thắng
              </button>
            )}
          </div>
        )}

        {/* Bid Ranking Table (Bảng xếp hạng giá thầu: Cao -> Thấp) */}
        <div className={styles.tableSection}>
          <div className={styles.tableSectionHeader}>
            <h3 className={styles.tableTitle}>
              Bảng xếp hạng hồ sơ giá thầu (Cao → Thấp)
            </h3>
            <span className={styles.tableTag}>Chỉ hiển thị cho chủ tranh</span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.bidsTable}>
              <thead>
                <tr>
                  <th>Xếp hạng</th>
                  <th>Nhà sưu tầm (Collector)</th>
                  <th>Mức giá thầu</th>
                  <th>Thời gian nộp</th>
                  <th>Ghi chú / Cam kết</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedBids.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                      Chưa có hồ sơ ra giá kín nào được gửi.
                    </td>
                  </tr>
                ) : (
                  sortedBids.map((bid, index) => {
                    const isTop = index === 0;
                    return (
                      <tr
                        key={bid.bid_id}
                        className={`${styles.bidTableRow} ${isTop ? styles.topRow : ''}`}
                      >
                        <td>
                          {isTop ? (
                            <span className={styles.rankBadgeTop}>
                              <Trophy size={12} /> #1 Thắng
                            </span>
                          ) : (
                            <span className={styles.rankBadge}>#{index + 1}</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.bidderCell}>
                            <span className={styles.bidderName}>{bid.bidder_name}</span>
                            <span className={styles.bidderId}>ID: {bid.bidder_id}</span>
                          </div>
                        </td>
                        <td>
                          <span className={isTop ? styles.priceTop : styles.priceNormal}>
                            {formatPriceFull(bid.bid_amount)}
                          </span>
                        </td>
                        <td>
                          <span className={styles.timeText}>
                            {new Date(bid.placed_at).toLocaleDateString('vi-VN')} {new Date(bid.placed_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td>
                          <span className={styles.noteText}>
                            {bid.notes || 'Hồ sơ tiêu chuẩn'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              id={`contact-bid-${bid.bid_id}`}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              onClick={() => handleContactWinner(bid)}
                            >
                              <MessageSquare size={13} /> Liên hệ
                            </button>
                            <button
                              id={`escrow-bid-${bid.bid_id}`}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              onClick={() => handleOpenEscrow(bid)}
                            >
                              <Shield size={13} /> Tạo Escrow
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footerBar}>
          <div className={styles.footerNote}>
            <Shield size={14} color="var(--success)" />
            <span>Đơn Escrow sẽ giữ tiền an toàn 72h cho tới khi Collector nghiệm thu tác phẩm.</span>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng bảng điều khiển
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistSessionDashboardModal;
