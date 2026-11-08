import React, { useState } from 'react';
import {
  X, Trophy, Users, Shield, ArrowRight,
  CheckCircle, MessageSquare, Mail, ExternalLink, Calendar,
  Clock, DollarSign, Lock, AlertCircle, Eye, Award,
  Sparkles, ArrowDownRight, ArrowUpRight, XCircle
} from 'lucide-react';
import { formatPriceFull, formatPrice } from '../data/mockData';
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
  const lowestBid = sortedBids.length > 0 ? sortedBids[sortedBids.length - 1] : null;
  const avgBid = sortedBids.length > 0
    ? Math.round(sortedBids.reduce((sum, b) => sum + b.bid_amount, 0) / sortedBids.length)
    : 0;
  const totalParticipants = new Set(sortedBids.map(b => b.bidder_id || b.bidder_name)).size;

  const [selectedBid, setSelectedBid] = useState(highestBid);
  const [sessionState, setSessionState] = useState(session?.status || 'live');
  const [declined, setDeclined] = useState(false);
  const isEnded = sessionState === 'ended' || (session?.end_time && new Date(session.end_time) <= new Date());

  const handleManualEndSession = () => {
    setSessionState('ended');
    if (onEndSessionNow && session?.session_id) onEndSessionNow(session.session_id);
    if (addToast) addToast('Đã kết thúc phiên đấu giá kín! Hệ thống thông báo người chiến thắng.', 'gold');
  };

  const handleDeclineAll = () => {
    if (window.confirm('Bạn có chắc muốn từ chối các mức giá này và giữ lại tranh? Tác phẩm sẽ không bị ép bán và tiếp tục thuộc về bộ sưu tập của bạn.')) {
      setDeclined(true);
      setSessionState('declined');
      if (addToast) addToast('Đã giữ lại tác phẩm! Bạn không bị bắt buộc bán khi giá chưa đạt kỳ vọng.', 'info');
    }
  };

  const handleContactWinner = (bid) => {
    setSelectedBid(bid);
    const bidderEmail = bid.bidder_email || `${bid.bidder_id || 'collector'}@artisan-hub.vn`;
    if (onContactWinner && session?.session_id) onContactWinner(session.session_id, bid);
    if (addToast) addToast(`✦ Đã mở kết nối Email tới Nhà sưu tầm ${bid.bidder_name} (${bidderEmail})!`, 'success');
    window.location.href = `mailto:${bidderEmail}?subject=${encodeURIComponent(`[Artisan Hub] Trao đổi giá thầu tác phẩm "${artwork?.title || 'Tác phẩm'}"`)}&body=${encodeURIComponent(`Kính gửi ${bid.bidder_name},\n\nTôi là họa sĩ sáng tác tác phẩm "${artwork?.title || 'Tác phẩm'}". Tôi đã nhận được đề xuất giá thầu ${formatPriceFull(bid.bid_amount)} của bạn trên hệ thống đấu giá kín Artisan Hub.\n\nTrân trọng!`)}`;
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

        {/* Top Summary Metrics: Tối đa, Tối thiểu, Biên độ, Quy mô */}
        <div className={styles.metricsGrid}>
          {/* Card 1: Giá Tối đa */}
          <div className={`${styles.metricCard} ${styles.metricLeadingCard}`}>
            <span className={styles.metricLabel}>
              <ArrowUpRight size={14} color="var(--gold-primary)" /> Giá TỐI ĐA (Dẫn đầu)
            </span>
            <span className={styles.metricValueGold}>
              {highestBid ? formatPriceFull(highestBid.bid_amount) : 'Chưa có'}
            </span>
            <span className={styles.metricSub}>
              {highestBid ? `Bởi ${highestBid.bidder_name}` : 'Chờ đề xuất'}
            </span>
          </div>

          {/* Card 2: Giá Tối thiểu */}
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <ArrowDownRight size={14} style={{ color: '#2ECC71' }} /> Giá TỐI THIỂU (Sàn)
            </span>
            <span className={styles.metricValue} style={{ color: '#2ECC71' }}>
              {lowestBid ? formatPriceFull(lowestBid.bid_amount) : 'Chưa có'}
            </span>
            <span className={styles.metricSub}>
              {lowestBid ? `Bởi ${lowestBid.bidder_name}` : 'Chờ đề xuất'}
            </span>
          </div>

          {/* Card 3: Biên độ định giá */}
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <Sparkles size={14} color="var(--gold-primary)" /> Biên độ định giá
            </span>
            <span className={styles.metricValue} style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {lowestBid && highestBid
                ? `${formatPrice(lowestBid.bid_amount)} ~ ${formatPrice(highestBid.bid_amount)}`
                : 'Chưa đủ dữ liệu'}
            </span>
            <span className={styles.metricSub}>
              {avgBid > 0 ? `TB: ${formatPrice(avgBid)}` : 'Tự do đề xuất'}
            </span>
          </div>

          {/* Card 4: Người tham gia */}
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              <Users size={14} color="var(--gold-primary)" /> Tham gia
            </span>
            <span className={styles.metricValue}>{totalParticipants} người</span>
            <span className={styles.metricSub}>{sortedBids.length} lượt đề xuất</span>
          </div>
        </div>

        {/* Banner phân tích thị trường khám phá giá */}
        <div className={styles.marketInsightBanner}>
          <div className={styles.marketInsightIcon}>
            <Sparkles size={18} color="var(--gold-primary)" />
          </div>
          <div>
            <h4 className={styles.marketInsightTitle}>
              Kết quả khám phá giá từ cộng đồng (Không có giá khởi điểm)
            </h4>
            <p className={styles.marketInsightText}>
              {sortedBids.length > 0 ? (
                <>
                  Dựa trên <strong>{sortedBids.length} lượt tự do định giá</strong>, tác phẩm của bạn đang được người mua định giá trong khoảng từ <strong>tối thiểu {formatPriceFull(lowestBid?.bid_amount || 0)}</strong> đến <strong>tối đa {formatPriceFull(highestBid?.bid_amount || 0)}</strong> (Mức trung bình: <strong>{formatPriceFull(avgBid)}</strong>).
                </>
              ) : (
                'Chưa có hồ sơ giá kín nào được gửi. Khi có các nhà sưu tầm tự do đề xuất giá, hệ thống sẽ thống kê giá tối thiểu và tối đa tại đây.'
              )}
            </p>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed rgba(212, 175, 55, 0.25)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
              <Shield size={13} /> Quyền của Họa sĩ: Bạn toàn quyền từ chối bán nếu mức giá đề xuất chưa đạt kỳ vọng.
            </div>
          </div>
        </div>

        {/* Status Alert if Session is Live vs Ended */}
        {declined ? (
          <div style={{ background: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.3)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Shield size={20} color="#3498DB" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#3498DB', fontWeight: 700 }}>
                Đã giữ lại tác phẩm (Không chấp thuận bán)
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Bạn đã từ chối các mức giá đề xuất này. Tác phẩm tiếp tục thuộc sở hữu của bạn và không có giao dịch Escrow nào được tạo.
              </p>
            </div>
          </div>
        ) : !isEnded ? (
          <div className={styles.liveNotice}>
            <div className={styles.liveNoticeText}>
              <Lock size={16} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
              <span>Phiên đấu giá đang tiếp nhận hồ sơ bí mật từ các nhà sưu tầm.</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                id="btn-fast-end-session"
                className={`btn btn-secondary btn-sm ${styles.noticeActionBtn}`}
                onClick={handleManualEndSession}
                title="Đóng phiên ngay để chốt người thắng và chuyển sang Escrow"
              >
                Chốt phiên ngay (Hết giờ)
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: '#E74C3C', border: '1px solid rgba(231,76,60,0.3)', background: 'rgba(231,76,60,0.06)' }}
                onClick={handleDeclineAll}
                title="Giữ lại tranh nếu không muốn bán ở các mức giá đề xuất hiện tại"
              >
                <XCircle size={14} /> Giữ lại tranh (Hủy phiên)
              </button>
            </div>
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
                  Mức giá cao nhất: <strong>{formatPriceFull(highestBid?.bid_amount || 0)}</strong>.
                  Bạn có thể liên hệ người thắng để bán hoặc từ chối nếu mức giá chưa đạt kỳ vọng.
                </p>
              </div>
            </div>
            {session?.winner_contacted_at ? (
              <span className={`badge badge-verified ${styles.contactedBadge}`}>
                <CheckCircle size={13} /> Đã liên hệ
              </span>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  id="btn-contact-top-winner"
                  className={`btn btn-primary btn-sm ${styles.noticeActionBtn}`}
                  onClick={() => highestBid && handleContactWinner(highestBid)}
                >
                  <MessageSquare size={14} /> Liên hệ người thắng
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#E74C3C', border: '1px solid rgba(231,76,60,0.3)', background: 'rgba(231,76,60,0.06)' }}
                  onClick={handleDeclineAll}
                  title="Từ chối bán nếu mức giá chưa đạt kỳ vọng của bạn"
                >
                  <XCircle size={14} /> Từ chối bán (Giữ lại tranh)
                </button>
              </div>
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
                <col className={styles.colNote} />
                <col className={styles.colActions} />
              </colgroup>
              <thead>
                <tr>
                  <th>Xếp hạng</th>
                  <th>Nhà sưu tầm & Thời gian</th>
                  <th>Mức giá thầu</th>
                  <th>Ghi chú / Cam kết</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedBids.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 36, color: 'var(--text-muted)' }}>
                      Chưa có hồ sơ ra giá kín nào được gửi.
                    </td>
                  </tr>
                ) : (
                  sortedBids.map((bid, index) => {
                    const isTop = index === 0;
                    const dateObj = new Date(bid.placed_at);
                    const formattedDate = dateObj.toLocaleDateString('vi-VN');
                    const formattedTime = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr
                        key={bid.bid_id}
                        className={`${styles.bidTableRow} ${isTop ? styles.topRow : ''}`}
                      >
                        <td>
                          {isTop ? (
                            <span className={styles.rankBadgeTop}>
                              <Trophy size={11} /> #1 Thắng
                            </span>
                          ) : (
                            <span className={styles.rankBadge}>#{index + 1}</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.bidderCell}>
                            <div className={styles.bidderNameRow}>
                              <strong className={styles.bidderName}>{bid.bidder_name}</strong>
                              <span className={styles.bidderId}>({bid.bidder_id})</span>
                            </div>
                            <span className={styles.bidderTime}>
                              <Clock size={11} /> {formattedDate} {formattedTime}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.priceCell}>
                            <span className={isTop ? styles.priceTop : styles.priceNormal}>
                              {formatPriceFull(bid.bid_amount)}
                            </span>
                            {isTop && (
                              <span className={styles.leadingPill}>Dẫn đầu</span>
                            )}
                          </div>
                        </td>
                        <td className={styles.tdNote}>
                          <p className={styles.noteText}>
                            {bid.notes || 'Sưu tập tư nhân, cam kết thanh toán'}
                          </p>
                        </td>
                        <td className={styles.tdActions}>
                          <div className={styles.rowActions}>
                            <button
                              id={`contact-bid-${bid.bid_id}`}
                              className={`btn btn-secondary btn-sm ${styles.tblActionBtn}`}
                              onClick={() => handleContactWinner(bid)}
                              title={`Gửi liên hệ tới Email của ${bid.bidder_name}`}
                            >
                              <Mail size={13} />
                              <span>Liên hệ Email</span>
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

                    {/* Action buttons (Touch-friendly on 390px) */}
                    <div className={styles.mobileCardActions}>
                      <button
                        id={`m-contact-bid-${bid.bid_id}`}
                        className={`btn btn-secondary btn-sm ${styles.mobileActionBtn}`}
                        onClick={() => handleContactWinner(bid)}
                        style={{ width: '100%' }}
                      >
                        <Mail size={14} />
                        <span>Liên hệ Email</span>
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
