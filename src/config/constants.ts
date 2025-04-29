// Database table names
export const DB_TABLES = {
  BROADCAST_GROUP: 'broad_analise_group'
};

// Storage bucket names
export const STORAGE = {
  BUCKET_NAME: 'broadcast-images',
  FOLDER_PATH: 'broadcast-photos'
};

// Broadcast types
export const BROADCAST_TYPES = {
  THREE_DAYS: '3d',
  SEVEN_DAYS: '7d',
  FIFTEEN_DAYS: '15d',
  MONTHLY: 'mensal'
};

// Broadcast filter configurations
export const BROADCAST_FILTERS = [
  { 
    id: 'broadcast3', 
    label: 'Broadcast 3 dias', 
    type: BROADCAST_TYPES.THREE_DAYS 
  },
  { 
    id: 'broadcast7', 
    label: 'Broadcast 7 dias', 
    type: BROADCAST_TYPES.SEVEN_DAYS 
  },
  { 
    id: 'broadcast15', 
    label: 'Broadcast 15 dias', 
    type: BROADCAST_TYPES.FIFTEEN_DAYS 
  },
  { 
    id: 'broadcastMensal', 
    label: 'Broadcast Mensal', 
    type: BROADCAST_TYPES.MONTHLY 
  },
];