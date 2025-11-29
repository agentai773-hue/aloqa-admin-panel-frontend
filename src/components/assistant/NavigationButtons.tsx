import { Loader2, Check, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isPending: boolean;
  selectedUserId?: string;
  selectedUserIds?: string[];
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit?: () => void;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  isPending,
  selectedUserId,
  selectedUserIds = [],
  onPrevious,
  onNext,
  onCancel,
  onSubmit
}: NavigationButtonsProps) {
  const hasSelectedUsers = selectedUserIds.length > 0 || Boolean(selectedUserId);
  
  return (
    <div className="flex flex-col gap-3 pt-6 border-t-2 border-[#5DD149]/20 mt-8 bg-linear-to-r from-[#5DD149]/5 to-[#306B25]/5 p-4 rounded-xl">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Mobile: Stack all buttons vertically */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onPrevious}
              disabled={isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border-2 border-[#5DD149]/30 text-[#306B25] bg-white rounded-lg hover:bg-[#5DD149]/10 hover:border-[#5DD149] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ← Previous
            </button>
          )}
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-green-300 text-green-600 bg-white rounded-lg hover:bg-green-50 hover:border-green-400 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-linear-to-r from-[#5DD149] to-[#306B25] text-white rounded-lg hover:from-[#4BC13B] hover:to-[#255A1D] font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-0.5"
            >
              Next Step
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isPending || !hasSelectedUsers}
              className="w-full sm:w-auto sm:ml-auto px-6 sm:px-8 py-3 bg-linear-to-r from-[#5DD149] to-[#306B25] text-white rounded-lg hover:from-[#4BC13B] hover:to-[#255A1D] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-0.5 relative overflow-hidden"
            >
              {isPending && (
                <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent animate-pulse" />
              )}
              <div className="relative flex items-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="hidden sm:inline">Creating Assistant...</span>
                    <span className="sm:hidden">Creating...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span className="hidden sm:inline">Create Assistant</span>
                    <span className="sm:hidden">Create</span>
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
