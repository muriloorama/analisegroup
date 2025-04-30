import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BroadcastHub } from './pages/BroadcastHub';
import { MessageSending } from './pages/MessageSending';

function App() {
  const location = useLocation();

  useEffect(() => {
    console.log('App montado');
    console.log('Rota atual:', location.pathname);
  }, []);

  // Log de mudança de rota
  useEffect(() => {
    console.log('Navegação para:', location.pathname);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-secondary-100">
      {/* Header */}
      <Header currentPath={location.pathname} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BroadcastHub />} />
          <Route path="/send-messages" element={<MessageSending />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;