/* Gestion du thème et des effets visuels de l’application. */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const b = document.getElementById('theme'); if (b) b.textContent = t === 'dark' ? '☀️' : '🌙';
}
function currentTheme() {
  try { return (JSON.parse(localStorage.getItem('cv-editor-v1')) || {}).theme || 'dark'; } catch (e) { return 'dark'; }
}
document.getElementById('theme')?.addEventListener('click', () => {
  const t = currentTheme() === 'dark' ? 'light' : 'dark';
  try { const o = JSON.parse(localStorage.getItem('cv-editor-v1')) || {}; o.theme = t; localStorage.setItem('cv-editor-v1', JSON.stringify(o)); } catch (e) {}
  if (typeof S !== 'undefined') S.theme = t;
  applyTheme(t);
});
applyTheme(currentTheme());

/* Projecteur lumineux qui suit la souris */
document.addEventListener('mousemove', e => {
  const s = e.target.closest?.('.projecteur'); if (!s) return;
  const r = s.getBoundingClientRect();
  s.style.setProperty('--mx', e.clientX - r.left + 'px'); s.style.setProperty('--my', e.clientY - r.top + 'px');
});

/* Apparition au défilement */
const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && (x.target.classList.add('in'), io.unobserve(x.target))), { threshold: .15 });
document.querySelectorAll('.apparition').forEach(el => io.observe(el));

/* Machine à écrire (accueil) */
const ty = document.getElementById('type');
if (ty) {
  const words = ['en direct', 'en 2 minutes', 'qui se démarque', 'sur mobile'];
  let w = 0, c = 0, del = false;
  (function tick() {
    const full = words[w];
    ty.textContent = full.slice(0, c += del ? -1 : 1);
    let d = del ? 40 : 90;
    if (!del && c === full.length) { del = true; d = 1400; }
    else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 350; }
    setTimeout(tick, d);
  })();
}

/* Effet 3D sur la maquette */
const vis = document.querySelector('.zone-visuelle'), mock = document.querySelector('.maquette');
if (vis && mock && matchMedia('(hover:hover)').matches) {
  vis.addEventListener('mousemove', e => {
    const r = vis.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    mock.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  vis.addEventListener('mouseleave', () => mock.style.transform = '');
}

/* Aperçu CV adapté à la largeur de l'écran */
function fitPreview() {
  const st = document.querySelector('.zone-apercu'), cv = document.getElementById('apercu-cv'); if (!st || !cv) return;
  const s = Math.min(1, st.clientWidth / 794);
  cv.style.transform = `scale(${s})`;
  cv.style.marginLeft = Math.max(0, (st.clientWidth - 794 * s) / 2) + 'px';
  st.style.height = cv.offsetHeight * s + 'px';
}
addEventListener('resize', fitPreview);
fitPreview();
