/*
  # Influencer and Video Generation System

  1. New Tables
    - `influencers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text) - Influencer name
      - `avatar_url` (text, optional) - Profile image URL
      - `age_range` (text) - Age range selection
      - `gender` (text) - Gender selection
      - `ethnicity` (text) - Ethnicity selection
      - `body_type` (text) - Body type selection
      - `hair_style` (text) - Hair style selection
      - `distinctive_features` (text) - Special features
      - `language` (text) - Primary language
      - `dialect` (text, optional) - Language dialect
      - `tone` (text) - Speaking tone
      - `speaking_style` (text) - Communication style
      - `energy_level` (integer) - Energy level 1-10
      - `brand_alignment` (text) - Brand personality alignment
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `product_uploads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `product_code` (text)
      - `product_name` (text)
      - `product_description` (text)
      - `image_url` (text) - Original product image
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `generated_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `product_upload_id` (uuid, references product_uploads)
      - `influencer_id` (uuid, references influencers, optional)
      - `content_type` (text) - 'image' or 'video'
      - `video_type` (text, optional) - 'promotional' or 'story'
      - `content_url` (text) - Generated content URL
      - `style` (text) - Style used for generation
      - `description_prompt` (text, optional) - User's video description
      - `duration` (integer, optional) - Video duration in seconds
      - `call_to_action` (text, optional) - CTA for promotional videos
      - `narrative_tone` (text, optional) - Tone for story videos
      - `approval_status` (text) - 'pending', 'approved', 'rejected'
      - `platforms` (text[]) - Array of platform IDs
      - `created_at` (timestamp)
    
    - `generation_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `session_date` (date)
      - `images_generated` (integer, default 0)
      - `videos_generated` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Ensure users can only manage their own influencers and content

  3. Indexes
    - Add indexes for frequently queried fields to optimize performance
*/

-- Influencers table
CREATE TABLE IF NOT EXISTS influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  age_range text DEFAULT '',
  gender text DEFAULT '',
  ethnicity text DEFAULT '',
  body_type text DEFAULT '',
  hair_style text DEFAULT '',
  distinctive_features text DEFAULT '',
  language text NOT NULL DEFAULT 'Turkish',
  dialect text DEFAULT '',
  tone text DEFAULT 'friendly',
  speaking_style text DEFAULT 'conversational',
  energy_level integer DEFAULT 5,
  brand_alignment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own influencers"
  ON influencers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own influencers"
  ON influencers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own influencers"
  ON influencers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own influencers"
  ON influencers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Product uploads table
CREATE TABLE IF NOT EXISTS product_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_code text NOT NULL,
  product_name text NOT NULL,
  product_description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own product uploads"
  ON product_uploads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own product uploads"
  ON product_uploads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own product uploads"
  ON product_uploads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own product uploads"
  ON product_uploads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Generated content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_upload_id uuid REFERENCES product_uploads(id) ON DELETE CASCADE,
  influencer_id uuid REFERENCES influencers(id) ON DELETE SET NULL,
  content_type text NOT NULL,
  video_type text,
  content_url text NOT NULL,
  style text DEFAULT '',
  description_prompt text DEFAULT '',
  duration integer,
  call_to_action text DEFAULT '',
  narrative_tone text DEFAULT '',
  approval_status text DEFAULT 'pending',
  platforms text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generated content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated content"
  ON generated_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated content"
  ON generated_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Generation sessions table
CREATE TABLE IF NOT EXISTS generation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  images_generated integer DEFAULT 0,
  videos_generated integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, session_date)
);

ALTER TABLE generation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generation sessions"
  ON generation_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation sessions"
  ON generation_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation sessions"
  ON generation_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_influencers_user_id ON influencers(user_id);
CREATE INDEX IF NOT EXISTS idx_product_uploads_user_id ON product_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_product_upload_id ON generated_content(product_upload_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_influencer_id ON generated_content(influencer_id);
CREATE INDEX IF NOT EXISTS idx_generation_sessions_user_date ON generation_sessions(user_id, session_date);
