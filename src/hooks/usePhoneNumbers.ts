import { useQuery } from '@tanstack/react-query';
import { phoneNumbersAPI } from '../api/phoneNumbers';

export interface UsePhoneNumbersOptions {
  enabled?: boolean;
}

export const usePhoneNumbers = (options: UsePhoneNumbersOptions = {}) => {
  const { enabled = true } = options;

  // Get purchased phone numbers
  const { 
    data: purchasedNumbers, 
    isLoading: loadingPurchased, 
    error: purchasedError,
    refetch: refetchPurchased
  } = useQuery({
    queryKey: ['phoneNumbers', 'purchased'],
    queryFn: phoneNumbersAPI.getPurchasedNumbers,
    enabled,
    staleTime: 30000, // 30 seconds
    retry: 2
  });

  // Get assigned phone numbers
  const { 
    data: assignedNumbers, 
    isLoading: loadingAssigned, 
    error: assignedError,
    refetch: refetchAssigned
  } = useQuery({
    queryKey: ['phoneNumbers', 'assigned'],
    queryFn: phoneNumbersAPI.getAssignedNumbers,
    enabled,
    staleTime: 30000, // 30 seconds
    retry: 2
  });

  return {
    // Data
    purchasedNumbers: purchasedNumbers || [],
    assignedNumbers: assignedNumbers || [],
    
    // Loading states
    isLoading: loadingPurchased || loadingAssigned,
    loadingPurchased,
    loadingAssigned,
    
    // Errors
    error: purchasedError || assignedError,
    purchasedError,
    assignedError,
    
    // Refetch functions
    refetch: () => {
      refetchPurchased();
      refetchAssigned();
    },
    refetchPurchased,
    refetchAssigned
  };
};

// Hook for purchased numbers only
export const usePurchasedPhoneNumbers = (options: UsePhoneNumbersOptions = {}) => {
  const { enabled = true } = options;
  
  return useQuery({
    queryKey: ['phoneNumbers', 'purchased'],
    queryFn: phoneNumbersAPI.getPurchasedNumbers,
    enabled,
    staleTime: 30000,
    retry: 2
  });
};

// Hook for assigned numbers only  
export const useAssignedPhoneNumbers = (options: UsePhoneNumbersOptions = {}) => {
  const { enabled = true } = options;
  
  return useQuery({
    queryKey: ['phoneNumbers', 'assigned'],
    queryFn: phoneNumbersAPI.getAssignedNumbers,
    enabled,
    staleTime: 30000,
    retry: 2
  });
};