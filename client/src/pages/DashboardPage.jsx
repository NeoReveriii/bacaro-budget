import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import AccountDrawer from '../components/layout/AccountDrawer';
import StatCards from '../components/dashboard/StatCards';
import IncomeSummary from '../components/dashboard/IncomeSummary';
import DoughnutChart from '../components/dashboard/DoughnutChart';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import WalletGrid from '../components/wallets/WalletGrid';
import WalletDetails from '../components/wallets/WalletDetails';
import GoalGrid from '../components/goals/GoalGrid';
import KwartaAI from '../components/ai/KwartaAI';
import SettingsView from '../components/settings/SettingsView';
import { apiGetTransactions, apiGetWallets, apiGetGoals } from '../lib/api';
import { filterTransactionsByRange } from '../lib/utils';

export default function DashboardPage() {
  const { transactions, setTransactions, wallets, setWallets, goals, setGoals, openModal, setEditingTransaction, dashRange } = useApp();
  const { user } = useAuth();

  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [txFilters, setTxFilters] = useState({ search: '', type: 'all', wallet: 'all', date: 'all' });
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [tx, w, g] = await Promise.all([apiGetTransactions(), apiGetWallets(), apiGetGoals()]);
      setTransactions(tx);
      setWallets(w);
      setGoals(g);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
    setSelectedWallet(null);
  };

  const handleNewTransaction = () => {
    setEditingTransaction(null);
    openModal('transaction');
    setSidebarOpen(false);
  };

  const handleEditTransaction = (row) => {
    setEditingTransaction(row);
    openModal('transaction');
  };

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setCurrentView('walletDetail');
  };

  const dashFiltered = filterTransactionsByRange(dashRange, transactions);

  return (
    <div className="app-container">
      <Header onMenuClick={() => setSidebarOpen(o => !o)} onProfileClick={() => setDrawerOpen(true)} />

      <div className="main-layout">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          onNewTransaction={handleNewTransaction}
          isOpen={sidebarOpen}
        />

        <div className="content-area" id="main-content">
          {currentView === 'dashboard' && (
            <div id="view-dashboard">
              {loading ? (
                <div style={{ textAlign: 'center', paddingTop: 60, color: '#666' }}>Loading...</div>
              ) : (
                <>
                  <StatCards transactions={transactions} />
                  <div className="dashboard-panels">
                    <div className="panel-income"><IncomeSummary transactions={dashFiltered} /></div>
                    <div className="panel-chart"><DoughnutChart transactions={dashFiltered} /></div>
                  </div>
                  <CashFlowChart transactions={transactions} />
                </>
              )}
            </div>
          )}

          {currentView === 'transactions' && (
            <div id="view-transactions">
              <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h2>Transactions</h2>
                <button className="btn btn-primary" onClick={handleNewTransaction}>+ New</button>
              </div>
              <TransactionFilters filters={txFilters} onFilterChange={setTxFilters} />
              <TransactionList transactions={transactions} filters={txFilters} onEdit={handleEditTransaction} />
            </div>
          )}

          {currentView === 'wallets' && <WalletGrid onWalletClick={handleWalletClick} />}

          {currentView === 'walletDetail' && selectedWallet && (
            <WalletDetails wallet={selectedWallet} transactions={transactions} onBack={() => { setSelectedWallet(null); setCurrentView('wallets'); }} />
          )}

          {currentView === 'goals' && <GoalGrid />}
          {currentView === 'ai' && <KwartaAI />}
          {currentView === 'settings' && <SettingsView />}
        </div>
      </div>

      <AccountDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
