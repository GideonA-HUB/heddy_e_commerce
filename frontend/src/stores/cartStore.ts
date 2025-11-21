// Zustand store for cart
import { create } from 'zustand';
import { Cart } from '../types';
import { cartAPI } from '../api';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  setCart: (cart: Cart | null) => void;
  addItem: (menuItemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,
  setCart: (cart) => set({ cart }),
  addItem: async (menuItemId: number, quantity: number) => {
    try {
      set({ isLoading: true, error: null });
      await cartAPI.addItem({ menu_item_id: menuItemId, quantity });
      await get().fetchCart();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add item to cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  removeItem: async (itemId: number) => {
    try {
      set({ isLoading: true, error: null });
      await cartAPI.removeItem(itemId);
      await get().fetchCart();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove item from cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateItem: async (itemId: number, quantity: number) => {
    try {
      set({ isLoading: true, error: null });
      await cartAPI.updateItem({ cart_item_id: itemId, quantity });
      await get().fetchCart();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update item' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      await cartAPI.clearCart();
      set({ cart: null });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to clear cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await cartAPI.getCart();
      set({ cart: response.data });
    } catch (error: any) {
      // If 404, cart doesn't exist yet - that's okay
      if (error.response?.status !== 404) {
        set({ error: error.response?.data?.message || 'Failed to fetch cart' });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
