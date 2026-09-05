import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollButtons: React.FC = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = Math.max(documentHeight - windowHeight, 1);
      const scrollPercentage = (scrollPosition / maxScroll) * 100;

      setShowTop(scrollPercentage > 15);
      setShowBottom(scrollPercentage < 92);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const btnClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-secondary/90 text-white shadow-lg backdrop-blur-md transition hover:bg-primary hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-5">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="scroll-top"
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            className={btnClass}
            aria-label="Scroll to top"
          >
            <ChevronUp size={16} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBottom && (
          <motion.button
            key="scroll-bottom"
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToBottom}
            className={btnClass}
            aria-label="Scroll to bottom"
          >
            <ChevronDown size={16} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollButtons;
