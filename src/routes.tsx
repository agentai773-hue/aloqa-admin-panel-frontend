import { type RouteObject } from 'react-router';
import { Login, ProtectedRoute } from './components/auth';
import { Sidebar } from './components/layout';
import DashboardHome from './pages/DashboardHome';
import Users from './pages/User/Users';
import CreateUser from './pages/User/CreateUser';
import ViewUser from './pages/User/ViewUser';
import EditUser from './pages/User/EditUser';
import Assistant from './pages/Assistant/Assistant';
import AssistantCreate from './pages/Assistant/AssistantCreate';
import AssistantView from './pages/Assistant/AssistantView';
import AssistantEdit from './pages/Assistant/AssistantEdit';
import PhoneNumberList from './pages/PhoneNumber/PhoneNumberList';
import AssignNumber from './pages/PhoneNumber/AssignNumber';
import NotFound from './pages/NotFound';
import { VerifyEmail, ResendVerification } from './pages/VerifyEmail';

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/resend-verification",
    element: <ResendVerification />,
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
        path: "user/create",
        element: <CreateUser />,
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
        path: "phone-numbers",
        element: <PhoneNumberList />,
      },
      {
        path: "phone-numbers-assign",
        element: <AssignNumber />,
      },
   
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
