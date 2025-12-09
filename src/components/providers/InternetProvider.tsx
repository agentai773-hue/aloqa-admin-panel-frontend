import React, { useState, useEffect } from 'react';
import { useInternetStatus } from '../../hooks/useInternetStatus';
import NoInternetPage from '../../pages/NoInternetPage';
import { InternetContext, type InternetContextType } from '../../contexts/InternetContext';

interface InternetProviderProps {
  children: React.ReactNode;
}

export function InternetProvider({ children }: InternetProviderProps) {
  const { isOnline, isChecking, lastChecked, checkConnection } = useInternetStatus();
  const [showOfflinePage, setShowOfflinePage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Show offline page when internet is lost
    if (!isOnline && !wasOffline) {
      setWasOffline(true);
      setShowOfflinePage(true);
    }

    // Hide offline page when internet is back
    if (isOnline && wasOffline) {
      setWasOffline(false);
      // Don't immediately hide, let NoInternetPage handle the redirect
      setTimeout(() => {
        setShowOfflinePage(false);
      }, 2000);
    }
  }, [isOnline, wasOffline]);

  const handleBackFromOffline = () => {
    setShowOfflinePage(false);
    // Go back in history
    window.history.back();
  };

  const contextValue: InternetContextType = {
    isOnline,
    isChecking,
    lastChecked,
    checkConnection,
    showOfflinePage,
    setShowOfflinePage
  };

  if (showOfflinePage && !isOnline) {
    return <NoInternetPage onBack={handleBackFromOffline} />;
  }

  return (
    <InternetContext.Provider value={contextValue}>
      {children}
    </InternetContext.Provider>
  );
}

export default InternetProvider;