import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * New navigations scroll to top; browser back/forward restore prior scroll.
 */
const ScrollRestoration: React.FC = () => {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef<Map<string, number>>(new Map());
  const prevKey = useRef(`${pathname}${search}`);

  useEffect(() => {
    const key = `${pathname}${search}`;

    // Save scroll for the page we're leaving
    positions.current.set(prevKey.current, window.scrollY);
    prevKey.current = key;

    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    if (navigationType === 'POP') {
      const y = positions.current.get(key) ?? 0;
      // Restore after paint so layout is ready
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash, navigationType]);

  return null;
};

export default ScrollRestoration;
