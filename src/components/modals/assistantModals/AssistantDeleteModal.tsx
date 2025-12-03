import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface Assistant {
  _id: string;
  agentName: string;
  // Add other assistant properties as needed
}

interface AssistantDeleteModalProps {
  isOpen: boolean;
  assistant: Assistant | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function AssistantDeleteModal({
  isOpen,
  assistant,
  onClose,
  onConfirm,
  isDeleting = false
}: AssistantDeleteModalProps) {
  if (!assistant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-6 bg-linear-to-r from-red-500 to-red-600 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Delete Assistant?</h2>
              </div>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong className="text-gray-900">"{assistant.agentName}"</strong>?
              </p>
              
              <div className="bg-linear-to-r from-red-50 to-red-100/50 border-2 border-red-300 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800 font-bold flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  This action cannot be undone!
                </p>
                <p className="text-sm text-red-700 mt-2">
                  The assistant will be permanently deleted from your database.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDeleting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5" />
                      Delete 
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}