import type { CreateAssistantData } from '../../api/assistants';

interface Step2Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
}

export default function Step2LLMVoiceConfig({ formData, setFormData }: Step2Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Step 2: LLM & Voice Configuration</h3>
      
      {/* LLM Config */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-4">Language Model Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
            <select
              value={formData.llmConfig.provider}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, provider: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="groq">Groq</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
            <input
              type="text"
              value={formData.llmConfig.model}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, model: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Temperature</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={formData.llmConfig.temperature}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, temperature: parseFloat(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Tokens</label>
            <input
              type="number"
              value={formData.llmConfig.max_tokens}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, max_tokens: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Top P</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={formData.llmConfig.top_p}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, top_p: parseFloat(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Min P</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={formData.llmConfig.min_p}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, min_p: parseFloat(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Voice/Synthesizer Config */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-4">Voice Synthesizer Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
            <select
              value={formData.synthesizerConfig.provider}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: { ...prev.synthesizerConfig, provider: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            >
              <option value="polly">Amazon Polly</option>
              <option value="elevenlabs">ElevenLabs</option>
              <option value="deepgram">Deepgram</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Voice</label>
            <input
              type="text"
              value={formData.synthesizerConfig.provider_config.voice}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: {
                  ...prev.synthesizerConfig,
                  provider_config: { ...prev.synthesizerConfig.provider_config, voice: e.target.value }
                }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Engine</label>
            <select
              value={formData.synthesizerConfig.provider_config.engine}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: {
                  ...prev.synthesizerConfig,
                  provider_config: { ...prev.synthesizerConfig.provider_config, engine: e.target.value }
                }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            >
              <option value="neural">Neural</option>
              <option value="standard">Standard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <input
              type="text"
              value={formData.synthesizerConfig.provider_config.language}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: {
                  ...prev.synthesizerConfig,
                  provider_config: { ...prev.synthesizerConfig.provider_config, language: e.target.value }
                }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Audio Format</label>
            <select
              value={formData.synthesizerConfig.audio_format}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: { ...prev.synthesizerConfig, audio_format: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            >
              <option value="wav">WAV</option>
              <option value="mp3">MP3</option>
              <option value="pcm">PCM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Buffer Size</label>
            <input
              type="number"
              value={formData.synthesizerConfig.buffer_size}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: { ...prev.synthesizerConfig, buffer_size: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
