import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobalFooter.css';

// SVG component for Facebook Icon
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// SVG component for Instagram Icon
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// SVG component for Pinterest Icon
const PinterestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.627-.012-1.68.204-2.508.21-.81.125-1.43-.08-2.132-.202-.7-.49-1.4-.49-2.16 0-1.98.99-3.47 2.78-3.47 1.55 0 2.29.98 2.29 2.19 0 1.34-.85 3.33-1.28 5.18-.36 1.53.77 2.78 2.31 2.78 2.76 0 4.88-2.9 4.88-6.18 0-3.26-2.35-5.5-5.34-5.5-3.61 0-5.83 2.68-5.83 5.33 0 .99.38 2.05.88 2.63.08.09.09.16.06.27l-.27 1.1c-.05.22-.18.27-.4.16-1.49-.72-2.42-2.8-2.42-4.58 0-3.78 2.74-7.03 7.8-7.03 4.12 0 7.37 2.9 7.37 6.45 0 3.84-2.43 6.86-5.86 6.86-1.9 0-3.62-1-4.22-2.18" />
    </svg>
);

// SVG component for TikTok Icon
const TiktokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
        <path d="M16.5 5.5a4.5 4.5 0 1 0 5.5 5.5V15a6 6 0 1 1-6-6h2.5" />
    </svg>
);

// SVG component for Youtube Icon
const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 4.24 4.24 2.5 7 2.5h10c2.76 0 4.5 1.74 4.5 4.5v10c0 2.76-1.74 4.5-4.5 4.5H7c-2.76 0-4.5-1.74-4.5-4.5z" />
        <path d="m10 15 5-3-5-3z" />
    </svg>
);


const GlobalFooter = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
      navigate(path);
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-main-content">
          {/* Column 1: Company Info */}
          <div className="footer-column footer-info">
            <div className="footer-logo">Logo</div>
            <p className="company-name">Công ty TNHH Đầu Tư Phát Triển Kết Nối Thế Giới</p>
            <p className="company-address">
              Địa chỉ: Cầu Giấy, Hà Nội, Việt Nam
              <br />
              Hotline: (+84) 987 235 1645
            </p>
          </div>

          {/* Column 2: Help Links */}
          <div className="footer-column footer-links">
            <h5 className="footer-title">Giúp đỡ</h5>
            <a href="#">Câu hỏi thường gặp</a>
            <a href="#">Liên hệ với chúng tôi</a>
            <a href="#">Sơ đồ trang web</a>
            <a href="#">Chính sách đổi trả</a>
          </div>

          {/* Column 3: Company Links */}
          <div className="footer-column footer-links">
            <h5 className="footer-title">Công ty</h5>
            <a href="#">Về chúng tôi</a>
            <a href="#">Giá cả</a>
            <a href="#">Khuyến mại</a>
            <a href="#">Dịch vụ thiết kế cá nhân</a>
            <a href="#">Cửa hàng tiệc</a>
            <a href="#">Nghề nghiệp</a>
          </div>

          {/* Column 4: Learn Links */}
          <div className="footer-column footer-links">
            <h5 className="footer-title">Học hỏi</h5>
            <a href="#">Blog</a>
            <a href="#">Lời mời trực tuyến</a>
            <a href="#">Bộ sưu tập của nhà thiết kế</a>
            <a href="#">Tính năng sản phẩm</a>
            <a href="#">Ứng dụng</a>
          </div>

          {/* Column 5: Connect */}
          <div className="footer-column footer-connect">
            <h5 className="footer-title connect-title">Kết nối</h5>
            <div className="footer-social-icons">
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Pinterest"><PinterestIcon /></a>
              <a href="#" aria-label="TikTok"><TiktokIcon /></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon /></a>
            </div>
            <div className="footer-app-buttons">
              <button className="app-store-btn">
                <span>Tải trên</span>
                <strong>App Store</strong>
              </button>
              <button className="app-store-btn">
                <span>Tải trên</span>
                <strong>CH PLAY</strong>
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} iCards.com.vn ®</p>
          <div className="footer-legal-links">
            <button onClick={() => handleNavigate("/policies-and-privacy")}>Điều khoản và riêng tư</button>
            <button onClick={() => handleNavigate("/privacy-snapshot")}>Ảnh chụp quyền riêng tư</button>
            <button onClick={() => handleNavigate("/cookie-policy")}>Chính sách cookie</button>
            <button onClick={() => handleNavigate("/privacy-choices")}>Lựa chọn quyền riêng tư của bạn</button>
            <button onClick={() => handleNavigate("/accessibility-statement")}>Tuyên bố khả năng truy cập</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
