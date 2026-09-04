import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  viewAllTo?: string;
  viewAllLabel?: string;
}

/** CasseoHair Featured Items header: title left, pill "All … →" right */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  viewAllTo = '/menu',
  viewAllLabel = 'Full Menu',
}) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
        {title}
      </h2>
      {viewAllTo && (
        <Link to={viewAllTo} className="btn-ghost-pill shrink-0">
          {viewAllLabel}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
