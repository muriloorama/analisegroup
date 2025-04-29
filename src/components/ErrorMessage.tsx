import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onClose: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClose }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-soft animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};