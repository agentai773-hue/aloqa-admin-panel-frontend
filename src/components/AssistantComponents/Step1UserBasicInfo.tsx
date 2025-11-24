import { Loader2 } from 'lucide-react';
import type { User } from '../../api/users';
import type { CreateAssistantData } from '../../api/assistants';

interface Step1Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
  selectedUserIds: string[];
  setSelectedUserIds: (ids: string[]) => void;
  selectedUsers: User[];
  setSelectedUsers: (users: User[]) => void;
  approvedUsersWithToken: User[];
  loadingUsers: boolean;
  isEditMode?: boolean;
}

export default function Step1UserBasicInfo({
  formData,
  setFormData,
  selectedUserIds,
  setSelectedUserIds,
  selectedUsers,
  setSelectedUsers,
  approvedUsersWithToken,
  loadingUsers,
  isEditMode = false
}: Step1Props) {
  
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    if (!userId) {
      setSelectedUserIds([]);
      setSelectedUsers([]);
      return;
    }
    
    const user = approvedUsersWithToken.find((u: User) => u._id === userId);
    if (user) {
      setSelectedUserIds([userId]);
      setSelectedUsers([user]);
      // Update formData with userId
      setFormData(prev => ({ ...prev, userId }));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Step 1: Select User & Basic Information</h3>
      
      {/* User Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select User * <span className="text-xs font-normal text-gray-600">(Only approved users with Bearer Token)</span>
        </label>
        {loadingUsers ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : approvedUsersWithToken.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">
              No approved users with Bearer Token found. Please approve a user and add their Bolna AI Bearer Token first.
            </p>
          </div>
        ) : (
          <>
            <select
              required
              value={selectedUserIds[0] || ''}
              onChange={handleUserChange}
              disabled={isEditMode}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${isEditMode ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
            >
              <option value="">-- Select a User --</option>
              {approvedUsersWithToken.map((user: User) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} - {user.email} ({user.companyName})
                </option>
              ))}
            </select>
            
            {isEditMode && (
              <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                <span>⚠️</span> User cannot be changed in edit mode
              </p>
            )}
            
            {/* Selected User Info Display */}
            {selectedUsers.length > 0 && selectedUsers[0] && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected User:</h4>
                <div className="text-sm text-gray-700">
                  <p><span className="font-semibold">Name:</span> {selectedUsers[0].firstName} {selectedUsers[0].lastName}</p>
                  <p><span className="font-semibold">Email:</span> {selectedUsers[0].email}</p>
                  <p><span className="font-semibold">Company:</span> {selectedUsers[0].companyName}</p>
                  <p className="text-green-600 mt-1">✓ Bearer Token Available</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Agent Name *
          </label>
          <input
            type="text"
            required
            value={formData.agentName}
            onChange={(e) => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Priya - Shilp Serene"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Agent Type *
          </label>
          <select
            required
            value={formData.agentType}
            onChange={(e) => setFormData(prev => ({ ...prev, agentType: e.target.value as 'conversation' | 'webhook' | 'other' }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="conversation">Conversation</option>
            <option value="webhook">Webhook</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={formData.webhookUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://your-webhook-url.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Welcome Message *
          </label>
          <textarea
            required
            rows={2}
            value={formData.agentWelcomeMessage}
            onChange={(e) => setFormData(prev => ({ ...prev, agentWelcomeMessage: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Hello! How can I assist you today?"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            System Prompt *
          </label>
          <textarea
            required
            rows={4}
            value={formData.systemPrompt}
            onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="You are a helpful AI assistant..."
          />
        </div>
      </div>
    </div>
  );
}
