// InvitationPage.js

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import './InvitationContent.css';

// [ĐÃ SỬA] - Cấu trúc lại InvitationCard cho giống OccasionCard
const InvitationCard = ({ id, title, imgSrc }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        // Chuyển hướng đến trang chi tiết của mẫu thiệp
        // URL này có thể cần được điều chỉnh để khớp với router cho trang chi tiết
        navigate(`/invitation/${id}`); 
    };

    return (
        // Sử dụng các class name mới để áp dụng style giống trang chủ
        <div className="invitation-card-item" onClick={handleClick}>
            <div className="invitation-card-image-wrapper">
                <img src={imgSrc} alt={title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x500/EAEAEA/CCC?text=Image'; }}/>
            </div>
            {/* Chỉ hiển thị title chính của thiệp */}
            <p className="invitation-card-title">{title}</p>
        </div>
    );
};

// --- COMPONENT CHÍNH CỦA TRANG ---
const InvitationPage = () => {
    const { categoryName, typeName } = useParams();
    const [allTemplates, setAllTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    const slugToTitle = (slug) => {
        if (!slug) return '';
        return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    useEffect(() => {
        const fetchAllTemplates = async () => {
            setLoading(true);
            try {
                const response = await api.get('/invitation-templates?limit=1000');
                setAllTemplates(response.data.data || []);
            } catch (error) {
                console.error("Lỗi khi tải toàn bộ mẫu thiệp:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTemplates();
    }, []);

    const filteredTemplates = useMemo(() => {
        if (!categoryName) {
            return allTemplates;
        }
        let filteredByCategory = allTemplates.filter(template => 
            template.category.replace(/\s+/g, '-').toLowerCase() === categoryName
        );
        if (typeName) {
            return filteredByCategory.filter(template => 
                template.type.replace(/\s+/g, '-').toLowerCase() === typeName
            );
        }
        return filteredByCategory;
    }, [allTemplates, categoryName, typeName]);

    const heroData = useMemo(() => {
        const defaultHero = {
            heroImage: 'https://pub-f720e3221ef5464a93d19bbdae2cfb86.r2.dev/herob2.png',
            title: 'Tất Cả Mẫu Thiệp',
            description: 'Duyệt qua bộ sưu tập thiệp đa dạng, phù hợp cho mọi sự kiện và phong cách.',
        };
        if (typeName) {
            return {
                ...defaultHero,
                title: `${slugToTitle(categoryName)} - ${slugToTitle(typeName)}`,
                description: `Khám phá các mẫu thiệp ${slugToTitle(typeName).toLowerCase()} tinh tế và độc đáo.`,
            };
        }
        if (categoryName) {
            return {
                ...defaultHero,
                title: slugToTitle(categoryName),
                description: `Tất cả các thiết kế dành cho ${slugToTitle(categoryName).toLowerCase()}.`,
            };
        }
        return defaultHero;
    }, [categoryName, typeName]);

    return (
        <main className="invitation-page">
            <section className="hero-section-invitations">
                <div className="hero-bg" style={{ backgroundImage: `url(${heroData.heroImage})` }}></div>
                <div className="hero-content">
                    <h1>{heroData.title}</h1>
                    <p>{heroData.description}</p>
                </div>
            </section>
            
            <div className="container">
                <div className="section-container">
                    <div className="invitation-grid">
                        {loading ? (
                            <div className="grid-message">Đang tải mẫu thiệp...</div>
                        ) : filteredTemplates.length > 0 ? (
                            filteredTemplates.map((item) => (
                                // [ĐÃ SỬA] - Truyền đúng props vào component InvitationCard mới
                                <InvitationCard
                                    key={item._id}
                                    id={item._id}
                                    title={item.title}
                                    imgSrc={item.imgSrc}
                                />
                            ))
                        ) : (
                            <div className="grid-message">Chưa có sản phẩm nào trong danh mục này.</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default InvitationPage;