import { formatCurrency } from '../../lib/utils';

export default function IncomeSummary({ transactions }) {
  const incomeItems = (transactions || []).filter(t => String(t.type || '').toLowerCase() === 'income').slice(0, 5);

  return (
    <div id="income-summary-container">
      <h3 style={{ marginBottom: 15, fontFamily: "'Times New Roman', serif" }}>Income Summary</h3>
      <div id="income-summary-list" className="loading-transition">
        {incomeItems.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic', padding: 10 }}>No income records found.</p>
        ) : (
          incomeItems.map((t, i) => (
            <div key={t.trans_id || i} className="income-summary-item">
              <span className="income-summary-desc">{t.description}</span>
              <span className="income-summary-amount">+ {formatCurrency(t.amount)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
