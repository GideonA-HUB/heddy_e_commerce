import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  ContainerAnimated,
  ContainerStagger,
  GalleryGrid,
  GalleryGridCell,
} from './blocks/cta-section-with-gallery';
import { Button } from './ui/button';
import { coreAPI } from '../api';
import type { HomepageHero } from '../types';

/** Fallback Unsplash food images when admin has not uploaded gallery yet */
const FALLBACK_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
    alt: 'African stew and fufu',
  },
  {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    alt: 'Fresh plated meal',
  },
  {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'Gourmet dish',
  },
  {
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    alt: 'Fresh ingredients',
  },
];

const DEFAULT_HERO: HomepageHero = {
  id: 0,
  eyebrow: 'Authentic African Cuisine',
  headline: 'Delicious food, delivered fresh',
  description:
    'Premium ingredients. Chef-crafted dishes. Order for tonight or plan the week with HEDDIEKITCHEN.',
  cta_primary_text: 'Order Now',
  cta_primary_link: '/menu',
  cta_secondary_text: 'View Menu',
  cta_secondary_link: '/menu',
  gallery_images: [],
};

/**
 * Homepage hero — gallery CTA layout with red radial gradient
 * (Blue Wardrobe structure, HeddieKitchen brand colors).
 * Copy + images editable via Django admin → Homepage Hero.
 */
export const HeroSection: React.FC = () => {
  const { data: hero } = useQuery({
    queryKey: ['homepage-hero'],
    queryFn: async () => {
      const res = await coreAPI.getHomepageHero();
      const results = res.data.results || [];
      return results[0] || null;
    },
    staleTime: 60_000,
  });

  const content = hero || DEFAULT_HERO;
  const images =
    content.gallery_images && content.gallery_images.length > 0
      ? content.gallery_images
      : FALLBACK_IMAGES.map((img, index) => ({ ...img, index }));

  // Pad to 4 cells for the gallery grid
  const gallery = [...images];
  while (gallery.length < 4) {
    const fb = FALLBACK_IMAGES[gallery.length];
    gallery.push({ url: fb.url, alt: fb.alt, index: gallery.length });
  }

  return (
    <section className="relative overflow-hidden">
      {/* Red radial gradient — same lighting idea as Blue Wardrobe, brand red */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 70% 20%, #ef4444 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 20% 80%, #7f1d1d 0%, transparent 50%),
            linear-gradient(160deg, #450a0a 0%, #991b1b 35%, #dc2626 70%, #7f1d1d 100%)
          `,
        }}
      />
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-12 lg:py-24">
        <ContainerStagger className="text-center md:text-left">
          <ContainerAnimated className="mb-4 inline-flex rounded-full border border-white/35 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 md:text-sm">
            {content.eyebrow}
          </ContainerAnimated>

          <ContainerAnimated className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.5rem] md:leading-tight">
            {content.headline}
          </ContainerAnimated>

          <ContainerAnimated className="mx-auto my-4 max-w-lg text-base leading-relaxed text-white/85 md:mx-0 md:my-6 md:text-lg">
            {content.description}
          </ContainerAnimated>

          <ContainerAnimated className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link to={content.cta_primary_link || '/menu'}>
              <Button
                size="lg"
                className="rounded-full bg-black px-7 text-white hover:bg-black/85"
              >
                {content.cta_primary_text || 'Order Now'}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            {content.cta_secondary_text ? (
              <Link to={content.cta_secondary_link || '/menu'}>
                <Button size="lg" variant="outline" className="rounded-full px-7">
                  {content.cta_secondary_text}
                </Button>
              </Link>
            ) : null}
          </ContainerAnimated>
        </ContainerStagger>

        <GalleryGrid className="mx-auto w-full max-w-md md:max-w-none">
          {gallery.slice(0, 4).map((image, index) => (
            <GalleryGridCell index={index} key={`${image.url}-${index}`}>
              <img
                className="size-full object-cover object-center"
                width="100%"
                height="100%"
                src={image.url}
                alt={image.alt || `Hero ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </GalleryGridCell>
          ))}
        </GalleryGrid>
      </div>
    </section>
  );
};

export default HeroSection;
