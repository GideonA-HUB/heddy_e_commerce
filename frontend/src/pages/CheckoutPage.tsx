import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, MapPin } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderAPI } from '../api';
import apiClient from '../api/client';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    full_name: user?.first_name || '',
    email: user?.email || '',
    phone: user?.userprofile?.phone || '',
    address: user?.userprofile?.address || '',
    city: '',
    state: '',
    postal_code: '',
  });

  const subtotal = cart?.items.reduce((sum, item) => sum + (item.price_at_add || item.menu_item.price) * item.quantity, 0) || 0;
  const shippingFee = 5000;
  const tax = subtotal * 0.075;
  const total = subtotal + shippingFee + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!shippingInfo.full_name || !shippingInfo.phone || !shippingInfo.address) {
      setError('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create order from cart - send data in the format expected by backend
      const orderData = {
        shipping_name: shippingInfo.full_name,
        shipping_email: shippingInfo.email,
        shipping_phone: shippingInfo.phone,
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city || '',
        shipping_state: shippingInfo.state || '',
        shipping_country: 'Nigeria',
        shipping_zip: shippingInfo.postal_code || '',
        special_instructions: '',
        payment_method: 'paystack',
      };

      const orderResponse = await orderAPI.createOrder(orderData);
      const order = orderResponse.data;

      // Initialize Paystack payment
      try {
        const paymentResponse = await apiClient.post('/payments/initialize/', {
          order_id: order.id,
          email: shippingInfo.email,
        });

        if (paymentResponse.data.authorization_url) {
          // Redirect to Paystack payment page
          window.location.href = paymentResponse.data.authorization_url;
        } else {
          setError('Failed to initialize payment. Please try again.');
        }
      } catch (paymentError: any) {
        console.error('Payment initialization error:', paymentError);
        setError(paymentError.response?.data?.error || 'Payment initialization failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/menu')}
            className="text-primary font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Shipping Information */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin size={24} />
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={shippingInfo.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.menu_item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₦{((item.price_at_add || item.menu_item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>₦{shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <p>You will be redirected to Paystack to complete payment securely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
