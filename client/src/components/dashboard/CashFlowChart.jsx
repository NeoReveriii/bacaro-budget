import { useEffect, useRef, useState } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

function startOfDay(d) { const v = new Date(d); v.setHours(0, 0, 0, 0); return v; }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addDays(d, n) { const v = new Date(d); v.setDate(v.getDate() + n); return v; }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function fmtLabel(d, mode) {
  return mode === 'month'
    ? d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function buildBuckets(transactions, range) {
  const nonTransfer = (transactions || []).filter(t => t.type === 'Income' || t.type === 'Expense');
  const dated = nonTransfer.map(t => ({ ...t, _d: new Date(t.dateoftrans ?? t.date) })).filter(t => !isNaN(t._d));

  const today = startOfDay(new Date());
  const latestDate = dated.length > 0 ? startOfDay(new Date(Math.max(...dated.map(t => t._d)))) : today;
  let mode = 'day', rangeStart = startOfDay(latestDate), rangeEnd = startOfDay(latestDate);

  if (range === 'weekly') { rangeStart = addDays(latestDate, -6); }
  else if (range === 'monthly') { rangeStart = startOfMonth(latestDate); }
  else if (range === 'last6months') { mode = 'month'; rangeStart = startOfMonth(addMonths(latestDate, -5)); rangeEnd = startOfMonth(latestDate); }
  else if (range === 'yearly') { mode = 'month'; rangeStart = startOfMonth(addMonths(latestDate, -11)); rangeEnd = startOfMonth(latestDate); }
  else if (range === 'all') {
    mode = 'month';
    const minDate = dated.length > 0 ? new Date(Math.min(...dated.map(t => t._d))) : latestDate;
    rangeStart = startOfMonth(minDate); rangeEnd = startOfMonth(latestDate);
  }

  const buckets = [];
  if (mode === 'month') {
    let cur = startOfMonth(rangeStart);
    while (cur <= rangeEnd) { buckets.push({ key: cur.toISOString(), date: new Date(cur), label: fmtLabel(cur, mode), delta: 0 }); cur = addMonths(cur, 1); }
  } else {
    if (Math.floor((rangeEnd - rangeStart) / 86400000) + 1 < 5) rangeStart = addDays(rangeEnd, -4);
    let cur = startOfDay(rangeStart);
    while (cur <= rangeEnd) { buckets.push({ key: cur.toISOString(), date: new Date(cur), label: fmtLabel(cur, mode), delta: 0 }); cur = addDays(cur, 1); }
  }

  const map = new Map(buckets.map(b => [b.key, b]));
  for (const t of dated) {
    const txDate = mode === 'month' ? startOfMonth(t._d) : startOfDay(t._d);
    if (txDate < rangeStart || txDate > rangeEnd) continue;
    const b = map.get(txDate.toISOString());
    if (b) b.delta += t.type === 'Income' ? Number(t.amount) : -Number(t.amount);
  }

  let running = 0;
  return { labels: buckets.map(b => b.label), values: buckets.map(b => { running += b.delta; return Number(running.toFixed(2)); }) };
}

export default function CashFlowChart({ transactions }) {
  const [range, setRange] = useState('monthly');
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { labels, values } = buildBuckets(transactions, range);
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    if (labels.length > 0) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Net Cash Flow', data: values,
            borderColor: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.14)',
            pointBackgroundColor: '#2ecc71', pointBorderColor: '#fff',
            pointRadius: 4, pointHoverRadius: 6, borderWidth: 3, fill: true, tension: 0.4,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `₱ ${ctx.parsed.y.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#666', font: { size: 11 } } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#666', font: { size: 11 }, callback: v => `₱${(v/1000).toFixed(0)}k` } },
          },
        },
      });
    }
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [transactions, range]);

  return (
    <div className="cash-flow-chart-container" style={{ marginTop: 25 }}>
      <div className="cash-flow-chart-header">
        <h3>Cash Flow Trend</h3>
        <select id="cash-flow-range" className="cash-flow-range-select" value={range} onChange={e => setRange(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="last6months">Last 6 Months</option>
          <option value="yearly">Yearly</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div id="cash-flow-chart-wrapper" className="loading-transition" style={{ height: 300, position: 'relative' }}>
        <canvas id="cash-flow-line-chart" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
