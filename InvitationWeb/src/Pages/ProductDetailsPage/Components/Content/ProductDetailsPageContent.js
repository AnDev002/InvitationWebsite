import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';

// Giả lập dữ liệu sản phẩm, trong thực tế sẽ fetch từ API
const allProductsData = {
    '1': { id: 1, title: 'Backdrop sinh nhật thú', price: 60000, description: 'Mô tả chi tiết cho Backdrop sinh nhật thú.', images: ["https://placehold.co/493x493/E9ECEF/333?text=Backdrop", "https://placehold.co/493x493/d1c4e9/311b92?text=Chi+tiết+1", "https://placehold.co/493x493/c8e6c9/1b5e20?text=Chi+tiết+2", "https://placehold.co/493x493/fff9c4/f57f17?text=Chi+tiết+3"] },
    '2': { id: 2, title: 'Vòng Hoa Nước', price: 85000, description: 'Mô tả cho Vòng Hoa Nước.', images: ['https://placehold.co/493x493/F5F5F5/333?text=Sản+Phẩm+2'] },
    // Thêm các sản phẩm khác ở đây
};

// ----- COMPONENT CHỨA TOÀN BỘ CSS -----
// Nhúng trực tiếp CSS để đảm bảo tính tương thích và dễ dàng sao chép.
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
      --color-price: #FF0000;
      --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.08);
      --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.1);
      --border-radius: 12px;
    }

    /* ----- CẤU TRÚC CHUNG ----- */
    .page-content-wrapper { margin: 0 auto; overflow-x: hidden; }
    .container { width: 100%; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 30px; }
    .section-container { padding: 80px 0; }
    .section-header { text-align: center; max-width: 800px; margin: 0 auto 40px auto; }
    .section-header h2 { font-size: 32px; color: var(--color-primary); text-transform: uppercase; font-weight: 700; }
    .section-header p { font-size: 16px; margin-top: 8px; }

    /* ----- PRODUCT DETAIL LAYOUT ----- */
    .product-detail-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: flex-start;
    }

    /* ----- Product Gallery ----- */
    .product-gallery .main-image img {
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        width: 100%;
    }
    .product-thumbnails {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-top: 16px;
    }
    .product-thumbnails .thumb-item img {
        border-radius: var(--border-radius);
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    .product-thumbnails .thumb-item.active img,
    .product-thumbnails .thumb-item:hover img {
        opacity: 1;
        border-color: var(--color-primary);
    }
    
    /* ----- Product Info ----- */
    .product-info h1 {
        font-size: 36px;
        font-weight: 700;
        color: var(--color-primary);
        text-transform: uppercase;
        line-height: 1.2;
    }
    .product-meta {
        display: flex;
        gap: 24px;
        color: var(--color-text-light);
        margin: 16px 0;
        font-size: 15px;
    }
    .product-price .price-label {
        font-size: 16px;
        font-weight: 500;
        color: var(--color-text-light);
    }
    .product-price .price-value {
        font-size: 28px;
        font-weight: 700;
        color: var(--color-price);
    }
    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 24px;
    }
    .quantity-selector label { font-weight: 600; }
    .quantity-input { display: flex; align-items: center; }
    .quantity-btn {
        width: 32px; height: 32px; border: 1px solid var(--color-border); background: white; cursor: pointer; font-size: 20px;
    }
    .quantity-display {
        width: 50px; height: 32px; border: 1px solid var(--color-border); border-left: none; border-right: none; text-align: center; font-size: 16px;
    }
    
    .product-actions {
        margin-top: 30px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    .btn { padding: 16px; font-size: 16px; font-weight: 700; border-radius: var(--border-radius); cursor: pointer; transition: all 0.3s ease; text-transform: uppercase;}
    .btn-primary { background-color: var(--color-primary); color: white; border: none; }
    .btn-secondary { background-color: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }
    .btn-secondary:hover { background-color: var(--color-primary); color: white; }

    /* ----- Product Tabs ----- */
    .product-tabs { border-bottom: 1px solid var(--color-border); display: flex; gap: 32px; margin-bottom: 32px; }
    .tab-button { background: none; border: none; padding: 16px 0; font-size: 18px; font-weight: 600; cursor: pointer; color: var(--color-text-light); position: relative; }
    .tab-button::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background-color: var(--color-primary); transform: scaleX(0); transition: transform 0.3s ease; }
    .tab-button.active { color: var(--color-primary); }
    .tab-button.active::after { transform: scaleX(1); }
    .tab-content { line-height: 1.7; color: var(--color-text-dark); }
    .tab-content ul { list-style-type: '✓ '; padding-left: 20px; }
    .tab-content li { margin-bottom: 8px; }

    /* ----- Related Products ----- */
    .related-products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
    .related-product-card .card-image-wrapper { background-color: var(--color-background-light); border-radius: var(--border-radius); overflow: hidden; margin-bottom: 12px; }
    .related-product-card h5 { font-size: 16px; font-weight: 600; text-transform: uppercase; }
    .related-product-card .price { font-size: 18px; font-weight: 700; color: var(--color-price); margin-top: 8px; }
    
    /* ----- RESPONSIVE ----- */
    @media (max-width: 992px) {
        .product-detail-layout { grid-template-columns: 1fr; }
        .related-products-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
        .section-header h2, .product-info h1 { font-size: 28px; }
        .product-actions { grid-template-columns: 1fr; }
        .related-products-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ----- CÁC COMPONENT CON -----
const SectionHeader = ({ title }) => (
  <div className="section-header">
    <h2>{title}</h2>
  </div>
);

const ProductCard = ({ id, title, price, imgSrc }) => {
  const navigate = useNavigate();
  const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // Điều hướng đến trang chi tiết sản phẩm khi nhấp vào
  const handleNavigate = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div className="related-product-card" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
      <div className="card-image-wrapper">
        <img src={imgSrc} alt={title} />
      </div>
      <h5>{title}</h5>
      <p className="price">{formatPrice(price)}</p>
    </div>
  );
};



// ----- COMPONENT CHÍNH CỦA TRANG -----
const Content = () => {
    const { productId } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('info');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const thumbnails = [
        "https://placehold.co/493x493/E9ECEF/333?text=Backdrop",
        "https://placehold.co/493x493/d1c4e9/311b92?text=Chi+tiết+1",
        "https://placehold.co/493x493/c8e6c9/1b5e20?text=Chi+tiết+2",
        "https://placehold.co/493x493/fff9c4/f57f17?text=Chi+tiết+3",
    ];

    // useEffect(() => {
    //     // Tìm sản phẩm dựa trên productId.
    //     // Trong một ứng dụng thực tế, bạn sẽ gọi API ở đây: fetch(`/api/products/${productId}`)
    //     const foundProduct = allProductsData[productId]; 
    //     if (foundProduct) {
    //         setProduct(foundProduct);
    //         setMainImage(foundProduct.images[0]);
    //     }
    //     // Có thể xử lý trường hợp không tìm thấy sản phẩm (ví dụ: redirect về trang 404)
    // }, [productId]);
    
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) return;
            try {
                setLoading(true);
                // Lấy chi tiết sản phẩm chính
                const res = await api.get(`/products/${productId}`);
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setMainImage(res.data.images[0]);
                }

                const relatedRes = await api.get(`/products?category=${res.data.category}&limit=4`);
                setRelatedProducts(relatedRes.data.data.filter(p => p._id !== productId));

            } catch (error) {
                console.error("Failed to fetch product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId]);

    if (loading) {
        return <div>Đang tải sản phẩm...</div>;
    }

    if (!product) {
        return <div>Không tìm thấy sản phẩm.</div>;
    }

    // const relatedProducts = [
    //     { id: 1, category: 'Phụ kiện trang trí', title: 'Backdrop Trang Trí Sinh Nhật', price: 60000, imgSrc: 'https://placehold.co/365x365/e0f7fa/006064?text=Backdrop' },
    //     { id: 2, category: 'Phụ kiện trang trí', title: 'Vòng Hoa Nước', price: 85000, imgSrc: 'https://placehold.co/365x365/e0f7fa/006064?text=Vòng+Hoa' },
    //     { id: 3, category: 'Phụ kiện trang trí', title: 'Bóng Bay Chữ Happy Birthday', price: 120000, imgSrc: 'https://placehold.co/365x365/e0f7fa/006064?text=Bóng+Bay' },
    //     { id: 4, category: 'Phụ kiện trang trí', title: 'Nến Thơm Trang Trí', price: 45000, imgSrc: 'https://placehold.co/365x365/e0f7fa/006064?text=Nến+Thơm' },
    // ];

    return (
        <main className="page-content-wrapper">
            <Styles />
            <div className="container">
                <section className="section-container">
                    <div className="product-detail-layout">
                        <div className="product-gallery">
                            <div className="main-image">
                                <img src={mainImage} alt={product.title} />
                            </div>
                            <div className="product-thumbnails">
                                {product.images && product.images.map((thumb, index) => (
                                    <div
                                        key={index}
                                        className={`thumb-item ${mainImage === thumb ? 'active' : ''}`}
                                        onClick={() => setMainImage(thumb)}
                                    >
                                        <img src={thumb} alt={`Thumbnail ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="product-info">
                            <h1>{product.title}</h1>
                            <div className="product-meta">
                                <span>Lượt xem: 13</span>
                                <span>Mã sản phẩm: 1234</span>
                            </div>
                            <div className="product-price">
                                <span className="price-label">Giá: </span>
                                <span className="price-value">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                            </div>
                            <div className="quantity-selector">
                                <label htmlFor="quantity">Số lượng</label>
                                <div className="quantity-input">
                                    <button className="quantity-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button className="quantity-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                                </div>
                            </div>
                            <div className="product-actions">
                                <button className="btn btn-secondary">Thêm vào giỏ hàng</button>
                                <button className="btn btn-primary">Đặt hàng</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-container">
                    <div className="product-tabs">
                        <button className={`tab-button ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                            Thông tin sản phẩm
                        </button>
                         <button className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>
                            Bình luận
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === 'info' ? (
                            <ul>
                                <li>Tiết Kiệm Thời Gian & Chi Phí: Không cần đến cửa hàng in ấn, không tốn thời gian di chuyển. Mọi thao tác đều thực hiện online, nhanh chóng và hiệu quả.</li>
                                <li>Sáng Tạo Không Giới Hạn: Tự do thể hiện ý tưởng, tạo ra những tấm thiệp "có một không hai" mà không bị giới hạn bởi các mẫu có sẵn.</li>
                                <li>Tiện Lợi Mọi Lúc Mọi Nơi: Chỉ cần có kết nối internet, bạn có thể thiết kế thiệp ở bất cứ đâu, bất cứ lúc nào.</li>
                                <li>Bảo Vệ Môi Trường: Sử dụng thiệp online góp phần giảm thiểu lượng rác thải giấy, hướng tới lối sống xanh.</li>
                                <li>Dễ Dàng Cập Nhật & Sửa Đổi: Có thể chỉnh sửa nội dung thiệp bất cứ lúc nào trước khi gửi đi.</li>
                            </ul>
                        ) : (
                            <p>Hiện chưa có bình luận nào cho sản phẩm này.</p>
                        )}
                    </div>
                </section>

                <section className="section-container">
                    <SectionHeader title="Sản phẩm liên quan" />
                    <div className="related-products-grid">
                        {relatedProducts.map(p => (
                            <ProductCard 
                                key={p._id} 
                                id={p._id} // Giữ lại id để xử lý việc nhấp chuột
                                title={p.title} // Sửa từ p.name thành p.title
                                price={p.price} 
                                imgSrc={p.images && p.images.length > 0 ? p.images[0] : ''} 
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Content;