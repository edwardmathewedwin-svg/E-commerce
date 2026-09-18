export interface Product {
  id: string | number;
  name: string;
  price: number;
  image_url: string;
  banner_url?: string;
  description?: string;
  category?: string;
  tag?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
}

export interface OrderHistoryItem {
  id: string | number;
  product_name: string;
  price: number;
  created_at: string;
  status?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
