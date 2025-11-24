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
  Step3TranscriberIO,
  Step4TaskConfig,
  NavigationButtons
} from '../../components/AssistantComponents';

export default function AssistantCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  
  const totalSteps = 4;

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
      hangup_after_silence: 8,
      incremental_delay: 40,
      number_of_words_for_interruption: 2,
      backchanneling: false,
      call_terminate: 800
    },
    routes: []
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAssistantData) => assistantsAPI.createAssistant(data),
    onSuccess: () => {
      toast.success('Assistant created successfully!');
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      navigate('/assistant');
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message 
        || (error as { message?: string })?.message 
        || 'Failed to create assistant';
      toast.error(message);
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
     

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
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

            {/* Step 2: LLM & Voice Configuration */}
            {currentStep === 2 && (
              <Step2LLMVoiceConfig
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 3: Transcriber & Input/Output */}
            {currentStep === 3 && (
              <Step3TranscriberIO
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 4: Task Configuration */}
            {currentStep === 4 && (
              <Step4TaskConfig
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
    </div>
  );
}
