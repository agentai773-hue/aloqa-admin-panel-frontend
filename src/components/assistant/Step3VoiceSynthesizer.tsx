import type { CreateAssistantData } from '../../api';
import {
  SYNTHESIZER_PROVIDERS,
  POLLY_VOICES,
  ELEVENLABS_VOICES,
  VOICE_ENGINES,
  AUDIO_FORMATS,
  LANGUAGES,
  SLIDER_CONFIGS
} from '../../data/assistantOptions';

interface Step3Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
}

export default function Step3VoiceSynthesizer({ formData, setFormData }: Step3Props) {
  // Get available voices based on selected provider
  const getVoiceOptions = () => {
    if (formData.synthesizerConfig.provider === 'elevenlabs') {
      return ELEVENLABS_VOICES;
    }
    return POLLY_VOICES;
  };

  return (
    <div className="space-y-6">
    
      
      {/* Voice Synthesizer Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
        Voice Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provider *
            </label>
            <select
              value={formData.synthesizerConfig.provider}
              onChange={(e) => {
                const newProvider = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  synthesizerConfig: { 
                    ...prev.synthesizerConfig, 
                    provider: newProvider,
                    provider_config: {
                      ...prev.synthesizerConfig.provider_config,
                      voice: newProvider === 'elevenlabs' ? 'ava' : 'Kajal'
                    }
                  }
                }));
              }}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {SYNTHESIZER_PROVIDERS.map(provider => (
                <option key={provider.value} value={provider.value}>{provider.label}</option>
              ))}
            </select>
          </div>

          {/* Voice */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Voice *
            </label>
            <select
              value={formData.synthesizerConfig.provider_config.voice}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: {
                  ...prev.synthesizerConfig,
                  provider_config: { ...prev.synthesizerConfig.provider_config, voice: e.target.value }
                }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {getVoiceOptions().map(voice => (
                <option key={voice.value} value={voice.value}>{voice.label}</option>
              ))}
            </select>
          </div>

          {/* Engine */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Engine
            </label>
            <select
              value={formData.synthesizerConfig.provider_config.engine}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: {
                  ...prev.synthesizerConfig,
                  provider_config: { ...prev.synthesizerConfig.provider_config, engine: e.target.value }
                }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {VOICE_ENGINES.map(engine => (
                <option key={engine.value} value={engine.value}>{engine.label}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Language *
            </label>
            <select
              value={formData.synthesizerConfig.provider_config.language}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: {
                  ...prev.synthesizerConfig,
                  provider_config: { ...prev.synthesizerConfig.provider_config, language: e.target.value }
                }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Audio Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Audio Format
            </label>
            <select
              value={formData.synthesizerConfig.audio_format}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: { ...prev.synthesizerConfig, audio_format: e.target.value }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            >
              {AUDIO_FORMATS.map(format => (
                <option key={format.value} value={format.value}>{format.label}</option>
              ))}
            </select>
          </div>

          {/* Buffer Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Buffer Size
            </label>
            <input
              type="number"
              min={SLIDER_CONFIGS.bufferSize.min}
              max={SLIDER_CONFIGS.bufferSize.max}
              step={SLIDER_CONFIGS.bufferSize.step}
              value={formData.synthesizerConfig.buffer_size}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                synthesizerConfig: { ...prev.synthesizerConfig, buffer_size: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{SLIDER_CONFIGS.bufferSize.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
