import { motion, AnimatePresence } from 'framer-motion';

interface AssignSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  userName: string;
  userEmail: string;
}

export default function AssignSuccessModal({ 
  isOpen, 
  onClose, 
  phoneNumber, 
  userName,
  userEmail 
}: AssignSuccessModalProps) {
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
            {/* Header with gradient */}
            <motion.div 
              className="p-6 text-white"
              style={{
                background: 'linear-gradient(to right, #5DD149, #40C62C, #306B25)'
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm p-4 rounded-full"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <motion.svg 
                    className="h-16 w-16 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                </motion.div>
              </div>
              <motion.h3 
                className="text-2xl font-bold text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Number Assigned Successfully!
              </motion.h3>
              <motion.p 
                className="text-green-100 text-center mt-2 text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                The phone number has been assigned to the user
              </motion.p>
            </motion.div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Assignment Details Card */}
              <motion.div 
                className="rounded-xl p-5 border-2 border-green-100"
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <motion.div 
                    className="bg-green-100 p-2 rounded-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="h-5 w-5 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#306B25] mb-3">Assignment Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs text-gray-600 font-semibold">Phone Number</span>
                        <span className="text-sm font-mono font-bold text-[#5DD149] text-right">{phoneNumber}</span>
                      </div>
                      <div className="h-px bg-green-200"></div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs text-gray-600 font-semibold">Assigned To</span>
                        <span className="text-sm font-bold text-[#306B25] text-right">{userName}</span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs text-gray-600 font-semibold">Email</span>
                        <span className="text-sm text-gray-700 text-right">{userEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div 
                className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">What's Next?</p>
                    <p className="text-xs text-green-700 mt-1">
                      The phone number is now active and ready to be used by {userName}. The user can now configure and use this number for their communications.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div 
              className="p-6 bg-gray-50 border-t border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={onClose}
                className="w-full relative px-6 py-3 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-[#4BC13B] to-[#255A1D] opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Got it!
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
