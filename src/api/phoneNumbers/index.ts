import { axios } from '../client';

export interface PhoneNumberSearch {
  region: string;
  friendly_name: string;
  locality: string;
  phone_number: string;
  postal_code: string;
  price: string;
}

export interface PhoneNumber {
  _id: string;
  bolnaPhoneId: string;
  phoneNumber: string;
  country: 'US' | 'IN';
  userId?: {
    _id: string;
    email: string;
  };
  agentId?: string;
  telephonyProvider?: string;
  telephonySid?: string;
  price?: number;
  status: 'available' | 'assigned' | 'deleted';
  purchasedAt: string;
  assignedAt?: string;
  deletedAt?: string;
}

export interface SearchPhoneNumbersParams {
  country: 'US' | 'IN';
  pattern?: string;
  userId: string;
}

export interface BuyPhoneNumberParams {
  country: 'US' | 'IN';
  phoneNumber: string;
  userId: string;
}

export interface PurchasedNumber {
  id: string;
  phone_number: string;
  telephony_provider: string;
  agent_id: string | null;
  price: string;
  renewal_at: string;
  created_at: string;
  humanized_created_at: string;
  humanized_updated_at: string;
  updated_at: string;
  rented: boolean;
}

export interface AssignedPhoneNumber {
  _id: string;
  phoneNumber: string;
  userId: {
    _id: string;
    email: string;
    companyName: string;
  };
  assignedAt: string;
  renewalDate: string;
  daysUntilRenewal?: number;
}

export interface AssignPhoneNumberParams {
  phoneNumber: string;
  userId: string;
}

export interface GetAllPhoneNumbersParams {
  userId?: string;
  status?: 'available' | 'assigned' | 'deleted';
  page?: number;
  limit?: number;
}

export const phoneNumbersAPI = {
  // Get purchased phone numbers from backend (using Aloqa_TOKEN)
  getPurchasedNumbers: async (): Promise<PurchasedNumber[]> => {
    const response = await axios.get<{ success: boolean; data: PurchasedNumber[] }>('/admin/phone-numbers/list/purchased');
    return response.data.data;
  },

  // Search available phone numbers from Bolna
  searchPhoneNumbers: async (params: SearchPhoneNumbersParams): Promise<PhoneNumberSearch[]> => {
    const response = await axios.get<{ success: boolean; data: PhoneNumberSearch[] }>('/admin/phone-numbers/search', { params });
    return response.data.data;
  },

  // Buy a phone number from Bolna
  buyPhoneNumber: async (data: BuyPhoneNumberParams): Promise<PhoneNumber> => {
    const response = await axios.post<{ success: boolean; data: PhoneNumber }>('/admin/phone-numbers/buy', data);
    return response.data.data;
  },

  // Assign phone number to user
  assignPhoneNumber: async (data: AssignPhoneNumberParams): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post<{ success: boolean; message: string }>('/admin/phone-numbers/assign', data);
    return response.data;
  },

  // Get assigned phone numbers
  getAssignedNumbers: async (): Promise<AssignedPhoneNumber[]> => {
    const response = await axios.get<{ success: boolean; data: AssignedPhoneNumber[] }>('/admin/phone-numbers/list/assigned');
    return response.data.data;
  },

  // Get all phone numbers with optional filters
  getAllPhoneNumbers: async (params: GetAllPhoneNumbersParams): Promise<PhoneNumber[]> => {
    const response = await axios.get<{ success: boolean; data: PhoneNumber[] }>('/admin/phone-numbers', { params });
    return response.data.data;
  }
};
