import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const COLORS = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fab1a0'];

export default function DoughnutChart({ transactions }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const expenseData = (transactions || []).filter(t => t.type === 'Expense');
    const categories = {};
    expenseData.forEach(t => {
      const label = t.wallet_type || 'Other';
      categories[label] = (categories[label] || 0) + Number(t.amount);
    });
    const labels = Object.keys(categories);
    const amounts = Object.values(categories);

    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    if (amounts.length > 0) {
      const isDark = document.body.classList.contains('dark-mode');
      chartRef.current = new Chart(canvasRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data: amounts, backgroundColor: COLORS, borderWidth: 0 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 }, color: isDark ? '#edf1ee' : '#1a241b' } } },
        },
      });
    }
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [transactions]);

  const hasData = (transactions || []).some(t => t.type === 'Expense');

  return (
    <div id="chart-summary-container">
      <h3 style={{ marginBottom: 15, fontFamily: "'Times New Roman', serif" }}>Expense Breakdown</h3>
      {hasData ? (
        <div id="dashboard-chart-wrapper" className="loading-transition" style={{ height: 250, position: 'relative' }}>
          <canvas id="dashboard-doughnut-chart" ref={canvasRef}></canvas>
        </div>
      ) : (
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.9em' }}>
          No expense data to display.
        </div>
      )}
    </div>
  );
}
