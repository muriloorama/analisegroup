// Type definitions for broadcast functionality

export interface BroadcastGroup {
  id: number;
  name: string;
  description: string;
  template: string;
  photo_url?: string;
  broadcast_type?: string;
  created_at: string;
}

export interface StorageResponse {
  publicUrl: string | null;
  error: Error | null;
}