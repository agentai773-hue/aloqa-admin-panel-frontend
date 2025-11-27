import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = {
  1: 'User & Basic',
  2: 'LLM Config',
  3: 'Voice Synth',
  4: 'Transcriber & I/O',
  5: 'Task Config'
};

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="px-8 py-6 bg-white border-2 border-gray-300 rounded-xl shadow-md">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all shadow-md ${
                currentStep > step
                  ? 'bg-gray-900 text-white border-2 border-gray-900'
                  : currentStep === step
                  ? 'bg-gray-900 text-white border-2 border-gray-900 ring-4 ring-gray-300'
                  : 'bg-white text-gray-400 border-2 border-gray-300'
              }`}>
                {currentStep > step ? <Check className="h-6 w-6" /> : step}
              </div>
              <span className={`text-xs mt-2 font-bold text-center ${
                currentStep === step ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {stepLabels[step as keyof typeof stepLabels]}
              </span>
            </div>
            {step < totalSteps && (
              <div className={`h-1 flex-1 mx-2 transition-all rounded ${
                currentStep > step ? 'bg-gray-900' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
