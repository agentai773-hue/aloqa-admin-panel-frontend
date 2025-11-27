/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { phoneNumbersAPI, usersAPI } from '../../api';
import type { PurchasedNumber } from '../../api';
import toast from 'react-hot-toast';

export default function PhoneNumberList() {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<'US' | 'IN'>('IN');
  const [searchPattern, setSearchPattern] = useState('');
  const [buyingForUserId, setBuyingForUserId] = useState('');

  // Fetch users
  const { data: usersResponse } = useQuery({
    queryKey: ['users', { isApproval: 1 }],
    queryFn: () => usersAPI.getUsers({ isApproval: 1 }),
  });

  const users = usersResponse?.data?.users || [];

  // Fetch purchased phone numbers from backend (using Aloqa_TOKEN)
  const { data: purchasedNumbers = [], isLoading: isPurchasedLoading, refetch: refetchPurchased } = useQuery({
    queryKey: ['purchasedNumbers'],
    queryFn: () => phoneNumbersAPI.getPurchasedNumbers(),
  });

  // Fetch available phone numbers for buying (only when modal is open)
  const { data: availableNumbers = [], isLoading: isAvailableLoading, refetch: refetchAvailable } = useQuery({
    queryKey: ['availablePhoneNumbers', selectedCountry, searchPattern],
    queryFn: () => phoneNumbersAPI.searchPhoneNumbers({ 
      country: selectedCountry, 
      pattern: searchPattern || undefined,
      userId: buyingForUserId || users[0]?._id || ''
    }),
    enabled: showBuyModal && users.length > 0,
  });

  // Buy phone number mutation
  const buyMutation = useMutation({
    mutationFn: (phoneNumber: string) => phoneNumbersAPI.buyPhoneNumber({
      country: selectedCountry,
      phoneNumber,
      userId: buyingForUserId,
    }),
    onSuccess: () => {
      toast.success('Phone number purchased successfully');
      refetchAvailable();
      refetchPurchased();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to purchase phone number');
    },
  });

  const handleBuy = (phoneNumber: string) => {
    if (!buyingForUserId) {
      toast.error('Please select a user first');
      return;
    }
    buyMutation.mutate(phoneNumber);
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
                Phone Numbers
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your purchased phone numbers from Bolna AI</p>
            </div>
            <motion.button
              onClick={() => setShowBuyModal(true)}
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
                Buy Number
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Purchased Numbers List */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Table Header */}
          <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-lg font-bold text-gray-700">Purchased Phone Numbers</h2>
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
                {purchasedNumbers.length} numbers
              </div>
            </div>
          </div>

          {isPurchasedLoading ? (
            <div className="p-12 text-center">
              <motion.div 
                className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-gray-600 font-medium">Loading purchased numbers...</p>
            </div>
          ) : purchasedNumbers.length === 0 ? (
            <motion.div 
              className="p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="max-w-md mx-auto">
                <motion.div 
                  className="text-6xl mb-4"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring" }}
                >
                  �
                </motion.div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent mb-2">
                  No Purchased Numbers
                </h3>
                <p className="text-gray-600">
                  This user hasn't purchased any phone numbers yet. Click "Buy Number" to get started.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#5DD149]/10 to-[#306B25]/10 border-b-2 border-[#5DD149]/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">Phone Number</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">Provider</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">Purchased</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">Renewal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchasedNumbers.map((number: PurchasedNumber, index: number) => (
                    <motion.tr 
                      key={number.id} 
                      className="hover:bg-[#5DD149]/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {number.phone_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {number.telephony_provider}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                          {number.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          number.rented ? 'bg-gradient-to-r from-[#5DD149]/20 to-[#306B25]/20 text-[#306B25]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {number.rented ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {number.humanized_created_at}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {number.renewal_at}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Info Footer */}
        {purchasedNumbers.length > 0 && (
          <motion.div 
            className="mt-6 bg-gradient-to-r from-[#5DD149]/10 to-[#306B25]/10 border-2 border-[#5DD149]/30 rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-[#5DD149]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-[#306B25]">
                  Total {purchasedNumbers.length} purchased number{purchasedNumbers.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Buy Modal */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Modal Header */}
              <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-[#5DD149]/10 to-[#306B25]/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                    Buy Phone Number
                  </h3>
                  <motion.button
                    onClick={() => {
                      setShowBuyModal(false);
                      setSearchPattern('');
                    }}
                    className="text-gray-400 hover:text-[#306B25] transition-colors p-2 rounded-lg hover:bg-gray-100"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Modal Filters */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select User *</label>
                    <select
                      value={buyingForUserId}
                      onChange={(e) => setBuyingForUserId(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
                    >
                      <option value="">Choose a user</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value as 'US' | 'IN')}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
                    >
                      <option value="IN">🇮🇳 India</option>
                      <option value="US">🇺🇸 United States</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pattern (Optional)</label>
                    <input
                      type="text"
                      value={searchPattern}
                      onChange={(e) => setSearchPattern(e.target.value)}
                      placeholder="e.g., 123"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
                    />
                  </div>
                </div>
              </div>

            {/* Modal Content - Available Numbers */}
            <div className="flex-1 overflow-y-auto p-6">
              {isAvailableLoading ? (
                <div className="py-12 text-center">
                  <motion.div 
                    className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-[#5DD149] mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <p className="mt-4 text-gray-600 font-medium">Loading available numbers...</p>
                </div>
              ) : availableNumbers.length === 0 ? (
                <motion.div 
                  className="py-12 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent mb-2">
                    No Numbers Found
                  </h4>
                  <p className="text-gray-600">
                    No phone numbers available for the selected criteria. Try different search options.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {availableNumbers.map((number, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-[#5DD149]/5 rounded-xl hover:from-[#5DD149]/10 hover:to-[#306B25]/10 transition-all border-2 border-gray-200 hover:border-[#5DD149]/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex-1">
                        <p className="font-mono text-lg font-bold text-gray-900">
                          {number.phone_number}
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          {number.locality}, {number.region} • {number.friendly_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                          {number.price}
                        </span>
                        <motion.button
                          onClick={() => handleBuy(number.phone_number)}
                          disabled={buyMutation.isPending || !buyingForUserId}
                          className="px-6 py-2 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                          style={{
                            background: buyMutation.isPending || !buyingForUserId ? '#9CA3AF' : 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)',
                          }}
                          whileHover={buyMutation.isPending || !buyingForUserId ? {} : { scale: 1.05, y: -2 }}
                          whileTap={buyMutation.isPending || !buyingForUserId ? {} : { scale: 0.95 }}
                        >
                          {buyMutation.isPending ? 'Buying...' : 'Buy'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {availableNumbers.length > 0 && (
              <div className="p-4 border-t-2 border-gray-200 bg-gradient-to-r from-[#5DD149]/5 to-[#306B25]/5">
                <p className="text-sm font-bold text-gray-700 text-center">
                  Showing {availableNumbers.length} available number{availableNumbers.length !== 1 ? 's' : ''} for {selectedCountry === 'IN' ? 'India' : 'United States'}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
