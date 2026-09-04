import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, MapPin, Lock } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderAPI } from '../api';
import apiClient from '../api/client';
import SEO from '../components/SEO';
import { formatNGN } from '../utils/format';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const user = useAuthStore((s) => s.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paystack'>('paystack');

  const [shippingInfo, setShippingInfo] = useState({
    full_name: user?.first_name
      ? `${user.first_name} ${user.last_name || ''}`.trim()
      : '',
    email: user?.email || '',
    phone: user?.userprofile?.phone || '',
    address: user?.userprofile?.address || '',
    city: user?.userprofile?.city || '',
    state: user?.userprofile?.state || '',
    country: 'Nigeria',
    postal_code: user?.userprofile?.zip_code || '',
    order_notes: '',
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal =
    cart?.items.reduce(
      (sum, item) =>
        sum + (item.price_at_add || item.menu_item.price) * item.quantity,
      0
    ) || 0;
  const deliveryFee = 4000;
  const tax = subtotal * 0.075;
  const total = subtotal + deliveryFee + tax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shippingInfo.full_name ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address
    ) {
      setError('Please fill in all required fields');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const orderData = {
        shipping_name: shippingInfo.full_name,
        shipping_email: shippingInfo.email,
        shipping_phone: shippingInfo.phone,
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city || '',
        shipping_state: shippingInfo.state || '',
        shipping_country: shippingInfo.country || 'Nigeria',
        shipping_zip: shippingInfo.postal_code || '',
        special_instructions: shippingInfo.order_notes || '',
        payment_method: paymentMethod,
      };

      const orderResponse = await orderAPI.createOrder(orderData);
      const order = orderResponse.data;

      const paymentResponse = await apiClient.post('/payments/initialize/', {
        order_id: order.id,
        email: shippingInfo.email,
      });

      if (paymentResponse.data.authorization_url) {
        window.location.href = paymentResponse.data.authorization_url;
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { detail?: string; error?: string } } };
      setError(
        ax.response?.data?.detail ||
          ax.response?.data?.error ||
          'Failed to create order'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Your cart is empty</p>
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="font-semibold text-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Checkout"
        description="Secure guest checkout — HEDDIEKITCHEN. Payments in NGN via Paystack."
      />
      <div className="container mx-auto max-w-6xl py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Checkout</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Lock size={14} />
            Secure guest checkout · Payments in NGN
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Delivery Details */}
            <div className="space-y-6 lg:col-span-3">
              {error && (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="shrink-0 text-primary" size={20} />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
                  <MapPin size={20} className="text-primary" />
                  Delivery Details
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={shippingInfo.full_name}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={shippingInfo.postal_code}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Order Notes
                    </label>
                    <textarea
                      name="order_notes"
                      value={shippingInfo.order_notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Allergies, delivery instructions…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold">Payment Method</h2>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary bg-primary/5 px-4 py-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">Paystack (NGN)</span>
                </label>
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/shipping" className="font-medium text-primary hover:underline">
                    Terms, Privacy & Refund Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary w-full py-3.5 disabled:opacity-50 lg:hidden"
              >
                {isProcessing ? 'Processing…' : `Pay ${formatNGN(total)}`}
              </button>
            </div>

            {/* Order Summary — sticky */}
            <div className="lg:col-span-2">
              <div className="sticky top-32 rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                <h2 className="mb-5 text-lg font-bold">Order Summary</h2>

                <ul className="mb-5 max-h-64 space-y-3 overflow-y-auto">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 text-sm">
                      <span className="min-w-0 flex-1 text-gray-700">
                        <span className="font-medium text-gray-900">
                          {item.menu_item.name}
                        </span>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </span>
                      <span className="shrink-0 font-semibold">
                        {formatNGN(
                          (item.price_at_add || item.menu_item.price) * item.quantity
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatNGN(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery fee</span>
                    <span>{formatNGN(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (7.5%)</span>
                    <span>{formatNGN(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatNGN(total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  You will be redirected to Paystack to complete payment securely.
                </p>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary mt-5 hidden w-full py-3.5 disabled:opacity-50 lg:block"
                >
                  {isProcessing ? 'Processing…' : `Pay ${formatNGN(total)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
