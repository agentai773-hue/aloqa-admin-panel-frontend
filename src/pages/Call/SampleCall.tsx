import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, User, Bot, Loader } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useAssistants } from '../../hooks/useAssistants';
import { usePhoneNumbers } from '../../hooks/usePhoneNumbers';
import { callsAPI } from '../../api/calls';
import type { SampleCallData } from '../../api/calls/types';
import type { Assistant } from '../../api/assistants';import type { PurchasedNumber } from '../../api/phoneNumbers';

interface SampleCallForm {
  fromPhoneNumber: string;
  phoneNumber: string;
  recipientName: string;
  assistantId: string;
}

const SampleCall: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SampleCallForm>({
    fromPhoneNumber: '',
    phoneNumber: '',
    recipientName: '',
    assistantId: ''
  });
  const [errors, setErrors] = useState<Partial<SampleCallForm>>({});
  const queryClient = useQueryClient();

  // Fetch assistants for dropdown
  const { assistants, isLoading: loadingAssistants } = useAssistants({
    page: 1,
    limit: 100,
    status: 'active'
  });

  // Fetch phone numbers for dropdown
  const { purchasedNumbers, isLoading: loadingPhoneNumbers } = usePhoneNumbers();

  // Sample call API mutation
  const sampleCallMutation = useMutation({
    mutationFn: async (data: SampleCallForm) => {
      return await callsAPI.makeSampleCall(data as SampleCallData);
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Sample call initiated successfully!');
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
    onError: (error: Error) => {
      console.error('Sample call error:', error);
      toast.error(error.message || 'Failed to initiate sample call');
    }
  });

  const resetForm = () => {
    setFormData({
      fromPhoneNumber: '',
      phoneNumber: '',
      recipientName: '',
      assistantId: ''
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SampleCallForm> = {};

    // From Phone number validation
    if (!formData.fromPhoneNumber) {
      newErrors.fromPhoneNumber = 'Please select our phone number';
    }

    // Phone number validation (10 digits only)
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter exactly 10 digits';
    }

    // Recipient name validation
    if (!formData.recipientName) {
      newErrors.recipientName = 'Person\'s name is required';
    } else if (formData.recipientName.length < 2) {
      newErrors.recipientName = 'Name must be at least 2 characters';
    }

    // Assistant validation
    if (!formData.assistantId) {
      newErrors.assistantId = 'Please select an assistant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await sampleCallMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number - only allow digits and limit to 10
    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof SampleCallForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const isFormValid = formData.fromPhoneNumber && formData.phoneNumber && formData.recipientName && formData.assistantId;

  return (
    <div className="bg-gray-50 p-3 sm:p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">Make Sample Call</h1>
          <p className="text-sm text-gray-600">Test your assistant with a sample phone call</p>
        </div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
          {/* Card Header */}
          <div 
            className="px-4 sm:px-6 py-3"
            style={{
              background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)'
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Sample Call Setup</h2>
                <p className="text-green-100 text-xs">Configure and initiate a test call</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Our Phone Number Selection */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-3 w-3 mr-1 text-[#5DD149]" />
                  Our Number
                </label>
                <select
                  name="fromPhoneNumber"
                  value={formData.fromPhoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5DD149] focus:border-transparent transition-colors bg-white"
                  disabled={loadingPhoneNumbers}
                >
                  <option value="">
                    {loadingPhoneNumbers ? 'Loading phone numbers...' : 'Select our phone number'}
                  </option>
                  {purchasedNumbers?.map((phoneNumber: PurchasedNumber) => (
                    <option key={phoneNumber.id} value={phoneNumber.phone_number}>
                      {phoneNumber.phone_number.replace(/^\+91/, '').replace(/[^\d]/g, '').slice(0, 10)} ({phoneNumber.telephony_provider})
                    </option>
                  ))}
                </select>
                {errors.fromPhoneNumber && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.fromPhoneNumber}
                  </p>
                )}
              </div>

              {/* Call This Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-3 w-3 mr-1 text-[#5DD149]" />
                  Call This Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5DD149] focus:border-transparent transition-colors"
                  placeholder="9876543210"
                  maxLength={10}
                  pattern="[0-9]{10}"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Person's Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-3 w-3 mr-1 text-[#5DD149]" />
                  Person's Name
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5DD149] focus:border-transparent transition-colors"
                  placeholder="Enter person's name"
                />
                {errors.recipientName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.recipientName}
                  </p>
                )}
              </div>

              {/* Assistant Selection */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bot className="inline h-3 w-3 mr-1 text-[#5DD149]" />
                  Select Assistant
                </label>
                <select
                  name="assistantId"
                  value={formData.assistantId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5DD149] focus:border-transparent transition-colors bg-white"
                  disabled={loadingAssistants}
                >
                  <option value="">
                    {loadingAssistants ? 'Loading assistants...' : 'Choose an assistant'}
                  </option>
                  {assistants?.map((assistant: Assistant) => (
                    <option key={assistant._id} value={assistant._id}>
                      {assistant.agentName}
                    </option>
                  ))}
                </select>
                {errors.assistantId && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.assistantId}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting || loadingAssistants || loadingPhoneNumbers}
                className="w-full sm:w-auto px-6 py-2 text-white rounded-md text-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                style={{
                  background: !isFormValid || isSubmitting || loadingAssistants || loadingPhoneNumbers 
                    ? '#d1d5db' 
                    : 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Making Call...</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    <span>Make Sample Call</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SampleCall;