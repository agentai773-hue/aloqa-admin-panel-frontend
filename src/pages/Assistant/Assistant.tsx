import { useQuery } from '@tanstack/react-query';
import { assistantsAPI } from '../../api/assistants';
import { usersAPI } from '../../api/users';
import { AssistantTable } from '../../components/AssistantComponents';

export default function Assistant() {

  // Fetch assistants
  const { data: assistantsResponse, isLoading: loadingAssistants } = useQuery({
    queryKey: ['assistants'],
    queryFn: () => assistantsAPI.getAllAssistants()
  });

  // Fetch users
  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getUsers()
  });

  const assistants = assistantsResponse?.data || [];
  const users = usersResponse?.data?.users || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
      

        {/* Assistants Table */}
        <AssistantTable
          assistants={assistants}
          users={users}
          isLoading={loadingAssistants}
        />
      </div>
    </div>
  );
}
