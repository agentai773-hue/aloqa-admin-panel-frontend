import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { assistantsAPI } from '../../api/assistants';
import { ArrowLeft, Loader2, Edit, CheckCircle2, XCircle } from 'lucide-react';
import type { User } from '../../api/users';

export default function AssistantView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['assistant', id],
    queryFn: () => assistantsAPI.getAssistantById(id!),
    enabled: !!id
  });

  const assistant = response?.data;

  if (isLoading) {
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

  const user = typeof assistant.userId === 'object' ? assistant.userId as User : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/assistant')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{assistant.agentName}</h1>
              <p className="text-gray-600 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize">
                  {assistant.agentType}
                </span>
                {assistant.agentId && (
                  <span className="ml-3 text-sm text-gray-500">
                    Agent ID: <span className="font-mono">{assistant.agentId}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/assistants/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Assistant
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Information</h2>
              {user ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-semibold text-gray-900">{user.email}</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="text-base font-semibold text-gray-900">{user.companyName}</p>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-800">Bearer Token Active</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No user information available</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Agent Name</p>
                  <p className="text-base font-semibold text-gray-900 p-3 bg-gray-50 rounded border">{assistant.agentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Agent Type</p>
                  <p className="text-base font-semibold text-gray-900 p-3 bg-gray-50 rounded border capitalize">{assistant.agentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Welcome Message</p>
                  <p className="text-base text-gray-900 p-3 bg-gray-50 rounded border">{assistant.agentWelcomeMessage}</p>
                </div>
                {assistant.webhookUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Webhook URL</p>
                    <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded border break-all">{assistant.webhookUrl}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">System Prompt</p>
                  <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded border whitespace-pre-wrap">{assistant.systemPrompt}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">LLM Configuration</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Provider</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{assistant.llmConfig?.provider || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Model</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.llmConfig?.model || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Temperature</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.llmConfig?.temperature ?? 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Max Tokens</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.llmConfig?.max_tokens || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Top P</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.llmConfig?.top_p ?? 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Flow Type</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{assistant.llmConfig?.agent_flow_type || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Voice Synthesizer</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Provider</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{assistant.synthesizerConfig?.provider || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Voice</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.synthesizerConfig?.provider_config?.voice || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Language</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.synthesizerConfig?.provider_config?.language || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Sampling Rate</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.synthesizerConfig?.provider_config?.sampling_rate || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Transcriber</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Provider</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{assistant.transcriberConfig?.provider || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Model</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.transcriberConfig?.model || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Language</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.transcriberConfig?.language || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Endpointing</p>
                    <p className="text-sm font-semibold text-gray-900">{assistant.transcriberConfig?.endpointing ? `${assistant.transcriberConfig.endpointing}ms` : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Input/Output</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Input Provider</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {assistant.inputConfig?.provider || 'N/A'} ({assistant.inputConfig?.format || 'N/A'})
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Output Provider</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {assistant.outputConfig?.provider || 'N/A'} ({assistant.outputConfig?.format || 'N/A'})
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Task Configuration</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                  <span className="text-xs text-gray-600">Hangup After Silence</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {assistant.taskConfig?.hangup_after_silence ? `${assistant.taskConfig.hangup_after_silence}s` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                  <span className="text-xs text-gray-600">Incremental Delay</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {assistant.taskConfig?.incremental_delay ? `${assistant.taskConfig.incremental_delay}ms` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                  <span className="text-xs text-gray-600">Words for Interruption</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {assistant.taskConfig?.number_of_words_for_interruption ?? 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                  <span className="text-xs text-gray-600">Call Terminate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {assistant.taskConfig?.call_terminate ? `${assistant.taskConfig.call_terminate}s` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                  <span className="text-xs text-gray-600">Backchanneling</span>
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {assistant.taskConfig?.backchanneling ? (
                      <><CheckCircle2 className="h-4 w-4 text-green-600" /> Enabled</>
                    ) : (
                      <><XCircle className="h-4 w-4 text-red-600" /> Disabled</>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Metadata</h2>
              <div className="space-y-3">
                {assistant.agentId && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Bolna Agent ID</p>
                    <p className="text-sm font-mono text-gray-900">{assistant.agentId}</p>
                  </div>
                )}
                {assistant.createdAt && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Created At</p>
                    <p className="text-sm text-gray-900">{new Date(assistant.createdAt).toLocaleString()}</p>
                  </div>
                )}
                {assistant.updatedAt && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                    <p className="text-sm text-gray-900">{new Date(assistant.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
