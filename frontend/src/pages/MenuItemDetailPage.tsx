import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Minus,
  Plus,
  Share2,
  Clock,
  CheckCircle,
  Copy,
  MessageCircle,
  Facebook,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuAPI } from '../api';
import { MenuItem, MenuItemReview } from '../types';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import SEO from '../components/SEO';
import { formatNGN } from '../utils/format';
import SkeletonLoader from '../components/SkeletonLoader';

const MenuItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const response = await menuAPI.getMenuItemDetail(Number(id));
        setItem(response.data);
        setActiveImage(0);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || 'Failed to load menu item';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const gallery: string[] = item
    ? [
        item.image_url,
        ...(item.images?.map((img) => img.image_url).filter(Boolean) || []),
      ].filter(Boolean)
    : [];

  const handleAddToCart = async () => {
    if (!item || !item.is_available) return;
    try {
      setAddingToCart(true);
      await addItem(item.id, quantity);
      openCartDrawer();
    } catch (err) {
      console.error('Failed to add to cart', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && item) {
      try {
        await navigator.share({
          title: item.name,
          text: item.description?.slice(0, 100),
          url: pageUrl,
        });
      } catch {
        /* user cancelled */
      }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !user || !selectedRating || !reviewTitle || !reviewComment) return;
    try {
      setSubmittingReview(true);
      await menuAPI.addReview(item.id, {
        rating: selectedRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      const response = await menuAPI.getMenuItemDetail(item.id);
      setItem(response.data);
      setSelectedRating(0);
      setReviewTitle('');
      setReviewComment('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Failed to submit review';
      setError(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <SkeletonLoader count={2} />
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-primary">{error}</p>
          <Link to="/menu" className="btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const userReview = item.reviews?.find((r) => r.username === user?.username);
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${item.name} — ${pageUrl}`)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={item.name}
        description={item.description?.slice(0, 160) || 'View this dish on HEDDIEKITCHEN'}
        image={item.image_url}
        type="product"
        url={pageUrl}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: item.name,
          description: item.description,
          image: item.image_url,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NGN',
            price: item.price,
            availability: item.is_available
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
          ...(item.average_rating
            ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: item.average_rating,
                  reviewCount: item.reviews?.length || 1,
                },
              }
            : {}),
        }}
      />
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Link
          to="/menu"
          className="mb-6 inline-flex text-sm font-medium text-gray-500 transition hover:text-primary"
        >
          ← Back to Menu
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-[1.5rem] bg-gray-100 aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={gallery[activeImage] || 'empty'}
                  src={gallery[activeImage] || undefined}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                      activeImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details — CasseoHair hierarchy */}
          <div>
            {item.category_name && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                {item.category_name}
              </p>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              {item.name}
            </h1>

            {item.average_rating != null && item.average_rating > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(item.average_rating!)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.average_rating.toFixed(1)}
                </span>
                {item.reviews && item.reviews.length > 0 && (
                  <span className="text-sm text-gray-500">
                    ({item.reviews.length} reviews)
                  </span>
                )}
              </div>
            )}

            <p className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              {formatNGN(item.price)}
            </p>

            {/* Attribute chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {item.prep_time_minutes > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700">
                  <Clock size={14} />
                  {item.prep_time_minutes} min prep
                </span>
              )}
              {item.is_featured && (
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  Featured
                </span>
              )}
            </div>

            {/* Availability */}
            <p
              className={`mt-4 text-sm font-medium ${
                item.is_available ? 'text-green-600' : 'text-primary'
              }`}
            >
              {item.is_available ? (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle size={16} /> Available now
                </span>
              ) : (
                'Currently unavailable'
              )}
            </p>

            {/* Qty + Add to Bag */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center rounded-xl border border-gray-300">
                <button
                  type="button"
                  className="p-3 text-gray-600 hover:text-primary disabled:opacity-40"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="min-w-[2.5rem] text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  className="p-3 text-gray-600 hover:text-primary"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!item.is_available || addingToCart}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addingToCart
                  ? 'Adding…'
                  : item.is_available
                    ? 'Add to Bag'
                    : 'Out of Stock'}
              </button>
            </div>

            {/* Share */}
            <div className="relative mt-4">
              <button
                type="button"
                onClick={() => setShareOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400"
              >
                <Share2 size={16} />
                Share
              </button>
              <AnimatePresence>
                {shareOpen && (
                  <motion.div
                    className="absolute left-0 z-10 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <a
                      href={whatsappShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                    >
                      <MessageCircle size={16} className="text-green-600" />
                      WhatsApp
                    </a>
                    <a
                      href={facebookShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                    >
                      <Facebook size={16} className="text-blue-600" />
                      Facebook
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                    >
                      <Copy size={16} />
                      {copied ? 'Copied!' : 'Copy link'}
                    </button>
                    {'share' in navigator && (
                      <button
                        type="button"
                        onClick={handleNativeShare}
                        className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        <Share2 size={16} />
                        More…
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
              <p className="leading-relaxed text-gray-600">{item.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h2>

          {user && !userReview && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6"
            >
              <h3 className="mb-4 font-semibold">Write a Review</h3>
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={
                        rating <= selectedRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Review title"
                required
                className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                placeholder="Share your experience…"
                required
                className="mb-4 w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={submittingReview || !selectedRating}
                className="btn-primary disabled:opacity-50"
              >
                {submittingReview ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}

          {!user && (
            <p className="mb-8 text-sm text-gray-500">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>{' '}
              to leave a review.
            </p>
          )}

          <div className="space-y-5">
            {item.reviews && item.reviews.length > 0 ? (
              item.reviews.map((review: MenuItemReview) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{review.username}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="mb-1 font-semibold">{review.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-600">{review.comment}</p>
                </article>
              ))
            ) : (
              <p className="py-6 text-center text-gray-500">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuItemDetailPage;
