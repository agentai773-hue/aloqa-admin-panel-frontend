/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { phoneNumbersAPI } from '../../api/phoneNumbers';
import type { PurchasedNumber, AssignedPhoneNumber } from '../../api/phoneNumbers';
import { usersAPI } from '../../api/users';
import toast from 'react-hot-toast';

export default function AssignNumber() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

  // Fetch users
  const { data: usersResponse } = useQuery({
    queryKey: ['users', { isApproval: 1 }],
    queryFn: () => usersAPI.getUsers({ isApproval: 1 }),
  });

  const users = usersResponse?.data?.users || [];

  // Fetch purchased phone numbers
  const { data: purchasedNumbers = [], isLoading: isPurchasedLoading } = useQuery({
    queryKey: ['purchasedNumbers'],
    queryFn: () => phoneNumbersAPI.getPurchasedNumbers(),
  });

  // Fetch assigned phone numbers
  const { data: assignedNumbers = [], isLoading: isAssignedLoading, refetch: refetchAssigned } = useQuery({
    queryKey: ['assignedNumbers'],
    queryFn: () => phoneNumbersAPI.getAssignedNumbers(),
  });

  // Assign phone number mutation
  const assignMutation = useMutation({
    mutationFn: (data: { phoneNumber: string; userId: string }) => 
      phoneNumbersAPI.assignPhoneNumber(data),
    onSuccess: () => {
      toast.success('Phone number assigned successfully');
      setShowAssignModal(false);
      setSelectedPhoneNumber('');
      setSelectedUserId('');
      refetchAssigned();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to assign phone number');
    },
  });

  // Get assigned phone numbers (phone_number strings)
  const assignedPhoneNumbers = assignedNumbers.map(a => a.phoneNumber);

  // Filter available numbers (not assigned)
  const availableNumbers = purchasedNumbers.filter(
    num => !assignedPhoneNumbers.includes(num.phone_number)
  );

  // Calculate days until renewal and check if within 3 days
  const getNumbersWithRenewalAlert = () => {
    const today = new Date();
    return assignedNumbers
      .map(num => {
        const renewalDate = new Date(num.renewalDate);
        const diffTime = renewalDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...num, daysUntilRenewal: diffDays };
      })
      .filter(num => num.daysUntilRenewal <= 3 && num.daysUntilRenewal >= 0);
  };

  const renewalAlerts = getNumbersWithRenewalAlert();

  const handleAssign = () => {
    if (!selectedPhoneNumber || !selectedUserId) {
      toast.error('Please select both phone number and user');
      return;
    }
    assignMutation.mutate({ phoneNumber: selectedPhoneNumber, userId: selectedUserId });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Assign Phone Numbers</h1>
              <p className="text-gray-300 mt-2">Assign purchased numbers to users</p>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              + Assign Number
            </button>
          </div>
        </div>

        {/* Renewal Alerts */}
        {renewalAlerts.length > 0 && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl shadow-lg p-6 mb-6 animate-pulse">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-3">⚠️ Renewal Alert - Action Required!</h3>
                <div className="space-y-2">
                  {renewalAlerts.map((num) => (
                    <div key={num._id} className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-lg font-bold text-gray-900">{num.phoneNumber}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Assigned to: <span className="font-semibold">{num.userId.companyName}</span> ({num.userId.email})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">
                            {num.daysUntilRenewal} {num.daysUntilRenewal === 1 ? 'day' : 'days'}
                          </p>
                          <p className="text-xs text-gray-600">until renewal</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(num.renewalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Numbers List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gray-900 text-white">
            <h2 className="text-xl font-bold">Assigned Phone Numbers</h2>
          </div>
          
          {isAssignedLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading assigned numbers...</p>
            </div>
          ) : assignedNumbers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assigned Numbers</h3>
                <p className="text-gray-600">
                  No phone numbers have been assigned yet. Click "Assign Number" to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Assigned Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Renewal Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assignedNumbers.map((num) => {
                    const renewalDate = new Date(num.renewalDate);
                    const today = new Date();
                    const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = diffDays <= 3 && diffDays >= 0;

                    return (
                      <tr 
                        key={num._id} 
                        className={`hover:bg-gray-50 transition-colors ${isExpiringSoon ? 'bg-red-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            {num.phoneNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {num.userId.companyName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {num.userId.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(num.assignedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {renewalDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {isExpiringSoon ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                              ⚠️ {diffDays} {diffDays === 1 ? 'day' : 'days'} left
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Footer */}
        {assignedNumbers.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  Total {assignedNumbers.length} assigned number{assignedNumbers.length !== 1 ? 's' : ''} • 
                  {availableNumbers.length} available for assignment
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Assign Phone Number to User</h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedPhoneNumber('');
                    setSelectedUserId('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isPurchasedLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading numbers...</p>
                </div>
              ) : availableNumbers.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-4">📵</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Available Numbers</h4>
                  <p className="text-gray-600">
                    All purchased numbers have been assigned. Buy more numbers to assign them to users.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Select Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Phone Number *
                    </label>
                    <select
                      value={selectedPhoneNumber}
                      onChange={(e) => setSelectedPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Choose a phone number</option>
                      {availableNumbers.map((num) => (
                        <option key={num.id} value={num.phone_number}>
                          {num.phone_number} ({num.telephony_provider})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select User */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select User *
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Choose a user</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.companyName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Info */}
                  {selectedPhoneNumber && selectedUserId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 font-medium mb-2">Assignment Summary:</p>
                      <p className="text-sm text-blue-800">
                        Number <span className="font-mono font-bold">{selectedPhoneNumber}</span> will be assigned to{' '}
                        <span className="font-bold">
                          {users.find(u => u._id === selectedUserId)?.companyName}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {availableNumbers.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedPhoneNumber('');
                      setSelectedUserId('');
                    }}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedPhoneNumber || !selectedUserId || assignMutation.isPending}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {assignMutation.isPending ? 'Assigning...' : 'Assign Number'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
