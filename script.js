const UNITS = ['unidad1', 'unidad2', 'unidad3', 'unidad4'];
let currentUnit = 'unidad1';

/* ── Cambiar tab dentro de una card ─────────────── */
function switchTab(clickedBtn) {
  const card   = clickedBtn.closest('.card');
  const tabs   = card.querySelectorAll('.tab-btn');
  const panels = card.querySelectorAll('.tab-panel');
  const idx    = Array.from(tabs).indexOf(clickedBtn);

  tabs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
    t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  panels.forEach((p, i) => p.classList.toggle('active', i === idx));
}

/* ── Mostrar una unidad ──────────────────────────── */
function showUnit(id) {
  currentUnit = id;

  /* Cards */
  document.querySelectorAll('.card').forEach(c => c.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = 'flex';

  /* Nav header */
  document.querySelectorAll('nav a[data-unit]').forEach(a => {
    a.classList.toggle('active', a.dataset.unit === id);
  });

  /* Barra de acciones */
  updateActionBar();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Barra de acciones ───────────────────────────── */
function updateActionBar() {
  const idx  = UNITS.indexOf(currentUnit);
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');
  const comp = document.getElementById('btn-complete');

  if (prev) prev.disabled = idx === 0;
  if (next) next.disabled = idx === UNITS.length - 1;

  /* Estado de "completada" */
  if (comp) refreshCompleteBtn(comp);
}

function refreshCompleteBtn(btn) {
  const done = isDone(currentUnit);
  btn.classList.toggle('done', done);
  btn.innerHTML = done
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> Completada`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> Marcar como completada`;

  /* Badge en el header de la card */
  const badge = document.querySelector(`#${currentUnit} .card-complete-badge`);
  if (badge) badge.classList.toggle('visible', done);
}

function isDone(id) {
  try { return localStorage.getItem('done_' + id) === '1'; } catch { return false; }
}

/* ── Toggle completada ───────────────────────────── */
function toggleComplete() {
  const done = isDone(currentUnit);
  try {
    if (done) localStorage.removeItem('done_' + currentUnit);
    else      localStorage.setItem('done_' + currentUnit, '1');
  } catch { /* localStorage no disponible */ }
  refreshCompleteBtn(document.getElementById('btn-complete'));

  /* Feedback visual momentáneo */
  if (!done) {
    const btn = document.getElementById('btn-complete');
    btn.style.transform = 'scale(1.04)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
}

/* ── Navegación anterior / siguiente ────────────── */
function goUnit(delta) {
  const idx = UNITS.indexOf(currentUnit);
  const next = UNITS[idx + delta];
  if (next) showUnit(next);
}

/* ── Imprimir / guardar PDF ─────────────────────── */
function printUnit() {
  window.print();
}

/* ── Init ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showUnit('unidad1');
});
