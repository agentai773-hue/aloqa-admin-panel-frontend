import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { assistantsAPI, type Assistant } from '../../api/assistants';
import { type User } from '../../api/users';
import { Eye, Edit, Trash2, Search, X, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AssistantTableProps {
  assistants: Assistant[];
  users: User[];
  isLoading: boolean;
}

export default function AssistantTable({ assistants, users, isLoading }: AssistantTableProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; assistant: Assistant | null }>({
    open: false,
    assistant: null
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => assistantsAPI.deleteAssistant(id),
    onSuccess: () => {
      toast.success('Assistant deleted successfully from database and Bolna AI!');
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      setDeleteModal({ open: false, assistant: null });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message 
        || (error as { message?: string })?.message 
        || 'Failed to delete assistant';
      toast.error(message);
    }
  });

  const handleDelete = () => {
    if (deleteModal.assistant) {
      deleteMutation.mutate(deleteModal.assistant._id);
    }
  };

  const openDeleteModal = (assistant: Assistant) => {
    setDeleteModal({ open: true, assistant });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, assistant: null });
  };

  // Filter assistants based on search and user selection
  const filteredAssistants = assistants.filter((assistant) => {
    const query = searchQuery.toLowerCase();
    const user = typeof assistant.userId === 'object' ? assistant.userId : null;
    const userName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : '';
    const userEmail = user?.email.toLowerCase() || '';
    
    // Search filter
    const matchesSearch = !searchQuery || (
      assistant.agentName.toLowerCase().includes(query) ||
      assistant.agentType.toLowerCase().includes(query) ||
      assistant.status.toLowerCase().includes(query) ||
      userName.includes(query) ||
      userEmail.includes(query) ||
      assistant.agentId?.toLowerCase().includes(query)
    );
    
    // User filter
    const matchesUser = !selectedUserId || (user && user._id === selectedUserId);
    
    return matchesSearch && matchesUser;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300',
      deleted: 'bg-red-100 text-red-800 border-red-300'
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.draft;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#5DD149]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table with Filters */}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, type, status, user, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* User Filter */}
            <div className="min-w-[200px]">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
              >
                <option value="">All Users</option>
                {users.map((user) => {
                  const userAssistantsCount = assistants.filter(
                    (assistant) => typeof assistant.userId === 'object' && assistant.userId._id === user._id
                  ).length;
                  return (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} ({userAssistantsCount})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Results Count */}
            <div className="ml-auto">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
                {filteredAssistants.length} of {assistants.length} assistants
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxWidth: '100%' }}>
          <table className="w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '50px' }}>No.</th>
                <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '200px' }}>Agent Name</th>
                <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '200px' }}>Assigned User</th>
                <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '150px' }}>Type</th>
                <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '150px' }}>LLM Model</th>
                <th className="px-6 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '120px' }}>Status</th>
                <th className="px-6 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '150px' }}>Created</th>
                <th className="px-6 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssistants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <motion.div 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Search className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-bold text-lg">No assistants found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {searchQuery ? 'Try adjusting your search' : 'Create your first assistant to get started'}
                      </p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                filteredAssistants.map((assistant, index) => {
                  const user = typeof assistant.userId === 'object' ? assistant.userId : null;
                  return (
                    <motion.tr 
                      key={assistant._id} 
                      className="hover:bg-green-50/50 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.001 }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-[#5DD149]/20 to-[#306B25]/20 text-sm font-bold text-[#306B25]">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-bold text-gray-900">{assistant.agentName}</div>
                          {assistant.agentId && (
                            <div className="text-xs text-gray-500 font-mono mt-1">
                              ID: {assistant.agentId.substring(0, 16)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user ? (
                          <div className="flex items-center">
                            <div className="h-10 w-10 shrink-0">
                              <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-md" style={{
                                background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)'
                              }}>
                                <span className="text-sm font-bold text-white">
                                  {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 capitalize">{assistant.agentType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 capitalize">
                            {assistant.llmConfig.provider}
                          </span>
                          <span className="text-xs text-gray-500">{assistant.llmConfig.model}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusBadge(assistant.status)}`}>
                          {assistant.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600">
                        {new Date(assistant.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <motion.button
                            onClick={() => navigate(`/assistants/${assistant._id}/view`)}
                            className="p-2 text-[#5DD149] hover:bg-green-50 rounded-lg transition-all border border-transparent hover:border-[#5DD149]/20"
                            title="View Details"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => navigate(`/assistants/${assistant._id}/edit`)}
                            className="p-2 text-[#306B25] hover:bg-green-50 rounded-lg transition-all border border-transparent hover:border-[#306B25]/20"
                            title="Edit Assistant"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => openDeleteModal(assistant)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
                            title="Delete Assistant"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && deleteModal.assistant && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Delete Assistant?</h2>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete <strong className="text-gray-900">"{deleteModal.assistant.agentName}"</strong>?
                </p>
                
                <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-300 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-800 font-bold flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    This action cannot be undone!
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    The assistant will be permanently deleted from your database.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={closeDeleteModal}
                    disabled={deleteMutation.isPending}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-5 w-5" />
                        Delete 
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
