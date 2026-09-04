import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { formatNGN } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const isOpen = useUIStore((s) => s.isCartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);
  const cart = useCartStore((s) => s.cart);
  const isLoading = useCartStore((s) => s.isLoading);
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen, fetchCart]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  const goCheckout = () => {
    close();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            className="drawer-panel right-0 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Your Bag</h2>
                {items.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {cart?.item_count ?? items.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close bag"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {isLoading && items.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-500">Loading…</p>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag size={40} className="mb-3 text-gray-300" />
                  <p className="mb-1 font-medium text-gray-900">Your bag is empty</p>
                  <p className="mb-6 text-sm text-gray-500">Add dishes from the menu to get started.</p>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      navigate('/menu');
                    }}
                    className="btn-primary text-sm"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => {
                    const price = item.price_at_add || item.menu_item.price;
                    return (
                      <li key={item.id} className="flex gap-3">
                        <Link
                          to={`/menu/${item.menu_item.id}`}
                          onClick={close}
                          className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100"
                        >
                          {item.menu_item.image_url ? (
                            <img
                              src={item.menu_item.image_url}
                              alt={item.menu_item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/menu/${item.menu_item.id}`}
                              onClick={close}
                              className="truncate text-sm font-semibold text-gray-900 hover:text-primary"
                            >
                              {item.menu_item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 p-1 text-gray-400 hover:text-primary"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-sm font-bold text-gray-900">
                            {formatNGN(price)}
                          </p>
                          <div className="mt-2 inline-flex items-center rounded-full border border-gray-200">
                            <button
                              type="button"
                              className="p-1.5 text-gray-600 hover:text-primary disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              onClick={() => updateItem(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-1.5 text-gray-600 hover:text-primary"
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-lg font-bold text-primary">{formatNGN(total)}</span>
                </div>
                <p className="mb-3 text-xs text-gray-500">Payments in NGN. Delivery calculated at checkout.</p>
                <button type="button" onClick={goCheckout} className="btn-primary w-full">
                  Proceed to Checkout
                </button>
                <Link
                  to="/cart"
                  onClick={close}
                  className="mt-2 block w-full py-2 text-center text-sm font-medium text-gray-600 hover:text-primary"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
