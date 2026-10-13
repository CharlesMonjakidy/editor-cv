/* Gestion du formulaire et des sections dynamiques. */
/* Remplit les champs simples avec les données déjà enregistrées. */
function fillStatic() {
  document.querySelectorAll('[data-k]').forEach(i => i.value = S[i.dataset.k] || '');
}
function renderLists() {
  ['exp', 'edu'].forEach(k => {
    $('#' + k).innerHTML = S[k].map((it, n) => `
      <div class="element-dynamique">
        <button type="bouton" class="bouton-supprimer" data-del="${k}:${n}" aria-label="Supprimer">✕</button>
        <label>Intitulé <input data-l="${k}:${n}:role" value="${esc(it.role)}"></label>
        <div class="ligne-champs">
          <label>Lieu <input data-l="${k}:${n}:org" value="${esc(it.org)}"></label>
          <label>Dates <input data-l="${k}:${n}:dates" value="${esc(it.dates)}" placeholder="2024 – 2025"></label>
        </div>
        <label>Description <textarea rows="2" data-l="${k}:${n}:desc">${esc(it.desc)}</textarea></label>
      </div>`).join('');
  });
}

/* Écoute les saisies, les boutons Ajouter/Supprimer et la photo. */
$('#form').addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.k) S[t.dataset.k] = t.value;
  if (t.dataset.l) { const [k, n, f] = t.dataset.l.split(':'); S[k][n][f] = t.value; }
  render();
});
document.addEventListener('click', e => {
  const t = e.target;
  if (t.dataset.add) { S[t.dataset.add].push({role:'',org:'',dates:'',desc:''}); renderLists(); render(); }
  if (t.dataset.del) { const [k, n] = t.dataset.del.split(':'); S[k].splice(n, 1); renderLists(); render(); }
  if (t.dataset.tpl) { S.tpl = t.dataset.tpl; render(); }
});
$('#reset').addEventListener('click', () => {
  if (!confirm('Effacer tout le CV ?')) return;
  S = structuredClone(blank); fillStatic(); renderLists(); render();
});
$('#photo').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { S.photo = r.result; render(); };
  r.readAsDataURL(f);
});
bindStorage(); fillStatic(); renderLists(); render();
