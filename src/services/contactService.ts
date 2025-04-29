import { supabase } from '../supabase';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'https://flow.agencia.da1click.com/webhook/33522e8a-7b78-4d25-8038-711f74556278';

export class ContactService {
  private supabase;

  constructor(supabaseClient: typeof supabase) {
    this.supabase = supabaseClient;
  }

  async importContacts(file: File, verificationCode: string): Promise<void> {
    try {
      console.log('Enviando arquivo para webhook:', file.name, 'com código:', verificationCode);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('verification_code', verificationCode);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta do webhook:', response.status, errorText);
        throw new Error(`Erro ao enviar arquivo: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Resposta do webhook:', data);
      
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      throw new Error('Falha ao enviar arquivo. Por favor, tente novamente.');
    }
  }
} 