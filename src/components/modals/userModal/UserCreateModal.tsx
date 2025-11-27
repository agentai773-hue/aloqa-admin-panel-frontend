import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { usersAPI, type CreateUserData } from '../../api';
import UserSuccessModal from './UserSuccessModal';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function UserCreateModal({ isOpen, onClose, onSuccess }: UserCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdUserData, setCreatedUserData] = useState<CreateUserData | null>(null);
  
  const [formData, setFormData] = useState<CreateUserData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    companyName: '',
    companyAddress: '',
    password: '',
    confirmPassword: '',
    totalMinutes: 0,
    paymentId: ''
  });

  // Calculate password strength
  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | '' => {
    if (!password) return '';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'mobile' && !/^\d*$/.test(value)) return;
    if (name === 'mobile' && value.length > 10) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.mobile.trim()) errors.mobile = 'Mobile number is required';
    else if (formData.mobile.length !== 10) errors.mobile = 'Mobile must be 10 digits';
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.companyAddress.trim()) errors.companyAddress = 'Company address is required';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await usersAPI.createUser(formData);
      
      if (response.success) {
        // Store created user data and show success modal
        setCreatedUserData(formData);
        setShowSuccessModal(true);
        onSuccess(`User ${formData.firstName} ${formData.lastName} created successfully!`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setValidationErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      companyName: '',
      companyAddress: '',
      password: '',
      confirmPassword: '',
      totalMinutes: 0,
      paymentId: ''
    });
    setValidationErrors({});
    setPasswordStrength('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setCreatedUserData(null);
    handleClose();
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setCreatedUserData(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      companyName: '',
      companyAddress: '',
      password: '',
      confirmPassword: '',
      totalMinutes: 0,
      paymentId: ''
    });
    setPasswordStrength('');
  };

  const passwordStrengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              className="px-6 py-5 border-b border-gray-200"
              style={{
                background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)'
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New User</h2>
                    <p className="text-sm text-white/80 mt-0.5">Add a new user to the system</p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-6 space-y-6">
                {/* Error Message */}
                <AnimatePresence>
                  {validationErrors.submit && (
                    <motion.div
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-700 font-medium">{validationErrors.submit}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="h-8 w-1 bg-linear-to-b from-[#5DD149] to-[#306B25] rounded-full"></span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                          validationErrors.firstName 
                            ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                            : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                        } focus:outline-none focus:ring-4 focus:ring-green-100`}
                        placeholder="John"
                      />
                      <AnimatePresence>
                        {validationErrors.firstName && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.firstName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Last Name */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                          validationErrors.lastName 
                            ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                            : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                        } focus:outline-none focus:ring-4 focus:ring-green-100`}
                        placeholder="Doe"
                      />
                      <AnimatePresence>
                        {validationErrors.lastName && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.lastName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Email */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                          validationErrors.email 
                            ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                            : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                        } focus:outline-none focus:ring-4 focus:ring-green-100`}
                        placeholder="john.doe@company.com"
                      />
                      <AnimatePresence>
                        {validationErrors.email && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Mobile */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">+91</span>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          maxLength={10}
                          className={`w-full pl-14 pr-4 py-3 rounded-xl transition-all duration-200 ${
                            validationErrors.mobile 
                              ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                              : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                          } focus:outline-none focus:ring-4 focus:ring-green-100`}
                          placeholder="9876543210"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                          {formData.mobile.length}/10
                        </span>
                      </div>
                      <AnimatePresence>
                        {validationErrors.mobile && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.mobile}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Company Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="h-8 w-1 bg-linear-to-b from-[#5DD149] to-[#306B25] rounded-full"></span>
                    Company Information
                  </h3>
                  <div className="space-y-4">
                    {/* Company Name */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                          validationErrors.companyName 
                            ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                            : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                        } focus:outline-none focus:ring-4 focus:ring-green-100`}
                        placeholder="Acme Corporation"
                      />
                      <AnimatePresence>
                        {validationErrors.companyName && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.companyName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Company Address */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Company Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl resize-none transition-all duration-200 ${
                          validationErrors.companyAddress 
                            ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                            : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                        } focus:outline-none focus:ring-4 focus:ring-green-100`}
                        placeholder="123 Business Street, City, State, ZIP"
                      />
                      <AnimatePresence>
                        {validationErrors.companyAddress && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.companyAddress}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Security Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="h-8 w-1 bg-linear-to-b from-[#5DD149] to-[#306B25] rounded-full"></span>
                    Security Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 rounded-xl transition-all duration-200 ${
                            validationErrors.password 
                              ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                              : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                          } focus:outline-none focus:ring-4 focus:ring-green-100`}
                          placeholder="••••••••"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </motion.button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      <AnimatePresence>
                        {formData.password && (
                          <motion.div
                            className="mt-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="flex gap-1">
                              {['weak', 'medium', 'strong'].map((level, index) => (
                                <motion.div
                                  key={level}
                                  className={`h-1.5 flex-1 rounded-full ${
                                    passwordStrength === 'weak' && index === 0 ? passwordStrengthColors.weak :
                                    passwordStrength === 'medium' && index <= 1 ? passwordStrengthColors.medium :
                                    passwordStrength === 'strong' ? passwordStrengthColors.strong :
                                    'bg-gray-200'
                                  }`}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              Strength: <span className="font-semibold capitalize">{passwordStrength}</span>
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {validationErrors.password && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 rounded-xl transition-all duration-200 ${
                            validationErrors.confirmPassword 
                              ? 'border-2 border-red-400 focus:border-red-500 bg-red-50' 
                              : 'border-2 border-gray-200 focus:border-[#5DD149] hover:border-[#5DD149]/50'
                          } focus:outline-none focus:ring-4 focus:ring-green-100`}
                          placeholder="••••••••"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </motion.button>
                      </div>
                      
                      <AnimatePresence>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <motion.div
                            className="mt-2 flex items-center gap-1 text-green-600 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Passwords match</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {validationErrors.confirmPassword && (
                          <motion.p
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {validationErrors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div
                className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(to right, #5DD149, #306B25)',
                  }}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05, boxShadow: "0 20px 25px -5px rgba(93, 209, 73, 0.3)" }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Create User</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Success Modal */}
    <UserSuccessModal 
      isOpen={showSuccessModal}
      onClose={handleSuccessClose}
      onCreateAnother={handleCreateAnother}
      userData={createdUserData}
    />
    </>
  );
}
