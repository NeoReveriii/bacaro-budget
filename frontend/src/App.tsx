import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import Wallets from './pages/Wallets';
import SavingsGoals from './pages/SavingsGoals';

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-center">
      <h1 className="text-h1 font-h1 text-primary mb-4">{title}</h1>
      <p className="text-slate-500">This module is under construction.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/goals" element={<SavingsGoals />} />
          <Route path="/kwarta-ai" element={<Placeholder title="Kwarta AI" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
