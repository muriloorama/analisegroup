import React from 'react';
import { Megaphone, Plus } from 'lucide-react';

interface EmptyBroadcastStateProps {
  onCreateNew: () => void;
}

export const EmptyBroadcastState: React.FC<EmptyBroadcastStateProps> = ({ onCreateNew }) => {
  return (
    <div className="bg-white rounded-xl shadow-soft p-10 text-center animate-fade-in">
      <div className="bg-primary-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <Megaphone className="h-10 w-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-secondary-800 mb-3">Nenhum broadcast encontrado</h3>
      <p className="text-secondary-600 mb-6 max-w-md mx-auto">
        Crie seu primeiro broadcast para começar a gerenciar suas mensagens para diferentes períodos.
      </p>
      <button
        onClick={onCreateNew}
        className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Criar Broadcast
      </button>
    </div>
  );
};