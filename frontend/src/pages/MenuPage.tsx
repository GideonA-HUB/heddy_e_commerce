import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PaginatedProductGrid from '../components/PaginatedProductGrid';
import SEO from '../components/SEO';
import { menuAPI } from '../api';
import { useCartStore } from '../stores/cartStore';

const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const filterParam = searchParams.get('filter');

  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSortBy(searchParams.get('sort') || 'name');
  }, [searchParams]);

  const itemsQuery = useQuery({
    queryKey: ['menu', 'items', selectedCategory, sortBy, searchTerm, filterParam],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = { limit: 100 };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.ordering = sortBy;
      if (filterParam === 'featured') params.is_featured = true;
      const res = await menuAPI.getMenuItems(params);
      return res.data.results || [];
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: async () => {
      const res = await menuAPI.getCategories();
      return res.data.results || [];
    },
  });

  const items = itemsQuery.data || [];
  const categories = categoriesQuery.data || [];

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchTerm });
  };

  const CategoryButton = ({
    category,
    isActive,
    onClick,
  }: {
    category?: { id: number; name: string };
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      {category ? category.name : 'All Items'}
    </button>
  );

  const pageTitle =
    filterParam === 'featured'
      ? 'Featured Items'
      : filterParam === 'bestsellers'
        ? 'Best Sellers'
        : 'Our Menu';

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={pageTitle}
        description="Browse HEDDIEKITCHEN’s full menu — authentic African dishes, seasonal specials, and customer favorites."
      />

      <div className="sticky top-[5.75rem] z-10 border-b border-gray-100 bg-white/95 backdrop-blur-sm sm:top-[6.25rem] lg:top-[7rem]">
        <div className="container mx-auto py-5 sm:py-6">
          <h1 className="heading-2 mb-5">{pageTitle}</h1>

          <form onSubmit={handleSearch} className="mb-4 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search dishes…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium lg:hidden"
            >
              <Filter size={16} />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateParams({ sort: e.target.value });
              }}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary lg:ml-auto lg:flex-none"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-created_at">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {showMobileFilters && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h2 className="font-bold">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="rounded-lg p-2 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="mb-3 font-semibold">Categories</h3>
                  <CategoryButton
                    isActive={!selectedCategory}
                    onClick={() => {
                      setSelectedCategory('');
                      updateParams({ category: '' });
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
                        updateParams({ category: category.id.toString() });
                        setShowMobileFilters(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-40 rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                <h2 className="font-semibold">Categories</h2>
              </div>
              <CategoryButton
                isActive={!selectedCategory}
                onClick={() => {
                  setSelectedCategory('');
                  updateParams({ category: '' });
                }}
              />
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isActive={selectedCategory === category.id.toString()}
                  onClick={() => {
                    setSelectedCategory(category.id.toString());
                    updateParams({ category: category.id.toString() });
                  }}
                />
              ))}
            </div>
          </aside>

          <div className="lg:col-span-3">
            <PaginatedProductGrid
              items={items}
              loading={itemsQuery.isLoading}
              badge={filterParam === 'featured' ? 'Featured' : null}
              emptyMessage="No items found. Try adjusting your search or filters."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
