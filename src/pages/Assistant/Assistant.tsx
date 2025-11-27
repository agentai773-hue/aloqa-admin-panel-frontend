import { useQuery } from '@tanstack/react-query';
import { assistantsAPI, usersAPI } from '../../api';
import { AssistantTable } from '../../components/assistant';

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
    <div className="space-y-6">
      {/* Assistants Table */}
      <AssistantTable
        assistants={assistants}
        users={users}
        isLoading={loadingAssistants}
      />
    </div>
  );
}
