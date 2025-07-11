import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Giả sử bạn có file api service
import api from "../../../../services/api";

// === COMPONENT CSS (Toàn bộ style đã được làm mới) ===
const ComponentCSS = () => (
    <style>{`
        /* ----- BIẾN MÀU VÀ FONT CHUNG ----- */
        :root {
            --color-primary: #27548A;
            --color-text-dark: #000000;
            --color-text-light: #666666;
            --color-border: #000000;
            --color-background: #FFFFFF;
            --color-placeholder: #E6E6E6;
            --font-main: 'SVN-Gilroy', sans-serif;
        }

        /* ----- CÀI ĐẶT CƠ BẢN ----- */
        .products-page-container * {
            box-sizing: border-box;
            font-family: var(--font-main);
        }
        .products-page-container {
            background-color: var(--color-background);
            color: var(--color-text-dark);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 120px;
            padding-bottom: 120px;
        }
        .products-page-container .container {
            width: 100%;
            max-width: 1520px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        /* ----- HERO SECTION ----- */
        .products-hero {
            width: 100%;
            height: 550px; /* Chiều cao tùy chỉnh cho hợp lý */
            background-image: url('https://placehold.co/400x400/e0e0e0/757575?text=Image');
            background-size: cover;
            background-position: center;
        }

        /* ----- BỘ LỌC DANH MỤC ----- */
        .products-category-filters {
            width: 100%; /* Đảm bảo container của nút chiếm toàn bộ chiều rộng */
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start; /* Căn các nút về bên trái */
            gap: 20px;
        }
        .category-filter-btn {
            height: 40px;
            padding: 0 25px;
            border: 0.5px solid var(--color-border);
            background-color: var(--color-background);
            color: var(--color-text-dark);
            font-size: 16px;
            font-weight: 500;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        .category-filter-btn:hover {
            background-color: #f0f0f0;
        }
        .category-filter-btn.active {
            background-color: var(--color-primary);
            color: white;
            border-color: var(--color-primary);
        }

        /* ----- LƯỚI SẢN PHẨM ----- */
        .products-grid-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
        }
        .products-grid {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 60px 20px; /* 60px khoảng cách dọc, 20px khoảng cách ngang */
        }

        /* ----- THẺ SẢN PHẨM ----- */
        .product-card-new {
            display: flex;
            flex-direction: column;
            gap: 20px;
            cursor: pointer;
        }
        .product-card-new .image-placeholder {
            width: 100%;
            padding-top: 100%; /* Tạo tỷ lệ 1:1 */
            background-color: var(--color-placeholder);
            position: relative;
            overflow: hidden;
        }
        .product-card-new .image-placeholder img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        .product-card-new:hover .image-placeholder img {
            transform: scale(1.05);
        }
        .product-card-new .info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            text-align: center;
        }
        .product-card-new .title {
            font-size: 16px;
            font-weight: 600;
            line-height: 1.3;
            color: var(--color-primary);
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }
        .product-card-new .icon {
            width: 20px;
            height: 17px;
        }

        /* ----- NÚT XEM THÊM ----- */
        .load-more-btn {
            height: 40px;
            padding: 0 40px;
            border: 0.5px solid var(--color-border);
            font-size: 16px;
            font-weight: 500;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        .load-more-btn:hover {
            background-color: var(--color-primary);
            color: white;
            border-color: var(--color-primary);
        }
        
        /* ----- THÔNG BÁO ----- */
        .grid-message {
            grid-column: 1 / -1;
            padding: 80px 20px;
            text-align: center;
            font-size: 18px;
            color: var(--color-text-light);
        }

        /* ----- RESPONSIVE ----- */
        @media (max-width: 1200px) {
            .products-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        @media (max-width: 768px) {
            .products-page-container { gap: 60px; padding-bottom: 60px; }
            .products-hero { height: 400px; }
            .products-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 40px 20px;
            }
        }
        @media (max-width: 480px) {
            .products-grid {
                grid-template-columns: 1fr;
                gap: 40px;
            }
        }
    `}</style>
);

// ----- COMPONENT CON: THẺ SẢN PHẨM -----
const ProductCard = ({ id, title, imgSrc }) => {
    const navigate = useNavigate();
    const handleNavigate = () => navigate(`/product/${id}`);

    return (
        <div className="product-card-new" onClick={handleNavigate}>
            <div className="image-placeholder">
                <img src={imgSrc || 'https://placehold.co/365x365/e6e6e6/999?text=Image'} alt={title} />
            </div>
            <div className="info">
                <div className="title">{title}</div>
                <svg className="icon" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.333 3.41667L10.433 9.31667C10.1663 9.58333 9.83301 9.58333 9.56634 9.31667L6.99967 6.75" stroke="#DDA853" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 16C14.1421 16 17.5 12.6421 17.5 8.5C17.5 4.35786 14.1421 1 10 1C5.85786 1 2.5 4.35786 2.5 8.5C2.5 12.6421 5.85786 16 10 16Z" stroke="#DDA853" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
};

// ----- COMPONENT CHÍNH: TRANG SẢN PHẨM -----
const ShopPage = () => {
    const categories = ['Shop - Service', 'Phụ kiện trang trí', 'Quà tặng', 'Tổ chức sự kiện'];
    const [activeCategory, setActiveCategory] = useState('Phụ kiện trang trí');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // --- REAL API CALL ---
                const response = await api.get(`/products?category=${encodeURIComponent(activeCategory)}`);
                setProducts(response.data?.data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                setProducts([]); // Set rỗng nếu có lỗi
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategory]);

    return (
        <div className="products-page-container">
            <ComponentCSS />
            <div className="products-hero"></div>

            <div className="container">
                <div className="products-category-filters">
                    {categories.map(item => (
                        <button
                            key={item}
                            className={`category-filter-btn ${activeCategory === item ? 'active' : ''}`}
                            onClick={() => setActiveCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="products-grid-wrapper">
                    <div className="products-grid">
                        {loading ? (
                            <div className="grid-message">Đang tải sản phẩm...</div>
                        ) : products.length > 0 ? (
                            products.map((item) => (
                                <ProductCard
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

                    {!loading && products.length > 0 && (
                        <button className="load-more-btn">Xem thêm</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
