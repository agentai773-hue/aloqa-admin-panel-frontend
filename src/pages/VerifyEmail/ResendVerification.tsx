import { useState } from 'react';
import { useNavigate } from 'react-router';
import { verifyAPI } from '../../api';

export default function ResendVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const data = await verifyAPI.resendVerification(email);

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Verification email sent successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send verification email. Please try again.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Resend Verification Email</h1>
            <p className="text-gray-600 mt-2">
              Enter your email address to receive a new verification link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="your.email@example.com"
                disabled={status === 'loading'}
              />
            </div>

            {/* Success Message */}
            {status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-800 font-medium">{message}</p>
                    <p className="text-green-700 text-sm mt-1">
                      Please check your email inbox and spam folder. The link is valid for 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800">{message}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                'Send Verification Email'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-medium">What happens next?</p>
                <ul className="text-blue-700 text-sm mt-1 space-y-1 list-disc list-inside">
                  <li>You'll receive a verification email</li>
                  <li>Click the link to verify your account</li>
                  <li>Wait for admin approval to access your account</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Contact support at support@aloqa.com
        </p>
      </div>
    </div>
  );
}
