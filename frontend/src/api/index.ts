// API service functions
import apiClient from './client';
import {
  MenuItem,
  MenuCategory,
  Cart,
  Order,
  User,
  AuthResponse,
  PaginatedResponse,
  BlogPost,
  MealPlan,
} from '../types';

// Auth APIs
export const authAPI = {
  register: (data: { username: string; email: string; password: string; first_name?: string; last_name?: string }) =>
    apiClient.post<AuthResponse>('/auth/register/', data),
  login: (data: { username: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login/', data),
  logout: () => apiClient.post('/auth/logout/'),
  getCurrentUser: () => apiClient.get<{ user: User; profile: any }>('/auth/me/'),
};

// Menu APIs
export const menuAPI = {
  getCategories: () =>
    apiClient.get<PaginatedResponse<MenuCategory>>('/menu/categories/'),
  getMenuItems: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<MenuItem>>('/menu/items/', { params }),
  getMenuItemDetail: (id: number) =>
    apiClient.get<MenuItem>(`/menu/items/${id}/`),
  addReview: (menuItemId: number, data: { rating: number; title: string; comment: string }) =>
    apiClient.post(`/menu/items/${menuItemId}/add_review/`, data),
};

// Cart APIs
export const cartAPI = {
  getCart: () => apiClient.get<Cart>('/orders/cart/list_cart/'),
  addItem: (data: { menu_item_id: number; quantity: number; special_instructions?: string }) =>
    apiClient.post('/orders/cart/add_item/', data),
  updateItem: (data: { cart_item_id: number; quantity: number }) =>
    apiClient.put('/orders/cart/update_item/', data),
  removeItem: (cartItemId: number) =>
    apiClient.delete('/orders/cart/remove_item/', { data: { cart_item_id: cartItemId } }),
  clearCart: () => apiClient.post('/orders/cart/clear_cart/'),
};

// Order APIs
export const orderAPI = {
  createOrder: (data: any) =>
    apiClient.post<Order>('/orders/create_order/', data),
  getOrders: () =>
    apiClient.get<PaginatedResponse<Order>>('/orders/'),
  getOrderDetail: (id: number) =>
    apiClient.get<Order>(`/orders/${id}/`),
  trackOrder: (id: number) =>
    apiClient.get<{ status: string; tracking_number: string }>(`/orders/${id}/tracking/`),
};

// Blog APIs
export const blogAPI = {
  getPosts: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<BlogPost>>('/blog/', { params }),
  getPostDetail: (slug: string) =>
    apiClient.get<BlogPost>(`/blog/${slug}/`),
};

// Meal Plans APIs
export const mealplansAPI = {
  getPlans: () =>
    apiClient.get<PaginatedResponse<MealPlan>>('/mealplans/'),
};

// Catering APIs
export const cateringAPI = {
  getPackages: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<any>>('/catering/packages/', { params }),
  getPackageDetail: (id: number) => apiClient.get(`/catering/packages/${id}/`),
  enquire: (data: { package_id: number; name: string; email: string; phone?: string; message?: string }) =>
    apiClient.post('/catering/enquiries/', data),
};

// Shipping APIs
export const shippingAPI = {
  getDestinations: () => apiClient.get('/shipping/destinations/'),
  calculateQuote: (data: { destination_id: number; weight_kg?: number; dimensions?: any }) =>
    apiClient.post('/shipping/orders/calculate_quote/', data),
  createShippingOrder: (data: any) => apiClient.post('/shipping/orders/', data),
  track: (id: number) => apiClient.get(`/shipping/orders/${id}/tracking/`),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email: string) =>
    apiClient.post('/auth/newsletter/', { email }),
};

// Contact API
export const contactAPI = {
  submit: (data: { name: string; email: string; phone?: string; message: string }) =>
    apiClient.post('/auth/contact/', data),
};

// Core/Site Assets API
export const coreAPI = {
  getSiteAssets: () =>
    apiClient.get<PaginatedResponse<{ id: number; name: string; favicon_url?: string; logo_primary_url?: string; logo_light_url?: string; logo_dark_url?: string }>>('/auth/assets/'),
};

export default {
  authAPI,
  menuAPI,
  cartAPI,
  orderAPI,
  blogAPI,
  mealplansAPI,
  newsletterAPI,
  contactAPI,
  coreAPI,
};
