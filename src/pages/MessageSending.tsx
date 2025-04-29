import React, { useState, useEffect } from 'react';
import { MessageMediaType } from '../types/message';
import { MessageForm } from '../components/MessageForm';
import { MessageHistory } from '../components/MessageHistory';
import { ErrorMessage } from '../components/ErrorMessage';
import { StorageWarning } from '../components/StorageWarning';
import { ImportContactsButton } from '../components/ImportContactsButton';
import { supabase } from '../supabase';
import { Check, Clock } from 'lucide-react';
import { MessageService } from '../services/messageService';
import { ContactService } from '../services/contactService';

export const MessageSending: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);
  
  const messageService = new MessageService(supabase);
  const contactService = new ContactService(supabase);

  // Check if storage is available
  useEffect(() => {
    const checkStorageAvailability = async () => {
      const isAvailable = await messageService.checkStorageAvailability();
      setIsStorageAvailable(isAvailable);
    };
    
    checkStorageAvailability();
  }, []);

  // Load messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await messageService.fetchMessages();

        if (error) {
          throw error;
        }

        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async (
    content: string, 
    mediaType: MessageMediaType, 
    mediaFile: File | null, 
    caption: string | null,
    labelId: string | null,
    labelName: string | null,
    labelColor: string | null,
    verificationCode: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      let mediaUrl: string | null = null;
      
      // Upload media if provided and if storage is available
      if (mediaFile && isStorageAvailable && mediaType !== 'text') {
        const { publicUrl, error } = await messageService.uploadMedia(mediaFile, mediaType);
        
        if (error) throw error;
        mediaUrl = publicUrl;
      }

      // Send message with verification code directly to webhook
      const { error } = await messageService.sendMessageWithVerification({
        content,
        media_type: mediaType,
        media_url: mediaUrl,
        media_caption: caption,
        label_id: labelId,
        label_name: labelName,
        label_color: labelColor,
        verification_code: verificationCode,
        status: 'pending'
      });

      if (error) throw error;

      // Refresh the messages list
      const { data: updatedMessages, error: fetchError } = await messageService.fetchMessages();

      if (fetchError) throw fetchError;
      
      setMessages(updatedMessages || []);
      setSuccessMessage('Mensagem enviada com sucesso!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Re-throw so the form can handle displaying errors
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportContacts = async (file: File, verificationCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await contactService.importContacts(file, verificationCode);
      setSuccessMessage('Contatos importados com sucesso!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error importing contacts:', err);
      setError(err instanceof Error ? err.message : 'Erro ao importar contatos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Storage Warning */}
      {!isStorageAvailable && <StorageWarning />}
      
      {/* Error Message */}
      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg shadow-soft animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message Form */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-800">Envio de Mensagens</h2>
          <ImportContactsButton onImport={handleImportContacts} />
        </div>
        <MessageForm 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
          isStorageAvailable={isStorageAvailable}
        />
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center my-10">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      )}

      {/* Message History */}
      {!isLoading && (
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-800">Histórico de Mensagens</h2>
            <div className="flex items-center text-sm text-secondary-500">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>Últimas 24 horas</span>
            </div>
          </div>
          
          <MessageHistory messages={messages} />
        </div>
      )}
    </>
  );
};