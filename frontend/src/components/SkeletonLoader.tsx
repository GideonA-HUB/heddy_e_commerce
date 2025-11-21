import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
          {/* Image Skeleton */}
          <div className="h-48 bg-gray-200 animate-pulse" />

          {/* Content Skeleton */}
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/3" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-2/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
