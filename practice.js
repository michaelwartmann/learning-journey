// Practice Room: original HSK 3-level items, modelled on the paper's parts.
const SETS = [
{
  id:'listen', kind:'listen',
  kicker:'Listening · Parts 2–3 style',
  title:'Listen for the exact word',
  intro:'Press ▶ to hear the sentence with your device\'s Chinese voice. Before you listen, read the statement or the three options, and listen for those words. Options that only share a sound are often traps.',
  items:[
    {say:['我每天晚上十点睡觉，早上六点起床，所以白天很有精神。'], q:'★ 他睡得很晚。', opts:[['√','correct'],['×','wrong']], a:'×',
     py:'Wǒ měi tiān wǎnshang shí diǎn shuìjiào, zǎoshang liù diǎn qǐchuáng, suǒyǐ báitiān hěn yǒu jīngshen. ★ Tā shuì de hěn wǎn.',
     en:'I go to bed at ten every night and get up at six, so I have lots of energy during the day. ★ He goes to bed late. (No: ten o\'clock.)'},
    {say:['这个周末我不能跟你们去爬山了，我妈妈生病了，我得回家看看她。'], q:'★ 他这个周末要回家。', opts:[['√','correct'],['×','wrong']], a:'√',
     py:'Zhège zhōumò wǒ bù néng gēn nǐmen qù páshān le, wǒ māma shēngbìng le, wǒ děi huí jiā kànkan tā. ★ Tā zhège zhōumò yào huí jiā.',
     en:'I can\'t go hiking with you this weekend; my mum is ill and I have to go home to see her. ★ He is going home this weekend.'},
    {say:['去火车站可以坐公共汽车，也可以坐地铁，地铁比公共汽车快一点儿。'], q:'★ 坐公共汽车比较快。', opts:[['√','correct'],['×','wrong']], a:'×',
     py:'Qù huǒchēzhàn kěyǐ zuò gōnggòng qìchē, yě kěyǐ zuò dìtiě, dìtiě bǐ gōnggòng qìchē kuài yìdiǎnr. ★ Zuò gōnggòng qìchē bǐjiào kuài.',
     en:'You can take the bus or the metro to the station; the metro is a bit faster than the bus. ★ The bus is faster.'},
    {say:['女：你的行李箱怎么这么小？','男：我只去两天，带的东西不多。','问：男的为什么带小行李箱？'], q:'问：男的为什么带小行李箱？',
     opts:[['A','东西不多'],['B','箱子太旧了'],['C','他要坐飞机']], a:'A',
     py:'Nǚ: Nǐ de xínglixiāng zěnme zhème xiǎo? Nán: Wǒ zhǐ qù liǎng tiān, dài de dōngxi bù duō. Wèn: Nán de wèishénme dài xiǎo xínglixiāng?',
     en:'W: Why is your suitcase so small? M: I\'m only going for two days and not taking much. Q: Why does the man take a small suitcase? (B 太旧 is a sound trap for 太小.)'},
    {say:['男：明天的会你能参加吗？','女：不行，我明天请假了，要去医院检查一下身体。','问：女的明天要做什么？'], q:'问：女的明天要做什么？',
     opts:[['A','去开会'],['B','去医院'],['C','去上班']], a:'B',
     py:'Nán: Míngtiān de huì nǐ néng cānjiā ma? Nǚ: Bù xíng, wǒ míngtiān qǐngjià le, yào qù yīyuàn jiǎnchá yíxià shēntǐ. Wèn: Nǚ de míngtiān yào zuò shénme?',
     en:'M: Can you come to tomorrow\'s meeting? W: No, I\'ve taken the day off; I\'m going to the hospital for a check-up. Q: What will the woman do tomorrow?'},
  ]
},
{
  id:'match', kind:'match',
  kicker:'Reading Part 1 style',
  title:'Match the sentence to its reply',
  intro:'Each reply is used once, and one is left over. Method: before reading the replies, name what the sentence does (asks for a number? a reason? a yes/no guess?). A reply that only shares a word with the question is often a trap.',
  bank:[
    ['A','别生气，路上车太多了，我也没办法。','Bié shēngqì, lùshang chē tài duō le, wǒ yě méi bànfǎ.','Don\'t be angry, the traffic was terrible, I couldn\'t help it.'],
    ['B','不是，我刚跑步回来，有点儿热。','Bú shì, wǒ gāng pǎobù huílai, yǒudiǎnr rè.','No, I\'ve just come back from a run; I\'m a bit hot.'],
    ['C','我们三个人，有没有安静一点儿的地方？','Wǒmen sān ge rén, yǒu méiyǒu ānjìng yìdiǎnr de dìfang?','There are three of us. Is there somewhere a bit quieter?'],
    ['D','超市旁边就有一个，走五分钟就到。','Chāoshì pángbiān jiù yǒu yí ge, zǒu wǔ fēnzhōng jiù dào.','There\'s one right next to the supermarket, five minutes\' walk.'],
    ['E','好的，那我试试小一号的。','Hǎo de, nà wǒ shìshi xiǎo yí hào de.','OK, then I\'ll try one size smaller.'],
    ['F','我已经吃过了，你们先吃吧。','Wǒ yǐjīng chīguo le, nǐmen xiān chī ba.','I\'ve already eaten, you go ahead.'],
  ],
  items:[
    {q:'您好，请问几位？', a:'C', py:'Nín hǎo, qǐngwèn jǐ wèi?', en:'Hello, how many people? → 几位 asks for a number of people.'},
    {q:'你怎么才来？电影都开始二十分钟了。', a:'A', py:'Nǐ zěnme cái lái? Diànyǐng dōu kāishǐ èrshí fēnzhōng le.', en:'Why are you only coming now? The film started twenty minutes ago. → 怎么才 asks for a reason or an excuse.'},
    {q:'这条裙子你穿着有点儿大，换一条吧？', a:'E', py:'Zhè tiáo qúnzi nǐ chuānzhe yǒudiǎnr dà, huàn yì tiáo ba?', en:'This skirt is a bit big on you. Try another one? → a suggestion: agree or refuse.'},
    {q:'你的脸怎么这么红？发烧了吗？', a:'B', py:'Nǐ de liǎn zěnme zhème hóng? Fāshāo le ma?', en:'Why is your face so red? Do you have a fever? → a yes/no guess; 不是 can only answer a guess.'},
    {q:'你知道附近哪儿有银行吗？', a:'D', py:'Nǐ zhīdào fùjìn nǎr yǒu yínháng ma?', en:'Do you know where there\'s a bank nearby? → 哪儿 asks for a place.'},
  ]
},
{
  id:'gap', kind:'gap',
  kicker:'Reading Part 2 style',
  title:'Fill the gap: word type first',
  intro:'Six words, five gaps. Method: before reading the sentences, mark each word as noun, verb, adjective or measure word. Then look at the slot: 这___ + noun needs a measure word, 非常___ needs an adjective. Tap “Show word types” to check your marking.',
  bank:[['A','认真','adj'],['B','习惯','v'],['C','双','mw'],['D','检查','v'],['E','满意','adj'],['F','附近','n']],
  items:[
    {q:'他学习非常（　），每天都复习到很晚。', a:'A', py:'Tā xuéxí fēicháng rènzhēn, měi tiān dōu fùxí dào hěn wǎn.', en:'He studies very conscientiously and reviews until late every day. → 非常___ : adjective. Both A and E are adjectives; the meaning decides.'},
    {q:'这（　）运动鞋是我上个月在网上买的。', a:'C', py:'Zhè shuāng yùndòngxié shì wǒ shàng ge yuè zài wǎngshang mǎi de.', en:'I bought this pair of trainers online last month. → 这___ + noun: measure word.'},
    {q:'我刚来中国的时候，还不（　）吃这么辣的菜。', a:'B', py:'Wǒ gāng lái Zhōngguó de shíhou, hái bù xíguàn chī zhème là de cài.', en:'When I\'d just come to China, I wasn\'t used to such spicy food. → 不___ + verb phrase: 习惯 (be used to).'},
    {q:'考完以后，最好再（　）一遍答案。', a:'D', py:'Kǎo wán yǐhòu, zuìhǎo zài jiǎnchá yí biàn dá\'àn.', en:'After the exam, it\'s best to check the answers once more. → 再___ 一遍: verb.'},
    {q:'我家（　）有一个公园，晚上很多人去那儿跳舞。', a:'F', py:'Wǒ jiā fùjìn yǒu yí ge gōngyuán, wǎnshang hěn duō rén qù nàr tiàowǔ.', en:'There\'s a park near my home; lots of people dance there in the evening. → place + ___ + 有: a place noun.'},
  ]
},
{
  id:'read', kind:'choice',
  kicker:'Reading Part 3 style',
  title:'Short passages',
  intro:'Read the passage, then answer the question marked ★. The answer is usually said in other words, so look for the idea, not the same characters.',
  items:[
    {q:'我以前觉得汉字特别难，一个字要写很多遍才记得住。后来老师告诉我，很多汉字都可以分成几个小部分，先了解这些部分，再记整个字，就容易多了。<br>★ 老师的意思是：',
     opts:[['A','汉字要多写几遍'],['B','先了解汉字的几个小部分'],['C','说汉语比写汉字容易']], a:'B',
     py:'Wǒ yǐqián juéde Hànzì tèbié nán, yí ge zì yào xiě hěn duō biàn cái jì de zhù. Hòulái lǎoshī gàosu wǒ, hěn duō Hànzì dōu kěyǐ fēnchéng jǐ ge xiǎo bùfen, xiān liǎojiě zhèxiē bùfen, zài jì zhěng ge zì, jiù róngyì duō le.',
     en:'I used to find characters really hard; I had to write one many times before it stuck. Then my teacher told me many characters can be split into a few small parts: learn the parts first, then the whole character, and it gets much easier.'},
    {q:'小王每天早上六点起床，先去公园跑半个小时步，然后回家洗澡、吃早饭。他说，运动以后一整天都很有精神。<br>★ 小王为什么早上去跑步？',
     opts:[['A','跑步以后很有精神'],['B','公园离他家很近'],['C','他早上没有时间吃饭']], a:'A',
     py:'Xiǎo Wáng měi tiān zǎoshang liù diǎn qǐchuáng, xiān qù gōngyuán pǎo bàn ge xiǎoshí bù, ránhòu huí jiā xǐzǎo, chī zǎofàn. Tā shuō, yùndòng yǐhòu yì zhěng tiān dōu hěn yǒu jīngshen.',
     en:'Xiao Wang gets up at six every morning, runs in the park for half an hour, then goes home to shower and have breakfast. He says that after exercise he has energy all day.'},
    {q:'这家饭馆的菜不但好吃，而且很便宜，所以每到周末，门口都有很多人在等位子。如果你想去，最好早点儿去。<br>★ 周末去这家饭馆，可能：',
     opts:[['A','菜比较贵'],['B','要等位子'],['C','人很少']], a:'B',
     py:'Zhè jiā fànguǎn de cài búdàn hǎochī, érqiě hěn piányi, suǒyǐ měi dào zhōumò, ménkǒu dōu yǒu hěn duō rén zài děng wèizi. Rúguǒ nǐ xiǎng qù, zuìhǎo zǎo diǎnr qù.',
     en:'This restaurant\'s food is not only tasty but cheap, so every weekend lots of people wait for a table at the door. If you want to go, better go early.'},
  ]
},
{
  id:'order', kind:'order',
  kicker:'Writing Part 1 style',
  title:'Build the sentence',
  intro:'Tap the pieces in the right order. Rule of thumb: time, place and “with whom” go before the verb; 了, the amount and the result go after it.',
  items:[
    {parts:['手机','他','忘在出租车上了','把'], a:['他把手机忘在出租车上了'], py:'Tā bǎ shǒujī wàng zài chūzūchē shang le.', en:'He left his phone in the taxi. (把 + object + verb + where)'},
    {parts:['被','我的蛋糕','吃完了','妹妹'], a:['我的蛋糕被妹妹吃完了'], py:'Wǒ de dàngāo bèi mèimei chī wán le.', en:'My cake was eaten up by my little sister. (被 + who did it + verb + result)'},
    {parts:['冷多了','昨天','今天','比'], a:['今天比昨天冷多了'], py:'Jīntiān bǐ zuótiān lěng duō le.', en:'Today is much colder than yesterday. (A 比 B + adjective + 多了)'},
    {parts:['一个小时','我们','在公园里','走了'], a:['我们在公园里走了一个小时'], py:'Wǒmen zài gōngyuán li zǒu le yí ge xiǎoshí.', en:'We walked in the park for an hour. (place before the verb, duration after it)'},
    {parts:['都','他','中文广播','每天晚上','听半个小时'], a:['他每天晚上都听半个小时中文广播','每天晚上他都听半个小时中文广播'], py:'Tā měi tiān wǎnshang dōu tīng bàn ge xiǎoshí Zhōngwén guǎngbō.', en:'Every evening he listens to Chinese radio for half an hour. (time before 都, duration between verb and object)'},
  ]
},
{
  id:'pinyin', kind:'pinyin',
  kicker:'Writing Part 2 style',
  title:'Pinyin to character',
  intro:'Type (or hand-write, then type) the character for the pinyin in brackets. On the real paper this is handwritten from memory, and almost all the characters come from HSK 1–2.',
  items:[
    {pre:'我们一起去看',pin:'diàn',post:'影吧。',a:'电',en:'Let\'s go and see a film together.'},
    {pre:'这个问题太',pin:'nán',post:'了，我不会。',a:'难',en:'This question is too hard; I can\'t do it.'},
    {pre:'她每天骑自行',pin:'chē',post:'去上班。',a:'车',en:'She cycles to work every day.'},
    {pre:'请你',pin:'děng',post:'我一下，我马上来。',a:'等',en:'Please wait for me a moment; I\'ll be right there.'},
    {pre:'今天天',pin:'qì',post:'很好，我们去爬山吧。',a:'气',en:'The weather is lovely today; let\'s go hiking.'},
  ]
},
];

// ---------- rendering ----------
const $ = (t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!=null) e.innerHTML=h; return e;};
const root=document.getElementById('sets');

let zhVoice=null;
function loadVoice(){ const v=speechSynthesis.getVoices(); zhVoice=v.find(x=>/zh[-_]CN/i.test(x.lang))||v.find(x=>/^zh/i.test(x.lang))||null; }
if('speechSynthesis' in window){ loadVoice(); speechSynthesis.onvoiceschanged=loadVoice; }
function speak(lines){
  if(!('speechSynthesis' in window)){ alert('Your browser has no speech voice. Use Help to read the transcript.'); return; }
  speechSynthesis.cancel();
  lines.forEach((l,i)=>{
    const text=l.replace(/^(男|女|问)：/,'');
    const u=new SpeechSynthesisUtterance(text); u.lang='zh-CN'; if(zhVoice) u.voice=zhVoice;
    u.rate=0.9; u.pitch=l.startsWith('男')?0.75:(l.startsWith('女')?1.25:1);
    speechSynthesis.speak(u);
  });
}

function helpBlock(it,extra){ return $('div','help',(it.py?`<div>${it.py}</div>`:'')+`<div><i>${it.en}</i></div>`+(extra||'')); }

function choiceButtons(item, opts, state){
  const wrap=$('div','opts');
  opts.forEach(([k,t])=>{
    const b=$('button','opt',t&&t!==k?`${k} ${t}`:k);
    b.onclick=()=>{ state.pick=k; wrap.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); };
    b.dataset.k=k; wrap.appendChild(b);
  });
  state.check=()=>{ wrap.querySelectorAll('.opt').forEach(x=>{ x.classList.remove('sel'); if(x.dataset.k===item.a) x.classList.add('right'); else if(x.dataset.k===state.pick) x.classList.add('wrong'); }); return state.pick===item.a; };
  state.reset=()=>{ state.pick=null; wrap.querySelectorAll('.opt').forEach(x=>x.className='opt'); };
  return wrap;
}

SETS.forEach(set=>{
  const sec=$('section','set'); sec.id=set.id;
  sec.appendChild($('div','kicker',set.kicker));
  sec.appendChild($('h2',null,set.title));
  sec.appendChild($('p','note',set.intro));
  const states=[];

  if(set.bank){
    const bank=$('div','bank');
    set.bank.forEach(b=>{
      if(set.kind==='gap') bank.appendChild($('span',null,`${b[0]} ${b[1]}<span class="type">${b[2]}</span>`));
      else { const d=$('div',null,`<b>${b[0]}</b> ${b[1]}`); d.style.margin='4px 0'; d.title=b[2]+' · '+b[3]; bank.appendChild(d); }
    });
    sec.appendChild(bank);
    if(set.kind==='match'){
      const hb=$('div','help',set.bank.map(b=>`<div><b>${b[0]}</b> ${b[2]} — <i>${b[3]}</i></div>`).join(''));
      const box=$('div','item'); const t=$('button','btn small','Help for the replies'); t.onclick=()=>box.classList.toggle('showhelp');
      box.appendChild(t); box.appendChild(hb); sec.appendChild(box);
    }
  }

  set.items.forEach((it,i)=>{
    const el=$('div','item'); const st={};
    const n=`<b>${i+1}.</b> `;
    if(set.kind==='listen'){
      const row=$('div','controls'); const p=$('button','btn small','▶ Play'); p.onclick=()=>speak(it.say);
      row.appendChild(p); el.appendChild(row);
      el.appendChild($('div','q',n+it.q));
      el.appendChild(choiceButtons(it,it.opts,st));
      el.appendChild(helpBlock(it,`<div class="zh">${it.say.join('<br>')}</div>`));
    } else if(set.kind==='match' || set.kind==='gap'){
      el.appendChild($('div','q',n+it.q));
      el.appendChild(choiceButtons(it,set.bank.map(b=>[b[0],'']),st));
      el.appendChild(helpBlock(it));
    } else if(set.kind==='choice'){
      el.appendChild($('div','q',n+it.q));
      el.appendChild(choiceButtons(it,it.opts,st));
      el.appendChild(helpBlock(it));
    } else if(set.kind==='order'){
      el.appendChild($('div','q',n));
      const built=$('div','built'); const pool=$('div','chips');
      const shuffled=it.parts.slice();
      const fill=()=>{ pool.innerHTML=''; built.innerHTML=''; shuffled.forEach(p=>{ const c=$('button','chip',p); c.onclick=()=>{ (c.parentNode===pool?built:pool).appendChild(c); }; pool.appendChild(c); }); };
      fill();
      el.appendChild(built); el.appendChild(pool);
      const v=$('span','verdict'); el.appendChild(v);
      st.check=()=>{ const s=[...built.children].map(c=>c.textContent).join(''); const ok=it.a.includes(s); v.className='verdict '+(ok?'ok':'no'); v.textContent=ok?'✓ '+it.a[0]+'。':'✗ '+it.a[0]+'。'; return ok; };
      st.reset=()=>{ fill(); v.textContent=''; };
      el.appendChild(helpBlock(it));
    } else if(set.kind==='pinyin'){
      const q=$('div','q',n+it.pre); const inp=$('input','hz'); inp.setAttribute('aria-label',it.pin); inp.placeholder=it.pin; inp.maxLength=2;
      q.appendChild(inp); q.appendChild(document.createTextNode(it.post)); el.appendChild(q);
      const v=$('span','verdict'); el.appendChild(v);
      st.check=()=>{ const ok=inp.value.trim()===it.a; v.className='verdict '+(ok?'ok':'no'); v.textContent=ok?'✓':'✗ '+it.a; return ok; };
      st.reset=()=>{ inp.value=''; v.textContent=''; };
      el.appendChild(helpBlock({en:it.en}));
    }
    const h=$('button','btn small','Help'); h.style.marginTop='6px'; h.onclick=()=>el.classList.toggle('showhelp');
    el.appendChild(h);
    states.push(st); sec.appendChild(el);
  });

  const ctl=$('div','controls'); const score=$('div','score');
  const chk=$('button','btn','Check'); const rst=$('button','btn','Reset');
  chk.onclick=()=>{ const r=states.filter(s=>s.check()).length; score.textContent=`${r} / ${states.length}`; };
  rst.onclick=()=>{ states.forEach(s=>s.reset()); score.textContent=''; sec.querySelectorAll('.showhelp').forEach(x=>x.classList.remove('showhelp')); };
  ctl.appendChild(chk); ctl.appendChild(rst);
  if(set.kind==='gap'){ const t=$('button','btn','Show word types'); t.onclick=()=>sec.classList.toggle('showtypes'); ctl.appendChild(t); }
  sec.appendChild(ctl); sec.appendChild(score);
  root.appendChild(sec);
});
