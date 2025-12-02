import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { assistantsAPI } from '../../api';
import { ArrowLeft, Edit, CheckCircle2 } from 'lucide-react';
import { FormSkeleton } from '../../components/ui/SkeletonLoader';
import type { User } from '../../api';

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <FormSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assistant Not Found</h2>
        <button
          onClick={() => navigate('/assistant')}
          className="mt-4 px-6 py-2 bg-[#5DD149] text-white rounded-lg hover:bg-[#306B25]"
        >
          Back to Assistants
        </button>
      </div>
    );
  }

  const user = typeof assistant.userId === 'object' ? assistant.userId as User : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/assistant')}
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-[#5DD149] transition-colors mb-6"
          >
            <div className="p-1 rounded-full group-hover:bg-green-100 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Assistants</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-[#5DD149] to-[#306B25] px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {assistant.agentName}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 capitalize">
                      {assistant.agentType}
                    </span>
                    {assistant.agentId && (
                      <span className="text-green-100 text-sm">
                        ID: <span className="font-mono font-medium">{assistant.agentId}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/assistants/${id}/edit`)}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all border-2 border-white/30 hover:border-white/50 font-medium shadow-lg"
              >
                <Edit className="h-5 w-5" />
                Edit Assistant
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* User Information */}
            {user && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Assigned User</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <label className="text-sm font-semibold text-[#5DD149] uppercase tracking-wide mb-2 block">Name</label>
                    <p className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <label className="text-sm font-semibold text-[#306B25] uppercase tracking-wide mb-2 block">Email</label>
                    <p className="text-lg font-bold text-gray-900 break-all">{user.email}</p>
                  </div>
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <label className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2 block">Company</label>
                    <p className="text-lg font-bold text-gray-900">{user.companyName}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 p-4 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-800">Bearer Token Active</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Agent Name</label>
                  <p className="text-xl font-bold text-gray-900">{assistant.agentName}</p>
                </div>
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Agent Type</label>
                  <p className="text-xl font-bold text-gray-900 capitalize">{assistant.agentType}</p>
                </div>
                <div className="md:col-span-2 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <label className="text-sm font-semibold text-[#5DD149] uppercase tracking-wide mb-2 block">Welcome Message</label>
                  <p className="text-base text-gray-900">{assistant.agentWelcomeMessage}</p>
                </div>
                {assistant.webhookUrl && (
                  <div className="md:col-span-2 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <label className="text-sm font-semibold text-[#306B25] uppercase tracking-wide mb-2 block">Webhook URL</label>
                    <p className="text-sm text-gray-900 break-all font-mono">{assistant.webhookUrl}</p>
                  </div>
                )}
                <div className="md:col-span-2 bg-linear-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">System Prompt</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{assistant.systemPrompt}</p>
                </div>
              </div>
            </div>

            {/* Technical Configuration */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Technical Configuration</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LLM Config */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    LLM Configuration
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500">Provider</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{assistant.llmConfig?.provider || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500">Model</span>
                      <span className="text-sm font-semibold text-gray-900">{assistant.llmConfig?.model || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500">Temperature</span>
                      <span className="text-sm font-semibold text-gray-900">{assistant.llmConfig?.temperature ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Max Tokens</span>
                      <span className="text-sm font-semibold text-gray-900">{assistant.llmConfig?.max_tokens || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Voice Synthesizer */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    Voice Synthesizer
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500">Provider</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{assistant.synthesizerConfig?.provider || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500">Voice</span>
                      <span className="text-sm font-semibold text-gray-900">{assistant.synthesizerConfig?.provider_config?.voice || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500">Language</span>
                      <span className="text-sm font-semibold text-gray-900">{assistant.synthesizerConfig?.provider_config?.language || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Sampling Rate</span>
                      <span className="text-sm font-semibold text-gray-900">{assistant.synthesizerConfig?.provider_config?.sampling_rate || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Transcriber */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    Transcriber
                  </h4>
                  <div className="space-y-3">{assistant.transcriberConfig ? (
                      <>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-xs text-gray-500">Provider</span>
                          <span className="text-sm font-semibold text-gray-900 capitalize">{assistant.transcriberConfig.provider}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-xs text-gray-500">Model</span>
                          <span className="text-sm font-semibold text-gray-900">{assistant.transcriberConfig.model}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-xs text-gray-500">Language</span>
                          <span className="text-sm font-semibold text-gray-900">{assistant.transcriberConfig.language}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Sampling Rate</span>
                          <span className="text-sm font-semibold text-gray-900">{assistant.transcriberConfig.sampling_rate}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Not configured</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
