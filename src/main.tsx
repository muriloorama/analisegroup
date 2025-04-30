import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Logs de ambiente e inicialização
console.log('=== DEBUG LOGS ===');
console.log('Ambiente:', import.meta.env.MODE);
console.log('Todas as variáveis de ambiente:', {
  ...import.meta.env
});
console.log('URL Supabase:', import.meta.env.VITE_SUPABASE_URL);
console.log('Chave está definida:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

try {
  const rootElement = document.getElementById('root');
  console.log('Root element encontrado:', !!rootElement);
  
  if (!rootElement) {
    throw new Error('Root element não encontrado');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
  console.log('Renderização iniciada com sucesso');
} catch (error) {
  console.error('Erro na inicialização:', error);
}