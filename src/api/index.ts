// Consolidated API exports
export { apiClient, axios } from './client';
export type { ApiResponse, ValidationError } from './client';

// Auth module
export { adminAuthAPI } from './auth';
export type { LoginCredentials, AdminUser, AuthResponse, VerifyTokenResponse } from './auth';

// Users module
export { usersAPI } from './users';

export type { User, CreateUserData, UpdateUserData, UsersListResponse, UserStatsResponse, DeleteUserResponse, GetUsersParams } from './users';

// Assistants module
export { assistantsAPI } from './assistants';
export type { 
  Assistant, 
  CreateAssistantData, 
  Route, 
  LLMConfig, 
  AssistantsListResponse,
  GetAssistantsParams, 
  SynthesizerConfig, 
  SynthesizerProviderConfig, 
  TranscriberConfig, 
  TaskConfig, 
  InputOutputConfig 
} from './assistants';

// Phone Numbers module
export { phoneNumbersAPI } from './phoneNumbers';
export type { 
  PhoneNumber, 
  PhoneNumberSearch, 
  SearchPhoneNumbersParams, 
  BuyPhoneNumberParams, 
  AssignPhoneNumberParams,
  PurchasedNumber,
  AssignedPhoneNumber
} from './phoneNumbers';

// Voices module
export { voiceApi } from './voices';
export type { 
  Voice,
  VoiceResponse,
  VoiceDetailResponse
} from './voices';

// Verification module
export { verifyAPI } from './verify';
export type { 
  VerifyEmailData,
  ResendVerificationData,
  VerifyEmailResponse,
  ResendVerificationResponse
} from './verify';
