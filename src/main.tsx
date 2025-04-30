import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Logs de ambiente e inicialização
console.log('Ambiente:', import.meta.env.MODE);
console.log('URL Supabase:', import.meta.env.VITE_SUPABASE_URL);
console.log('Chave está definida:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);