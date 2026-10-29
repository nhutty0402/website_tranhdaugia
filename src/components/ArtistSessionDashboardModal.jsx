import React, { useState } from 'react';
import {
  X, Trophy, Users, Shield, ArrowRight,
  CheckCircle, MessageSquare, ExternalLink, Calendar,
  Clock, DollarSign, Lock, AlertCircle, Eye, Award
} from 'lucide-react';
import { formatPriceFull } from '../data/mockData';
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
  const [sessionState, setSessionState] = useState(session?.status || 'live');
  const isEnded = sessionState === 'ended' || (session?.end_time && new Date(session.end_time) <= new Date());

  const handleManualEndSession = () => {
    setSessionState('ended');
    if (onEndSessionNow && session?.session_id) onEndSessionNow(session.session_id);
    if (addToast) addToast('Đã kết thúc phiên đấu giá kín! Hệ thống thông báo người chiến thắng.', 'gold');
  };

  const handleContactWinner = (bid) => {
    setSelectedBid(bid);
    if (onContactWinner && session?.session_id) onContactWinner(session.session_id, bid);
    if (addToast) addToast(`✦ Đã gửi thông báo liên hệ tới ${bid.bidder_name}!`, 'success');
  };

  const handleOpenEscrow = (bid) => {
    if (onCreateEscrow) onCreateEscrow(session, artwork, bid);
    if (addToast) addToast(`✦ Đã tạo lệnh Escrow bảo chứng cho tác phẩm "${artwork?.title}"!`, 'gold');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${styles.modalCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <div className={styles.badgeRow}>
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
            <h2 className={styles.headerTitle}>{artwork?.title}</h2>
            <p className={styles.headerSubtitle}>
              Mã phiên: <code className={styles.code}>{session?.session_id}</code> · Họa sĩ độc quyền quản lý
            </p>
          </div>
          <button
            className={`btn btn-icon btn-ghost ${styles.closeBtn}`}
            onClick={onClose}
            aria-label="Đóng bảng điều khiển"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Summary Metrics */}
        <div className={styles.metricsGrid}>
          <div className={`${styles.metricCard} ${styles.metricLeadingCard}`}>
            <span className={styles.metricLabel}>
              <Trophy size={14} color="var(--gold-primary)" /> Giá thầu dẫn đầu
            </span>
            <span className={styles.metricValueGold}>
              {highestBid ? formatPriceFull(highestBid.bid_amount) : 'Chưa có'}
            </span>
            <span className={styles.metricSub}>
              {highestBid ? `Bởi ${highestBid.bidder_name}` : 'Chờ hồ sơ nộp'}
            </span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <Users size={14} color="var(--gold-primary)" /> Tham gia
            </span>
            <span className={styles.metricValue}>{totalParticipants} người</span>
            <span className={styles.metricSub}>{sortedBids.length} lượt nộp</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <Clock size={14} color="var(--gold-primary)" /> Thời gian
            </span>
            <span className={styles.metricValue}>
              {isEnded ? 'Đã hết giờ' : 'Đang mở'}
            </span>
            <span className={styles.metricSub}>
              {session?.end_time ? (
                <>Đóng: {new Date(session.end_time).toLocaleDateString('vi-VN')} {new Date(session.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</>
              ) : 'Phiên 72h'}
            </span>
          </div>
        </div>

        {/* Status Alert if Session is Live vs Ended */}
        {!isEnded ? (
          <div className={styles.liveNotice}>
            <div className={styles.liveNoticeText}>
              <Lock size={16} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
              <span>Phiên đấu giá đang tiếp nhận hồ sơ bí mật từ các nhà sưu tầm.</span>
            </div>
            <button
              id="btn-fast-end-session"
              className={`btn btn-secondary btn-sm ${styles.noticeActionBtn}`}
              onClick={handleManualEndSession}
              title="Đóng phiên ngay để chốt người thắng và chuyển sang Escrow"
            >
              Chốt phiên ngay (Hết giờ)
            </button>
          </div>
        ) : (
          <div className={styles.endedNotice}>
            <div className={styles.endedNoticeHeader}>
              <Trophy size={20} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h4 className={styles.endedNoticeTitle}>
                  Phiên đã kết thúc! Người thắng cao nhất: {highestBid?.bidder_name || 'Chưa xác định'}
                </h4>
                <p className={styles.endedNoticeDesc}>
                  Mức giá chiến thắng: <strong>{formatPriceFull(highestBid?.bid_amount || 0)}</strong>. 
                  Hãy liên hệ người thắng hoặc tạo ngay đơn ký quỹ Escrow 72h.
                </p>
              </div>
            </div>
            {session?.winner_contacted_at ? (
              <span className={`badge badge-verified ${styles.contactedBadge}`}>
                <CheckCircle size={13} /> Đã liên hệ
              </span>
            ) : (
              <button
                id="btn-contact-top-winner"
                className={`btn btn-primary btn-sm ${styles.noticeActionBtn}`}
                onClick={() => highestBid && handleContactWinner(highestBid)}
              >
                <MessageSquare size={14} /> Liên hệ người thắng
              </button>
            )}
          </div>
        )}

        {/* Bid Ranking Section - Multi-device Responsive (1440px / 768px / 390px) */}
        <div className={styles.tableSection}>
          <div className={styles.tableSectionHeader}>
            <div className={styles.tableTitleWrap}>
              <h3 className={styles.tableTitle}>
                Bảng xếp hạng giá thầu (Cao → Thấp)
              </h3>
              <span className={styles.tableSubtitle}>
                {sortedBids.length} hồ sơ đã ghi nhận · Cập nhật theo thời gian thực
              </span>
            </div>
            <span className={styles.tableTag}>Chỉ chủ tranh thấy</span>
          </div>

          {/* Desktop & Tablet Table View (>= 641px: 1440px Desktop, 768px iPad) */}
          <div className={styles.desktopTableWrap}>
            <table className={styles.bidsTable}>
              <colgroup>
                <col className={styles.colRank} />
                <col className={styles.colCollector} />
                <col className={styles.colPrice} />
                <col className={styles.colTime} />
                <col className={styles.colNote} />
                <col className={styles.colActions} />
              </colgroup>
              <thead>
                <tr>
                  <th>Xếp hạng</th>
                  <th>Nhà sưu tầm (Collector)</th>
                  <th>Mức giá thầu</th>
                  <th>Thời gian nộp</th>
                  <th>Ghi chú / Cam kết</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedBids.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 36, color: 'var(--text-muted)' }}>
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
                          <span className={styles.noteText} title={bid.notes}>
                            {bid.notes || 'Hồ sơ tiêu chuẩn'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              id={`contact-bid-${bid.bid_id}`}
                              className={`btn btn-secondary btn-sm ${styles.tblActionBtn}`}
                              onClick={() => handleContactWinner(bid)}
                              title="Gửi thông báo liên hệ"
                            >
                              <MessageSquare size={13} />
                              <span>Liên hệ</span>
                            </button>
                            <button
                              id={`escrow-bid-${bid.bid_id}`}
                              className={`btn btn-primary btn-sm ${styles.tblActionBtn}`}
                              onClick={() => handleOpenEscrow(bid)}
                              title="Tạo hợp đồng ký quỹ bảo chứng Escrow 72h"
                            >
                              <Shield size={13} />
                              <span>Tạo hợp đồng</span>
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

          {/* Mobile Card List View (< 641px / 390px Mobile) */}
          <div className={styles.mobileBidsList}>
            {sortedBids.length === 0 ? (
              <div className={styles.mobileEmptyState}>
                <Lock size={28} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                <p>Chưa có hồ sơ ra giá kín nào được gửi.</p>
              </div>
            ) : (
              sortedBids.map((bid, index) => {
                const isTop = index === 0;
                return (
                  <div
                    key={bid.bid_id}
                    className={`${styles.mobileBidCard} ${isTop ? styles.mobileBidCardTop : ''}`}
                  >
                    {/* Top Row: Rank & Time */}
                    <div className={styles.mobileCardHeader}>
                      <div className={styles.mobileCardRank}>
                        {isTop ? (
                          <span className={styles.rankBadgeTop}>
                            <Trophy size={11} /> #1 Dẫn đầu
                          </span>
                        ) : (
                          <span className={styles.rankBadge}>#{index + 1}</span>
                        )}
                      </div>
                      <span className={styles.mobileCardTime}>
                        <Clock size={11} />
                        {new Date(bid.placed_at).toLocaleDateString('vi-VN')} {new Date(bid.placed_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Middle Row: Bidder & Price */}
                    <div className={styles.mobileCardMain}>
                      <div className={styles.mobileBidderInfo}>
                        <span className={styles.mobileBidderName}>{bid.bidder_name}</span>
                        <span className={styles.mobileBidderId}>Mã ID: {bid.bidder_id}</span>
                      </div>
                      <div className={styles.mobilePriceWrap}>
                        <span className={styles.mobilePriceLabel}>Mức giá thầu</span>
                        <span className={isTop ? styles.priceTop : styles.priceNormal}>
                          {formatPriceFull(bid.bid_amount)}
                        </span>
                      </div>
                    </div>

                    {/* Note if present */}
                    {bid.notes && (
                      <div className={styles.mobileCardNote}>
                        <span className={styles.mobileNoteLabel}>Cam kết:</span> {bid.notes}
                      </div>
                    )}

                    {/* Action buttons (Touch-friendly 50/50 on 390px) */}
                    <div className={styles.mobileCardActions}>
                      <button
                        id={`m-contact-bid-${bid.bid_id}`}
                        className={`btn btn-secondary btn-sm ${styles.mobileActionBtn}`}
                        onClick={() => handleContactWinner(bid)}
                      >
                        <MessageSquare size={13} />
                        <span>Liên hệ</span>
                      </button>
                      <button
                        id={`m-escrow-bid-${bid.bid_id}`}
                        className={`btn btn-primary btn-sm ${styles.mobileActionBtn}`}
                        onClick={() => handleOpenEscrow(bid)}
                      >
                        <Shield size={13} />
                        <span>Tạo Escrow</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footerBar}>
          <div className={styles.footerNote}>
            <Shield size={14} color="var(--success)" style={{ flexShrink: 0 }} />
            <span>Ký quỹ Escrow bảo chứng an toàn 72h cho tới khi Collector xác nhận nhận tranh.</span>
          </div>
          <button className={`btn btn-ghost ${styles.footerCloseBtn}`} onClick={onClose}>
            Đóng bảng điều khiển
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistSessionDashboardModal;
