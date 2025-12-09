import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';

interface NoInternetPageProps {
  onBack?: () => void;
}

export default function NoInternetPage({ onBack }: NoInternetPageProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Wait a moment to show the success state, then redirect
      setTimeout(() => {
        if (onBack) {
          onBack();
        } else {
          navigate(-1); // Go back to previous page
        }
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check for internet connectivity
    const checkConnectivity = async () => {
      try {
        // Try a simple fetch to our own domain first
        const response = await fetch('/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(3000)
        });
        if (response.ok) {
          setIsOnline(true);
        } else {
          throw new Error('Local check failed');
        }
      } catch {
        // If local fails, try external
        try {
          await fetch('https://www.google.com/favicon.ico', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            signal: AbortSignal.timeout(3000)
          });
          setIsOnline(true);
        } catch {
          setIsOnline(false);
        }
      }
      setLastChecked(new Date());
    };

    // Check every 10 seconds
    const interval = setInterval(checkConnectivity, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [navigate, onBack]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      setIsOnline(true);
      setLastChecked(new Date());
      
      // If online, redirect after showing success
      setTimeout(() => {
        if (onBack) {
          onBack();
        } else {
          navigate(-1);
        }
      }, 1500);
    } catch {
      setIsOnline(false);
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };



  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Connection Status Icon */}
          <motion.div 
            className="mx-auto mb-6"
            animate={isOnline ? { scale: [1, 1.1, 1] } : { rotate: [0, 10, -10, 0] }}
            transition={{ 
              duration: isOnline ? 0.6 : 2,
              repeat: isOnline ? 1 : Infinity,
              ease: "easeInOut"
            }}
          >
            <AnimatePresence mode="wait">
              {isOnline ? (
                <motion.div
                  key="online"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Wifi className="w-12 h-12 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="offline"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <WifiOff className="w-12 h-12 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Title & Message */}
          <AnimatePresence mode="wait">
            {isOnline ? (
              <motion.div
                key="online-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-bold text-green-600 mb-2">
                  Connection Restored!
                </h1>
                <p className="text-gray-600 mb-6">
                  Great! Your internet connection is back. Redirecting you now...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="offline-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  No Internet Connection
                </h1>
                <p className="text-gray-600 mb-6">
                  Oops! It looks like you're not connected to the internet. Please check your connection and try again.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Connection Details */}
          {!isOnline && (
            <motion.div 
              className="bg-gray-50 rounded-lg p-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm text-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span>Status:</span>
                  <span className="flex items-center text-red-500">
                    <WifiOff className="w-4 h-4 mr-1" />
                    Offline
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last checked:</span>
                  <span className="text-gray-500">
                    {lastChecked.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <AnimatePresence>
              {!isOnline && (
                <motion.button
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    animate={isChecking ? { rotate: 360 } : {}}
                    transition={{ 
                      duration: 1,
                      repeat: isChecking ? Infinity : 0,
                      ease: "linear"
                    }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  <span>{isChecking ? 'Checking...' : 'Try Again'}</span>
                </motion.button>
              )}
            </AnimatePresence>

       
          </div>

          {/* Tips */}
          {!isOnline && (
            <motion.div 
              className="mt-6 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="mb-2">💡 Tips to fix your connection:</p>
              <ul className="text-left space-y-1 list-disc list-inside">
                <li>Check your Wi-Fi or mobile data</li>
                <li>Try moving closer to your router</li>
                <li>Restart your router if needed</li>
                <li>Contact your internet provider</li>
              </ul>
            </motion.div>
          )}

          {/* Auto-refresh indicator */}
          {!isOnline && (
            <motion.div 
              className="mt-4 text-xs text-gray-400 flex items-center justify-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span>Auto-checking every 10 seconds</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}