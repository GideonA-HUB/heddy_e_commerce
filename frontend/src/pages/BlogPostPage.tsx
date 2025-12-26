import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await blogAPI.getPostDetail(slug);
        setPost(res.data);
      } catch (err) {
        console.error('Failed to load post', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Blog</span>
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {post.featured_image_url && (
            <div className="w-full h-64 sm:h-80 overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              {post.author_name && (
                <span>By {post.author_name}</span>
              )}
              {(post.publish_date || post.created_at) && (
                <span>• {new Date(post.publish_date || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              )}
              {post.category?.name && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                  {post.category.name}
                </span>
              )}
              {post.view_count !== undefined && (
                <span>• {post.view_count} views</span>
              )}
            </div>

            {post.excerpt && (
              <p className="text-lg text-gray-600 mb-6 italic">{post.excerpt}</p>
            )}

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{post.body || ''}</ReactMarkdown>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
