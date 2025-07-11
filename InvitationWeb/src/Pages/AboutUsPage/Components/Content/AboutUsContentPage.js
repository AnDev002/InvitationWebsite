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
    .rsvp-form .form-group label { display: block; font-weight: 600; margin-bottom: 8px; }
    .form-input { width: 100%; padding: 16px; border: 1px solid var(--color-border); border-radius: var(--border-radius); font-size: 16px; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
    .form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(39, 84, 138, 0.2); }
    
    /* ----- CONTACT & SHARE ----- */
    .contact-section { display: flex; justify-content: center; gap: 60px; }
    .contact-card { text-align: center; }
    .contact-card h4 { font-size: 20px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .contact-card .icon { display: inline-block; width: 40px; height: 40px; background-color: var(--color-secondary); border-radius: 50%; }
    
    .share-section { text-align: center; }
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


// ----- COMPONENT CHÍNH -----
const AboutUsPage = () => {
    const [rsvp, setRsvp] = useState(null);

  return (
    <main>
      <Styles />
      
      <section className="hero-gallery container">
        <div className="image-wrapper main-image">
            <img src="https://placehold.co/800x1200/cccccc/ffffff?text=Ảnh+cưới+1" alt="Ảnh cưới 1" />
        </div>
        <div className="image-wrapper">
            <img src="https://placehold.co/800x590/cccccc/ffffff?text=Ảnh+cưới+2" alt="Ảnh cưới 2" />
        </div>
        <div className="image-wrapper">
            <img src="https://placehold.co/800x590/cccccc/ffffff?text=Ảnh+cưới+3" alt="Ảnh cưới 3" />
        </div>
      </section>

      <div className="container">
        <section className="section-container">
          <SectionHeader title="Về chúng tôi" />
          <div className="story-block">
            <div className="story-image">
                <img src="https://placehold.co/400x400/E9ECEF/333?text=Chú+Rể" alt="Chú rể" />
            </div>
            <div className="story-content">
                <p className="date">20.03.2025</p>
                <h3>Chú rể: Anh Khoa</h3>
                <p>"Lưu ý: Hệ thống sẽ tự động thay đổi cụm từ {`{TênKháchMời}`} thành tên chính xác của khách mời, và cụm từ {`{LờiXưngHô}`} thành chính xác kiểu hiện thị xưng hô mà bạn chọn khi bạn gửi link thiệp cho họ."</p>
            </div>
          </div>
        </section>

        <section className="section-container">
          <div className="story-block reverse">
            <div className="story-image">
                <img src="https://placehold.co/400x400/F8F9FA/333?text=Cô+Dâu" alt="Cô dâu" />
            </div>
            <div className="story-content">
                <p className="date">20.03.2025</p>
                <h3>Cô dâu: Như Thanh</h3>
                <p>"Lưu ý: Hệ thống sẽ tự động thay đổi cụm từ {`{TênKháchMời}`} thành tên chính xác của khách mời, và cụm từ {`{LờiXưngHô}`} thành chính xác kiểu hiện thị xưng hô mà bạn chọn khi bạn gửi link thiệp cho họ."</p>
            </div>
          </div>
        </section>
        
        <section className="section-container">
          <SectionHeader title="Ảnh cưới" />
          <div className="photo-gallery">
            <div className="photo-item"><img src="https://placehold.co/1520x800/E9ECEF/333?text=Ảnh+cưới" alt="Ảnh cưới" /></div>
            <div className="photo-item"><img src="https://placehold.co/1520x800/F1F3F5/333?text=Ảnh+cưới" alt="Ảnh cưới" /></div>
          </div>
        </section>

        <section className="section-container">
            <SectionHeader title="Đếm ngược đến ngày chung đôi" />
            <CountdownTimer targetDate="2025-12-31T23:59:59" />
        </section>

        <section className="section-container rsvp-form-wrapper">
             <SectionHeader title="Thông tin phản hồi" subtitle="Để thuận tiện cho việc sắp xếp chỗ ngồi, vui lòng phản hồi giúp vợ chồng mình nhé!" />
             <div className="rsvp-choices">
                <div className={`rsvp-choice ${rsvp === 'GIRL' ? 'selected' : ''}`} onClick={() => setRsvp('GIRL')}>
                    <img src="https://placehold.co/80x80/f1f1f1/333?text=Nhà+gái" alt="Nhà gái"/>
                    <span>Nhà gái</span>
                </div>
                <div className={`rsvp-choice ${rsvp === 'BOY' ? 'selected' : ''}`} onClick={() => setRsvp('BOY')}>
                    <img src="https://placehold.co/80x80/f1f1f1/333?text=Nhà+trai" alt="Nhà trai"/>
                    <span>Nhà trai</span>
                </div>
             </div>
             <form className="rsvp-form">
                <div className="form-group">
                    <label htmlFor="guestName">Tên khách mời</label>
                    <input id="guestName" type="text" className="form-input" placeholder="Vui lòng nhập tên của bạn" />
                </div>
                 <div className="form-group">
                    <label htmlFor="attendanceCount">Số người tham dự</label>
                    <input id="attendanceCount" type="number" min="1" className="form-input" placeholder="1" />
                </div>
                <div className="form-group">
                    <label htmlFor="transport">Phương tiện đi lại</label>
                    <input id="transport" type="text" className="form-input" placeholder="Tự túc" />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '20px'}}>Gửi phản hồi</button>
             </form>
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
