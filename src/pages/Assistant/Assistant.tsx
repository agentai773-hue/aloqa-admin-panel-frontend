import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../../api';
import { AssistantTable } from '../../components/assistant';

export default function Assistant() {
  // Fetch users for user filter
  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getUsers()
  });

  const users = usersResponse?.data?.users || [];

  return (
    <div className="space-y-6">
      {/* Assistants Table */}
      <AssistantTable users={users} />
    </div>
  );
}
