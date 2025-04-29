import { SupabaseClient } from '@supabase/supabase-js';
import { BroadcastGroup, StorageResponse } from '../types/broadcast';
import { DB_TABLES, STORAGE } from '../config/constants';

export class BroadcastService {
  private supabase: SupabaseClient;
  
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Check if storage bucket is available
   */
  async checkStorageAvailability(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.storage.listBuckets();
      
      if (error || !data || data.length === 0) {
        console.warn('Supabase storage is not available or no buckets exist');
        return false;
      }
      
      const bucketExists = data.some(bucket => bucket.name === STORAGE.BUCKET_NAME);
      
      if (!bucketExists) {
        console.warn(`The "${STORAGE.BUCKET_NAME}" bucket does not exist in your Supabase project`);
      }
      
      return bucketExists;
    } catch (err) {
      console.error('Error checking storage availability:', err);
      return false;
    }
  }

  /**
   * Fetch all broadcast groups
   */
  async fetchBroadcastGroups(): Promise<{ data: BroadcastGroup[] | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.BROADCAST_GROUP)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error fetching broadcast groups:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Upload photo to storage
   */
  async uploadPhoto(photoFile: File): Promise<StorageResponse> {
    try {
      // Create a unique file path for the image
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${STORAGE.FOLDER_PATH}/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await this.supabase.storage
        .from(STORAGE.BUCKET_NAME)
        .upload(filePath, photoFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = this.supabase.storage
        .from(STORAGE.BUCKET_NAME)
        .getPublicUrl(filePath);
        
      return { publicUrl: data.publicUrl, error: null };
    } catch (err) {
      console.error('Error uploading photo:', err);
      return { 
        publicUrl: null, 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Create a new broadcast group
   */
  async createBroadcastGroup(group: Omit<BroadcastGroup, 'id' | 'created_at'>): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.BROADCAST_GROUP)
        .insert([group]);

      if (error) throw error;
      
      return { error: null };
    } catch (err) {
      console.error('Error creating broadcast group:', err);
      return { 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Update an existing broadcast group
   */
  async updateBroadcastGroup(id: number, updates: Partial<BroadcastGroup>): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.BROADCAST_GROUP)
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      return { error: null };
    } catch (err) {
      console.error('Error updating broadcast group:', err);
      return { 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Delete a broadcast group
   */
  async deleteBroadcastGroup(id: number): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.BROADCAST_GROUP)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting broadcast group:', err);
      return { 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }
}