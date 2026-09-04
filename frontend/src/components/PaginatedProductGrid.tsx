import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import SkeletonLoader from './SkeletonLoader';
import { MenuItem } from '../types';
import { usePageSize } from '../hooks/usePageSize';

interface PaginatedProductGridProps {
  items: MenuItem[];
  loading?: boolean;
  badge?: 'Featured' | 'New' | 'Bestseller' | null;
  emptyMessage?: string;
  /** Override page sizes; defaults: mobile 4 / desktop 8 */
  mobilePageSize?: number;
  desktopPageSize?: number;
}

function buildPageRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

/**
 * Paginated product grid — mobile 4 / desktop 8 (CasseoHair pattern).
 * Grid: 2 cols mobile → 3 md → 4 lg.
 */
export const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({
  items,
  loading = false,
  badge = null,
  emptyMessage = 'No items available',
  mobilePageSize = 4,
  desktopPageSize = 8,
}) => {
  const pageSize = usePageSize(mobilePageSize, desktopPageSize);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Reset to page 1 when list or page size changes
  useEffect(() => {
    setPage(1);
  }, [items, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, items.length);

  if (loading) {
    return <SkeletonLoader count={pageSize} />;
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {pageItems.map((item) => (
          <MenuItemCard key={item.id} item={item} badge={badge} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
          <p className="text-sm text-gray-500">
            Showing {showingFrom}–{showingTo} of {items.length} items
          </p>
          <nav className="flex items-center gap-1.5" aria-label="Pagination">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {buildPageRange(page, totalPages).map((entry, idx) =>
              entry === 'ellipsis' ? (
                <span key={`e-${idx}`} className="px-1 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setPage(entry)}
                  className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-sm font-medium transition ${
                    page === entry
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={page === entry ? 'page' : undefined}
                >
                  {entry}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PaginatedProductGrid;
