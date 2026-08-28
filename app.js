const STORAGE_KEY='dsa-transfer-training-progress-v1';
let problems=[], progress={}, selectedId=null;
const el=id=>document.getElementById(id);

async function boot(){
  const [pRes,progRes]=await Promise.all([fetch('data/problems.json'),fetch('data/progress.json')]);
  problems=await pRes.json();
  const repoProgress=await progRes.json();
  const local=loadLocal();
  progress={...repoProgress,...local};
  selectedId=problems[0].id;
  bind(); render();
}
function loadLocal(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return {}}}
function saveLocal(){localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));renderMetrics();renderList()}
function bind(){
  ['kindFilter','statusFilter','search'].forEach(id=>el(id).addEventListener(id==='search'?'input':'change',renderList));
  el('randomBtn').addEventListener('click',()=>{const pool=filtered().filter(p=>(progress[p.id]?.status||'Unseen')==='Unseen');const src=pool.length?pool:filtered();if(!src.length)return;selectedId=src[Math.floor(Math.random()*src.length)].id;render();});
  el('exportBtn').addEventListener('click',exportProgress);
  el('importInput').addEventListener('change',importProgress);
}
function filtered(){const k=el('kindFilter').value,s=el('statusFilter').value,q=el('search').value.trim().toLowerCase();return problems.filter(p=>(k==='all'||p.kind===k)&&(s==='all'||(progress[p.id]?.status||'Unseen')===s)&&(!q||p.id.toLowerCase().includes(q)||p.title.toLowerCase().includes(q)))}
function render(){renderMetrics();renderList();renderDetail()}
function renderMetrics(){const vals=problems.map(p=>progress[p.id]||{});const attempted=vals.filter(x=>(x.status||'Unseen')!=='Unseen').length,ind=vals.filter(x=>x.status==='Solved independently').length,c3=vals.filter(x=>(+x.comfort||0)>=3).length,avg=vals.reduce((a,x)=>a+(+x.comfort||0),0)/problems.length;el('metrics').innerHTML=metric(`${attempted}/50`,'attempted')+metric(ind,'independent')+metric(c3,'comfort ≥3')+metric(avg.toFixed(1),'avg comfort')}
function metric(v,l){return `<div class="metric"><b>${v}</b><span>${l}</span></div>`}
function renderList(){const rows=filtered();el('problemList').innerHTML=rows.length?'':'<div class="empty">No matching problems.</div>';rows.forEach(p=>{const st=progress[p.id]||{};const b=document.createElement('button');b.className='problem-row'+(p.id===selectedId?' active':'');b.innerHTML=`<div class="row-top"><span>${p.id} · ${esc(p.title)}</span><span>${p.difficulty}</span></div><div class="row-meta">${p.kind==='core'?'Core disguised':'Composite'} · ${st.status||'Unseen'} · comfort ${st.comfort||0}/4</div>`;b.addEventListener('click',()=>{selectedId=p.id;render()});el('problemList').appendChild(b)})}
function renderDetail(){const p=problems.find(x=>x.id===selectedId)||problems[0];if(!p)return;const st=progress[p.id]||(progress[p.id]={status:'Unseen',comfort:0,reasoning:'',impasse:'',missed_transition:'',revisit:'',last_updated:''});const d=el('detail');d.innerHTML=`
<div class="meta">${p.id} · ${p.kind==='core'?'Core disguised':'Composite'} · ${p.difficulty}</div><h2>${esc(p.title)}</h2>
<div class="problem-box"><strong>Problem</strong><p>${esc(p.statement)}</p><div class="small"><b>Constraints:</b> ${esc(p.constraints)}</div></div>
<div class="grid2"><label class="field">Status<select id="editStatus">${['Unseen','Attempting','Solved independently','Solved with hint','Reviewed'].map(x=>`<option ${x===st.status?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Comfort<select id="editComfort">${[0,1,2,3,4].map(x=>`<option value="${x}" ${+st.comfort===x?'selected':''}>${x} — ${['blank','fragile','reconstruct slowly','comfortable','transferable'][x]}</option>`).join('')}</select></label></div>
<label class="field">My reasoning<textarea id="editReasoning" placeholder="Model, brute force, observations, invariants, candidate states...">${esc(st.reasoning||'')}</textarea></label>
<label class="field">Exact impasse<textarea id="editImpasse" placeholder="What exact reasoning transition could you not derive?">${esc(st.impasse||'')}</textarea></label>
<label class="field">Where I missed<textarea id="editMissed" placeholder="Fill after review: what move did the correct reasoning make that yours did not?">${esc(st.missed_transition||'')}</textarea></label>
<div class="grid2"><label class="field">Revisit date<input id="editRevisit" type="date" value="${esc(st.revisit||'')}" /></label><div></div></div>
<div class="actions"><button class="primary" id="saveBtn">Save in browser</button><button id="pivotBtn">Reveal reasoning pivot</button><a href="problems/${p.id}.md" target="_blank" rel="noopener">Open problem file</a></div>
<div id="pivotArea"></div><p class="small">Browser saves are convenient working state. Export <code>progress.json</code> periodically and commit it to GitHub so the repo remains the shared source of truth.</p>`;
  el('saveBtn').addEventListener('click',()=>{st.status=el('editStatus').value;st.comfort=+el('editComfort').value;st.reasoning=el('editReasoning').value;st.impasse=el('editImpasse').value;st.missed_transition=el('editMissed').value;st.revisit=el('editRevisit').value;st.last_updated=new Date().toISOString();saveLocal()});
  el('pivotBtn').addEventListener('click',()=>{const a=el('pivotArea');if(a.innerHTML){a.innerHTML='';el('pivotBtn').textContent='Reveal reasoning pivot'}else{a.innerHTML=`<div class="pivot"><div class="small">INTENDED COVERAGE</div><strong>${esc(p.coverage)}</strong><p>${esc(p.pivot)}</p><div class="small"><b>Target:</b> ${esc(p.target)}</div></div>`;el('pivotBtn').textContent='Hide reasoning pivot'}})
}
function exportProgress(){const blob=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function importProgress(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const incoming=JSON.parse(r.result);progress={...progress,...incoming};saveLocal();render()}catch{alert('Invalid progress JSON')}};r.readAsText(f)}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
boot().catch(err=>{document.body.innerHTML='<main class="shell"><h1>Could not load tracker</h1><p>'+esc(err.message)+'</p></main>'});
