import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, KeyRound, CheckCircle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error
}) => {
  const [code, setCode] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus the input field when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === '') return;
    onSubmit(code);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 animate-slide-up"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary-500 hover:text-secondary-700 transition-colors"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">Código de Verificação</h2>
          <p className="text-secondary-600 text-sm">
            Digite o código de verificação para enviar a mensagem
          </p>
        </div>
        
        {error && (
          <div className="mb-4 flex items-start p-3 rounded-lg bg-red-50 text-red-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="ml-2 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-secondary-700 mb-2">
              Código
            </label>
            <input
              ref={inputRef}
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-lg font-semibold tracking-wide"
              placeholder="Digite o código"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors mr-3"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || code.trim() === ''}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-medium shadow-soft ${
                isLoading || code.trim() === ''
                  ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 transition-colors'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Verificar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};