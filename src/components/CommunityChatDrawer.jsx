import React, { useState, useRef, useEffect } from 'react';
import {
  Landmark, Sparkles, ShieldCheck, X, Send, Smile,
} from 'lucide-react';
import styles from './CommunityChatDrawer.module.css';
import { CHANNEL_DATA, CHANNELS } from './channelData';

const REACTION_EMOJIS = ['❤️', '💡', '🎨', '👏'];

const CommunityChatDrawer = ({ currentUser, onLoginClick }) => {
  const [isOpen, setIsOpen]           = useState(false);
  const [activeChannel, setActiveChannel] = useState('curator');
  const [isTyping, setIsTyping]       = useState(false);
  const [typingName, setTypingName]   = useState('');
  const [inputText, setInputText]     = useState('');
  const [unreadCount, setUnreadCount] = useState(3);
  const [guestMode, setGuestMode]     = useState(false);

  const [channelMessages, setChannelMessages] = useState(() => ({
    curator:    [...CHANNEL_DATA.curator.messages],
    artists:    [...CHANNEL_DATA.artists.messages],
    collectors: [...CHANNEL_DATA.collectors.messages],
  }));

  const messagesEndRef     = useRef(null);
  const activeChannelInfo  = CHANNEL_DATA[activeChannel];
  const currentMessages    = channelMessages[activeChannel] || [];

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, activeChannel, channelMessages, isTyping]);

  const handleToggleReaction = (msgId, emoji) => {
    setChannelMessages(prev => {
      const list = prev[activeChannel].map(msg => {
        if (msg.id !== msgId) return msg;
        const reactions    = { ...(msg.reactions || {}) };
        const reactedKey   = `reacted_${emoji}`;
        const hasReacted   = msg[reactedKey];
        if (hasReacted) {
          reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
          if (reactions[emoji] === 0) delete reactions[emoji];
          return { ...msg, reactions, [reactedKey]: false };
        }
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions, [reactedKey]: true };
      });
      return { ...prev, [activeChannel]: list };
    });
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    if (!currentUser && !guestMode) { onLoginClick?.(); return; }

    const senderName   = currentUser ? currentUser.full_name : 'Khách Tham Quan';
    const senderBadge  = currentUser
      ? (currentUser.badge_label || (currentUser.role === 'artist' ? 'Họa sĩ xác minh' : 'Nhà sưu tầm'))
      : 'Khách Tham Quan';
    const senderAvatar = currentUser?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: senderName,
      role:   currentUser?.role || 'guest',
      badge:  senderBadge,
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

    const expertMap = {
      curator:    { name: 'GS. TS. Trần Viết Cường',        role: 'curator',   badge: 'Chủ tịch Thẩm định',  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
      artists:    { name: 'Trần Thị Ánh Dương',              role: 'artist',    badge: 'Master Artist L3',     avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
      collectors: { name: 'Phan Hoàng Yến Trang (Victoria)', role: 'collector', badge: 'VIP Patron L3',        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
    };
    const expert = expertMap[activeChannel];

    const replyContentMap = {
      curator:    `Cảm ơn câu hỏi của ${senderName}! Hội đồng Thẩm định kiểm tra tác phẩm theo quy chuẩn ICOM bằng phân tích quang phổ và cấp chứng thư số SHA-256 bảo đảm tính độc bản.`,
      artists:    `Chào ${senderName}! Với kỹ thuật vẽ nhiều lớp chất màu khoáng, tác phẩm cần 7–10 ngày se bề mặt tự nhiên trước khi phủ lớp varnish bảo vệ vĩnh viễn.`,
      collectors: `Chào bạn! Toàn bộ tiền đặt cọc và tiền mua được ký quỹ Escrow 72 giờ trong tài khoản bảo chứng — chỉ giải ngân khi tranh về tay an toàn.`,
    };

    setTypingName(expert.name);
    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        id:      `reply_${Date.now()}`,
        sender:  expert.name,
        role:    expert.role,
        badge:   expert.badge,
        avatar:  expert.avatar,
        content: replyContentMap[activeChannel],
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isCurator:   expert.role === 'curator',
        isArtist:    expert.role === 'artist',
        isCollector: expert.role === 'collector',
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
      {/* Floating Trigger */}
      <button
        type="button"
        id="community-chat-toggle-btn"
        className={`${styles.salonTriggerPill} ${isOpen ? styles.triggerHidden : ''}`}
        onClick={() => { setIsOpen(true); setUnreadCount(0); }}
        aria-label="Mở Trung tâm Tư vấn & Thẩm định Nghệ thuật"
      >
        <div className={styles.avatarStack}>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Chuyên gia" className={styles.stackAvatar} />
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Họa sĩ"    className={styles.stackAvatar} />
          <span className={styles.onlinePulseDot} />
        </div>
        <div className={styles.triggerCopy}>
          <div className={styles.triggerHeadlineRow}>
            <span className={styles.triggerTitle}>TƯ VẤN & THẨM ĐỊNH</span>
            <span className={styles.liveTag}>LIVE</span>
          </div>
          <span className={styles.triggerSubtitle}>Hội đồng Thẩm định · Họa sĩ</span>
        </div>
        {unreadCount > 0 && <span className={styles.unreadBadgePill}>{unreadCount}</span>}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className={styles.salonDrawer} role="dialog" aria-label="Trung tâm Tư vấn & Thẩm định Nghệ thuật">

          {/* Header */}
          <div className={styles.salonHeader}>
            <div className={styles.headerBrand}>
              <div className={styles.crestWrap}>
                <Landmark size={20} className={styles.crestIcon} />
                <span className={styles.crestGlow} />
              </div>
              <div className={styles.headerInfo}>
                <div className={styles.brandTitleRow}>
                  <h3 className={styles.brandName}>TƯ VẤN & THẨM ĐỊNH</h3>
                  {/* <span className={styles.luxuryPill}>CHUYÊN MÔN</span> */}
                </div>
                <div className={styles.statusIndicatorRow}>
                  <span className={styles.onlineDot} />
                  <span className={styles.statusText}>Hội đồng Thẩm định & Họa sĩ đang trực tuyến</span>
                </div>
              </div>
            </div>
            <button type="button" className={styles.closeDrawerBtn} onClick={() => setIsOpen(false)} aria-label="Đóng">
              <X size={18} />
            </button>
          </div>

          {/* 3 KHUNG CHAT*/}
          {/* <div className={styles.channelTabBar} role="tablist">
            {CHANNELS.map(ch => {
              const Icon     = ch.icon;
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id} type="button" role="tab"
                  aria-selected={isActive}
                  className={`${styles.channelTabItem} ${isActive ? styles.tabActive : ''}`}
                  onClick={() => setActiveChannel(ch.id)}
                >
                  <div className={styles.tabIconCircle}><Icon size={15} /></div>
                  <div className={styles.tabLabelGroup}>
                    <span className={styles.tabMainName}>{ch.name}</span>
                    <span className={styles.tabBadgeDesc}>{ch.badge}</span>
                  </div>
                </button>
              );
            })}
          </div> */}

          {/* Message Stream */}
          <div className={styles.chatScrollArea}>
            {currentMessages.map(msg => (
              <div key={msg.id} className={`${styles.messageCluster} ${msg.isSelf ? styles.selfCluster : ''}`}>
                <div className={styles.avatarWrapper}>
                  <img src={msg.avatar} alt={msg.sender} className={styles.msgAvatar} />
                  {msg.isCurator && <ShieldCheck size={12} className={styles.verifiedCheck} />}
                </div>

                <div className={styles.messageContentBlock}>
                  <div className={styles.senderMetaRow}>
                    <span className={styles.senderFullName}>{msg.sender}</span>
                    <span className={`${styles.roleTag} ${
                      msg.isCurator   ? styles.curatorTag   :
                      msg.isArtist    ? styles.artistTag    :
                      msg.isCollector ? styles.collectorTag : styles.guestTag
                    }`}>{msg.badge}</span>
                    <span className={styles.timeTag}>{msg.time}</span>
                  </div>

                  <div className={styles.luxuryBubble}>
                    <p className={styles.bubbleText}>{msg.content}</p>
                  </div>

                  {/* Reactions */}
                  <div className={styles.reactionsBar}>
                    {msg.reactions && Object.entries(msg.reactions).map(([emoji, count]) => (
                      <button
                        key={emoji} type="button"
                        className={`${styles.reactionChip} ${msg[`reacted_${emoji}`] ? styles.reactionActive : ''}`}
                        onClick={() => handleToggleReaction(msg.id, emoji)}
                        title={`Thả cảm xúc ${emoji}`}
                      >
                        <span>{emoji}</span>
                        <span className={styles.reactionCount}>{count}</span>
                      </button>
                    ))}
                    <div className={styles.reactionPickerWrap}>
                      <button type="button" className={styles.addReactionTrigger} title="Bày tỏ cảm xúc">
                        <Smile size={12} />
                      </button>
                      <div className={styles.reactionFlyout}>
                        {REACTION_EMOJIS.map(emoji => (
                          <button key={emoji} type="button" className={styles.miniReactionBtn}
                            onClick={() => handleToggleReaction(msg.id, emoji)}>{emoji}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className={styles.typingCluster}>
                <img src={activeChannelInfo.leaderAvatar} alt={typingName} className={styles.typingAvatar} />
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

          {/* Quick Questions */}
          <div className={styles.inspirationSection}>
            <div className={styles.inspirationHeader}>
              <Sparkles size={13} color="var(--gold-primary, #C5A059)" />
              <span>Gợi ý câu hỏi tham vấn:</span>
            </div>
            <div className={styles.inspirationChipList}>
              {activeChannelInfo.quickQuestions.map((q, idx) => (
                <button key={idx} type="button" className={styles.quickPromptChip} onClick={() => handleSend(q)}>
                  <span className={styles.promptSpark}>✦</span>
                  <span className={styles.promptLabel}>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Dock */}
          <div className={styles.dockContainer}>
            {currentUser || guestMode ? (
              <form className={styles.chatForm} onSubmit={e => { e.preventDefault(); handleSend(); }}>
                <div className={styles.inputShell}>
                  <input
                    id="curator-chat-input"
                    type="text"
                    placeholder={`Gửi câu hỏi tới ${activeChannelInfo.activeLeader}...`}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className={styles.mainInput}
                  />
                  <button type="submit" className={styles.sendGoldBtn} disabled={!inputText.trim()} aria-label="Gửi">
                    <Send size={15} />
                  </button>
                </div>
                {!currentUser && guestMode && (
                  <div className={styles.guestStatusRow}>
                    <span>✦ Bạn đang trao đổi với tư cách Khách tham quan.</span>
                    <button type="button" className={styles.switchLoginLink} onClick={onLoginClick}>
                      Đăng nhập tài khoản
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className={styles.welcomeAuthLounge}>
                <div className={styles.authTextSide}>
                  <span className={styles.authTitle}>Trung tâm Tư vấn & Thẩm định</span>
                  <span className={styles.authSubtitle}>Kết nối trực tiếp cùng Hội đồng Thẩm định & Giới Họa sĩ</span>
                </div>
                <div className={styles.authActionGroup}>
                  <button type="button" className={styles.guestTryBtn}
                    onClick={() => { setGuestMode(true); }}
                    title="Gửi câu hỏi ngay mà không cần đăng nhập"
                  >
                    Tư vấn nhanh
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={onLoginClick}
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
