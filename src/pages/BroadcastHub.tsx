import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { BroadcastGroup } from '../types/broadcast';
import { BROADCAST_FILTERS } from '../config/constants';
import { BroadcastService } from '../services/broadcastService';
import { BroadcastFilter } from '../components/BroadcastFilter';
import { BroadcastForm } from '../components/BroadcastForm';
import { BroadcastCard } from '../components/BroadcastCard';
import { EmptyBroadcastState } from '../components/EmptyBroadcastState';
import { ErrorMessage } from '../components/ErrorMessage';
import { StorageWarning } from '../components/StorageWarning';

export const BroadcastHub: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>('broadcast3');
  const [broadcastGroups, setBroadcastGroups] = useState<BroadcastGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<BroadcastGroup | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);
  
  const broadcastService = new BroadcastService(supabase);

  // Check if storage is available
  useEffect(() => {
    const checkStorageAvailability = async () => {
      const isAvailable = await broadcastService.checkStorageAvailability();
      setIsStorageAvailable(isAvailable);
    };
    
    checkStorageAvailability();
  }, []);

  // Load broadcast groups from Supabase
  useEffect(() => {
    const fetchBroadcastGroups = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await broadcastService.fetchBroadcastGroups();

        if (error) {
          throw error;
        }

        setBroadcastGroups(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching broadcast groups:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBroadcastGroups();
  }, []);

  // Reset editing state
  const resetEditingState = () => {
    setIsEditing(false);
    setEditingGroup(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setError(null);
  };

  const handleFilterClick = (filterId: string) => {
    // If this is the same filter that's already active, do nothing
    if (filterId === activeFilter) return;
    
    // Reset editing state when changing filters
    resetEditingState();
    
    // Set the new active filter
    setActiveFilter(filterId);
    
    // Look for existing broadcast with this type
    const currentFilter = BROADCAST_FILTERS.find(f => f.id === filterId);
    if (currentFilter) {
      const existingBroadcast = broadcastGroups.find(b => b.broadcast_type === currentFilter.type);
      if (existingBroadcast) {
        handleEditGroup(existingBroadcast);
      }
    }
  };

  const handleEditGroup = (group: BroadcastGroup) => {
    setEditingGroup(group);
    setPhotoPreview(group.photo_url || null);
    setIsEditing(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGroupChange = (updatedGroup: BroadcastGroup) => {
    setEditingGroup(updatedGroup);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (editingGroup) {
      setEditingGroup({...editingGroup, photo_url: undefined});
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    // If no photo file selected or storage not available, return existing URL or null
    if (!photoFile || !isStorageAvailable) return editingGroup?.photo_url || null;
    
    try {
      const { publicUrl, error } = await broadcastService.uploadPhoto(photoFile);
      
      if (error) throw error;
      return publicUrl;
    } catch (err) {
      console.error('Error uploading photo:', err);
      // Don't set error message in the UI, just return null to continue without photo
      return null;
    }
  };

  const handleSaveGroup = async () => {
    if (!editingGroup) return;

    try {
      setIsLoading(true);
      
      // Get the current active filter type
      const currentFilter = BROADCAST_FILTERS.find(f => f.id === activeFilter);
      const broadcastType = currentFilter?.type || null;
      
      // Check if there's already a broadcast with this type
      if (broadcastType) {
        const existingBroadcast = broadcastGroups.find(
          b => b.broadcast_type === broadcastType && b.id !== editingGroup.id
        );
        
        if (existingBroadcast) {
          setError(`Já existe um broadcast do tipo ${currentFilter?.label}. Você deve editar ou excluir o existente.`);
          setIsLoading(false);
          return;
        }
      }
      
      // Upload photo if one is selected and storage is available
      let photoUrl = await uploadPhoto();

      if (editingGroup.id) {
        // Update existing group
        const { error } = await broadcastService.updateBroadcastGroup(editingGroup.id, {
          name: editingGroup.name,
          description: editingGroup.description,
          template: editingGroup.template,
          photo_url: photoUrl,
          broadcast_type: broadcastType
        });

        if (error) throw error;
      } else {
        // Create new group
        const { error } = await broadcastService.createBroadcastGroup({
          name: editingGroup.name,
          description: editingGroup.description,
          template: editingGroup.template,
          photo_url: photoUrl,
          broadcast_type: broadcastType
        });

        if (error) throw error;
      }

      // Refresh the groups
      const { data, error } = await broadcastService.fetchBroadcastGroups();

      if (error) throw error;
      
      setBroadcastGroups(data || []);
      resetEditingState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error saving broadcast group:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this broadcast group?')) return;

    try {
      setIsLoading(true);
      const { error } = await broadcastService.deleteBroadcastGroup(id);

      if (error) throw error;

      // Remove from local state
      setBroadcastGroups(broadcastGroups.filter(group => group.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting broadcast group:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewGroup = () => {
    // Get the current active filter type
    const currentFilter = BROADCAST_FILTERS.find(f => f.id === activeFilter);
    const broadcastType = currentFilter?.type || null;
    
    // Check if there's already a broadcast with this type
    if (broadcastType) {
      const existingBroadcast = broadcastGroups.find(b => b.broadcast_type === broadcastType);
      
      if (existingBroadcast) {
        setError(`Já existe um broadcast do tipo ${currentFilter?.label}. Você deve editar ou excluir o existente.`);
        return;
      }
    }
    
    setEditingGroup({
      id: 0, // Will be set by the database
      name: '',
      description: '',
      template: '',
      broadcast_type: broadcastType || undefined,
      created_at: new Date().toISOString()
    });
    setPhotoPreview(null);
    setPhotoFile(null);
    setIsEditing(true);
  };

  // Filter displayed broadcasts based on active filter
  const filteredBroadcasts = activeFilter 
    ? broadcastGroups.filter(group => {
        const currentFilter = BROADCAST_FILTERS.find(f => f.id === activeFilter);
        return group.broadcast_type === currentFilter?.type;
      })
    : broadcastGroups;

  return (
    <>
      {/* Storage Warning */}
      {!isStorageAvailable && <StorageWarning />}
      
      {/* Error Message */}
      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {/* Filter Buttons */}
      <BroadcastFilter activeFilter={activeFilter} onFilterChange={handleFilterClick} />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center my-10">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && editingGroup && (
        <BroadcastForm 
          editingGroup={editingGroup}
          photoPreview={photoPreview}
          isStorageAvailable={isStorageAvailable}
          onCancel={resetEditingState}
          onSave={handleSaveGroup}
          onPhotoChange={handlePhotoChange}
          onGroupChange={handleGroupChange}
          onRemovePhoto={handleRemovePhoto}
        />
      )}

      {/* Empty State */}
      {!isLoading && filteredBroadcasts.length === 0 && !isEditing && (
        <EmptyBroadcastState onCreateNew={createNewGroup} />
      )}

      {/* Broadcast Groups */}
      {!isLoading && filteredBroadcasts.length > 0 && !isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBroadcasts.map((group) => (
            <BroadcastCard 
              key={group.id}
              group={group}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
            />
          ))}
        </div>
      )}
    </>
  );
};