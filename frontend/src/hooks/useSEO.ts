/**
 * @deprecated Prefer <SEO /> from components/SEO.tsx (Helmet).
 * Kept as a thin wrapper for pages still calling the hook.
 */
import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  const id = 'heddie-jsonld';
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    const {
      title,
      description = 'HEDDIEKITCHEN — Authentic African cuisine, catering & meal plans.',
      image,
      url = typeof window !== 'undefined' ? window.location.href : '',
      type = 'website',
      canonical,
      jsonLd,
    } = config;

    const fullTitle = title.includes('HEDDIEKITCHEN')
      ? title
      : `${title} | HEDDIEKITCHEN`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    if (image) upsertMeta('property', 'og:image', image);

    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    if (image) upsertMeta('name', 'twitter:image', image);

    upsertLink('canonical', canonical || url);

    if (jsonLd) upsertJsonLd(jsonLd);

    return () => {
      const script = document.getElementById('heddie-jsonld');
      if (script) script.remove();
    };
  }, [
    config.title,
    config.description,
    config.image,
    config.url,
    config.type,
    config.canonical,
    JSON.stringify(config.jsonLd),
  ]);
}
