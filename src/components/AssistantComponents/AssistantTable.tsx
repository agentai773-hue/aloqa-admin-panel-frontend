import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assistantsAPI, type Assistant } from '../../api/assistants';
import { type User } from '../../api/users';
import { Eye, Edit, Trash2, Search, X, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, type, status, user, email, or agent ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          
          {/* User Filter Dropdown */}
          <div className="relative md:w-64">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
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
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-gray-600">
            Found {filteredAssistants.length} of {assistants.length} assistants
          </p>
          {(searchQuery || selectedUserId) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUserId('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-blue-600 to-indigo-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Agent Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Assign User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">LLM Model</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssistants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-semibold">No assistants found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {searchQuery ? 'Try adjusting your search' : 'Create your first assistant to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssistants.map((assistant) => {
                  const user = typeof assistant.userId === 'object' ? assistant.userId : null;
                  return (
                    <tr key={assistant._id} className="hover:bg-gray-50 transition-colors">
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
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unknown</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{assistant.agentType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 capitalize">
                            {assistant.llmConfig.provider}
                          </span>
                          <span className="text-xs text-gray-500">{assistant.llmConfig.model}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(assistant.status)}`}>
                          {assistant.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(assistant.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/assistants/${assistant._id}/view`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/assistants/${assistant._id}/edit`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Assistant"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(assistant)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Assistant"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.assistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Delete Assistant?</h2>
            </div>
            
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete <strong>"{deleteModal.assistant.agentName}"</strong>?
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-sm text-red-700 mt-2">
                The assistant will be permanently deleted from both:
              </p>
              <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                <li>Your database</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
