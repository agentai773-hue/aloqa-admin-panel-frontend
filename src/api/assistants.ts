import { apiClient } from './client';

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
  min_p?: number;
  top_k?: number;
  presence_penalty: number;
  frequency_penalty: number;
  request_json: boolean;
}

export interface SynthesizerConfig {
  provider: string;
  provider_config: {
    voice: string;
    engine: string;
    sampling_rate: string;
    language: string;
  };
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
  call_terminate: number;
}

export interface InputOutputConfig {
  provider: string;
  format: string;
}

export interface CreateAssistantData {
  userId: string;
  agentName: string;
  agentType: 'conversation' | 'webhook' | 'other';
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
  agentType: 'conversation' | 'webhook' | 'other';
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
  // Create a new assistant
  createAssistant: async (data: CreateAssistantData) => {
    return apiClient.post<Assistant>('/assistants', data as unknown as Record<string, unknown>);
  },

  // Get all assistants with optional filters
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

  // Get assistant by ID
  getAssistantById: async (id: string) => {
    return apiClient.get<Assistant>(`/assistants/${id}`);
  },

  // Update assistant (database only)
  updateAssistant: async (id: string, data: Partial<CreateAssistantData>) => {
    return apiClient.put<Assistant>(`/assistants/${id}`, data as unknown as Record<string, unknown>);
  },

  // Full update assistant (database + Bolna AI)
  updateAssistantFull: async (id: string, data: Partial<CreateAssistantData>) => {
    return apiClient.put<Assistant>(`/assistants/${id}/full`, data as unknown as Record<string, unknown>);
  },

  // Patch update assistant (partial update to Bolna AI)
  patchAssistant: async (id: string, data: Partial<CreateAssistantData>) => {
    return apiClient.patch<Assistant>(`/assistants/${id}`, data as unknown as Record<string, unknown>);
  },

  // Delete assistant (hard delete from DB + Bolna AI)
  deleteAssistant: async (id: string) => {
    return apiClient.delete<void>(`/assistants/${id}`);
  },

  // Get assistants by user
  getAssistantsByUser: async (userId: string) => {
    return apiClient.get<Assistant[]>(`/assistants/user/${userId}`);
  },
};
