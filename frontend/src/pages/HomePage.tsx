import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionHeader from '../components/SectionHeader';
import PaginatedProductGrid from '../components/PaginatedProductGrid';
import TrainingBanner from '../components/TrainingBanner';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';
import CoverFlowCarousel, {
  defaultDishes,
  type CarouselItem,
} from '../components/ui/3-d-coverflow-carousel';
import { menuAPI, newsletterAPI, coreAPI } from '../api';
import { useCartStore } from '../stores/cartStore';

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
  const navigate = useNavigate();

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

  const whyChooseQuery = useQuery({
    queryKey: ['why-choose'],
    queryFn: async () => {
      const res = await coreAPI.getWhyChoose();
      return res.data.results?.[0] ?? null;
    },
  });

  const coverflowItems: CarouselItem[] =
    whyChooseQuery.data?.slides
      ?.filter((s) => s.img)
      .map((s) => ({
        tag: s.tag || undefined,
        titleLine1: s.title_line1,
        titleLine2: s.title_line2 || undefined,
        desc: s.description || undefined,
        img: s.img,
        ctaText: s.cta_text || 'View Menu',
        ctaUrl: s.cta_url || '/menu',
      })) ?? [];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  const featured = featuredQuery.data || [];
  const newest = newQuery.data || [];
  const bestSellers = [...featured, ...newest]
    .filter((item, i, arr) => arr.findIndex((x) => x.id === item.id) === i)
    .slice(0, 16);

  return (
    <div>
      <SEO
        title="HeddieKitchen — Authentic African Cuisine"
        description="Order fresh African meals, catering, and meal plans from HeddieKitchen."
      />

      <HeroSection />
      <TrainingBanner />

      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <SectionHeader
            title="Featured Dishes"
            viewAllTo="/menu"
            viewAllLabel="View Menu"
          />
          <PaginatedProductGrid
            items={featured}
            loading={featuredQuery.isLoading}
            badge="Featured"
            emptyMessage="No featured dishes yet"
          />
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <SectionHeader
            title="New on the Menu"
            viewAllTo="/menu"
            viewAllLabel="Browse All"
          />
          <PaginatedProductGrid
            items={newest}
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

      <CoverFlowCarousel
        items={coverflowItems.length > 0 ? coverflowItems : defaultDishes}
        sectionLabel={whyChooseQuery.data?.section_label || 'WHY CHOOSE US'}
        autoplay
        onCtaClick={(item) => {
          if (!item.ctaUrl) return;
          if (/^https?:\/\//i.test(item.ctaUrl)) {
            window.location.assign(item.ctaUrl);
          } else {
            navigate(item.ctaUrl);
          }
        }}
      />

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
