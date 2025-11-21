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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="space-y-6">
            {posts.map((p) => (
              <article key={p.id} className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-semibold"><Link to={`/blog/${p.slug}`}>{p.title}</Link></h2>
                <p className="text-gray-600 mt-2">{p.excerpt || p.summary}</p>
                <div className="mt-4 text-sm text-gray-500">By {p.author?.name} • {new Date(p.published_at).toLocaleDateString()}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
