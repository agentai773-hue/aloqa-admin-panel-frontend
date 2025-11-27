// Loading fallback component for lazy-loaded routes
export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
        <span className="text-white text-lg">Loading...</span>
      </div>
    </div>
  );
}