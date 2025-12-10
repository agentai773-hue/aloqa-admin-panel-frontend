import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voiceAssignmentAPI } from '../../api/voiceAssignments';
import { Search, Trash2, UserCheck, UserX, AlertTriangle, Users, Calendar, Clock, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../../components/ui/SkeletonLoader';

// Simple date formatting function to replace date-fns
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

interface APIError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function VoiceAssignments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const queryClient = useQueryClient();

  // Fetch voice assignments
  const { data: assignmentsData, isLoading, error } = useQuery({
    queryKey: ['voiceAssignments', currentPage, statusFilter, searchQuery],
    queryFn: () => voiceAssignmentAPI.getAllAssignments({
      page: currentPage,
      limit: pageSize,
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchQuery || undefined
    }),
    staleTime: 30000, // Cache for 30 seconds
  });

  // Delete assignment mutation
  const deleteMutation = useMutation({
    mutationFn: voiceAssignmentAPI.deleteAssignment,
    onSuccess: () => {
      toast.success('Voice assignment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['voiceAssignments'] });
    },
    onError: (error: Error) => {
      const apiError = error as APIError;
      const errorMessage = apiError?.response?.data?.message || 'Failed to delete assignment';
      toast.error(errorMessage);
    }
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' }) => 
      voiceAssignmentAPI.updateAssignmentStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Assignment ${variables.status === 'active' ? 'activated' : 'deactivated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['voiceAssignments'] });
    },
    onError: (error: Error) => {
      const apiError = error as APIError;
      const errorMessage = apiError?.response?.data?.message || 'Failed to update assignment status';
      toast.error(errorMessage);
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this voice assignment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusUpdate = (id: string, status: 'active' | 'inactive') => {
    statusMutation.mutate({ id, status });
  };
  // If backend returns array → wrap it in { data: array }
const normalizedData = Array.isArray(assignmentsData)
  ? { data: assignmentsData, pagination: null }
  : assignmentsData || {};

const assignments = normalizedData.data || [];
const pagination = normalizedData.pagination;


 

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center max-w-lg mx-auto bg-white rounded-xl shadow-xl p-8 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-3">Failed to Load Assignments</h3>
          <p className="text-gray-600 mb-6">Unable to fetch voice assignments. Please check your connection and try again.</p>
          <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded">
            Error: {error.message || 'Unknown error'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Voice Assignments</h1>
              <p className="text-gray-600 mt-2">Manage voice assignments for users</p>
            </div>
            
            {pagination && (
              <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
                Showing {assignments.length} of {pagination.total} assignments
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by user, voice name, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No voice assignments</h3>
              <p className="text-gray-600">Voice assignments will appear here when created.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Voice Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assignments.map((assignment, index) => (
                    <motion.tr
                      key={assignment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* User */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">
                              {assignment.user?.firstName?.charAt(0) || 'U'}{assignment.user?.lastName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">
                              {assignment.user?.firstName} {assignment.user?.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{assignment.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Voice Details */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{assignment.voiceName}</div>
                        <div className="text-xs text-gray-600">
                          {assignment.voiceAccent} • {assignment.voiceModel}
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-1">
                          {assignment.voiceId.substring(0, 20)}...
                        </div>
                      </td>

                      {/* Project */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{assignment.projectName}</div>
                        {assignment.description && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{assignment.description}</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            assignment.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {assignment.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center justify-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(assignment.createdAt)}
                          </div>
                          <div className="flex items-center justify-center text-xs text-gray-400 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(assignment.createdAt)}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(assignment._id, assignment.status === 'active' ? 'inactive' : 'active')}
                            className={`p-2 rounded-lg transition-colors ${
                              assignment.status === 'active'
                                ? 'text-red-600 hover:bg-red-100'
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={assignment.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {assignment.status === 'active' ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(assignment._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}