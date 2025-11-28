import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthRedux } from '../../hooks/useAuthRedux';
import { Navigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated, loginError, clearLoginErrors } = useAuthRedux();

  // Get the redirect path from location state, or default to dashboard
  const from = '/';

  // If already authenticated, redirect to the intended destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearLoginErrors();

    if (!email || !password) {
      return;
    }

    console.log('🚀 Attempting login with:', { email });
    try {
      const result = await login(email, password);
      console.log('✅ Login result:', result);
    } catch (error) {
      console.error('❌ Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-2rem)] lg:min-h-0">
          {/* Left Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Logo and Brand - Desktop Only */}
            <div className="mb-8 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-3 mb-8"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                  <img
                    src="/logo.svg"
                    alt="Aloqa Logo"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <svg
                    className="w-6 h-6 text-green-500 hidden"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Admin Portal Login
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 text-base"
              >
                Welcome back to Aloqa Admin Panel
              </motion.p>
            </div>

            {/* Mobile Header Text */}
            <div className="mb-8 lg:hidden text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Admin Portal Login
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 text-sm"
              >
                Welcome back to Aloqa Admin Panel
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Your Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="Your Email"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      loginError?.email
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-gray-700 focus:ring-green-500/50 focus:border-green-500'
                    }`}
                    required
                  />
                </div>
                {/* Email Error */}
                <AnimatePresence>
                  {loginError?.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {loginError.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Password"
                    className={`w-full pl-12 pr-12 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      loginError?.password
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-gray-700 focus:ring-green-500/50 focus:border-green-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
                {/* Password Error */}
                <AnimatePresence>
                  {loginError?.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {loginError.password}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* General Error Message */}
              <AnimatePresence>
                {loginError?.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{loginError.general}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </motion.button>
            </motion.form>

            {/* Admin Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl"
            >
              <div className="text-center">
                <h4 className="text-sm font-medium text-green-400 mb-2">Admin Access Only</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  <p><span className="text-gray-300">Demo Email:</span> admin@aloqa.ai</p>
                  <p><span className="text-gray-300">Demo Password:</span> admin123</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Modern Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Modern Dashboard Preview */}
              <div className="relative w-full h-[500px] bg-linear-to-br from-white/10 via-gray-800/20 to-gray-900/30 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10 shadow-2xl">
                {/* Dashboard Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center"
                      >
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </motion.div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Aloqa</h3>
                        <p className="text-gray-400 text-xs">Admin Dashboard</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      {[
                        { label: 'Users', value: '1,234', color: 'bg-blue-500' },
                        { label: 'Active', value: '856', color: 'bg-green-500' },
                        { label: 'Revenue', value: '$45K', color: 'bg-purple-500' }
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="text-center"
                        >
                          <div className={`w-2 h-2 ${stat.color} rounded-full mx-auto mb-1`}></div>
                          <div className="text-white text-xs font-bold">{stat.value}</div>
                          <div className="text-gray-400 text-xs">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: 'Total Users', value: '2,847', trend: '+12%', color: 'from-blue-500/20 to-blue-600/10' },
                      { title: 'Assistants', value: '156', trend: '+8%', color: 'from-green-500/20 to-green-600/10' }
                    ].map((card, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className={`bg-linear-to-br ${card.color} p-4 rounded-xl border border-white/10`}
                      >
                        <h4 className="text-gray-300 text-xs font-medium">{card.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-white text-lg font-bold">{card.value}</span>
                          <span className="text-green-400 text-xs font-medium">{card.trend}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-linear-to-br from-gray-800/40 to-gray-900/20 p-4 rounded-xl border border-white/5"
                  >
                    <h4 className="text-gray-300 text-sm font-medium mb-3">Performance Overview</h4>
                    <div className="flex items-end justify-between h-20 space-x-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.random() * 80 + 20}%` }}
                          transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
                          className="w-6 bg-linear-to-t from-green-500 to-emerald-400 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* User List Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    className="space-y-2"
                  >
                    <h4 className="text-gray-300 text-sm font-medium">Recent Users</h4>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8 + i * 0.1 }}
                        className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-linear-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          U{i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">User {i + 1}</div>
                          <div className="text-gray-400 text-xs">user{i + 1}@example.com</div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Floating Orbs */}
                <motion.div
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-20 right-8 w-4 h-4 bg-green-400/60 rounded-full blur-sm"
                />
                
                <motion.div
                  animate={{
                    x: [0, -15, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-20 left-8 w-3 h-3 bg-emerald-500/60 rounded-full blur-sm"
                />

                <motion.div
                  animate={{
                    x: [0, 10, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute top-60 left-20 w-2 h-2 bg-blue-400/60 rounded-full blur-sm"
                />
              </div>

              {/* Bottom Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 }}
                className="mt-6 text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-2">Modern Admin Experience</h3>
                <p className="text-gray-400 text-base leading-relaxed max-w-md mx-auto">
                  Powerful dashboard with real-time analytics, user management, and seamless performance monitoring
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {['Real-time Data', 'User Analytics', 'Secure Access', 'Mobile Ready'].map((feature, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.4 + i * 0.1 }}
                      className="px-3 py-1 bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-medium"
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile Bottom Visual Element */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="lg:hidden mt-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <p className="text-gray-400 text-xs">
                Secure admin access
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}