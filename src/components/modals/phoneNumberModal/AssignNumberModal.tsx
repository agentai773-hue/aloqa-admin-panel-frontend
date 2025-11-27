import { motion, AnimatePresence } from 'framer-motion';

interface AssignNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedPhoneNumber: string;
  selectedUserId: string;
  availableNumbers: Array<{ id: string; phone_number: string; telephony_provider: string }>;
  users: Array<{ _id: string; firstName: string; lastName: string; companyName: string; email: string }>;
  setSelectedPhoneNumber: (value: string) => void;
  setSelectedUserId: (value: string) => void;
  isLoading?: boolean;
  isPurchasedLoading?: boolean;
}

export default function AssignNumberModal({
  isOpen,
  onClose,
  onConfirm,
  selectedPhoneNumber,
  selectedUserId,
  availableNumbers,
  users,
  setSelectedPhoneNumber,
  setSelectedUserId,
  isLoading = false,
  isPurchasedLoading = false,
}: AssignNumberModalProps) {
  
  const selectedUser = users.find(u => u._id === selectedUserId);

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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
                background: 'linear-gradient(135deg, #5DD149 0%, #40C62C 50%, #306B25 100%)'
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold">Assign Phone Number</h3>
                    <p className="text-green-100 text-sm mt-1">Assign a number to a user</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isPurchasedLoading ? (
                <div className="py-12 text-center">
                  <motion.div 
                    className="inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <svg className="h-12 w-12 text-[#5DD149]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </motion.div>
                  <p className="mt-4 text-gray-600 font-medium">Loading numbers...</p>
                </div>
              ) : availableNumbers.length === 0 ? (
                <motion.div 
                  className="py-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-6xl mb-4">📵</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">No Available Numbers</h4>
                  <p className="text-gray-600">
                    All purchased numbers have been assigned. Buy more numbers to assign them to users.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Select Phone Number */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <div className="p-1.5 bg-[#5DD149]/10 rounded-lg">
                        <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      Select Phone Number <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedPhoneNumber}
                      onChange={(e) => setSelectedPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#5DD149] hover:border-[#5DD149]/50 focus:ring-4 focus:ring-[#5DD149]/20 bg-white transition-all duration-200"
                    >
                      <option value="">Choose a phone number</option>
                      {availableNumbers.map((num) => (
                        <option key={num.id} value={num.phone_number}>
                          {num.phone_number} ({num.telephony_provider})
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Select User */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <div className="p-1.5 bg-[#306B25]/10 rounded-lg">
                        <svg className="h-4 w-4 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Select User <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#306B25] hover:border-[#306B25]/50 focus:ring-4 focus:ring-[#306B25]/20 bg-white transition-all duration-200"
                    >
                      <option value="">Choose a user</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.companyName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Selected Info */}
                  {selectedPhoneNumber && selectedUserId && selectedUser && (
                    <motion.div 
                      className="rounded-xl p-5 border-2 border-green-100"
                      style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <svg className="h-5 w-5 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#306B25] mb-2">Assignment Summary:</p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700">
                              Number: <span className="font-mono font-bold text-[#5DD149]">{selectedPhoneNumber}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Will be assigned to: <span className="font-bold text-[#306B25]">{selectedUser.companyName}</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{selectedUser.email}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {availableNumbers.length > 0 && (
              <motion.div 
                className="p-6 border-t border-gray-200 bg-gray-50"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-end gap-3">
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={onConfirm}
                    disabled={!selectedPhoneNumber || !selectedUserId || isLoading}
                    className="relative px-8 py-3 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)',
                    }}
                    whileHover={{ scale: !selectedPhoneNumber || !selectedUserId || isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: !selectedPhoneNumber || !selectedUserId || isLoading ? 1 : 0.98 }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-[#4BC13B] to-[#255A1D] opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Assigning...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Assign Number</span>
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
