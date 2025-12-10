export interface SampleCallData {
  fromPhoneNumber?: string;
  phoneNumber: string;
  recipientName: string;
  assistantId: string;
  [key: string]: unknown; // Index signature to make it compatible with Record<string, unknown>
}

export interface SampleCallResponse {
  success: boolean;
  message: string;
  data?: {
    execution_id: string;
    status: string;
    bolna_message: string;
    assistant: {
      id: string;
      name: string;
      bolna_agent_id: string;
    };
    call_details: {
      recipient_phone: string;
      from_phone: string;
      recipient_name: string;
      initiated_at: string;
    };
  };
  timestamp?: string;
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