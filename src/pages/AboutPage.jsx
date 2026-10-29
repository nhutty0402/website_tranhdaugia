import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, Award, HeartHandshake, Eye, Sparkles,
  Building, CheckCircle2, ChevronRight, FileCode, Users, Landmark,
  BookOpen, ArrowRight
} from 'lucide-react';
import styles from './AboutPage.module.css';

const TRUST_PILLARS = [
  {
    step: '01',
    title: 'Định Danh Họa Sĩ Ba Cấp (KYC L1 - L3)',
    desc: 'Họa sĩ vượt qua xác thực CCCD/Hộ chiếu sinh trắc học, thẩm định trực tiếp xưởng vẽ (Studio Verification) và xác minh tác quyền thông qua hội đồng curator nghệ thuật.',
    tag: 'Định danh thực tế',
  },
  {
    step: '02',
    title: 'Hợp Đồng Ký Quỹ Escrow 72 Giờ',
    desc: 'Bảo vệ dòng vốn 100%. Tiền thanh toán của nhà sưu tầm được khóa tại tài khoản trung gian ký quỹ được ngân hàng giám sát, chỉ chuyển trả cho tác giả sau 72h kiểm định tận tay.',
    tag: 'Tài chính bảo chứng',
  },
  {
    step: '03',
    title: 'Chứng Thư Số Bất Biến SHA-256',
    desc: 'Mỗi bức tranh được gắn mã băm mật mã học vĩnh viễn (Cryptographic Provenance). Lưu vết lịch sử triển lãm, quyền sở hữu và chữ ký số tác giả chống làm giả tuyệt đối.',
    tag: 'Công nghệ số',
  },
  {
    step: '04',
    title: 'Hội Đồng Giám Tuyển Độc Lập',
    desc: 'Ban cố vấn gồm các giáo sư, họa sĩ thành danh và chuyên gia mỹ thuật đánh giá tính độc bản, chất lượng chất liệu sơn mài/sơn dầu/lụa trước khi phê duyệt phiên đấu giá.',
    tag: 'Hàn lâm mỹ thuật',
  },
];

const CURATORS = [
  {
    name: 'GS. TS. Trần Viết Cường',
    role: 'Chủ tịch Hội đồng Thẩm định & Giám tuyển',
    desc: 'Hơn 30 năm nghiên cứu lịch sử mỹ thuật Đông Dương, nguyên cố vấn triển lãm quốc tế tại Paris và Singapore.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'ThS. Hoàng Diệu Linh',
    role: 'Trưởng ban Bảo tồn Di sản & Chữ ký số',
    desc: 'Chuyên gia bảo quản tranh sơn mài cổ truyền và ứng dụng công nghệ giám định quang phổ hồng ngoại.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Curator Marcus Vũ',
    role: 'Giám đốc Vận hành Đấu giá Nghệ thuật',
    desc: 'Chuyên gia điều phối hơn 50 phiên đấu giá tranh độc bản tại thị trường Đông Nam Á và Châu Âu.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
];

const TIMELINE = [
  { year: '2023', event: 'Khởi xướng đề tài Nền tảng Triển lãm số & Cơ chế Đấu giá Minh bạch bảo vệ Họa sĩ Việt Nam.' },
  { year: '2024', event: 'Hoàn thiện Thiết kế Hệ thống Design System Dark Luxury, tích hợp mô phỏng Room View 3D và Escrow 72H.' },
  { year: '2025', event: 'Liên kết hơn 120 họa sĩ đương đại và phát hành chuẩn chứng chỉ số SHA-256 Provenance Passport.' },
  { year: '2026', event: 'Nâng cấp trải nghiệm đấu giá kín Sealed-Bid và kết nối các phòng tranh độc quyền trên toàn quốc.' },
];

const AboutPage = () => {
  return (
    <main className={styles.aboutRoot}>
      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>DI SẢN & BẢO CHỨNG NGHỆ THUẬT</span>
            <h1 className={styles.heroTitle}>
              Tái Định Nghĩa Chuẩn Mực <br />
              <span className={styles.goldGleam}>Sưu Tầm Hội Họa Độc Bản</span>
            </h1>
            <p className={styles.heroLead}>
              Artisan Hub ra đời với sứ mệnh xóa bỏ ba nỗi bất an lớn nhất của người yêu nghệ thuật: 
              <strong> nghi ngờ tính nguyên bản</strong>, <strong>khoảng cách trải nghiệm thị giác</strong> và <strong>rủi ro giao dịch tài chính</strong>.
            </p>
          </div>
        </div>
        <div className={styles.heroOverlayGlow} />
      </section>

      {/* Tôn chỉ & Sứ mệnh 3 giá trị cốt lõi */}
      <section className={styles.missionSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.subHeading}>TRIẾT LÝ VẬN HÀNH</span>
            <h2>Tam Giác Vàng Tín Nhiệm Của Artisan Hub</h2>
            <p className={styles.sectionLead}>
              Chúng tôi không chỉ là sàn thương mại; chúng tôi xây dựng một thánh đường số tôn vinh giá trị lao động của người nghệ sĩ.
            </p>
          </div>

          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <Award size={28} color="#D4AF37" />
              </div>
              <h3>1. Tôn Vinh Bản Quyền Tác Giả</h3>
              <p>
                Bảo vệ 100% bản quyền tranh và quyền nhân thân của tác giả. Mỗi tác phẩm đều trải qua đối chiếu vân màu, chụp ảnh kiểm định kèm mã đối ngẫu nhiên trước khi lên sàn.
              </p>
            </div>

            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <Eye size={28} color="#D4AF37" />
              </div>
              <h3>2. Thị Giác Chân Thực Tuyệt Đối</h3>
              <p>
                Trải nghiệm Room View 3D chuẩn tỉ lệ 1:1, điều chỉnh nhiệt độ màu 3000K–5000K, hiển thị chất cảm bề mặt sơn dầu và độ bóng sơn mài như đang đứng trước tác phẩm thực tế.
              </p>
            </div>

            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <ShieldCheck size={28} color="#D4AF37" />
              </div>
              <h3>3. Giao Dịch Liêm Chính & Minh Bạch</h3>
              <p>
                Hợp đồng Escrow thông minh khóa tiền cọc an toàn, quy chế đấu giá kín triệt tiêu hành vi gian lận thổi giá, mang lại sự công bằng tuyệt đối cho mọi nhà sưu tầm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Trụ cột Bảo chứng */}
      <section className={styles.pillarsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.subHeading}>CƠ CHẾ KỸ THUẬT</span>
            <h2>Quy Chuẩn Bảo Hộ 4 Cấp Độ</h2>
            <p className={styles.sectionLead}>
              Quy trình khép kín đảm bảo tính pháp lý và bảo hiểm rủi ro tuyệt đối cho người tham gia.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {TRUST_PILLARS.map((p, idx) => (
              <div key={idx} className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarStep}>{p.step}</span>
                  <span className={styles.pillarTag}>{p.tag}</span>
                </div>
                <h4 className={styles.pillarTitle}>{p.title}</h4>
                <p className={styles.pillarDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hội đồng Giám Tuyển */}
      <section className={styles.curatorSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.subHeading}>BAN CỐ VẤN HÀN LÂM</span>
            <h2>Hội Đồng Thẩm Định & Giám Tuyển</h2>
            <p className={styles.sectionLead}>
              Những tên tuổi uy tín hàng đầu trong giới nghiên cứu mỹ thuật và bảo tồn di sản nghệ thuật Việt Nam.
            </p>
          </div>

          <div className={styles.curatorsGrid}>
            {CURATORS.map((c, i) => (
              <div key={i} className={styles.curatorCard}>
                <div className={styles.curatorImgWrapper}>
                  <img src={c.avatar} alt={c.name} className={styles.curatorImg} />
                  <div className={styles.curatorBadgeOverlay}>
                    <Landmark size={14} /> Giám tuyển chính thức
                  </div>
                </div>
                <div className={styles.curatorBody}>
                  <h4 className={styles.curatorName}>{c.name}</h4>
                  <div className={styles.curatorRole}>{c.role}</div>
                  <p className={styles.curatorDesc}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Phát Triển */}
      <section className={styles.timelineSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.subHeading}>LỊCH SỬ HÌNH THÀNH</span>
            <h2>Hành Trình Khẳng Định Giá Trị</h2>
          </div>

          <div className={styles.timelineList}>
            {TIMELINE.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineNode}>
                  <div className={styles.timelineDot} />
                </div>
                <div className={styles.timelineContent}>
                  <p>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <Sparkles size={36} color="#D4AF37" style={{ marginBottom: 16 }} />
            <h2>Bạn Là Họa Sĩ Đang Tìm Kiếm Không Gian Xứng Tầm?</h2>
            <p>
              Hãy tham gia cùng mạng lưới hơn 120 họa sĩ được giám định của Artisan Hub. Trưng bày tác phẩm, tổ chức đấu giá trực tiếp và kết nối với các nhà sưu tầm tinh hoa trên toàn cầu.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/gallery" className="btn btn-primary">
                Khám phá  <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
