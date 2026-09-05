import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { profileAPI, orderAPI } from '../api';
import { UserProfile, Order } from '../types';
import {
  Camera,
  Loader2,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatNGN } from '../utils/format';
import SEO from '../components/SEO';

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

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const response = await profileAPI.uploadAvatar(file);
      setProfile(response.data);

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

  const statusMeta = (status: string) => {
    const map: Record<string, { color: string; icon: typeof Package; label: string }> = {
      payment_pending: { color: 'text-amber-600 bg-amber-50', icon: Clock, label: 'Payment pending' },
      processing: { color: 'text-sky-700 bg-sky-50', icon: Package, label: 'Processing' },
      shipped: { color: 'text-violet-700 bg-violet-50', icon: Package, label: 'Shipped' },
      delivered: { color: 'text-emerald-700 bg-emerald-50', icon: CheckCircle, label: 'Delivered' },
      cancelled: { color: 'text-red-700 bg-red-50', icon: XCircle, label: 'Cancelled' },
    };
    return (
      map[status.toLowerCase()] || {
        color: 'text-gray-600 bg-gray-100',
        icon: Package,
        label: status,
      }
    );
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in to continue</h1>
          <p className="mt-2 text-gray-600">View your profile and order history.</p>
          <Link to="/login" className="btn-primary mt-6 inline-flex">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  const avatarUrl = profile?.avatar_url || profile?.avatar;
  const displayName =
    `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <SEO title="My Profile — HeddieKitchen" description="Manage your HeddieKitchen profile and orders." />

      {/* Header band */}
      <div className="relative overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(220,38,38,0.35),_transparent_55%)]" />
        <div className="container relative z-10 mx-auto px-4 py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">My Profile</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Identity */}
        <section className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-secondary text-2xl font-bold text-white ring-4 ring-white shadow-lg sm:h-32 sm:w-32">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span>{initials || '?'}</span>
              )}
            </div>
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Upload profile picture"
              aria-label="Upload profile picture"
            >
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:pt-2 sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{displayName}</h2>
            <p className="mt-1 text-sm text-gray-500">@{user.username}</p>

            <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <Mail size={15} className="shrink-0 text-primary" />
                <span className="truncate">{user.email}</span>
              </li>
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <Phone size={15} className="shrink-0 text-primary" />
                <span>{profile?.phone || 'No phone on file'}</span>
              </li>
              <li className="flex items-start justify-center gap-2 sm:justify-start">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  {[profile?.address, profile?.city, profile?.state].filter(Boolean).join(', ') ||
                    'No address on file'}
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Orders */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                History
              </p>
              <h3 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">Orders</h3>
            </div>
            <span className="text-sm text-gray-500">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={40} className="mx-auto text-gray-300" />
              <p className="mt-4 font-medium text-gray-900">No orders yet</p>
              <p className="mt-1 text-sm text-gray-500">When you place an order, it will show up here.</p>
              <Link to="/menu" className="btn-primary mt-6 inline-flex">
                Browse menu
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.map((order, index) => {
                const meta = statusMeta(order.status);
                const StatusIcon = meta.icon;
                return (
                  <motion.li
                    key={order.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3) }}
                    className="group"
                  >
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="flex flex-col gap-3 py-5 transition sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            #{order.order_number}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${meta.color}`}
                          >
                            <StatusIcon size={12} />
                            {meta.label}
                          </span>
                          {order.payment_status && (
                            <span
                              className={`text-[11px] font-medium ${
                                order.payment_status === 'paid'
                                  ? 'text-emerald-600'
                                  : 'text-amber-600'
                              }`}
                            >
                              {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                          {order.items?.length
                            ? ` · ${order.items.length} item${order.items.length !== 1 ? 's' : ''}`
                            : ''}
                          {order.shipping_city ? ` · ${order.shipping_city}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span className="text-lg font-bold text-gray-900">
                          {formatNGN(order.total ?? 0)}
                        </span>
                        <ChevronRight
                          size={18}
                          className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
