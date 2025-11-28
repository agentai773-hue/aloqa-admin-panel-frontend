import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { voicesAPI } from '../../api';
import type { Voice as VoiceInterface, VoiceSearchParams } from '../../api';
import AssignVoiceModal from '../../components/modals/voiceModal/AssignVoiceModal';

export default function Voice() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedAccent, setSelectedAccent] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceInterface | null>(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Build search parameters
  const searchParams: VoiceSearchParams = {
    search: searchTerm || undefined,
    provider: selectedProvider || undefined,
    accent: selectedAccent || undefined,
    sortBy,
    sortDirection,
  };

  // Fetch voices
  const { data: voicesResponse, isLoading: isVoicesLoading } = useQuery({
    queryKey: ['voices', searchParams],
    queryFn: () => voicesAPI.getVoices(searchParams),
  });

  // Fetch providers
  const { data: providersResponse } = useQuery({
    queryKey: ['voiceProviders'],
    queryFn: () => voicesAPI.getVoiceProviders(),
  });

  // Fetch accents
  const { data: accentsResponse } = useQuery({
    queryKey: ['voiceAccents'],
    queryFn: () => voicesAPI.getVoiceAccents(),
  });

  const voices = voicesResponse?.data?.voices || [];
  const totalVoices = voicesResponse?.data?.total || 0;
  const providers = providersResponse?.data || [];
  const accents = accentsResponse?.data || [];

  // Get provider color for badge
  const getProviderColor = (provider: string) => {
    const providerData = providers.find(p => p.value === provider);
    return providerData?.color || '#6B7280';
  };

  // Get accent color for badge
  const getAccentColor = (accent: string) => {
    const accentData = accents.find(a => a.value === accent);
    return accentData?.color || '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="bg-white border-b border-gray-200 shadow-lg rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                Voice Library
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Browse and manage available voices from Bolna AI</p>
            </div>
            <motion.button
              onClick={() => setShowAssignModal(true)}
              className="group relative px-6 py-3 text-white font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4BC13B] to-[#255A1D] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Assign Voice
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Voices</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or model..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD149] focus:border-transparent"
              />
            </div>

            {/* Provider Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD149] focus:border-transparent"
              >
                <option value="">All Providers</option>
                {providers.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accent Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent</label>
              <select
                value={selectedAccent}
                onChange={(e) => setSelectedAccent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD149] focus:border-transparent"
              >
                <option value="">All Accents</option>
                {accents.map((accent) => (
                  <option key={accent.value} value={accent.value}>
                    {accent.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD149] focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="provider">Provider</option>
                  <option value="accent">Accent</option>
                  <option value="model">Model</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={sortDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                >
                  <svg 
                    className={`h-4 w-4 transform transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{voices.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalVoices}</span> voices
          </p>
        </motion.div>

        {/* Voice Cards */}
        {isVoicesLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-8 h-8 border-4 border-[#5DD149] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : voices.length === 0 ? (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No voices found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {voices.map((voice: VoiceInterface, index: number) => (
              <motion.div 
                key={voice.id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Card Header */}
                <div className="p-6 bg-gradient-to-r from-[#5DD149]/10 to-[#306B25]/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {voice.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        {voice.voice_id}
                      </p>
                    </div>
                    <motion.button
                      className="p-2 rounded-lg hover:bg-white/70 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Voice Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Provider</span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getProviderColor(voice.provider) }}
                      >
                        {voice.provider.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Model</span>
                      <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {voice.model}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Accent</span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getAccentColor(voice.accent) }}
                      >
                        {voice.accent}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex gap-2">
                    <motion.button
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5DD149] to-[#306B25] text-white font-medium rounded-lg hover:from-[#4BC13B] hover:to-[#255A1D] transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedVoice(voice);
                        setShowAssignModal(true);
                      }}
                    >
                      Assign
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Preview
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Voice Modal */}
      <AssignVoiceModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedVoice(null);
        }}
        voice={selectedVoice}
        onSuccess={() => {
          // Refresh voices data after successful assignment
          // The modal will handle closing itself
        }}
      />
    </div>
  );
}