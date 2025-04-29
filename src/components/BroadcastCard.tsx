import React from 'react';
import { Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { BroadcastGroup } from '../types/broadcast';

interface BroadcastCardProps {
  group: BroadcastGroup;
  onEdit: (group: BroadcastGroup) => void;
  onDelete: (id: number) => void;
}

export const BroadcastCard: React.FC<BroadcastCardProps> = ({ 
  group, 
  onEdit, 
  onDelete 
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden animate-fade-in">
      {group.photo_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={group.photo_url} 
            alt={group.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <h3 className="absolute bottom-4 left-5 right-5 font-semibold text-white text-xl">{group.name}</h3>
        </div>
      )}
      <div className={`p-5 ${!group.photo_url ? 'pt-4' : ''}`}>
        {!group.photo_url && (
          <h3 className="font-semibold text-secondary-800 text-lg mb-2">{group.name}</h3>
        )}
        
        <div className="flex items-center text-xs text-secondary-500 mb-3">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span className="mr-3">{formatDate(group.created_at)}</span>
        </div>
        
        <p className="text-sm text-secondary-600 mb-4 line-clamp-2">{group.description}</p>
        
        <div className="bg-secondary-50 p-3 rounded-lg mb-4">
          <h4 className="text-xs font-medium text-secondary-500 mb-2">Template</h4>
          <div className="whitespace-pre-line text-secondary-700 text-sm max-h-20 overflow-hidden text-ellipsis">
            {group.template.length > 150 
              ? `${group.template.substring(0, 150)}...` 
              : group.template}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-1">
          <button 
            onClick={() => onEdit(group)}
            className="flex items-center text-xs font-medium bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md hover:bg-primary-100 transition-colors"
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Editar
          </button>
          <button 
            onClick={() => onDelete(group.id)}
            className="flex items-center text-xs font-medium bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};