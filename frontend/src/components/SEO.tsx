import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOConfig {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Dynamic page SEO via react-helmet-async.
 */
export const SEO: React.FC<SEOConfig> = ({
  title,
  description = 'HEDDIEKITCHEN — Authentic African cuisine, catering & meal plans.',
  image,
  url,
  type = 'website',
  canonical,
  jsonLd,
}) => {
  const pageUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullTitle = title.includes('HEDDIEKITCHEN')
    ? title
    : `${title} | HEDDIEKITCHEN`;
  const canonicalUrl = canonical || pageUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="HEDDIEKITCHEN" />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
