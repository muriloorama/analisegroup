import { SupabaseClient } from '@supabase/supabase-js';
import { Message, MessageWithId, MessageMediaType } from '../types/message';
import { STORAGE } from '../config/constants';

export class MessageService {
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
   * Fetch all messages
   */
  async fetchMessages(): Promise<{ data: MessageWithId[] | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error fetching messages:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Upload media file to storage
   */
  async uploadMedia(
    mediaFile: File, 
    mediaType: MessageMediaType
  ): Promise<{ publicUrl: string | null; error: Error | null }> {
    try {
      // Create a unique file path for the media
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const folderPath = `message-${mediaType}`;
      const filePath = `${folderPath}/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await this.supabase.storage
        .from(STORAGE.BUCKET_NAME)
        .upload(filePath, mediaFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = this.supabase.storage
        .from(STORAGE.BUCKET_NAME)
        .getPublicUrl(filePath);
        
      return { publicUrl: data.publicUrl, error: null };
    } catch (err) {
      console.error(`Error uploading ${mediaType}:`, err);
      return { 
        publicUrl: null, 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Create a new message
   */
  async createMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase
        .from('messages')
        .insert([message]);

      if (error) throw error;
      
      return { error: null };
    } catch (err) {
      console.error('Error creating message:', err);
      return { 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Send message with verification code to the external webhook
   */
  async sendMessageWithVerification(
    data: Omit<Message, 'id' | 'created_at'> & { verification_code: string }
  ): Promise<{ error: Error | null }> {
    try {
      console.log('Sending data to webhook:', data);
      
      // Send directly to external webhook without saving to database first
      const response = await fetch('https://flow.agencia.da1click.com/webhook/85afac71-803a-4e44-8373-29de02187fb9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
          media_type: data.media_type,
          media_url: data.media_url,
          media_caption: data.media_caption,
          label_id: data.label_id,
          label_name: data.label_name,
          label_color: data.label_color,
          verification_code: data.verification_code
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook request failed: ${response.status} - ${errorText}`);
      }

      // After successful webhook, save to our local database 
      // with status 'sent' for history purposes
      await this.createMessage({
        content: data.content,
        media_type: data.media_type,
        media_url: data.media_url,
        media_caption: data.media_caption,
        label_id: data.label_id,
        label_name: data.label_name,
        label_color: data.label_color,
        verification_code: data.verification_code,
        status: 'sent'
      });
      
      return { error: null };
    } catch (err) {
      console.error('Error sending message with verification:', err);
      
      // Save to database with 'failed' status for history
      try {
        await this.createMessage({
          content: data.content,
          media_type: data.media_type,
          media_url: data.media_url,
          media_caption: data.media_caption,
          label_id: data.label_id,
          label_name: data.label_name,
          label_color: data.label_color,
          verification_code: data.verification_code,
          status: 'failed'
        });
      } catch (saveErr) {
        console.error('Error saving failed message to database:', saveErr);
      }
      
      return { 
        error: err instanceof Error 
          ? err 
          : new Error('Erro ao enviar mensagem. Tente novamente.') 
      };
    }
  }

  /**
   * Update message status
   */
  async updateMessageStatus(id: number, status: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase
        .from('messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      return { error: null };
    } catch (err) {
      console.error('Error updating message status:', err);
      return { 
        error: err instanceof Error ? err : new Error('An unknown error occurred') 
      };
    }
  }
}