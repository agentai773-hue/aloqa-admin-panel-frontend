import { ListItemSkeleton } from '../ui/SkeletonLoader';
import type { User, CreateAssistantData } from '../../api';
import { AGENT_TYPES, SYSTEM_PROMPT_TEMPLATES } from '../../data/assistantOptions';

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

      
      {/* User Selection Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
          User Selection
        </h4>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select User * <span className="text-xs font-normal text-gray-500">(Only approved users with Bearer Token)</span>
          </label>
          {loadingUsers ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <ListItemSkeleton key={index} />
              ))}
            </div>
          ) : approvedUsersWithToken.length === 0 ? (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <h5 className="font-semibold text-amber-800 mb-1">No Approved Users Found</h5>
                  <p className="text-sm text-amber-700">
                    Please approve a user and add their Bolna AI Bearer Token first.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <select
                required
                value={selectedUserIds[0] || ''}
                onChange={handleUserChange}
                disabled={isEditMode}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] text-base transition-all ${
                  isEditMode 
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">-- Select a User --</option>
                {approvedUsersWithToken.map((user: User) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} - {user.email} ({user.companyName})
                  </option>
                ))}
              </select>
              
              {isEditMode && (
                <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                  <span>⚠️</span>
                  <span>User cannot be changed in edit mode</span>
                </div>
              )}
              
              {/* Selected User Info Display */}
              {selectedUsers.length > 0 && selectedUsers[0] && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-sm font-bold text-[#306B25] mb-3 flex items-center gap-2">
                    <span className="text-[#5DD149]">✓</span> Selected User
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-600">Name:</span>
                      <p className="text-gray-800 font-medium">{selectedUsers[0].firstName} {selectedUsers[0].lastName}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Email:</span>
                      <p className="text-gray-800">{selectedUsers[0].email}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Company:</span>
                      <span className="text-gray-800">{selectedUsers[0].companyName}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-xs">
                      <span className="font-semibold">✓ Bearer Token Available</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Basic Information Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
         Basic Information
        </h4>
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
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
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
              onChange={(e) => setFormData(prev => ({ ...prev, agentType: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {AGENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
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
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
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
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
              placeholder="Hello! How can I assist you today?"
            />
          </div>
        </div>
      </div>

      {/* System Prompt Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#5DD149]/30">
        <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
          System Prompt Configuration
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              System Prompt Template (Optional)
            </label>
            <select
              value=""
              onChange={(e) => {
                const template = SYSTEM_PROMPT_TEMPLATES.find(t => t.name === e.target.value);
                if (template) {
                  setFormData(prev => ({ ...prev, systemPrompt: template.prompt }));
                }
              }}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              <option value="">-- Choose a template or write your own --</option>
              {SYSTEM_PROMPT_TEMPLATES.map(template => (
                <option key={template.name} value={template.name}>{template.name}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">Select a pre-built template to populate the system prompt below</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              System Prompt *
            </label>
            <textarea
              required
              rows={12}
              value={formData.systemPrompt}
              onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] font-mono text-sm transition-all"
              placeholder="You are a helpful AI assistant..."
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {formData.systemPrompt.length} characters
              </p>
              <p className="text-xs text-gray-500">
                ~{Math.round(formData.systemPrompt.split(' ').length)} words
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
