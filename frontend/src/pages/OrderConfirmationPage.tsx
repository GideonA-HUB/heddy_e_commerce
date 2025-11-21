import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

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

  if (loading) return <SkeletonLoader count={6} />;
  if (!order) return <div className="p-8">Order not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">Thank you! Your order <strong>#{order.id}</strong> has been received.</p>
          <div className="mb-4">
            <h3 className="font-semibold">Items</h3>
            <ul className="list-disc list-inside">
              {order.items?.map((it: any) => (
                <li key={it.id}>{it.menu_item?.name} x {it.quantity} — ₦{it.price?.toLocaleString()}</li>
              ))}
            </ul>
          </div>
          <div className="mb-2">Total: <strong>₦{order.total?.toLocaleString()}</strong></div>
          <div className="text-sm text-gray-600">We will email you updates about delivery and tracking.</div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
