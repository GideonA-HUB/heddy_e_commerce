import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { profileAPI, orderAPI } from '../api';
import { UserProfile, Order } from '../types';
import { Camera, Upload, Loader2, Calendar, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const [profileResponse, ordersResponse] = await Promise.all([
          profileAPI.getProfile(),
          orderAPI.getOrders(),
        ]);
        
        // Handle paginated response for orders
        const ordersData = ordersResponse.data.results || ordersResponse.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProfile(profileResponse.data);
      } catch (err: any) {
        console.error('Failed to fetch profile data:', err);
        setError(err.response?.data?.detail || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const response = await profileAPI.uploadAvatar(file);
      setProfile(response.data);
      
      // Update auth store with new profile
      if (user) {
        setUser(user, response.data, useAuthStore.getState().token);
      }
    } catch (err: any) {
      console.error('Failed to upload avatar:', err);
      setError(err.response?.data?.detail || 'Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      'payment_pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Payment Pending' },
      'processing': { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Processing' },
      'shipped': { color: 'bg-purple-100 text-purple-800', icon: Package, label: 'Shipped' },
      'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
    };

    const config = statusConfig[status.toLowerCase()] || { color: 'bg-gray-100 text-gray-800', icon: Package, label: status };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">You're not signed in</h2>
          <p className="text-gray-600">Please sign in to view your profile and orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const avatarUrl = profile?.avatar_url || profile?.avatar;
  const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">My Profile</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-4 border-gray-200">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm sm:text-base">No avatar</span>
                )}
              </div>
              
              {/* Upload Button */}
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 sm:right-2 bg-primary text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Upload profile picture"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Camera size={18} />
                )}
              </motion.button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayName}</h3>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">Phone:</span>{' '}
                  <span className="text-gray-600">{profile?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Address:</span>{' '}
                  <span className="text-gray-600">{profile?.address || 'N/A'}</span>
                </div>
                {profile?.city && (
                  <div>
                    <span className="font-semibold text-gray-700">City:</span>{' '}
                    <span className="text-gray-600">{profile.city}</span>
                  </div>
                )}
                {profile?.state && (
                  <div>
                    <span className="font-semibold text-gray-700">State:</span>{' '}
                    <span className="text-gray-600">{profile.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package size={24} />
            Order History
          </h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link to="/menu" className="text-primary hover:underline font-semibold">
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg text-gray-900">
                          Order #{order.order_number}
                        </h4>
                        {getStatusBadge(order.status)}
                        {order.payment_status && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.payment_status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {order.items_count !== undefined && (
                          <span>{order.items_count} item{order.items_count !== 1 ? 's' : ''}</span>
                        )}
                        {order.shipping_city && (
                          <span>{order.shipping_city}</span>
                        )}
                      </div>
                      
                      <p className="text-lg font-bold text-primary">
                        ₦{order.total?.toLocaleString() || '0.00'}
                      </p>
                    </div>
                    
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      View Details
                      <Package size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
