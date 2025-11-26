import type { CreateAssistantData } from '../../api/assistants';
import type { User } from '../../api/users';
import { SLIDER_CONFIGS } from '../../data/assistantOptions';

interface Step5Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
  selectedUser: User | null;
  selectedUsers?: User[];
}

export default function Step5TaskConfig({ formData, setFormData, selectedUser, selectedUsers = [] }: Step5Props) {
  const usersToShow = selectedUsers.length > 0 ? selectedUsers : (selectedUser ? [selectedUser] : []);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg border-2 border-gray-700">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          Step 5: Task Configuration
        </h3>
        <p className="text-gray-300 mt-2">Configure conversation behavior and finalize settings</p>
      </div>
      
      {/* Task Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-300">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-gray-700">💬</span> Conversation Behavior Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hangup After Silence */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hangup After Silence (seconds)
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.hangupAfterSilence.min}
              max={SLIDER_CONFIGS.hangupAfterSilence.max}
              step={SLIDER_CONFIGS.hangupAfterSilence.step}
              value={formData.taskConfig.hangupAfterSilence}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, hangupAfterSilence: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.hangupAfterSilence.description}</p>
          </div>

          {/* Incremental Delay */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Incremental Delay (ms)
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.incrementalDelay.min}
              max={SLIDER_CONFIGS.incrementalDelay.max}
              step={SLIDER_CONFIGS.incrementalDelay.step}
              value={formData.taskConfig.incrementalDelay}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, incrementalDelay: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.incrementalDelay.description}</p>
          </div>

          {/* Number of Words for Interruption */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Words for Interruption
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.numberOfWordsForInterruption.min}
              max={SLIDER_CONFIGS.numberOfWordsForInterruption.max}
              step={SLIDER_CONFIGS.numberOfWordsForInterruption.step}
              value={formData.taskConfig.numberOfWordsForInterruption}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, numberOfWordsForInterruption: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.numberOfWordsForInterruption.description}</p>
          </div>

          {/* Backchanneling */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
            <input
              type="checkbox"
              id="backchanneling"
              checked={formData.taskConfig.backchanneling}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, backchanneling: e.target.checked }
              }))}
              className="w-5 h-5 text-gray-700 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
            />
            <label htmlFor="backchanneling" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Enable Backchanneling
            </label>
          </div>

          {/* Call Terminate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Call Terminate (seconds) *
            </label>
            <input
              type="number"
              required
              value={formData.taskConfig.callTerminate || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, callTerminate: e.target.value ? parseInt(e.target.value) : undefined }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
              min={1}
              placeholder="e.g., 90 or 300"
            />
            <p className="text-xs text-gray-500 mt-2">Maximum call duration in seconds (Required)</p>
          </div>
        </div>
      </div>

      {/* Selected Users Display */}
      {usersToShow.length > 0 && (
        <div className="bg-gray-100 p-6 rounded-xl shadow-md border-2 border-gray-300">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-gray-700">👤</span>
            {usersToShow.length === 1 ? 'Selected User' : `Selected Users (${usersToShow.length})`}
          </h4>
          <div className="space-y-3">
            {usersToShow.map((user) => (
              <div key={user._id} className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-600 mt-1">📧 {user.email}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm">
                    {user.companyName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
