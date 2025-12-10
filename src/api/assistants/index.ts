import { apiClient } from '../client';

export interface Route {
  routeName: string;
  utterances: string[];
  response: string;
  scoreThreshold: number;
}

export interface LLMConfig {
  agent_flow_type: string;
  provider: string;
  family: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  min_p: number;
  top_k: number;
  presence_penalty: number;
  frequency_penalty: number;
  request_json: boolean;
}

export interface SynthesizerProviderConfig {
  voice: string;
  engine: string;
  sampling_rate: string;
  language: string;
  model?: string;
  voice_id?: string; // For ElevenLabs voice ID
    stability?: number;
  similarity_boost?: number;
  speed?: number;
  emotion?: string;
  emotion_strength?: number;
  voice_pause_model?: string;
  auto_punctuation_pause?: boolean;
  dynamic_emotion_adaptation?: boolean;
  use_speaker_boost?: boolean;
}

export interface SynthesizerConfig {
  provider: string;
  provider_config: SynthesizerProviderConfig;
  stream: boolean;
  buffer_size: number;
  audio_format: string;

}

export interface TranscriberConfig {
  provider: string;
  model: string;
  language: string;
  stream: boolean;
  sampling_rate: number;
  encoding: string;
  endpointing: number;
  interim_results:boolean;
  punctuate:boolean;
  smart_format:boolean;
}

export interface TaskConfig {
  hangup_after_silence: number;
  incremental_delay: number;
  number_of_words_for_interruption: number;
  backchanneling: boolean;
  call_terminate?: number;
  hangup_after_llm_call?: boolean;
  call_cancellation_prompt?: string | null;
  ambient_noise?: boolean;
  ambient_noise_track?: string;
  optimize_latency:boolean;
  voicemail?: boolean;
  inbound_limit?: number;
  whitelist_phone_numbers?: string[];
  disallow_unknown_numbers?: boolean;
}

export interface InputOutputConfig {
  provider: string;
  format: string;
}

export interface CreateAssistantData {
  userId: string;
  agentName: string;
  agentType: string;
  agentWelcomeMessage: string;
  webhookUrl?: string;
  systemPrompt: string;
  llmConfig: LLMConfig;
  synthesizerConfig: SynthesizerConfig;
  transcriberConfig: TranscriberConfig;
  taskConfig: TaskConfig;
  inputConfig: InputOutputConfig;
  outputConfig: InputOutputConfig;
  routes?: Route[];
  // Voice selection from user assignments
  voiceId?: string;
  voiceName?: string;
}

export interface Assistant {
  _id: string;
  userId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bearerToken?: string;
  };
  agentName: string;
  agentType: string;
  agentWelcomeMessage: string;
  webhookUrl?: string;
  systemPrompt: string;
  llmConfig: LLMConfig;
  synthesizerConfig: SynthesizerConfig;
  transcriberConfig: TranscriberConfig;
  taskConfig: TaskConfig;
  inputConfig: InputOutputConfig;
  outputConfig: InputOutputConfig;
  routes?: Route[];
  agentId?: string;
  // Voice assignment fields
  voiceId?: string;
  voiceName?: string;
  status: 'draft' | 'active' | 'inactive' | 'deleted';
  bolnaResponse?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AssistantsListResponse {
  assistants: Assistant[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAssistantsParams {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string;
  search?: string;
  agentType?: string;
}

export const assistantsAPI = {
  createAssistant: async (data: CreateAssistantData) => {
    return apiClient.post<Assistant>('/admin/assistants', data as unknown as Record<string, unknown>);
  },

  getAllAssistants: async (params?: GetAssistantsParams) => {
    let endpoint = '/admin/assistants';
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.agentType) queryParams.append('agentType', params.agentType);
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    return apiClient.get<AssistantsListResponse>(endpoint);
  },

  getAssistantById: async (id: string) => {
    return apiClient.get<Assistant>(`/admin/assistants/${id}`);
  },

  updateAssistant: async (id: string, data: Partial<CreateAssistantData>) => {
    return apiClient.put<Assistant>(`/admin/assistants/${id}`, data as unknown as Record<string, unknown>);
  },

  patchAssistant: async (id: string, data: Partial<CreateAssistantData>) => {
    return apiClient.patch<Assistant>(`/admin/assistants/${id}`, data as unknown as Record<string, unknown>);
  },

  deleteAssistant: async (id: string) => {
    return apiClient.delete<void>(`/admin/assistants/${id}`);
  },

  getAssistantsByUser: async (userId: string) => {
    return apiClient.get<Assistant[]>(`/admin/assistants/user/${userId}`);
  },
};
