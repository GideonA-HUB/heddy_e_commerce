import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  ChefHat,
  Clock,
  Heart,
  Shield,
  Truck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import SectionHeader from '../components/SectionHeader';
import PaginatedProductGrid from '../components/PaginatedProductGrid';
import TrainingBanner from '../components/TrainingBanner';
import SEO from '../components/SEO';
import { menuAPI, newsletterAPI } from '../api';
import { useCartStore } from '../stores/cartStore';

const WHY_US = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Quick delivery within Abuja and nationwide shipping.',
  },
  {
    icon: Clock,
    title: 'Fresh Daily',
    desc: 'Prepared fresh with premium African ingredients.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    desc: 'Certified kitchens and careful preparation.',
  },
  {
    icon: ChefHat,
    title: 'Expert Chefs',
    desc: 'Authentic recipes by experienced African chefs.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'The jollof tastes like home. Delivery was on time and beautifully packed.',
    name: 'Amaka O.',
  },
  {
    quote: 'Ordered catering for our office — everyone asked where the food came from.',
    name: 'Tunde K.',
  },
  {
    quote: 'Meal plans made my week so much easier. Fresh, flavourful, consistent.',
    name: 'Chioma E.',
  },
];

const HomePage: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fetchCart = useCartStore((s) => s.fetchCart);

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const featuredQuery = useQuery({
    queryKey: ['menu', 'featured'],
    queryFn: async () => {
      const res = await menuAPI.getMenuItems({ is_featured: true, limit: 40 });
      return res.data.results || [];
    },
  });

  const newQuery = useQuery({
    queryKey: ['menu', 'new'],
    queryFn: async () => {
      const res = await menuAPI.getMenuItems({ ordering: '-created_at', limit: 40 });
      return res.data.results || [];
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: async () => {
      const res = await menuAPI.getCategories();
      return (res.data.results || []).filter((c) => c.is_active).slice(0, 8);
    },
  });

  const featuredItems = featuredQuery.data || [];
  const newItems = newQuery.data || [];
  const bestSellers = featuredItems.length > 0 ? featuredItems : newItems;
  const categories = categoriesQuery.data || [];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="HEDDIEKITCHEN — Authentic African Cuisine"
        description="Order authentic African dishes, meal plans, and catering from HEDDIEKITCHEN. Fresh food delivered across Nigeria."
        type="website"
      />

      {/* 1) Full-bleed hero */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden sm:min-h-[92vh] md:min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=2000&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />

        <div className="relative z-10 w-full px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <motion.p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              HEDDIEKITCHEN
            </motion.p>
            <motion.h1
              className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55 }}
            >
              Authentic African cuisine, delivered fresh
            </motion.h1>
            <motion.p
              className="mt-4 max-w-lg text-base text-white/85 sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              Premium ingredients. Chef-crafted dishes. Order for tonight or plan the week.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
            >
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-700 sm:text-base"
              >
                Order Now
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:text-base"
              >
                View Menu
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <TrainingBanner />

      {categories.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container mx-auto">
            <SectionHeader title="Categories" viewAllTo="/menu" viewAllLabel="Full Menu" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/menu?category=${cat.id}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary"
                >
                  {cat.icon && typeof cat.icon === 'string' ? (
                    <img
                      src={cat.icon}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-primary/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white sm:text-base">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <SectionHeader
            title="Featured Items"
            viewAllTo="/menu?filter=featured"
            viewAllLabel="Full Menu"
          />
          <PaginatedProductGrid
            items={featuredItems}
            loading={featuredQuery.isLoading}
            badge="Featured"
            emptyMessage="No featured dishes yet"
          />
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <SectionHeader
            title="Seasonal Specials"
            viewAllTo="/menu?sort=-created_at"
            viewAllLabel="All New"
          />
          <PaginatedProductGrid
            items={newItems}
            loading={newQuery.isLoading}
            badge="New"
            emptyMessage="No new dishes yet"
          />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <SectionHeader
            title="Customer Favorites"
            viewAllTo="/menu"
            viewAllLabel="Full Menu"
          />
          <PaginatedProductGrid
            items={bestSellers}
            loading={featuredQuery.isLoading || newQuery.isLoading}
            badge="Bestseller"
            emptyMessage="No favorites yet"
          />
        </div>
      </section>

      <section className="section-padding bg-secondary text-white">
        <div className="container mx-auto">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">Why Choose Us</h2>
            <p className="mt-3 text-white/70">
              The best of African cuisine with quality, convenience, and care.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                    <Icon className="text-primary" size={26} />
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/65">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="heading-2">What Guests Say</h2>
            <p className="mt-3 text-body">Real stories from people who dine with us.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
              >
                <Heart size={18} className="mb-3 text-primary" />
                <p className="mb-4 text-gray-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="text-sm font-semibold text-gray-900">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />
        <div className="container relative z-10 mx-auto text-center">
          <Shield className="mx-auto mb-4 text-primary" size={32} />
          <h2 className="text-2xl font-bold sm:text-3xl">Subscribe to Our Meal Plans</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Weekly or monthly meals delivered to your door — customizable and consistent.
          </p>
          <Link
            to="/meal-plans"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-primary transition hover:bg-gray-100"
          >
            Explore Meal Plans
          </Link>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container mx-auto max-w-xl">
          <h2 className="heading-2 text-center">Stay Updated</h2>
          <p className="mt-3 text-center text-body">
            Exclusive offers and new menu drops — straight to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
          {newsletterStatus === 'success' && (
            <p className="mt-3 text-center text-sm font-medium text-green-600">
              Successfully subscribed!
            </p>
          )}
          {newsletterStatus === 'error' && (
            <p className="mt-3 text-center text-sm font-medium text-primary">
              Subscription failed. Please try again.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
