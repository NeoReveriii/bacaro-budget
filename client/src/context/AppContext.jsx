import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  // Modal state
  const [activeModal, setActiveModal] = useState(null); // 'login'|'signup'|'forgot'|'transaction'|'addWallet'|'transfer'|'addGoal'|'addFunds'|'confirm'
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [fundingGoalId, setFundingGoalId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null); // { title, message, onConfirm, onCancel }

  // Toast
  const [toast, setToast] = useState(null); // { message, type }

  // Coin loader
  const [coinLoader, setCoinLoader] = useState(null); // string | null

  // Dashboard filter
  const [dashRange, setDashRange] = useState('ALL TIME');

  const openModal = useCallback((name) => setActiveModal(name), []);
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setEditingTransaction(null);
    setFundingGoalId(null);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm, onCancel) => {
    setConfirmConfig({ title, message, onConfirm, onCancel });
    setActiveModal('confirm');
  }, []);

  const showCoinLoader = useCallback((text = 'PROCESSING...') => setCoinLoader(text), []);
  const hideCoinLoader = useCallback(() => setCoinLoader(null), []);

  return (
    <AppContext.Provider value={{
      wallets, setWallets,
      transactions, setTransactions,
      goals, setGoals,
      activeModal, openModal, closeModal,
      editingTransaction, setEditingTransaction,
      fundingGoalId, setFundingGoalId,
      confirmConfig, setConfirmConfig,
      toast, showToast,
      coinLoader, showCoinLoader, hideCoinLoader,
      dashRange, setDashRange,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
