import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const StorageWarning: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-soft animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Aviso de armazenamento</h3>
          <p className="mt-1 text-sm text-yellow-700">
            O armazenamento de imagens não está disponível. Você precisará criar um bucket chamado "broadcast-images" no Supabase para salvar fotos.
          </p>
        </div>
      </div>
    </div>
  );
};