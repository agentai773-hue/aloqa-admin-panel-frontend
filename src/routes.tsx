import { type RouteObject } from 'react-router';
import { Login, ProtectedRoute } from './components/auth';
import { Sidebar } from './components/layout';
import DashboardHome from './pages/DashboardHome';
import Users from './pages/User/Users';
import ViewUser from './pages/User/ViewUser';
import EditUser from './pages/User/EditUser';
import Assistant from './pages/Assistant/Assistant';
import AssistantCreate from './pages/Assistant/AssistantCreate';
import AssistantView from './pages/Assistant/AssistantView';
import AssignNumber from './pages/Number/AssignNumber';
import NumberLists from './pages/Number/NumberList';
import AssignVoice from './pages/Voice/AssignVoice';
import VoiceLists from './pages/Voice/VoiceList';
import AssistantEdit from './pages/Assistant/AssistantEdit';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Sidebar />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:id/view",
        element: <ViewUser />,
      },
      {
        path: "users/:id/edit",
        element: <EditUser />,
      },
      {
        path: "assistant",
        element: <Assistant />,
      },
      {
        path: "assistants/create",
        element: <AssistantCreate />,
      },
      {
        path: "assistants/:id/view",
        element: <AssistantView />,
      },
      {
        path: "assistants/:id/edit",
        element: <AssistantEdit />,
      },
          {
        path: "assign/number",
        element: <AssignNumber />,
      },
          {
        path: "number/lists",
        element: <NumberLists />,
      },
          {
        path: "assign/voice",
        element: <AssignVoice />,
      },
          {
        path: "voice/lists",
        element: <VoiceLists />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
