import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Users, Mic } from 'lucide-react';
import { usersAPI, voicesAPI } from '../../../api';
import toast from 'react-hot-toast';
import type { Voice } from '../../../api';

interface AssignVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  voice: Voice | null;
  onSuccess: () => void;
}

export default function AssignVoiceModal({ isOpen, onClose, voice, onSuccess }: AssignVoiceModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');

  // Fetch users
  const { data: usersResponse } = useQuery({
    queryKey: ['users', { isApproval: 1 }],
    queryFn: () => usersAPI.getUsers({ isApproval: 1 }),
    enabled: isOpen,
  });

  const users = usersResponse?.data?.users || [];

  // Assign voice mutation
  const assignMutation = useMutation({
    mutationFn: (data: { voiceId: string; userId: string }) => voicesAPI.assignVoice(data),
    onSuccess: () => {
      const user = users.find(u => u._id === selectedUserId);
      toast.success(`Voice assigned to ${user?.companyName || 'user'} successfully`);
      onSuccess();
      onClose();
      setSelectedUserId('');
    },
    onError: (error: unknown) => {
      const message = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : 'Failed to assign voice';
      toast.error(message);
    },
  });

  const handleAssign = () => {
    if (!selectedUserId || !voice) {
      toast.error('Please select a user');
      return;
    }
    assignMutation.mutate({ voiceId: voice.voice_id, userId: selectedUserId });
  };

  const handleClose = () => {
    onClose();
    setSelectedUserId('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#5DD149] to-[#306B25] rounded-lg">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Assign Voice</h2>
                    <p className="text-sm text-gray-600">
                      {voice ? `Assign "${voice.name}" to a user` : 'Select voice to assign'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Voice Details */}
            {voice && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Mic className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{voice.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {voice.provider.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        {voice.accent}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                        {voice.model}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-6">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Select User
                  </div>
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No users available</p>
                      <p className="text-sm">Please create some users first</p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <motion.div
                        key={user._id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedUserId === user._id
                            ? 'border-[#5DD149] bg-[#5DD149]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedUserId(user._id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            selectedUserId === user._id ? 'bg-[#5DD149]' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{user.companyName}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {user.firstName} {user.lastName}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.isApproval === 1 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {user.isApproval === 1 ? 'Approved' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleAssign}
                  disabled={!selectedUserId || assignMutation.isPending}
                  className="px-6 py-2 bg-gradient-to-r from-[#5DD149] to-[#306B25] text-white font-medium rounded-lg hover:from-[#4BC13B] hover:to-[#255A1D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {assignMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Assigning...
                    </div>
                  ) : (
                    'Assign Voice'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}