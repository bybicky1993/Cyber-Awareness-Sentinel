(() => {
  const SUPABASE_URL = 'https://saeeoeawbohuvoxrneoq.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_W65bUF7vt26vZdvMR0M8pQ_h-w1ZfYZ';
  const endpoint = `${SUPABASE_URL}/rest/v1/Result`;
  const storageKey = 'cybersentinel-progress';

  const getState = () => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return { completed: [], name: '', forceNo: '', rank: '', unit: '', scores: {}, feedback: '', ...saved, scores: saved.scores || {} };
  };
  const saveState = data => localStorage.setItem(storageKey, JSON.stringify(data));
  const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };

  async function request(url, options = {}) {
    const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    if (!response.ok) throw new Error(await response.text() || `Supabase request failed (${response.status})`);
    return response.status === 204 ? null : response.json();
  }

  window.syncCompletion = async () => {
    const data = getState();
    const completed = data.completed.filter(id => id.startsWith('m')).length;
    if (completed < 9 || data.supabaseResultId || !data.name || !data.forceNo || !data.rank || !data.unit) return;
    const total = 9;
    const record = {
      name: data.name,
      force_no: data.forceNo,
      rank: data.rank,
      unit: data.unit,
      score: completed,
      total,
      percentage: Math.round((completed / total) * 100),
      feedback: data.feedback || '',
      completion_time: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    try {
      const saved = await request(endpoint, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(record) });
      data.supabaseResultId = saved?.[0]?.id;
      data.completionTime = record.completion_time;
      data.supabaseSaved = true;
      saveState(data);
      if (location.hash === '#review') refreshResults();
    } catch (error) {
      data.supabaseError = error.message;
      saveState(data);
      console.error('CyberSentinel completion could not be saved:', error);
    }
  };

  async function saveFeedback() {
    const text = document.querySelector('#comment')?.value.trim();
    const output = document.querySelector('#out');
    if (!text) { output.innerHTML = '<div class="result warn">Please enter feedback before saving.</div>'; return; }
    const data = getState();
    data.feedback = text;
    saveState(data);
    await window.syncCompletion();
    if (!data.supabaseSaved) {
      output.innerHTML = '<div class="result warn">Feedback will be sent after all nine modules are completed.</div>';
      return;
    }
    try {
      const filter = data.supabaseResultId ? `id=eq.${encodeURIComponent(data.supabaseResultId)}` : `force_no=eq.${encodeURIComponent(data.forceNo)}&completion_time=eq.${encodeURIComponent(data.completionTime)}`;
      await request(`${endpoint}?${filter}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ feedback: text }) });
      output.innerHTML = '<div class="result good">Feedback saved to Supabase.</div>';
      refreshResults();
    } catch (error) {
      output.innerHTML = `<div class="result bad">Feedback could not be saved: ${escapeHtml(error.message)}</div>`;
    }
  }

  async function refreshResults() {
    const container = document.querySelector('#supabase-results');
    if (!container) return;
    try {
      const rows = await request(`${endpoint}?select=name,force_no,rank,unit,score,total,percentage,feedback,completion_time,created_at&order=created_at.desc&limit=100`);
      if (!rows.length) { container.innerHTML = '<p class="muted">No completed trainee records yet.</p>'; return; }
      container.innerHTML = `<div style="overflow:auto"><table><thead><tr><th>Name</th><th>Force No</th><th>Rank</th><th>Unit</th><th>Score</th><th>Percentage</th><th>Completed</th><th>Feedback</th></tr></thead><tbody>${rows.map(row => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.force_no)}</td><td>${escapeHtml(row.rank)}</td><td>${escapeHtml(row.unit)}</td><td>${escapeHtml(row.score)}/${escapeHtml(row.total)}</td><td>${escapeHtml(row.percentage)}%</td><td>${escapeHtml(row.completion_time || row.created_at)}</td><td>${escapeHtml(row.feedback)}</td></tr>`).join('')}</tbody></table></div>`;
    } catch (error) {
      container.innerHTML = `<div class="result bad">Supabase records could not be loaded: ${escapeHtml(error.message)}</div>`;
    }
  }

  function renderReview() {
    if (location.hash !== '#review') return;
    const main = document.querySelector('#content');
    main.innerHTML = `<section class="hero"><span class="badge">SUPABASE DATABASE</span><h1>Review & feedback</h1><p class="lead">Completed trainee records are loaded directly from Supabase.</p><div class="card"><h2>Completed trainee records</h2><div id="supabase-results" class="muted">Loading records…</div></div><div class="card"><h2>Feedback</h2><label>Feedback<textarea id="comment" rows="5" placeholder="What worked well or what should improve?"></textarea></label><button data-action="supabase-feedback">Save feedback</button><div id="out"></div></div></section>`;
    refreshResults();
  }

  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'profile') {
      const data = getState();
      data.forceNo = document.querySelector('#forceNo')?.value.trim() || '';
      data.rank = document.querySelector('#rank')?.value.trim() || '';
      data.unit = document.querySelector('#unit')?.value.trim() || '';
      saveState(data);
    }
    if (action === 'supabase-feedback') saveFeedback();
  });
  addEventListener('hashchange', () => setTimeout(renderReview, 0));
  setTimeout(() => { renderReview(); window.syncCompletion(); }, 0);
})();
