import { ReactNode, useEffect } from 'react';
import { useLocation } from '@remix-run/react';

const NavigationScroll = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return children || null;
};

export default NavigationScroll;
