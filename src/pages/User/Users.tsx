import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, type User } from '../../api';
import UserVerificationModal from "../../components/modals/userModal/UserVerificationModal";
import UserActionSuccessModal from "../../components/modals/userModal/UserActionSuccessModal";
import UserDeleteModal from "../../components/modals/userModal/UserDeleteModal";
import UserDeleteSuccessModal from "../../components/modals/userModal/UserDeleteSuccessModal";
import { useUsers } from '../../hooks/useUsers';
import { useSearchDebounce } from '../../hooks/useDebounce';
import { TableSkeleton } from '../../components/ui/SkeletonLoader';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Calculate default page size based on screen height
    const screenHeight = window.innerHeight;
    if (screenHeight < 768) return 7; // Mobile
    if (screenHeight < 1024) return 7; // Tablet  
    return 10; // Desktop
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');
  
  // Debounced search
  const { searchValue, debouncedValue: searchQuery, setSearchValue } = useSearchDebounce('', 500);

  // Use the custom users hook with pagination and search
  const { 
    users, 
    pagination,
    isLoading: loading, 
    error,
    toggleApproval: toggleApprovalMutation,
    deleteUser: deleteUserHook
  } = useUsers({
    enabled: true,
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: statusFilter === 'all' ? undefined : statusFilter,
    approval: approvalFilter === 'all' ? undefined : approvalFilter
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [verifyUserId, setVerifyUserId] = useState<string | null>(null);
  const [verifyUserEmail, setVerifyUserEmail] = useState<string>('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteUserName, setDeleteUserName] = useState<string>('');
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedDataStats, setDeletedDataStats] = useState({ assistants: 0, phoneNumbers: 0 });

  // Manual email verification mutation (not in hook)
  const verifyEmailMutation = useMutation({
    mutationFn: (userId: string) => usersAPI.verifyUserEmail(userId),
    onSuccess: () => {
      setSuccessMessage('User email verified successfully!');
      setShowSuccessModal(true);
      setVerifyUserId(null);
      setVerifyUserEmail('');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify user email');
    }
  });

  useEffect(() => {
    // Check for success message from navigation state
    const state = location.state as { successMessage?: string };
    if (state?.successMessage) {
      setSuccessMessage(state.successMessage);
      setShowSuccessModal(true);
      // Clear the state after reading
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterChange = (filterType: 'status' | 'approval', value: string) => {
    if (filterType === 'status') {
      setStatusFilter(value as 'all' | 'verified' | 'pending');
    } else {
      setApprovalFilter(value as 'all' | 'approved' | 'pending');
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleToggleApproval = async (userId: string, currentStatus: 0 | 1, isActive: 0 | 1) => {
    // Check if email is verified
    if (isActive === 0) {
      toast.error('Cannot approve user until email is verified');
      return;
    }

    const newStatus = currentStatus === 1 ? 0 : 1;
    toggleApprovalMutation.mutate({ id: userId, status: newStatus });
  };

  // Manual email verification by admin
  const handleManualVerification = (userId: string, email: string) => {
    setVerifyUserId(userId);
    setVerifyUserEmail(email);
  };

  const confirmManualVerification = async () => {
    if (!verifyUserId) return;
    verifyEmailMutation.mutate(verifyUserId);
  };

  const cancelManualVerification = () => {
    setVerifyUserId(null);
    setVerifyUserEmail('');
  };

  // Delete user
  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
  };

  const confirmDeleteUser = async () => {
    if (!deleteUserId) return;
    deleteUserHook.mutate(deleteUserId, {
      onSuccess: () => {
        setDeletedDataStats({
          assistants: 0,
          phoneNumbers: 0
        });
        setShowDeleteSuccessModal(true);
        setDeleteUserId(null);
        setDeleteUserName('');
      }
    });
  };

  const cancelDeleteUser = () => {
    setDeleteUserId(null);
    setDeleteUserName('');
  };

  // Navigate to edit page
  const handleEditUser = (user: User) => {
    navigate(`/users/${user._id}/edit`);
  };

  // Navigate to view page
  const handleViewUser = (user: User) => {
    navigate(`/users/${user._id}/view`);
  };



  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error?.message || 'An error occurred'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table with Filters */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Filters Section */}
        <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, company..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              {/* Email Status Filter */}
              <div className="flex-1 lg:min-w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="verified">✓ Verified</option>
                  <option value="pending">⏳ Pending</option>
                </select>
              </div>

              {/* Approval Filter */}
              <div className="flex-1 lg:min-w-40">
                <select
                  value={approvalFilter}
                  onChange={(e) => handleFilterChange('approval', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                >
                  <option value="all">All Approval</option>
                  <option value="approved">✓ Approved</option>
                  <option value="pending">⏳ Pending</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="lg:ml-auto">
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm text-center lg:text-left">
                  {pagination.total} users
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State Inside Table */}
        {loading ? (
          <TableSkeleton rows={8} />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxWidth: '100%' }}>
              <table className="w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 z-10" style={{ minWidth: '20px' }}>No.</th>
                  <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '180px' }}>Name</th>
                  <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '220px' }}>Contact</th>
                  <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '200px' }}>Company</th>
                  <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '150px' }}>Last Login</th>
                  <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '140px' }}>Email Status</th>
                  <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '120px' }}>Approval</th>
                  <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {users.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <div>
                            <p className="text-lg font-semibold text-gray-600">No users found</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {searchQuery || statusFilter !== 'all' || approvalFilter !== 'all' 
                                ? 'Try adjusting your filters'
                                : 'No users available'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    users.map((user, index) => (
                    <motion.tr 
                      key={user._id} 
                      className="hover:bg-green-50 transition-colors duration-150"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                    <td className="px-3 py-3 whitespace-nowrap sticky left-0 bg-white hover:bg-green-50 z-10">
                      <span className="inline-flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">+91 {user.mobile}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 max-w-[180px] truncate">{user.companyName}</div>
                      <div className="text-sm text-gray-500 max-w-[180px] truncate">{user.companyAddress}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {user.isActive === 1 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Pending
                            </span>
                            <button
                              onClick={() => handleManualVerification(user._id, user.email)}
                              className="p-1.5 text-white bg-linear-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-[#306B25] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Manually verify this user's email"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleToggleApproval(user._id, user.isApproval, user.isActive)}
                          disabled={user.isActive === 0}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-md ${
                            user.isActive === 0 
                              ? 'bg-gray-200 cursor-not-allowed opacity-50' 
                              : user.isApproval === 1 
                                ? 'bg-linear-to-r from-green-500 to-green-600 cursor-pointer' 
                                : 'bg-gray-300 cursor-pointer'
                          }`}
                          title={
                            user.isActive === 0 
                              ? 'Email verification required before approval' 
                              : user.isApproval === 1 
                                ? 'Approved - Click to unapprove' 
                                : 'Not Approved - Click to approve'
                          }
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                              user.isApproval === 1 ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <div className={`text-xs mt-1 font-medium ${
                          user.isActive === 0 
                            ? 'text-gray-400' 
                            : user.isApproval === 1 
                              ? 'text-green-600' 
                              : 'text-gray-500'
                        }`}>
                          {user.isActive === 0 ? 'Locked' : user.isApproval === 1 ? 'Approved' : 'Pending'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 text-[#5DD149] hover:bg-green-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
                )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            <AnimatePresence>
              {users.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <div>
                      <p className="text-lg font-semibold text-gray-600">No users found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchQuery || statusFilter !== 'all' || approvalFilter !== 'all' 
                          ? 'Try adjusting your filters'
                          : 'No users available'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                users.map((user, index) => (
                  <motion.div
                    key={user._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    {/* User Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-linear-to-r from-green-500 to-green-600 text-white rounded-full h-10 w-10 flex items-center justify-center text-sm font-semibold">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-[#5DD149] hover:bg-green-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="text-sm text-gray-900">{user.mobile || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Company</p>
                        <p className="text-sm text-gray-900">{user.companyName || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Last Login */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-medium">Last Login</p>
                      <p className="text-sm text-gray-900">
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Never'
                        }
                      </p>
                    </div>

                    {/* Status Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {/* Email Status */}
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            user.isActive === 1 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <span>{user.isActive === 1 ? 'Verified' : 'Pending'}</span>
                        </div>
                        {user.isActive === 0 && (
                          <button
                            onClick={() => handleManualVerification(user._id, user.email)}
                            className="text-green-600 hover:text-green-700 text-xs font-medium"
                            title="Manually verify this user's email"
                          >
                            Verify
                          </button>
                        )}
                      </div>

                      {/* Approval Status */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Approval:</span>
                        <button
                          onClick={() => handleToggleApproval(user._id, user.isApproval, user.isActive)}
                          disabled={user.isActive === 0}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                            user.isActive === 0 
                              ? 'bg-gray-200 cursor-not-allowed opacity-50' 
                              : user.isApproval === 1 
                                ? 'bg-green-500 cursor-pointer' 
                                : 'bg-gray-300 cursor-pointer'
                          }`}
                          title={
                            user.isActive === 0 
                              ? 'Email verification required before approval' 
                              : user.isApproval === 1 
                                ? 'Approved - Click to unapprove' 
                                : 'Not Approved - Click to approve'
                          }
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                              user.isApproval === 1 ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium ${
                          user.isActive === 0 
                            ? 'text-gray-400' 
                            : user.isApproval === 1 
                              ? 'text-green-600' 
                              : 'text-gray-500'
                        }`}>
                          {user.isActive === 0 ? 'Locked' : user.isApproval === 1 ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          </>
        )}
        
        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          loading={loading}
        />
      </motion.div>

      {/* User Verification Modal */}
      <UserVerificationModal 
        isOpen={verifyUserId !== null}
        onClose={cancelManualVerification}
        onConfirm={confirmManualVerification}
        userEmail={verifyUserEmail}
        isVerifying={verifyEmailMutation.isPending}
      />
 {/* Success Modal */}
      <UserActionSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      {/* Delete Confirmation Modal */}
      <UserDeleteModal 
        isOpen={deleteUserId !== null}
        onClose={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
        userName={deleteUserName}
        isDeleting={deleteUserHook.isPending}
      />
 {/* Delete Success Modal */}
      <UserDeleteSuccessModal 
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
        deletedDataStats={deletedDataStats}
      />

     
 
    </div>
  );
}
