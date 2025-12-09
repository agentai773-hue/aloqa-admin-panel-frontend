import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoices } from '../../hooks/useVoices';
import type { Voice } from '../../api/voices/types';
import { Search, X, Volume2, AlertTriangle, Copy, Check, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { AssignVoiceModal } from '../../components/modals/AssignVoiceModal';
import { VoiceCardSkeleton } from '../../components/ui/SkeletonLoader';

// Voice assignment system interface

interface VoiceCardProps {
  voice: Voice;
  index: number;
  onPlay: (voice: Voice) => void;
  isPlaying: boolean;
  onStop: () => void;
  onAssign: (voice: Voice) => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, index, onPlay, isPlaying, onStop, onAssign }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyVoiceId = async () => {
    try {
      await navigator.clipboard.writeText(voice.voice_id);
      setCopied(true);
      toast.success('Voice ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to copy voice ID');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`bg-white border rounded-xl p-4 hover:shadow-lg transition-all duration-300 group relative ${
        isPlaying ? 'ring-2 ring-green-300 shadow-lg border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-200'
      }`}
    >
      {/* Simple top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-green-500 rounded-t-xl ${
        isPlaying ? 'animate-pulse' : ''
      }`}></div>
      
      {/* Header with voice icon and name */}
      <div className="flex items-center justify-between mb-4 mt-1">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-sm ${
            isPlaying ? 'animate-pulse' : ''
          }`}>
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{voice.name}</h3>
            <p className="text-sm text-gray-500">{voice.accent}</p>
          </div>
        </div>
        
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          AI
        </span>
      </div>

      {/* Simple voice details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Model</span>
          <span className="font-medium text-gray-800">{voice.model}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Voice ID</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
              {voice.voice_id.substring(0, 8)}...
            </span>
            <button
              onClick={handleCopyVoiceId}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy Voice ID"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!isPlaying ? (
          <button 
            onClick={() => onPlay(voice)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>Preview</span>
          </button>
        ) : (
          <button 
            onClick={onStop}
            className="w-full bg-green-500 text-white font-medium py-2 px-4 rounded-lg opacity-75 flex items-center justify-center space-x-2"
          >
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Playing...</span>
          </button>
        )}
        
        <button 
          onClick={() => onAssign(voice)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Assign to User</span>
        </button>
      </div>
    </motion.div>
  );
};

export default function Voice() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedVoiceForAssign, setSelectedVoiceForAssign] = useState<Voice | null>(null);

  // Load ALL voices once from backend, then filter on frontend
  const { data: allVoices = [], isLoading: loading, error } = useVoices();

  // Scroll to top when component mounts (page refresh)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // All voices are ElevenLabs now, no provider filtering needed
  const voices = allVoices;

  // Handle voice preview stop
  const handleStopVoice = () => {
    // Cancel any speech synthesis immediately and silently
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.warn('Error canceling speech synthesis:', error);
      }
    }
    // Reset the playing state immediately
    setCurrentlyPlaying(null);
  };

  // Handle voice details display - Show ElevenLabs voice information
  const handlePlayVoice = (voice: Voice) => {
    setCurrentlyPlaying(voice.id);
    
    // Show comprehensive ElevenLabs voice information
    toast.success(
      `🏆 ${voice.name} - ElevenLabs Voice\n📢 High-Quality AI Voice | 🌍 ${voice.accent}\n🔧 Model: ${voice.model}\n⭐ Premium Quality | Voice Cloning Expert\n\n${voice.description ? `📝 ${voice.description}\n\n` : ''}💡 Use this voice by assigning it to an assistant`,
      {
        id: `voice-${voice.id}`,
        duration: 8000,
        style: {
          background: '#10b981',
          color: 'white',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '13px',
          fontWeight: '500',
          whiteSpace: 'pre-line',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '420px'
        },
        icon: '🏆'
      }
    );

    // Auto-reset playing state after 3 seconds
    setTimeout(() => {
      setCurrentlyPlaying(null);
    }, 3000);
  };

  // Handle voice assign to user
  const handleAssignVoice = (voice: Voice) => {
    setSelectedVoiceForAssign(voice);
    setAssignModalOpen(true);
  };

  // Handle closing assign modal
  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedVoiceForAssign(null);
  };

  // Filter voices based on search only (no provider filter needed since only ElevenLabs)
  const filteredVoices = voices.filter(voice => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      voice.name.toLowerCase().includes(searchLower) ||
      voice.model.toLowerCase().includes(searchLower) ||
      voice.accent.toLowerCase().includes(searchLower) ||
      voice.voice_id.toLowerCase().includes(searchLower) ||
      (voice.description && voice.description.toLowerCase().includes(searchLower));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          
          {/* Search Bar Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Voice Cards Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <VoiceCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error?.message || 'Failed to load voices';
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center max-w-lg mx-auto bg-white rounded-xl shadow-xl p-8 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-3">Failed to Load Voices</h3>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          {errorMessage.includes('backend server') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-left">
                <p className="text-sm text-blue-700 mb-2">
                  To start the backend server, run:
                </p>
                <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
                  cd aloqa-backend && npm start
                </code>
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:gap-6">
            {/* Left Side - Search and Voice Count */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              {/* Search Input */}
              <div className="w-full sm:w-80 lg:w-96">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ElevenLabs voices by name, model, accent..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Voice Count */}
              <div className="bg-linear-to-r from-green-100 to-green-200 text-green-800 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-center shadow-sm whitespace-nowrap">
                <span className="text-lg">{filteredVoices.length}</span>
                <span className="text-sm opacity-75 ml-1">voices</span>
              </div>
            </div>

            {/* Right Side - ElevenLabs Info */}
            <div className="flex items-center space-x-2 text-gray-600 justify-center lg:justify-end">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs sm:text-sm font-medium">🏆 ElevenLabs • {allVoices.length} total voices</span>
            </div>
          </div>
        </motion.div>

        {/* Voices Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatePresence>
            {filteredVoices.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No voices found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'No voices available in the library'}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVoices.map((voice, index) => (
                <VoiceCard 
                  key={voice.id} 
                  voice={voice} 
                  index={index} 
                  onPlay={handlePlayVoice}
                  isPlaying={currentlyPlaying === voice.id}
                  onStop={handleStopVoice}
                  onAssign={handleAssignVoice}
                />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Assign Voice Modal */}
      <AssignVoiceModal 
        isOpen={assignModalOpen}
        onClose={handleCloseAssignModal}
        voice={selectedVoiceForAssign}
      />
    </div>
  );
}