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
}

export interface TaskConfig {
  hangup_after_silence: number;
  incremental_delay: number;
  number_of_words_for_interruption: number;
  backchanneling: boolean;
  call_terminate?: number;
  hangup_after_llm_call?: boolean;
  call_cancellation_prompt?: string | null;
  backchanneling_message_gap?: number;
  backchanneling_start_delay?: number;
  ambient_noise?: boolean;
  ambient_noise_track?: string;
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
  status: 'draft' | 'active' | 'inactive' | 'deleted';
  bolnaResponse?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const assistantsAPI = {
  createAssistant: async (data: CreateAssistantData) => {
    return apiClient.post<Assistant>('/assistants', data as unknown as Record<string, unknown>);
  },

  getAllAssistants: async (userId?: string, status?: string) => {
    let endpoint = '/assistants';
    const queryParams = new URLSearchParams();
    
    if (userId) queryParams.append('userId', userId);
    if (status) queryParams.append('status', status);
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    return apiClient.get<Assistant[]>(endpoint);
  },

  getAssistantById: async (id: string) => {
    return apiClient.get<Assistant>(`/assistants/${id}`);
  },

  updateAssistant: async (id: string, data: Partial<CreateAssistantData>) => {
    return apiClient.put<Assistant>(`/assistants/${id}`, data as unknown as Record<string, unknown>);
  },

  patchAssistant: async (id: string, data: Partial<CreateAssistantData>) => {
    return apiClient.patch<Assistant>(`/assistants/${id}`, data as unknown as Record<string, unknown>);
  },

  deleteAssistant: async (id: string) => {
    return apiClient.delete<void>(`/assistants/${id}`);
  },

  getAssistantsByUser: async (userId: string) => {
    return apiClient.get<Assistant[]>(`/assistants/user/${userId}`);
  },
};
