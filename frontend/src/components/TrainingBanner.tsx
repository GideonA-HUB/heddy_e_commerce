import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrainingBanner: React.FC = () => {
  const text = "We offer training courses and packages at Heddiekitchen, 6 months, 3 months, 2 weeks packages, beginner classes, advanced classes, upgrade packages and lots more, look at our training section for more info";

  return (
    <div className="bg-gradient-to-r from-primary via-red-600 to-primary text-white py-3 md:py-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex items-center gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="flex-shrink-0 hidden sm:flex">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <GraduationCap size={24} className="text-white" />
            </div>
          </div>

          {/* Scrolling Text */}
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex items-center gap-8 whitespace-nowrap"
              animate={{
                x: [0, -50],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate text for seamless loop */}
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-sm md:text-base font-medium">
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* CTA Button */}
          <Link
            to="/training"
            className="flex-shrink-0 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Learn More</span>
            <span className="sm:hidden">More</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingBanner;

