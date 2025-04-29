/*
  # Fix trigger function return value

  1. Updates
    - Modify the update_modified_column() function to explicitly return NEW
    - This fixes the "control reached end of trigger procedure without RETURN" error
    
  2. Changes
    - Drop and recreate the trigger function with proper return value
    - Recreate the trigger to ensure it uses the updated function
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS update_broad_analise_group_updated_at ON broad_analise_group;

-- Drop and recreate the function with explicit RETURN
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;   -- Explicitly return NEW
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with the fixed function
CREATE TRIGGER update_broad_analise_group_updated_at
    BEFORE UPDATE ON broad_analise_group
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();