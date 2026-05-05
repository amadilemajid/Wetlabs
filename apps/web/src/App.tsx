import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Spinner } from '@components/ui/Spinner';
import { ToastProvider } from '@components/feedback/ToastProvider';

const LoginPage     = lazy(() => import('@features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const FieldFormPage = lazy(() => import('@features/field-form/FieldFormPage').then(m => ({ default: m.FieldFormPage })));
const MapOnlyPage   = lazy(() => import('@pages/MapOnlyPage').then(m => ({ default: m.MapOnlyPage })));
const PrototypePage = lazy(() => import('@pages/PrototypePage').then(m => ({ default: m.PrototypePage })));
const ConfirmationPage = lazy(() => import('@pages/ConfirmationPage').then(m => ({ default: m.ConfirmationPage })));
const AdminUsersPage = lazy(() => import('@pages/admin/AdminUsersPage').then(m => ({ default: m.default })));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: false } },
});

const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-canvas">
    <Spinner className="w-8 h-8" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"         element={<Navigate to="/dashboard" replace />} />
              <Route path="/login"     element={<LoginPage />} />
              <Route path="/map"       element={<MapOnlyPage />} />
              <Route path="/report"    element={<FieldFormPage />} />
              <Route path="/prototype" element={<PrototypePage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="*"          element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
