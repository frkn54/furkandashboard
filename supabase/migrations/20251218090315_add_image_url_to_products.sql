/*
  # Add image URL column to products table

  1. Changes
    - Add `image_url` column to `products` table
      - Type: text
      - Nullable: true (allows existing products without images)
      - Default: placeholder image for fashion products
  
  2. Notes
    - Existing products will get a default placeholder image
    - New products can specify their own image URLs
    - Falls back to placeholder if no image is provided
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE products ADD COLUMN image_url text DEFAULT 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop';
  END IF;
END $$;