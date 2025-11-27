import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usersAPI, type CreateUserData } from '../../api';
import { Eye, EyeOff } from 'lucide-react';

export default function CreateUser() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdUserData, setCreatedUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
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
        setCreatedUserData({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
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
    <div className="min-h-screen ">
  

      {/* Form Container */}
      <div className="max-w-7xl mx-auto bg-white ">
        <form onSubmit={handleSubmit}>
          {/* Main Form Card */}
          <div className=" overflow-hidden">
            
            {/* Personal Information Section */}
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-600 mt-1">Basic user details and contact information</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.firstName 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {validationErrors.firstName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
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
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="Doe"
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
                    <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
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
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="john.doe@company.com"
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
                    <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                      +91
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full pl-14 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        validationErrors.mobile 
                          ? 'border-red-400 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-300 focus:border-[#5DD149] hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="9876543210"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      {formData.mobile.length}/10
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
            <div className="p-8 md:p-10 ">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
                <p className="text-sm text-gray-600 mt-1">Business details and company address</p>
              </div>
              
              <div className="space-y-6">
                {/* Company Name */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
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
                          : 'border-gray-300 focus:border-green-500 hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="Acme Corporation Inc."
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
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
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
                          : 'border-gray-300 focus:border-green-500 hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="123 Business Street&#10;Suite 456&#10;City, State 12345"
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
            <div className="p-8 md:p-10 ">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Security Information</h2>
                <p className="text-sm text-gray-600 mt-1">Set up secure login credentials</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="group">
                  <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                    <svg className="h-4 w-4 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
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
                          : 'border-gray-300 focus:border-[#306B25] hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-gray-600">Password Strength:</span>
                        <span className={`text-xs font-bold ${
                          passwordStrength === 'weak' ? 'text-red-600' :
                          passwordStrength === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength === 'weak' ? 'bg-red-500' :
                          passwordStrength === 'medium' ? 'bg-yellow-500' :
                          passwordStrength === 'strong' ? 'bg-green-500' :
                          'bg-gray-200'
                        }`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength === 'medium' ? 'bg-yellow-500' :
                          passwordStrength === 'strong' ? 'bg-green-500' :
                          'bg-gray-200'
                        }`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength === 'strong' ? 'bg-green-500' :
                          'bg-gray-200'
                        }`}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Use 8+ characters with a mix of uppercase, lowercase, numbers & symbols
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
                    <svg className="h-4 w-4 text-[#306B25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
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
                          : 'border-gray-300 focus:border-[#306B25] hover:border-gray-400 focus:ring-4 focus:ring-green-100'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
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
                <div className="mt-8 p-5 bg-red-50 border-2 border-red-200 rounded-xl animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-900">Error Creating User</p>
                      <p className="text-sm text-red-700 mt-1">{validationErrors.submit}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 mt-8 px-2">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="group px-8 py-4 text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group px-10 py-4 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transform hover:-translate-y-1 disabled:transform-none flex items-center gap-3"
              style={{
                background: isSubmitting ? 'linear-gradient(to right, #5DD149, #306B25)' : 'linear-gradient(to right, #5DD149, #306B25)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #4BC13B, #255A1D)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #5DD149, #306B25)'}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating User...</span>
                </>
              ) : (
                <>
                  <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Create New User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && createdUserData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-slideIn">
            {/* Header with gradient */}
            <div className="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center">User Created Successfully!</h3>
              <p className="text-green-100 text-center mt-2 text-sm">
                The account has been created and verification email sent
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* User Details Card */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#306B25] uppercase tracking-wide">User Details</p>
                    <h4 className="text-lg font-bold text-gray-900 mt-1">
                      {createdUserData.firstName} {createdUserData.lastName}
                    </h4>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-[#5DD149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 font-medium">{createdUserData.email}</span>
                  </div>
                </div>
              </div>

              {/* Email Verification Notice */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-yellow-900">Email Verification Required</p>
                    <p className="text-xs text-yellow-800 mt-1">
                      A verification link has been sent to <span className="font-semibold">{createdUserData.email}</span>. 
                      The user must verify their email before accessing the account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Next Steps
                </p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>User account created successfully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5DD149] mt-0.5">→</span>
                    <span>User will receive verification email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#306B25] mt-0.5">→</span>
                    <span>After verification, admin approval required</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
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
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow"
              >
                Create Another User
              </button>
              <button
                onClick={() => navigate('/users')}
                className="flex-1 px-4 py-3 bg-linear-to-r from-[#5DD149] to-[#306B25] hover:from-[#4BC13B] hover:to-[#255A1D] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:-translate-y-0.5"
              >
                Go to User List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
