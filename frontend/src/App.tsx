import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { JoinOrganizationForm } from './components/auth/JoinOrganizationForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { DashboardLayout } from './components/layout/dashboard-layout';
import { Toaster } from './components/ui/sonner';
import {
  Dashboard,
  Chat,
  Orders,
  Products,
  Customers,
  Campaigns,
  Transactions,
  Wallet,
  CreateTemplate,
} from './components/pages';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function DashboardApp() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract current page from URL path
  const currentPage = location.pathname.slice(1) || 'dashboard';

  // Navigation function that updates URL
  const setCurrentPage = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <OrganizationProvider>
      <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/campaigns" element={<Campaigns setCurrentPage={setCurrentPage} />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route
            path="/create-template"
            element={<CreateTemplate onBack={() => setCurrentPage('campaigns')} />}
          />
        </Routes>
      </DashboardLayout>
    </OrganizationProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/join-organization" element={<JoinOrganizationForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          
          {/* Protected Routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
