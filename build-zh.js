// Builds site/slides/zh.json: slide HTML and notes with per-character pinyin spans for hover.
const fs=require('fs'), path=require('path');
const {pinyin}=require('pinyin-pro');
const dir=process.argv[2], out=process.argv[3];
const HAN=/[㐀-鿿]/;
function wrapRun(run){
  const py=pinyin(run,{type:'array'});
  let s='';
  [...run].forEach((ch,i)=>{
    let p=py[i];
    if(ch==='儿' && i>0 && HAN.test(run[i-1]) && /一点|一块|一会|这|那|哪|玩|事/.test(run.slice(Math.max(0,i-2),i))) p='r';
    s+=`<span class="h" data-p="${p}">${ch}</span>`;
  });
  return s;
}
function wrapText(t){ return t.replace(/[㐀-鿿]+/g, wrapRun); }
function wrapHtml(html){ // only text outside tags, and never inside <svg>
  return html.split(/(<svg[\s\S]*?<\/svg>)/).map(part=>part.startsWith('<svg')?part:part.replace(/(>|^)([^<]+)(?=<|$)/g,(m,a,txt)=>a+wrapText(txt))).join('');
}
const bullets=JSON.parse(fs.readFileSync(path.join(dir,'..','zh-bullets.json'),'utf8'));
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.html')).sort();
const res=files.map(f=>{
  let h=fs.readFileSync(path.join(dir,f),'utf8');
  const am=h.match(/<aside>([\s\S]*?)<\/aside>/); const notes=am?am[1].trim():'';
  h=h.replace(/<aside>[\s\S]*?<\/aside>\s*/,'');
  const paras=notes.split(/\n\s*\n/).map(p=>{const [hz,py,en]=p.trim().split('\n'); return {hz:wrapText(hz||''),py:py||'',en:en||''};});
  const id=f.replace('.html','');
  return {id, html:wrapHtml(h.trim()), notes:paras, bullets:(bullets[id]||[]).map(wrapText)};
});
// page-specific last slides go into their own small files, so the shared file never lists them
const own=r=>/^08-/.test(r.id)&&r.id!=='08-thanks';
const shared=res.filter(r=>!own(r));
res.filter(own).forEach(r=>fs.writeFileSync(path.join(path.dirname(out),'zh-'+r.id+'.json'),JSON.stringify(r)));
fs.writeFileSync(out, JSON.stringify(shared));
console.log(files.length,'slides', fs.statSync(out).size,'bytes');
