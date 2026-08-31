import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from './components/common/PageLoader';
import { ProtectedEducatorRoute } from './components/ProtectedEducatorRoute';
import { useAuth } from './hooks/useAuth';

// Lazy Loaded Pages for Performance & Fast Initial Chunk Loading
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const ExploreMaterialsPage = lazy(() => import('./pages/learning/ExploreMaterialsPage').then(m => ({ default: m.ExploreMaterialsPage })));
const StudyRoomPage = lazy(() => import('./pages/learning/StudyRoomPage').then(m => ({ default: m.StudyRoomPage })));
const StudyGroupPage = lazy(() => import('./pages/learning/StudyGroupPage').then(m => ({ default: m.StudyGroupPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ChatPage = lazy(() => import('./pages/social/ChatPage').then(m => ({ default: m.ChatPage })));
const ForumPage = lazy(() => import('./pages/social/ForumPage').then(m => ({ default: m.ForumPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUserManagement = lazy(() => import('./pages/admin/AdminUserManagement').then(m => ({ default: m.AdminUserManagement })));
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AdminAnnouncementsPage').then(m => ({ default: m.AdminAnnouncementsPage })));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage').then(m => ({ default: m.AnnouncementsPage })));
const EducatorDashboard = lazy(() => import('./pages/educator/EducatorDashboard').then(m => ({ default: m.EducatorDashboard })));
const EducatorContentManager = lazy(() => import('./pages/educator/EducatorContentManager').then(m => ({ default: m.EducatorContentManager })));
const EducatorContentEditor = lazy(() => import('./pages/educator/EducatorContentEditor').then(m => ({ default: m.EducatorContentEditor })));
const EducatorAnalyticsPage = lazy(() => import('./pages/educator/EducatorAnalyticsPage').then(m => ({ default: m.EducatorAnalyticsPage })));

function RoleBasedDashboard() {
  const { auth, isGuest, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Menyiapkan dashboard akun..." />;
  }

  if (isGuest || !auth) {
    return <Navigate to="/login" replace />;
  }

  if (auth.role === 'admin') {
    return <AdminDashboard />;
  }

  if (auth.role === 'educator') {
    return <EducatorDashboard />;
  }

  return <Dashboard />;
}

function ProtectedRoute({ children, allowedRoles }) {
  const { auth, isGuest, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Memeriksa hak akses..." />;
  }

  if (isGuest || !auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    if (auth.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (auth.role === 'educator') return <Navigate to="/educator/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<RoleBasedDashboard />} />
          
          <Route
            path="/learning/explore"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <ExploreMaterialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/study"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <StudyRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/study/:batchId"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <StudyRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:batchId"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <StudyRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning"
            element={<Navigate to="/learning/explore" replace />}
          />
          
          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <AnnouncementsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/study-group"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <StudyGroupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/study-group"
            element={<Navigate to="/study-group" replace />}
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <ForumPage />
              </ProtectedRoute>
            }
          />
          <Route path="/social/chat" element={<Navigate to="/chat" replace />} />
          <Route path="/social/forum" element={<Navigate to="/forum" replace />} />
          <Route path="/social" element={<Navigate to="/forum" replace />} />
          <Route path="/study" element={<Navigate to="/learning/study" replace />} />
          <Route path="/explore" element={<Navigate to="/learning/explore" replace />} />
          <Route path="/study-groups" element={<Navigate to="/study-group" replace />} />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnnouncementsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/educator/dashboard"
            element={
              <ProtectedEducatorRoute>
                <EducatorDashboard />
              </ProtectedEducatorRoute>
            }
          />
          
          <Route
            path="/educator/contents"
            element={
              <ProtectedEducatorRoute>
                <EducatorContentManager />
              </ProtectedEducatorRoute>
            }
          />
          
          <Route
            path="/educator/contents/create"
            element={
              <ProtectedEducatorRoute>
                <EducatorContentEditor />
              </ProtectedEducatorRoute>
            }
          />
          <Route path="/educator/contents/new" element={<Navigate to="/educator/contents/create" replace />} />
          
          <Route
            path="/educator/contents/edit"
            element={
              <ProtectedEducatorRoute>
                <EducatorContentEditor />
              </ProtectedEducatorRoute>
            }
          />

          <Route
            path="/educator/contents/edit/:contentId"
            element={
              <ProtectedEducatorRoute>
                <EducatorContentEditor />
              </ProtectedEducatorRoute>
            }
          />

          <Route
            path="/educator/analytics"
            element={
              <ProtectedEducatorRoute>
                <EducatorAnalyticsPage />
              </ProtectedEducatorRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
