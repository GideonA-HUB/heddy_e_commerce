import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const ScrollButtons: React.FC = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

      // Show top button when scrolled down more than 20%
      setShowTop(scrollPercentage > 20);

      // Show bottom button when not at the bottom (within 95% of scroll)
      setShowBottom(scrollPercentage < 95);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <ArrowUp 
              size={24} 
              className="group-hover:animate-bounce"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            whileHover={{ scale: 1.1, y: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToBottom}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-all duration-300 group"
            aria-label="Scroll to bottom"
          >
            <ArrowDown 
              size={24} 
              className="group-hover:animate-bounce"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollButtons;

