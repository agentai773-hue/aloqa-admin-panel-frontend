import type { CreateAssistantData } from '../../api/assistants';
import type { User } from '../../api/users';

interface Step4Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
  selectedUser: User | null;
  selectedUsers?: User[];
}

export default function Step4TaskConfig({ formData, setFormData, selectedUser, selectedUsers = [] }: Step4Props) {
  const usersToShow = selectedUsers.length > 0 ? selectedUsers : (selectedUser ? [selectedUser] : []);
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Step 4: Task Configuration</h3>
      
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-4">Conversation Behavior Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hangup After Silence (seconds)
            </label>
            <input
              type="number"
              value={formData.taskConfig.hangup_after_silence}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, hangup_after_silence: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Incremental Delay (ms)
            </label>
            <input
              type="number"
              value={formData.taskConfig.incremental_delay}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, incremental_delay: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Words for Interruption
            </label>
            <input
              type="number"
              value={formData.taskConfig.number_of_words_for_interruption}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, number_of_words_for_interruption: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Call Terminate (seconds)
            </label>
            <input
              type="number"
              value={formData.taskConfig.call_terminate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                taskConfig: { ...prev.taskConfig, call_terminate: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.taskConfig.backchanneling}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  taskConfig: { ...prev.taskConfig, backchanneling: e.target.checked }
                }))}
                className="h-5 w-5 text-indigo-600 rounded"
              />
              <label className="text-sm font-semibold text-gray-700">Enable Backchanneling</label>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 text-lg">📋 Configuration Summary</h4>
        <div className="text-sm space-y-2 text-gray-700">
          {usersToShow.length > 0 && (
            <div>
              <span className="font-semibold">👤 Selected User:</span>
              <div className="ml-6 mt-1">
                <p>{usersToShow[0].firstName} {usersToShow[0].lastName} ({usersToShow[0].email})</p>
              </div>
            </div>
          )}
          <p><span className="font-semibold">🤖 Agent Name:</span> {formData.agentName || 'Not set'}</p>
          <p><span className="font-semibold">🧠 LLM:</span> {formData.llmConfig.provider} - {formData.llmConfig.model}</p>
          <p><span className="font-semibold">🗣️ Voice:</span> {formData.synthesizerConfig.provider} - {formData.synthesizerConfig.provider_config.voice}</p>
          <p><span className="font-semibold">🎤 Transcriber:</span> {formData.transcriberConfig.provider} - {formData.transcriberConfig.model}</p>
          <p><span className="font-semibold">📞 I/O Provider:</span> {formData.inputConfig.provider}</p>
        </div>
      </div>
    </div>
  );
}
