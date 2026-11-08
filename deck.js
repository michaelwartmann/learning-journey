// Slide viewer: scroll mode with notes, plus a full-screen present mode.
// A personal page sets window.PAGE='code' and window.OWN=['02','08']: those slides come from p-code-NN
const PAGE = (window.PAGE || '').toLowerCase().replace(/[^a-z0-9]/g,'');
const OWN = PAGE ? (window.OWN || ['08']) : [];
const SLIDES = ['01-cover','02-ladder','03-anki','04-problem','05-speed','06-people','07-trip','08-thanks']
  .map(id=>OWN.includes(id.slice(0,2)) ? `p-${PAGE}-${id.slice(0,2)}` : id);
const deck = document.getElementById('deck');
let lang = (location.hash === '#en') ? 'en' : 'zh';
let cache = {};          // lang -> [{html, notes}]
let audioOk = {};        // "lang/NN" -> bool
const player = new Audio();
let queue = [], playingBtn = null;

function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

async function load(l){
  if(cache[l]) return cache[l];
  if(l==='zh'){
    const d = await (await fetch('slides/zh.json',{cache:'no-cache'})).json();
    for(const id of SLIDES.filter(x=>x.startsWith('p-'))){ try{ d.push(await (await fetch(`slides/zh-${id}.json`,{cache:'no-cache'})).json()); }catch(e){} }
    const byId = Object.fromEntries(d.map(s=>[s.id,s]));
    return cache[l] = SLIDES.map((id,i)=>byId[id]||d[i]).map(s=>({html:s.html, notes:s.notes, bullets:s.bullets}));
  }
  const out = await Promise.all(SLIDES.map(async id=>{
    const t = await (await fetch(`slides/${l}/${id}.html`,{cache:'no-cache'})).text();
    const doc = new DOMParser().parseFromString(t,'text/html');
    const sec = doc.querySelector('section');
    const aside = sec.querySelector('aside'); const notes = aside ? aside.textContent.trim() : '';
    if(aside) aside.remove();
    return {html: sec.outerHTML, notes};
  }));
  return cache[l] = out;
}

function notesHTML(l, notes, bullets){
  if(l==='zh' && bullets && bullets.length) return '<p class="cue">我想说的（关键词）</p><ul class="bullets">'+bullets.map(b=>`<li>${b}</li>`).join('')+'</ul>';
  if(l==='en') return notes.split(/\n\s*\n/).map(p=>`<p class="para"><span class="en" style="color:#222">${esc(p.trim())}</span></p>`).join('');
  return notes.map(p=>`<p class="para"><span class="hz">${p.hz}</span><span class="py">${esc(p.py)}</span><span class="en">${esc(p.en)}</span></p>`).join('');
}

// Stroke-order animations: <div class="hw" data-char="学">
function initWriters(root){
  if(!window.HanziWriter) return;
  root.querySelectorAll('.hw:not([data-done])').forEach(el=>{
    el.dataset.done='1';
    const size=parseInt(el.style.width)||180;
    try{ HanziWriter.create(el, el.dataset.char, {width:size,height:size,padding:6,strokeColor:'#1A1D2B',radicalColor:'#B8322A',showOutline:true,strokeAnimationSpeed:1,delayBetweenStrokes:250}).loopCharacterAnimation(); }catch(e){}
  });
}
window.initWritersAll=()=>{ initWriters(deck); initWriters(show); };
function fit(wrap){
  const st = wrap.querySelector('.stage'); const w = wrap.clientWidth, h = wrap.clientHeight;
  const s = Math.min(w/1920, h/1080);
  st.style.transform = `scale(${s})`;
  st.style.left = ((w-1920*s)/2)+'px'; st.style.top = ((h-1080*s)/2)+'px';
}
function fitAll(){ document.querySelectorAll('.stagewrap').forEach(fit); if(!show.hidden) fit(document.querySelector('.showstage')); }

async function checkAudio(l,i){
  const k = `${l}/${String(i+1).padStart(2,'0')}`;
  if(k in audioOk) return audioOk[k];
  try{ const r = await fetch(`audio/${k}.mp3`,{method:'HEAD'}); audioOk[k] = r.ok; }catch(e){ audioOk[k]=false; }
  return audioOk[k];
}
function src(l,i){ return `audio/${l}/${String(i+1).padStart(2,'0')}.mp3`; }
function setBtn(b,on){ if(b) b.textContent = on ? '❚❚ Pause' : '🔊 Listen'; }
function playSlide(i, btn){
  if(playingBtn===btn && !player.paused){ player.pause(); setBtn(btn,false); queue=[]; return; }
  setBtn(playingBtn,false);
  player.src = src(lang,i); playingBtn = btn;
  player.play().then(()=>setBtn(btn,true)).catch(()=>setBtn(btn,false));
}
player.addEventListener('ended',()=>{
  setBtn(playingBtn,false); playingBtn=null;
  const n = queue.shift(); if(n!=null){ const el=document.getElementById('s'+n); el.scrollIntoView({behavior:'smooth'}); playSlide(n, el.querySelector('.listen')); }
});

async function render(){
  document.body.classList.toggle('lang-en', lang==='en');
  document.documentElement.lang = lang==='en' ? 'en' : 'zh-Hans';
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on', b.dataset.lang===lang));
  const data = await load(lang);
  deck.innerHTML = '';
  data.forEach((s,i)=>{
    const row = document.createElement('article'); row.className='slide'; row.id='s'+i;
    row.innerHTML = `<div class="stagewrap"><div class="stage">${s.html}</div></div>
      <div class="notes"><div class="num">${lang==='en'?'Slide':'第'} ${i+1}${lang==='en'?' of 8':' 张 / 8'}</div>
      <div class="bar"></div>${notesHTML(lang,s.notes,s.bullets)}</div>`;
    deck.appendChild(row);
    checkAudio(lang,i).then(ok=>{ if(!ok) return; const b=document.createElement('button'); b.className='btn small listen'; b.textContent='🔊 Listen'; b.onclick=()=>{queue=[];playSlide(i,b);}; row.querySelector('.bar').appendChild(b); updatePlayAll(); });
  });
  requestAnimationFrame(fitAll);
  initWriters(deck);
  updatePlayAll();
}
function updatePlayAll(){
  const any = SLIDES.some((_,i)=>audioOk[`${lang}/${String(i+1).padStart(2,'0')}`]);
  document.getElementById('playall').hidden = !any;
}
document.getElementById('playall').onclick=()=>{
  const idx = SLIDES.map((_,i)=>i).filter(i=>audioOk[`${lang}/${String(i+1).padStart(2,'0')}`]);
  if(!idx.length) return; queue = idx.slice(1);
  const el=document.getElementById('s'+idx[0]); el.scrollIntoView({behavior:'smooth'}); playSlide(idx[0], el.querySelector('.listen'));
};

document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{ lang=b.dataset.lang; history.replaceState(null,'',lang==='en'?'#en':'#zh'); player.pause(); render(); });
document.querySelectorAll('[data-layer]').forEach(b=>{ document.body.classList.toggle('hide-'+b.dataset.layer, !b.classList.contains('on')); b.onclick=()=>{ b.classList.toggle('on'); document.body.classList.toggle('hide-'+b.dataset.layer, !b.classList.contains('on')); }; });
// Tap a character on touch screens to show its pinyin
document.addEventListener('click',e=>{ const h=e.target.closest('.h'); document.querySelectorAll('.h.tap').forEach(x=>{ if(x!==h) x.classList.remove('tap'); }); if(h) h.classList.toggle('tap'); });

// Present mode
const show = document.getElementById('show'); let cur = 0;
function showSlide(i){
  cur = Math.max(0, Math.min(SLIDES.length-1, i));
  const st = show.querySelector('.stage'); st.innerHTML = cache[lang][cur].html;
  document.getElementById('count').textContent = `${cur+1} / ${SLIDES.length}`;
  const a = document.getElementById('showaudio'); a.hidden = !audioOk[`${lang}/${String(cur+1).padStart(2,'0')}`];
  fit(document.querySelector('.showstage'));
  initWriters(show);
}
document.getElementById('present').onclick=()=>{ show.hidden=false; const v=[...document.querySelectorAll('.slide')].findIndex(s=>s.getBoundingClientRect().bottom>80); showSlide(v<0?0:v); if(show.requestFullscreen) show.requestFullscreen().catch(()=>{}); };
document.getElementById('close').onclick=()=>{ show.hidden=true; player.pause(); if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); };
document.getElementById('prev').onclick=()=>showSlide(cur-1);
document.getElementById('next').onclick=()=>showSlide(cur+1);
document.getElementById('showaudio').onclick=()=>{ player.src=src(lang,cur); player.play().catch(()=>{}); };
document.addEventListener('keydown',e=>{ if(show.hidden) return; if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();showSlide(cur+1);} if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();showSlide(cur-1);} if(e.key==='Escape') document.getElementById('close').click(); });
let tx=null; show.addEventListener('touchstart',e=>tx=e.touches[0].clientX); show.addEventListener('touchend',e=>{ if(tx==null) return; const dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>40) showSlide(cur+(dx<0?1:-1)); tx=null; });
document.addEventListener('fullscreenchange',()=>setTimeout(fitAll,50));
window.addEventListener('resize',fitAll);
render();
