import React from 'react';
import { formatDistanceToNow } from '../utils/dateUtils';
import { MessageStatus, MessageWithId } from '../types/message';
import { 
  Check, 
  Clock, 
  AlertTriangle, 
  X, 
  Image, 
  Video, 
  Mic, 
  FileText,
  Tag
} from 'lucide-react';

interface MessageHistoryProps {
  messages: MessageWithId[];
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        <p>Nenhuma mensagem enviada ainda.</p>
      </div>
    );
  }

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-secondary-500" />;
      default:
        return <Clock className="h-4 w-4 text-secondary-400" />;
    }
  };

  const getStatusText = (status: MessageStatus): string => {
    switch (status) {
      case 'sent': return 'Enviada';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falha';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const getStatusClass = (status: MessageStatus): string => {
    switch (status) {
      case 'sent': return 'bg-green-50 text-green-700';
      case 'pending': return 'bg-yellow-50 text-yellow-700';
      case 'failed': return 'bg-red-50 text-red-700';
      case 'cancelled': return 'bg-secondary-100 text-secondary-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <Image className="h-5 w-5 text-primary-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'audio':
        return <Mic className="h-5 w-5 text-amber-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="divide-y divide-secondary-100">
      {messages.map((message) => (
        <div key={message.id} className="py-4 first:pt-0 last:pb-0 animate-fade-in">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${getStatusClass(message.status)}`}>
                {getStatusIcon(message.status)}
                <span className="ml-1">{getStatusText(message.status)}</span>
              </span>
              <span className="text-xs text-secondary-500 ml-3">
                {formatDistanceToNow(new Date(message.created_at))}
              </span>
              
              {/* Label badge */}
              {message.label_name && (
                <span 
                  className="ml-3 text-xs font-medium px-2 py-1 rounded-full flex items-center"
                  style={{ 
                    backgroundColor: message.label_color ? `${message.label_color}20` : '#E2E8F0', 
                    color: message.label_color || '#475569'
                  }}
                >
                  <span 
                    className="h-2.5 w-2.5 rounded-full mr-1.5" 
                    style={{ backgroundColor: message.label_color || '#CBD5E1' }}
                  ></span>
                  {message.label_name}
                </span>
              )}
            </div>
            <span className="text-xs font-medium bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
              ID: {message.id}
            </span>
          </div>
          
          {/* Media content */}
          {message.media_url && message.media_type && (
            <div className="mb-3">
              {message.media_type === 'image' ? (
                <div className="relative">
                  <img 
                    src={message.media_url} 
                    alt={message.media_caption || 'Message image'} 
                    className="rounded-lg max-h-48 object-cover"
                  />
                  {message.media_caption && (
                    <div className="text-sm text-secondary-600 mt-1 italic">
                      "{message.media_caption}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center bg-secondary-50 p-3 rounded-lg">
                  {getMediaIcon(message.media_type)}
                  <span className="ml-2 text-sm text-secondary-700">
                    {message.media_type.charAt(0).toUpperCase() + message.media_type.slice(1)}
                    {message.media_caption && `: ${message.media_caption}`}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Text content */}
          {message.content && (
            <p className="text-secondary-700 whitespace-pre-line">{message.content}</p>
          )}
          
          {/* Metadata */}
          <div className="flex items-center mt-2 text-xs text-secondary-500">
            {message.media_type && message.media_type !== 'text' && (
              <div className="flex items-center mr-3">
                {getMediaIcon(message.media_type)}
                <span className="ml-1 capitalize">{message.media_type}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{new Date(message.created_at).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};