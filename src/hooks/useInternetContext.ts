import { useContext } from 'react';
import { InternetContext, type InternetContextType } from '../contexts/InternetContext';

export function useInternetContext(): InternetContextType {
  const context = useContext(InternetContext);
  if (context === undefined) {
    throw new Error('useInternetContext must be used within an InternetProvider');
  }
  return context;
}