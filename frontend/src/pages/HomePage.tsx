import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Clock, Award, ChefHat, Sparkles, ShoppingBag, Headphones, Zap, Bell, Package, Shield, Heart, Users } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import MenuItemCard from '../components/MenuItemCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { menuAPI, newsletterAPI } from '../api';
import { MenuItem } from '../types';
import { useCartStore } from '../stores/cartStore';

const HomePage: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Parallax scroll refs
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const coveredSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms with enhanced 3D effects
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const featuresY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const smoothY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 50, damping: 30 });
  const smoothScale = useSpring(heroScale, { stiffness: 100, damping: 30 });
  
  // Covered section parallax
  const coveredSectionY = useTransform(scrollYProgress, [0.2, 0.6], [0, -100]);
  const smoothCoveredY = useSpring(coveredSectionY, { stiffness: 80, damping: 30 });

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        const response = await menuAPI.getMenuItems({ featured: true, limit: 6 });
        setFeaturedItems(response.data.results || []);
      } catch (error) {
        console.error('Failed to fetch featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const addItem = useCartStore((state) => state.addItem);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (item: MenuItem) => {
    try {
      await addItem(item.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Parallax and Background Image */}
      <motion.section 
        ref={heroRef}
        style={{ y: smoothY, opacity: heroOpacity }}
        className="relative overflow-hidden min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex items-center bg-white"
      >
        {/* Background Image with Parallax Effect */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            y: smoothBackgroundY,
            scale: smoothScale,
          }}
        >
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://media-cdn.grubhub.com/image/upload/d_search:browse-images:default.jpg/w_1200,q_auto,fl_lossy,dpr_auto,c_fill,f_auto,h_800,g_auto/cs1mvcfnoqzosq9xy9xy)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              transform: 'scale(1.1)',
              willChange: 'transform',
            }}
          />
        </motion.div>
        
        {/* Minimal overlay only for text readability - very subtle */}
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-full mb-4 sm:mb-6 shadow-2xl border-2 border-red-700/50"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Sparkles size={18} className="text-white" />
                <span className="text-sm sm:text-base font-bold text-white">Authentic African Cuisine</span>
              </motion.div>
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                style={{ 
                  transformStyle: 'preserve-3d'
                }}
              >
                <span className="block text-black">Delicious Food,</span>
                <motion.span 
                  className="block text-red-600"
                >
                  Delivered Fresh
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-red-600 leading-relaxed max-w-xl mx-auto md:mx-0 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Experience authentic African cuisine with premium ingredients and fast delivery across Nigeria and international destinations.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/menu"
                    className="bg-red-600 hover:bg-red-700 text-white text-center shadow-2xl hover:shadow-[0_20px_40px_rgba(220,38,38,0.4)] transform transition-all duration-300 backdrop-blur-sm border-2 border-red-700/50 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold"
                  >
                    Order Now
                    <ArrowRight className="inline ml-2" size={20} />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/about"
                    className="border-2 border-black text-black hover:bg-black hover:text-white text-center backdrop-blur-sm bg-white/80 hover:bg-black transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="hidden md:flex items-center justify-center"
              initial={{ opacity: 0, x: 50, rotateY: 15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, type: "spring", stiffness: 100 }}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <div className="relative w-full max-w-md aspect-square">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl"
                  animate={{ 
                    rotate: [6, -6, 6],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="relative w-full h-full bg-white/80 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border-2 border-red-600/30"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ChefHat size={140} className="text-red-600" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* "HeddieKitchen has you covered" Section */}
      <motion.section 
        ref={coveredSectionRef}
        style={{ y: smoothCoveredY }}
        className="relative bg-gradient-to-br from-secondary via-gray-900 to-secondary text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(220,38,38,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(250,204,21,0.15) 0%, transparent 50%)',
            backgroundSize: '400% 400%',
          }}
        />
        
        {/* 3D floating elements */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                style={{
                  textShadow: '2px 2px 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                HeddieKitchen has you covered
              </motion.h2>
              <motion.p
                className="text-base sm:text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-xl mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{
                  textShadow: '1px 1px 5px rgba(0,0,0,0.4)',
                }}
              >
                What do you need? A quick fix on a busy day? Last-minute dinner backup? Supplies for the week? Just an order and let's deliver happiness to your doorstep in minutes.
              </motion.p>
            </motion.div>

            {/* Right side - Scrolling features carousel */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                {/* Infinite scrolling container */}
                <motion.div
                  className="flex flex-col"
                  animate={{
                    y: [0, -800],
                  }}
                  transition={{
                    y: {
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                >
                  {/* First set of items */}
                  {[
                    { icon: ShoppingBag, text: "Fresh Market Supply", color: "bg-primary" },
                    { icon: Headphones, text: "24/7 Support for Customers", color: "bg-accent" },
                    { icon: Zap, text: "Fast deliveries", color: "bg-primary" },
                    { icon: Bell, text: "Updates on deliveries", color: "bg-accent" },
                    { icon: Package, text: "Quality meal choices", color: "bg-primary" },
                    { icon: Shield, text: "Secure payment options", color: "bg-accent" },
                    { icon: Clock, text: "On-time guaranteed", color: "bg-primary" },
                    { icon: Award, text: "Premium ingredients", color: "bg-accent" },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={`first-${index}`}
                        className="flex-shrink-0 px-4 py-3"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05, x: 10, rotateY: 5 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className={`${item.color} rounded-full px-6 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all`}>
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <Icon size={24} className="text-white" />
                          </motion.div>
                          <span className="text-white font-semibold text-sm sm:text-base">{item.text}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                  {/* Duplicate for seamless loop */}
                  {[
                    { icon: ShoppingBag, text: "Fresh Market Supply", color: "bg-primary" },
                    { icon: Headphones, text: "24/7 Support for Customers", color: "bg-accent" },
                    { icon: Zap, text: "Fast deliveries", color: "bg-primary" },
                    { icon: Bell, text: "Updates on deliveries", color: "bg-accent" },
                    { icon: Package, text: "Quality meal choices", color: "bg-primary" },
                    { icon: Shield, text: "Secure payment options", color: "bg-accent" },
                    { icon: Clock, text: "On-time guaranteed", color: "bg-primary" },
                    { icon: Award, text: "Premium ingredients", color: "bg-accent" },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={`second-${index}`}
                        className="flex-shrink-0 px-4 py-3"
                        whileHover={{ scale: 1.05, x: 10, rotateY: 5 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className={`${item.color} rounded-full px-6 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all`}>
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <Icon size={24} className="text-white" />
                          </motion.div>
                          <span className="text-white font-semibold text-sm sm:text-base">{item.text}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                  {/* Third set for extra smoothness */}
                  {[
                    { icon: ShoppingBag, text: "Fresh Market Supply", color: "bg-primary" },
                    { icon: Headphones, text: "24/7 Support for Customers", color: "bg-accent" },
                    { icon: Zap, text: "Fast deliveries", color: "bg-primary" },
                    { icon: Bell, text: "Updates on deliveries", color: "bg-accent" },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={`third-${index}`}
                        className="flex-shrink-0 px-4 py-3"
                        whileHover={{ scale: 1.05, x: 10, rotateY: 5 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className={`${item.color} rounded-full px-6 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all`}>
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <Icon size={24} className="text-white" />
                          </motion.div>
                          <span className="text-white font-semibold text-sm sm:text-base">{item.text}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
              
              {/* Gradient fade edges */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-secondary to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-secondary to-transparent pointer-events-none z-10" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section with Continuous Scrolling Carousel */}
      <motion.section 
        ref={featuresRef}
        style={{ y: featuresY }}
        className="section-padding bg-gray-50 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="heading-2 mb-4">Why Choose HEDDIEKITCHEN</h2>
            <p className="text-body max-w-2xl mx-auto">
              We bring you the best of African cuisine with quality, convenience, and care.
            </p>
          </motion.div>
          
          {/* Continuous Scrolling Carousel Container */}
          <div className="relative overflow-hidden">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 md:w-40 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-40 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
            
            {/* Scrolling cards container */}
            <motion.div
              className="flex gap-6 md:gap-8"
              animate={{
                x: [0, -2400],
              }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              style={{ width: 'max-content' }}
            >
              {/* First set of cards */}
              {[
                { icon: Truck, title: "Fast Delivery", desc: "Quick delivery within Lagos and nationwide shipping available" },
                { icon: Clock, title: "Fresh Food", desc: "Prepared fresh daily with premium African ingredients" },
                { icon: Award, title: "Quality Assured", desc: "Certified kitchens and health-inspected preparation" },
                { icon: ChefHat, title: "Expert Chefs", desc: "Authentic recipes by experienced African chefs" },
                { icon: Heart, title: "Customer Care", desc: "Dedicated support team ready to assist you anytime" },
                { icon: Users, title: "Community Trust", desc: "Loved by thousands of satisfied customers nationwide" },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={`first-${feature.title}`}
                    className="flex-shrink-0 w-72 sm:w-80 text-center p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 50, rotateX: -15, rotateY: -10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -15,
                      rotateY: 8,
                      rotateX: 5,
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div 
                      className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360, scale: 1.15, z: 20 }}
                      transition={{ duration: 0.6 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: {
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          scale: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        }}
                      >
                        <Icon className="text-primary" size={32} />
                      </motion.div>
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-body text-sm leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
              
              {/* Duplicate set for seamless loop */}
              {[
                { icon: Truck, title: "Fast Delivery", desc: "Quick delivery within Lagos and nationwide shipping available" },
                { icon: Clock, title: "Fresh Food", desc: "Prepared fresh daily with premium African ingredients" },
                { icon: Award, title: "Quality Assured", desc: "Certified kitchens and health-inspected preparation" },
                { icon: ChefHat, title: "Expert Chefs", desc: "Authentic recipes by experienced African chefs" },
                { icon: Heart, title: "Customer Care", desc: "Dedicated support team ready to assist you anytime" },
                { icon: Users, title: "Community Trust", desc: "Loved by thousands of satisfied customers nationwide" },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={`second-${feature.title}`}
                    className="flex-shrink-0 w-72 sm:w-80 text-center p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300"
                    whileHover={{ 
                      y: -15,
                      rotateY: 8,
                      rotateX: 5,
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div 
                      className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360, scale: 1.15, z: 20 }}
                      transition={{ duration: 0.6 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: {
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          scale: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        }}
                      >
                        <Icon className="text-primary" size={32} />
                      </motion.div>
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-body text-sm leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Items Section */}
      <motion.section 
        className="section-padding bg-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-2">Featured Dishes</h2>
            <Link
              to="/menu"
              className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all group"
            >
              View All 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {loading ? (
            <SkeletonLoader count={6} />
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <MenuItemCard
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <p className="text-gray-500 text-lg">No featured items available</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Section with Parallax */}
      <motion.section 
        className="bg-gradient-to-r from-primary via-primary-500 to-accent text-white section-padding relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            className="heading-2 text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Subscribe to Our Meal Plans
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Get weekly or monthly meal subscriptions delivered to your door with customizable options
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/meal-plans"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Explore Meal Plans
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        className="section-padding bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.h2 
            className="heading-2 text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Stay Updated
          </motion.h2>
          <motion.p 
            className="text-body text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Subscribe to our newsletter for exclusive offers and new menu updates
          </motion.p>
          <motion.form 
            onSubmit={handleNewsletterSubmit} 
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              Subscribe
            </button>
          </motion.form>
          {newsletterStatus === 'success' && (
            <motion.p 
              className="text-green-600 text-center mt-4 font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              ✓ Successfully subscribed!
            </motion.p>
          )}
          {newsletterStatus === 'error' && (
            <motion.p 
              className="text-red-600 text-center mt-4 font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              ✗ Subscription failed. Please try again.
            </motion.p>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
