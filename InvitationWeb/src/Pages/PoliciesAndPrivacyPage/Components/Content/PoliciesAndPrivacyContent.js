import React, { useState, useEffect, useRef } from 'react';

// ----- COMPONENT CHỨA TOÀN BỘ CSS -----
const Styles = () => (
  <style>{`
    /* ----- BIẾN CSS & STYLES CƠ BẢN ----- */
    :root {
      --font-primary: 'Be Vietnam Pro', 'SVN-Gilroy', sans-serif;
      --color-primary: #27548A;
      --color-secondary: #CDD7E5;
      --color-text-dark: #333;
      --color-text-light: #666;
      --color-background: #FFFFFF;
      --color-background-light: #F8F9FA;
      --color-border: #E0E0E0;
      --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.08);
      --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.1);
      --border-radius: 12px;
    }

    /* ----- CẤU TRÚC TRANG ----- */
    .legal-page-wrapper {
        background-color: var(--color-background-light);
        padding: 60px 0;
    }
    .page-header {
        background-color: var(--color-secondary);
        padding: 40px 0;
        margin-bottom: 60px;
    }
    .legal-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 40px;
        align-items: flex-start;
    }

    /* ----- SIDEBAR ----- */
    .legal-sidebar {
        position: sticky;
        top: 100px;
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-soft);
        padding: 20px;
    }
    .sidebar-nav-item {
        display: block;
        padding: 12px 16px;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-dark);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
    }
    .sidebar-nav-item:hover {
        background-color: var(--color-background-light);
    }
    .sidebar-nav-item.active {
        background-color: var(--color-primary);
        color: white;
    }
    .sidebar-nav-item + .sidebar-nav-item {
        margin-top: 4px;
    }

    /* ----- CONTENT AREA ----- */
    .legal-content {
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-soft);
        padding: 40px;
    }
    .legal-content h3 {
        font-size: 24px;
        color: var(--color-primary);
        text-transform: uppercase;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--color-border);
    }
    .legal-content h4 {
        font-size: 20px;
        font-weight: 700;
        margin-top: 32px;
        margin-bottom: 16px;
    }
    .legal-content p, .legal-content li {
        font-size: 16px;
        line-height: 1.8;
        color: var(--color-text-light);
        margin-bottom: 16px;
    }
    .legal-content ul {
        list-style-position: inside;
        padding-left: 20px;
    }
    .legal-content a {
        color: var(--color-primary);
        text-decoration: underline;
    }

    /* ----- RESPONSIVE ----- */
    @media (max-width: 992px) {
        .legal-layout {
            grid-template-columns: 1fr;
        }
        .legal-sidebar {
            position: static;
            margin-bottom: 40px;
            display: flex;
            overflow-x: auto;
            padding-bottom: 10px;
        }
        .sidebar-nav-item {
            white-space: nowrap;
        }
    }
  `}</style>
);

// ----- CÁC COMPONENT CON -----
const SectionHeader = ({ title }) => (
  <div className="section-header page-header">
    <div className="container">
        <h2>{title}</h2>
    </div>
  </div>
);

const LegalSidebar = ({ activeTab, setActiveTab }) => {
    const sections = [
        { id: 'terms', title: 'Điều khoản và Riêng tư' },
        { id: 'privacy-snapshot', title: 'Ảnh chụp Quyền riêng tư' },
        { id: 'cookie-policy', title: 'Chính sách Cookie' },
        { id: 'privacy-choices', title: 'Lựa chọn Quyền riêng tư' },
        { id: 'accessibility', title: 'Tuyên bố Khả năng truy cập' }
    ];

    return (
        <nav className="legal-sidebar">
            {sections.map(section => (
                <a 
                    key={section.id}
                    className={`sidebar-nav-item ${activeTab === section.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(section.id)}
                >
                    {section.title}
                </a>
            ))}
        </nav>
    );
};

const LegalContent = ({ activeTab }) => (
    <div className="legal-content">
        {activeTab === 'terms' && (
            <div id="terms">
                <h3>Điều khoản và Chính sách Dịch vụ</h3>
                <p>Cập nhật lần cuối: 27 tháng 6, 2025</p>
                <p>
                    iCards.com.vn là nền tảng giúp bạn tạo, gửi và quản lý thiệp mời kỹ thuật số, cũng như cung cấp các công cụ quản lý sự kiện ("Dịch vụ"). 
                    Chính sách này mô tả cách chúng tôi thu thập, sử dụng và chia sẻ dữ liệu cá nhân.
                </p>
                <h4>1. Các bên liên quan</h4>
                <p>Chúng tôi tương tác với ba nhóm chính:</p>
                <ul>
                    <li><b>Chủ sự kiện:</b> Những người sử dụng iCards để thiết kế, gửi thiệp mời và quản lý sự kiện.</li>
                    <li><b>Khách mời:</b> Những người nhận được thiệp mời và có thể phản hồi trên nền tảng của chúng tôi.</li>
                    <li><b>Khách truy cập khác:</b> Những người chỉ duyệt xem trang web hoặc tương tác với chúng tôi trên mạng xã hội.</li>
                </ul>
                {/* Thêm các nội dung chi tiết khác của điều khoản tại đây */}
            </div>
        )}
        {activeTab === 'privacy-snapshot' && (
            <div id="privacy-snapshot">
                <h3>Ảnh chụp Quyền riêng tư</h3>
                <p>Đây là bản tóm tắt các thực hành về quyền riêng tư của chúng tôi. Vui lòng đọc toàn bộ Chính sách Quyền riêng tư để biết thông tin đầy đủ.</p>
                {/* Thêm nội dung chi tiết */}
            </div>
        )}
        {activeTab === 'cookie-policy' && (
            <div id="cookie-policy">
                <h3>Chính sách Cookie</h3>
                <p>Chúng tôi sử dụng cookie và các công nghệ tương tự để giúp trang web hoạt động, để hiểu cách bạn sử dụng dịch vụ của chúng tôi và cho các mục đích quảng cáo.</p>
                {/* Thêm nội dung chi tiết */}
            </div>
        )}
         {activeTab === 'privacy-choices' && (
            <div id="privacy-choices">
                <h3>Lựa chọn Quyền riêng tư của bạn</h3>
                <p>Bạn có các lựa chọn về dữ liệu chúng tôi thu thập. Khi bạn được yêu cầu cung cấp dữ liệu cá nhân, bạn có thể từ chối. Nhưng nếu bạn chọn không cung cấp dữ liệu cần thiết cho một dịch vụ, bạn có thể không sử dụng được dịch vụ đó.</p>
                 {/* Thêm nội dung chi tiết */}
            </div>
        )}
         {activeTab === 'accessibility' && (
            <div id="accessibility">
                <h3>Tuyên bố Khả năng truy cập</h3>
                <p>iCards cam kết đảm bảo khả năng truy cập kỹ thuật số cho những người khuyết tật. Chúng tôi liên tục cải thiện trải nghiệm người dùng cho mọi người và áp dụng các tiêu chuẩn truy cập có liên quan.</p>
                 {/* Thêm nội dung chi tiết */}
            </div>
        )}
    </div>
);


// ----- COMPONENT CHÍNH CỦA TRANG -----
const Content = () => {
    const [activeTab, setActiveTab] = useState('terms');

  return (
    <main className="page-content-wrapper">
      <Styles />
      <SectionHeader title="Trung tâm pháp lý" />
      <div className="container">
        <div className="legal-layout">
            <LegalSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <LegalContent activeTab={activeTab} />
        </div>
      </div>
    </main>
  );
};

export default Content;