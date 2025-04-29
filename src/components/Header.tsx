import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Plus, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onCreateNew?: () => void;
  currentPath: string;
}

export const Header: React.FC<HeaderProps> = ({ onCreateNew, currentPath }) => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-800 shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-lg shadow-soft mr-4">
              <Megaphone className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Broadcast Hub</h1>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* Navigation Tabs */}
            <nav className="flex space-x-2 mb-4 md:mb-0 md:mr-6">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === '/' 
                    ? 'bg-white text-primary-700' 
                    : 'bg-primary-700/30 text-white hover:bg-primary-700/50'
                }`}
              >
                Broadcasts
              </Link>
              <Link
                to="/send-messages"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === '/send-messages' 
                    ? 'bg-white text-primary-700' 
                    : 'bg-primary-700/30 text-white hover:bg-primary-700/50'
                }`}
              >
                Envio de Mensagens
              </Link>
            </nav>

            {/* Create New Button - only show on the broadcasts page */}
            {currentPath === '/' && onCreateNew && (
              <button 
                onClick={onCreateNew}
                className="flex items-center bg-white text-primary-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-50 transition-all duration-200 shadow-soft hover:shadow-hover"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Novo Broadcast
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};