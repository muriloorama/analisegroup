/*
  # Add verification_code field to the messages table

  1. Schema Changes
    - Add `verification_code` (text) - Field to store verification codes for message validation
    
  2. Updates
    - Add column for storing verification codes
*/

-- Add verification_code field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'verification_code'
  ) THEN
    ALTER TABLE messages ADD COLUMN verification_code text;
  END IF;
END $$;