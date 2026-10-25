import React, { useState, useRef, useEffect } from 'react';
import {
  Compass, Gavel, Palette, ShieldCheck, X, Send, Sparkles,
  Award, MessageSquare, Landmark, HelpCircle, Layers, Check
} from 'lucide-react';
import styles from './CommunityChatDrawer.module.css';

// Dữ liệu thảo luận thực tế và tách biệt 100% theo từng chuyên đề
const CHANNEL_DATA = {
  curator: {
    title: 'HỘI ĐỒNG GIÁM TUYỂN & THẨM ĐỊNH',
    subtitle: 'Tư vấn chứng thư số SHA-256, lai lịch tác phẩm & ký quỹ Escrow',
    icon: Landmark,
    badgeColor: '#D4AF37',
    messages: [
      {
        id: 'cur_1',
        sender: 'GS. TS. Trần Viết Cường',
        role: 'curator',
        badge: 'Chủ tịch Thẩm định',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: 'Kính chào quý vị! Mọi tác phẩm mở phiên trên sàn Artisan Hub đều được Ban Giám tuyển kiểm định thực tế 3 bước: quang phổ màu, chất lượng nền toan và thẩm tra chữ ký số tác quyền.',
        time: '19:40',
        isCurator: true,
      },
      {
        id: 'cur_2',
        sender: 'Phan Hoàng Yến Trang (Victoria)',
        role: 'collector',
        badge: 'VIP Patron L3',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        content: 'Thưa Giáo sư Cường, chứng thư SHA-256 được lưu trữ vĩnh viễn trên sổ cái sau khi tôi thắng đấu giá thì có tích hợp giấy bảo hiểm vận chuyển của bảo tàng không?',
        time: '20:12',
      },
      {
        id: 'cur_3',
        sender: 'GS. TS. Trần Viết Cường',
        role: 'curator',
        badge: 'Chủ tịch Thẩm định',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: 'Chào chị Yến Trang! Chứng thư đi kèm mã QR vật lý gắn niêm phong nhiệt trên khung tranh, và được liên kết hợp đồng bảo hiểm rủi ro 100% trong 72 giờ ký quỹ Escrow.',
        time: '20:18',
        isCurator: true,
      },
    ],
    quickQuestions: [
      'Quy trình cấp mã băm SHA-256 mất bao lâu?',
      'Cách kiểm tra tranh thật giả qua kính lúp số?',
      'Chính sách đền bù khi phát hiện tranh vi phạm?',
    ],
  },
  artists: {
    title: 'ĐỐI THOẠI HỌA SĨ & XƯỞNG VẼ',
    subtitle: 'Lắng nghe tác giả chia sẻ kỹ thuật chất cảm, câu chuyện sáng tác',
    icon: Palette,
    badgeColor: '#38BDF8',
    messages: [
      {
        id: 'art_1',
        sender: 'Lê Bá Hoài Nam',
        role: 'artist',
        badge: 'Master Artist L3',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: 'Chào các bạn yêu hội họa! Để tạo nên độ nhám và độ loang cho tranh khắc gỗ kết hợp màu nước, tôi phải phơi mộc bản dưới sương mai trong 3 tuần để thớ gỗ mở tự nhiên.',
        time: '18:50',
        isArtist: true,
      },
      {
        id: 'art_2',
        sender: 'Trần Thị Ánh Dương',
        role: 'artist',
        badge: 'Họa sĩ Cấp L3',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        content: 'Bức "Bình Minh Trên Biển Đông" của em được vẽ liên tục 40 ngày bằng dao palette với chất màu khoáng tự nhiên Winsor & Newton, không pha dầu lanh công nghiệp để giữ sắc lam nguyên bản.',
        time: '19:15',
        isArtist: true,
      },
      {
        id: 'art_3',
        sender: 'Nguyễn Phúc An',
        role: 'artist',
        badge: 'Họa sĩ Cấp L3',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        content: 'Với sơn mài "Sen Hồ Tây", em mài thủ công qua 9 lớp son và vỏ trứng nghiền. Khi treo dưới ánh sáng vàng 3000K của tính năng Room View 3D sẽ thấy ánh kim ẩn hiện rất rõ.',
        time: '19:35',
        isArtist: true,
      },
    ],
    quickQuestions: [
      'Chất lượng vải toan canvas hạt thô hay hạt mịn?',
      'Họa sĩ có nhận vẽ tranh theo đơn đặt hàng độc quyền không?',
      'Cách bảo quản tranh sơn dầu ở khí hậu ẩm Việt Nam?',
    ],
  },
  collectors: {
    title: 'DIỄN ĐÀN NHÀ SƯU TẦM KÍN',
    subtitle: 'Kinh nghiệm đặt giá, xu hướng đầu tư nghệ thuật & phiên đấu giá kín',
    icon: Gavel,
    badgeColor: '#A855F7',
    messages: [
      {
        id: 'col_1',
        sender: 'Nguyễn Minh Khôi',
        role: 'collector',
        badge: 'Collector L2',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        content: 'Phiên đấu giá kín (Sealed-Bid) giúp nhà sưu tầm không bị tâm lý fomo thổi giá như sàn truyền thống. Mình chỉ việc đặt mức trần cao nhất trong khả năng.',
        time: '17:20',
      },
      {
        id: 'col_2',
        sender: 'Đặng Quốc Hải',
        role: 'collector',
        badge: 'Thành viên mới L1',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        content: 'Các bác cho em hỏi người mới bắt đầu sưu tầm với ngân sách khoảng 20-30 triệu thì nên ưu tiên phong cách Hiện thực hay Trừu tượng để thanh khoản tốt hơn?',
        time: '18:05',
      },
      {
        id: 'col_3',
        sender: 'Phan Hoàng Yến Trang (Victoria)',
        role: 'collector',
        badge: 'VIP Patron L3',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        content: 'Chào bạn Hải! Bạn nên bắt đầu từ sự rung cảm cá nhân trước. Hãy tìm các họa sĩ có chứng thực xưởng vẽ cấp L3 trên sàn, vì hồ sơ và lai lịch của họ đã được bảo đảm.',
        time: '18:18',
      },
    ],
    quickQuestions: [
      'Quy chế ký quỹ cọc 10% khi tham gia phiên Live?',
      'Làm thế nào để ủy quyền đấu giá tự động (Proxy Bid)?',
      'Chi phí đóng thùng gỗ bảo tàng vận chuyển quốc tế?',
    ],
  },
};

const CHANNELS = [
  { id: 'curator', name: 'Giám Tuyển & Thẩm Định', icon: Landmark, count: '3 trao đổi' },
  { id: 'artists', name: 'Đối Thoại Họa Sĩ', icon: Palette, count: 'Xưởng vẽ trực tiếp' },
  { id: 'collectors', name: 'Diễn Đàn Sưu Tầm', icon: Gavel, count: 'Đấu giá kín' },
];

/**
 * CommunityChatDrawer - Diễn Đàn Đàm Đạo & Tư Vấn Giám Tuyển Nghệ Thuật
 */
const CommunityChatDrawer = ({ currentUser, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('curator');
  const [channelMessages, setChannelMessages] = useState(() => {
    return {
      curator: [...CHANNEL_DATA.curator.messages],
      artists: [...CHANNEL_DATA.artists.messages],
      collectors: [...CHANNEL_DATA.collectors.messages],
    };
  });
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(2);
  const messagesEndRef = useRef(null);

  const activeChannelInfo = CHANNEL_DATA[activeChannel];
  const currentMessages = channelMessages[activeChannel] || [];

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeChannel, channelMessages]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!currentUser) {
      onLoginClick?.();
      return;
    }

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: currentUser.full_name,
      role: currentUser.role,
      badge: currentUser.badge_label || (currentUser.role === 'artist' ? 'Họa sĩ' : 'Nhà sưu tầm'),
      avatar: currentUser.avatar,
      content: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      isArtist: currentUser.role === 'artist',
    };

    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: [...prev[activeChannel], newMsg],
    }));
    setInputText('');

    // Phản hồi thông minh chuyên môn phù hợp theo từng kênh
    setTimeout(() => {
      let replyContent = '';
      let replySender = 'Hội Đồng Curator';
      let replyRole = 'curator';
      let replyAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
      let replyBadge = 'Giám tuyển';

      if (activeChannel === 'curator') {
        replySender = 'GS. TS. Trần Viết Cường';
        replyBadge = 'Chủ tịch Thẩm định';
        replyContent = `Cảm ơn câu hỏi của ${currentUser.full_name}! Ban Giám tuyển thẩm định theo quy chuẩn ICOM và cấp chứng thư số SHA-256 bảo đảm quyền sở hữu bất biến.`;
      } else if (activeChannel === 'artists') {
        replySender = 'Trần Thị Ánh Dương';
        replyRole = 'artist';
        replyBadge = 'Họa sĩ Cấp L3';
        replyAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80';
        replyContent = `Chào ${currentUser.full_name}! Cảm ơn bạn đã quan tâm đến kỹ thuật vẽ. Mình luôn sẵn sàng chia sẻ thêm về quy trình bảo quản chất màu tự nhiên nhé.`;
      } else {
        replySender = 'Phan Hoàng Yến Trang (Victoria)';
        replyBadge = 'VIP Patron L3';
        replyAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80';
        replyContent = `Chào bạn! Tham gia đấu giá kín ở Artisan Hub rất yên tâm vì cơ chế Escrow giữ tiền 72 giờ chỉ chuyển giao khi bạn nghiệm thu tranh tận tay.`;
      }

      const botReply = {
        id: `reply_${Date.now()}`,
        sender: replySender,
        role: replyRole,
        badge: replyBadge,
        avatar: replyAvatar,
        content: replyContent,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isCurator: replyRole === 'curator',
        isArtist: replyRole === 'artist',
      };

      setChannelMessages(prev => ({
        ...prev,
        [activeChannel]: [...prev[activeChannel], botReply],
      }));
    }, 1200);
  };

  return (
    <>
      {/* Nút Kích Hoạt Diễn Đàn Nghệ Thuật Nổi (Art Forum Trigger) */}
      <button
        type="button"
        id="community-chat-toggle-btn"
        className={`${styles.forumTriggerBtn} ${isOpen ? styles.forumTriggerHidden : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Mở Diễn Đàn & Tư Vấn Nghệ Thuật"
        title="Diễn Đàn & Tư Vấn Giám Tuyển Nghệ Thuật"
      >
        <div className={styles.triggerIconBox}>
          <Sparkles size={16} className={styles.sparkleIcon} />
        </div>
        <div className={styles.triggerTextGroup}>
          <span className={styles.triggerMainTitle}>TƯ VẤN & ĐÀM ĐẠO</span>
          <span className={styles.triggerSubTitle}>Họa sĩ · Nhà sưu tầm · Curator</span>
        </div>
        {unreadCount > 0 && <span className={styles.unreadCountPill}>{unreadCount}</span>}
      </button>

      {/* Cửa Sổ Diễn Đàn & Tư Vấn (Curator Forum Drawer) */}
      {isOpen && (
        <div className={styles.forumDrawer} role="dialog" aria-label="Diễn Đàn Tư Vấn Nghệ Thuật">
          {/* Header Phòng Đàm Đạo */}
          <div className={styles.drawerHeader}>
            <div className={styles.headerTitleWrap}>
              <div className={styles.headerCrest}>
                <Landmark size={18} color="#D4AF37" />
              </div>
              <div>
                <h3 className={styles.headerMainName}>DIỄN ĐÀN NGHỆ THUẬT & TƯ VẤN</h3>
                <p className={styles.headerTagline}>KHÔNG GIAN HỘI TỤ GIỚI TINH HOA HỘI HỌA ĐỘC BẢN</p>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeDrawerBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Đóng diễn đàn"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3 Tab Kênh Chuyên Biệt - Phân chia rõ ràng */}
          <div className={styles.channelTabs}>
            {CHANNELS.map(ch => {
              const IconComp = ch.icon;
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`${styles.tabBtn} ${isActive ? styles.tabActive : ''}`}
                  onClick={() => setActiveChannel(ch.id)}
                >
                  <IconComp size={14} className={styles.tabIcon} />
                  <span className={styles.tabName}>{ch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Banner Thông Tin Kênh Hiện Tại */}
          <div className={styles.channelInfoBanner}>
            <div className={styles.channelInfoIcon}>
              <activeChannelInfo.icon size={15} color="var(--gold-primary)" />
            </div>
            <div className={styles.channelInfoText}>
              <div className={styles.channelBannerTitle}>{activeChannelInfo.title}</div>
              <div className={styles.channelBannerDesc}>{activeChannelInfo.subtitle}</div>
            </div>
          </div>

          {/* Khu Vực Tin Nhắn */}
          <div className={styles.messagesScrollArea}>
            {currentMessages.map(msg => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${msg.isSelf ? styles.selfRow : ''}`}
              >
                <img src={msg.avatar} alt={msg.sender} className={styles.userAvatar} />
                <div className={styles.bubbleContainer}>
                  <div className={styles.metaRow}>
                    <span className={styles.senderName}>{msg.sender}</span>
                    <span className={`${styles.roleBadge} ${msg.isCurator ? styles.curatorBadge : ''} ${msg.isArtist ? styles.artistBadge : ''}`}>
                      {msg.badge}
                    </span>
                    <span className={styles.timeStamp}>{msg.time}</span>
                  </div>
                  <div className={styles.bubbleBox}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Gợi Ý Câu Hỏi Thẩm Định Nhanh Theo Chuyên Mục */}
          <div className={styles.quickPromptSection}>
            <div className={styles.quickPromptHeader}>
              <HelpCircle size={12} color="var(--gold-primary)" />
              <span>Gợi ý chủ đề chuyên sâu:</span>
            </div>
            <div className={styles.quickPromptList}>
              {activeChannelInfo.quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.promptChip}
                  onClick={() => handleSend(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Ô Nhập Tin Nhắn */}
          <div className={styles.inputDock}>
            {currentUser ? (
              <form
                className={styles.inputForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  id="curator-chat-input"
                  type="text"
                  placeholder={`Gửi câu hỏi tới ${activeChannelInfo.title}...`}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className={styles.textInput}
                />
                <button
                  type="submit"
                  className={styles.sendActionBtn}
                  disabled={!inputText.trim()}
                  aria-label="Gửi câu hỏi"
                >
                  <Send size={15} />
                </button>
              </form>
            ) : (
              <div className={styles.authGate}>
                <span>Đăng nhập để đàm đạo cùng hội đồng và họa sĩ</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onLoginClick}
                  style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityChatDrawer;
