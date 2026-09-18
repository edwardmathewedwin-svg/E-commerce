import { createClient } from '@supabase/supabase-js';
import type { Product, UserProfile, OrderHistoryItem } from '@/types';

// ──────────────────────────────────────────────────────────
// INITIALIZE SUPABASE
// ──────────────────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Environment Variables! Check your .env file.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ──────────────────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<UserProfile> {
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) throw authError;

  const fallbackName = email.split('@')[0];

  return {
    name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
    email: email,
    role: 'Customer'
  };
}

export async function apiSignup(name: string, email: string, password: string): Promise<UserProfile> {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) throw authError;

  if (authData.user) {
    await supabase.from('customers').insert([
      { 
        customer_name: name, 
        Email: email, 
        phone_number: '555-0100' 
      }
    ]);
  }

  return { name, email, role: 'Customer' };
}

export async function apiResetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function apiLogout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ──────────────────────────────────────────────────────────
// PROFILE
// ──────────────────────────────────────────────────────────

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) return null;

  const email = session.user.email;
  const fallbackName = email.split('@')[0];

  const { data: profile } = await supabase
    .from('customers')
    .select('customer_name, Email')
    .eq('Email', email)
    .maybeSingle();

  return {
    name: profile?.customer_name || (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1)),
    email: email,
    role: 'Customer'
  };
}

// ──────────────────────────────────────────────────────────
// PRODUCTS
// ──────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*');
    
  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw error;
  }

  return (data || []).map((item: any) => ({
    id: item.product_id,
    name: item.product_name,
    price: item.price,
    image: item.image_url,
    image_url: item.image_url,
    category_id: item.category_id,
  }));
}

// ──────────────────────────────────────────────────────────
// LIBRARY / ORDER DETAILS
// ──────────────────────────────────────────────────────────

export async function fetchLibraryGames(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('order_details')
    .select('products:product_id (*)');

  if (error) {
    console.error("Failed to fetch library games:", error.message);
    return [];
  }

  const uniqueProductsMap = new Map();
  (data || []).forEach((item: any) => {
    const p = item.products;
    if (p && !uniqueProductsMap.has(p.product_id)) {
      uniqueProductsMap.set(p.product_id, {
        id: p.product_id,
        name: p.product_name,
        price: p.price,
        image: p.image_url,
        image_url: p.image_url,
        category_id: p.category_id,
      });
    }
  });

  return Array.from(uniqueProductsMap.values());
}

export async function deleteLibraryGame(productId: number | string): Promise<void> {
  const { error } = await supabase
    .from('order_details')
    .delete()
    .eq('product_id', productId);

  if (error) {
    console.error("Failed to delete game from library:", error.message);
    throw error;
  }
}

// ──────────────────────────────────────────────────────────
// ORDERS / ACTIVITY FEED
// ──────────────────────────────────────────────────────────

export async function fetchOrderHistory(): Promise<OrderHistoryItem[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*');

  if (error) {
    console.error("Failed to fetch orders:", error.message);
    throw error;
  }
  
  return (data || []).map((order: any) => ({
    id: order.order_id,
    date: order.order_date || new Date().toISOString(),
    total: order.total_amount,
    status: order.status
  }));
}

// ──────────────────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<any[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
    
  if (error) {
    console.error("Failed to fetch categories:", error.message);
    throw error;
  }

  return data || [];
}