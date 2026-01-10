import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRotate, setShouldRotate] = useState(true);
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { user, logout } = useAuthStore();
  const { siteAssetLogo } = useUIStore();

  const itemCount = cart?.item_count || 0;

  // Rotate logo on page load/reload (works on both web and mobile)
  useEffect(() => {
    // Trigger rotation animation on mount (page load/reload/refresh)
    setShouldRotate(true);
    // Reset animation state after animation completes
    const timer = setTimeout(() => {
      setShouldRotate(false);
    }, 900); // Animation duration (0.8s) + small buffer (0.1s)
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - runs on component mount (every page load/reload)

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/menu', label: 'Menu' },
    { to: '/meal-plans', label: 'Meal Plans' },
    { to: '/catering', label: 'Catering' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/shipping', label: 'Shipping' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            {siteAssetLogo && (
              <motion.img
                src={siteAssetLogo}
                alt="HEDDIEKITCHEN logo"
                className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain rounded-full bg-white/5 p-1.5 md:p-2"
                initial={{ rotate: 0, scale: 1 }}
                animate={shouldRotate ? { rotate: 360, scale: 1 } : { rotate: 0, scale: 1 }}
                transition={{
                  rotate: {
                    duration: 0.8,
                    ease: "easeInOut",
                    repeat: 0
                  },
                  scale: {
                    duration: 0.3
                  }
                }}
                whileHover={{ scale: 1.1, rotate: 12 }}
                whileTap={{ scale: 0.95 }}
              />
            )}
            <span className="font-black text-lg md:text-xl lg:text-2xl tracking-tight uppercase">
              HEDDIEKITCHEN
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/90 hover:text-white transition-colors duration-200 font-medium tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to="/cart"
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} className="md:w-6 md:h-6" />
                {itemCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Auth - Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/profile"
                  className="text-white/90 hover:text-white transition-colors font-semibold"
                >
                  {user.username || user.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="border-2 border-white/70 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black border-t border-white/10">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-white/90 hover:text-white transition-colors font-medium tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-white/90 hover:text-white transition-colors font-medium tracking-wide"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-primary font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-white/90 hover:text-white transition-colors font-medium tracking-wide"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-white/90 hover:text-white transition-colors font-medium tracking-wide"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
