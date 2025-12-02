export interface VoiceAssignment {
  _id: string;
  userId: string;
  voiceId: string;
  voiceName: string;
  voiceProvider: 'elevenlabs';
  voiceAccent?: string;
  voiceModel?: string;
  projectName: string;
  description?: string;
  status: 'active' | 'inactive' | 'deleted';
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    mobile?: string;
  };
}

export interface CreateVoiceAssignmentData {
  userId: string;
  voiceId: string;
  voiceName: string;
  voiceProvider?: 'elevenlabs';
  voiceAccent?: string;
  voiceModel?: string;
  projectName: string;
  description?: string;
  [key: string]: string | undefined;
}

export interface UpdateVoiceAssignmentData {
  voiceId?: string;
  voiceName?: string;
  voiceAccent?: string;
  voiceModel?: string;
  projectName?: string;
  description?: string;
  status?: 'active' | 'inactive';
  [key: string]: string | undefined;
}

export interface VoiceAssignmentListResponse {
  success: boolean;
  message: string;
  data: VoiceAssignment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VoiceAssignmentResponse {
  success: boolean;
  message: string;
  data: VoiceAssignment;
}

export interface VoiceAssignmentFilters {
  page?: number;
  limit?: number;
  userId?: string;
  status?: 'active' | 'inactive' | 'all';
  search?: string;
}