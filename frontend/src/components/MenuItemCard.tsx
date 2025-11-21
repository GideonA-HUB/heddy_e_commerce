import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { MenuItem } from '../types';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);

  const handleCardClick = () => {
    if (user) {
      navigate(`/menu/${item.id}`);
    }
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addItem(item.id, 1);
      if (onAddToCart) {
        onAddToCart(item);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <motion.div 
      className="card group cursor-pointer"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="h-48 sm:h-56 bg-gray-200 overflow-hidden relative rounded-t-xl">
        {item.image_url ? (
          <motion.img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.15, rotate: 2 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}
        {item.is_featured && (
          <motion.span 
            className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            Featured
          </motion.span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Category */}
        {item.category_name && (
          <p className="text-xs sm:text-sm text-primary font-medium mb-1 uppercase tracking-wide">
            {item.category_name}
          </p>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Rating */}
        {item.average_rating && item.average_rating > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(item.average_rating!) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-600">
              ({item.average_rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div>
            <p className="text-primary font-bold text-lg sm:text-xl">
              ₦{item.price.toLocaleString()}
            </p>
            {item.prep_time_minutes && (
              <p className="text-xs text-gray-500 mt-0.5">
                {item.prep_time_minutes} min prep
              </p>
            )}
          </div>
          {item.is_available ? (
            <motion.button
              onClick={handleAddToCartClick}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          ) : !item.is_available ? (
            <span className="text-gray-500 text-xs sm:text-sm font-medium bg-gray-100 px-3 py-2 rounded-lg">
              Out of stock
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
