import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://blog.eatfit.in/wp-content/uploads/2023/09/close-up-hand-with-meal-plan.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto py-8 md:py-12"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 md:mb-6">
              <Calendar size={28} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg">
              Meal Plans
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-95 drop-shadow-md px-4">
              Subscribe to our curated meal plans and enjoy delicious, healthy meals delivered fresh to your door every week.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meal Plans Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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
