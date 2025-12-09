export type Voice = {
  id: string;
  voice_id: string;
  provider: 'elevenlabs'; // Only ElevenLabs now
  name: string;
  model: string;
  accent: string;
  category?: string;
  description?: string;
  preview_url?: string;
  labels?: Record<string, string | number | boolean>;
  settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    speed?: number;
    use_speaker_boost?: boolean;
  };
};

// Backend API response format
export type VoiceResponse = {
  success: boolean;
  message: string;
  data: Voice[];
  count: number;
};

// Direct Bolna API response format (as fallback)
export type BolnaVoiceResponse = {
  data: Voice[];
  state: string;
};

// Combined response type
export type CombinedVoiceResponse = VoiceResponse | BolnaVoiceResponse;

export type VoiceDetailResponse = {
  success: boolean;
  message: string;
  data: Voice;
};