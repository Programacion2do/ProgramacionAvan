/* ── Configuración de unidades ──────────────────────── */
const UNITS = [
  { id: 'clases',       num: 1, title: 'Clases y Objetos'  },
  { id: 'agregacion',   num: 2, title: 'Agregación'         },
  { id: 'arraylist',    num: 3, title: 'ArrayList'          },
  { id: 'herencia',     num: 4, title: 'Herencia'           },
  { id: 'polimorfismo', num: 5, title: 'Polimorfismo'       },
  { id: 'interfaces',   num: 6, title: 'Interfaces'         },
  { id: 'javaweb',      num: 7, title: 'JavaWeb'            },
  { id: 'mvc',          num: 8, title: 'MVC'                },
  { id: 'conexion-bd',  num: 9, title: 'Conexión BD'        },
];

let currentUnit = null;

/* ── Mostrar página de inicio ───────────────────────── */
function showHome() {
  currentUnit = null;
  document.getElementById('home-view').style.display  = 'block';
  document.getElementById('unit-view').style.display  = 'none';
  document.querySelectorAll('nav a[data-unit]').forEach(a => a.classList.remove('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Cargar una unidad ──────────────────────────────── */
async function showUnit(id) {
  currentUnit = id;

  // Ocultar home, mostrar unit-view
  document.getElementById('home-view').style.display = 'none';
  document.getElementById('unit-view').style.display = 'block';

  // Nav activo
  document.querySelectorAll('nav a[data-unit]').forEach(a => {
    a.classList.toggle('active', a.dataset.unit === id);
  });

  // Mostrar spinner mientras carga
  const container = document.getElementById('unit-container');
  container.innerHTML = '<div class="unit-loading"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Cargando…</span></div>';

  try {
    const res = await fetch(`unidades/${id}.html`);
    if (!res.ok) throw new Error('not found');
    const html = await res.text();
    container.innerHTML = html;
  } catch {
    const unit = UNITS.find(u => u.id === id);
    const label = unit ? `Unidad ${unit.num} — ${unit.title}` : id;
    container.innerHTML = `
      <div class="card-header">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="card-meta">
          <span class="card-unit">${label}</span>
          <h2 class="card-title">Próximamente</h2>
        </div>
      </div>
      <div class="coming-soon-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <h3>Contenido no disponible aún</h3>
        <p>Este tema se habilitará cuando se dicte en clase.</p>
      </div>`;
  }

  updateActionBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Barra de acciones ──────────────────────────────── */
function updateActionBar() {
  const ids  = UNITS.map(u => u.id);
  const idx  = ids.indexOf(currentUnit);
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');
  if (prev) prev.disabled = idx <= 0;
  if (next) next.disabled = idx < 0 || idx >= ids.length - 1;
  const comp = document.getElementById('btn-complete');
  if (comp) refreshCompleteBtn(comp);
}

function goUnit(delta) {
  const ids  = UNITS.map(u => u.id);
  const next = ids[ids.indexOf(currentUnit) + delta];
  if (next) showUnit(next);
}

/* ── Completada ─────────────────────────────────────── */
function refreshCompleteBtn(btn) {
  const done = isDone(currentUnit);
  btn.classList.toggle('done', done);
  btn.innerHTML = done
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> Completada`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> Marcar como completada`;
  const badge = document.querySelector('#unit-container .card-complete-badge');
  if (badge) badge.classList.toggle('visible', done);
}

function isDone(id) {
  try { return localStorage.getItem('done_' + id) === '1'; } catch { return false; }
}

function toggleComplete() {
  const done = isDone(currentUnit);
  try {
    if (done) localStorage.removeItem('done_' + currentUnit);
    else      localStorage.setItem('done_' + currentUnit, '1');
  } catch {}
  refreshCompleteBtn(document.getElementById('btn-complete'));
  if (!done) {
    const btn = document.getElementById('btn-complete');
    btn.style.transform = 'scale(1.04)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
}

/* ── Tabs y subtemas ────────────────────────────────── */
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

function switchSub(clickedPill) {
  const panel = clickedPill.closest('.tab-panel');
  const pills  = panel.querySelectorAll('.sub-pill');
  const idx    = Array.from(pills).indexOf(clickedPill);
  pills.forEach((p, i) => p.classList.toggle('active', i === idx));
  panel.querySelectorAll('.sub-content').forEach((sc, i) => sc.classList.toggle('active', i === idx));
}

/* ── Imprimir ───────────────────────────────────────── */
function printUnit() { window.print(); }

/* ── Init ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', showHome);
