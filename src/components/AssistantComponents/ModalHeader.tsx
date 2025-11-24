import { X } from 'lucide-react';
import type { User } from '../../api/users';

interface ModalHeaderProps {
  selectedUser: User | null;
  onClose: () => void;
}

export default function ModalHeader({ selectedUser, onClose }: ModalHeaderProps) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create New Assistant</h2>
        {selectedUser && (
          <p className="text-sm text-gray-600 mt-1">
            For: <span className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</span> ({selectedUser.email})
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}
