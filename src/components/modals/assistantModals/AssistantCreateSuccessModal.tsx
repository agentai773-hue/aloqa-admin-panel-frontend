import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import type { CreateAssistantData } from '../../../api';

interface AssistantCreateSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  assistantName: string;
  formData: CreateAssistantData;
}

export default function AssistantCreateSuccessModal({
  isOpen,
  onClose,
  assistantName,
  formData
}: AssistantCreateSuccessModalProps) {
  const navigate = useNavigate();

  const handleViewAssistants = () => {
    onClose();
    navigate('/assistant');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            {/* Green gradient header */}
            <div className="px-6 py-8 text-center" style={{ background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)' }}>
              <motion.div 
                className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 border-4 border-white/30 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Assistant Created Successfully!
              </h3>
              <p className="text-white/90 text-sm">
                Your AI assistant is now ready to use
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Assistant Details Card */}
              <div className="bg-linear-to-br from-[#5DD149]/10 to-[#306B25]/10 rounded-xl p-5 mb-6 border-2 border-[#5DD149]/30">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-[#5DD149]/20 rounded-lg">
                    <svg className="h-5 w-5 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#306B25] uppercase tracking-wide mb-1">
                      Assistant Name
                    </h4>
                    <p className="text-xl font-bold bg-linear-to-r from-[#5DD149] to-[#306B25] bg-clip-text text-transparent">
                      {assistantName}
                    </p>
                  </div>
                </div>

                {/* Configuration Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#5DD149]/20">
                    <h5 className="text-xs font-bold text-[#306B25] uppercase tracking-wide mb-1">
                      Voice Provider
                    </h5>
                    <p className="text-sm font-semibold text-gray-700 capitalize">
                      {formData.synthesizerConfig.provider}
                    </p>
                  </div>
                  {formData.synthesizerConfig.provider_config.voice && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#5DD149]/20">
                      <h5 className="text-xs font-bold text-[#306B25] uppercase tracking-wide mb-1">
                        Selected Voice
                      </h5>
                      <p className="text-sm font-semibold text-gray-700">
                        {formData.synthesizerConfig.provider_config.voice}
                      </p>
                      {formData.voiceId && (
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {formData.voiceId}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-[#5DD149]/30">
                  <div className="flex items-center gap-2 text-[#306B25] mb-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-bold">What's Next?</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-[#5DD149] font-bold">•</span>
                      <span className="font-medium">Test your assistant with voice calls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#5DD149] font-bold">•</span>
                      <span className="font-medium">Monitor performance in the dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#5DD149] font-bold">•</span>
                      <span className="font-medium">Configure phone numbers for deployment</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleViewAssistants}
                  className="flex-1 px-6 py-3 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#5DD149] focus:ring-offset-2"
                  style={{ background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)' }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    View All Assistants
                  </span>
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}