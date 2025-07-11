import React, { useEffect, useRef, useState } from 'react';
import './HomepageContent.css';
import { useNavigate } from 'react-router-dom';
import api from "../../../../services/api";

// --- Components ---

const ArrowButton = ({ direction, onClick }) => (
    <button className={`arrow-btn ${direction}`} onClick={onClick}>
        <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2L3 11L11 20" stroke="black" strokeWidth="4" strokeLinecap="round"/>
        </svg>
    </button>
);

const OccasionCard = ({ title, imgSrc, onClick }) => (
    <div className="occasion-item" onClick={onClick}>
        <div className="occasion-image-wrapper">
            <img src={imgSrc} alt={title} />
        </div>
        <p className="occasion-title">{title}</p>
    </div>
);

const ProductCard = ({ _id, title, imgSrc }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const handleNavigate = (e) => { e.preventDefault(); navigate(`/product/${_id}`); };
    const handleLikeClick = (e) => { e.stopPropagation(); e.preventDefault(); setIsLiked(!isLiked); };

    return (
        <a href={`/product/${_id}`} className="product-item" onClick={handleNavigate}>
            <div className="product-image-container">
                <img src={imgSrc} alt={title} className="product-image" />
                 <button className={`product-like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick} aria-label="Like product">
                    <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.3158 0.482422C13.8842 0.482422 12.0211 2.21053 11.0526 3.47368H10.9474C9.97895 2.21053 8.11579 0.482422 5.68421 0.482422C2.52632 0.482422 0 3.01895 0 6.16632C0 11.7558 11 17 11 17C11 17 22 11.7558 22 6.16632C22 3.01895 19.4737 0.482422 16.3158 0.482422Z" fill={isLiked ? '#E74C3C' : '#E0E0E0'}/>
                    </svg>
                </button>
            </div>
            <div className="product-info">
                <h5 className="product-title">{title}</h5>
            </div>
        </a>
    );
};


// --- Main Content Component ---
export const Content = () => {
    const navigate = useNavigate();
    const occasionContainerRef = useRef(null);

    const [invitations, setInvitations] = useState([]);
    const [invitations2, setInvitations2] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [invitationRes] = await Promise.all([
                    api.get('/invitation-templates?limit=6')
                ]);
                setInvitations(invitationRes.data.data);
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleScroll = (direction) => {
        if (occasionContainerRef.current) {
            const scrollAmount = 344; // width of card + gap
            occasionContainerRef.current.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return <div className="loading-spinner"><div></div><div></div><div></div></div>;
    }

    return (
        <>
            {/* Hero Banner Section */}
            <section className="hero-section">
                <img 
                    src="https://pub-f720e3221ef5464a93d19bbdae2cfb86.r2.dev/herohome.png" 
                    alt="Hero Banner" 
                    className="hero-image"
                />
            </section>

            <main className="homepage-main">
                {/* Section 1: Occasions */}
                <section className="section-occasions">
                    <div className="section-header">
                        <h2 className="section-title">NHỮNG DỊP LAN TỎA NIỀM VUI CỦA BẠN ĐẾN MỌI NGƯỜI</h2>
                        <p className="section-subtitle">NHỮNG CƠ HỘI MỌI NGƯỜI KẾT NỐI THÂN THIẾT</p>
                    </div>
                    <div className="occasions-carousel">
                        <ArrowButton direction="prev" onClick={() => handleScroll('prev')} />
                        <div className="occasions-container" ref={occasionContainerRef}>
                            {invitations.slice(0, 5).map((item) => (
                                <OccasionCard
                                    key={item._id}
                                    title={item.category}
                                    imgSrc={item.imgSrc || `https://placehold.co/324x324/e0f7fa/006064?text=${item.title}`}
                                    onClick={() => navigate(`/invitation/${item._id}`)}
                                />
                            ))}
                        </div>
                        <ArrowButton direction="next" onClick={() => handleScroll('next')} />
                    </div>
                </section>

                {/* Section 2: Products */}
                <section className="section-products">
                    <div className="product-grid">
                        {invitations.slice(1,9).map((item) => (
                            <OccasionCard
                                key={item._id}
                                title={item.category}
                                imgSrc={item.imgSrc || `https://placehold.co/324x324/e0f7fa/006064?text=${item.title}`}
                                onClick={() => navigate(`/invitation/${item._id}`)}
                            />
                        ))}
                    </div>
                    <button className="view-more-btn" onClick={() => navigate('/invitations')}>XEM THÊM</button>
                </section>

                {/* Section 3: Feature Banners */}
                <section className="section-features">
                    <img src="https://i.imgur.com/example2.png" onError={(e) => e.target.src='https://placehold.co/1520x634/cccccc/ffffff?text=Feature+Banner'} alt="Feature Banner 1" className="feature-banner" />
                    <img src="https://i.imgur.com/example2.png" onError={(e) => e.target.src='https://placehold.co/1520x634/cccccc/ffffff?text=Feature+Banner'} alt="Feature Banner 2" className="feature-banner" />
                </section>

                {/* Section 4: Text Content */}
                <section className="section-text-content">
                    <h3 className="text-content-title">iCards.com.vn: Nền Tảng Thiết Kế Thiệp Online Đẳng Cấp – Thể Hiện Phong Cách Riêng Của Bạn!</h3>
                    <div className="text-content-body">
                        <div className="text-block">
                            <h4>iCards.com.vn Là Gì?</h4>
                            <p>iCards.com.vn là một website chuyên cung cấp công cụ và tài nguyên để người dùng tự thiết kế thiệp chúc mừng, thiệp mời, thiệp cảm ơn và nhiều loại thiệp khác theo phong cách cá nhân. Không cần kỹ năng thiết kế chuyên nghiệp, bạn vẫn có thể tạo ra những tấm thiệp đẹp mắt, ấn tượng và mang đậm dấu ấn riêng của mình.</p>
                        </div>
                        <div className="text-block">
                            <h4>Tính Năng Nổi Bật Của iCards.com.vn</h4>
                            <ul>
                                <li>Kho Mẫu Thiệp Đa Dạng, Phong Phú: Từ thiệp sinh nhật, thiệp cưới, thiệp Giáng sinh, thiệp Tết đến thiệp mời sự kiện, thiệp cảm ơn... iCards.com.vn cung cấp hàng trăm mẫu thiết kế sẵn có, được cập nhật thường xuyên, phù hợp với mọi chủ đề và sự kiện.</li>
                                <li>Công Cụ Thiết Kế Trực Quan, Dễ Sử Dụng: Giao diện kéo thả (drag-and-drop) thông minh giúp bạn dễ dàng tùy chỉnh mọi chi tiết:</li>
                                <li>Thêm và Chỉnh Sửa Văn Bản: Chọn font chữ, cỡ chữ, màu sắc, vị trí theo ý muốn.</li>
                                <li>Tải Ảnh Cá Nhân: Chèn những bức ảnh kỷ niệm, logo thương hiệu để tạo sự độc đáo.</li>
                                <li>Thư Viện Hình Ảnh, Icon Đồ Họa Miễn Phí: Hàng ngàn icon, sticker, họa tiết trang trí giúp thiệp của bạn thêm sinh động.</li>
                                <li>Thay Đổi Màu Sắc, Nền: Tùy chỉnh màu sắc chủ đạo, hình nền để phù hợp với thông điệp.</li>
                                <li>Lưu và Chỉnh Sửa Không Giới Hạn: Bạn có thể lưu lại thiết kế của mình và tiếp tục chỉnh sửa bất cứ lúc nào.</li>
                                <li>Xuất File Đa Dạng: Hỗ trợ xuất thiệp dưới nhiều định dạng chất lượng cao (JPG, PNG, PDF), sẵn sàng để in ấn hoặc gửi online.</li>
                                <li>Chia Sẻ Dễ Dàng: Tích hợp tính năng chia sẻ trực tiếp lên mạng xã hội hoặc gửi qua email, tin nhắn.</li>
                            </ul>
                        </div>
                        <div className="text-block">
                            <h4>Lợi Ích Vượt Trội Khi Sử Dụng iCards.com.vn</h4>
                            <ul>
                                <li>Tiết Kiệm Thời Gian & Chi Phí: Không cần đến cửa hàng in ấn, không tốn thời gian di chuyển. Mọi thao tác đều thực hiện online, nhanh chóng và hiệu quả.</li>
                                <li>Sáng Tạo Không Giới Hạn: Tự do thể hiện ý tưởng, tạo ra những tấm thiệp "có một không hai" mà không bị giới hạn bởi các mẫu có sẵn.</li>
                                <li>Tiện Lợi Mọi Lúc Mọi Nơi: Chỉ cần có kết nối internet, bạn có thể thiết kế thiệp ở bất cứ đâu, bất cứ lúc nào.</li>
                                <li>Bảo Vệ Môi Trường: Sử dụng thiệp online góp phần giảm thiểu lượng rác thải giấy, hướng tới lối sống xanh.</li>
                                <li>Dễ Dàng Cập Nhật & Sửa Đổi: Có thể chỉnh sửa nội dung thiệp bất cứ lúc nào trước khi gửi đi.</li>
                            </ul>
                        </div>
                        <div className="text-block">
                            <h4>Hướng Dẫn Sử Dụng iCards.com.vn Nhanh Chóng</h4>
                            <ul>
                            <li>Truy cập website: Mở trình duyệt và truy cập iCards.com.vn.</li>
                            <li>Chọn mẫu thiệp: Duyệt qua kho mẫu thiệp đa dạng hoặc bắt đầu từ một thiết kế trống.</li>
                            <li>Tùy chỉnh thiết kế: Sử dụng các công cụ kéo thả để thêm văn bản, hình ảnh, icon, thay đổi màu sắc...</li>
                            <li>Lưu và tải xuống: Sau khi hoàn tất, lưu lại thiết kế và tải xuống dưới định dạng mong muốn.</li>
                            <li>Chia sẻ: Gửi thiệp trực tiếp qua email, tin nhắn hoặc chia sẻ lên mạng xã hội.</li>
                            </ul>
                        </div>
                        <div className="text-block">
                            <p>Kết Luận: Với iCards.com.vn, việc tạo ra những tấm thiệp đẹp mắt, ý nghĩa chưa bao giờ dễ dàng đến thế. Hãy để sự sáng tạo của bạn bay bổng và gửi gắm những thông điệp yêu thương, chân thành đến những người bạn yêu quý. Truy cập iCards.com.vn ngay hôm nay để trải nghiệm và tạo nên những tấm thiệp độc đáo của riêng bạn!</p>
                        </div>
                    </div>
                    <button className="view-more-btn">XEM THÊM</button>
                </section>
            </main>
        </>
    );
};

export default Content;
