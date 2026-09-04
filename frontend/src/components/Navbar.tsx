import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MessageCircle, Search, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

const WHATSAPP_URL = 'https://wa.me/2349035234365';

/**
 * CasseoHair-structure header (restaurant brand):
 * Top bar: Contact Us (WhatsApp) | NG NGN
 * Main: hamburger (all links) | centered logo only | search + profile + cart
 */
export const Navbar: React.FC = () => {
  const [shouldRotate, setShouldRotate] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { user } = useAuthStore();
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/menu?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      {/* Top utility bar — CasseoHair pattern */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 transition hover:text-emerald-300 sm:text-sm"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle size={14} className="text-emerald-500" />
            Contact Us
          </a>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/85 sm:text-xs">
            <span aria-hidden>🇳🇬</span>
            NG NGN
          </div>
        </div>
      </div>

      {/* Main bar: hamburger | logo | search + profile + cart */}
      <div className="border-b border-white/10">
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:h-[4.25rem] lg:px-8">
          {/* Left — hamburger (desktop + mobile) */}
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-white/10"
            onClick={toggleMobileMenu}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={24} strokeWidth={1.75} />
          </button>

          {/* Center — logo image only (no wordmark) */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="HEDDIEKITCHEN home"
          >
            {siteAssetLogo ? (
              <motion.img
                src={siteAssetLogo}
                alt="HEDDIEKITCHEN"
                className="h-12 w-12 rounded-2xl bg-white object-contain p-1 shadow-sm sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                initial={{ rotate: 0 }}
                animate={shouldRotate ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[10px] font-black uppercase tracking-tight text-primary sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                HK
              </span>
            )}
          </Link>

          {/* Right — search, profile/login, cart */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-lg p-2 transition hover:bg-white/10"
              aria-label="Search menu"
            >
              <Search size={22} strokeWidth={1.75} />
            </button>

            <Link
              to={user ? '/profile' : '/login'}
              className="rounded-lg p-2 transition hover:bg-white/10"
              aria-label={user ? 'Your profile' : 'Login'}
            >
              <User size={22} strokeWidth={1.75} />
            </Link>

            <button
              type="button"
              onClick={openCartDrawer}
              className="relative rounded-lg p-2 transition hover:bg-white/10"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} strokeWidth={1.75} />
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
          </div>
        </div>
      </div>

      {/* Search slide-down */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="border-b border-white/10 bg-black"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form
              onSubmit={handleSearch}
              className="mx-auto flex max-w-7xl gap-2 px-4 py-3 sm:px-6 lg:px-8"
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
