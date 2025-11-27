import { useState, useEffect } from 'react';

interface UseInternetStatusReturn {
  isOnline: boolean;
  isChecking: boolean;
  lastChecked: Date;
  checkConnection: () => Promise<void>;
}

export function useInternetStatus(): UseInternetStatusReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try to fetch a small resource from our own domain first
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setIsOnline(true);
      } else {
        // If our domain fails, try a reliable external endpoint
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        setIsOnline(true);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChecked(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked(new Date());
    };

    // Listen to browser online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check every 30 seconds when offline
    let interval: number;
    if (!isOnline) {
      interval = setInterval(checkConnection, 30000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOnline]);

  return {
    isOnline,
    isChecking,
    lastChecked,
    checkConnection
  };
}