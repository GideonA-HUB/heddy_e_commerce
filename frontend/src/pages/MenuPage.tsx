import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import MenuItemCard from '../components/MenuItemCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { menuAPI } from '../api';
import { MenuItem, MenuCategory } from '../types';
import { useCartStore } from '../stores/cartStore';

const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchData();
    fetchCart();
  }, [selectedCategory, sortBy, searchTerm, fetchCart]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 100 };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.ordering = sortBy;

      const [itemsData, categoriesData] = await Promise.all([
        menuAPI.getMenuItems(params),
        menuAPI.getCategories(),
      ]);

      setItems(itemsData.data.results || []);
      setCategories(categoriesData.data.results || []);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      ...Object.fromEntries(searchParams),
      q: searchTerm,
    });
  };

  const handleAddToCart = async () => {
    // This is just for UI feedback - the actual add to cart is handled in MenuItemCard
    // No need to call addItem again here
  };

  const CategoryButton = ({ category, isActive, onClick }: { category?: { id: number; name: string }, isActive: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-2.5 rounded-lg mb-2 transition-all font-medium ${
        isActive
          ? 'bg-primary text-white shadow-md'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      {category ? category.name : 'All Items'}
    </button>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="bg-white border-b sticky top-16 md:top-20 z-10 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="heading-2 mb-6">Our Menu</h1>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
              </div>
            </form>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                <Filter size={18} />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-created_at">Newest First</option>
              </select>
            </div>

            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-created_at">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)}>
              <div className="bg-white h-full w-80 max-w-[85vw] shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <CategoryButton
                    isActive={!selectedCategory}
                    onClick={() => {
                      setSelectedCategory('');
                      setShowMobileFilters(false);
                    }}
                  />
                  {categories.map((category) => (
                    <CategoryButton
                      key={category.id}
                      category={category}
                      isActive={selectedCategory === category.id.toString()}
                      onClick={() => {
                        setSelectedCategory(category.id.toString());
                        setShowMobileFilters(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar - Categories (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-32">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-primary" />
                <h2 className="font-semibold text-lg">Categories</h2>
              </div>
              <CategoryButton
                isActive={!selectedCategory}
                onClick={() => setSelectedCategory('')}
              />
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isActive={selectedCategory === category.id.toString()}
                  onClick={() => setSelectedCategory(category.id.toString())}
                />
              ))}
            </div>
          </div>

          {/* Main Content - Menu Items */}
          <div className="lg:col-span-3">
            {loading ? (
              <SkeletonLoader count={12} />
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100
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
              <div className="bg-white rounded-xl p-12 text-center shadow-md">
                <p className="text-gray-500 text-lg">No items found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenuPage;
