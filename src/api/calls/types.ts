export interface SampleCallData {
  fromPhoneNumber?: string;
  phoneNumber: string;
  recipientName: string;
  assistantId: string;
}

export interface SampleCallResponse {
  success: boolean;
  message: string;
  data?: {
    callId: string;
    status: string;
    leadData?: {
      firstName: string;
      phoneNumber: string;
      assistantId: string;
    };
  };
}

export interface CallHistoryFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
  assistantId?: string;
  phoneNumber?: string;
}

export interface CallRecord {
  callId: string;
  phoneNumber: string;
  recipientName: string;
  assistantId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
  duration?: number;
  startTime: string;
  endTime?: string;
  notes?: string;
}

export interface CallHistoryResponse {
  success: boolean;
  message: string;
  data: CallRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CallDetailsResponse {
  success: boolean;
  message: string;
  data: CallRecord & {
    transcript?: string;
    recordings?: string[];
    metadata?: Record<string, unknown>;
  };
}