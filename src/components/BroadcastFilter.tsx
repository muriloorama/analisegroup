import React from 'react';
import { Megaphone, Calendar } from 'lucide-react';
import { BROADCAST_FILTERS } from '../config/constants';

interface BroadcastFilterProps {
  activeFilter: string | null;
  onFilterChange: (filterId: string) => void;
}

export const BroadcastFilter: React.FC<BroadcastFilterProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
      <h2 className="text-sm font-medium text-secondary-600 mb-3 ml-1">Filtros</h2>
      <div className="flex flex-wrap gap-2">
        {BROADCAST_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-primary-600 text-white shadow-md transform scale-105'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            {filter.type.includes('mensal') ? (
              <Calendar className="mr-1.5 h-4 w-4" />
            ) : (
              <Megaphone className="mr-1.5 h-4 w-4" />
            )}
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};