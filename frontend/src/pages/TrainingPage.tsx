import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, ChefHat, Users, TrendingUp } from 'lucide-react';
import { trainingAPI } from '../api';
import { TrainingPackage } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import TrainingEnquiryModal from '../components/TrainingEnquiryModal';

const TrainingPage: React.FC = () => {
  const [packages, setPackages] = useState<TrainingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TrainingPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await trainingAPI.getPackages();
        setPackages(response.data.results || []);
      } catch (err: any) {
        console.error('Failed to fetch training packages:', err);
        setError(err.response?.data?.detail || 'Failed to load training packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const getPackageIcon = (pkg: TrainingPackage) => {
    if (pkg.is_housewife) return Users;
    if (pkg.is_upgrade) return TrendingUp;
    if (pkg.is_advanced) return ChefHat;
    return GraduationCap;
  };

  const getPackageColor = (pkg: TrainingPackage) => {
    if (pkg.package_type === '6months') return 'from-blue-500 to-blue-700';
    if (pkg.package_type === '3months') return 'from-purple-500 to-purple-700';
    if (pkg.package_type === '1month') return 'from-green-500 to-green-700';
    return 'from-orange-500 to-orange-700';
  };

  const formatFeatures = (pkg: TrainingPackage): string[] => {
    const features: string[] = [];
    
    if (pkg.is_for_beginners) features.push('For beginners');
    if (pkg.is_advanced) features.push('Advanced classes');
    if (pkg.is_upgrade) features.push('Upgrade package');
    if (pkg.is_housewife) features.push('House-Wife package');
    
    if (pkg.includes_theory && pkg.theory_topics.length > 0) {
      features.push(`Theory classes on ${pkg.theory_topics.join(', ')}`);
    }
    
    const practicalCourses: string[] = [];
    if (pkg.includes_pastries) practicalCourses.push('Pastries');
    if (pkg.includes_baking) practicalCourses.push('Baking');
    if (pkg.includes_local_dishes) practicalCourses.push('Local dishes');
    if (pkg.includes_intercontinental) practicalCourses.push('Intercontinental dishes');
    if (pkg.includes_advanced_cooking) practicalCourses.push('Advanced cooking');
    if (pkg.includes_upscale_dining) practicalCourses.push('Upscale dining');
    if (pkg.includes_event_catering) practicalCourses.push('Event catering');
    if (pkg.includes_management) practicalCourses.push('Managing and deliverables');
    if (pkg.includes_general_kitchen_mgmt) practicalCourses.push('General kitchen management');
    if (pkg.includes_popular_african_menu) practicalCourses.push('Popular African menu');
    
    if (practicalCourses.length > 0) {
      features.push(...practicalCourses);
    }
    
    if (pkg.includes_certification) features.push('Certification');
    
    // Add custom features from JSON field
    if (pkg.features && Array.isArray(pkg.features)) {
      features.push(...pkg.features);
    }
    
    return features;
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

  const handleEnquireClick = (pkg: TrainingPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Reduced Size */}
      <section className="bg-gradient-to-r from-primary via-red-600 to-primary text-white py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-full mb-3 md:mb-4">
              <GraduationCap size={24} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">Professional Culinary Training</h1>
            <p className="text-sm md:text-base lg:text-lg opacity-90">
              Master the art of cooking with our comprehensive training programs. 
              From beginners to advanced chefs, we have the perfect package for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Training Packages - Reduced Size */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No training packages available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {packages.map((pkg, index) => {
                const Icon = getPackageIcon(pkg);
                const features = formatFeatures(pkg);
                
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                    style={{ maxHeight: '650px' }}
                  >
                    {/* Package Header - Reduced Size */}
                    <div className={`bg-gradient-to-r ${getPackageColor(pkg)} text-white p-4 md:p-5 flex-shrink-0`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Icon size={20} className="flex-shrink-0" />
                            <h2 className="text-lg md:text-xl font-bold truncate">{pkg.package_type_display}</h2>
                          </div>
                          <h3 className="text-base md:text-lg font-semibold mb-1.5 line-clamp-2">{pkg.title}</h3>
                          {pkg.price && (
                            <p className="text-xl md:text-2xl font-bold">₦{pkg.price.toLocaleString()}</p>
                          )}
                        </div>
                        {pkg.image_url && (
                          <img
                            src={pkg.image_url}
                            alt={pkg.title}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                      </div>
                    </div>

                    {/* Package Content - Reduced Size */}
                    <div className="p-4 md:p-5 flex flex-col flex-1 min-h-0">
                      {/* Scrollable Content Area */}
                      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {/* Description with scroll */}
                        <div>
                          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{pkg.description}</p>
                        </div>

                        {/* Features List - Show All */}
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
                      </div>

                      {/* Bottom Section - Fixed */}
                      <div className="flex-shrink-0 pt-4 border-t border-gray-200 mt-4 space-y-4">
                        {/* Badges - Reduced Size */}
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.includes_certification && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              <Award size={12} />
                              Certification
                            </span>
                          )}
                          {pkg.includes_theory && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              <BookOpen size={12} />
                              Theory
                            </span>
                          )}
                        </div>

                        {/* Enquire Button - Fixed at bottom */}
                        <button
                          onClick={() => handleEnquireClick(pkg)}
                          className="block w-full btn-primary text-center text-sm md:text-base py-2.5"
                        >
                          Enquire Now
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

      {/* Training Enquiry Modal */}
      <TrainingEnquiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackage(null);
        }}
        packageData={selectedPackage}
      />
    </div>
  );
};

export default TrainingPage;

