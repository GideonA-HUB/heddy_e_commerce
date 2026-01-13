import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ScrollButtons from './components/ScrollButtons';
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
import GalleryPage from './pages/GalleryPage';
import TrainingPage from './pages/TrainingPage';

const App: React.FC = () => {
  const setSiteAssetLogo = useUIStore((state) => state.setSiteAssetLogo);
  const setShowSpinner = useUIStore((state) => state.setShowSpinner);
  const showSpinner = useUIStore((state) => state.showSpinner);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadSiteAssets = async () => {
      try {
        // Check localStorage for cached logo (available immediately on reload)
        const cachedLogo = localStorage.getItem('heddiekitchen_logo');
        const cachedFavicon = localStorage.getItem('heddiekitchen_favicon');
        
        // Set cached logo immediately so Loader can use it right away
        if (cachedLogo) {
          setSiteAssetLogo(cachedLogo);
        } else if (cachedFavicon) {
          setSiteAssetLogo(cachedFavicon);
        }
        
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
            // Cache logo for next page load (available immediately)
            localStorage.setItem('heddiekitchen_logo', logoUrl);
          }

          // Also set favicon dynamically (fallback to logo if favicon missing)
          const faviconUrl = asset.favicon_url || logoUrl;
          if (faviconUrl) {
            // Cache favicon for next page load (available immediately on reload)
            localStorage.setItem('heddiekitchen_favicon', faviconUrl);
            // Create animated rotating favicon on page load
            const animateFavicon = (imageUrl: string) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const updateFavicon = (angle: number) => {
                  ctx.clearRect(0, 0, 32, 32);
                  ctx.save();
                  ctx.translate(16, 16);
                  ctx.rotate((Math.PI * 2) / 180 * angle);
                  ctx.drawImage(img, -16, -16, 32, 32);
                  ctx.restore();
                  
                  const dataUrl = canvas.toDataURL('image/png');
                  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                  if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                  }
                  link.href = dataUrl;
                };

                // Animate rotation: 360 degrees over 0.8 seconds
                const startTime = Date.now();
                const duration = 800; // 0.8 seconds
                const startAngle = 360;
                
                const animate = () => {
                  const elapsed = Date.now() - startTime;
                  if (elapsed < duration) {
                    const progress = elapsed / duration;
                    // Ease in-out for smooth animation (matching navbar logo easing)
                    const easedProgress = progress < 0.5 
                      ? 2 * progress * progress 
                      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    const currentAngle = startAngle - (startAngle * easedProgress); // Rotate from 360 to 0
                    updateFavicon(currentAngle);
                    requestAnimationFrame(animate);
                  } else {
                    // Animation complete - set to final position (0 degrees)
                    updateFavicon(0);
                    // After animation completes, switch to original favicon URL to ensure consistency
                    setTimeout(() => {
                      const finalLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                      if (finalLink) {
                        finalLink.href = imageUrl + '?v=' + Date.now(); // Add version to force refresh
                      }
                    }, 100);
                  }
                };
                
                requestAnimationFrame(animate);
              };
              
              img.onerror = () => {
                // Fallback: if image fails to load or CORS issue, just set the URL directly
                let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                if (link) {
                  link.href = imageUrl + '?v=' + Date.now();
                } else {
                  link = document.createElement('link');
                  link.rel = 'icon';
                  link.href = imageUrl + '?v=' + Date.now();
                  document.head.appendChild(link);
                }
              };
              
              img.src = imageUrl;
            };

            // Start favicon animation
            animateFavicon(faviconUrl);
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
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/orders/:id" element={<OrderConfirmationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <ScrollButtons />
      </div>
    </Router>
  );
};

export default App;
