import { motion, AnimatePresence } from 'framer-motion';

interface UserActionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function UserActionSuccessModal({ 
  isOpen, 
  onClose, 
  message 
}: UserActionSuccessModalProps) {
  const isEmailRelated = message.toLowerCase().includes('email');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              className="p-6 text-white text-center"
              style={{
                background: 'linear-gradient(to right, #5DD149, #40C62C, #306B25)'
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="flex items-center justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={{ scale: [1, 1.2] }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                  <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <motion.svg 
                      className="h-16 w-16 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </div>
                </div>
              </motion.div>
              <motion.h3 
                className="text-2xl font-bold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Success!
              </motion.h3>
            </motion.div>

            <div className="p-6">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex-1">
                  <p className="text-base text-gray-800">{message}</p>
                  {isEmailRelated && (
                    <motion.p 
                      className="mt-3 text-sm text-gray-600 bg-green-50 rounded-lg p-3 border border-green-200"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <span className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-[#5DD149] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#306B25]">
                          The user will receive an email with a verification link that is valid for 24 hours.
                        </span>
                      </span>
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="flex justify-end px-6 py-4 bg-gray-50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={onClose}
                className="px-6 py-2 text-white rounded-lg font-medium"
                style={{
                  background: 'linear-gradient(to right, #16A34A, #306B25)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(22, 163, 74, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
