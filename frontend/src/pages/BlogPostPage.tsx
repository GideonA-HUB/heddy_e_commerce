import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Heart, MessageCircle, Share2, Facebook, Twitter, Send, Reply } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [commentForm, setCommentForm] = useState({ content: '', author: '', email: '' });
  const [replyForm, setReplyForm] = useState<{ [key: number]: { content: string; author: string; email: string } }>({});
  const [commentSuccess, setCommentSuccess] = useState(false);
  const user = useAuthStore((state) => state.user);

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

  const handleLike = async () => {
    if (!post || liking) return;
    try {
      setLiking(true);
      if (post.is_liked) {
        await blogAPI.unlikePost(slug!);
        setPost({ ...post, is_liked: false, like_count: post.like_count - 1 });
      } else {
        await blogAPI.likePost(slug!);
        setPost({ ...post, is_liked: true, like_count: post.like_count + 1 });
      }
    } catch (err) {
      console.error('Failed to like post', err);
    } finally {
      setLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, parentId?: number) => {
    e.preventDefault();
    if (!post || commenting) return;
    
    const formData = parentId ? replyForm[parentId] : commentForm;
    if (!formData.content.trim()) return;

    try {
      setCommenting(true);
      const data: any = { content: formData.content };
      if (parentId) {
        data.parent_id = parentId;
      }
      if (!user) {
        data.author = formData.author || 'Anonymous';
        data.email = formData.email || '';
      }
      
      await blogAPI.addComment(slug!, data);
      
      // Refresh post to get updated comments
      const res = await blogAPI.getPostDetail(slug!);
      setPost(res.data);
      
      // Reset forms
      if (parentId) {
        setReplyForm({ ...replyForm, [parentId]: { content: '', author: '', email: '' } });
        setReplyingTo(null);
      } else {
        setCommentForm({ content: '', author: '', email: '' });
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to add comment', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setCommenting(false);
    }
  };

  const handleCommentLike = async (commentId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await blogAPI.unlikeComment(commentId);
      } else {
        await blogAPI.likeComment(commentId);
      }
      // Refresh post to get updated likes
      const res = await blogAPI.getPostDetail(slug!);
      setPost(res.data);
    } catch (err) {
      console.error('Failed to like comment', err);
    }
  };

  const shareToSocial = (platform: string) => {
    if (!post?.share_url) return;
    const url = encodeURIComponent(post.share_url);
    const title = encodeURIComponent(post.title);

    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      threads: `https://threads.net/intent/post?text=${title}%20${url}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

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

        <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {post.featured_image_url && (
            <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-auto max-h-[600px] object-contain"
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

            <div className="prose prose-lg max-w-none mb-8">
              <ReactMarkdown>{post.body || ''}</ReactMarkdown>
            </div>

            {/* Like and Share Section */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.is_liked
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={18} className={post.is_liked ? 'fill-current' : ''} />
                <span>{post.like_count || 0}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">Share:</span>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={20} />
                </button>
                <button
                  onClick={() => shareToSocial('threads')}
                  className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Share on Threads"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t">
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

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle size={24} />
            Comments {post.comments && `(${post.comments.length})`}
          </h2>

          {/* Comment Form */}
          {commentSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Comment posted successfully!
            </div>
          )}
          <form onSubmit={handleCommentSubmit} className="mb-8 pb-8 border-b">
            <div className="space-y-4">
              {!user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={commentForm.author}
                    onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              )}
              <textarea
                placeholder="Write a comment..."
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                disabled={commenting}
                className="btn-primary px-6 py-2 flex items-center gap-2"
              >
                <Send size={18} />
                {commenting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{comment.author_name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCommentLike(comment.id, comment.is_liked)}
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        comment.is_liked
                          ? 'text-primary'
                          : 'text-gray-500 hover:text-primary'
                      }`}
                    >
                      <Heart size={16} className={comment.is_liked ? 'fill-current' : ''} />
                      <span className="text-xs">{comment.like_count || 0}</span>
                    </button>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-sm text-primary hover:underline mb-3 flex items-center gap-1"
                  >
                    <Reply size={14} />
                    Reply
                  </button>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <form
                      onSubmit={(e) => handleCommentSubmit(e, comment.id)}
                      className="mt-3 mb-4 pl-4 border-l-2 border-gray-200"
                    >
                      <div className="space-y-3">
                        {!user && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Your name"
                              value={replyForm[comment.id]?.author || ''}
                              onChange={(e) =>
                                setReplyForm({
                                  ...replyForm,
                                  [comment.id]: {
                                    ...replyForm[comment.id],
                                    author: e.target.value,
                                    email: replyForm[comment.id]?.email || '',
                                    content: replyForm[comment.id]?.content || '',
                                  },
                                })
                              }
                              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                              required
                            />
                            <input
                              type="email"
                              placeholder="Your email"
                              value={replyForm[comment.id]?.email || ''}
                              onChange={(e) =>
                                setReplyForm({
                                  ...replyForm,
                                  [comment.id]: {
                                    ...replyForm[comment.id],
                                    email: e.target.value,
                                    author: replyForm[comment.id]?.author || '',
                                    content: replyForm[comment.id]?.content || '',
                                  },
                                })
                              }
                              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                              required
                            />
                          </div>
                        )}
                        <textarea
                          placeholder="Write a reply..."
                          value={replyForm[comment.id]?.content || ''}
                          onChange={(e) =>
                            setReplyForm({
                              ...replyForm,
                              [comment.id]: {
                                ...replyForm[comment.id],
                                content: e.target.value,
                                author: replyForm[comment.id]?.author || '',
                                email: replyForm[comment.id]?.email || '',
                              },
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                          required
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={commenting}
                            className="btn-primary px-4 py-2 text-sm flex items-center gap-1"
                          >
                            <Send size={14} />
                            {commenting ? 'Posting...' : 'Post Reply'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyForm({ ...replyForm, [comment.id]: { content: '', author: '', email: '' } });
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
                      {comment.replies.map((reply: any) => (
                        <div key={reply.id}>
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm">{reply.author_name}</h5>
                              <p className="text-xs text-gray-500">
                                {new Date(reply.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCommentLike(reply.id, reply.is_liked)}
                              className={`flex items-center gap-1 px-2 py-1 rounded ${
                                reply.is_liked
                                  ? 'text-primary'
                                  : 'text-gray-500 hover:text-primary'
                              }`}
                            >
                              <Heart size={14} className={reply.is_liked ? 'fill-current' : ''} />
                              <span className="text-xs">{reply.like_count || 0}</span>
                            </button>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
