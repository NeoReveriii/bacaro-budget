import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import GuestPage from './pages/GuestPage';
import DashboardPage from './pages/DashboardPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginModal from './components/auth/LoginModal';
import SignupModal from './components/auth/SignupModal';
import ForgotModal from './components/auth/ForgotModal';
import TransactionModal from './components/transactions/TransactionModal';
import AddWalletModal from './components/wallets/AddWalletModal';
import TransferModal from './components/wallets/TransferModal';
import AddGoalModal from './components/goals/AddGoalModal';
import AddFundsModal from './components/goals/AddFundsModal';
import Toast from './components/ui/Toast';
import CoinLoader from './components/ui/CoinLoader';
import ConfirmDialog from './components/ui/ConfirmDialog';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <GuestPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals */}
      <LoginModal />
      <SignupModal />
      <ForgotModal />
      <TransactionModal />
      <AddWalletModal />
      <TransferModal />
      <AddGoalModal />
      <AddFundsModal />

      {/* Global UI */}
      <Toast />
      <CoinLoader />
      <ConfirmDialog />
    </AppProvider>
  );
}

export default AppRoutes;
