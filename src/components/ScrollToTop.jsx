import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Đảm bảo mỗi khi người dùng bấm chuyển trang,
 * màn hình tự động cuộn mượt mà lên vị trí cao nhất (Top of page).
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Tức thì để người dùng không bị chóng mặt khi đổi route
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
