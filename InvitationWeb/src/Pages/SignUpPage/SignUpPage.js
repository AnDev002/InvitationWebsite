import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // Bỏ comment dòng này nếu bạn dùng useAuth

// --- CÁC ICON (SVG) ĐỂ SỬ DỤNG (NẾU CẦN) ---
const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.825 10.2063C19.825 9.38129 19.75 8.58129 19.6 7.80629H10.125V11.2563H15.7125C15.4625 12.4313 14.6375 14.1563 13.2125 15.1563L13.1812 15.1875L15.7687 17.1563L15.9187 17.1875C17.9625 15.3563 19.825 12.8563 19.825 10.2063Z" fill="#4285F4"></path><path d="M10.125 20C12.825 20 15.0125 19.1375 16.65 17.75L14.0625 15.7812C13.2125 16.3125 12.0375 16.6875 10.125 16.6875C7.575 16.6875 5.45 15.0125 4.675 12.7187L4.6 12.7187L1.9125 14.7187L1.85 14.8437C3.4875 17.9375 6.5625 20 10.125 20Z" fill="#34A853"></path><path d="M4.675 12.7187C4.475 12.1312 4.3625 11.5062 4.3625 10.8437C4.3625 10.1812 4.475 9.55624 4.675 8.96874L4.6625 8.90624L1.8625 6.78124L1.85 6.65624C1.0375 8.05624 0.5 9.70624 0.5 11.3437C0.5 12.9812 1.0375 14.6312 1.85 16.0312L4.675 12.7187Z" fill="#FBBC05"></path><path d="M10.125 4.53125C11.725 4.53125 12.8625 5.11875 13.75 5.96875L16.3375 3.34375C14.6125 1.76875 12.425 0.875 10.125 0.875C6.5625 0.875 3.4875 2.9375 1.85 6.03125L4.675 8.96875C5.45 6.675 7.575 4.53125 10.125 4.53125Z" fill="#EB4335"></path></svg>
);
const FacebookIcon = () => (
    <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6543 19.5V10.6055H9.5332L9.96777 7.30957H6.6543V5.15039C6.6543 4.19531 6.9209 3.55957 8.12891 3.55957L10.125 3.55908V0.52832C9.79199 0.491211 8.71094 0.416016 7.46484 0.416016C4.86133 0.416016 3.08008 2.05371 3.08008 4.83301V7.30957H0.25V10.6055H3.08008V19.5H6.6543Z" fill="#1877F2"></path></svg>
);

// --- COMPONENT CSS ---
const Styles = () => (
    <style>{`
      /* Import SVN-Gilroy Font - Cần đảm bảo URL này đúng với project của bạn */
      @import url('https://fonts.cdnfonts.com/css/svn-gilroy');

      .auth-page-wrapper {
          font-family: 'SVN-Gilroy', sans-serif;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px; /* Giảm padding mặc định */
      }

      .auth-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 30px; /* Giảm khoảng cách mặc định */
        width: 100%; /* Cho phép container co giãn */
      }

      .auth-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px; /* Giảm khoảng cách */
        text-align: center;
        width: 100%;
      }

      .auth-header h1 {
        font-size: 36px;
        color: rgba(0,0,0,1);
        line-height: 1.2;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        font-weight: 700;
        white-space: nowrap;
      }

      .auth-header p {
        font-size: 16px;
        width: 100%;
        max-width: 500px;
        color: rgba(102,102,102,1);
        line-height: 1.5;
        font-weight: 500;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        max-width: 500px;
      }

      .form-input {
        height: 60.5px;
        width: 100%;
        border: 0.5px solid rgb(128,128,128);
        padding: 11px 20px;
        font-family: 'SVN-Gilroy', sans-serif;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        background-color: #fff;
        border-radius: 0; 
      }

      .form-input::placeholder {
        color: rgba(102,102,102,1);
      }
      
      .form-input:focus {
          outline: 1px solid #27548A;
      }

      .form-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin-top: 28px;
        width: 100%;
        max-width: 500px;
      }
      
      .main-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
      }

      .btn {
          width: 100%;
          border: 0.5px solid rgb(0,0,0);
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-family: 'SVN-Gilroy', sans-serif;
          transition: opacity 0.2s;
          text-transform: uppercase;
          font-weight: 700;
          border-radius: 0;
      }
      .btn:hover {
          opacity: 0.9;
      }

      .btn-primary {
          background-color: #27548A;
          color: rgba(255,255,255,1);
          font-size: 20px;
          letter-spacing: 0.02em;
          border-color: #27548A;
      }

      .social-buttons {
          display: flex;
          flex-direction: row;
          gap: 12px;
          width: 100%;
      }

      .btn-social {
          border-color: rgb(128,128,128);
          width: 100%; /* Chia đều chiều rộng */
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          background-color: #fff;
          font-size: 16px;
          color: rgba(51,51,51,1);
          text-transform: none;
          font-weight: bold;
      }
      
      .auth-switch {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
        line-height: 21px;
        width: 100%;
      }
      .auth-switch span {
          color: rgba(102,102,102,1);
      }
      .auth-switch a {
          color: #27548A;
          text-decoration: none;
          font-weight: bold;
      }

      .back-to-home {
        position: fixed;
        top: 30px;
        left: 30px;
      }

      /* Thông báo lỗi & thành công */
        .error-message, .success-message {
            padding: 1rem;
            width: 100%;
            max-width: 500px;
            text-align: center;
            font-size: 15px;
            margin-bottom: -10px; /* Bù lại khoảng cách gap */
            border-radius: 0;
        }
        .error-message {
            color: #c62828;
            background-color: #ffebee;
            border: 1px solid #ef9a9a;
        }
        .success-message {
            color: #2e7d32;
            background-color: #e8f5e9;
            border: 1px solid #a5d6a7;
        }

      /* --- RESPONSIVE CHO ĐIỆN THOẠI --- */
      @media (max-width: 768px) {
          .auth-header h1 {
              font-size: 28px; /* Giảm kích thước tiêu đề */
              white-space: normal; /* Cho phép tiêu đề xuống dòng */
          }

          .social-buttons {
              flex-direction: column; /* Xếp chồng nút social */
          }

          .btn-social {
              width: 100%; /* Nút social chiếm toàn bộ chiều rộng */
          }

          .auth-header p,
          .auth-form,
          .form-actions,
          .error-message,
          .success-message {
              max-width: 100%; /* Bỏ giới hạn chiều rộng trên mobile */
          }
      }

    `}</style>
);


const RegisterPage = () => {
    const { register } = useAuth(); 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await register(name, email, password);
            setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
            setTimeout(() => {
                navigate('/sign-in');
            }, 2000);
        } catch (err) {
            const errorMessage = err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setError(errorMessage);
        }
    };

    return (
        <>
            <Styles />
            <div className="auth-page-wrapper">
                <Link to="/" className="back-to-home">
                    <BackIcon /> Trở về trang chủ
                </Link>
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>Tạo tài khoản mới</h1>
                        <p>Cùng Biihappy kết nối và chia sẻ những điều hạnh phúc đến mọi người trong cuộc sống của bạn.</p>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Tên đăng nhập"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </form>

                    <div className="form-actions">
                        <div className="main-actions">
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                                Đăng Ký
                            </button>
                            <div className="social-buttons">
                                <button type="button" className="btn btn-social">
                                    <GoogleIcon /> Google
                                </button>
                                <button type="button" className="btn btn-social">
                                    <FacebookIcon /> Facebook
                                </button>
                            </div>
                        </div>
                        <div className="auth-switch">
                            <span>Bạn đã có tài khoản?</span>
                            <Link to="/sign-in">Đăng nhập</Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default RegisterPage;