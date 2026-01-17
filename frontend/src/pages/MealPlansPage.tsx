import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, UtensilsCrossed, Award, BookOpen } from 'lucide-react';
import { mealplansAPI } from '../api';
import { MealPlan } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import MealPlanSubscriptionModal from '../components/MealPlanSubscriptionModal';

const MealPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await mealplansAPI.getPlans();
        setPlans(response.data.results || []);
      } catch (err: any) {
        console.error('Failed to load meal plans', err);
        setError(err.response?.data?.detail || 'Failed to load meal plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getPlanColor = (planType: string) => {
    const type = planType.toLowerCase();
    if (type.includes('weight') || type.includes('loss')) return 'from-red-500 to-red-700';
    if (type.includes('muscle') || type.includes('gain') || type.includes('bulk')) return 'from-blue-500 to-blue-700';
    if (type.includes('healthy')) return 'from-green-500 to-green-700';
    if (type.includes('corporate')) return 'from-purple-500 to-purple-700';
    if (type.includes('family')) return 'from-orange-500 to-orange-700';
    return 'from-primary to-red-600';
  };

  const formatFeatures = (plan: MealPlan): string[] => {
    const features: string[] = [];
    
    // Extract features from JSON field (handle both array and object formats)
    let customFeatures: string[] = [];
    if (plan.features) {
      if (Array.isArray(plan.features)) {
        // Direct array format: ["feature1", "feature2"]
        customFeatures = plan.features;
      } else if (typeof plan.features === 'object' && plan.features !== null) {
        // Object format: {"meals": [...], "benefits": [...], "customization": [...]}
        const featuresObj = plan.features as { meals?: string[]; benefits?: string[]; customization?: string[]; [key: string]: any };
        if (featuresObj.meals && Array.isArray(featuresObj.meals)) {
          customFeatures.push(...featuresObj.meals);
        }
        if (featuresObj.benefits && Array.isArray(featuresObj.benefits)) {
          customFeatures.push(...featuresObj.benefits);
        }
        if (featuresObj.customization && Array.isArray(featuresObj.customization)) {
          customFeatures.push(...featuresObj.customization);
        }
      }
    }
    
    // Add custom features
    if (customFeatures.length > 0) {
      features.push(...customFeatures);
    }
    
    return features;
  };

  const handleSubscribeClick = (plan: MealPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

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

      {/* Meal Plans Content - Styled like Training Page */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {plans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No meal plans available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {plans.map((plan, index) => {
                const features = formatFeatures(plan);
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                    style={{ maxHeight: '650px' }}
                  >
                    {/* Plan Header */}
                    <div className={`bg-gradient-to-r ${getPlanColor(plan.plan_type)} text-white p-4 md:p-5 flex-shrink-0`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <UtensilsCrossed size={20} className="flex-shrink-0" />
                            <h2 className="text-lg md:text-xl font-bold truncate">{plan.plan_type_display}</h2>
                          </div>
                          <h3 className="text-base md:text-lg font-semibold mb-1.5 line-clamp-2">{plan.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm opacity-90">{plan.period_display}</span>
                          </div>
                          {plan.price && (
                            <p className="text-xl md:text-2xl font-bold">₦{plan.price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Plan Content */}
                    <div className="p-4 md:p-5 flex flex-col flex-1 min-h-0">
                      {/* Scrollable Content Area */}
                      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {/* Description */}
                        <div>
                          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{plan.description}</p>
                        </div>

                        {/* Features List - Show All */}
                        {features.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                              <BookOpen size={16} className="text-primary flex-shrink-0" />
                              What's Included:
                            </h4>
                            <ul className="space-y-1.5">
                              {features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700 text-xs md:text-sm">
                                  <span className="text-primary mt-1 flex-shrink-0">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Bottom Section - Fixed */}
                      <div className="flex-shrink-0 pt-4 border-t border-gray-200 mt-4 space-y-4">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {plan.is_customizable && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                              <Award size={12} />
                              Customizable
                            </span>
                          )}
                          {plan.sample_pdf_url && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              <BookOpen size={12} />
                              Sample PDF
                            </span>
                          )}
                        </div>

                        {/* Subscribe Button - Fixed at bottom */}
                        <button
                          onClick={() => handleSubscribeClick(plan)}
                          className="block w-full btn-primary text-center text-sm md:text-base py-2.5"
                        >
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Meal Plan Subscription Modal */}
      <MealPlanSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        planData={selectedPlan}
      />
    </div>
  );
};

export default MealPlansPage;
