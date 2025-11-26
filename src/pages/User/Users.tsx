import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { usersAPI, type User } from '../../api';
import Modal from '../../components/ui/Modal';

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

  // Toggle approval - optimistic update
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
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
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
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-3 whitespace-nowrap sticky left-0 bg-white hover:bg-blue-50 z-10">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
                              className="p-1.5 text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
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
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && !loading && (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No users found</h3>
              <p className="mt-2 text-sm text-gray-500">Get started by creating your first user.</p>
            </div>
          )}
        </div>
      )}

      {/* Manual Verification Confirmation Modal */}
      <Modal
        isOpen={verifyUserId !== null}
        onClose={() => !isVerifying && cancelManualVerification()}
        title=""
        size="md"
        footer={
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">
            <button
              onClick={cancelManualVerification}
              disabled={isVerifying}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmManualVerification}
              disabled={isVerifying}
              className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Verify Email
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-linear-to-br from-yellow-400 to-orange-500 p-4 rounded-full shadow-lg">
              <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
            Manual Email Verification
          </h3>
          
          {/* Email Display */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border-2 border-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Email Address</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{verifyUserEmail}</p>
              </div>
            </div>
          </div>
          
          {/* Warning/Info Box */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-900">Important Notice</p>
                <p className="text-xs text-yellow-800 mt-1">
                  This action will bypass the normal email verification process and mark the user's email as verified immediately.
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Details */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-2">What will happen:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="h-5 w-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>User's email will be marked as <strong>verified</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="h-5 w-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>User will receive a <strong>welcome email</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="h-5 w-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>You can then <strong>approve the account</strong> for full access</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        size="md"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              OK
            </button>
          </div>
        }
      >
        <div className="py-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base text-gray-800">{successMessage}</p>
              {successMessage.includes('email sent') && (
                <p className="mt-2 text-sm text-gray-600">
                  The user will receive an email with a verification link that is valid for 24 hours.
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteUserId !== null}
        onClose={() => !isDeleting && cancelDeleteUser()}
        title="Confirm Delete User"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelDeleteUser}
              disabled={isDeleting}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteUser}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </button>
          </div>
        }
      >
        <div className="py-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base text-gray-800 font-medium mb-2">
                Are you sure you want to delete this user?
              </p>
              <p className="text-sm text-gray-600 mb-2">
                User: <span className="font-medium">{deleteUserName}</span>
              </p>
              <p className="text-sm text-red-600 font-medium">
                ⚠️ This action cannot be undone. The user will be permanently removed from the database.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Success Modal - Professional UI */}
      <Modal
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
        title="User Deleted Successfully"
        size="md"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setShowDeleteSuccessModal(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        }
      >
        <div className="py-4">
          {/* Success Icon with Animation */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-green-100 rounded-full p-4">
                <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">User Successfully Deleted</h3>
            <p className="mt-2 text-sm text-gray-600 text-center">
              The user and all associated data have been permanently removed from the system.
            </p>
          </div>

          {/* Deleted Data Summary */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Deleted Data Summary
            </h4>
            <div className="space-y-2">
              {/* Assistants */}
              <div className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI Assistants</span>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  {deletedDataStats.assistants} deleted
                </span>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Phone Numbers</span>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  {deletedDataStats.phoneNumbers} deleted
                </span>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-4 flex items-start bg-blue-50 rounded-lg p-3 border border-blue-200">
            <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-800">
              All related data including assistants, phone numbers, and user records have been permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
