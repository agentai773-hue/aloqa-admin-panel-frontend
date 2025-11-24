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
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  isPending,
  selectedUserId,
  selectedUserIds = [],
  onPrevious,
  onNext,
  onCancel
}: NavigationButtonsProps) {
  const hasSelectedUsers = selectedUserIds.length > 0 || Boolean(selectedUserId);
  
  return (
    <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
        >
          ← Previous
        </button>
      )}
      
      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="ml-auto flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-lg"
        >
          Next Step
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isPending || !hasSelectedUsers}
          className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Assistant...
            </>
          ) : (
            <>
              <Check className="h-5 w-5" />
              Create Assistant
            </>
          )}
        </button>
      )}
      
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
