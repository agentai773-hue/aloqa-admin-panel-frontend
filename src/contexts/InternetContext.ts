import { createContext } from 'react';

export interface InternetContextType {
  isOnline: boolean;
  isChecking: boolean;
  lastChecked: Date;
  checkConnection: () => Promise<void>;
  showOfflinePage: boolean;
  setShowOfflinePage: (show: boolean) => void;
}

export const InternetContext = createContext<InternetContextType | undefined>(undefined);