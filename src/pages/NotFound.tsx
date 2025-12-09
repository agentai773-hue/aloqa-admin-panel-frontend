import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    // naive route guess: navigate to path if it exists (simple shortcut)
    const path = query.startsWith('/') ? query : `/${query}`;
    navigate(path);
  };

  return (
  <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <motion.div
        className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left - Message */}
        <div className="text-center lg:text-left px-6 py-8 lg:py-12">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-linear-to-tr from-red-600 to-pink-500 mb-6 shadow-2xl">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4" />
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
            </svg>
          </div>

          <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
          <p className="text-2xl text-gray-300 font-semibold mb-4">We couldn't find that page</p>
          <p className="text-gray-400 max-w-lg mb-6">
            The page you're looking for doesn't exist or an unexpected error occurred. Try searching for a page or go back to the dashboard.
          </p>

          <form onSubmit={handleSearch} className="max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: /users, /assistant, /phone-numbers"
                className="flex-1 min-w-0 bg-gray-800/60 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-3 rounded-lg shadow"
              >
                Go
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-medium shadow"
            >
              Back to Dashboard
            </Link>

            <Link to="/users" className="text-sm text-gray-300 hover:text-white underline">
              View Users
            </Link>

            <Link to="/assistant" className="text-sm text-gray-300 hover:text-white underline">
              Assistants
            </Link>
          </div>
        </div>

        {/* Right - Illustration / Tips */}
        <div className="hidden lg:flex items-center justify-center px-6">
          <motion.div
            className="w-full max-w-lg bg-linear-to-tr from-gray-800/70 to-black/40 rounded-2xl p-8 shadow-2xl border border-gray-700/50"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-white text-2xl font-bold mb-3">Quick Links</h3>
              <p className="text-gray-400 mb-4">Here are some places you may want to go next.</p>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center justify-between bg-gray-900/40 p-3 rounded-lg">
                <div>
                  <div className="text-white font-medium">Dashboard</div>
                  <div className="text-xs text-gray-400">Overview & analytics</div>
                </div>
                <Link to="/" className="text-emerald-400 hover:text-emerald-300">Open</Link>
              </li>

              <li className="flex items-center justify-between bg-gray-900/40 p-3 rounded-lg">
                <div>
                  <div className="text-white font-medium">Users</div>
                  <div className="text-xs text-gray-400">Manage user accounts</div>
                </div>
                <Link to="/users" className="text-emerald-400 hover:text-emerald-300">Open</Link>
              </li>

              <li className="flex items-center justify-between bg-gray-900/40 p-3 rounded-lg">
                <div>
                  <div className="text-white font-medium">Assistants</div>
                  <div className="text-xs text-gray-400">Manage AI assistants</div>
                </div>
                <Link to="/assistant" className="text-emerald-400 hover:text-emerald-300">Open</Link>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}