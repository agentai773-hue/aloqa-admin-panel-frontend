import { type RouteObject } from 'react-router';
import { Suspense, lazy } from 'react';
import { Sidebar } from './components/layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';

// Lazy load components for better performance
const AdminLogin = lazy(() => import('./pages/Auth/AdminLogin'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const Users = lazy(() => import('./pages/User/Users'));
const CreateUser = lazy(() => import('./pages/User/CreateUser'));
const ViewUser = lazy(() => import('./pages/User/ViewUser'));
const EditUser = lazy(() => import('./pages/User/EditUser'));
const Assistant = lazy(() => import('./pages/Assistant/Assistant'));
const AssistantCreate = lazy(() => import('./pages/Assistant/AssistantCreate'));
const AssistantView = lazy(() => import('./pages/Assistant/AssistantView'));
const AssistantEdit = lazy(() => import('./pages/Assistant/AssistantEdit'));
const PhoneNumberList = lazy(() => import('./pages/PhoneNumber/PhoneNumberList'));
const AssignNumber = lazy(() => import('./pages/PhoneNumber/AssignNumber'));
const Voice = lazy(() => import('./pages/Voice/Voice'));
const VoiceAssignments = lazy(() => import('./pages/Voice/VoiceAssignments'));
const SampleCall = lazy(() => import('./pages/Call/SampleCall'));
const AdminProfile = lazy(() => import('./pages/Admin/AdminProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLogin />
      </Suspense>
    ),
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
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardHome />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: "user/create",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateUser />
          </Suspense>
        ),
      },
      {
        path: "users/:id/view",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ViewUser />
          </Suspense>
        ),
      },
      {
        path: "users/:id/edit",
        element: (
          <Suspense fallback={<PageLoader />}>
            <EditUser />
          </Suspense>
        ),
      },
      {
        path: "assistant",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Assistant />
          </Suspense>
        ),
      },
      {
        path: "assistants/create",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssistantCreate />
          </Suspense>
        ),
      },
      {
        path: "assistants/:id/view",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssistantView />
          </Suspense>
        ),
      },
      {
        path: "assistants/:id/edit",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssistantEdit />
          </Suspense>
        ),
      },
      {
        path: "phone-numbers",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PhoneNumberList />
          </Suspense>
        ),
      },
      {
        path: "phone-numbers-assign",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssignNumber />
          </Suspense>
        ),
      },
      {
        path: "voices",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Voice />
          </Suspense>
        ),
      },
      {
        path: "voice-assignments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <VoiceAssignments />
          </Suspense>
        ),
      },
      {
        path: "sample-call",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SampleCall />
          </Suspense>
        ),
      },
      {
        path: "admin/profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminProfile />
          </Suspense>
        ),
      },
   
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
];
