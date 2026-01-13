import React, { useEffect, useState } from 'react';
import { galleryAPI } from '../api';
import { GalleryImage, GalleryCategory } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [imagesRes, categoriesRes] = await Promise.all([
          galleryAPI.getImages(),
          galleryAPI.getCategories(),
        ]);
        setImages(imagesRes.data.results || []);
        setCategories(categoriesRes.data.results || []);
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredImages = selectedCategory
    ? images.filter((img) => img.category === selectedCategory)
    : images;

  const handleImageClick = (image: GalleryImage) => {
    const index = filteredImages.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setSelectedImage(image);
    setShowModal(true);
  };

  const nextImage = () => {
    if (filteredImages.length > 0) {
      const nextIndex = (currentImageIndex + 1) % filteredImages.length;
      setCurrentImageIndex(nextIndex);
      setSelectedImage(filteredImages[nextIndex]);
    }
  };

  const prevImage = () => {
    if (filteredImages.length > 0) {
      const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
      setCurrentImageIndex(prevIndex);
      setSelectedImage(filteredImages[prevIndex]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!showModal) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (filteredImages.length > 0) {
          const nextIndex = (currentImageIndex + 1) % filteredImages.length;
          setCurrentImageIndex(nextIndex);
          setSelectedImage(filteredImages[nextIndex]);
        }
      }
      if (e.key === 'ArrowLeft') {
        if (filteredImages.length > 0) {
          const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
          setCurrentImageIndex(prevIndex);
          setSelectedImage(filteredImages[prevIndex]);
        }
      }
      if (e.key === 'Escape') {
        setShowModal(false);
        setSelectedImage(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, currentImageIndex, filteredImages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <SkeletonLoader count={6} />
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
            backgroundImage: 'url(https://media.istockphoto.com/id/1006098752/photo/a-meat-dish-on-a-black-surface.jpg?b=1&s=170667a&w=0&k=20&c=U_TBAFy808bF_ULBc_rOUR7PkDXhMuwQMgDePr45Tog=)',
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
              <ImageIcon size={28} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg">
              Gallery
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-95 drop-shadow-md px-4">
              Explore our collection of delicious dishes and culinary creations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                  selectedCategory === null
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All ({images.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name} ({category.image_count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-lg sm:text-xl">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white aspect-square">
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                      <div className="w-full p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="text-white text-xs sm:text-sm line-clamp-2">
                            {image.description}
                          </p>
                        )}
                        {image.category_name && (
                          <span className="inline-block mt-2 px-2 py-1 bg-primary text-white text-xs rounded">
                            {image.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showModal && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image */}
              <div className="flex-1 flex items-center justify-center overflow-hidden rounded-t-lg">
                {selectedImage.image_url ? (
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="bg-white rounded-b-lg p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedImage.title}
                  </h3>
                  {filteredImages.length > 1 && (
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {currentImageIndex + 1} / {filteredImages.length}
                    </span>
                  )}
                </div>
                {selectedImage.category_name && (
                  <span className="inline-block mb-3 px-3 py-1 bg-primary text-white text-sm rounded-full">
                    {selectedImage.category_name}
                  </span>
                )}
                {selectedImage.description && (
                  <p className="text-gray-600 text-sm sm:text-base mt-3">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;

