import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assistantsAPI, type CreateAssistantData } from '../../api/assistants';
import { usersAPI, type User } from '../../api/users';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StepIndicator,
  Step1UserBasicInfo,
  Step2LLMVoiceConfig,
  Step3VoiceSynthesizer,
  Step4TranscriberIO,
  Step5TaskConfig,
  NavigationButtons
} from '../../components/assistant';

export default function AssistantCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdAssistantName, setCreatedAssistantName] = useState('');
  
  const totalSteps = 5;

  // Fetch approved users
  const { data: usersResponse, isLoading: loadingUsers } = useQuery({
    queryKey: ['users-approved'],
    queryFn: () => usersAPI.getUsers({ isApproval: 1 })
  });

  const approvedUsersWithToken = (usersResponse?.data?.users || []).filter(
    (user: User) => user.bearerToken && user.isApproval === 1
  );

  // Form state
  const [formData, setFormData] = useState<CreateAssistantData>({
    userId: '',
    agentName: '',
    agentType: 'conversation',
    agentWelcomeMessage: 'Hello! How can I assist you today?',
    webhookUrl: '',
    systemPrompt: 'You are a helpful AI assistant.',
    llmConfig: {
      agent_flow_type: 'streaming',
      provider: 'openai',
      family: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 80,
      top_p: 0.9,
      min_p: 0.1,
      top_k: 0,
      presence_penalty: 0,
      frequency_penalty: 0,
      request_json: true
    },
    synthesizerConfig: {
      provider: 'polly',
      provider_config: {
        voice: 'Kajal',
        engine: 'neural',
        sampling_rate: '8000',
        language: 'hi-IN'
      },
      stream: true,
      buffer_size: 60,
      audio_format: 'wav'
    },
    transcriberConfig: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'hi',
      stream: true,
      sampling_rate: 16000,
      encoding: 'linear16',
      endpointing: 250
    },
    inputConfig: {
      provider: 'plivo',
      format: 'wav'
    },
    outputConfig: {
      provider: 'plivo',
      format: 'wav'
    },
    taskConfig: {
      hangup_after_silence: 6,
      incremental_delay: 40,
      number_of_words_for_interruption: 2,
      backchanneling: false,
      call_terminate: undefined // Optional - user must select
    }
  });
  console.log('Form Data:', formData);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAssistantData) => assistantsAPI.createAssistant(data),
    onSuccess: () => {
      setCreatedAssistantName(formData.agentName);
      setShowSuccessModal(true);
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
    },
    onError: (error: unknown) => {
      const errorResponse = (error as { response?: { data?: { message?: string; errorDetail?: string } } })?.response?.data;
      
      // Use the user-friendly message from backend, or the error detail, or fallback message
      const message = errorResponse?.message 
        || errorResponse?.errorDetail
        || (error as { message?: string })?.message 
        || 'Failed to create assistant';
      
      toast.error(message, {
        duration: 6000, // Show error for 6 seconds since it might be detailed
        style: {
          maxWidth: '600px'
        }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || selectedUserIds.length === 0) {
      toast.error('Please select a user');
      return;
    }
    
    if (!formData.agentName.trim()) {
      toast.error('Please enter agent name');
      return;
    }

    createMutation.mutate(formData);
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (selectedUserIds.length === 0) {
        toast.error('Please select at least one user');
        return false;
      }
      if (!formData.agentName.trim()) {
        toast.error('Please enter agent name');
        return false;
      }
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const selectedUser = selectedUsers.length > 0 ? selectedUsers[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="bg-white border-b border-gray-200 shadow-lg rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                Create New Assistant
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Configure your AI voice assistant step by step</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5DD149]/10 to-[#306B25]/10 rounded-xl border-2 border-[#5DD149]/30">
              <span className="text-sm font-bold text-gray-700">Step</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                {currentStep}/{totalSteps}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </motion.div>

        {/* Form Container */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: User Selection & Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step1UserBasicInfo
                    formData={formData}
                    setFormData={setFormData}
                    selectedUserIds={selectedUserIds}
                    setSelectedUserIds={setSelectedUserIds}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    approvedUsersWithToken={approvedUsersWithToken}
                    loadingUsers={loadingUsers}
                  />
                </motion.div>
              )}

              {/* Step 2: LLM Configuration */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step2LLMVoiceConfig
                    formData={formData}
                    setFormData={setFormData}
                  />
                </motion.div>
              )}

              {/* Step 3: Voice Synthesizer */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step3VoiceSynthesizer
                    formData={formData}
                    setFormData={setFormData}
                  />
                </motion.div>
              )}

              {/* Step 4: Transcriber & Input/Output */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step4TranscriberIO
                    formData={formData}
                    setFormData={setFormData}
                  />
                </motion.div>
              )}

              {/* Step 5: Task Configuration */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step5TaskConfig
                    formData={formData}
                    setFormData={setFormData}
                    selectedUser={selectedUser}
                    selectedUsers={selectedUsers}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={totalSteps}
              isPending={createMutation.isPending}
              selectedUserIds={selectedUserIds}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
              onCancel={() => navigate('/assistant')}
            />
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <motion.div 
                className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/assistant');
                }}
              />

              {/* Modal panel */}
              <motion.div 
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                {/* Green gradient header */}
                <div className="px-6 py-8 text-center" style={{ background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)' }}>
                  <motion.div 
                    className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 border-4 border-white/30 shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                  Assistant Created Successfully!
                </h3>
                <p className="text-white/90 text-sm">
                  Your AI assistant is now ready to use
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Assistant Details Card */}
                <div className="bg-gradient-to-br from-[#5DD149]/10 to-[#306B25]/10 rounded-xl p-5 mb-6 border-2 border-[#5DD149]/30">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-[#5DD149]/20 rounded-lg">
                      <svg className="h-5 w-5 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#306B25] uppercase tracking-wide mb-1">
                        Assistant Name
                      </h4>
                      <p className="text-xl font-bold bg-gradient-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                        {createdAssistantName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-[#5DD149]/30">
                    <div className="flex items-center gap-2 text-[#306B25] mb-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold">What's Next?</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="text-[#5DD149] font-bold">•</span>
                        <span className="font-medium">Test your assistant in the dashboard</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#5DD149] font-bold">•</span>
                        <span className="font-medium">Configure additional settings if needed</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#5DD149] font-bold">•</span>
                        <span className="font-medium">Start making calls with your AI assistant</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/assistant');
                    }}
                    className="flex-1 px-6 py-3 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#5DD149] focus:ring-offset-2"
                    style={{ background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)' }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View All Assistants
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
