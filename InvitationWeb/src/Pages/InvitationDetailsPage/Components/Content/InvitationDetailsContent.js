import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../../services/api';

// --- CUSTOM HOOK FOR RESPONSIVENESS (Không thay đổi) ---
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
};

// --- SVG ICONS (Không thay đổi) ---
const CardIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z" fill="#666666"/></svg>);
const PreviewIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#666666"/></svg>);
const RsvpIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM15 13H13V15H11V13H9V11H11V9H13V11H15V13Z" fill="#666666"/></svg>);
const SurveyIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 17H4V15H14V17ZM18 13H4V11H18V13ZM18 9H4V7H18V9ZM20 3H2V21H22V5L20 3ZM20 19H4V5H18L20 7V19Z" fill="#666666"/></svg>);
const LinkIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="#666666"/></svg>);
const HeartIcon = ({ isFavorite }) => (<svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? '#E53935' : 'white'} stroke={isFavorite ? 'none' : '#333'} strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"/></svg>);

// --- HELPER FUNCTION ---
const wrapText = (context, text, maxWidth) => {
    if (!text) return [];
    const paragraphs = text.split('\n');
    const allLines = [];
    paragraphs.forEach(paragraph => {
        if (paragraph === '') { allLines.push(''); return; }
        let words = paragraph.split(' ');
        let currentLine = words[0] || '';
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                allLines.push(currentLine);
                currentLine = word;
            }
        }
        allLines.push(currentLine);
    });
    return allLines;
};

// --- PREVIEW MODAL COMPONENT ---
const PreviewModal = ({ invitation, onClose }) => {
    const canvasRef = useRef(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const pages = invitation?.templateData?.pages || [];
    const currentPage = pages[currentPageIndex];

    // ✅ [SỬA LỖI] Lấy kích thước từ cấp cao nhất của `templateData`, không lấy từ `currentPage`
    const canvasWidth = invitation?.templateData?.width || 800;
    const canvasHeight = invitation?.templateData?.height || 800;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !currentPage) return;

        // ✅ [SỬA LỖI] Sử dụng kích thước đã lấy từ cấp cao để set cho canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        const renderAll = async () => {
            const { backgroundImage, items } = currentPage;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            if (backgroundImage) {
                const bgImg = new Image();
                bgImg.crossOrigin = "anonymous";
                try {
                    await new Promise((resolve, reject) => {
                        bgImg.onload = resolve; bgImg.onerror = reject;
                        bgImg.src = backgroundImage;
                    });
                    ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
                } catch (e) { console.error("Lỗi tải ảnh nền preview:", e); }
            }

            const sortedItems = [...items].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
            for (const item of sortedItems) {
                if (item.visible === false) continue;
                ctx.save();
                ctx.globalAlpha = item.opacity || 1;
                ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
                ctx.rotate((item.rotation || 0) * Math.PI / 180);

                if (item.type === 'text' && item.content) {
                    ctx.font = `${item.fontSize}px "${item.fontFamily}"`;
                    ctx.fillStyle = item.color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const lines = wrapText(ctx, item.content, item.width);
                    const lineHeight = item.fontSize * 1.3;
                    const totalHeight = lines.length * lineHeight;
                    lines.forEach((line, index) => {
                        ctx.fillText(line, 0, (index * lineHeight) - (totalHeight / 2) + (lineHeight / 2));
                    });
                } else if (item.type === 'image' && item.url) {
                    const itemImg = new Image();
                    itemImg.crossOrigin = "anonymous";
                    try {
                        await new Promise((resolve, reject) => {
                            itemImg.onload = resolve; itemImg.onerror = reject;
                            itemImg.src = item.url;
                        });
                        const filterString = `brightness(${item.brightness ?? 1}) contrast(${item.contrast ?? 1}) grayscale(${item.grayscale ?? 0})`;
                        ctx.filter = filterString;
                        ctx.drawImage(itemImg, -item.width / 2, -item.height / 2, item.width, item.height);
                    } catch (e) { console.error("Lỗi tải ảnh item preview:", e); }
                }
                ctx.restore();
            }
        };
        renderAll();
    }, [currentPage, canvasWidth, canvasHeight]); // ✅ Thêm canvasWidth/Height làm dependency

    const goToPrevPage = () => setCurrentPageIndex(prev => Math.max(0, prev - 1));
    const goToNextPage = () => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1));

    if (pages.length === 0) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={onClose}>
            <div style={{ position: 'relative', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                <canvas ref={canvasRef} style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain', border: '1px solid #ccc' }}/>
                {pages.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <button onClick={goToPrevPage} disabled={currentPageIndex === 0} style={{ padding: '8px 16px', cursor: 'pointer' }}>Trang trước</button>
                        <span>Trang {currentPageIndex + 1} / {pages.length}</span>
                        <button onClick={goToNextPage} disabled={currentPageIndex === pages.length - 1} style={{ padding: '8px 16px', cursor: 'pointer' }}>Trang sau</button>
                    </div>
                )}
                <button onClick={onClose} style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'black', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '16px' }}>X</button>
            </div>
        </div>
    );
};


// --- CÁC COMPONENT CON KHÁC ---

const ToolbarItem = ({ icon, label, onClick }) => (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 8px', borderRadius: '8px', transition: 'background-color 0.2s', minWidth: '80px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
        {icon}
        <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: '13px', color: 'rgba(102,102,102,1)', textAlign: 'center', lineHeight: '1.3', fontWeight: '500' }}>{label}</div>
    </div>
);

const ProductToolbar = ({ isMobile, items }) => {
    const toolbarStyle = { display: 'flex', flexDirection: isMobile ? 'row' : 'column', justifyContent: isMobile ? 'space-evenly' : 'start', alignItems: 'center', gap: '10px', padding: isMobile ? '10px 0' : '16px 8px', backgroundColor: 'rgba(248, 249, 250, 1)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', width: isMobile ? '100%' : 'auto', flexWrap: 'wrap' };
    return ( <div style={toolbarStyle}> {items.map((item, index) => (<ToolbarItem key={index} icon={item.icon} label={item.label} onClick={item.onClick} />))} </div> );
};

const Notification = ({ message, show }) => {
    const style = { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: 'white', padding: '10px 20px', borderRadius: '8px', zIndex: '1000', opacity: show ? 1 : 0, transition: 'opacity 0.5s ease-in-out', pointerEvents: show ? 'auto' : 'none' };
    return <div style={style}>{message}</div>;
};

const ProductDisplay = ({ imageUrl, title }) => (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '0', width: '100%' }}>
        <img src={imageUrl} alt={title} style={{ width: '100%', maxWidth: '850px', height: 'auto', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1007x849/E6E6E6/CCC?text=Image+Not+Found'; }} />
    </div>
);

const CustomizationPanel = ({ title, description, onEdit, isTablet }) => {
    const features = ["Tùy chỉnh mọi thứ.", "Thêm liên kết đến trang web.", "Gửi qua email, tin nhắn.", "Theo dõi phản hồi.", "Quản lý danh sách khách mời."];
    const panelStyle = { display: "flex", flexDirection: "column", gap: "30px", width: isTablet ? "100%" : "365px", maxWidth: '600px' };
    return (
        <div style={panelStyle}>
            <div>
                <h1 style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "28px", color: "rgba(39,84,138,1)", lineHeight: "1.3", textTransform: "uppercase", fontWeight: "700" }}>{title}</h1>
                <p style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "18px", color: "rgba(102,102,102,1)", fontWeight: '500' }}>{description}</p>
            </div>
            <p>Chào mừng khách mời và chúc phúc cho cặp đôi với mẫu thiệp cưới trực tuyến lấy cảm hứng từ thiên nhiên.</p>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {features.map((feature, index) => (<li key={index} style={{ display: 'flex', alignItems: 'start', gap: '10px' }}><span style={{ color: 'rgba(39,84,138,1)', paddingTop: '3px' }}>✓</span><span>{feature}</span></li>))}
            </ul>
            <button onClick={onEdit} style={{ backgroundColor: "rgba(39,84,138,1)", color: "white", width: "100%", padding: '15px 0', border: "none", borderRadius: '8px', fontSize: "18px", textTransform: "uppercase", fontWeight: "600", cursor: 'pointer' }}>Chỉnh sửa thiệp</button>
        </div>
    );
};

const RecommendationCard = ({ id, imgSrc, title, screenWidth }) => {
    let flexBasis = '21%';
    if (screenWidth <= 1024) flexBasis = '45%';
    if (screenWidth <= 768) flexBasis = '90%';
    const cardStyle = { flex: `1 0 ${flexBasis}`, margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' };
    return (
        <Link to={`/invitation/${id}`} style={cardStyle}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <img src={imgSrc} alt={title} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}><HeartIcon isFavorite={false} /></div>
            </div>
            <h3>{title}</h3>
        </Link>
    );
};

const Recommendations = ({ recommendedItems, screenWidth }) => {
    if (!recommendedItems || recommendedItems.length === 0) return null;
    return (
        <section style={{ width: '100%', maxWidth: '1440px', marginTop: '60px', textAlign: 'center' }}>
            <h2>BẠN CŨNG CÓ THỂ THÍCH</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {recommendedItems.map(item => (<RecommendationCard key={item._id} id={item._id} imgSrc={item.imgSrc} title={item.title} screenWidth={screenWidth} />))}
            </div>
        </section>
    );
};

// --- MAIN COMPONENT ---
const Content = () => {
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const { width } = useWindowSize();
    const isTablet = width <= 1024;
    const isMobile = width <= 768;

    useEffect(() => {
        const loadInvitationData = async () => {
            if (!invitationId) {
                setLoading(false); 
                return;
            }
            try {
                setLoading(true);
                window.scrollTo(0, 0); 
                const [templateRes, recommendationsRes] = await Promise.all([
                    api.get(`/invitation-templates/${invitationId}`),
                    api.get('/invitation-templates?limit=8')
                ]);
                setInvitation(templateRes.data.data);
                setRecommendations(recommendationsRes.data.data.filter(t => t._id !== invitationId));
            } catch (error) {
                console.error("Failed to load invitation data:", error);
                setInvitation(null);
            } finally {
                setLoading(false);
            }
        };
        loadInvitationData();
    }, [invitationId]);
    
    const showNotificationMessage = (message) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    };
    
    const handlePreview = () => {
        if (!invitation) return;
        setIsPreviewOpen(true);
    };

    const handleShare = async () => {
        if (!invitation) return;
        const shareUrl = `${window.location.origin}/invitation/${invitationId}`;
        const shareData = { title: invitation.title, text: `Mời bạn xem mẫu thiệp "${invitation.title}"`, url: shareUrl };
        if (navigator.share) {
            await navigator.share(shareData).catch(err => console.log('Lỗi chia sẻ:', err));
        } else {
            await navigator.clipboard.writeText(shareUrl);
            showNotificationMessage('Đã sao chép liên kết!');
        }
    };

    const handleEditInvitation = () => {
        navigate(`/canvas/template/${invitationId}`);
    };
    
    const toolbarItems = [
        { icon: <CardIcon />, label: 'Thẻ', onClick: () => {} },
        { icon: <PreviewIcon />, label: 'Xem trước', onClick: handlePreview },
        { icon: <RsvpIcon />, label: 'Đăng ký', onClick: () => {} },
        { icon: <SurveyIcon />, label: 'Khảo sát', onClick: () => {} },
        { icon: <LinkIcon />, label: 'Chia sẻ', onClick: handleShare },
    ];

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải dữ liệu thiệp mời...</div>;
    if (!invitation) return <div style={{textAlign: 'center', padding: '50px'}}>Không tìm thấy thiệp mời.</div>;

    const pageStyle = { backgroundColor: "white", width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '20px 15px' : '40px 50px', boxSizing: 'border-box' };
    const mainContentStyle = { display: 'flex', flexDirection: isTablet ? 'column' : 'row', justifyContent: 'center', alignItems: isTablet ? 'center' : 'start', gap: '40px', width: '100%', maxWidth: '1440px' };

    return (
        <div style={pageStyle}>
            <main style={mainContentStyle}>
                <ProductToolbar isMobile={isMobile} items={toolbarItems} />
                <ProductDisplay imageUrl={invitation.imgSrc} title={invitation.title} />
                <CustomizationPanel title={invitation.title} description={invitation.description || ""} onEdit={handleEditInvitation} isTablet={isTablet} />
            </main>
            <Recommendations recommendedItems={recommendations} screenWidth={width} />
            
            {isPreviewOpen && (
                <PreviewModal invitation={invitation} onClose={() => setIsPreviewOpen(false)} />
            )}
            <Notification message={notification.message} show={notification.show} />
        </div>
    );
};

export default Content;