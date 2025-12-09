import { useState } from 'react';
import type { CreateAssistantData } from '../../api';
import { useUserVoiceAssignments } from '../../hooks/useVoiceAssignments';
import { useVoices } from '../../hooks/useVoices';
import type { VoiceAssignment } from '../../api/voiceAssignments/types';
import type { Voice } from '../../api/voices/types';
import { CardSkeleton } from '../ui/SkeletonLoader';
import {
  SYNTHESIZER_PROVIDERS,
  POLLY_VOICES,
  VOICE_ENGINES,
  AUDIO_FORMATS,
  LANGUAGES,
  SLIDER_CONFIGS
} from '../../data/assistantOptions';
import { Mic, User, Settings, Volume2 } from 'lucide-react';

interface Step3Props {
  formData: CreateAssistantData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAssistantData>>;
  selectedUserIds: string[];
}

export default function Step3VoiceSynthesizer({ formData, setFormData, selectedUserIds }: Step3Props) {
  // Voice selection mode: 'manual' or 'dynamic'
  const [voiceSelectionMode, setVoiceSelectionMode] = useState<'manual' | 'dynamic'>('manual');

  // Get the first selected user's ID for fetching their voice assignments
  const selectedUserId = selectedUserIds[0];

  // Fetch user's voice assignments (only when dynamic mode and user is selected)
  const { data: userVoicesData, isLoading: loadingUserVoices, error: voicesError } = useUserVoiceAssignments(
    selectedUserId,
    { status: 'active' },
    { enabled: voiceSelectionMode === 'dynamic' && !!selectedUserId }
  );

  // Fetch all available voices for ElevenLabs dropdown
  const { data: allVoices = [], isLoading: loadingAllVoices } = useVoices();

  // Fetch all available voices for ElevenLabs dropdown
  // Handle different response structures - simple approach
  const userVoices: VoiceAssignment[] = Array.isArray(userVoicesData?.data)
    ? userVoicesData.data
    : Array.isArray(userVoicesData)
      ? userVoicesData
      : [];

  // Get available voices based on selected provider
  const getVoiceOptions = () => {
    if (formData.synthesizerConfig.provider === 'elevenlabs') {
      // Return real ElevenLabs voices from API
      return allVoices.map((voice: Voice) => ({
        value: voice.name,
        label: `${voice.name} (${voice.accent})`,
        voice_id: voice.voice_id
      }));
    }
    return POLLY_VOICES;
  };

  // Handle manual voice selection for ElevenLabs
  const handleManualVoiceSelect = (voiceName: string) => {
    if (formData.synthesizerConfig.provider === 'elevenlabs') {
      // Find the selected voice to get its voice_id
      const selectedVoice = allVoices.find((voice: Voice) => voice.name === voiceName);

      if (selectedVoice) {
        // Clean voice_id (remove elevenlabs- prefix if present)
        const cleanVoiceId = selectedVoice.voice_id.startsWith('elevenlabs-')
          ? selectedVoice.voice_id.replace('elevenlabs-', '')
          : selectedVoice.voice_id;

        setFormData(prev => ({
          ...prev,
          voiceId: cleanVoiceId,  // Store clean voice ID
          voiceName: voiceName,   // Store voice name
          synthesizerConfig: {
            ...prev.synthesizerConfig,
            provider_config: {
              ...prev.synthesizerConfig.provider_config,
              voice: voiceName,           // Voice name for Bolna
              voice_id: cleanVoiceId,     // Clean voice ID for Bolna
              model: "eleven_multilingual_v2", // Required model for ElevenLabs
              sampling_rate: "16000"       // Required sampling rate
            }
          }
        }));
      }
    } else {
      // For Polly, just set voice name (no voice_id needed)
      setFormData(prev => ({
        ...prev,
        synthesizerConfig: {
          ...prev.synthesizerConfig,
          provider_config: {
            ...prev.synthesizerConfig.provider_config,
            voice: voiceName
          }
        }
      }));
    }
  };

  // Handle voice selection mode change
  const handleVoiceModeChange = (mode: 'manual' | 'dynamic') => {
    setVoiceSelectionMode(mode);

    // Clear voice selections when switching modes
    if (mode === 'manual') {
      setFormData(prev => ({
        ...prev,
        voiceId: undefined,
        voiceName: undefined,
        synthesizerConfig: {
          ...prev.synthesizerConfig,
          provider: 'polly',           // ✅ Always use Polly for manual (DEFAULT)
          provider_config: {
            ...prev.synthesizerConfig.provider_config,
            voice: 'Kajal',           // ✅ Always default to Kajal
            engine: 'neural',         // ✅ Ensure neural engine
            voice_id: undefined,      // ✅ Clear voice_id for manual
            model: undefined          // ✅ Clear model for Polly
          }
        }
      }));
    } else {
      // Clear manual voice selection
      setFormData(prev => ({
        ...prev,
        synthesizerConfig: {
          ...prev.synthesizerConfig,
          provider_config: {
            ...prev.synthesizerConfig.provider_config,
            voice: '',
            voice_id: undefined // Clear voice_id when switching to dynamic
          }
        }
      }));
    }
  };

  // Handle dynamic voice selection
  const handleDynamicVoiceSelect = (voiceId: string, voiceName: string) => {
    // Remove 'elevenlabs-' prefix if present from voiceId
    const cleanVoiceId = voiceId.startsWith('elevenlabs-')
      ? voiceId.replace('elevenlabs-', '')
      : voiceId;

    setFormData(prev => ({
      ...prev,
      voiceId: cleanVoiceId,  // Store clean ID
      voiceName,
      synthesizerConfig: {
        ...prev.synthesizerConfig,
        provider: 'elevenlabs', // User assigned voices are ElevenLabs
        provider_config: {
          ...prev.synthesizerConfig.provider_config,
          voice: voiceName,           // ✅ Voice name in voice field
          voice_id: cleanVoiceId,     // ✅ Clean voice ID in voice_id field
          model: "eleven_multilingual_v2", // Required model for ElevenLabs
          sampling_rate: "16000"       // Required sampling rate
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Voice Selection Mode */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Selection Mode
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${voiceSelectionMode === 'manual'
            ? 'border-[#5DD149] bg-green-50'
            : 'border-gray-200 hover:border-gray-300'
            }`}>
            <input
              type="radio"
              value="manual"
              checked={voiceSelectionMode === 'manual'}
              onChange={(e) => handleVoiceModeChange(e.target.value as 'manual' | 'dynamic')}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${voiceSelectionMode === 'manual'
                ? 'border-[#5DD149] bg-[#5DD149]'
                : 'border-gray-300'
                }`}>
                {voiceSelectionMode === 'manual' && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manual Selection</h4>
                <p className="text-sm text-gray-500">Choose from all available voices in our voice library</p>
              </div>
            </div>
          </label>

          <label className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${voiceSelectionMode === 'dynamic'
            ? 'border-[#5DD149] bg-green-50'
            : 'border-gray-200 hover:border-gray-300'
            }`}>
            <input
              type="radio"
              value="dynamic"
              checked={voiceSelectionMode === 'dynamic'}
              onChange={(e) => handleVoiceModeChange(e.target.value as 'manual' | 'dynamic')}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${voiceSelectionMode === 'dynamic'
                ? 'border-[#5DD149] bg-[#5DD149]'
                : 'border-gray-300'
                }`}>
                {voiceSelectionMode === 'dynamic' && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">User Assigned Voices</h4>
                <p className="text-sm text-gray-500">Select from voices assigned to the selected user</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Dynamic Voice Selection */}
      {voiceSelectionMode === 'dynamic' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Select User Voice
          </h4>

          {!selectedUserId ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Please select a user first to see their assigned voices</p>
            </div>
          ) : loadingUserVoices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : voicesError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-3">⚠️</div>
              <p className="text-red-600">Error loading user voices</p>
              <p className="text-xs text-red-500 mt-1">{voicesError.message || 'API call failed'}</p>
            </div>
          ) : userVoices.length === 0 ? (
            <div className="text-center py-8">
              <Volume2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No voices assigned to this user</p>
              <p className="text-sm text-gray-500 mt-1">
                Please assign voices to this user first or use manual selection
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userVoices.map((voiceAssignment) => (
                <div
                  key={voiceAssignment._id}
                  onClick={() => handleDynamicVoiceSelect(voiceAssignment.voiceId, voiceAssignment.voiceName)}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${formData.voiceId === voiceAssignment.voiceId
                    ? 'border-[#5DD149] bg-green-50'
                    : 'border-gray-200 hover:border-[#5DD149] hover:bg-green-50'
                    }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${formData.voiceId === voiceAssignment.voiceId
                      ? 'bg-[#5DD149] text-white'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      <span className="text-2xl font-bold">
                        {voiceAssignment.voiceName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{voiceAssignment.voiceName}</h4>
                    <p className="text-sm text-gray-600 mb-1">{voiceAssignment.voiceAccent}</p>
                    <p className="text-sm text-gray-600">{voiceAssignment.voiceModel}</p>
                    <p className="text-xs text-gray-500 mt-2">{voiceAssignment.projectName}</p>

                    {formData.voiceId === voiceAssignment.voiceId && (
                      <div className="mt-2 flex justify-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Voice Configuration */}
      {voiceSelectionMode === 'manual' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          

          <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
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
                        voice: newProvider === 'elevenlabs' ? (allVoices[0]?.name || 'Rachel') : 'Kajal',
                        engine: newProvider === 'polly' ? 'neural' : prev.synthesizerConfig.provider_config.engine,
                        voice_id: newProvider === 'polly' ? undefined : prev.synthesizerConfig.provider_config.voice_id,
                        model: newProvider === 'elevenlabs' ? "eleven_multilingual_v2" : undefined
                      }
                    }
                  }));

                  // If switching to ElevenLabs and voices are loaded, set the first voice with proper voice_id
                  if (newProvider === 'elevenlabs' && allVoices.length > 0) {
                    handleManualVoiceSelect(allVoices[0].name);
                  }
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
                onChange={(e) => handleManualVoiceSelect(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149] transition-all"
                disabled={loadingAllVoices && formData.synthesizerConfig.provider === 'elevenlabs'}
              >
                <option value="">
                  {loadingAllVoices && formData.synthesizerConfig.provider === 'elevenlabs' ? 'Loading voices...' : 'Select a voice'}
                </option>
                {getVoiceOptions().map(voice => (
                  <option key={voice.value} value={voice.value}>{voice.label}</option>
                ))}
              </select>

              {formData.synthesizerConfig.provider === 'elevenlabs' && formData.voiceId && (
                <p className="text-xs text-gray-500 mt-2">
                  🎯 Voice ID: {formData.voiceId} | Model: eleven_multilingual_v2
                </p>
              )}
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
            {formData.synthesizerConfig.provider === 'elevenlabs' && (
  <>
    {/* Stability */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Stability</label>
      <input
        type="number"
        min={0}
        max={100}
        value={formData.synthesizerConfig.provider_config.stability || 50}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            synthesizerConfig: {
              ...prev.synthesizerConfig,
              provider_config: {
                ...prev.synthesizerConfig.provider_config,
                stability: Number(e.target.value)
              }
            }
          }))
        }
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
      />
    </div>

    {/* Similarity Boost */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Similarity Boost</label>
      <input
        type="number"
        min={0}
        max={100}
        value={formData.synthesizerConfig.provider_config.similarity_boost || 50}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            synthesizerConfig: {
              ...prev.synthesizerConfig,
              provider_config: {
                ...prev.synthesizerConfig.provider_config,
                similarity_boost: Number(e.target.value)
              }
            }
          }))
        }
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
      />
    </div>

    {/* Speed */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Speed</label>
      <input
        type="number"
        min={50}
        max={150}
        value={formData.synthesizerConfig.provider_config.speed || 100}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            synthesizerConfig: {
              ...prev.synthesizerConfig,
              provider_config: {
                ...prev.synthesizerConfig.provider_config,
                speed: Number(e.target.value)
              }
            }
          }))
        }
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
      />
    </div>

    {/* Emotion */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Emotion</label>
      <select
        value={formData.synthesizerConfig.provider_config.emotion || 'neutral'}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            synthesizerConfig: {
              ...prev.synthesizerConfig,
              provider_config: {
                ...prev.synthesizerConfig.provider_config,
                emotion: e.target.value
              }
            }
          }))
        }
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
      >
        <option value="neutral">Neutral</option>
        <option value="friendly">Friendly</option>
        <option value="angry">Angry</option>
        <option value="sad">Sad</option>
      </select>
    </div>

    {/* Emotion Strength */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Emotion Strength</label>
      <input
        type="number"
        min={0}
        max={100}
        value={formData.synthesizerConfig.provider_config.emotion_strength || 50}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            synthesizerConfig: {
              ...prev.synthesizerConfig,
              provider_config: {
                ...prev.synthesizerConfig.provider_config,
                emotion_strength: Number(e.target.value)
              }
            }
          }))
        }
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
      />
    </div>

    {/* Speaker Boost */}
    <div className="flex items-center space-x-2 mt-2">
      <input
        type="checkbox"
        checked={formData.synthesizerConfig.provider_config.use_speaker_boost || false}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            synthesizerConfig: {
              ...prev.synthesizerConfig,
              provider_config: {
                ...prev.synthesizerConfig.provider_config,
                use_speaker_boost: e.target.checked
              }
            }
          }))
        }
        className="w-5 h-5 rounded border-gray-300 text-[#5DD149] focus:ring-[#5DD149]"
      />
      <label className="text-sm font-medium text-gray-700">Use Speaker Boost</label>
    </div>
  </>
)}

          </div>
        </div>
      )}

      {/* Voice Selection Summary */}
      {/* {voiceSelectionMode === 'dynamic' && formData.voiceId && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5DD149] flex items-center justify-center">
              <Volume2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h5 className="font-semibold text-green-800">Selected Voice</h5>
              <p className="text-sm text-green-700">
                <strong>{formData.voiceName}</strong> • ElevenLabs • ID: {formData.voiceId}
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* Dynamic Assigned Voice Configuration (Read-Only Like Manual Layout) */}
      {voiceSelectionMode === 'dynamic' && formData.voiceName && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-bold text-[#306B25] mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Assigned Voice Configuration
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Provider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Provider *</label>
              <input
                value={formData.synthesizerConfig.provider}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500"
              />
            </div>

            {/* Voice */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Voice *</label>
              <input
                value={formData.voiceName}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500"
              />
            </div>

            {/* Model */}
            {formData.synthesizerConfig.provider_config.model && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                <input
                  value={formData.synthesizerConfig.provider_config.model}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500"
                />
              </div>
            )}

            {/* Voice ID */}
            {formData.voiceId && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Voice ID</label>
                <input
                  value={formData.voiceId}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500"
                />
              </div>
            )}

            {/* Audio Format */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Audio Format</label>
              <input
                value={formData.synthesizerConfig.audio_format}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500"
              />
            </div>

            {/* Buffer Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buffer Size</label>
              <input
                type="number"
                min={SLIDER_CONFIGS.bufferSize.min}
                max={SLIDER_CONFIGS.bufferSize.max}
                step={SLIDER_CONFIGS.bufferSize.step}
                value={formData.synthesizerConfig.buffer_size}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    synthesizerConfig: {
                      ...prev.synthesizerConfig,
                      buffer_size: parseInt(e.target.value) || 0
                    }
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#5DD149] focus:border-[#5DD149]"
              />
              <p className="text-xs text-gray-500 mt-1">{SLIDER_CONFIGS.bufferSize.description}</p>
            </div>
            {/* Stability */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stability
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.synthesizerConfig.provider_config.stability}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    synthesizerConfig: {
                      ...prev.synthesizerConfig,
                      provider_config: {
                        ...prev.synthesizerConfig.provider_config,
                        stability: Number(e.target.value)
                      }
                    }
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
              />
            </div>

            {/* Similarity Boost */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Similarity Boost
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.synthesizerConfig.provider_config.similarity_boost}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    synthesizerConfig: {
                      ...prev.synthesizerConfig,
                      provider_config: {
                        ...prev.synthesizerConfig.provider_config,
                        similarity_boost: Number(e.target.value)
                      }
                    }
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
              />
            </div>

            {/* Speed */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Speed
              </label>
              <input
                type="number"
                min={50}
                max={150}
                value={formData.synthesizerConfig.provider_config.speed}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    synthesizerConfig: {
                      ...prev.synthesizerConfig,
                      provider_config: {
                        ...prev.synthesizerConfig.provider_config,
                        speed: Number(e.target.value)
                      }
                    }
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
              />
            </div>

            {/* Emotion */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emotion
              </label>
              <select
                value={formData.synthesizerConfig.provider_config.emotion}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    synthesizerConfig: {
                      ...prev.synthesizerConfig,
                      provider_config: { ...prev.synthesizerConfig.provider_config, emotion: e.target.value }
                    }
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
              >
                <option value="neutral">Neutral</option>
                <option value="friendly">Friendly</option>
                <option value="angry">Angry</option>
                <option value="sad">Sad</option>
              </select>
            </div>

            {/* Emotion Strength */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emotion Strength
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.synthesizerConfig.provider_config.emotion_strength}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    synthesizerConfig: {
                      ...prev.synthesizerConfig,
                      provider_config: {
                        ...prev.synthesizerConfig.provider_config,
                        emotion_strength: Number(e.target.value)
                      }
                    }
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-[#5DD149] focus:border-[#5DD149]"
              />
            </div>

            {/* Speaker Boost */}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={formData.synthesizerConfig.provider_config.use_speaker_boost}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    synthesizerConfig: {
                      ...prev.synthesizerConfig,
                      provider_config: { ...prev.synthesizerConfig.provider_config, use_speaker_boost: e.target.checked }
                    }
                  }))
                }
                className="w-5 h-5 rounded border-gray-300 text-[#5DD149] focus:ring-[#5DD149]"
              />
              <label className="text-sm font-medium text-gray-700">Use Speaker Boost</label>
            </div>


          </div>
        </div>
      )}



    </div>
  );
}
