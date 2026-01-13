import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';
import { Package, MapPin, CheckCircle, Clock, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrderDetail(Number(id));
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'paid':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'dispatched':
        return <Truck size={20} className="text-blue-600" />;
      case 'processing':
        return <Clock size={20} className="text-yellow-600" />;
      default:
        return <Package size={20} className="text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'payment_pending': 'Payment Pending',
      'paid': 'Paid',
      'processing': 'Processing',
      'ready_for_pickup': 'Ready for Pickup',
      'dispatched': 'Dispatched',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
    };
    return statusMap[status] || status;
  };

  if (loading) return <SkeletonLoader count={6} />;
  if (!order) return <div className="p-8">Order not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Order Details</h1>
          
          {/* Order Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                  <p className="text-sm text-gray-600">Order #{order.order_number}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full border-2 font-semibold text-sm ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            
            {order.current_location && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <MapPin size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Current Location</p>
                    <p className="text-blue-700">{order.current_location}</p>
                  </div>
                </div>
              </div>
            )}

            {order.tracking_number && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <p className="font-mono font-semibold text-gray-900">{order.tracking_number}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((it: any) => (
                <div key={it.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-900">{it.item_name}</p>
                    <p className="text-sm text-gray-600">Quantity: {it.quantity}</p>
                  </div>
                  <p className="font-semibold text-primary">₦{it.subtotal?.toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">₦{order.shipping_fee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (7.5%)</span>
                  <span className="font-semibold">₦{order.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
                  <span>Total</span>
                  <span className="text-primary">₦{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> {order.shipping_name}</p>
              <p><strong>Email:</strong> {order.shipping_email}</p>
              <p><strong>Phone:</strong> {order.shipping_phone}</p>
              <p><strong>Address:</strong> {order.shipping_address}</p>
              <p><strong>City:</strong> {order.shipping_city}</p>
              <p><strong>State:</strong> {order.shipping_state}</p>
              <p><strong>Country:</strong> {order.shipping_country}</p>
              {order.delivery_date && (
                <p><strong>Delivery Date:</strong> {new Date(order.delivery_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Back to Menu Link */}
          <div className="text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
