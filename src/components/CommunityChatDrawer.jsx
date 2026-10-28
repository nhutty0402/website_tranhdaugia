import React, { useState, useRef, useEffect } from 'react';
import {
  Landmark, Palette, Gavel, Sparkles, ShieldCheck,
  X, Send, ChevronDown, ChevronUp, Flame, Award, Smile
} from 'lucide-react';
import styles from './CommunityChatDrawer.module.css';

// Dữ liệu 3 chuyên đề tư vấn & thẩm định nghệ thuật
const CHANNEL_DATA = {
  curator: {
    id: 'curator',
    title: 'Hội Đồng Thẩm Định & Kiểm Định',
    shortName: 'Thẩm Định',
    badgeText: 'Appraisal Board',
    themeColor: '#C5A059',
    icon: Landmark,
    activeLeader: 'GS. TS. Trần Viết Cường',
    leaderRole: 'Chủ tịch Hội đồng Thẩm định Quốc tế',
    leaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    description: 'Kênh tham vấn chính thức về hồ sơ lai lịch, kiểm định chứng thư số SHA-256 bảo hộ quyền tác giả và cơ chế bảo chứng ký quỹ Escrow 72h theo quy chuẩn ICOM.',
    highlights: [
      { icon: ShieldCheck, text: 'Ký quỹ Escrow 72h' },
      { icon: Award, text: 'Chứng thư SHA-256' },
      { icon: Landmark, text: 'Quy chuẩn ICOM' },
    ],
    messages: [
      {
        id: 'cur_1',
        sender: 'GS. TS. Trần Viết Cường',
        role: 'curator',
        badge: 'Chủ tịch Thẩm định',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: 'Kính chào quý vị! Mọi tác phẩm mở phiên trên sàn Artisan Hub đều được Hội đồng Thẩm định kiểm tra thực tế 3 bước nghiêm ngặt: quang phổ chất màu, niên đại vải toan và chữ ký số xác thực vĩnh viễn.',
        time: '19:40',
        isCurator: true,
        reactions: { '❤️': 6, '💡': 11, '🎨': 4 },
      },
      {
        id: 'cur_2',
        sender: 'Phan Hoàng Yến Trang (Victoria)',
        role: 'collector',
        badge: 'VIP Patron L3',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        content: 'Thưa Giáo sư Cường, chứng thư SHA-256 được lưu trữ trên sổ cái sau khi tôi thắng đấu giá thì có tích hợp kèm biên bản bàn giao và bảo hiểm vận chuyển của bảo tàng không?',
        time: '20:12',
        isCollector: true,
        reactions: { '💡': 5 },
      },
      {
        id: 'cur_3',
        sender: 'GS. TS. Trần Viết Cường',
        role: 'curator',
        badge: 'Chủ tịch Thẩm định',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: 'Chào chị Yến Trang! Chứng thư đi kèm mã QR vật lý gắn niêm phong nhiệt trên khung tranh, và được liên kết trực tiếp hợp đồng bảo hiểm rủi ro 100% trong suốt 72 giờ ký quỹ Escrow trước khi giải ngân.',
        time: '20:18',
        isCurator: true,
        reactions: { '❤️': 9, '👏': 7, '🎨': 3 },
      },
    ],
    quickQuestions: [
      'Quy trình cấp mã băm SHA-256 mất bao lâu?',
      'Cách kiểm tra tranh thật giả qua kính lúp số?',
      'Chính sách hoàn tiền 100% trong 72h ký quỹ Escrow?',
      'Quy chuẩn đóng thùng gỗ bảo tàng quốc tế?',
    ],
  },
  artists: {
    id: 'artists',
    title: 'Xưởng Vẽ & Đối Thoại Họa Sĩ',
    shortName: 'Họa Sĩ',
    badgeText: 'Artist Studio',
    themeColor: '#38BDF8',
    icon: Palette,
    activeLeader: 'Trần Thị Ánh Dương',
    leaderRole: 'Master Artist · Mỹ thuật Đương đại',
    leaderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    description: 'Lắng nghe tác giả chia sẻ trực tiếp về kỹ thuật chất cảm, câu chuyện sau mỗi nét vẽ và tư vấn đặt sáng tác tác phẩm độc bản riêng.',
    highlights: [
      { icon: Palette, text: 'Giao lưu tác giả' },
      { icon: Sparkles, text: 'Kỹ thuật chất màu' },
      { icon: Award, text: 'Đặt vẽ độc bản' },
    ],
    messages: [
      {
        id: 'art_1',
        sender: 'Lê Bá Hoài Nam',
        role: 'artist',
        badge: 'Master Artist L3',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: 'Chào các bạn yêu hội họa! Để tạo nên độ nhám và chiều sâu cho tranh khắc gỗ kết hợp màu nước, tôi phơi mộc bản dưới sương mai trong 3 tuần để từng thớ gỗ mở tự nhiên trước khi phủ màu.',
        time: '18:50',
        isArtist: true,
        reactions: { '🎨': 14, '❤️': 8 },
      },
      {
        id: 'art_2',
        sender: 'Trần Thị Ánh Dương',
        role: 'artist',
        badge: 'Họa sĩ Cấp L3',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        content: 'Bức "Bình Minh Trên Biển Đông" được tôi vẽ liên tục 40 ngày bằng dao palette với sắc màu khoáng tự nhiên Winsor & Newton, hoàn toàn không pha dầu lanh công nghiệp để giữ vẹn nguyên sắc lam.',
        time: '19:15',
        isArtist: true,
        reactions: { '❤️': 12, '🎨': 15, '💡': 6 },
      },
      {
        id: 'art_3',
        sender: 'Nguyễn Phúc An',
        role: 'artist',
        badge: 'Họa sĩ Cấp L3',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        content: 'Với sơn mài "Sen Hồ Tây", em mài thủ công qua 9 lớp son và vỏ trứng nghiền. Khi treo dưới ánh sáng vàng 3000K của tính năng Room View 3D sẽ thấy ánh kim dát vàng ẩn hiện rất sâu.',
        time: '19:35',
        isArtist: true,
        reactions: { '🎨': 18, '❤️': 9 },
      },
    ],
    quickQuestions: [
      'Chất lượng vải toan canvas hạt thô hay hạt mịn?',
      'Họa sĩ có nhận vẽ tranh theo đơn đặt hàng độc quyền?',
      'Cách bảo quản tranh sơn dầu ở khí hậu ẩm Việt Nam?',
      'Thời gian hoàn thiện một bức sơn mài truyền thống?',
    ],
  },
  collectors: {
    id: 'collectors',
    title: 'Salon Nhà Sưu Tầm VIP',
    shortName: 'Sưu Tầm',
    badgeText: 'VIP Lounge',
    themeColor: '#C084FC',
    icon: Gavel,
    activeLeader: 'Phan Hoàng Yến Trang (Victoria)',
    leaderRole: 'VIP Patron & Quỹ Di sản Nghệ thuật',
    leaderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    description: 'Diễn đàn kín chia sẻ kinh nghiệm đấu giá, nghệ thuật quản trị bộ sưu tập tư nhân và xu hướng thanh khoản của thị trường mỹ thuật độc bản.',
    highlights: [
      { icon: Gavel, text: 'Chiến lược Sealed-Bid' },
      { icon: ShieldCheck, text: 'Bảo mật danh tính' },
      { icon: Flame, text: 'Xu hướng thanh khoản' },
    ],
    messages: [
      {
        id: 'col_1',
        sender: 'Nguyễn Minh Khôi',
        role: 'collector',
        badge: 'Collector L2',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        content: 'Cơ chế đấu giá kín (Sealed-Bid) giúp nhà sưu tầm giữ được cái đầu lạnh, tránh bị tâm lý fomo thổi giá. Mình chỉ cần nghiên cứu kỹ hồ sơ tác giả và đặt mức giá hợp lý nhất.',
        time: '17:20',
        isCollector: true,
        reactions: { '💡': 10, '👏': 5 },
      },
      {
        id: 'col_2',
        sender: 'Đặng Quốc Hải',
        role: 'collector',
        badge: 'Thành viên mới L1',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        content: 'Các bác cho em hỏi người mới sưu tầm ngân sách 20–30 triệu thì nên ưu tiên phong cách Hiện thực hay Trừu tượng để giá trị lưu giữ tốt hơn?',
        time: '18:05',
        isCollector: true,
        reactions: { '💡': 4 },
      },
      {
        id: 'col_3',
        sender: 'Phan Hoàng Yến Trang (Victoria)',
        role: 'collector',
        badge: 'VIP Patron L3',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        content: 'Chào bạn Hải! Bạn hãy bắt đầu từ rung cảm chân thực của chính mình. Hãy chọn tác giả có xưởng vẽ xác thực cấp L3 trên sàn, vì hồ sơ lý lịch và bảo chứng của họ đã được kiểm toán minh bạch.',
        time: '18:18',
        isCollector: true,
        reactions: { '❤️': 11, '💡': 16, '👏': 8 },
      },
    ],
    quickQuestions: [
      'Quy chế ký quỹ cọc 10% khi tham gia phiên Live?',
      'Làm thế nào để ủy quyền đấu giá tự động (Proxy Bid)?',
      'Định giá tranh cho tác giả mới nổi ra sao?',
      'Cách lưu trữ tranh đúng nhiệt độ bảo tàng?',
    ],
  },
};

const CHANNELS = [
  { id: 'curator', name: 'Thẩm Định', badge: 'Kiểm định ICOM', icon: Landmark },
  { id: 'artists', name: 'Họa Sĩ', badge: 'Xưởng vẽ trực tiếp', icon: Palette },
  { id: 'collectors', name: 'Sưu Tầm', badge: 'Đấu giá & Đầu tư', icon: Gavel },
];

const REACTION_EMOJIS = ['❤️', '💡', '🎨', '👏'];

/**
 * CommunityChatDrawer - Trung Tâm Tư Vấn & Thẩm Định Nghệ Thuật
 * Thiết kế giao diện tư vấn chuyên môn cao cấp, thẩm mỹ bảo tàng đạt chuẩn WCAG AA
 */
const CommunityChatDrawer = ({ currentUser, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('curator');
  const [showBriefing, setShowBriefing] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState('');
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);
  const [guestName, setGuestName] = useState('');
  const [guestMode, setGuestMode] = useState(false);

  const [channelMessages, setChannelMessages] = useState(() => {
    return {
      curator: [...CHANNEL_DATA.curator.messages],
      artists: [...CHANNEL_DATA.artists.messages],
      collectors: [...CHANNEL_DATA.collectors.messages],
    };
  });

  const messagesEndRef = useRef(null);
  const activeChannelInfo = CHANNEL_DATA[activeChannel];
  const currentMessages = channelMessages[activeChannel] || [];

  // Tự động cuộn mượt mà khi mở hoặc có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeChannel, channelMessages, isTyping]);

  // Thả reaction tương tác trực tiếp
  const handleToggleReaction = (msgId, emoji) => {
    setChannelMessages(prev => {
      const list = prev[activeChannel].map(msg => {
        if (msg.id !== msgId) return msg;
        const currentReactions = { ...(msg.reactions || {}) };
        const userReactedKey = `reacted_${emoji}`;
        const hasReacted = msg[userReactedKey];

        if (hasReacted) {
          currentReactions[emoji] = Math.max(0, (currentReactions[emoji] || 1) - 1);
          if (currentReactions[emoji] === 0) delete currentReactions[emoji];
          return {
            ...msg,
            reactions: currentReactions,
            [userReactedKey]: false,
          };
        } else {
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          return {
            ...msg,
            reactions: currentReactions,
            [userReactedKey]: true,
          };
        }
      });
      return { ...prev, [activeChannel]: list };
    });
  };

  // Gửi tin nhắn và kích hoạt phản hồi sống động với Typing Indicator
  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Nếu chưa đăng nhập và chưa bật chế độ khách quý
    if (!currentUser && !guestMode) {
      // Cho phép đăng nhập nhanh hoặc mở modal
      onLoginClick?.();
      return;
    }

    const senderName = currentUser
      ? currentUser.full_name
      : (guestName.trim() || 'Khách Tham Quan');

    const senderBadge = currentUser
      ? (currentUser.badge_label || (currentUser.role === 'artist' ? 'Họa sĩ xác minh' : 'Nhà sưu tầm'))
      : 'Khách Tham Quan';

    const senderAvatar = currentUser?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: senderName,
      role: currentUser?.role || 'guest',
      badge: senderBadge,
      avatar: senderAvatar,
      content: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      reactions: {},
    };

    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: [...prev[activeChannel], newMsg],
    }));
    setInputText('');

    // Hiển thị trạng thái đang soạn trả lời (Typing Indicator)
    let expertName = 'GS. TS. Trần Viết Cường';
    if (activeChannel === 'artists') expertName = 'Trần Thị Ánh Dương';
    if (activeChannel === 'collectors') expertName = 'Phan Hoàng Yến Trang (Victoria)';

    setTypingName(expertName);
    setIsTyping(true);

    // Phản hồi thông minh chuyên môn sau hiệu ứng gõ
    setTimeout(() => {
      let replyContent = '';
      let replyRole = 'curator';
      let replyAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
      let replyBadge = 'Chủ tịch Thẩm định';

      if (activeChannel === 'curator') {
        replyContent = `Cảm ơn câu hỏi chuyên môn của ${senderName}! Hội đồng Thẩm định tiến hành kiểm tra tác phẩm theo quy chuẩn ICOM quốc tế bằng phân tích quang phổ và cấp chứng thư số SHA-256 bảo đảm tính độc bản tuyệt đối.`;
      } else if (activeChannel === 'artists') {
        replyRole = 'artist';
        replyBadge = 'Master Artist L3';
        replyAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80';
        replyContent = `Chào ${senderName}! Rất vui được chia sẻ cùng bạn. Với kỹ thuật vẽ nhiều lớp chất màu khoáng, tác phẩm cần 7–10 ngày để se bề mặt tự nhiên trước khi phủ lớp varnish bảo vệ tranh vĩnh viễn.`;
      } else {
        replyRole = 'collector';
        replyBadge = 'VIP Patron L3';
        replyAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80';
        replyContent = `Chào bạn! Khi tham gia đấu giá ở Artisan Hub, toàn bộ tiền đặt cọc và tiền mua được ký quỹ Escrow 72 giờ trong tài khoản bảo chứng. Bạn chỉ giải ngân khi tranh đã về tay an toàn.`;
      }

      const botReply = {
        id: `reply_${Date.now()}`,
        sender: expertName,
        role: replyRole,
        badge: replyBadge,
        avatar: replyAvatar,
        content: replyContent,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isCurator: replyRole === 'curator',
        isArtist: replyRole === 'artist',
        isCollector: replyRole === 'collector',
        reactions: { '❤️': 1, '💡': 1 },
      };

      setIsTyping(false);
      setChannelMessages(prev => ({
        ...prev,
        [activeChannel]: [...prev[activeChannel], botReply],
      }));
    }, 1400);
  };

  return (
    <>
      {/* Nút Nổi Kích Hoạt Tư Vấn & Thẩm Định (Floating Capsule Trigger) */}
      <button
        type="button"
        id="community-chat-toggle-btn"
        className={`${styles.salonTriggerPill} ${isOpen ? styles.triggerHidden : ''}`}
        onClick={() => {
          setIsOpen(true);
          setUnreadCount(0);
        }}
        aria-label="Mở Trung tâm Tư vấn & Thẩm định Nghệ thuật"
        title="Trung tâm Tư vấn & Thẩm định Nghệ thuật"
      >
        <div className={styles.avatarStack}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="Chuyên gia Thẩm định"
            className={styles.stackAvatar}
          />
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
            alt="Họa sĩ"
            className={styles.stackAvatar}
          />
          <span className={styles.onlinePulseDot} />
        </div>

        <div className={styles.triggerCopy}>
          <div className={styles.triggerHeadlineRow}>
            <span className={styles.triggerTitle}>TƯ VẤN & THẨM ĐỊNH</span>
            <span className={styles.liveTag}>LIVE</span>
          </div>
          <span className={styles.triggerSubtitle}>Hội đồng Thẩm định · Họa sĩ</span>
        </div>

        {unreadCount > 0 && (
          <span className={styles.unreadBadgePill}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Cửa Sổ Trung Tâm Tư Vấn & Thẩm Định (Consultation Drawer) */}
      {isOpen && (
        <div
          className={styles.salonDrawer}
          role="dialog"
          aria-label="Trung tâm Tư vấn & Thẩm định Nghệ thuật"
        >
          {/* Header Phòng Tư Vấn */}
          <div className={styles.salonHeader}>
            <div className={styles.headerBrand}>
              <div className={styles.crestWrap}>
                <Landmark size={20} className={styles.crestIcon} />
                <span className={styles.crestGlow} />
              </div>
              <div className={styles.headerInfo}>
                <div className={styles.brandTitleRow}>
                  <h3 className={styles.brandName}>TƯ VẤN & THẨM ĐỊNH</h3>
                  <span className={styles.luxuryPill}>CHUYÊN MÔN</span>
                </div>
                <div className={styles.statusIndicatorRow}>
                  <span className={styles.onlineDot} />
                  <span className={styles.statusText}>Hội đồng Thẩm định & Họa sĩ đang trực tuyến</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeDrawerBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Đóng cửa sổ tư vấn"
              title="Đóng cửa sổ"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3 Kênh Chuyên Đề Phân Định Rõ Ràng (Thematic Channel Tabs) */}
          <div className={styles.channelTabBar} role="tablist">
            {CHANNELS.map(ch => {
              const IconComp = ch.icon;
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.channelTabItem} ${isActive ? styles.tabActive : ''}`}
                  onClick={() => setActiveChannel(ch.id)}
                >
                  <div className={styles.tabIconCircle}>
                    <IconComp size={15} />
                  </div>
                  <div className={styles.tabLabelGroup}>
                    <span className={styles.tabMainName}>{ch.name}</span>
                    <span className={styles.tabBadgeDesc}>{ch.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Thẻ Giới Thiệu Chuyên Đề Phòng (Contextual Room Briefing Card) */}
          <div className={styles.roomBriefingCard}>
            <div className={styles.briefingHeader}>
              <div className={styles.briefingTitleRow}>
                <activeChannelInfo.icon size={15} color="var(--gold-primary, #C5A059)" />
                <h4 className={styles.briefingTitle}>{activeChannelInfo.title}</h4>
              </div>
              <button
                type="button"
                className={styles.toggleBriefingBtn}
                onClick={() => setShowBriefing(!showBriefing)}
                aria-label="Thu gọn giới thiệu"
              >
                {showBriefing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {showBriefing && (
              <div className={styles.briefingBody}>
                <p className={styles.briefingText}>{activeChannelInfo.description}</p>
                <div className={styles.highlightPillsRow}>
                  {activeChannelInfo.highlights.map((h, i) => {
                    const HIcon = h.icon;
                    return (
                      <span key={i} className={styles.highlightChip}>
                        <HIcon size={12} color="var(--gold-light, #DFBA73)" />
                        {h.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Khu Vực Dòng Tin Nhắn (Message Stream) */}
          <div className={styles.chatScrollArea}>
            {currentMessages.map(msg => (
              <div
                key={msg.id}
                className={`${styles.messageCluster} ${msg.isSelf ? styles.selfCluster : ''}`}
              >
                <div className={styles.avatarWrapper}>
                  <img src={msg.avatar} alt={msg.sender} className={styles.msgAvatar} />
                  {msg.isCurator && <ShieldCheck size={12} className={styles.verifiedCheck} />}
                </div>

                <div className={styles.messageContentBlock}>
                  {/* Dòng Tiêu Đề Người Gửi & Danh Xưng */}
                  <div className={styles.senderMetaRow}>
                    <span className={styles.senderFullName}>{msg.sender}</span>
                    <span
                      className={`${styles.roleTag} ${
                        msg.isCurator
                          ? styles.curatorTag
                          : msg.isArtist
                          ? styles.artistTag
                          : msg.isCollector
                          ? styles.collectorTag
                          : styles.guestTag
                      }`}
                    >
                      {msg.badge}
                    </span>
                    <span className={styles.timeTag}>{msg.time}</span>
                  </div>

                  {/* Bong Bóng Tin Nhắn Sang Trọng */}
                  <div className={styles.luxuryBubble}>
                    <p className={styles.bubbleText}>{msg.content}</p>
                  </div>

                  {/* Thanh Thả Reaction Cảm Xúc Nghệ Thuật */}
                  <div className={styles.reactionsBar}>
                    {/* Các reaction đã có */}
                    {msg.reactions &&
                      Object.entries(msg.reactions).map(([emoji, count]) => {
                        const isReacted = msg[`reacted_${emoji}`];
                        return (
                          <button
                            key={emoji}
                            type="button"
                            className={`${styles.reactionChip} ${isReacted ? styles.reactionActive : ''}`}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            title={`Thả cảm xúc ${emoji}`}
                          >
                            <span>{emoji}</span>
                            <span className={styles.reactionCount}>{count}</span>
                          </button>
                        );
                      })}

                    {/* Nút thêm cảm xúc tinh tế */}
                    <div className={styles.reactionPickerWrap}>
                      <button
                        type="button"
                        className={styles.addReactionTrigger}
                        title="Bày tỏ cảm xúc nghệ thuật"
                      >
                        <Smile size={12} />
                      </button>
                      <div className={styles.reactionFlyout}>
                        {REACTION_EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            className={styles.miniReactionBtn}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            title={`Bày tỏ ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Hiệu Ứng Chuyên Gia Đang Soạn Trả Lời (Typing Indicator) */}
            {isTyping && (
              <div className={styles.typingCluster}>
                <img
                  src={activeChannelInfo.leaderAvatar}
                  alt={typingName}
                  className={styles.typingAvatar}
                />
                <div className={styles.typingBubble}>
                  <div className={styles.typingAuthorRow}>
                    <span className={styles.typingAuthor}>{typingName}</span>
                    <span className={styles.typingHint}>đang phản hồi</span>
                  </div>
                  <div className={styles.waveDots}>
                    <span className={styles.waveDot} />
                    <span className={styles.waveDot} />
                    <span className={styles.waveDot} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Gợi Ý Câu Hỏi Tham Vấn Chuyên Sâu */}
          <div className={styles.inspirationSection}>
            <div className={styles.inspirationHeader}>
              <Sparkles size={13} color="var(--gold-primary, #C5A059)" />
              <span>Gợi ý câu hỏi tham vấn chuyên sâu:</span>
            </div>
            <div className={styles.inspirationChipList}>
              {activeChannelInfo.quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.quickPromptChip}
                  onClick={() => handleSend(q)}
                >
                  <span className={styles.promptSpark}>✦</span>
                  <span className={styles.promptLabel}>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ô Nhập Liệu & Trải Nghiệm Khách Hàng (Interactive Dock) */}
          <div className={styles.dockContainer}>
            {currentUser || guestMode ? (
              <form
                className={styles.chatForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <div className={styles.inputShell}>
                  <input
                    id="curator-chat-input"
                    type="text"
                    placeholder={`Gửi câu hỏi tới ${activeChannelInfo.activeLeader}...`}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className={styles.mainInput}
                  />
                  <button
                    type="submit"
                    className={styles.sendGoldBtn}
                    disabled={!inputText.trim()}
                    aria-label="Gửi tin nhắn"
                    title="Gửi câu hỏi"
                  >
                    <Send size={15} />
                  </button>
                </div>
                {!currentUser && guestMode && (
                  <div className={styles.guestStatusRow}>
                    <span>✦ Bạn đang trao đổi với tư cách Khách tham quan.</span>
                    <button
                      type="button"
                      className={styles.switchLoginLink}
                      onClick={onLoginClick}
                    >
                      Đăng nhập tài khoản
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className={styles.welcomeAuthLounge}>
                <div className={styles.authTextSide}>
                  <span className={styles.authTitle}>Trung tâm Tư vấn & Thẩm định</span>
                  <span className={styles.authSubtitle}>
                    Kết nối trực tiếp cùng Hội đồng Thẩm định & Giới Họa sĩ
                  </span>
                </div>
                <div className={styles.authActionGroup}>
                  <button
                    type="button"
                    className={styles.guestTryBtn}
                    onClick={() => {
                      setGuestMode(true);
                      setGuestName('Khách Tham Quan');
                    }}
                    title="Gửi câu hỏi tham vấn ngay mà không cần đăng nhập"
                  >
                    Tư vấn nhanh
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={onLoginClick}
                    style={{ fontSize: '0.82rem', padding: '7px 16px', fontWeight: 700 }}
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityChatDrawer;
