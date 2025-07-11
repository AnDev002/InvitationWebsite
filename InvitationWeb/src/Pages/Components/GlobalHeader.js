// src/Pages/Components/GlobalHeader.js

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobalHeader.css'; // Đảm bảo bạn có file CSS tương ứng
import { useAuth } from '../../Context/AuthContext';
import api from "../../services/api";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineRight } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

// --- CÁC COMPONENT CON ---

const UserMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        setIsOpen(false);
        navigate('/');
    }

    return (
        <div className="user-menu" ref={menuRef}>
            <button className="avatar-button" onClick={() => setIsOpen(!isOpen)}>
                <img src={user.avatar || 'https://placehold.co/40x40/CDD7E5/333?text=A'} alt="User Avatar" />
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">
                        <p className="username">{user.username}</p>
                        <p className="email">{user.email}</p>
                    </div>
                    <button className="dropdown-item" onClick={() => handleNavigate('/account-settings')}>Account Settings</button>
                    <button className="dropdown-item" onClick={() => handleNavigate('/invitation-management')}>Invitation Management</button>
                    <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                </div>
            )}
        </div>
    );
};

// [ĐÃ CẬP NHẬT] - MegaMenuPane để làm cho title có thể click
const MegaMenuPane = ({ activeMenuData, onMouseLeave, setActiveMenu }) => {
    const navigate = useNavigate();
    
    if (!activeMenuData || !activeMenuData.columns || activeMenuData.columns.length === 0) return null;

    const handleLinkClick = (e, path) => {
        e.preventDefault();
        navigate(path);
        setActiveMenu(null); // Đóng menu sau khi click
    };

    return (
        <div className="mega-menu-pane" onMouseLeave={() => setActiveMenu(null)}>
            <div className="container">
                <div className="mega-menu-content">
                    {activeMenuData.columns.map((column, index) => (
                        <div key={index} className="mega-menu-column">
                            {/* Bọc thẻ h3 trong thẻ a */}
                            <a href={column.path} onClick={(e) => handleLinkClick(e, column.path)} className="mega-menu-title-link">
                                <h3 className="mega-menu-title">{column.title}</h3>
                            </a>
                            <ul className="mega-menu-links">
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MainHeader = React.forwardRef(({ onMenuToggle, isSticky, isVisible, activeMenu, setActiveMenu, menuData, mainNavItems }, ref) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const menuTimeoutRef = useRef(null);

    const handleNavigate = (path) => {
        navigate(path);
        setActiveMenu(null);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search/${searchQuery.trim()}`);
            setSearchQuery('');
        }
    };

    const handleMouseEnter = (item) => {
        clearTimeout(menuTimeoutRef.current);
        if (menuData[item] && menuData[item].columns.length > 0) {
            setActiveMenu(item);
        } else {
            setActiveMenu(null);
        }
    };

    const handleMouseLeave = () => {
        menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
    };

    const handleClick = (item) => {
        const path = menuData[item]?.path || '#';
        navigate(path);
        setActiveMenu(null);
    };
    
    return (
        <div ref={ref} className={`main-header-wrapper ${isSticky ? 'is-sticky' : ''} ${isVisible ? '' : 'is-hidden'}`}>
            <div className="main-header" onMouseLeave={handleMouseLeave}>
                <div className="container">
                    <div className="header-top">
                        <div className="header-section left">
                            <div className="logo" onClick={() => handleNavigate("/")}>
                                <img src='https://pub-f720e3221ef5464a93d19bbdae2cfb86.r2.dev/logo%20(1).png' alt="Logo" />
                            </div>
                            <nav className="header-nav-main">
                                <button className="nav-item" onClick={() => handleNavigate("/professional")}>Chuyên nghiệp</button>
                            </nav>
                        </div>
                        <div className="header-section right">
                            <form className="search-bar-wrapper" onSubmit={handleSearchSubmit}>
                                <FiSearch className="search-icon" />
                                <input type="text" className="search-input" placeholder="Tìm kiếm sản phẩm, mẫu thiệp..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </form>
                            {isAuthenticated ? (
                                <UserMenu user={user} onLogout={logout} />
                            ) : (
                                <div className="auth-actions">
                                    <button className="auth-btn" onClick={() => handleNavigate("/sign-in")}>Đăng nhập</button>
                                    <span className="separator"></span>
                                    <button className="auth-btn" onClick={() => handleNavigate("/sign-up")}>Đăng ký</button>
                                </div>
                            )}
                        </div>
                        <button className="hamburger-menu mobile-only" onClick={onMenuToggle} aria-label="Mở menu">
                            <HiOutlineMenuAlt3 size={28} />
                        </button>
                    </div>
                    <nav className="header-bottom desktop-only">
                        {mainNavItems.map(item => (
                            <button key={item} className={`nav-item-bottom ${activeMenu === item ? 'active' : ''}`} onClick={() => handleClick(item)} onMouseEnter={() => handleMouseEnter(item)}>
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>
                <MegaMenuPane activeMenuData={activeMenu ? menuData[activeMenu] : null} setActiveMenu={setActiveMenu} />
            </div>
        </div>
    );
});

// [ĐÃ CẬP NHẬT] - MobileNav để làm cho title có thể click
const MobileNav = ({ isOpen, onMenuToggle, menuData, mainNavItems }) => {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const navigate = useNavigate();

    const handleNav = (path) => {
        onMenuToggle();
        navigate(path);
    };

    const toggleSubMenu = (menuKey) => {
        setOpenSubMenu(openSubMenu === menuKey ? null : menuKey);
    };
    
    useEffect(() => {
        if (!isOpen) {
            setOpenSubMenu(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="mobile-nav-container">
            <div className="mobile-nav-header">
                <button onClick={onMenuToggle} className="mobile-nav-close" aria-label="Đóng menu">
                    <AiOutlineClose size={24} />
                </button>
            </div>
            <div className="mobile-nav-content">
                {mainNavItems.map(item => {
                    const menuNode = menuData[item];
                    const hasSubMenu = menuNode?.columns?.length > 0;
                    return (
                        <div key={item} className="mobile-nav-group">
                            <button className="mobile-nav-item" onClick={() => hasSubMenu ? toggleSubMenu(item) : handleNav(menuNode?.path || '#')}>
                                <span>{item}</span>
                                {hasSubMenu && <AiOutlineRight className={`arrow-icon ${openSubMenu === item ? 'open' : ''}`} />}
                            </button>
                            {hasSubMenu && openSubMenu === item && (
                                <div className="mobile-submenu">
                                    {menuNode.columns.map(col => (
                                        <div key={col.title} className="mobile-submenu-column">
                                            {/* Chuyển strong thành button */}
                                            <button className="mobile-submenu-title" onClick={() => handleNav(col.path)}>
                                                {col.title}
                                            </button>
                                            {col.links.map(link => (
                                                <button key={link.text} className="mobile-submenu-item" onClick={() => handleNav(link.href)}>
                                                    {link.text}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- COMPONENT HEADER CHÍNH ---
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [headerHeight, setHeaderHeight] = useState(0);

    const [menuData, setMenuData] = useState({});
    const [mainNavItems, setMainNavItems] = useState([]);
    
    const mainHeaderRef = useRef(null);
    const lastScrollY = useRef(0);

    // [ĐÃ CẬP NHẬT] - Logic build menu để thêm `path` cho title
    useEffect(() => {
        const fetchAndBuildMenu = async () => {
            try {
                const response = await api.get('/invitation-templates');
                const templates = response.data?.data || [];
                
                const primaryNavItems = ["Thiệp Mời", "Thiệp Chúc Mừng", "Thiệp Cảm Ơn"];
                const allUniqueCategories = [...new Set(templates.map(t => t.category).filter(Boolean))];
                const primaryNavItemsLower = primaryNavItems.map(item => item.toLowerCase());
                const categoriesInOtherMenu = allUniqueCategories.filter(
                    cat => !primaryNavItemsLower.includes(cat.toLowerCase())
                );
                
                const newMenuData = {};

                primaryNavItems.forEach(item => {
                    const foundCategory = templates.find(t => t.category.toLowerCase() === item.toLowerCase());
                    const categorySlug = (foundCategory?.category || item).replace(/\s+/g, '-').toLowerCase();
                    newMenuData[item] = {
                        path: `/invitations/category/${categorySlug}`,
                        columns: []
                    };
                });

                const otherMenuColumns = categoriesInOtherMenu.map(categoryName => {
                    const typesForCategory = [...new Set(
                        templates
                            .filter(t => t.category === categoryName && t.type)
                            .map(t => t.type)
                    )];

                    const categoryPath = `/invitations/category/${categoryName.replace(/\s+/g, '-').toLowerCase()}`;

                    return {
                        title: categoryName,
                        path: categoryPath, // Thêm path cho category title
                        links: typesForCategory.map(type => ({
                            text: type,
                            href: `${categoryPath}/${type.replace(/\s+/g, '-').toLowerCase()}`
                        }))
                    };
                }).filter(column => column.links.length > 0);

                newMenuData["Thiệp Khác"] = {
                    path: '/invitations',
                    columns: otherMenuColumns
                };

                newMenuData["Cửa hàng - Dịch vụ"] = { path: "/shop", columns: [] };

                const finalMainNavItems = [...primaryNavItems, "Thiệp Khác", "Cửa hàng - Dịch vụ"];
                setMenuData(newMenuData);
                setMainNavItems(finalMainNavItems);

            } catch (error) {
                console.error("Lỗi khi tải và xây dựng menu:", error);
            }
        };

        fetchAndBuildMenu();
    }, []);

    // Effect xử lý scroll
    useEffect(() => {
        const mainHeader = mainHeaderRef.current;
        if (mainHeader) setHeaderHeight(mainHeader.offsetHeight);
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (mainHeaderRef.current) setIsSticky(currentScrollY > mainHeaderRef.current.offsetHeight);
            setIsHeaderVisible(currentScrollY < lastScrollY.current || currentScrollY < 100);
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect tự động đóng menu mobile khi chuyển sang màn hình lớn
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    return (
        <header className="header-container">
            {isSticky && <div style={{ height: `${headerHeight}px` }} />}
            <div className="announcement-bar">
                <p>MỚI! Đăng ký gói Paperless Pro và tiết kiệm 10% với mã PRO10.&nbsp;
                    <a href="#pro-details" className="learn-more-link">Tìm hiểu thêm.</a>
                </p>
            </div>
            <MainHeader
                ref={mainHeaderRef}
                onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
                isSticky={isSticky}
                isVisible={isHeaderVisible}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                menuData={menuData}
                mainNavItems={mainNavItems}
            />
            <MobileNav 
                isOpen={isMenuOpen} 
                onMenuToggle={() => setIsMenuOpen(false)}
                menuData={menuData}
                mainNavItems={mainNavItems}
            />
        </header>
    );
};

export default Header;