import type { CreateAssistantData } from '../../api';
import { 
  AGENT_FLOW_TYPES, 
  LLM_PROVIDERS, 
  LLM_MODELS,
  SLIDER_CONFIGS
} from '../../data/assistantOptions';

interface Step2Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
}

export default function Step2LLMVoiceConfig({ formData, setFormData }: Step2Props) {
  // Get LLM models based on selected provider
  const getLLMModels = () => {
    const provider = formData.llmConfig.provider as keyof typeof LLM_MODELS;
    return LLM_MODELS[provider] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg border-2 border-gray-700">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          Step 2: LLM Configuration
        </h3>
        <p className="text-gray-300 mt-2">Configure your AI model settings and parameters</p>
      </div>
      
      {/* LLM Agent Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-300">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-gray-700">⚙️</span> Language Model Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Agent Flow Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agent Flow Type
            </label>
            <select
              value={formData.llmConfig.agent_flow_type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, agent_flow_type: e.target.value }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            >
              {AGENT_FLOW_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provider
            </label>
            <select
              value={formData.llmConfig.provider}
              onChange={(e) => {
                const newProvider = e.target.value;
                const defaultModel = LLM_MODELS[newProvider as keyof typeof LLM_MODELS]?.[0]?.value || '';
                setFormData(prev => ({
                  ...prev,
                  llmConfig: { 
                    ...prev.llmConfig, 
                    provider: newProvider,
                    family: newProvider,
                    model: defaultModel
                  }
                }));
              }}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            >
              {LLM_PROVIDERS.map(provider => (
                <option key={provider.value} value={provider.value}>{provider.label}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Model *
            </label>
            <select
              value={formData.llmConfig.model}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, model: e.target.value }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            >
              {getLLMModels().map(model => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Parameters */}
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-300">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-gray-700">🎛️</span> Advanced Parameters
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Temperature */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Temperature
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.temperature.min}
              max={SLIDER_CONFIGS.temperature.max}
              step={SLIDER_CONFIGS.temperature.step}
              value={formData.llmConfig.temperature}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, temperature: parseFloat(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.temperature.description}</p>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.maxTokens.min}
              max={SLIDER_CONFIGS.maxTokens.max}
              step={SLIDER_CONFIGS.maxTokens.step}
              value={formData.llmConfig.max_tokens}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, max_tokens: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.maxTokens.description}</p>
          </div>

          {/* Top P */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Top P
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.topP.min}
              max={SLIDER_CONFIGS.topP.max}
              step={SLIDER_CONFIGS.topP.step}
              value={formData.llmConfig.top_p}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, top_p: parseFloat(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.topP.description}</p>
          </div>

          {/* Min P */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Min P
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.minP.min}
              max={SLIDER_CONFIGS.minP.max}
              step={SLIDER_CONFIGS.minP.step}
              value={formData.llmConfig.min_p}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, min_p: parseFloat(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.minP.description}</p>
          </div>

          {/* Top K */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Top K
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.topK.min}
              max={SLIDER_CONFIGS.topK.max}
              step={SLIDER_CONFIGS.topK.step}
              value={formData.llmConfig.top_k}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                llmConfig: { ...prev.llmConfig, top_k: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.topK.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

