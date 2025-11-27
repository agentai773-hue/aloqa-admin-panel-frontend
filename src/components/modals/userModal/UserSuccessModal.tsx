import { motion, AnimatePresence } from 'framer-motion';
import type { CreateUserData } from '../../api';

interface UserSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAnother: () => void;
  userData: CreateUserData | null;
}

export default function UserSuccessModal({ isOpen, onClose, onCreateAnother, userData }: UserSuccessModalProps) {
  if (!userData) return null;

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
                User Created Successfully!
              </motion.h3>
              <motion.p 
                className="text-green-100 text-center mt-2 text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                The account has been created and verification email sent
              </motion.p>
            </motion.div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* User Details Card */}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#306B25] uppercase tracking-wide">User Details</p>
                    <h4 className="text-lg font-bold text-gray-900 mt-1">
                      {userData.firstName} {userData.lastName}
                    </h4>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 font-medium">{userData.email}</span>
                  </div>
                </div>
              </motion.div>

              {/* Email Verification Notice */}
              <motion.div 
                className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-start gap-3">
                  <motion.svg 
                    className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </motion.svg>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-yellow-900">Email Verification Required</p>
                    <p className="text-xs text-yellow-800 mt-1">
                      A verification link has been sent to <span className="font-semibold">{userData.email}</span>. 
                      The user must verify their email before accessing the account.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div 
                className="bg-gray-50 rounded-xl p-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Next Steps
                </p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <motion.li 
                    className="flex items-start gap-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>User account created successfully</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start gap-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="text-[#5DD149] mt-0.5">→</span>
                    <span>User will receive verification email</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start gap-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <span className="text-[#306B25] mt-0.5">→</span>
                    <span>After verification, admin approval required</span>
                  </motion.li>
                </ul>
              </motion.div>
            </div>

            {/* Footer Actions */}
            <motion.div 
              className="bg-gray-50 px-6 py-4 flex gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.button
                onClick={onCreateAnother}
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 shadow-sm"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: '#9CA3AF',
                  backgroundColor: '#F9FAFB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Create Another User
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
                style={{
                  background: 'linear-gradient(to right, #5DD149, #306B25)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 25px -5px rgba(93, 209, 73, 0.4), 0 10px 10px -5px rgba(93, 209, 73, 0.2)',
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                Go to User List
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
