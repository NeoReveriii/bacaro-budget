import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiDeleteGoal, apiGetGoals } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function GoalGrid() {
  const { goals, setGoals, openModal, setFundingGoalId, showToast, showConfirm, showCoinLoader, hideCoinLoader } = useApp();

  const handleDelete = (goal) => {
    showConfirm('Delete Goal', `Are you sure you want to delete the goal "${goal.title}"?`, async () => {
      showCoinLoader('DELETING GOAL...');
      try {
        await apiDeleteGoal(goal.goal_id);
        setGoals(await apiGetGoals());
        showToast('Goal deleted successfully');
      } catch (err) { showToast(err.message, 'error'); }
      finally { hideCoinLoader(); }
    });
  };

  const handleAddFunds = (goalId) => {
    setFundingGoalId(goalId);
    openModal('addFunds');
  };

  return (
    <main id="main-goals">
      <div className="wallet-actions-bar">
        <button className="btn-wallet-action add" onClick={() => openModal('addGoal')}>
          <span className="icon"><PlusCircle size={16} /></span> Add New Goal
        </button>
      </div>

      {(!goals || goals.length === 0) ? (
        <div className="wallet-grid goal-grid-container loading-transition" id="goal-grid-container">
          <p style={{ gridColumn: '1 / -1', color: '#666', textAlign: 'center' }}>No savings goals found. Add one to start tracking your progress.</p>
        </div>
      ) : (
        <div className="wallet-grid goal-grid-container loading-transition" id="goal-grid-container">
          {goals.map(g => {
            const target = Number(g.target_amount || 0);
            const current = Number(g.current_amount || 0);
            const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0);
            const deadlineStr = g.deadline ? `Target Date: ${new Date(g.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}` : '';

            return (
              <div key={g.goal_id} className="goal-card">
                <button className="card-delete-btn" onClick={() => handleDelete(g)}>×</button>
                <h3>{g.title}</h3>
                <div className="goal-deadline">{deadlineStr}</div>
                <div className="goal-amounts">
                  <span className="goal-current">{formatCurrency(current)}</span>
                  <span className="goal-target">{formatCurrency(target)}</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="goal-actions">
                  <button className="btn-add-funds" onClick={() => handleAddFunds(g.goal_id)}>Add Funds</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
