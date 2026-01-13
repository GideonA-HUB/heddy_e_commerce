import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { blogAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await blogAPI.getPosts();
        setPosts(res.data.results || []);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://tse1.explicit.bing.net/th/id/OIP.uxn-06tNTTFajbvhrOnkKAHaE6?rs=1&pid=ImgDetMain&o=7&rm=3)',
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
              <BookOpen size={28} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg">
              Blog
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-95 drop-shadow-md px-4">
              Discover culinary stories, recipes, and insights from our kitchen to yours
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <SkeletonLoader count={4} />
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {posts.map((p) => (
              <article key={p.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                <Link to={`/blog/${p.slug}`} className="block">
                  {p.featured_image_url && (
                    <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden" style={{ minHeight: '300px', maxHeight: '500px' }}>
                      <img
                        src={p.featured_image_url}
                        alt={p.title}
                        className="w-full h-auto max-h-[500px] object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                        {p.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      {p.author_name && (
                        <span>By {p.author_name}</span>
                      )}
                      {(p.publish_date || p.created_at) && (
                        <span>• {new Date(p.publish_date || p.created_at).toLocaleDateString()}</span>
                      )}
                      {p.category_name && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {p.category_name}
                        </span>
                      )}
                      {p.view_count !== undefined && (
                        <span>• {p.view_count} views</span>
                      )}
                      {p.like_count !== undefined && (
                        <span>• {p.like_count} likes</span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
