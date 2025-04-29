/*
  # Add label fields to messages table

  1. Schema Changes
    - Add `label_id` (text) - ID of the selected label
    - Add `label_name` (text) - Name of the selected label
    
  2. Updates
    - Add columns for storing label information
    - These fields allow messages to be categorized by labels
*/

-- Add label_id field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'label_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN label_id text;
  END IF;
END $$;

-- Add label_name field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'label_name'
  ) THEN
    ALTER TABLE messages ADD COLUMN label_name text;
  END IF;
END $$;