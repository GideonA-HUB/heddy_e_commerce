import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItem = useCartStore((state) => state.updateItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cart?.items.reduce((sum, item) => sum + (item.price_at_add || item.menu_item.price) * item.quantity, 0) || 0;
  const deliveryFee = 4000; // Fixed or dynamic based on location
  const tax = subtotal * 0.075; // 7.5% tax
  const total = subtotal + deliveryFee + tax;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h1 className="heading-2 mb-4">Your Cart is Empty</h1>
            <p className="text-body mb-8">Start shopping to add items to your cart</p>
            <Link
              to="/menu"
              className="btn-primary inline-flex items-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="heading-2 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {cart.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex flex-col sm:flex-row gap-4 p-4 sm:p-6 ${
                    index !== cart.items.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  {/* Item Image */}
                  <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.menu_item.image_url || (item.menu_item.images?.[0]?.image_url || item.menu_item.images?.[0]?.image) ? (
                      <img
                        src={item.menu_item.image_url || item.menu_item.images?.[0]?.image_url || item.menu_item.images?.[0]?.image}
                        alt={item.menu_item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"><span class="text-gray-500 text-sm">No image</span></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <span className="text-gray-500 text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">{item.menu_item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.menu_item.category?.name || 'Uncategorized'}
                    </p>
                    <p className="text-primary font-bold text-lg">
                      ₦{(item.price_at_add || item.menu_item.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                      <motion.button
                        onClick={async () => await updateItem(item.id, Math.max(1, item.quantity - 1))}
                        className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                        aria-label="Decrease quantity"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus size={18} />
                      </motion.button>
                      <span className="font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <motion.button
                        onClick={async () => await updateItem(item.id, item.quantity + 1)}
                        className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                        aria-label="Increase quantity"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus size={18} />
                      </motion.button>
                    </div>

                    {/* Item Total & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-lg text-gray-900">
                        ₦{((item.price_at_add || item.menu_item.price) * item.quantity).toLocaleString()}
                      </p>
                      <motion.button
                        onClick={async () => await removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        aria-label="Remove item"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="p-4 sm:p-6 bg-gray-50 border-t">
                <motion.button
                  onClick={async () => await clearCart()}
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Cart
                </motion.button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 lg:top-32">
              <h2 className="heading-3 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    ₦{deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (7.5%)</span>
                  <span className="font-semibold">
                    ₦{tax.toLocaleString()}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold text-xl text-gray-900">Total</span>
                  <span className="font-bold text-xl text-primary">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/menu"
                className="block text-center text-primary hover:text-primary-600 font-semibold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
