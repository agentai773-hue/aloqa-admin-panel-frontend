import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { phoneNumbersAPI, type PhoneNumber, type PhoneNumberSearch } from '../../api/phoneNumbers';
import { usersAPI } from '../../api/users';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export default function PhoneNumberList() {
  const queryClient = useQueryClient();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'assigned'>('all');
  const [filterCountry, setFilterCountry] = useState<'all' | 'US' | 'IN'>('all');

  // Buy modal state
  const [buyCountry, setBuyCountry] = useState<'US' | 'IN'>('US');
  const [searchPattern, setSearchPattern] = useState('');
  const [buyUserId, setBuyUserId] = useState('');
  const [searchResults, setSearchResults] = useState<PhoneNumberSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Assign modal state
  const [assignUserId, setAssignUserId] = useState('');

  // Fetch phone numbers
  const { data: phoneNumbers = [], isLoading } = useQuery({
    queryKey: ['phoneNumbers', filterStatus, filterCountry],
    queryFn: () => phoneNumbersAPI.getAllPhoneNumbers({
      status: filterStatus === 'all' ? undefined : filterStatus,
      country: filterCountry === 'all' ? undefined : filterCountry,
    }),
  });

  // Fetch users for assignment
  const { data: usersResponse } = useQuery({
    queryKey: ['users', { isApproval: 1 }],
    queryFn: () => usersAPI.getUsers({ isApproval: 1 }),
  });

  const users = usersResponse?.data?.users || [];

  // Search phone numbers mutation
  const searchMutation = useMutation({
    mutationFn: () => phoneNumbersAPI.searchPhoneNumbers({ 
      country: buyCountry, 
      pattern: searchPattern || undefined,
      userId: buyUserId 
    }),
    onSuccess: (data) => {
      setSearchResults(data);
      if (data.length === 0) {
        toast.error('No phone numbers found');
      }
    },
    onError: () => {
      toast.error('Failed to search phone numbers');
    },
  });

  // Buy phone number mutation
  const buyMutation = useMutation({
    mutationFn: (phoneNumber: string) => phoneNumbersAPI.buyPhoneNumber({
      country: buyCountry,
      phoneNumber,
      userId: buyUserId,
    }),
    onSuccess: () => {
      toast.success('Phone number purchased successfully');
      queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
      setShowBuyModal(false);
      setSearchResults([]);
      setSearchPattern('');
      setBuyUserId('');
    },
    onError: () => {
      toast.error('Failed to purchase phone number');
    },
  });

  // Assign phone number mutation
  const assignMutation = useMutation({
    mutationFn: () => phoneNumbersAPI.assignPhoneNumber({
      phoneNumberId: selectedPhoneNumber!._id,
      userId: assignUserId,
    }),
    onSuccess: () => {
      toast.success('Phone number assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
      setShowAssignModal(false);
      setSelectedPhoneNumber(null);
      setAssignUserId('');
    },
    onError: () => {
      toast.error('Failed to assign phone number');
    },
  });

  // Unassign phone number mutation
  const unassignMutation = useMutation({
    mutationFn: (id: string) => phoneNumbersAPI.unassignPhoneNumber(id),
    onSuccess: () => {
      toast.success('Phone number unassigned successfully');
      queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
    },
    onError: () => {
      toast.error('Failed to unassign phone number');
    },
  });

  // Delete phone number mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => phoneNumbersAPI.deletePhoneNumber(id),
    onSuccess: () => {
      toast.success('Phone number deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
      setShowDeleteDialog(false);
      setSelectedPhoneNumber(null);
    },
    onError: () => {
      toast.error('Failed to delete phone number');
    },
  });

  const handleSearch = () => {
    if (!buyUserId) {
      toast.error('Please select a user to search numbers for');
      return;
    }
    setIsSearching(true);
    searchMutation.mutate();
    setIsSearching(false);
  };

  const handleBuy = (phoneNumber: string) => {
    if (!buyUserId) {
      toast.error('Please select a user');
      return;
    }
    buyMutation.mutate(phoneNumber);
  };

  const handleAssign = () => {
    if (!assignUserId) {
      toast.error('Please select a user');
      return;
    }
    assignMutation.mutate();
  };

  const handleUnassign = (phoneNumber: PhoneNumber) => {
    unassignMutation.mutate(phoneNumber._id);
  };

  const handleDelete = () => {
    if (selectedPhoneNumber) {
      deleteMutation.mutate(selectedPhoneNumber._id);
    }
  };

  const openAssignModal = (phoneNumber: PhoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setShowAssignModal(true);
  };

  const openDeleteDialog = (phoneNumber: PhoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">Phone Number Management</h1>
          <p className="text-gray-300 mt-2">Purchase and manage phone numbers from Bolna</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'available' | 'assigned')}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
            </select>

            {/* Filter by Country */}
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value as 'all' | 'US' | 'IN')}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="all">All Countries</option>
              <option value="US">United States</option>
              <option value="IN">India</option>
            </select>
          </div>

          <button
            onClick={() => setShowBuyModal(true)}
            className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Purchase Phone Number
          </button>
        </div>

        {/* Phone Numbers Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Phone Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Assigned User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Purchased</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {phoneNumbers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No phone numbers found. Purchase a new number to get started.
                    </td>
                  </tr>
                ) : (
                  phoneNumbers.map((phoneNumber) => (
                    <tr key={phoneNumber._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">{phoneNumber.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {phoneNumber.country}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            phoneNumber.status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : phoneNumber.status === 'assigned'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {phoneNumber.status.charAt(0).toUpperCase() + phoneNumber.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {phoneNumber.userId ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{phoneNumber.userId.name}</div>
                            <div className="text-xs text-gray-500">{phoneNumber.userId.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {phoneNumber.price ? `$${(phoneNumber.price / 100).toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(phoneNumber.purchasedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {phoneNumber.status === 'available' && (
                            <button
                              onClick={() => openAssignModal(phoneNumber)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                            >
                              Assign
                            </button>
                          )}
                          {phoneNumber.status === 'assigned' && (
                            <button
                              onClick={() => handleUnassign(phoneNumber)}
                              disabled={unassignMutation.isPending}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                              Unassign
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteDialog(phoneNumber)}
                            disabled={deleteMutation.isPending}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <Modal
        isOpen={showBuyModal}
        onClose={() => {
          setShowBuyModal(false);
          setSearchResults([]);
          setSearchPattern('');
          setBuyUserId('');
        }}
        title="Purchase Phone Number"
        size="lg"
      >
        <div className="space-y-4">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select User *</label>
            <select
              value={buyUserId}
              onChange={(e) => setBuyUserId(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Phone number will be purchased using this user's Bolna account</p>
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
              <select
                value={buyCountry}
                onChange={(e) => setBuyCountry(e.target.value as 'US' | 'IN')}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="US">United States</option>
                <option value="IN">India</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pattern (Optional)
              </label>
              <input
                type="text"
                value={searchPattern}
                onChange={(e) => setSearchPattern(e.target.value)}
                placeholder="e.g., 555"
                maxLength={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching || searchMutation.isPending}
            className="w-full px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {searchMutation.isPending ? 'Searching...' : 'Search Available Numbers'}
          </button>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 border-t-2 border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Numbers</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <div className="font-mono font-semibold text-gray-900">{result.phone_number}</div>
                      <div className="text-xs text-gray-500">
                        {result.locality}, {result.region} - ${result.price}
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuy(result.phone_number)}
                      disabled={buyMutation.isPending}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {buyMutation.isPending ? 'Buying...' : 'Buy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedPhoneNumber(null);
          setAssignUserId('');
        }}
        title="Assign Phone Number"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={selectedPhoneNumber?.phoneNumber || ''}
              disabled
              className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select User *</label>
            <select
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowAssignModal(false);
                setSelectedPhoneNumber(null);
                setAssignUserId('');
              }}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={assignMutation.isPending || !assignUserId}
              className="flex-1 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      {selectedPhoneNumber && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedPhoneNumber(null);
          }}
          onConfirm={handleDelete}
          title="Delete Phone Number"
          message={`Are you sure you want to delete ${selectedPhoneNumber.phoneNumber}? This will delete the number from Bolna and cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
