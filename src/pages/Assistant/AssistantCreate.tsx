import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assistantsAPI, usersAPI } from '../../api';
import type { CreateAssistantData, User } from '../../api';
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
    },
    // Voice assignment fields
    voiceId: undefined,
    voiceName: undefined
  });

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
      if (!formData.agentType.trim()) {
        toast.error('Please select agent type');
        return false;
      }
      if (!formData.agentWelcomeMessage.trim()) {
        toast.error('Please enter welcome message');
        return false;
      }
      if (!formData.systemPrompt.trim()) {
        toast.error('Please enter system prompt');
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.llmConfig.model.trim()) {
        toast.error('Please select a model');
        return false;
      }
    }
    
    if (step === 3) {
      if (!formData.synthesizerConfig.provider.trim()) {
        toast.error('Please select a synthesizer provider');
        return false;
      }
      if (!formData.synthesizerConfig.provider_config.voice.trim()) {
        toast.error('Please select a voice');
        return false;
      }
      if (!formData.synthesizerConfig.provider_config.language.trim()) {
        toast.error('Please select a language');
        return false;
      }
    }
    
    if (step === 4) {
      if (!formData.transcriberConfig.provider.trim()) {
        toast.error('Please select transcriber provider');
        return false;
      }
      if (!formData.transcriberConfig.model.trim()) {
        toast.error('Please select transcriber model');
        return false;
      }
      if (!formData.transcriberConfig.language.trim()) {
        toast.error('Please select transcriber language');
        return false;
      }
      if (!formData.inputConfig.provider.trim()) {
        toast.error('Please select input provider');
        return false;
      }
      if (!formData.outputConfig.provider.trim()) {
        toast.error('Please select output provider');
        return false;
      }
    }
    
    if (step === 5) {
      if (formData.taskConfig.call_terminate === undefined || formData.taskConfig.call_terminate === null) {
        toast.error('Please set call termination duration');
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
    <div className="min-h-screen bg-linear-to-br from-[#f0fdf4] via-[#dcfce7] to-[#f0fdf4] p-2 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #5DD149 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #306B25 1px, transparent 1px),
              linear-gradient(45deg, transparent 49%, #5DD149 50%, transparent 51%)
            `,
            backgroundSize: '40px 40px, 40px 40px, 80px 80px'
          }}
        />
      </div>
      
      <div className="max-w-4xl xl:max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="bg-white border-b border-gray-200 shadow-xl rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 overflow-hidden relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, #5DD149 2px, transparent 2px), radial-gradient(circle at 80% 20%, #306B25 2px, transparent 2px)`,
                backgroundSize: '50px 50px'
              }}
            />
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-linear-to-br from-[#5DD149] to-[#306B25] rounded-lg sm:rounded-xl shadow-lg">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-linear-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                  Create New Assistant
                </h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base font-medium">
                  Configure your AI voice assistant step by step
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Progress Ring */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${(currentStep / totalSteps) * 100}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5DD149" />
                      <stop offset="100%" stopColor="#306B25" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    {currentStep}/{totalSteps}
                  </span>
                </div>
              </div>
              
              {/* Step Info */}
              <div className="flex flex-col items-start px-3 sm:px-4 py-2 bg-linear-to-r from-[#5DD149]/10 to-[#306B25]/10 rounded-lg sm:rounded-xl border-2 border-[#5DD149]/30">
                <span className="text-xs font-medium text-gray-600">Current Step</span>
                <span className="text-sm sm:text-base font-bold bg-linear-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                  Step {currentStep}
                </span>
              </div>
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
          className="bg-white/95 backdrop-blur-sm rounded-lg lg:rounded-xl shadow-2xl border-2 border-[#5DD149]/20 p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Enhanced decorative background elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-[#5DD149]/15 to-[#306B25]/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-linear-to-tr from-[#5DD149]/10 to-[#306B25]/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-linear-to-bl from-[#5DD149]/8 to-[#306B25]/5 rounded-full blur-xl" />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, #5DD149 1px, transparent 1px),
                  linear-gradient(180deg, #5DD149 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          
          <div className="relative">
            {/* Step Title */}
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#5DD149] to-[#306B25] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                    <span className="text-white font-bold text-base sm:text-lg drop-shadow-sm">{currentStep}</span>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-br from-[#5DD149] to-[#306B25] rounded-xl sm:rounded-2xl opacity-30 blur-md"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-[#306B25] to-[#5DD149] bg-clip-text text-transparent">
                    {currentStep === 1 && "User Selection & Basic Info"}
                    {currentStep === 2 && "LLM & Voice Configuration"}
                    {currentStep === 3 && "Voice Synthesizer Settings"}
                    {currentStep === 4 && "Transcriber & I/O Config"}
                    {currentStep === 5 && "Task Configuration & Review"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium">
                    {currentStep === 1 && "Select users and configure basic assistant information"}
                    {currentStep === 2 && "Configure language model and voice settings"}
                    {currentStep === 3 && "Setup voice synthesis and audio output"}
                    {currentStep === 4 && "Configure speech recognition and input/output"}
                    {currentStep === 5 && "Review configuration and finalize assistant setup"}
                  </p>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200/50 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
                  <motion.div 
                    className="bg-linear-to-r from-[#5DD149] via-[#4BC13B] to-[#306B25] h-full rounded-full relative overflow-hidden shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                  </motion.div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-medium text-gray-500">Step {currentStep}</span>
                  <span className="text-xs font-medium text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                </div>
              </div>
            </motion.div>

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
                    selectedUserIds={selectedUserIds}
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
              onSubmit={() => {
                // Validate all steps before submission
                for (let step = 1; step <= totalSteps; step++) {
                  if (!validateStep(step)) {
                    // If validation fails, go to that step and add helpful message
                    if (step !== currentStep) {
                      setCurrentStep(step);
                      toast.error(`Please complete all required fields in Step ${step} before submitting`);
                    }
                    return;
                  }
                }

                // Ensure userId is set from selected user
                if (selectedUserIds.length > 0) {
                  setFormData(prev => ({ ...prev, userId: selectedUserIds[0] }));
                }

                createMutation.mutate({ ...formData, userId: selectedUserIds[0] });
              }}
            />
          </div>
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
                <div className="bg-linear-to-br from-[#5DD149]/10 to-[#306B25]/10 rounded-xl p-5 mb-6 border-2 border-[#5DD149]/30">
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
                      <p className="text-xl font-bold bg-linear-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
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
