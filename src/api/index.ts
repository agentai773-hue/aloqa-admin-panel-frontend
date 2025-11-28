// Consolidated API exports
export { apiClient, axios } from './client';
export type { ApiResponse, ValidationError } from './client';

// Auth module
export { adminAuthAPI } from './auth';
export type { LoginCredentials, AdminUser, AuthResponse, VerifyTokenResponse } from './auth';

// Users module
export { usersAPI } from './users';

// Voices module
export { voicesAPI } from './voices';
export type { Voice, VoiceProvider, VoiceAccent, VoiceSearchParams, VoicesResponse, VoiceAssignment, AssignVoiceRequest } from './voices';
export type { User, CreateUserData, UpdateUserData, UsersListResponse, UserStatsResponse, DeleteUserResponse } from './users';

// Assistants module
export { assistantsAPI } from './assistants';
export type { 
  Assistant, 
  CreateAssistantData, 
  Route, 
  LLMConfig, 
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

// Verification module
export { verifyAPI } from './verify';
export type { 
  VerifyEmailData,
  ResendVerificationData,
  VerifyEmailResponse,
  ResendVerificationResponse
} from './verify';
