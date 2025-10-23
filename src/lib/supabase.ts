import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  barcode: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'returned';
  order_date: string;
  created_at: string;
};

export type CashFlow = {
  id: string;
  user_id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  note: string;
  created_at: string;
};

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
};

export type Influencer = {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  age_range: string;
  gender: string;
  ethnicity: string;
  body_type: string;
  hair_style: string;
  distinctive_features: string;
  language: string;
  dialect: string;
  tone: string;
  speaking_style: string;
  energy_level: number;
  brand_alignment: string;
  created_at: string;
  updated_at: string;
};

export type ProductUpload = {
  id: string;
  user_id: string;
  product_code: string;
  product_name: string;
  product_description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type GeneratedContent = {
  id: string;
  user_id: string;
  product_upload_id: string;
  influencer_id?: string;
  content_type: 'image' | 'video';
  video_type?: 'promotional' | 'story';
  content_url: string;
  style: string;
  description_prompt: string;
  duration?: number;
  call_to_action: string;
  narrative_tone: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  platforms: string[];
  created_at: string;
};

export type GenerationSession = {
  id: string;
  user_id: string;
  session_date: string;
  images_generated: number;
  videos_generated: number;
  created_at: string;
  updated_at: string;
};
