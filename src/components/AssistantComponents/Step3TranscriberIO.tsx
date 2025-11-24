import type { CreateAssistantData } from '../../api/assistants';

interface Step3Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
}

export default function Step3TranscriberIO({ formData, setFormData }: Step3Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Step 3: Transcriber & Input/Output Configuration</h3>
      
      {/* Transcriber Config */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-4">Speech-to-Text Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
            <select
              value={formData.transcriberConfig.provider}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, provider: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            >
              <option value="deepgram">Deepgram</option>
              <option value="whisper">Whisper</option>
              <option value="assemblyai">AssemblyAI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
            <input
              type="text"
              value={formData.transcriberConfig.model}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, model: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <input
              type="text"
              value={formData.transcriberConfig.language}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, language: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sampling Rate</label>
            <input
              type="number"
              value={formData.transcriberConfig.sampling_rate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, sampling_rate: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Encoding</label>
            <input
              type="text"
              value={formData.transcriberConfig.encoding}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, encoding: e.target.value }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endpointing (ms)</label>
            <input
              type="number"
              value={formData.transcriberConfig.endpointing}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, endpointing: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Input/Output Config */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-4">Input/Output Providers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Input Configuration</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                <select
                  value={formData.inputConfig.provider}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    inputConfig: { ...prev.inputConfig, provider: e.target.value }
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="plivo">Plivo</option>
                  <option value="twilio">Twilio</option>
                  <option value="exotel">Exotel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
                <select
                  value={formData.inputConfig.format}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    inputConfig: { ...prev.inputConfig, format: e.target.value }
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="wav">WAV</option>
                  <option value="mp3">MP3</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Output Configuration</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                <select
                  value={formData.outputConfig.provider}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    outputConfig: { ...prev.outputConfig, provider: e.target.value }
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="plivo">Plivo</option>
                  <option value="twilio">Twilio</option>
                  <option value="exotel">Exotel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
                <select
                  value={formData.outputConfig.format}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    outputConfig: { ...prev.outputConfig, format: e.target.value }
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="wav">WAV</option>
                  <option value="mp3">MP3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
