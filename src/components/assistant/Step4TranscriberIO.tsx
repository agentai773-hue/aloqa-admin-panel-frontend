import type { CreateAssistantData } from '../../api';
import {
  TRANSCRIBER_PROVIDERS,
  TRANSCRIBER_MODELS,
  TRANSCRIBER_LANGUAGES,
  IO_PROVIDERS,
  IO_FORMATS,
  SLIDER_CONFIGS
} from '../../data/assistantOptions';

interface Step4Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
}

export default function Step4TranscriberIO({ formData, setFormData }: Step4Props) {
  // Get transcriber models based on selected provider
  const getTranscriberModels = () => {
    const provider = formData.transcriberConfig.provider as keyof typeof TRANSCRIBER_MODELS;
    return TRANSCRIBER_MODELS[provider] || [];
  };

  // Get transcriber languages based on selected provider
  const getTranscriberLanguages = () => {
    const provider = formData.transcriberConfig.provider as keyof typeof TRANSCRIBER_LANGUAGES;
    return TRANSCRIBER_LANGUAGES[provider] || [];
  };

  return (
    <div className="space-y-4 md:space-y-6">
      
      {/* Transcriber Configuration */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
          Transcriber Settings
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provider *
            </label>
            <select
              value={formData.transcriberConfig.provider}
              onChange={(e) => {
                const newProvider = e.target.value;
                const defaultModel = TRANSCRIBER_MODELS[newProvider as keyof typeof TRANSCRIBER_MODELS]?.[0]?.value || '';
                const defaultLanguage = TRANSCRIBER_LANGUAGES[newProvider as keyof typeof TRANSCRIBER_LANGUAGES]?.[0]?.value || 'en';
                setFormData(prev => ({
                  ...prev,
                  transcriberConfig: { 
                    ...prev.transcriberConfig, 
                    provider: newProvider,
                    model: defaultModel,
                    language: defaultLanguage
                  }
                }));
              }}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {TRANSCRIBER_PROVIDERS.map(provider => (
                <option key={provider.value} value={provider.value}>{provider.label}</option>
              ))}
            </select>
          </div>

          {/* Model - Conditional based on provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Model *
            </label>
            <select
              value={formData.transcriberConfig.model}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, model: e.target.value }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {getTranscriberModels().map(model => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Language *
            </label>
            <select
              value={formData.transcriberConfig.language}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, language: e.target.value }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {getTranscriberLanguages().map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Encoding - Fixed */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Encoding
            </label>
            <input
              type="text"
              value="linear16"
              disabled
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Sampling Rate */}
          {/* Sampling Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sampling Rate (Hz)
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.samplingRate.min}
              max={SLIDER_CONFIGS.samplingRate.max}
              step={SLIDER_CONFIGS.samplingRate.step}
              value={formData.transcriberConfig.sampling_rate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, sampling_rate: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.samplingRate.description}</p>
          </div>

          {/* Endpointing */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Endpointing (ms)
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.endpointing.min}
              max={SLIDER_CONFIGS.endpointing.max}
              step={SLIDER_CONFIGS.endpointing.step}
              value={formData.transcriberConfig.endpointing}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                transcriberConfig: { ...prev.transcriberConfig, endpointing: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.endpointing.description}</p>
          </div>
        </div>
      </div>

      {/* Input/Output Configuration */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
           Input/Output Providers
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Output Configuration */}
          <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               Output Configuration
            </h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Provider *
                </label>
                <select
                  value={formData.inputConfig.provider}
                  onChange={(e) => {
                    const newProvider = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      inputConfig: { ...prev.inputConfig, provider: newProvider },
                      outputConfig: { ...prev.outputConfig, provider: newProvider } // Sync output with input
                    }));
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
                >
                  {IO_PROVIDERS.map(provider => (
                    <option key={provider.value} value={provider.value}>{provider.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={formData.inputConfig.format}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    inputConfig: { ...prev.inputConfig, format: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
                >
                  {IO_FORMATS.map(format => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Input Configuration */}
          <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        Input Configuration
            </h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Provider * <span className="text-xs text-gray-500">(Synced with Input)</span>
                </label>
                <select
                  value={formData.outputConfig.provider}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  {IO_PROVIDERS.map(provider => (
                    <option key={provider.value} value={provider.value}>{provider.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={formData.outputConfig.format}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    outputConfig: { ...prev.outputConfig, format: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
                >
                  {IO_FORMATS.map(format => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
