import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blogAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';
import ReactMarkdown from 'react-markdown';

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

  if (loading) return <SkeletonLoader count={6} />;
  if (!post) return <div className="p-8">Post not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">By {post.author?.name} • {new Date(post.published_at).toLocaleDateString()}</div>
        <div className="prose max-w-full bg-white p-6 rounded shadow">
          <ReactMarkdown>{post.content || post.body || ''}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
