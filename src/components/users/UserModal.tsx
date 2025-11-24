import { type User, type CreateUserData } from '../../api';

type ModalMode = 'create' | 'edit' | 'view';

interface UserModalProps {
  mode: ModalMode;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: CreateUserData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  selectedUser?: User | null;
  formatDate: (dateString?: string) => string;
  onEditClick?: () => void;
}

export default function UserModal({
  mode,
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  validationErrors,
  isSubmitting,
  selectedUser,
  formatDate,
  onEditClick
}: UserModalProps) {
  if (!isOpen) return null;

  // View Modal
  if (mode === 'view' && selectedUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-slideUp">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">User Details</h3>
                  <p className="text-purple-100 text-sm">Complete user information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto flex-1">
            {/* User Avatar & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {(selectedUser.firstName?.[0] || '').toUpperCase()}{(selectedUser.lastName?.[0] || '').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedUser.isApproval === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedUser.isApproval === 1 ? '✓ Approved' : '⏳ Pending'}
              </span>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</label>
                <p className="text-base font-medium text-gray-900">{selectedUser.firstName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</label>
                <p className="text-base font-medium text-gray-900">{selectedUser.lastName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                <p className="text-base font-medium text-gray-900">{selectedUser.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Number</label>
                <p className="text-base font-medium text-gray-900">{selectedUser.mobile}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Name</label>
                <p className="text-base font-medium text-gray-900">{selectedUser.companyName}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Address</label>
                <p className="text-base font-medium text-gray-900">{selectedUser.companyAddress}</p>
              </div>
            </div>

            {/* Activity Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">Last Login</label>
                <p className="text-sm font-medium text-gray-900">{formatDate(selectedUser.lastLogin)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-green-600 uppercase tracking-wider block mb-1">Created At</label>
                <p className="text-sm font-medium text-gray-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">Updated At</label>
                <p className="text-sm font-medium text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-100 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-lg font-semibold transition-all shadow-sm"
            >
              Close
            </button>
            {onEditClick && (
              <button
                onClick={onEditClick}
                className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Edit User
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Create/Edit Modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-slideUp">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mode === 'create' ? "M12 4v16m8-8H4" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {mode === 'create' ? 'Create New User' : 'Edit User'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {mode === 'create' ? 'Fill in the user details below' : 'Update user information'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={onInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  validationErrors.firstName 
                    ? 'border-red-500 focus:border-red-600 bg-red-50' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Enter first name"
              />
              {validationErrors.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={onInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  validationErrors.lastName 
                    ? 'border-red-500 focus:border-red-600 bg-red-50' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Enter last name"
              />
              {validationErrors.lastName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                validationErrors.email 
                  ? 'border-red-500 focus:border-red-600 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="user@example.com"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={onInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                validationErrors.mobile 
                  ? 'border-red-500 focus:border-red-600 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="1234567890"
            />
            {validationErrors.mobile && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {validationErrors.mobile}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={onInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                validationErrors.companyName 
                  ? 'border-red-500 focus:border-red-600 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter company name"
            />
            {validationErrors.companyName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {validationErrors.companyName}
              </p>
            )}
          </div>

          {/* Company Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="companyAddress"
              value={formData.companyAddress}
              onChange={onInputChange}
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                validationErrors.companyAddress 
                  ? 'border-red-500 focus:border-red-600 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter complete company address"
            />
            {validationErrors.companyAddress && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {validationErrors.companyAddress}
              </p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password {mode === 'create' && <span className="text-red-500">*</span>}
                {mode === 'edit' && <span className="text-gray-500 text-xs">(Leave empty to keep current)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  validationErrors.password 
                    ? 'border-red-500 focus:border-red-600 bg-red-50' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Min. 6 characters"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.password}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password {mode === 'create' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  validationErrors.confirmPassword 
                    ? 'border-red-500 focus:border-red-600 bg-red-50' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Re-enter password"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-lg font-semibold transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </span>
              ) : (
                mode === 'create' ? 'Create User' : 'Update User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
