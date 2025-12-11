import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { useUIStore } from './stores/uiStore';
import { useCartStore } from './stores/cartStore';
import { useAuthStore } from './stores/authStore';
import { coreAPI } from './api';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import MenuItemDetailPage from './pages/MenuItemDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import MealPlansPage from './pages/MealPlansPage';
import CateringPage from './pages/CateringPage';
import ShippingPage from './pages/ShippingPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

const App: React.FC = () => {
  const setSiteAssetLogo = useUIStore((state) => state.setSiteAssetLogo);
  const setShowSpinner = useUIStore((state) => state.setShowSpinner);
  const showSpinner = useUIStore((state) => state.showSpinner);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadSiteAssets = async () => {
      try {
        setShowSpinner(true);
        const response = await coreAPI.getSiteAssets();
        if (response.data.results && response.data.results.length > 0) {
          const asset = response.data.results[0];
          // Prefer primary logo, fall back to light/dark, then favicon
          const logoUrl =
            asset.logo_primary_url ||
            asset.logo_light_url ||
            asset.logo_dark_url ||
            asset.favicon_url ||
            '';
          if (logoUrl) {
            setSiteAssetLogo(logoUrl);
          }

          // Also set favicon dynamically (fallback to logo if favicon missing)
          const faviconUrl = asset.favicon_url || logoUrl;
          if (faviconUrl) {
            const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (link) {
              link.href = faviconUrl;
            } else {
              const newLink = document.createElement('link');
              newLink.rel = 'icon';
              newLink.href = faviconUrl;
              document.head.appendChild(newLink);
            }
          }
        } else {
          console.warn('No site assets returned from API');
        }
      } catch (error) {
        console.error('Failed to load site assets:', error);
      } finally {
        setShowSpinner(false);
      }
    };

    loadSiteAssets();
  }, [setSiteAssetLogo, setShowSpinner]);

  // Fetch cart when user is logged in
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {showSpinner && <Loader />}
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<MenuItemDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/meal-plans" element={<MealPlansPage />} />
            <Route path="/catering" element={<CateringPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
