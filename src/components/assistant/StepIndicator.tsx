import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = {
  1: { full: 'User & Basic', short: 'User' },
  2: { full: 'LLM Config', short: 'LLM' },
  3: { full: 'Voice Synth', short: 'Voice' },
  4: { full: 'Transcriber & I/O', short: 'I/O' },
  5: { full: 'Task Config', short: 'Task' }
};

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 bg-white border-2 border-[#5DD149]/30 rounded-lg lg:rounded-xl shadow-xl relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-[#5DD149]/5 to-[#306B25]/5" />
      
      <div className="relative flex items-center justify-between max-w-5xl mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 shadow-lg ${
                currentStep > step
                  ? 'bg-linear-to-br from-[#5DD149] to-[#306B25] text-white border-2 border-[#5DD149] transform scale-110'
                  : currentStep === step
                  ? 'bg-linear-to-br from-[#5DD149] to-[#306B25] text-white border-2 border-[#5DD149] ring-4 ring-[#5DD149]/30 transform scale-110 animate-pulse'
                  : 'bg-white text-green-500 border-2 border-green-300'
              }`}>
                {currentStep > step ? (
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-sm" />
                ) : (
                  <span className={currentStep === step ? 'drop-shadow-sm' : ''}>{step}</span>
                )}
                
                {/* Glowing effect for active step */}
                {currentStep === step && (
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#5DD149] to-[#306B25] animate-ping opacity-20" />
                )}
              </div>
              
              {/* Step Label */}
              <span className={`text-xs sm:text-sm mt-2 font-bold text-center transition-colors max-w-20 leading-tight ${
                currentStep === step 
                  ? 'text-[#306B25]' 
                  : currentStep > step 
                  ? 'text-[#5DD149]'
                  : 'text-green-500'
              }`}>
                <span className="hidden sm:inline">
                  {stepLabels[step as keyof typeof stepLabels]?.full}
                </span>
                <span className="sm:hidden">
                  {stepLabels[step as keyof typeof stepLabels]?.short}
                </span>
              </span>
            </div>
            
            {/* Progress Line */}
            {step < totalSteps && (
              <div className="h-1 flex-1 mx-2 sm:mx-3 transition-all duration-500 rounded-full relative overflow-hidden bg-green-200">
                <div className={`h-full transition-all duration-500 rounded-full ${
                  currentStep > step 
                    ? 'w-full bg-linear-to-r from-[#5DD149] to-[#306B25] shadow-sm' 
                    : 'w-0 bg-green-300'
                }`} />
                {currentStep > step && (
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
