import { Skeleton } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../../../services/api'; // <<< SỬA LỖI: Thêm import axios instance

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

    /* ----- CẤU TRÚC CHUNG ----- */
    .page-wrapper { margin: 0 auto; overflow-x: hidden; }
    .container { width: 100%; max-width: 1200px; margin-left: auto; margin-right: auto; padding-left: 30px; padding-right: 30px; }
    .section-container { padding: 80px 0; }
    .section-header { text-align: center; max-width: 800px; margin: 0 auto 40px auto; }
    .section-header h2 { font-size: 32px; color: var(--color-primary); text-transform: uppercase; font-weight: 700; }
    .section-header p { font-size: 16px; margin-top: 8px; text-transform: uppercase; }

    /* ----- HERO GALLERY ----- */
    .hero-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; height: 600px;}
    .hero-gallery .main-image { grid-column: 1 / 2; grid-row: 1 / 3; }
    .hero-gallery .image-wrapper { border-radius: var(--border-radius); overflow: hidden; box-shadow: var(--shadow-medium); }
    .hero-gallery img { width: 100%; height: 100%; object-fit: cover; }

    /* ----- STORY BLOCK ----- */
    .story-block { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .story-block.reverse .story-image { order: 2; }
    .story-image img { border-radius: 50%; width: 100%; max-width: 400px; height: 400px; object-fit: cover; margin: 0 auto; box-shadow: var(--shadow-medium); }
    .story-content { text-align: center; }
    .story-content .date { font-size: 20px; font-weight: 500; }
    .story-content h3 { font-size: 28px; font-weight: 700; margin: 12px 0; }
    .story-content p { color: var(--color-text-light); font-style: italic; }

    /* ----- PHOTO GALLERY ----- */
    .photo-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .photo-gallery .photo-item img { border-radius: var(--border-radius); box-shadow: var(--shadow-soft); }
    
    /* ----- COUNTDOWN TIMER ----- */
    .countdown-timer { display: flex; justify-content: center; gap: 20px; }
    .countdown-item { text-align: center; }
    .countdown-item .value { font-size: 48px; font-weight: 700; color: var(--color-primary); }
    .countdown-item .label { text-transform: uppercase; font-size: 14px; color: var(--color-text-light); }

    /* ----- RSVP FORM ----- */
    .rsvp-form-wrapper { background: var(--color-background-light); padding: 60px; border-radius: var(--border-radius); }
    .rsvp-choices { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .rsvp-choice { border: 2px solid var(--color-border); border-radius: var(--border-radius); padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; }
    .rsvp-choice.selected { border-color: var(--color-primary); background-color: #e3f2fd; box-shadow: var(--shadow-soft); }
    .rsvp-choice img { width: 80px; height: 80px; margin: 0 auto 16px auto; }
    .rsvp-choice span { font-weight: 600; font-size: 18px; }
    .rsvp-form .form-group { margin-bottom: 20px; }
    .rsvp-form .form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--color-primary) !important; }
    .form-input { width: 100%; padding: 16px; border: 1px solid var(--color-border); border-radius: var(--border-radius); font-size: 16px; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
    .form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(39, 84, 138, 0.2); }
    
    /* ----- CONTACT & SHARE ----- */
    .contact-section { display: flex; justify-content: center; gap: 60px; }
    .contact-card { text-align: center; color: var(--color-primary); }
    .contact-card h4 { font-size: 20px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .contact-card .icon { display: inline-block; width: 40px; height: 40px; background-color: var(--color-secondary); border-radius: 50%; }
    
    .share-section { text-align: center; color: var(--color-primary); }
    .share-buttons { display: flex; justify-content: center; gap: 16px; margin-top: 16px; }
    .share-button { width: 50px; height: 50px; border-radius: 50%; background-color: var(--color-secondary); border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: transform 0.2s ease; }
    .share-button:hover { transform: scale(1.1); }
    
    /* ----- RESPONSIVE ----- */
    @media (max-width: 992px) {
        .story-block { grid-template-columns: 1fr; text-align: center; }
        .story-block.reverse .story-image { order: -1; }
    }
    @media (max-width: 768px) {
        .hero-gallery { grid-template-columns: 1fr; height: auto; }
        .hero-gallery .main-image { grid-row: auto; }
        .photo-gallery { grid-template-columns: 1fr; }
        .rsvp-form-wrapper { padding: 30px; }
        .rsvp-choices { grid-template-columns: 1fr; }
        .contact-section { flex-direction: column; gap: 30px; }
    }

  `}</style>
);

// ----- CÁC COMPONENT CON -----

const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown-timer">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="countdown-item">
          <div className="value">{value.toString().padStart(2, '0')}</div>
          <div className="label">{unit}</div>
        </div>
      ))}
    </div>
  );
};
const AboutUsPageSkeleton = () => (
    <>
        <style>{`
            .skeleton-box {
                background-color: #eef0f2;
                border-radius: 8px;
                animation: skeleton-loading 1.5s infinite ease-in-out;
            }
            @keyframes skeleton-loading {
                0% { background-color: #eef0f2; }
                50% { background-color: #f6f7f8; }
                100% { background-color: #eef0f2; }
            }
            .skeleton-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 30px;
            }
            .skeleton-hero {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                height: 600px;
                margin-top: 20px;
            }
            .skeleton-hero-main {
                grid-column: 1 / 2;
                grid-row: 1 / 3;
            }
            .skeleton-section {
                padding: 80px 0;
            }
            .skeleton-header {
                width: 350px;
                height: 32px;
                margin: 0 auto 40px auto;
            }
            .skeleton-story {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 60px;
                align-items: center;
            }
            .skeleton-story-img {
                width: 400px;
                height: 400px;
                border-radius: 50%;
                margin: 0 auto;
            }
            .skeleton-story-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }
            .skeleton-text-line {
                height: 16px;
                border-radius: 4px;
            }
            @media (max-width: 992px) {
                .skeleton-story { grid-template-columns: 1fr; }
            }
            @media (max-width: 768px) {
                .skeleton-hero { grid-template-columns: 1fr; height: auto; }
                .skeleton-story-img { width: 300px; height: 300px; }
            }
        `}</style>
        <div className="skeleton-container">
            <div className="skeleton-hero">
                <Skeleton className="skeleton-hero-main" />
                <Skeleton />
                <Skeleton />
            </div>
            <div className="skeleton-section">
                <Skeleton className="skeleton-header" />
                 <div className="skeleton-story">
                    <Skeleton className="skeleton-story-img" />
                    <div className="skeleton-story-content">
                        <Skeleton style={{width: '250px', height: '28px'}} />
                        <Skeleton className="skeleton-text-line" style={{width: '80%'}} />
                        <Skeleton className="skeleton-text-line" style={{width: '90%'}} />
                        <Skeleton className="skeleton-text-line" style={{width: '75%'}} />
                    </div>
                </div>
            </div>
        </div>
    </>
);

const RsvpSection = ({ invitationId, guestDetails }) => {
    const [showForm, setShowForm] = useState(false);
    const [status, setStatus] = useState(guestDetails?.status || 'pending');
    const [attendingCount, setAttendingCount] = useState(guestDetails?.attendingCount || 1);
    const [submitting, setSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });
    // Nếu không có thông tin khách mời, không hiển thị gì cả
    if (!guestDetails?._id) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontWeight: '500' }}>Phần xác nhận tham dự sẽ hiển thị khi bạn truy cập từ đường dẫn được gửi trong thiệp mời.</p>
            </div>
        );
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedbackMessage({ text: '', type: '' });

        try {
            await api.put(`/invitations/${invitationId}/guests/${guestDetails._id}/rsvp`, {
                status: status,
                attendingCount: Number(attendingCount),
            });
            setFeedbackMessage({ text: 'Cảm ơn bạn đã gửi phản hồi!', type: 'success' });
        } catch (error) {
            console.error("Lỗi khi gửi phản hồi:", error);
            setFeedbackMessage({ text: 'Đã có lỗi xảy ra, vui lòng thử lại.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if ((guestDetails.status === 'attending' || guestDetails.status === 'declined') && feedbackMessage.type !== 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#2e7d32' }}>
                    Bạn đã xác nhận tham gia thành công, xin cảm ơn và hẹn gặp lại!
                </p>
            </div>
        );
    }

    // 2. Nếu đã gửi thành công trong phiên này, hiển thị lời cảm ơn
    if (feedbackMessage.type === 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#2e7d32' }}>
                    {feedbackMessage.text}
                </p>
            </div>
        );
    }

    // 3. Nếu chưa phản hồi và chưa bấm nút, hiển thị nút bấm
    if (!showForm) {
        return (
            <div style={{ textAlign: 'center' }}>
                <button onClick={() => setShowForm(true)} className="btn-primary" style={{ padding: '20px 40px', fontSize: '18px' }}>
                    Xác nhận tham dự
                </button>
            </div>
        );
    }


    return (
        <form className="rsvp-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="attendanceStatus">Bạn sẽ tham gia chứ?</label>
                <select 
                    id="attendanceStatus" 
                    className="form-input" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">Chưa xác định trước được</option>
                    <option value="attending">Tôi sẽ tham gia</option>
                    <option value="declined">Tôi không tham gia được</option>
                </select>
            </div>
            {status === 'attending' && (
                <div className="form-group">
                    <label htmlFor="attendanceCount">Số người tham dự (bao gồm cả bạn)</label>
                    <input 
                        id="attendanceCount" 
                        type="number" 
                        min="1" 
                        max="10"
                        className="form-input" 
                        value={attendingCount}
                        onChange={(e) => setAttendingCount(e.target.value)}
                    />
                </div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', color: "var(--color-primary)" }} disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
            {feedbackMessage.text && (
                <div className={`feedback-message ${feedbackMessage.type}`}>
                    {feedbackMessage.text}
                </div>
            )}
        </form>
    );
};

// ----- COMPONENT CHÍNH -----
const AboutUsPage = () => {
    const { id: invitationId } = useParams();
    const [searchParams] = useSearchParams();
    const guestId = searchParams.get('guestId');

    const [invitationData, setInvitationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!invitationId) return;

        const fetchInvitation = async () => {
            try {
                setLoading(true);
                const queryString = guestId ? `?guestId=${guestId}` : '';
                const response = await api.get(`/invitations/public/${invitationId}${queryString}`);
                setInvitationData(response.data);
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.message || `Lỗi ${err.response.status}: Không thể tải dữ liệu.`);
                } else if (err.request) {
                    setError("Lỗi Mạng: Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng.");
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [invitationId, guestId]);

    if (loading) {
        return <AboutUsPageSkeleton />;
    }

    if (error) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red'}}>Lỗi: {error}</div>;
    }

    if (!invitationData) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '18px'}}>Không tìm thấy thông tin thiệp mời.</div>;
    }
    
    const { settings, guestDetails } = invitationData;
    const { groomName, brideName, groomInfo, brideInfo, groomImageUrl, brideImageUrl, eventDate, heroImages, galleryImages } = settings;

  return (
    <main>
      <Styles />
      {guestDetails && (
          <div style={{padding: '20px', backgroundColor: '#e3f2fd', textAlign: 'center', fontWeight: 'bold', fontSize: '18px'}}>
              {settings.salutationStyle} {guestDetails.name}, trân trọng mời bạn đến chung vui cùng chúng tôi!
          </div>
      )}
      <section className="hero-gallery container">
          <div className="image-wrapper main-image">
              <img src={heroImages.main} alt="Ảnh cưới chính" />
          </div>
          <div className="image-wrapper">
              <img src={heroImages.sub1} alt="Ảnh cưới phụ 1" />
          </div>
          <div className="image-wrapper">
              <img src={heroImages.sub2} alt="Ảnh cưới phụ 2" />
          </div>
      </section>

      <div className="container">
        <section className="section-container">
            <SectionHeader title="Về chúng tôi" />
            <div className="story-block">
                <div className="story-image">
                    <img src={groomImageUrl} alt={groomName} />
                </div>
                <div className="story-content">
                    <h3>{groomName}</h3>
                    <p>"{groomInfo}"</p>
                </div>
            </div>
        </section>

        <section className="section-container">
            <div className="story-block reverse">
                <div className="story-image">
                    <img src={brideImageUrl} alt={brideName} />
                </div>
                <div className="story-content">
                    <h3>{brideName}</h3>
                    <p>"{brideInfo}"</p>
                </div>
            </div>
        </section>
        
        <section className="section-container">
            <SectionHeader title="Ảnh cưới" />
            <div className="photo-gallery">
                {galleryImages.map((img, index) => (
                      <div key={index} className="photo-item"><img src={img} alt={`Ảnh cưới ${index + 1}`} /></div>
                ))}
            </div>
        </section>

        <section className="section-container">
            <SectionHeader title="Đếm ngược đến ngày chung đôi" />
            <CountdownTimer targetDate={eventDate} />
        </section>

        <section className="section-container rsvp-form-wrapper">
            <SectionHeader title="Thông tin phản hồi" subtitle="Để thuận tiện cho việc sắp xếp chỗ ngồi, vui lòng phản hồi giúp vợ chồng mình nhé!" />
            <RsvpSection invitationId={invitationId} guestDetails={guestDetails} />
        </section>

         <section className="section-container">
            <div className="contact-section">
                <div className="contact-card">
                    <h4>Liên hệ chú rể</h4>
                    <span className="icon"></span>
                </div>
                 <div className="contact-card">
                    <h4>Liên hệ cô dâu</h4>
                    <span className="icon"></span>
                </div>
            </div>
         </section>

         <section className="section-container share-section">
            <h4>Chia sẻ thiệp</h4>
            <div className="share-buttons">
                <button className="share-button" aria-label="Share on Facebook"></button>
                <button className="share-button" aria-label="Share on Zalo"></button>
                <button className="share-button" aria-label="Share on Messenger"></button>
                <button className="share-button" aria-label="Copy Link"></button>
            </div>
         </section>

      </div>
    </main>
  );
};

export default AboutUsPage;