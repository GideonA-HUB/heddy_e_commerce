import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">Blog</h1>
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
                    <div className="w-full aspect-video sm:aspect-[16/9] overflow-hidden bg-gray-100 relative">
                      <img
                        src={p.featured_image_url}
                        alt={p.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        style={{ objectPosition: 'center top' }}
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
