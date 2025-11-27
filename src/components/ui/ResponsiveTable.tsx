import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className={`min-w-full table-auto ${className}`}>
          {children}
        </table>
      </div>
    </motion.div>
  );
};

interface ResponsiveTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTableHeader: React.FC<ResponsiveTableHeaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
};

interface ResponsiveTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTableBody: React.FC<ResponsiveTableBodyProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({ 
  children, 
  className = '', 
  onClick 
}) => {
  return (
    <motion.tr
      className={`hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.tr>
  );
};

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
  minWidth?: string;
}

export const ResponsiveTableCell: React.FC<ResponsiveTableCellProps> = ({ 
  children, 
  className = '', 
  isHeader = false,
  minWidth = '120px'
}) => {
  const baseClasses = `px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left whitespace-nowrap`;
  const headerClasses = `text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider`;
  const cellClasses = `text-xs sm:text-sm text-gray-900`;
  
  const Component = isHeader ? 'th' : 'td';
  
  return (
    <Component 
      className={`${baseClasses} ${isHeader ? headerClasses : cellClasses} ${className}`}
      style={{ minWidth }}
    >
      {children}
    </Component>
  );
};

// Example usage component
export const ExampleTable = () => {
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Active' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Responsive Table Example</h2>
      
      <ResponsiveTable className="border border-gray-200 rounded-lg">
        <ResponsiveTableHeader>
          <ResponsiveTableRow>
            <ResponsiveTableCell isHeader minWidth="80px">ID</ResponsiveTableCell>
            <ResponsiveTableCell isHeader minWidth="150px">Name</ResponsiveTableCell>
            <ResponsiveTableCell isHeader minWidth="200px">Email</ResponsiveTableCell>
            <ResponsiveTableCell isHeader minWidth="120px">Role</ResponsiveTableCell>
            <ResponsiveTableCell isHeader minWidth="100px">Status</ResponsiveTableCell>
            <ResponsiveTableCell isHeader minWidth="120px">Actions</ResponsiveTableCell>
          </ResponsiveTableRow>
        </ResponsiveTableHeader>
        
        <ResponsiveTableBody>
          {sampleData.map((item) => (
            <ResponsiveTableRow key={item.id} onClick={() => console.log('Row clicked:', item)}>
              <ResponsiveTableCell>{item.id}</ResponsiveTableCell>
              <ResponsiveTableCell>
                <div className="font-medium">{item.name}</div>
              </ResponsiveTableCell>
              <ResponsiveTableCell>
                <div className="text-gray-600">{item.email}</div>
              </ResponsiveTableCell>
              <ResponsiveTableCell>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {item.role}
                </span>
              </ResponsiveTableCell>
              <ResponsiveTableCell>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </ResponsiveTableCell>
              <ResponsiveTableCell>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-xs sm:text-sm">
                    Delete
                  </button>
                </div>
              </ResponsiveTableCell>
            </ResponsiveTableRow>
          ))}
        </ResponsiveTableBody>
      </ResponsiveTable>
    </div>
  );
};