import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = {
  1: 'User & Basic',
  2: 'LLM & Voice',
  3: 'Transcriber & I/O',
  4: 'Task Config'
};

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentStep > step
                  ? 'bg-green-600 text-white'
                  : currentStep === step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > step ? <Check className="h-5 w-5" /> : step}
              </div>
              <span className={`text-xs mt-2 font-semibold ${
                currentStep === step ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {stepLabels[step as keyof typeof stepLabels]}
              </span>
            </div>
            {step < totalSteps && (
              <div className={`h-1 flex-1 mx-2 transition-all ${
                currentStep > step ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
