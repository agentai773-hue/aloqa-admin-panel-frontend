// Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="ml-3">
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-6 bg-gray-200 rounded-full w-16 mx-auto"></div>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </td>
  </tr>
);

// Card Skeleton
export const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="ml-3">
        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

// Voice Card Skeleton  
export const VoiceCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 bg-gray-200 rounded w-24"></div>
      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-full"></div>
  </div>
);

// List Item Skeleton
export const ListItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border-b border-gray-200 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-48"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-20"></div>
  </div>
);

// Form Skeleton
export const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
    <div>
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
    <div>
      <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
      <div className="h-24 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="h-10 bg-gray-200 rounded w-24"></div>
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {Array.from({ length: 6 }).map((_, index) => (
              <th key={index} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);