import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Search, UserCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '../../hooks/useUsers';
import { voiceAssignmentAPI } from '../../api/voiceAssignments';
import toast from 'react-hot-toast';
import type { Voice } from '../../api/voices/types';

interface APIError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface AssignVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  voice: Voice | null;
}

export const AssignVoiceModal: React.FC<AssignVoiceModalProps> = ({
  isOpen,
  onClose,
  voice
}) => {
  const [formData, setFormData] = useState({
    userId: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch users only when modal is open
  const { users, isLoading: isLoadingUsers, error: usersError } = useUsers({ enabled: isOpen });
  
  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchQuery.trim()) return users;
    
    return users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [users, searchQuery]);

  // Get selected user for display
  const selectedUser = useMemo(() => {
    return users?.find(user => user._id === formData.userId);
  }, [users, formData.userId]);

  // Mutation for assigning voice
  const assignVoiceMutation = useMutation({
    mutationFn: voiceAssignmentAPI.assignVoiceToUser,
    onSuccess: () => {
      toast.success('Voice assigned to user successfully!');
      queryClient.invalidateQueries({ queryKey: ['voiceAssignments'] });
      handleClose();
    },
    onError: (error: Error) => {
      const apiError = error as APIError;
      const errorMessage = apiError?.response?.data?.message || 'Failed to assign voice';
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voice || !formData.userId) {
      toast.error('Please select a user');
      return;
    }

    assignVoiceMutation.mutate({
      userId: formData.userId,
      voiceId: voice.id,
      voiceName: voice.name,
      voiceProvider: 'elevenlabs',
      voiceAccent: voice.accent,
      voiceModel: voice.model,
      projectName: 'Default Project', // Using default project name
      description: `Voice ${voice.name} assigned to user`
    });
  };

  const handleClose = () => {
    setFormData({ userId: '' });
    setSearchQuery('');
    setShowDropdown(false);
    onClose();
  };

  const handleUserSelect = (userId: string) => {
    setFormData({ userId });
    setShowDropdown(false);
    setSearchQuery('');
  };

  if (!voice) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Assign Voice to User
              </h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Voice Info */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-medium text-sm">
                    {voice.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{voice.name}</h3>
                  <p className="text-sm text-gray-500">
                    {voice.accent} • {voice.model}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* User Selection */}
              <div className="relative" ref={dropdownRef}>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>Select User *</span>
                </label>
                
                {/* Custom Searchable Dropdown */}
                <div className="relative">
                  {selectedUser ? (
                    /* Selected User Display */
                    <div className="w-full px-4 py-4 border-2 border-green-300 bg-green-50 rounded-xl flex items-center justify-between cursor-pointer hover:bg-green-100 transition-all duration-200"
                         onClick={() => setShowDropdown(!showDropdown)}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                          <UserCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">
                            {selectedUser.firstName} {selectedUser.lastName}
                          </p>
                          <p className="text-sm text-green-600">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                          Selected
                        </span>
                        <X 
                          className="w-5 h-5 text-green-600 hover:text-green-800 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({ userId: '' });
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Search Input */
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder={isLoadingUsers ? 'Loading users...' : 'Search users by name or email...'}
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 text-gray-700 font-medium placeholder-gray-400"
                          disabled={isLoadingUsers}
                        />
                        {isLoadingUsers && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Dropdown Results */}
                      {showDropdown && !isLoadingUsers && (
                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {filteredUsers.length > 0 ? (
                            <div className="p-2">
                              {filteredUsers.map((user) => (
                                <div
                                  key={user._id}
                                  onClick={() => handleUserSelect(user._id)}
                                  className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-0"
                                >
                                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800">
                                      {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    Select
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              {searchQuery ? 'No users found matching your search.' : 'No users available.'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {usersError && (
                    <p className="text-xs text-red-600 mt-2 flex items-center">
                      <span className="mr-1">❌</span>
                      Error loading users. Please try refreshing the page.
                    </p>
                  )}
                </div>
              </div>

              {/* Simple confirmation message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🎤</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Voice Assignment</h4>
                    <p className="text-sm text-blue-700">
                      This voice will be assigned to the selected user for their projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  disabled={assignVoiceMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                  disabled={assignVoiceMutation.isPending}
                >
                  {assignVoiceMutation.isPending ? '🔄 Assigning...' : '✅ Assign Voice'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};