import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assistantsAPI, type CreateAssistantData } from '../../api/assistants';
import { usersAPI, type User } from '../../api/users';
import toast from 'react-hot-toast';
import {
  StepIndicator,
  Step1UserBasicInfo,
  Step2LLMVoiceConfig,
  Step3VoiceSynthesizer,
  Step4TranscriberIO,
  Step5TaskConfig,
  NavigationButtons
} from '../../components/AssistantComponents';

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
  

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-300">
          <form onSubmit={handleSubmit}>
            {/* Step 1: User Selection & Basic Info */}
            {currentStep === 1 && (
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
            )}

            {/* Step 2: LLM Configuration */}
            {currentStep === 2 && (
              <Step2LLMVoiceConfig
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 3: Voice Synthesizer */}
            {currentStep === 3 && (
              <Step3VoiceSynthesizer
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 4: Transcriber & Input/Output */}
            {currentStep === 4 && (
              <Step4TranscriberIO
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 5: Task Configuration */}
            {currentStep === 5 && (
              <Step5TaskConfig
                formData={formData}
                setFormData={setFormData}
                selectedUser={selectedUser}
                selectedUsers={selectedUsers}
              />
            )}

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
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/assistant');
              }}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slideUp">
              {/* Green gradient header */}
              <div className="bg-linear-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 border-4 border-white/30 shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Assistant Created Successfully!
                </h3>
                <p className="text-green-50 text-sm">
                  Your AI assistant is now ready to use
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Assistant Details Card */}
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">
                        Assistant Name
                      </h4>
                      <p className="text-xl font-bold text-gray-900">
                        {createdAssistantName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold">What's Next?</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <span>Test your assistant in the dashboard</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <span>Configure additional settings if needed</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <span>Start making calls with your AI assistant</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/assistant');
                    }}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    View All Assistants
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
