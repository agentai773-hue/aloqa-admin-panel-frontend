import { axios } from './client';

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
    name: string;
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

export interface AssignPhoneNumberParams {
  phoneNumberId: string;
  userId: string;
  agentId?: string;
}

export interface GetAllPhoneNumbersParams {
  status?: 'available' | 'assigned' | 'deleted';
  userId?: string;
  country?: 'US' | 'IN';
}

export const phoneNumbersAPI = {
  // Search available phone numbers from Bolna
  searchPhoneNumbers: async (params: SearchPhoneNumbersParams): Promise<PhoneNumberSearch[]> => {
    const response = await axios.get<{ success: boolean; data: PhoneNumberSearch[] }>('/phone-numbers/search', { params });
    return response.data.data;
  },

  // Buy a phone number from Bolna
  buyPhoneNumber: async (data: BuyPhoneNumberParams): Promise<PhoneNumber> => {
    const response = await axios.post<{ success: boolean; data: PhoneNumber }>('/phone-numbers/buy', data);
    return response.data.data;
  },

  // Get all phone numbers with optional filters
  getAllPhoneNumbers: async (params?: GetAllPhoneNumbersParams): Promise<PhoneNumber[]> => {
    const response = await axios.get<{ success: boolean; data: PhoneNumber[] }>('/phone-numbers', { params });
    return response.data.data;
  },

  // Assign phone number to a user
  assignPhoneNumber: async (data: AssignPhoneNumberParams): Promise<PhoneNumber> => {
    const response = await axios.post<{ success: boolean; data: PhoneNumber }>('/phone-numbers/assign', data);
    return response.data.data;
  },

  // Unassign phone number from user
  unassignPhoneNumber: async (id: string): Promise<PhoneNumber> => {
    const response = await axios.patch<{ success: boolean; data: PhoneNumber }>(`/phone-numbers/${id}/unassign`);
    return response.data.data;
  },

  // Delete phone number (from Bolna and database)
  deletePhoneNumber: async (id: string): Promise<void> => {
    await axios.delete(`/phone-numbers/${id}`);
  },
};
