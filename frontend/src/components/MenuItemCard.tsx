import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { MenuItem } from '../types';
import { formatNGN } from '../utils/format';

interface MenuItemCardProps {
  item: MenuItem;
  badge?: 'Featured' | 'New' | 'Bestseller' | null;
}

/**
 * Equal-height product card: image → name → reserved rating row → price → CTA
 */
export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, badge }) => {
  const resolvedBadge =
    badge ??
    (item.is_featured ? 'Featured' : null);

  const hasRating = item.average_rating != null && item.average_rating > 0;

  return (
    <motion.article
      className="product-card group h-full"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Link
        to={`/menu/${item.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[1.25rem]"
      >
        <div className="product-card-image">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-sm text-gray-400">No image</span>
            </div>
          )}

          {resolvedBadge && (
            <span className="absolute left-2.5 top-2.5 rounded-md bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm sm:text-xs">
              {resolvedBadge}
            </span>
          )}

          {!item.is_available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900">
                Unavailable
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1 px-0.5">
        <Link to={`/menu/${item.id}`} className="min-w-0">
          <h3 className="truncate text-sm font-medium text-gray-600 sm:text-[15px]">
            {item.name}
          </h3>
        </Link>

        {/* Reserved row so cards stay equal height with/without ratings */}
        <div className="flex h-5 items-center gap-1">
          {hasRating ? (
            <>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(item.average_rating!)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }
                />
              ))}
              <span className="text-[11px] text-gray-500">
                {item.average_rating!.toFixed(1)}
              </span>
            </>
          ) : (
            <span className="sr-only">No rating</span>
          )}
        </div>

        <p className="mt-auto text-sm font-bold text-gray-900 sm:text-base">
          {formatNGN(item.price)}
        </p>
      </div>

      <Link
        to={`/menu/${item.id}`}
        className="btn-select-options"
        aria-label={`Select options for ${item.name}`}
      >
        Select Options
      </Link>
    </motion.article>
  );
};

export default MenuItemCard;
