import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/shipping', label: 'Shipping & Policies' },
];

export const MobileMenu: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            className="drawer-panel left-0 flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <Link to="/" onClick={close} className="flex items-center gap-2">
                {siteAssetLogo && (
                  <img
                    src={siteAssetLogo}
                    alt="HEDDIEKITCHEN"
                    className="h-10 w-10 rounded-full object-contain"
                  />
                )}
                <span className="text-sm font-black uppercase tracking-tight text-gray-900">
                  HEDDIEKITCHEN
                </span>
              </Link>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-0.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      onClick={close}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-gray-800 transition hover:bg-primary/5 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-gray-100 px-5 py-4">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={close}
                    className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-primary hover:bg-primary/5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={close}
                    className="flex-1 rounded-xl border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
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
