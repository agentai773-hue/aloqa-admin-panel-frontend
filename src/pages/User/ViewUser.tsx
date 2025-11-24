import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../../api/users';
import toast from 'react-hot-toast';

export default function ViewUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getUserById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load user');
      navigate('/users');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!data?.data?.user) return null;

  const user = data.data.user;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/users')}
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <div className="p-1 rounded-full group-hover:bg-blue-100 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-medium">Back to Users</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">User Profile</h1>
              <p className="text-gray-600">View and manage user information</p>
            </div>
            <div className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm ${
              user.isApproval === 1 
                ? 'bg-green-500 text-white' 
                : 'bg-amber-500 text-white'
            }`}>
              {user.isApproval === 1 ? '✓ Approved' : '⏱ Pending Approval'}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-10">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                <span className="text-4xl font-bold text-white">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-blue-100 text-lg">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Personal Information */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">First Name</label>
                  <p className="text-xl font-bold text-gray-900">{user.firstName}</p>
                </div>
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Last Name</label>
                  <p className="text-xl font-bold text-gray-900">{user.lastName}</p>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 block">Email Address</label>
                  <p className="text-xl font-bold text-gray-900 break-all">{user.email}</p>
                </div>
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                  <label className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2 block">Mobile Number</label>
                  <p className="text-xl font-bold text-gray-900">{user.mobile}</p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Company Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <label className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3 block">Company Name</label>
                  <p className="text-2xl font-bold text-gray-900">{user.companyName}</p>
                </div>
                <div className="bg-linear-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 block">Company Address</label>
                  <p className="text-lg text-gray-900 leading-relaxed">{user.companyAddress}</p>
                </div>
              </div>
            </div>

            {/* Bolna AI Integration */}
            {user.bearerToken && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Bolna AI Integration</h3>
                </div>
                
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <label className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3 block">Bearer Token</label>
                  <div className="bg-white/70 rounded-lg p-4 border border-green-300">
                    <p className="text-sm font-mono text-gray-700 break-all">{user.bearerToken}</p>
                  </div>
                  <div className="mt-4 flex items-start gap-2 text-sm text-green-700">
                    <svg className="h-5 w-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>This token is used to authenticate with Bolna AI API for creating assistants</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/users')}
                className="flex-1 min-w-[200px] px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => navigate(`/users/${id}/edit`)}
                className="flex-1 min-w-[200px] px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-500/30"
              >
                Edit User Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}