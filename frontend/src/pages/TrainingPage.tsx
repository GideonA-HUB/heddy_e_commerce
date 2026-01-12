import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, ChefHat, Users, TrendingUp } from 'lucide-react';
import { trainingAPI } from '../api';
import { TrainingPackage } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';

const TrainingPage: React.FC = () => {
  const [packages, setPackages] = useState<TrainingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-red-600 to-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <GraduationCap size={32} />
            </div>
            <h1 className="heading-1 mb-4">Professional Culinary Training</h1>
            <p className="text-lg md:text-xl opacity-90">
              Master the art of cooking with our comprehensive training programs. 
              From beginners to advanced chefs, we have the perfect package for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Training Packages */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No training packages available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
              {packages.map((pkg, index) => {
                const Icon = getPackageIcon(pkg);
                const features = formatFeatures(pkg);
                
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    {/* Package Header */}
                    <div className={`bg-gradient-to-r ${getPackageColor(pkg)} text-white p-6`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon size={28} />
                            <h2 className="text-2xl font-bold">{pkg.package_type_display}</h2>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                          {pkg.price && (
                            <p className="text-2xl font-bold">₦{pkg.price.toLocaleString()}</p>
                          )}
                        </div>
                        {pkg.image_url && (
                          <img
                            src={pkg.image_url}
                            alt={pkg.title}
                            className="w-20 h-20 rounded-lg object-cover ml-4"
                          />
                        )}
                      </div>
                    </div>

                    {/* Package Content */}
                    <div className="p-6">
                      <p className="text-gray-700 mb-6 leading-relaxed">{pkg.description}</p>

                      {/* Features List */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <BookOpen size={18} className="text-primary" />
                          What's Included:
                        </h4>
                        <ul className="space-y-2">
                          {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="text-primary mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {pkg.includes_certification && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            <Award size={14} />
                            Certification Included
                          </span>
                        )}
                        {pkg.includes_theory && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            <BookOpen size={14} />
                            Theory Classes
                          </span>
                        )}
                      </div>

                      {/* Contact Button */}
                      <a
                        href="/contact"
                        className="block w-full btn-primary text-center"
                      >
                        Enquire Now
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;

