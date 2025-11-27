/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI, type User } from '../../api';
import UserVerificationModal from "../../components/modals/userModal/UserVerificationModal";
import UserActionSuccessModal from "../../components/modals/userModal/UserActionSuccessModal";
import UserDeleteModal from "../../components/modals/userModal/UserDeleteModal";
import UserDeleteSuccessModal from "../../components/modals/userModal/UserDeleteSuccessModal";

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [verifyUserId, setVerifyUserId] = useState<string | null>(null);
  const [verifyUserEmail, setVerifyUserEmail] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteUserName, setDeleteUserName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedDataStats, setDeletedDataStats] = useState({ assistants: 0, phoneNumbers: 0 });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getUsers();
      console.log(response);
      if (response.success && response.data) {
        setUsers(response.data.users);
      }
    } catch (err: unknown) {
      console.error('Error loading users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    
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

  // Filtered users
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.mobile.includes(searchQuery) ||
      user.companyName?.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'verified' && user.isActive === 1) ||
      (statusFilter === 'pending' && user.isActive === 0);
    
    const matchesApproval = approvalFilter === 'all' || 
      (approvalFilter === 'approved' && user.isApproval === 1) ||
      (approvalFilter === 'pending' && user.isApproval === 0);
    
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const handleToggleApproval = async (userId: string, currentStatus: 0 | 1, isActive: 0 | 1) => {
    // Check if email is verified
    if (isActive === 0) {
      setError('Cannot approve user until email is verified');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newStatus = currentStatus === 1 ? 0 : 1;
    
    // Optimistic update
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId ? { ...user, isApproval: newStatus } : user
      )
    );

    try {
      const response = await usersAPI.toggleApproval(userId, newStatus);
      if (!response.success) {
        // Revert on failure
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId ? { ...user, isApproval: currentStatus } : user
          )
        );
        setError('Failed to update status');
      }
    } catch (err: unknown) {
      // Revert on error
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isApproval: currentStatus } : user
        )
      );
      console.error('Error toggling approval:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle approval';
      setError(errorMessage);
    }
  };

  // Manual email verification by admin
  const handleManualVerification = (userId: string, email: string) => {
    setVerifyUserId(userId);
    setVerifyUserEmail(email);
  };

  const confirmManualVerification = async () => {
    if (!verifyUserId) return;

    setIsVerifying(true);
    try {
      const response = await usersAPI.verifyUserEmail(verifyUserId);
      
      if (response.success) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === verifyUserId ? { ...user, isActive: 1 } : user
          )
        );
        setSuccessMessage(`User email verified successfully!`);
        setShowSuccessModal(true);
        setVerifyUserId(null);
        setVerifyUserEmail('');
      } else {
        setError('Failed to verify user email');
      }
    } catch (err: unknown) {
      console.error('Error verifying user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify user';
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
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

    setIsDeleting(true);
    try {
      const response = await usersAPI.deleteUser(deleteUserId);
      if (response.success) {
        await loadUsers();
        // Store deleted data stats
        setDeletedDataStats({
          assistants: response.data?.deletedAssistants || 0,
          phoneNumbers: response.data?.deletedPhoneNumbers || 0
        });
        // Show delete success modal (separate from regular success modal)
        setShowDeleteSuccessModal(true);
        setDeleteUserId(null);
        setDeleteUserName('');
      } else {
        setError('Failed to delete user');
      }
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
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
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto">
                <svg className="h-5 w-5 text-red-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Email Status Filter */}
            <div className="min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
              >
                <option value="all">All Status</option>
                <option value="verified">✓ Verified</option>
                <option value="pending">⏳ Pending</option>
              </select>
            </div>

            {/* Approval Filter */}
            <div className="min-w-40">
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
              >
                <option value="all">All Approval</option>
                <option value="approved">✓ Approved</option>
                <option value="pending">⏳ Pending</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="ml-auto">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
                {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>
        </div>

        {/* Loading State Inside Table */}
        {loading ? (
          <div className="p-12">
            <div className="text-center">
              <motion.div 
                className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table wrapper with horizontal scroll */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxWidth: '100%' }}>
              <table className="w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 z-10" style={{ minWidth: '50px' }}>No.</th>
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
                  {filteredUsers.length === 0 ? (
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
                    filteredUsers.map((user, index) => (
                    <motion.tr 
                      key={user._id} 
                      className="hover:bg-green-50 transition-colors duration-150"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                    <td className="px-3 py-3 whitespace-nowrap sticky left-0 bg-white hover:bg-green-50 z-10">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-linear-to-br from-green-100 to-emerald-100 text-sm font-bold text-[#306B25]">
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
          </>
        )}
      </motion.div>

      {/* User Verification Modal */}
      <UserVerificationModal 
        isOpen={verifyUserId !== null}
        onClose={cancelManualVerification}
        onConfirm={confirmManualVerification}
        userEmail={verifyUserEmail}
        isVerifying={isVerifying}
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
        isDeleting={isDeleting}
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
