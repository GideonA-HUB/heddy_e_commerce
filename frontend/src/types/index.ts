// Core types for HEDDIEKITCHEN frontend

export interface SiteAsset {
  id: number;
  name: string;
  favicon_url?: string;
  logo_primary_url?: string;
  logo_light_url?: string;
  logo_dark_url?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  userprofile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user: User;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  role: 'customer' | 'staff' | 'chef' | 'admin';
  avatar?: string;
  avatar_url?: string;
  newsletter_subscribed: boolean;
  created_at?: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface MenuItemImage {
  id: number;
  image: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

export interface MenuItemReview {
  id: number;
  rating: number;
  title: string;
  comment: string;
  username: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category?: MenuCategory;
  category_name?: string;
  image: string;
  image_url: string;
  prep_time_minutes: number;
  is_available: boolean;
  is_featured: boolean;
  average_rating?: number;
  created_at: string;
  images?: MenuItemImage[];
  reviews?: MenuItemReview[];
}

export interface CartItem {
  id: number;
  menu_item: MenuItem;
  quantity: number;
  price_at_add: number;
  subtotal: number;
  special_instructions: string;
  added_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  item_count: number;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions: string;
}

export interface Order {
  id: number;
  order_number: string;
  order_type: 'single' | 'subscription' | 'catering' | 'shipping';
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  discount: number;
  total: number;
  shipping_city: string;
  delivery_date?: string;
  payment_reference?: string;
  tracking_number?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface MealPlan {
  id: number;
  title: string;
  slug: string;
  plan_type: string;
  period: 'weekly' | 'monthly';
  price: number;
  description: string;
  features: string[];
  is_customizable: boolean;
}

export interface CateringPackage {
  id: number;
  category: string;
  tier: 'bronze' | 'silver' | 'gold';
  title: string;
  description: string;
  min_guests: number;
  max_guests: number;
  price_per_head: number;
  menu_options: string[];
  images: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: string;
  category?: string;
  featured_image: string;
  excerpt: string;
  body: string;
  is_published: boolean;
  publish_date?: string;
  view_count: number;
  meta_description?: string;
  meta_keywords?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  profile?: UserProfile;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
  image_count: number;
}

export interface GalleryImage {
  id: number;
  category: number;
  category_name: string;
  image: string;
  image_url: string;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
}

export interface TrainingPackage {
  id: number;
  package_type: '6months' | '3months' | '1month' | '2weeks';
  package_type_display: string;
  title: string;
  slug: string;
  description: string;
  price?: number;
  is_for_beginners: boolean;
  is_advanced: boolean;
  is_upgrade: boolean;
  is_housewife: boolean;
  features: string[];
  includes_theory: boolean;
  theory_topics: string[];
  includes_pastries: boolean;
  includes_baking: boolean;
  includes_local_dishes: boolean;
  includes_intercontinental: boolean;
  includes_advanced_cooking: boolean;
  includes_upscale_dining: boolean;
  includes_event_catering: boolean;
  includes_management: boolean;
  includes_general_kitchen_mgmt: boolean;
  includes_popular_african_menu: boolean;
  includes_certification: boolean;
  is_active: boolean;
  display_order: number;
  image?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingEnquiry {
  id?: number;
  package?: number;
  package_title?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  wants_to_learn: boolean;
  created_at?: string;
}
