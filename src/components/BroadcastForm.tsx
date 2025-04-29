import React from 'react';
import { Save, X, ImageIcon, AlertCircle } from 'lucide-react';
import { BroadcastGroup } from '../types/broadcast';

interface BroadcastFormProps {
  editingGroup: BroadcastGroup;
  photoPreview: string | null;
  isStorageAvailable: boolean;
  onCancel: () => void;
  onSave: () => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGroupChange: (group: BroadcastGroup) => void;
  onRemovePhoto: () => void;
}

export const BroadcastForm: React.FC<BroadcastFormProps> = ({
  editingGroup,
  photoPreview,
  isStorageAvailable,
  onCancel,
  onSave,
  onPhotoChange,
  onGroupChange,
  onRemovePhoto
}) => {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 mb-6 animate-slide-up">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-secondary-800">
          {editingGroup.id ? 'Editar Broadcast' : 'Novo Broadcast'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-secondary-500 hover:text-secondary-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">Nome</label>
          <input
            type="text"
            value={editingGroup.name}
            onChange={(e) => onGroupChange({...editingGroup, name: e.target.value})}
            className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Nome do broadcast"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">Descrição</label>
          <input
            type="text"
            value={editingGroup.description}
            onChange={(e) => onGroupChange({...editingGroup, description: e.target.value})}
            className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Descreva a finalidade deste broadcast"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Foto</label>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {photoPreview ? (
                <div className="h-24 w-24 rounded-lg overflow-hidden bg-secondary-100 border border-secondary-200 shadow-soft">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-lg bg-secondary-100 border border-secondary-200 flex items-center justify-center shadow-soft">
                  <ImageIcon className="h-10 w-10 text-secondary-400" />
                </div>
              )}
            </div>
            <div className="ml-5 space-y-2">
              <label className={`inline-flex items-center px-4 py-2 rounded-md cursor-pointer border ${!isStorageAvailable ? 'bg-secondary-100 text-secondary-500 border-secondary-200' : 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100'} transition-colors text-sm font-medium`}>
                <span>Carregar imagem</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoChange}
                  className="sr-only"
                  disabled={!isStorageAvailable}
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remover imagem
                </button>
              )}
            </div>
          </div>
          {!isStorageAvailable && (
            <div className="mt-3 flex items-start space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                O upload de imagens não está disponível no momento. Seu broadcast será salvo sem a imagem.
              </p>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">Template da Mensagem</label>
          <textarea
            value={editingGroup.template}
            onChange={(e) => onGroupChange({...editingGroup, template: e.target.value})}
            rows={8}
            className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Insira o template da mensagem que será enviada"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-secondary-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft"
          >
            <Save className="mr-1.5 h-4 w-4" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};