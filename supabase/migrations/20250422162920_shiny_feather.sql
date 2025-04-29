/*
  # Add label color field to messages table

  1. Schema Changes
    - Add `label_color` (text) - Color of the message label
    
  2. Updates
    - Add column for storing label colors for messages
*/

-- Add label_color field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'label_color'
  ) THEN
    ALTER TABLE messages ADD COLUMN label_color text;
  END IF;
END $$;