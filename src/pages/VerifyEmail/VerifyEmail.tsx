import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { verifyAPI } from '../../api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const verifyEmail = async (token: string) => {
    try {
      const data = await verifyAPI.verifyEmail(token);

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Your email has been verified successfully!');
        
        // Redirect to login page after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification. Please try again later.');
    }
  };

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyEmail(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          </div>

          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#5DD149] mb-4"></div>
              <p className="text-gray-600 text-lg">Verifying your email...</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <svg 
                  className="mx-auto h-20 w-20 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Account Verified Successfully!
              </h2>
              <p className="text-gray-700 mb-2">{message}</p>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  ⏳ Please wait for admin approval
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  Your account is now verified, but you need admin approval before you can log in. 
                  You'll receive an email once your account is approved.
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Redirecting to login page in 5 seconds...
              </p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <svg 
                  className="mx-auto h-20 w-20 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verification Failed
              </h2>
              <p className="text-gray-700 mb-6">{message}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/resend-verification')}
                  className="w-full px-6 py-3 bg-[#5DD149] text-white rounded-lg hover:bg-[#306B25] transition-colors font-medium"
                >
                  Request New Verification Email
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Contact support at support@aloqa.com
        </p>
      </div>
    </div>
  );
}
