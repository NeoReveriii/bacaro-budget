const fs = require('fs');
let html = fs.readFileSync('e:/GitHub/bacarov2/.stitch/designs/transactions_v2.html', 'utf8');

html = html.replace(
  '<div class="col-span-5 relative">',
  '<div class="col-span-3 relative">'
);

const typeFilter = `<div class="col-span-2">
<select class="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-medium focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all">
<option>All Types</option>
<option>Expense</option>
<option>Income</option>
<option>Transfer</option>
</select>
</div>
<div class="col-span-2">
<select class="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-medium focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all">
<option>All Wallets</option>`;

html = html.replace(
  `<div class="col-span-2">
<select class="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl text-body-sm text-on-surface font-medium focus:ring-2 focus:ring-primary-container/20 focus:border-primary outline-none transition-all">
<option>All Wallets</option>`,
  typeFilter
);

const times = ['08:15 AM', '10:42 AM', '01:30 PM', '04:55 PM', '07:20 PM', '11:10 AM', '09:05 AM', '03:45 PM'];
html = html.replace(/<td class="px-6 py-5 text-body-sm font-medium text-slate-500">(.*?)<\/td>/g, (match, p1) => {
    const t = times.shift() || '12:00 PM';
    return `<td class="px-6 py-5">
<p class="text-body-sm font-bold text-slate-700">${p1}</p>
<p class="text-[11px] font-medium text-slate-400 mt-0.5">${t}</p>
</td>`;
});

fs.writeFileSync('e:/GitHub/bacarov2/.stitch/designs/transactions_v2.html', html);
console.log('Done!');
