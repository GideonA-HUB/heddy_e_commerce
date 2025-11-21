import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Clock, ChefHat, Heart, MessageSquare, CheckCircle, X } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { menuAPI } from '../api';
import { MenuItem, MenuItemReview } from '../types';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import SkeletonLoader from '../components/SkeletonLoader';

const MenuItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Parallax refs
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const smoothY = useSpring(heroY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/menu/${id}` } });
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await menuAPI.getMenuItemDetail(Number(id));
        setItem(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load menu item');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, user, navigate]);

  const handleAddToCart = async () => {
    if (!item) return;
    try {
      setAddingToCart(true);
      await addItem(item.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !selectedRating || !reviewTitle || !reviewComment) return;

    try {
      setSubmittingReview(true);
      await menuAPI.addReview(item.id, {
        rating: selectedRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      
      // Refresh item data to get updated reviews
      const response = await menuAPI.getMenuItemDetail(item.id);
      setItem(response.data);
      
      // Reset form
      setSelectedRating(0);
      setReviewTitle('');
      setReviewComment('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader count={3} />
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/menu" className="btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const userReview = item.reviews?.find(r => r.username === user?.username);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section with Parallax */}
      <motion.section
        ref={heroRef}
        style={{ y: smoothY }}
        className="relative h-64 sm:h-80 md:h-96 overflow-hidden"
      >
        {item.image_url ? (
          <motion.img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        
        {/* Back Button */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/menu"
            className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-white transition-all shadow-lg"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Menu</span>
          </Link>
        </motion.div>
      </motion.section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Item Info */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {item.category_name && (
                  <span className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full">
                    {item.category_name}
                  </span>
                )}
                {item.is_featured && (
                  <span className="text-xs sm:text-sm bg-accent text-white font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {item.name}
              </motion.h1>

              {/* Rating */}
              {item.average_rating && item.average_rating > 0 && (
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(item.average_rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {item.average_rating.toFixed(1)}
                  </span>
                  {item.reviews && item.reviews.length > 0 && (
                    <span className="text-gray-500">
                      ({item.reviews.length} {item.reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  )}
                </motion.div>
              )}

              {/* Price and Info */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-primary font-bold text-3xl sm:text-4xl">
                    ₦{item.price.toLocaleString()}
                  </p>
                </motion.div>
                {item.prep_time_minutes && (
                  <motion.div
                    className="flex items-center gap-2 text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Clock size={20} />
                    <span>{item.prep_time_minutes} min prep</span>
                  </motion.div>
                )}
              </div>

              {/* Description */}
              <motion.p
                className="text-gray-700 text-lg leading-relaxed mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {item.description}
              </motion.p>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!item.is_available || addingToCart}
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={24} />
                {addingToCart ? 'Adding...' : item.is_available ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="text-primary" size={28} />
                Reviews & Ratings
              </h2>

              {/* Add Review Form */}
              {!userReview && (
                <motion.form
                  onSubmit={handleSubmitReview}
                  className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                  
                  {/* Star Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          type="button"
                          onClick={() => setSelectedRating(rating)}
                          className="focus:outline-none"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star
                            size={32}
                            className={
                              rating <= selectedRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Give your review a title"
                      required
                    />
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submittingReview || !selectedRating || !reviewTitle || !reviewComment}
                    className="btn-primary w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </motion.button>
                </motion.form>
              )}

              {/* Existing Reviews */}
              <div className="space-y-6">
                {item.reviews && item.reviews.length > 0 ? (
                  item.reviews.map((review: MenuItemReview, index: number) => (
                    <motion.div
                      key={review.id}
                      className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">
                              {review.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.username}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {review.is_verified_purchase && (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                            <CheckCircle size={16} />
                            Verified Purchase
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>

                      <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="font-bold text-xl mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock size={20} className="text-primary" />
                  <span>Prep Time: {item.prep_time_minutes} minutes</span>
                </div>
                {item.is_available ? (
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-red-600">
                    <X size={20} />
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetailPage;

