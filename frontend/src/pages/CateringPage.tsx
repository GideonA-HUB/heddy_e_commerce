import React, { useEffect, useState } from 'react';
import { cateringAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

const CateringPage: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await cateringAPI.getPackages();
        setPackages(response.data.results || []);
      } catch (err) {
        console.error('Failed to load catering packages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Event Catering Packages</h1>
        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold">{pkg.name} - {pkg.tier}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="font-bold text-primary">₦{pkg.price_per_head?.toLocaleString()} / head</div>
                <button className="mt-4 w-full btn-primary">Enquire</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CateringPage;
