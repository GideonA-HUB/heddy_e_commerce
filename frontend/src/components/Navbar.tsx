import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

const WHATSAPP_URL = 'https://wa.me/2349035234365';

const desktopLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/meal-plans', label: 'Meal Plans' },
  { to: '/catering', label: 'Catering' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Sticky luxury header:
 * Left: WhatsApp + hamburger (mobile)
 * Center: Logo
 * Right: search + bag badge
 */
export const Navbar: React.FC = () => {
  const [shouldRotate, setShouldRotate] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { user, logout } = useAuthStore();
  const {
    siteAssetLogo,
    toggleMobileMenu,
    openCartDrawer,
    isMobileMenuOpen,
  } = useUIStore();

  const itemCount = cart?.item_count || 0;

  useEffect(() => {
    setShouldRotate(true);
    const timer = setTimeout(() => setShouldRotate(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/menu?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between md:h-[4.5rem]">
          {/* Left */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              className="rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-white/90 transition hover:bg-white/10 hover:text-white sm:inline-flex"
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle size={18} />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>

          {/* Center logo */}
          <Link
            to="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 sm:gap-3"
          >
            {siteAssetLogo && (
              <motion.img
                src={siteAssetLogo}
                alt="HEDDIEKITCHEN logo"
                className="h-10 w-10 object-contain rounded-full bg-white/5 p-1 md:h-14 md:w-14 md:p-1.5"
                initial={{ rotate: 0 }}
                animate={shouldRotate ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            )}
            <span className="font-black text-base tracking-tight uppercase sm:text-lg md:text-xl">
              HEDDIEKITCHEN
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-5 lg:flex lg:mr-3">
              {desktopLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-white/85 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-lg p-2 transition hover:bg-white/10"
              aria-label="Search menu"
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              onClick={openCartDrawer}
              className="relative rounded-lg p-2 transition hover:bg-white/10"
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <motion.span
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="ml-1 hidden items-center gap-2 md:flex">
                <Link
                  to="/profile"
                  className="max-w-[7rem] truncate text-sm font-medium text-white/90 hover:text-white"
                >
                  {user.username || user.email}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold hover:bg-primary-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-1 hidden rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold hover:bg-white hover:text-black md:inline-block"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search bar slide-down */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="border-t border-white/10 bg-secondary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form
              onSubmit={handleSearch}
              className="container mx-auto flex gap-2 px-4 py-3 sm:px-6 lg:px-8"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes…"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <button type="submit" className="btn-primary py-2.5 text-sm">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
