/*
  # Add photo URL and type fields to broadcast group table

  1. Schema Changes
    - Add `photo_url` (text) - URL for the broadcast photo
    - Add `broadcast_type` (text) - Type of broadcast (3d, 7d, 15d, mensal)
    
  2. Updates
    - Add column for storing photo URLs
    - Add column for broadcast type categorization
*/

-- Add photo_url field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'broad_analise_group' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE broad_analise_group ADD COLUMN photo_url text;
  END IF;
END $$;

-- Add broadcast_type field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'broad_analise_group' AND column_name = 'broadcast_type'
  ) THEN
    ALTER TABLE broad_analise_group ADD COLUMN broadcast_type text;
  END IF;
END $$;

-- Create unique index on broadcast_type to ensure only one broadcast per type
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'broad_analise_group_broadcast_type_unique_idx'
  ) THEN
    CREATE UNIQUE INDEX broad_analise_group_broadcast_type_unique_idx ON broad_analise_group (broadcast_type)
    WHERE broadcast_type IS NOT NULL;
  END IF;
END $$;