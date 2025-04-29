// Type definitions for message functionality

export type MessageMediaType = 'text' | 'image' | 'audio' | 'video' | 'document';
export type MessageStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

export interface Label {
  id: string;
  title: string;
  description?: string;
  color: string;
  show_on_sidebar?: boolean;
  account_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  content: string;
  media_type: MessageMediaType;
  media_url?: string | null;
  media_caption?: string | null;
  label_id?: string | null;
  label_name?: string | null;
  label_color?: string | null;
  verification_code?: string;
  status: MessageStatus;
  created_at: string;
}

export interface MessageWithId extends Message {
  id: number;
}