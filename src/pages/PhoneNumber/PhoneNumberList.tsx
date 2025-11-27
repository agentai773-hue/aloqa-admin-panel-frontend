/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { phoneNumbersAPI } from '../../api/phoneNumbers';
import type { PurchasedNumber } from '../../api/phoneNumbers';
import { usersAPI } from '../../api/users';
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Phone Numbers</h1>
              <p className="text-gray-300 mt-2">Manage your purchased phone numbers from Bolna AI</p>
            </div>
            <button
              onClick={() => setShowBuyModal(true)}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              + Buy Number
            </button>
          </div>
        </div>

        {/* Purchased Numbers List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isPurchasedLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading purchased numbers...</p>
            </div>
          ) : purchasedNumbers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Purchased Numbers</h3>
                <p className="text-gray-600">
                  This user hasn't purchased any phone numbers yet. Click "Buy Number" to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Phone Number</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Provider</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Purchased</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Renewal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchasedNumbers.map((number: PurchasedNumber) => (
                    <tr key={number.id} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {number.phone_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {number.telephony_provider}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-green-600">
                          {number.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          number.rented ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {number.rented ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {number.humanized_created_at}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {number.renewal_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Footer */}
        {purchasedNumbers.length > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-[#306B25]">
                  Total {purchasedNumbers.length} purchased number{purchasedNumbers.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Buy Phone Number</h3>
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setSearchPattern('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select User *</label>
                  <select
                    value={buyingForUserId}
                    onChange={(e) => setBuyingForUserId(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value as 'US' | 'IN')}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="IN">🇮🇳 India</option>
                    <option value="US">🇺🇸 United States</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pattern (Optional)</label>
                  <input
                    type="text"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                    placeholder="e.g., 123"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Modal Content - Available Numbers */}
            <div className="flex-1 overflow-y-auto p-6">
              {isAvailableLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading available numbers...</p>
                </div>
              ) : availableNumbers.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Numbers Found</h4>
                  <p className="text-gray-600">
                    No phone numbers available for the selected criteria. Try different search options.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-mono text-lg font-semibold text-gray-900">
                          {number.phone_number}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {number.locality}, {number.region} • {number.friendly_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-green-600">
                          {number.price}
                        </span>
                        <button
                          onClick={() => handleBuy(number.phone_number)}
                          disabled={buyMutation.isPending || !buyingForUserId}
                          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {buyMutation.isPending ? 'Buying...' : 'Buy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {availableNumbers.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  Showing {availableNumbers.length} available number{availableNumbers.length !== 1 ? 's' : ''} for {selectedCountry === 'IN' ? 'India' : 'United States'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
