import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usersAPI, type CreateUserData } from '../../api';
import { Eye, EyeOff } from 'lucide-react';
import UserSuccessModal from '../../components/modals/userModal/UserSuccessModal';

export default function CreateUser() {
  const navigate = useNavigate();
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
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for mobile number - only allow digits and limit to 10
    if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '');
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: limitedDigits }));
    } 
    // Special handling for password - calculate strength
    else if (name === 'password') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setPasswordStrength(calculatePasswordStrength(value));
    } 
    // Normal handling for other fields
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      errors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.companyAddress.trim()) {
      errors.companyAddress = 'Company address is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await usersAPI.createUser(formData);
      
      if (response.success && response.data) {
        // Store user data and show success modal
        setCreatedUserData(formData);
        setShowSuccessModal(true);
      }
    } catch (err: unknown) {
      console.error('Error creating user:', err);
      
      // Handle axios error with response
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string; field?: string } } };
        const errorData = axiosError.response?.data;
        
        // Check for duplicate key error
        if (errorData?.field === 'email' || 
            errorData?.message?.toLowerCase().includes('email already exists')) {
          setValidationErrors({ 
            email: errorData?.error || 'This email is already registered. Please use a different email address.' 
          });
          return;
        }
        
        // Check for email configuration error
        if (errorData?.message?.toLowerCase().includes('email service not configured') ||
            errorData?.message?.toLowerCase().includes('email configuration missing')) {
          setValidationErrors({ 
            submit: 'Email service is not configured. Please contact the administrator to enable email verification.' 
          });
          return;
        }
        
        // Generic error from backend
        if (errorData?.message || errorData?.error) {
          setValidationErrors({ 
            submit: errorData.error || errorData.message || 'Failed to create user' 
          });
          return;
        }
      }
      
      // Fallback error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user. Please try again.';
      setValidationErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      {/* Form Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <form onSubmit={handleSubmit}>
          {/* Main Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            
            {/* Personal Information Section */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-linear-to-r from-white to-green-50/20">
              <div className="mb-6 sm:mb-8 pb-3 sm:pb-4 border-b-2 border-[#5DD149]/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-linear-to-br from-[#5DD149] to-[#306B25] rounded-lg sm:rounded-xl shadow-lg">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Basic user details and contact information</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* First Name */}
                <div className="group">
                  <label className="flex text-sm sm:text-base font-bold text-gray-700 mb-2 sm:mb-3 items-center gap-2">
                    <div className="p-1 sm:p-1.5 bg-[#5DD149]/10 rounded-lg">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.firstName 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-[#5DD149]/50 focus:ring-4 focus:ring-[#5DD149]/20 bg-white'
                      }`}
                      placeholder="Enter first name"
                    />
                  </div>
                  {validationErrors.firstName && (
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <div className="p-1.5 bg-[#5DD149]/10 rounded-lg">
                      <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.lastName 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-[#5DD149]/50 focus:ring-4 focus:ring-[#5DD149]/20 bg-white'
                      }`}
                      placeholder="Enter last name"
                    />
                  </div>
                  {validationErrors.lastName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <div className="p-1.5 bg-[#5DD149]/10 rounded-lg">
                      <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.email 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-[#5DD149]/50 focus:ring-4 focus:ring-[#5DD149]/20 bg-white'
                      }`}
                      placeholder="user@example.com"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <div className="p-1.5 bg-[#5DD149]/10 rounded-lg">
                      <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 font-semibold">
                      <span className="text-[#5DD149]">🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full pl-20 pr-16 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.mobile 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-[#5DD149]/50 focus:ring-4 focus:ring-[#5DD149]/20 bg-white'
                      }`}
                      placeholder="9876543210"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#5DD149]/10 px-3 py-1 rounded-lg">
                      <span className={`text-xs font-bold ${formData.mobile.length === 10 ? 'text-[#5DD149]' : 'text-gray-500'}`}>
                        {formData.mobile.length}/10
                      </span>
                    </div>
                  </div>
                  {validationErrors.mobile && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.mobile}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="p-8 md:p-10 bg-gradient-to-r from-green-50/20 to-white border-t-2 border-gray-100">
              <div className="mb-8 pb-4 border-b-2 border-[#306B25]/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-[#306B25] to-[#5DD149] rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
                    <p className="text-sm text-gray-600 mt-1">Business details and company address</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Company Name */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <div className="p-1.5 bg-[#306B25]/10 rounded-lg">
                      <svg className="h-4 w-4 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                      </svg>
                    </div>
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.companyName 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#306B25] hover:border-[#306B25]/50 focus:ring-4 focus:ring-[#306B25]/20 bg-white'
                      }`}
                      placeholder="Your Company Pvt. Ltd."
                    />
                  </div>
                  {validationErrors.companyName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.companyName}
                    </p>
                  )}
                </div>

                {/* Company Address */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <div className="p-1.5 bg-[#306B25]/10 rounded-lg">
                      <svg className="h-4 w-4 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 resize-none ${
                        validationErrors.companyAddress 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#306B25] hover:border-[#306B25]/50 focus:ring-4 focus:ring-[#306B25]/20 bg-white'
                      }`}
                      placeholder="123 Business Street, Suite 456, City, State - 123456"
                    />
                  </div>
                  {validationErrors.companyAddress && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.companyAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Information Section */}
            <div className="p-8 md:p-10 bg-gradient-to-r from-white to-green-50/20 border-t-2 border-gray-100">
              <div className="mb-8 pb-4 border-b-2 border-[#5DD149]/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-[#5DD149] to-[#306B25] rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Security Information</h2>
                    <p className="text-sm text-gray-600 mt-1">Set up secure login credentials</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <div className="p-1.5 bg-[#306B25]/10 rounded-lg">
                      <svg className="h-4 w-4 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.password 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#306B25] hover:border-[#306B25]/50 focus:ring-4 focus:ring-[#306B25]/20 bg-white'
                      }`}
                      placeholder="Enter secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#306B25] transition-colors p-1 rounded-lg hover:bg-[#306B25]/10"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Password Strength</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          passwordStrength === 'weak' ? 'bg-red-100 text-red-700' :
                          passwordStrength === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {passwordStrength.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength === 'weak' ? 'bg-red-500' :
                          passwordStrength === 'medium' ? 'bg-yellow-500' :
                          passwordStrength === 'strong' ? 'bg-[#5DD149]' :
                          'bg-gray-200'
                        }`}></div>
                        <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength === 'medium' ? 'bg-yellow-500' :
                          passwordStrength === 'strong' ? 'bg-[#5DD149]' :
                          'bg-gray-200'
                        }`}></div>
                        <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength === 'strong' ? 'bg-[#5DD149]' :
                          'bg-gray-200'
                        }`}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 flex items-start gap-1.5">
                        <svg className="h-3.5 w-3.5 text-[#5DD149] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Use 8+ characters with uppercase, lowercase, numbers & symbols</span>
                      </p>
                    </div>
                  )}
                  
                  {validationErrors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <div className="p-1.5 bg-[#306B25]/10 rounded-lg">
                      <svg className="h-4 w-4 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.confirmPassword 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-[#5DD149] bg-green-50/30 focus:ring-4 focus:ring-[#5DD149]/20'
                          : 'border-gray-300 focus:border-[#306B25] hover:border-[#306B25]/50 focus:ring-4 focus:ring-[#306B25]/20 bg-white'
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#306B25] transition-colors p-1 rounded-lg hover:bg-[#306B25]/10"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <div className="absolute right-14 top-1/2 -translate-y-1/2">
                        <svg className="h-6 w-6 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {validationErrors.submit && (
                <div className="mt-8 p-5 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-300 rounded-2xl animate-fadeIn shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-200 rounded-lg shrink-0">
                      <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-900 mb-1">Error Creating User</p>
                      <p className="text-sm text-red-700">{validationErrors.submit}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg sm:rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm sm:text-base">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto group relative px-8 sm:px-10 py-3 sm:py-4 text-white rounded-lg sm:rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)',
              }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#4BC13B] to-[#255A1D] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2 sm:gap-3">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm sm:text-base">Creating User...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="text-sm sm:text-base">Create New User</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <UserSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setCreatedUserData(null);
          navigate('/users');
        }}
        onCreateAnother={() => {
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
        }}
        userData={createdUserData}
      />
    </div>
  );
}
