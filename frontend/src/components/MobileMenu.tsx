import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/menu?filter=featured', label: 'Featured' },
  { to: '/menu?sort=-created_at', label: 'New Arrivals' },
  { to: '/menu?filter=bestsellers', label: 'Best Sellers' },
  { to: '/meal-plans', label: 'Meal Plans' },
  { to: '/catering', label: 'Catering' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/training', label: 'Training' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/shipping', label: 'Shipping & Policies' },
];

/**
 * Dark slide-over nav drawer (CasseoHair structure, HeddieKitchen brand).
 */
export const MobileMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useUIStore((s) => s.isMobileMenuOpen);
  const close = useUIStore((s) => s.closeMobileMenu);
  const siteAssetLogo = useUIStore((s) => s.siteAssetLogo);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const isActive = (to: string) => {
    const path = to.split('?')[0];
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            className="fixed left-0 top-0 z-[70] flex h-full w-full max-w-[20rem] flex-col bg-[#141414] text-white shadow-2xl sm:max-w-sm"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Link to="/" onClick={close} className="flex items-center">
                {siteAssetLogo ? (
                  <img
                    src={siteAssetLogo}
                    alt="HEDDIEKITCHEN"
                    className="h-11 w-11 rounded-xl bg-white object-contain p-0.5"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[10px] font-black text-primary">
                    HK
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-4">
              <ul className="space-y-0.5">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        onClick={close}
                        className={`block rounded-lg px-4 py-3 text-[15px] transition ${
                          active
                            ? 'font-semibold text-white'
                            : 'font-normal text-white/80 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-white/10 px-5 py-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85">
                <span aria-hidden>🇳🇬</span>
                NG NGN
              </div>

              {user ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={close}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/5"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={close}
                    className="flex-1 rounded-xl border border-white/25 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={close}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
