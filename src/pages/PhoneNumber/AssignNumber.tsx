/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { phoneNumbersAPI, usersAPI } from '../../api';
import toast from 'react-hot-toast';
import AssignNumberModal from '../../components/modals/phoneNumberModal/AssignNumberModal';
import AssignSuccessModal from '../../components/modals/phoneNumberModal/AssignSuccessModal';

export default function AssignNumber() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [assignedData, setAssignedData] = useState<{ phoneNumber: string; userName: string; userEmail: string } | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring'>('all');
  const [userFilter, setUserFilter] = useState<string>('');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
      const user = users.find(u => u._id === selectedUserId);
      if (user) {
        setAssignedData({
          phoneNumber: selectedPhoneNumber,
          userName: user.companyName,
          userEmail: user.email
        });
      }
      toast.success('Phone number assigned successfully');
      setShowAssignModal(false);
      setShowSuccessModal(true);
      setSelectedPhoneNumber('');
      setSelectedUserId('');
      refetchAssigned();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      
      if (errorMessage?.includes('already assigned')) {
        toast.error('This phone number is already assigned to another user. Please select a different number.');
      } else if (errorMessage?.includes('user not found')) {
        toast.error('Selected user was not found. Please refresh and try again.');
      } else if (errorMessage?.includes('phone number not found')) {
        toast.error('Selected phone number is no longer available. Please refresh and try again.');
      } else {
        toast.error(errorMessage || 'Failed to assign phone number. Please try again.');
      }
    },
  });

  // All purchased numbers are available for assignment (users can have multiple numbers)
  // Same number cannot be assigned to multiple users (handled by backend validation)
  const availableNumbers = purchasedNumbers;

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

  // Filter assigned numbers
  const filteredAssignedNumbers = assignedNumbers.filter((num) => {
    const query = searchQuery.toLowerCase();
    const today = new Date();
    const renewalDate = new Date(num.renewalDate);
    const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = diffDays <= 3 && diffDays >= 0;
    
    // Search filter
    const matchesSearch = !searchQuery || (
      num.phoneNumber.toLowerCase().includes(query) ||
      num.userId.companyName.toLowerCase().includes(query) ||
      num.userId.email.toLowerCase().includes(query)
    );
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !isExpiringSoon) ||
      (statusFilter === 'expiring' && isExpiringSoon);
    
    // User filter
    const matchesUser = !userFilter || num.userId._id === userFilter;
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const handleAssign = () => {
    if (!selectedPhoneNumber || !selectedUserId) {
      toast.error('Please select both phone number and user');
      return;
    }
    assignMutation.mutate({ phoneNumber: selectedPhoneNumber, userId: selectedUserId });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/30 to-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="bg-white border-b border-gray-200 shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                Assign Phone Numbers
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">Assign purchased numbers to users</p>
            </div>
            <motion.button
              onClick={() => setShowAssignModal(true)}
              className="group relative px-4 sm:px-6 py-2 sm:py-3 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2 overflow-hidden w-full sm:w-auto justify-center"
              style={{
                background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#4BC13B] to-[#255A1D] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Assign Number
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Renewal Alerts */}
        {renewalAlerts.length > 0 && (
          <motion.div 
            className="bg-linear-to-r from-red-50 to-red-100/50 border-2 border-red-300 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="shrink-0 p-2 sm:p-3 bg-red-200 rounded-lg sm:rounded-xl mx-auto sm:mx-0">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-3 sm:mb-4 flex items-center justify-center sm:justify-start gap-2">
                  ⚠️ Renewal Alert - Action Required!
                </h3>
                <div className="space-y-3">
                  {renewalAlerts.map((num) => (
                    <motion.div 
                      key={num._id} 
                      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-red-200 shadow-md"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                        <div className="text-center sm:text-left">
                          <p className="font-mono text-base sm:text-lg font-bold text-gray-900">{num.phoneNumber}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Assigned to: <span className="font-semibold">{num.userId.companyName}</span>
                          </p>
                          <p className="text-xs text-gray-500">{num.userId.email}</p>
                        </div>
                        <div className="text-center bg-red-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-red-200">
                          <p className="text-2xl sm:text-3xl font-bold text-red-600">
                            {num.daysUntilRenewal}
                          </p>
                          <p className="text-xs text-gray-600 font-semibold">
                            {num.daysUntilRenewal === 1 ? 'day left' : 'days left'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(num.renewalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assigned Numbers List */}
        <motion.div 
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-4 sm:p-6 bg-linear-to-r from-[#5DD149]/10 to-[#306B25]/10 border-b-2 border-[#5DD149]/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-linear-to-br from-[#5DD149] to-[#306B25] rounded-lg sm:rounded-xl shadow-lg">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-linear-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                    Assigned Numbers ({filteredAssignedNumbers.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">Track all assigned phone numbers and renewals</p>
                </div>
              </div>
              <div className="px-3 sm:px-4 py-1 sm:py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-xs sm:text-sm">
                {filteredAssignedNumbers.length} of {assignedNumbers.length} numbers
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search phone numbers, companies, emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Status Filter */}
                <div className="flex-1 lg:min-w-40">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">🟢 Active</option>
                    <option value="expiring">⚠️ Expiring Soon</option>
                  </select>
                </div>

                {/* User Filter */}
                <div className="flex-1 lg:min-w-48">
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white text-sm"
                  >
                    <option value="">All Users</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.companyName} ({user.firstName} {user.lastName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {isAssignedLoading ? (
            <div className="p-12 text-center">
              <motion.div 
                className="inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <svg className="h-12 w-12 text-[#5DD149]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </motion.div>
              <p className="mt-4 text-gray-600 font-medium">Loading assigned numbers...</p>
            </div>
          ) : assignedNumbers.length === 0 ? (
            <motion.div 
              className="p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Assigned Numbers</h3>
                <p className="text-gray-600">
                  No phone numbers have been assigned yet. Click "Assign Number" to get started.
                </p>
              </div>
            </motion.div>
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-[#5DD149]/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Assigned Date</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Renewal Date</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssignedNumbers.map((num, index) => {
                    const renewalDate = new Date(num.renewalDate);
                    const today = new Date();
                    const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = diffDays <= 3 && diffDays >= 0;

                    return (
                      <motion.tr 
                        key={num._id} 
                        className={`hover:bg-green-50/50 transition-all duration-200 ${isExpiringSoon ? 'bg-red-50/50' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.001 }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-bold text-[#306B25]">
                            {num.phoneNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
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
                        <td className="px-6 py-4 text-center">
                          {isExpiringSoon ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                              ⚠️ {diffDays} {diffDays === 1 ? 'day' : 'days'} left
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                              ✓ Active
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredAssignedNumbers.map((num, index) => {
                const renewalDate = new Date(num.renewalDate);
                const today = new Date();
                const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = diffDays <= 3 && diffDays >= 0;

                return (
                  <motion.div
                    key={num._id}
                    className={`bg-white rounded-lg border shadow-sm p-4 ${isExpiringSoon ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Header - Phone Number & Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-mono text-sm font-bold text-[#306B25] bg-green-50 px-2 py-1 rounded">
                        {num.phoneNumber}
                      </div>
                      <div>
                        {isExpiringSoon ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                            ⚠️ {diffDays} {diffDays === 1 ? 'day' : 'days'} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                            ✓ Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {num.userId.companyName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {num.userId.email}
                      </div>
                    </div>

                    {/* Date Info */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col">
                        <span className="text-gray-500 font-medium">Assigned</span>
                        <span className="text-gray-900 mt-1">
                          {new Date(num.assignedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 font-medium">Renewal</span>
                        <span className="text-gray-900 mt-1">
                          {renewalDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* No Results State for Filtered Results */}
            {filteredAssignedNumbers.length === 0 && searchQuery && (
              <motion.div 
                className="p-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
                  <p className="text-gray-600">
                    No assigned numbers match your search criteria. Try adjusting your filters.
                  </p>
                </div>
              </motion.div>
            )}
            </div>
          )}
        </motion.div>

        {/* Info Footer */}
        {filteredAssignedNumbers.length > 0 && (
          <motion.div 
            className="mt-6 rounded-xl p-5 border-2 border-green-100"
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="h-5 w-5 text-[#5DD149]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#306B25]">
                  Total {assignedNumbers.length} assigned number{assignedNumbers.length !== 1 ? 's' : ''} • 
                  {' '}{availableNumbers.length} available for assignment
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Assign Modal */}
      <AssignNumberModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedPhoneNumber('');
          setSelectedUserId('');
        }}
        onConfirm={handleAssign}
        selectedPhoneNumber={selectedPhoneNumber}
        selectedUserId={selectedUserId}
        availableNumbers={availableNumbers}
        users={users}
        setSelectedPhoneNumber={setSelectedPhoneNumber}
        setSelectedUserId={setSelectedUserId}
        isLoading={assignMutation.isPending}
        isPurchasedLoading={isPurchasedLoading}
      />

      {/* Success Modal */}
      {assignedData && (
        <AssignSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setAssignedData(null);
          }}
          phoneNumber={assignedData.phoneNumber}
          userName={assignedData.userName}
          userEmail={assignedData.userEmail}
        />
      )}
    </div>
  );
}
