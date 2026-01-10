import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../stores/uiStore';

export const Loader: React.FC = () => {
  const { showSpinner, siteAssetLogo } = useUIStore();
  // Initialize logoUrl from localStorage immediately (available on reload) or from store
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    // Check localStorage first (available immediately on reload)
    const cachedLogo = localStorage.getItem('heddiekitchen_logo');
    const cachedFavicon = localStorage.getItem('heddiekitchen_favicon');
    if (cachedLogo) return cachedLogo;
    if (cachedFavicon) return cachedFavicon;
    // Try favicon link tag as last resort
    if (typeof document !== 'undefined') {
      const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (faviconLink && faviconLink.href && !faviconLink.href.includes('vite.svg')) {
        return faviconLink.href;
      }
    }
    return null;
  });

  // Update logoUrl when siteAssetLogo changes (from API)
  useEffect(() => {
    if (siteAssetLogo) {
      setLogoUrl(siteAssetLogo);
    }
  }, [siteAssetLogo]);

  if (!showSpinner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          {logoUrl ? (
            <motion.img
              src={logoUrl}
              alt="HEDDIEKITCHEN"
              className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-full bg-white/5 p-2"
              initial={{ rotate: 0, scale: 1 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{
                rotate: {
                  duration: 1,
                  ease: "linear",
                  repeat: Infinity,
                },
                scale: {
                  duration: 0.3
                }
              }}
            />
          ) : (
            // Show a minimal placeholder while logo loads (only if absolutely no logo available)
            <motion.div
              className="w-20 h-20 md:w-24 md:h-24 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </div>
        <p className="text-gray-600 text-center font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
