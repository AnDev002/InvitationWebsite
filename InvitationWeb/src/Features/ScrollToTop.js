import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component này sẽ tự động cuộn cửa sổ lên đầu trang (0, 0)
 * mỗi khi đường dẫn (pathname) thay đổi.
 */
function ScrollToTop() {
  // Lấy ra pathname từ location object
  const { pathname } = useLocation();

  // Sử dụng useEffect để thực hiện side effect khi pathname thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Mảng phụ thuộc chứa pathname, effect sẽ chạy lại khi nó thay đổi

  // Component này không cần render bất cứ thứ gì ra giao diện
  return null;
}

export default ScrollToTop;