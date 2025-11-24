import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-6 px-4">
      <div className="max-w-sm sm:max-w-md w-full text-center">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="mb-6 sm:mb-8">
            <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center rounded-full bg-red-100 mb-4 sm:mb-6">
              <svg className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
            <p className="text-sm sm:text-base text-gray-600">
              The page you're looking for doesn't exist.
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <Link
              to="/"
              className="block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg touch-target"
            >
              Go to Dashboard
            </Link>
            <div>
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}