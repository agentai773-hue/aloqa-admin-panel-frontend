import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assistantsAPI, type CreateAssistantData } from '../../api/assistants';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Save, Eye } from 'lucide-react';
import { usersAPI, type User } from '../../api/users';

export default function AssistantEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch assistant data
  const { data: assistantResponse, isLoading } = useQuery({
    queryKey: ['assistant', id],
    queryFn: () => assistantsAPI.getAssistantById(id!),
    enabled: !!id
  });

  const assistant = assistantResponse?.data;

  // Fetch approved users
  const { data: usersResponse, isLoading: loadingUsers } = useQuery({
    queryKey: ['users-approved'],
    queryFn: () => usersAPI.getUsers({ isApproval: 1 })
  });

  const approvedUsersWithToken = (usersResponse?.data?.users || []).filter(
    (user: User) => user.bearerToken && user.isApproval === 1
  );

  // Form state
  const [formData, setFormData] = useState<CreateAssistantData>({
    userId: '',
    agentName: '',
    agentType: 'conversation',
    agentWelcomeMessage: '',
    webhookUrl: '',
    systemPrompt: '',
    llmConfig: {
      agent_flow_type: 'streaming',
      provider: 'openai',
      family: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 80,
      top_p: 0.9,
      min_p: 0.1,
      top_k: 0,
      presence_penalty: 0,
      frequency_penalty: 0,
      request_json: true
    },
    synthesizerConfig: {
      provider: 'polly',
      provider_config: {
        voice: 'Kajal',
        engine: 'neural',
        sampling_rate: '8000',
        language: 'hi-IN'
      },
      stream: true,
      buffer_size: 60,
      audio_format: 'wav'
    },
    transcriberConfig: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'hi',
      stream: true,
      sampling_rate: 16000,
      encoding: 'linear16',
      endpointing: 250
    },
    inputConfig: {
      provider: 'plivo',
      format: 'wav'
    },
    outputConfig: {
      provider: 'plivo',
      format: 'wav'
    },
    taskConfig: {
      hangup_after_silence: 8,
      incremental_delay: 40,
      number_of_words_for_interruption: 2,
      backchanneling: false,
      call_terminate: 800
    },
    routes: []
  });

  // Initialize form when assistant data is loaded
  useEffect(() => {
    if (assistant) {
      const userId = typeof assistant.userId === 'object' ? assistant.userId._id : assistant.userId;

      setFormData({
        userId,
        agentName: assistant.agentName,
        agentType: assistant.agentType,
        agentWelcomeMessage: assistant.agentWelcomeMessage,
        webhookUrl: assistant.webhookUrl || '',
        systemPrompt: assistant.systemPrompt,
        llmConfig: assistant.llmConfig || {
          agent_flow_type: 'streaming',
          provider: 'openai',
          family: 'openai',
          model: 'gpt-4o-mini',
          temperature: 0.2,
          max_tokens: 80,
          top_p: 0.9,
          min_p: 0.1,
          top_k: 0,
          presence_penalty: 0,
          frequency_penalty: 0,
          request_json: true
        },
        synthesizerConfig: assistant.synthesizerConfig || {
          provider: 'polly',
          provider_config: {
            voice: 'Kajal',
            engine: 'neural',
            sampling_rate: '8000',
            language: 'hi-IN'
          },
          stream: true,
          buffer_size: 60,
          audio_format: 'wav'
        },
        transcriberConfig: assistant.transcriberConfig || {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'hi',
          stream: true,
          sampling_rate: 16000,
          encoding: 'linear16',
          endpointing: 250
        },
        taskConfig: assistant.taskConfig || {
          hangup_after_silence: 8,
          incremental_delay: 40,
          number_of_words_for_interruption: 2,
          backchanneling: false,
          call_terminate: 800
        },
        inputConfig: assistant.inputConfig || {
          provider: 'plivo',
          format: 'wav'
        },
        outputConfig: assistant.outputConfig || {
          provider: 'plivo',
          format: 'wav'
        },
        routes: assistant.routes || []
      });
    }
  }, [assistant]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CreateAssistantData) => assistantsAPI.updateAssistantFull(id!, data),
    onSuccess: () => {
      toast.success('Assistant updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      queryClient.invalidateQueries({ queryKey: ['assistant', id] });
      navigate(`/assistants/${id}/view`);
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message 
        || (error as { message?: string })?.message 
        || 'Failed to update assistant';
      toast.error(message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agentName.trim()) {
      toast.error('Please enter agent name');
      return;
    }

    updateMutation.mutate(formData);
  };

  if (isLoading || loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assistant Not Found</h2>
        <button
          onClick={() => navigate('/assistant')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Assistants
        </button>
      </div>
    );
  }

  const selectedUser = approvedUsersWithToken.find((u: User) => u._id === formData.userId);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/assistants/${id}/view`)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Assistant</h1>
              <p className="text-gray-600 mt-1">{assistant.agentName}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/assistants/${id}/view`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Mode
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - User & Basic Info */}
            <div className="space-y-6">
              {/* User Information */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assigned User <span className="text-xs font-normal text-gray-500">(Cannot be changed)</span>
                    </label>
                    <select
                      disabled
                      value={formData.userId}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                    >
                      <option value={formData.userId}>
                        {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName} - ${selectedUser.email}` : 'User Info'}
                      </option>
                    </select>
                    {selectedUser && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <p><span className="font-semibold">Company:</span> {selectedUser.companyName}</p>
                        <p className="text-green-600 mt-1">✓ Bearer Token Active</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Agent Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.agentName}
                      onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="My Assistant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Agent Type *</label>
                    <select
                      required
                      value={formData.agentType}
                      onChange={(e) => setFormData({ ...formData, agentType: e.target.value as 'conversation' | 'webhook' | 'other' })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="conversation">Conversation</option>
                      <option value="webhook">Webhook</option>
                      <option value="sales">Sales</option>
                      <option value="support">Support</option>
                      <option value="appointment">Appointment</option>
                      <option value="survey">Survey</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Welcome Message *</label>
                    <textarea
                      required
                      value={formData.agentWelcomeMessage}
                      onChange={(e) => setFormData({ ...formData, agentWelcomeMessage: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Hello! How can I help you?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">System Prompt *</label>
                    <textarea
                      required
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="You are a helpful assistant..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - LLM & Voice */}
            <div className="space-y-6">
              {/* LLM Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">LLM Configuration</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                      <select
                        value={formData.llmConfig.provider}
                        onChange={(e) => setFormData({
                          ...formData,
                          llmConfig: { ...formData.llmConfig, provider: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                        onChange={(e) => setFormData({
                          ...formData,
                          llmConfig: { ...formData.llmConfig, model: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Temperature</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={formData.llmConfig.temperature}
                        onChange={(e) => setFormData({
                          ...formData,
                          llmConfig: { ...formData.llmConfig, temperature: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Max Tokens</label>
                      <input
                        type="number"
                        value={formData.llmConfig.max_tokens}
                        onChange={(e) => setFormData({
                          ...formData,
                          llmConfig: { ...formData.llmConfig, max_tokens: parseInt(e.target.value) }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Top P</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={formData.llmConfig.top_p}
                        onChange={(e) => setFormData({
                          ...formData,
                          llmConfig: { ...formData.llmConfig, top_p: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Flow Type</label>
                      <select
                        value={formData.llmConfig.agent_flow_type}
                        onChange={(e) => setFormData({
                          ...formData,
                          llmConfig: { ...formData.llmConfig, agent_flow_type: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="streaming">Streaming</option>
                        <option value="default">Default</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Synthesizer */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Voice Synthesizer</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                      <select
                        value={formData.synthesizerConfig.provider}
                        onChange={(e) => setFormData({
                          ...formData,
                          synthesizerConfig: { ...formData.synthesizerConfig, provider: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                        value={formData.synthesizerConfig.provider_config?.voice || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          synthesizerConfig: {
                            ...formData.synthesizerConfig,
                            provider_config: {
                              ...(formData.synthesizerConfig.provider_config || {}),
                              voice: e.target.value
                            }
                          }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                      <input
                        type="text"
                        value={formData.synthesizerConfig.provider_config?.language || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          synthesizerConfig: {
                            ...formData.synthesizerConfig,
                            provider_config: {
                              ...(formData.synthesizerConfig.provider_config || {}),
                              language: e.target.value
                            }
                          }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sampling Rate</label>
                      <input
                        type="text"
                        value={formData.synthesizerConfig.provider_config?.sampling_rate || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          synthesizerConfig: {
                            ...formData.synthesizerConfig,
                            provider_config: {
                              ...(formData.synthesizerConfig.provider_config || {}),
                              sampling_rate: e.target.value
                            }
                          }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcriber */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Transcriber</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                      <select
                        value={formData.transcriberConfig.provider}
                        onChange={(e) => setFormData({
                          ...formData,
                          transcriberConfig: { ...formData.transcriberConfig, provider: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="deepgram">Deepgram</option>
                        <option value="whisper">Whisper</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                      <input
                        type="text"
                        value={formData.transcriberConfig.model}
                        onChange={(e) => setFormData({
                          ...formData,
                          transcriberConfig: { ...formData.transcriberConfig, model: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                      <input
                        type="text"
                        value={formData.transcriberConfig.language}
                        onChange={(e) => setFormData({
                          ...formData,
                          transcriberConfig: { ...formData.transcriberConfig, language: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Endpointing (ms)</label>
                      <input
                        type="number"
                        value={formData.transcriberConfig.endpointing}
                        onChange={(e) => setFormData({
                          ...formData,
                          transcriberConfig: { ...formData.transcriberConfig, endpointing: parseInt(e.target.value) }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - I/O & Task Config */}
            <div className="space-y-6">
              {/* Input/Output */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Input/Output</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Input Provider</label>
                    <select
                      value={formData.inputConfig.provider}
                      onChange={(e) => setFormData({
                        ...formData,
                        inputConfig: { ...formData.inputConfig, provider: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="plivo">Plivo</option>
                      <option value="twilio">Twilio</option>
                      <option value="exotel">Exotel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Input Format</label>
                    <select
                      value={formData.inputConfig.format}
                      onChange={(e) => setFormData({
                        ...formData,
                        inputConfig: { ...formData.inputConfig, format: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="wav">WAV</option>
                      <option value="mp3">MP3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Output Provider</label>
                    <select
                      value={formData.outputConfig.provider}
                      onChange={(e) => setFormData({
                        ...formData,
                        outputConfig: { ...formData.outputConfig, provider: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="plivo">Plivo</option>
                      <option value="twilio">Twilio</option>
                      <option value="exotel">Exotel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Output Format</label>
                    <select
                      value={formData.outputConfig.format}
                      onChange={(e) => setFormData({
                        ...formData,
                        outputConfig: { ...formData.outputConfig, format: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="wav">WAV</option>
                      <option value="mp3">MP3</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Task Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Task Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hangup After Silence (s)</label>
                    <input
                      type="number"
                      value={formData.taskConfig.hangup_after_silence}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskConfig: { ...formData.taskConfig, hangup_after_silence: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Incremental Delay (ms)</label>
                    <input
                      type="number"
                      value={formData.taskConfig.incremental_delay}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskConfig: { ...formData.taskConfig, incremental_delay: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Words for Interruption</label>
                    <input
                      type="number"
                      value={formData.taskConfig.number_of_words_for_interruption}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskConfig: { ...formData.taskConfig, number_of_words_for_interruption: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Call Terminate (s)</label>
                    <input
                      type="number"
                      value={formData.taskConfig.call_terminate}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskConfig: { ...formData.taskConfig, call_terminate: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="backchanneling"
                      checked={formData.taskConfig.backchanneling}
                      onChange={(e) => setFormData({
                        ...formData,
                        taskConfig: { ...formData.taskConfig, backchanneling: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="backchanneling" className="text-sm font-semibold text-gray-700">
                      Enable Backchanneling
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(`/assistants/${id}/view`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Changes will be saved to both the database and Bolna AI. 
            The assigned user cannot be changed after creation.
          </p>
        </div>
      </div>
    </div>
  );
}
