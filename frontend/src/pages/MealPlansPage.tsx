import React, { useEffect, useState } from 'react';
import { mealplansAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

const MealPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await mealplansAPI.getPlans();
        setPlans(response.data.results || []);
      } catch (err) {
        console.error('Failed to load meal plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Meal Plans</h1>
        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
                <p className="text-gray-600 mb-4">{p.description}</p>
                <div className="font-bold text-lg text-primary">₦{p.weekly_price?.toLocaleString()}</div>
                <button className="mt-4 w-full btn-primary">Subscribe</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlansPage;
