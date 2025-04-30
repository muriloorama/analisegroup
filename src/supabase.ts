import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Iniciando configuração do Supabase');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas');
  throw new Error('Supabase URL and Anon Key are required');
}

let supabase;

try {
  console.log('Tentando criar cliente Supabase...');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Cliente Supabase criado com sucesso');
} catch (error) {
  console.error('Erro ao criar cliente Supabase:', error);
  throw error;
}

export { supabase };