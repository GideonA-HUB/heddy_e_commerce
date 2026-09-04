import React from 'react';

/** Skeleton matching CasseoHair product card grid (2 → 3 → 4 cols) */
export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <div className="aspect-[4/5] animate-pulse rounded-[1.25rem] bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
