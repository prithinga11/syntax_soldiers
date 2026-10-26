(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const KEY = 'moneymood_v1';
  const CAT_COLORS = {
    Food: '#ff9ebc',
    Shopping: '#b9a7ff',
    Transport: '#7fd6ff',
    Bills: '#ffb98a',
    Entertainment: '#ffd966',
    Health: '#7fe0b8',
    Other: '#cdbfdd',
  };
  const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const $ = (id) => document.getElementById(id);
  const money = (n) => fmt.format(Math.round(Number(n) || 0));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };
  const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const icons = () => window.lucide && window.lucide.createIcons();

  /* ---------- state + LocalStorage ---------- */
  const defaults = () => ({
    income: 60000,
    savings: 10000,
    transactions: [
      { id: uid(), name: 'Rent', amount: 15000, category: 'Bills', date: daysAgo(20) },
      { id: uid(), name: 'Groceries', amount: 4200, category: 'Food', date: daysAgo(14) },
      { id: uid(), name: 'Online shopping', amount: 3500, category: 'Shopping', date: daysAgo(12) },
      { id: uid(), name: 'Metro & cabs', amount: 1800, category: 'Transport', date: daysAgo(10) },
      { id: uid(), name: 'Streaming plans', amount: 650, category: 'Entertainment', date: daysAgo(8) },
      { id: uid(), name: 'Electricity bill', amount: 1900, category: 'Bills', date: daysAgo(6) },
      { id: uid(), name: 'Dinner out', amount: 1450, category: 'Food', date: daysAgo(4) },
      { id: uid(), name: 'Pharmacy', amount: 800, category: 'Health', date: daysAgo(3) },
      { id: uid(), name: 'Sneakers', amount: 3999, category: 'Shopping', date: daysAgo(1) },
    ],
    goals: [
      { id: uid(), name: 'Emergency fund', target: 100000, current: 35000 },
      { id: uid(), name: 'New laptop', target: 80000, current: 22000 },
    ],
  });

  const load = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && Array.isArray(raw.transactions) && Array.isArray(raw.goals)) {
        return {
          income: Number(raw.income) || 0,
          savings: Number(raw.savings) || 0,
          transactions: raw.transactions,
          goals: raw.goals,
        };
      }
    } catch (e) { /* fall through to defaults */ }
    return defaults();
  };
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  };

  const state = load();
  save();

  /* ---------- calculations ---------- */
  const totalExpenses = () => state.transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const byCategory = () => {
    const out = {};
    state.transactions.forEach((t) => { out[t.category] = (out[t.category] || 0) + Number(t.amount || 0); });
    return out;
  };

  /* ---------- toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  };

  /* ---------- dashboard ---------- */
  let spendChart;

  function renderStats() {
    const exp = totalExpenses();
    const remaining = state.income - exp - state.savings;
    $('statIncome').textContent = money(state.income);
    $('statExpenses').textContent = money(exp);
    $('statSavings').textContent = money(state.savings);
    const r = $('statRemaining');
    r.textContent = money(remaining);
    r.classList.toggle('neg', remaining < 0);
  }

  function renderChart() {
    const cats = byCategory();
    const labels = Object.keys(cats).filter((k) => cats[k] > 0);
    const data = labels.map((k) => cats[k]);
    const has = data.length > 0;
    $('chartEmpty').hidden = has;
    $('spendChart').style.display = has ? 'block' : 'none';
    if (!has) return;

    const colors = labels.map((k) => CAT_COLORS[k] || '#94a3b8');
    if (!spendChart) {
      spendChart = new Chart($('spendChart'), {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }] },
        options: {
          maintainAspectRatio: false,
          cutout: '66%',
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { family: 'Nunito', size: 12 } } },
            tooltip: { callbacks: { label: (c) => ` ${c.label}: ${money(c.parsed)}` } },
          },
        },
      });
    } else {
      spendChart.data.labels = labels;
      spendChart.data.datasets[0].data = data;
      spendChart.data.datasets[0].backgroundColor = colors;
      spendChart.update();
    }
  }

  function renderTx() {
    const list = $('txList');
    const items = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
    if (!items.length) {
      list.innerHTML = '<li class="empty">No transactions yet.</li>';
      return;
    }
    list.innerHTML = items
      .map(
        (t) => `
      <li>
        <span class="tx-dot" style="background:${CAT_COLORS[t.category] || '#94a3b8'}">${esc(t.category.charAt(0))}</span>
        <div class="tx-info"><b>${esc(t.name)}</b><span>${esc(t.category)} · ${fmtDate(t.date)}</span></div>
        <span class="tx-amt">−${money(t.amount)}</span>
        <button class="icon-btn" data-del-tx="${t.id}" aria-label="Delete ${esc(t.name)}" title="Delete">×</button>
      </li>`
      )
      .join('');
  }

  /* ---------- goals ---------- */
  function renderGoals() {
    const box = $('goalList');
    if (!state.goals.length) {
      box.innerHTML = '<p class="empty">No goals yet. Create your first one above.</p>';
      return;
    }
    box.innerHTML = state.goals
      .map((g) => {
        const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
        const done = g.current >= g.target;
        const left = Math.max(0, g.target - g.current);
        let eta = '';
        if (done) eta = 'Goal reached!';
        else if (state.savings > 0) eta = `~${Math.ceil(left / state.savings)} mo at ${money(state.savings)}/mo`;
        else eta = `${money(left)} to go`;
        return `
        <div class="goal">
          <div class="goal-top">
            <b>${esc(g.name)}</b>
            <button class="icon-btn" data-del-goal="${g.id}" aria-label="Delete goal ${esc(g.name)}" title="Delete">×</button>
          </div>
          <div class="goal-meta"><span>${money(g.current)} of ${money(g.target)}</span><span>${eta}</span></div>
          <div class="bar"><i class="${done ? 'done' : ''}" style="width:${pct}%"></i></div>
          <div class="goal-bottom">
            <span class="goal-pct">${pct}% completed</span>
            <div class="goal-add">
              <input type="number" min="1" placeholder="Add ₹" data-add-input="${g.id}" aria-label="Add amount to ${esc(g.name)}" />
              <button type="button" data-add-goal="${g.id}">Add</button>
            </div>
          </div>
        </div>`;
      })
      .join('');
  }

  function renderAll() {
    renderStats();
    renderChart();
    renderTx();
    renderGoals();
    icons();
  }

  /* ---------- hero inputs ---------- */
  $('incomeInput').value = state.income;
  $('savingsInput').value = state.savings;
  $('incomeInput').addEventListener('input', (e) => {
    state.income = Math.max(0, Number(e.target.value) || 0);
    save();
    renderStats();
    renderGoals();
  });
  $('savingsInput').addEventListener('input', (e) => {
    state.savings = Math.max(0, Number(e.target.value) || 0);
    save();
    renderStats();
    renderGoals();
  });

  /* ---------- add expense ---------- */
  $('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('expName').value.trim();
    const amount = Number($('expAmount').value);
    const category = $('expCategory').value;
    const err = $('expError');

    if (!name) return (err.textContent = 'Please enter an expense name.');
    if (!$('expAmount').value || !Number.isFinite(amount) || amount <= 0)
      return (err.textContent = 'Enter an amount greater than 0.');
    if (amount > 10000000) return (err.textContent = 'That amount looks too large.');

    err.textContent = '';
    state.transactions.push({ id: uid(), name, amount, category, date: new Date().toISOString() });
    save();
    renderAll();
    e.target.reset();
    toast(`Added ${money(amount)} to ${category}`);
  });

  $('txList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del-tx]');
    if (!btn) return;
    state.transactions = state.transactions.filter((t) => t.id !== btn.dataset.delTx);
    save();
    renderAll();
  });

  /* ---------- goals actions ---------- */
  $('goalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('goalName').value.trim();
    const target = Number($('goalTarget').value);
    const currentRaw = $('goalCurrent').value;
    const current = currentRaw === '' ? 0 : Number(currentRaw);
    const err = $('goalError');

    if (!name) return (err.textContent = 'Give your goal a name.');
    if (!$('goalTarget').value || !Number.isFinite(target) || target <= 0)
      return (err.textContent = 'Target must be greater than 0.');
    if (!Number.isFinite(current) || current < 0) return (err.textContent = 'Saved amount cannot be negative.');

    err.textContent = '';
    state.goals.push({ id: uid(), name, target, current });
    save();
    renderGoals();
    e.target.reset();
    toast(`Goal "${name}" created`);
  });

  $('goalList').addEventListener('click', (e) => {
    const del = e.target.closest('[data-del-goal]');
    if (del) {
      state.goals = state.goals.filter((g) => g.id !== del.dataset.delGoal);
      save();
      renderGoals();
      return;
    }
    const add = e.target.closest('[data-add-goal]');
    if (add) {
      const id = add.dataset.addGoal;
      const input = $('goalList').querySelector(`[data-add-input="${id}"]`);
      const amt = Number(input.value);
      if (!Number.isFinite(amt) || amt <= 0) {
        input.focus();
        return toast('Enter an amount to add');
      }
      const g = state.goals.find((x) => x.id === id);
      if (g) g.current += amt;
      save();
      renderGoals();
      toast(`Added ${money(amt)} to your goal`);
    }
  });

  /* ---------- FUTURE ME simulator ---------- */
  const S = {
    income: $('sIncome'),
    shopping: $('sShopping'),
    other: $('sOther'),
    savings: $('sSavings'),
    extra: $('sExtra'),
  };
  let futureChart;

  const setSlider = (el, val) => {
    val = Math.max(0, Math.round(val));
    if (val > Number(el.max)) el.max = Math.ceil(val / 1000) * 1000;
    el.value = val;
  };
  const setFill = (el) => {
    const pct = ((el.value - el.min) / (el.max - el.min || 1)) * 100;
    el.style.setProperty('--fill', pct + '%');
  };

  function updateSim() {
    const income = Number(S.income.value);
    const shop = Number(S.shopping.value);
    const other = Number(S.other.value);
    const sav = Number(S.savings.value);
    const extra = Number(S.extra.value);
    Object.values(S).forEach(setFill);

    $('vIncome').textContent = money(income);
    $('vShopping').textContent = money(shop);
    $('vOther').textContent = money(other);
    $('vSavings').textContent = money(sav);
    $('vExtra').textContent = '+' + money(extra);

    // Remaining balance = Income − Expenses − Savings
    const remaining = income - (shop + other) - sav;
    $('simRemaining').textContent = money(remaining);
    $('simRemainingBox').classList.toggle('neg', remaining < 0);
    $('simWarn').textContent =
      remaining < 0
        ? `Overspending by ${money(-remaining)}. Cut expenses or savings.`
        : remaining === 0
        ? 'Every rupee is assigned.'
        : `You keep ${money(remaining)} free each month.`;

    // Projections
    $('pMonthly').textContent = money(sav);
    $('p3').textContent = money(sav * 3);
    $('p6').textContent = money(sav * 6);
    $('p12').textContent = money(sav * 12);

    // Extra saving comparison
    const base12 = sav * 12;
    const with12 = (sav + extra) * 12;
    $('cBase').textContent = money(base12);
    $('cExtra').textContent = money(with12);
    $('cGain').textContent = '+' + money(with12 - base12);

    let msg;
    if (extra === 0) {
      msg = 'Slide "extra each month" to see how a small change builds up over a year.';
    } else {
      msg = `Saving an extra ${money(extra)} a month grows your 12-month savings from ${money(base12)} to ${money(with12)}.`;
      if (extra > Math.max(remaining, 0)) {
        msg += ` Heads up: that is more than your free balance of ${money(Math.max(remaining, 0))}.`;
      }
    }
    $('compareMsg').textContent = msg;

    // Chart
    const labels = ['Now'];
    const baseLine = [0];
    const extraLine = [0];
    for (let m = 1; m <= 12; m++) {
      labels.push('M' + m);
      baseLine.push(sav * m);
      extraLine.push((sav + extra) * m);
    }
    if (!futureChart) {
      futureChart = new Chart($('futureChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'With extra',
              data: extraLine,
              borderColor: '#ff6fa5',
              backgroundColor: 'rgba(255,111,165,0.18)',
              fill: true,
              tension: 0.35,
              pointRadius: 0,
              pointHoverRadius: 5,
              borderWidth: 3,
            },
            {
              label: 'Current plan',
              data: baseLine,
              borderColor: '#a99bd0',
              borderDash: [6, 6],
              fill: false,
              tension: 0.35,
              pointRadius: 0,
              pointHoverRadius: 5,
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, font: { family: 'Nunito', size: 12 } } },
            tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${money(c.parsed.y)}` } },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { callback: (v) => (v >= 1000 ? '₹' + v / 1000 + 'k' : '₹' + v) } },
          },
        },
      });
    } else {
      futureChart.data.labels = labels;
      futureChart.data.datasets[0].data = extraLine;
      futureChart.data.datasets[1].data = baseLine;
      futureChart.update();
    }
  }

  function syncFromDashboard() {
    const cats = byCategory();
    const shopping = cats.Shopping || 0;
    const other = totalExpenses() - shopping;
    setSlider(S.income, state.income);
    setSlider(S.shopping, shopping);
    setSlider(S.other, other);
    setSlider(S.savings, state.savings);
    updateSim();
  }

  Object.values(S).forEach((el) => el.addEventListener('input', updateSim));
  $('syncBtn').addEventListener('click', () => {
    syncFromDashboard();
    toast('Simulator synced with your dashboard');
  });
  $('applyBtn').addEventListener('click', () => {
    state.income = Number(S.income.value);
    state.savings = Number(S.savings.value);
    $('incomeInput').value = state.income;
    $('savingsInput').value = state.savings;
    save();
    renderAll();
    toast('Income and savings applied to dashboard');
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- init ---------- */
  renderAll();
  syncFromDashboard();
  setSlider(S.extra, 2000);
  updateSim();
  icons();
})();