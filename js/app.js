
let LESSONS=[];
const $=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>s.toLowerCase().replace(/œ/g,"oe").replace(/æ/g,"ae").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g," ").replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim();
let S={xp:0,streak:0,last:"",lv:{},due:{},days:{},custom:[],snd:1,goal:100,gem:0,fz:0,q:{},bd:{},ses:0,perf:0,own:[],on:"",az:1,hc:0,rm:0,ex:["happy"],err:{},ok:{},k:{},pin:[],ord:"freq",bk:"",x2:0,ls:null},ALL=[],tab="path",AC;
try{Object.assign(S,JSON.parse(localStorage.getItem("av2")||localStorage.getItem("av1")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("av2",JSON.stringify(S))}catch(e){}};
const parse=d=>d.trim().split("\n").filter(x=>x.includes("|")).map(x=>{const[a,...f]=x.split("|");return{a:a.trim(),f:f.join("|").trim()}});
let ROOTS={},MEAN={},HOMO={};const baseA=a=>a.replace(/ \(\d+\)$/,"");
const skey=s=>s.toLowerCase().replace(/œ/g,"oe").replace(/æ/g,"ae").replace(/[’']/g," ").replace(/[^\p{L}\p{N} ]/gu,"").replace(/\s+/g," ").trim();
const senses=f=>[...new Set(String(f).replace(/\((?:s|e|m|f|fém\.|masc\.|pl\.)\)/g," ").replace(/[()]/g," ").replace(/[«»?!…]/g," ").split(/\s[\/;]\s|;/).map(x=>skey(x).replace(/^(l |la |le |les |un |une |des |être )/,"").trim()).filter(Boolean))];
const sameMean=(x,w)=>x===w||baseA(x.a)===baseA(w.a)||(x.sn||[]).some(k=>(w.sn||[]).includes(k));
const homos=w=>(HOMO[baseA(w.a)]||[]).filter(x=>x!==w);
const syns=w=>[...new Set((w.sn||[]).flatMap(k=>MEAN[k]||[]))].filter(x=>x!==w&&baseA(x.a)!==baseA(w.a));
const accepted=w=>[w,...homos(w)].flatMap(x=>x.f.split(/\s[\/;]\s|;/).flatMap(s=>[norm(s),norm(s.replace(/\(.*?\)/g,""))]).concat((x.sn||[]).map(k=>norm(k.split("#")[0]))).concat([norm(x.f.replace(/\//g," "))])).filter(Boolean);
const moreHtml=(w,short)=>{const h=homos(w),y=syns(w).slice(0,short?4:12);if(!h.length&&!y.length)return"";return`<div class="more">${h.length?`<div><small class="sub">Autres sens de ce mot</small><div>${h.map(x=>esc(x.f)).join(" · ")}</div></div>`:""}${y.length?`<div><small class="sub">Autres mots arabes traduits de la même façon</small><div class="syn">${y.map(x=>`<span${short?"":` data-fa="${esc(x.a)}" role="button" tabindex="0"`}><span class="ar">${esc(arSplit(x.a)[0])}</span> <small>${esc(x.f)}</small></span>`).join("")}</div></div>`:""}</div>`};
function build(){LESSONS.forEach((l,i)=>{l.w=parse(l.d).map(w=>({...w,id:w.a,li:i,cx:l.cx&&l.cx[w.a],...((l.mt&&l.mt[w.a])||{})}));l.xw=(l.x||[]).map(e=>({a:e.ar,f:e.fr,id:"ex:"+e.ar,li:i,x:1}))});ALL=LESSONS.flatMap(l=>l.w);ALLEX=LESSONS.flatMap(l=>l.xw);ROOTS={};MEAN={};HOMO={};ALL.forEach(w=>{if(w.r)(ROOTS[w.r]=ROOTS[w.r]||[]).push(w);w.sn=w.sk||senses(w.f);w.sn.forEach(k=>(MEAN[k]=MEAN[k]||[]).push(w));const b=baseA(w.a);(HOMO[b]=HOMO[b]||[]).push(w)})}let ALLEX=[];build();
const cxHtml=w=>{if(!w||!w.cx)return"";const[e,k,tf]=w.cx;let h=esc(e);const ek=esc(k),i=h.indexOf(ek);if(k&&i>=0)h=h.slice(0,i)+"<mark>"+ek+"</mark>"+h.slice(i+ek.length);return`<figure class="cx"><blockquote class="ar" lang="ar">${h}</blockquote>${tf?`<p class="cxfr" lang="fr">${esc(tf)}</p>`:""}<figcaption>${LESSONS[w.li]&&LESSONS[w.li].dic?"Explication du dictionnaire · "+THN[thOf(w.li)][0]:"Leçon "+lnum(w.li)+" · texte du manuel"}</figcaption></figure>`};
const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10),today=()=>iso(new Date()),yest=()=>iso(new Date(Date.now()-864e5));
const gap=()=>S.last?Math.round((new Date(today())-new Date(S.last))/864e5):99;
const curStreak=()=>{const g=gap();return g<=1||g-1<=S.fz?S.streak:0};
const lvl=w=>S.lv[w.id]||0,isDue=w=>S.due[w.id]!==undefined&&S.due[w.id]<=Date.now();
const IC=(d,c="")=>`<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I={play:'<path d="M8 5l11 7-11 7z"/>',fire:'<path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 3-7 1 2 2 3 2 4 1-3 1-5 1-8z"/>',gem:'<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',moon:'<path d="M20 15A8 8 0 1 1 9 4a6.5 6.5 0 0 0 11 11z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',rev:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',spk:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',check:'<path d="m5 12 5 5 9-10"/>',cup:'<path d="M7 4h10v4a5 5 0 0 1-10 0zM5 5H3v2a3 3 0 0 0 4 2M19 5h2v2a3 3 0 0 1-4 2M12 13v4M8 20h8"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',chat:'<path d="M4 5h16v10H9l-5 4z"/>',quote:'<path d="M5 7h5v5c0 3-2 5-5 6M14 7h5v5c0 3-2 5-5 6"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>'};
const SPK=IC(I.spk);
const THK=["cr","si","pr","so"];
const THN={cr:["Niveau 1","المُسْتَوَى الأَوَّلُ"],si:["Niveau 2","المُسْتَوَى الثَّانِي"],pr:["Niveau 3","المُسْتَوَى الثَّالِثُ"],so:["Niveau 4","المُسْتَوَى الرَّابِعُ"]};
const nvOf=i=>(LESSONS[i]&&LESSONS[i].nv)||1,thOf=i=>THK[nvOf(i)-1]||"cr";
const NVS=()=>[...new Set(LESSONS.map(l=>l.nv||1))].sort();
const curNv=()=>{const a=NVS();return a.includes(S.nv)?S.nv:a[0]||1};
const lnum=i=>LESSONS.slice(0,i+1).filter(l=>(l.nv||1)==nvOf(i)).length;
const arN=s=>String(s).replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه");
const nvBar=()=>NVS().length>1?`<div class="nvsel" role="group" aria-label="Choisir le niveau">${NVS().map(n=>{const ws=LESSONS.filter(l=>(l.nv||1)==n).flatMap(l=>l.w),m=ws.filter(w=>lvl(w)>=3).length,vu=ws.filter(w=>S.due[w.id]!==undefined).length;return`<button type="button" class="th-${THK[n-1]} ${n==curNv()?"on":""}" data-nv="${n}" aria-pressed="${n==curNv()}"><b>${THN[THK[n-1]][0]}</b><small>${vu}/${ws.length} vus</small><small>${m} maîtrisé${m>1?"s":""}</small></button>`}).join("")}</div>`:"";
const nvWire=v=>v.querySelectorAll("[data-nv]").forEach(b=>b.onclick=()=>{S.nv=+b.dataset.nv;save();render();scrollTo(0,0)});
const STRN=w=>{if(S.due[w.id]===undefined)return["nv","Nouveau"];const l=lvl(w);return l<=1?["fb","Faible"]:l<3?["mo","Moyen"]:["so","Maîtrisé"]};
const dA=a=>String(a).replace(/ \(\d+\)$/,"");
const arSplit=a=>{a=dA(a);if(/[≠=]/.test(a))return[a,""];const p=a.split(" / ");return[p[0],p.slice(1).join(" · ")]};
const arHtml=a=>{const[m,sb]=arSplit(a);return`<span class="am">${esc(m)}</span>${sb?`<span class="as">${esc(sb)}</span>`:""}`};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let hasSp=false;const arVoice=()=>{try{const v=speechSynthesis.getVoices().find(v=>/^ar/i.test(v.lang));hasSp=!!v;return v}catch(e){hasSp=false}};
if("speechSynthesis"in window){arVoice();try{speechSynthesis.addEventListener("voiceschanged",()=>{const h=hasSp;arVoice();if(h!==hasSp&&tab=="me")render()})}catch(e){}}
const speak=t=>{try{const u=new SpeechSynthesisUtterance(t.split("/")[0].replace(/\(.*?\)/g,"").replace(/[≠=–].*/,""));u.lang="ar-SA";const av=arVoice();if(av)u.voice=av;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}};
const beep=(f,t=.15,d=0,ty="triangle",v=.14,f2)=>{if(!S.snd)return;try{AC=AC||new AudioContext();if(AC.state=="suspended")AC.resume();const n=AC.currentTime+d,o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+t);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(v,n+.015);g.gain.exponentialRampToValueAtTime(.0001,n+t);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+t+.02)}catch(e){}};
const SND={good:"sounds/correct.mp3",bad:"sounds/wrong.mp3",done:"sounds/completed.mp3"},AU={};let LAST;
const sndSrc=k=>typeof SOUND_INLINE!="undefined"?SOUND_INLINE[k]:SND[k];
const play=k=>{if(!S.snd)return;try{if(!AU[k]){AU[k]=new Audio(sndSrc(k));AU[k].preload="auto"}if(LAST)LAST.pause();LAST=AU[k].cloneNode();LAST.play().catch(()=>{})}catch(e){}};
const sGood=()=>play("good"),sBad=()=>play("bad"),sTick=()=>play("good"),fan=()=>play("done");
const isDark=()=>{const r=document.documentElement;return r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches};
function theme(){const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";try{localStorage.setItem("av1t",r.dataset.theme)}catch(e){}}
try{const t=localStorage.getItem("av1t");if(t)document.documentElement.dataset.theme=t}catch(e){}
const SES=10;const chunks=ws=>{const c=[];for(let i=0;i<ws.length;i+=SES)c.push(ws.slice(i,i+SES));return c};
const reviewSet=()=>{const d=dueSorted(),r=shuffle(ALL.filter(w=>!isDue(w)&&S.due[w.id]!==undefined)).sort((a,b)=>lvl(a)-lvl(b));const o=[...d,...r].slice(0,10);return o.length<10?o.concat(freshW(10-o.length)):o};

const STN=["Graine","Jeune palmier","Palmier chargé de dattes"],stg=()=>2;
const ACC={turban:'<ellipse cx="60" cy="66" rx="25" ry="11" fill="#e4572e"/><path d="M38 66q22-14 44 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><circle cx="60" cy="58" r="4" fill="#f2a900"/>',lunettes:'<g fill="none" stroke="#3b2a1a" stroke-width="2.5"><circle cx="53" cy="82" r="8"/><circle cx="67" cy="82" r="8"/></g>',noeud:'<path d="M60 108l-12-7v14zM60 108l12-7v14z" fill="#e4572e"/><circle cx="60" cy="108" r="3" fill="#f2a900"/>'};
const ACCN={turban:["Turban",40],lunettes:["Lunettes",30],noeud:["Nœud papillon",30]};
const EXN={happy:"Content",cheer:"Joyeux",sad:"Triste",think:"Pensif",sleep:"Endormi",wow:"Impressionné",love:"Amoureux",proud:"Fier",cool:"Cool",wink:"Complice"};
const EXH={happy:"dès le départ",cheer:"une bonne réponse",sad:"une erreur",think:"des mots à réviser",sleep:"3 jours d’absence",wow:"séance sans faute",love:"gagner un badge",proud:"monter de rang",cool:"5 bonnes réponses d’affilée",wink:"3 bonnes réponses d’affilée"};
const uk=m=>{if(!S.ex.includes(m)){S.ex.push(m);save();return 1}};
const BI={first:'<path d="M32 50V30" stroke="#6b4a2b" stroke-width="3"/><path d="M32 32c-10 0-14-8-14-14 10 0 14 6 14 14z" fill="#46c06a"/><path d="M32 28c10 0 14-8 14-14-10 0-14 6-14 14z" fill="#2e9e4f"/><ellipse cx="32" cy="52" rx="12" ry="4" fill="#e9c98a"/>',
s3:'<path d="M32 12c2 8 12 12 12 24a12 12 0 0 1-24 0c0-6 4-8 5-14 3 3 5 5 5 8 2-5 2-12 2-18z" fill="#ff9a3c"/><path d="M32 30c1 5 6 7 6 13a6 6 0 0 1-12 0c0-4 3-5 4-9 1 1 2 2 2 4z" fill="#ffd966"/>',
s7:'<path d="M32 10c2 8 14 12 14 26a14 14 0 0 1-28 0c0-6 4-8 5-14 3 3 5 5 5 8 2-5 2-12 4-20z" fill="#ff4d3c"/><path d="M32 28c1 6 7 8 7 15a7 7 0 0 1-14 0c0-4 3-6 4-10 1 1 3 2 3 4z" fill="#ffb347"/>',
s30:'<path d="M32 8c3 9 16 13 16 28a16 16 0 0 1-32 0c0-6 4-9 6-15 3 3 5 5 5 9 2-5 3-14 5-22z" fill="#5a7bff"/><path d="M32 26c1 7 8 9 8 17a8 8 0 0 1-16 0c0-5 3-6 5-11 1 1 3 2 3 5z" fill="#9fe7ff"/>',
w50:'<path d="M10 32q22-22 44 0q-22 22-44 0z" fill="#fff" stroke="#3b2a1a" stroke-width="3"/><circle cx="32" cy="32" r="8" fill="#0d9488"/><circle cx="32" cy="32" r="3.5" fill="#222"/>',
m25:'<path d="M8 26l24-10 24 10-24 10z" fill="#3b2a1a"/><path d="M18 33v9q14 8 28 0v-9l-14 6z" fill="#2f2a52"/><path d="M52 28v12" stroke="#f2a900" stroke-width="3"/><circle cx="52" cy="42" r="3" fill="#f2a900"/>',
m100:'<path d="M32 14c-8-4-18 2-16 10-5 3-4 12 2 14 1 8 10 11 14 6 4 5 13 2 14-6 6-2 7-11 2-14 2-8-8-14-16-10z" fill="#ff9fb5"/><path d="M32 16v30M24 26q4 4 0 8M40 26q-4 4 0 8" stroke="#d6577a" stroke-width="2.5" fill="none"/>',
p5:'<circle cx="32" cy="32" r="18" fill="#fff" stroke="#e4572e" stroke-width="5"/><circle cx="32" cy="32" r="10" fill="#e4572e"/><circle cx="32" cy="32" r="4" fill="#fff"/>',
x500:'<path d="M32 10l6.5 14 15 1.5-11 10 3.5 15-14-8-14 8 3.5-15-11-10 15-1.5z" fill="#ffc800" stroke="#e5a800" stroke-width="2"/>',
x2000:'<path d="M12 44l-3-22 13 10 10-16 10 16 13-10-3 22z" fill="#ffc800" stroke="#e5a800" stroke-width="2"/><rect x="12" y="46" width="40" height="6" rx="2" fill="#e5a800"/><circle cx="32" cy="38" r="3" fill="#e4572e"/>',
l1:'<path d="M10 16h20q2 0 2 2v32q0-2-2-2H10z" fill="#2f9e5b"/><path d="M54 16H34q-2 0-2 2v32q0-2 2-2h20z" fill="#46c06a"/><path d="M16 24h10M16 31h10M38 24h10M38 31h10" stroke="#fff" stroke-width="2.5"/>'};
const bsv=id=>`<svg viewBox="0 0 64 64" class="bsv ${id}" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#fff3cf" stroke="#f2a900" stroke-width="3"/>${BI[id]}</svg>`;
const FR={happy:[-75,-38,0,38,75],cheer:[-90,-55,-20,20,55,90],sad:[-112,-82,-10,10,82,112]};
FR.love=FR.proud=FR.cool=FR.cheer;
function nk(m="happy",s=80,st=stg()){
 const FM=FR[m]||FR.happy,a=st==1?FM.filter((_,i)=>i%2==0):FM,c=["#2e9e4f","#46c06a","#1f7a3d"];
 const fr=a.map((r,i)=>`<ellipse cx="60" cy="33" rx="9" ry="29" transform="rotate(${r} 60 58)" fill="${c[i%3]}"/>`).join("");
 const sd=m=="sad";
 const eyes=m=="cheer"?'<path d="M47 83q6-8 12 0M61 83q6-8 12 0" stroke="#3b2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>':`<circle cx="53" cy="82" r="6.5" fill="#fff"/><circle cx="67" cy="82" r="6.5" fill="#fff"/><circle cx="${sd?53:54}" cy="${sd?85:83}" r="3.2" fill="#3b2a1a"/><circle cx="${sd?67:68}" cy="${sd?85:83}" r="3.2" fill="#3b2a1a"/>`;
 const mouth=m=="cheer"?'<path d="M52 93q8 14 16 0z" fill="#7a2e12"/>':sd?'<path d="M53 100q7-8 14 0" stroke="#3b2a1a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M45 88q-4 7 0 10 4-3 0-10z" fill="#5ab4ff"/>':'<path d="M53 94q7 8 14 0" stroke="#3b2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>';
 let EY=eyes,MO=mouth;
 if(m=="sleep"){EY='<path d="M47 83h12M61 83h12" stroke="#3b2a1a" stroke-width="3" stroke-linecap="round"/>';MO='<path d="M56 96h8" stroke="#3b2a1a" stroke-width="3" stroke-linecap="round"/><text x="80" y="64" font-size="13" fill="#5ab4ff" font-weight="700">z</text>'}
 else if(m=="love"){const h=x=>`<path d="M${x} 88c-8-5-10-10-7-12 2-2 5-1 7 2 2-3 5-4 7-2 3 2 1 7-7 12z" fill="#e4572e"/>`;EY=h(53)+h(67)}
 else if(m=="proud"){const s=x=>{let p="";for(let i=0;i<10;i++){const r=i%2?3:7.5,a=Math.PI*i/5-Math.PI/2;p+=(x+r*Math.cos(a)).toFixed(1)+","+(82+r*Math.sin(a)).toFixed(1)+" "}return`<polygon points="${p}" fill="#ffc800" stroke="#e5a800" stroke-width="1"/>`};EY=s(53)+s(67)}
 else if(m=="cool"){EY='<rect x="43" y="76" width="15" height="11" rx="3" fill="#1c1c1c"/><rect x="62" y="76" width="15" height="11" rx="3" fill="#1c1c1c"/><path d="M58 80h4" stroke="#1c1c1c" stroke-width="2.5"/>';MO='<path d="M53 96q7 6 15-1" stroke="#3b2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>'}
 else if(m=="wink")EY='<circle cx="53" cy="82" r="6.5" fill="#fff"/><circle cx="54" cy="83" r="3.2" fill="#3b2a1a"/><path d="M62 83q5-5 10 0" stroke="#3b2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>';
 else if(m=="wow")MO='<ellipse cx="60" cy="97" rx="4.5" ry="6" fill="#7a2e12"/>';
 else if(m=="think"){EY=eyes.replace(/cy="83"/g,'cy="80"').replace('cx="54"','cx="57"').replace('cx="68"','cx="71"');MO='<path d="M55 96h10" stroke="#3b2a1a" stroke-width="3" stroke-linecap="round"/>'}
 if(st==0)return `<svg class="nk ${m}" viewBox="0 0 120 140" width="${s}" height="${Math.round(s*7/6)}" aria-hidden="true"><ellipse cx="60" cy="133" rx="34" ry="5" fill="#0002"/><g transform="translate(60 133) scale(1.35) translate(-60 -133)"><ellipse cx="52" cy="88" rx="4" ry="12" transform="rotate(-35 52 92)" fill="#46c06a"/><ellipse cx="68" cy="88" rx="4" ry="12" transform="rotate(35 68 92)" fill="#2e9e4f"/><ellipse cx="60" cy="108" rx="16" ry="19" fill="#7a3e12"/><g transform="translate(60 106) scale(.5) translate(-60 -88)">${eyes}${mouth}</g><path d="M20 133Q60 106 100 133z" fill="#e9c98a"/></g></svg>`;
 return `<svg class="nk ${m}" viewBox="0 0 120 140" width="${s}" height="${Math.round(s*7/6)}" aria-hidden="true"><ellipse cx="60" cy="133" rx="36" ry="6" fill="#0002"/><g transform="translate(60 133) scale(${st==1?.86:1}) translate(-60 -133)"><path d="M44 131Q35 92 48 60h24q12 32 4 71z" fill="#b9783f"/><path d="M42 108h36M45 74h30M44 122h32" stroke="#9a5f2c" stroke-width="2" opacity=".6"/><g class="crown">${fr}${st==2?[[50,64],[58,69],[66,67],[73,63],[56,60]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#7a3e12"/>`).join(""):""}</g><circle cx="46" cy="93" r="4" fill="#ff9a8a" opacity=".65"/><circle cx="74" cy="93" r="4" fill="#ff9a8a" opacity=".65"/><g class="eyes">${EY}</g>${MO}${ACC[S.on]||""}</g></svg>`}
function mascotHtml(sz){
 const d=ALL.filter(isDue).length,t=S.days[today()]||0;let m="happy",s="Prêt pour une nouvelle leçon ? 🌴";
 if(S.last&&gap()>=3&&!t){m="sleep";s="Tu m’as manqué… on reprend ?"}
 else if(t>=S.goal){m="cheer";s="Objectif du jour atteint, bravo !"}
 else if(d>=GATE1){m="think";s=d+" mots à réviser : on rattrape en douceur."}
 else if(d){m="think";s=d+" mot"+(d>1?"s":"")+" à réviser aujourd’hui."}
 else if(curStreak()>=3)s="Série de "+curStreak()+" jours, continue !";
 uk(m);return`<div class="mb${sz?" sm":""}">${nk(m,sz||128)}<div class="sb"><small class="sub">Nakhla</small><br>${s}</div></div>`}
const dq=()=>{const t=today();if(S.q.d!==t)S.q={d:t,xp:0,ses:0,perf:0,cl:[]};return S.q};
const QS=[["Gagner 200 XP",q=>q.xp,200,10],["Terminer 2 séances",q=>q.ses,2,10],["Faire une séance sans faute",q=>q.perf,1,15]];
const questsHtml=()=>{const q=dq();return`<details class="card"><summary><b>Quêtes du jour</b> <span class="sub">${q.cl.length}/3 ✅</span></summary>${QS.map(([n,f,g,r],i)=>{const p=Math.min(g,f(q));return`<div class="qs"><div>${n} <small class="sub">· 💎${r}</small><div class="bar"><i style="width:${p/g*100}%"></i></div></div><span>${q.cl.includes(i)?"✅":p+"/"+g}</span></div>`}).join("")}</details>`};
const seen=()=>ALL.filter(w=>S.due[w.id]!==undefined).length,mast=()=>ALL.filter(w=>lvl(w)>=3).length;
const BD=[["first","🌱","Premier pas",()=>S.ses>=1],["s3","🔥","3 jours d’affilée",()=>S.streak>=3],["s7","🔥","7 jours d’affilée",()=>S.streak>=7],["s30","🏅","30 jours d’affilée",()=>S.streak>=30],["w50","👀","50 mots vus",()=>seen()>=50],["m25","🎓","25 mots maîtrisés",()=>mast()>=25],["m100","🧠","100 mots maîtrisés",()=>mast()>=100],["p5","💯","5 séances sans faute",()=>S.perf>=5],["x500","⭐","500 XP",()=>S.xp>=500],["x2000","👑","2000 XP",()=>S.xp>=2000],["l1","📘","Une leçon maîtrisée",()=>LESSONS.some(l=>l.w.length&&l.w.every(isM))]];
const checkBd=()=>BD.filter(b=>!S.bd[b[0]]&&b[3]()).map(b=>{S.bd[b[0]]=today();return b});
const LV=["Débutant","Apprenti","Élève","Studieux","Appliqué","Assidu","Persévérant","Lettré","Érudit","Savant","Éloquent","Maître","Grand maître","Sage","Nakhla d’or"];
const lev=x=>{const n=Math.floor(Math.sqrt(x/150))+1;return[n,LV[Math.min(n-1,LV.length-1)]+(n>LV.length?" "+(n-LV.length+1):""),(n-1)**2*150,n*n*150]};
/* ---- Répétition espacée ---- */
const IV=[0,1,3,7,16,35];
function srs(w,c,gd){const id=w.id,first=!gd.has(id);gd.add(id);const l=lvl(w);
 if(c){S.ok[id]=(S.ok[id]||0)+1;if(!first)return;if(S.due[id]!==undefined&&S.due[id]>Date.now()+36e5)return;/* révision en avance : pas de montée */let nl=Math.min(5,l+1),d;
  if(l>=5){S.k[id]=(S.k[id]||0)+1;d=Math.min(365,35*2*S.k[id])}else d=IV[nl];
  S.lv[id]=nl;S.due[id]=Date.now()+d*864e5*(.9+Math.random()*.2)}
 else{S.ok[id]=0;S.err[id]=(S.err[id]||0)+1;S.k[id]=0;const nl=Math.max(0,l-1);S.lv[id]=nl;S.due[id]=Date.now()}}/* un seul niveau perdu ; le mot revient dans la séance, et une fois réussi il est programmé pour demain */
const ivl=w=>lvl(w)>=5?Math.min(365,35*Math.max(1,2*(S.k[w.id]||0))):IV[lvl(w)];
const dueSorted=()=>{const n=Date.now();return ALL.filter(isDue).sort((a,b)=>(n-S.due[b.id])/(ivl(b)+.3)-(n-S.due[a.id])/(ivl(a)+.3))};
const freshW=k=>ALL.filter(w=>S.due[w.id]===undefined).sort((a,b)=>(b.q||0)-(a.q||0)).slice(0,k);
/* ---- Carnet des mots difficiles ---- */
const isHard=w=>S.pin.includes(w.id)||((S.err[w.id]||0)>=2&&(S.ok[w.id]||0)<3);
const hardList=()=>ALL.filter(isHard).sort((a,b)=>(S.err[b.id]||0)-(S.err[a.id]||0));
const togglePin=w=>{if(isHard(w)){S.pin=S.pin.filter(x=>x!==w.id);if((S.err[w.id]||0)>=2)S.ok[w.id]=3}else S.pin.push(w.id);save()};
/* ---- Ordre du parcours ---- */
let J0=null,THEMES={};
const ORD=[["freq","Fréquence"],["theme","Thèmes"],["rac","Racines"],["dico","Dictionnaire"]];
const TH_ORD=["outi","fami","mais","nour","corp","natu","coul","temp","lieu","pays","ecol","medi","comm","sent","reli","poli","gram","abst","verb","divn"];
const FQL=q=>q>=4.5?"Mots très courants":q>=3.6?"Mots courants":q>=2.8?"Mots moins courants":"Mots rares";
const FQA=q=>q>=4.5?"كَلِمَاتٌ شَائِعَةٌ جِدًّا":q>=3.6?"كَلِمَاتٌ شَائِعَةٌ":q>=2.8?"كَلِمَاتٌ أَقَلُّ شُيُوعًا":"كَلِمَاتٌ نَادِرَةٌ";
const cut=(a,n)=>{const o=[];for(let i=0;i<a.length;i+=n)o.push(a.slice(i,i+n));if(o.length>1&&o.at(-1).length<SES)o.at(-2).push(...o.pop());return o};
function reorg(j){const ord=S.ord||"freq";if(ord=="dico"||!j.lecons.some(l=>l.dictionnaire))return j.lecons;
 const out=[],nvs=[...new Set(j.lecons.map(l=>l.niveau||1))].sort();
 for(const n of nvs){const src=j.lecons.filter(l=>(l.niveau||1)==n),ws=src.flatMap(l=>l.mots),base={niveau:n,dictionnaire:true};
  if(ord=="freq"){const so=[...ws].sort((a,b)=>(b.q||0)-(a.q||0)),grp=[];so.forEach(m=>{const k=FQL(m.q||0);if(!grp.length||grp.at(-1)[0]!==k)grp.push([k,[],FQA(m.q||0)]);grp.at(-1)[1].push(m)});
   grp.forEach(([k,ms,ka])=>{const c=cut(ms,30);c.forEach((x,i)=>out.push({...base,titre:k+(c.length>1?` (${i+1}/${c.length})`:""),titre_ar:ka,mots:x}))})}
  else if(ord=="theme"){[...TH_ORD,...new Set(ws.map(m=>m.t||"divn").filter(t=>!TH_ORD.includes(t)))].forEach(t=>{const ms=ws.filter(m=>(m.t||"divn")==t).sort((a,b)=>(b.q||0)-(a.q||0));const c=cut(ms,30);c.forEach((x,i)=>out.push({...base,titre:(THEMES[t]||t)+(c.length>1?` (${i+1}/${c.length})`:""),mots:x}))})}
  else{const fam={},solo=[];ws.forEach(m=>m.r?(fam[m.r]=fam[m.r]||[]).push(m):solo.push(m));
   const fs=Object.entries(fam).sort((a,b)=>Math.max(...b[1].map(m=>m.q||0))-Math.max(...a[1].map(m=>m.q||0)));let cur=[],rs=[];
   const flush=()=>{if(cur.length)out.push({...base,titre:"Familles "+rs.slice(0,3).map(r=>r.replace(/ /g,"")).join(" · ")+(rs.length>3?" …":""),titre_ar:rs.slice(0,6).map(r=>r.replace(/ /g,"")).join(" · ")+(rs.length>6?" …":""),mots:cur});cur=[];rs=[]};
   fs.forEach(([r,ms])=>{if(cur.length&&cur.length+ms.length>30)flush();cur.push(...ms);rs.push(r)});flush();
   const c=cut(solo.sort((a,b)=>(b.q||0)-(a.q||0)),30);c.forEach((x,i)=>out.push({...base,titre:"Mots sans famille"+(c.length>1?` (${i+1}/${c.length})`:""),mots:x}))}}
 return out}
const ordBar=()=>J0&&J0.lecons.some(l=>l.dictionnaire)?`<div class="ordsel" role="group" aria-label="Ordre des leçons"><small class="sub">Ordre des leçons</small><div>${ORD.map(([k,n])=>`<button type="button" data-ord="${k}" class="${(S.ord||"freq")==k?"on":""}" aria-pressed="${(S.ord||"freq")==k}">${n}</button>`).join("")}</div></div>`:"";
const ordWire=v=>v.querySelectorAll("[data-ord]").forEach(b=>b.onclick=()=>{S.ord=b.dataset.ord;save();setVocab(J0);render()});
/* ---- Familles de racines ---- */
const famOf=w=>(w&&w.r&&ROOTS[w.r]&&ROOTS[w.r].length>1)?ROOTS[w.r]:null;
const famHtml=w=>{const f=famOf(w);if(!f)return"";return`<div class="fam"><div class="fh"><b>Famille de la racine <span class="ar">${esc(w.r)}</span></b><span class="sub">${f.length} mots</span></div><div class="fl">${f.map(x=>`<button type="button" class="fw ${x===w?"me":""}" data-fa="${esc(x.a)}"><span class="ar">${esc(arSplit(x.a)[0])}</span><small>${esc(x.f)}</small></button>`).join("")}</div><button class="btn sec" id="ftr" style="width:100%;margin-top:10px">S’entraîner sur cette famille</button><div class="sub" style="font-size:.72rem;margin-top:6px">Familles regroupées automatiquement : quelques erreurs sont possibles.</div></div>`};
const famSet=f=>[...f.filter(isDue),...f.filter(w=>S.due[w.id]===undefined),...f.filter(w=>S.due[w.id]!==undefined&&!isDue(w)).sort((a,b)=>lvl(a)-lvl(b))].slice(0,10);
/* ---- Sauvegarde ---- */
function exportProg(){const d=JSON.stringify({app:"nakhla",v:1,date:new Date().toISOString(),S}),name="nakhla-progression-"+today()+".json";
 try{const f=new File([d],name,{type:"application/json"});if(navigator.canShare&&navigator.canShare({files:[f]})&&/Mobi|Android|iPhone|iPad/.test(navigator.userAgent)){navigator.share({files:[f],title:"Progression Nakhla"}).then(()=>{S.bk=today();save();render()}).catch(()=>{});return}}catch(e){}
 const u=URL.createObjectURL(new Blob([d],{type:"application/json"})),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);S.bk=today();save();render()}
function importProg(f){f.text().then(t=>{let d;try{d=JSON.parse(t)}catch(e){return alert("Ce fichier n’est pas une sauvegarde Nakhla valide.")}
 const x=d&&d.S;if(!x||typeof x.lv!=="object"||typeof x.due!=="object")return alert("Ce fichier n’est pas une sauvegarde Nakhla valide.");
 const dt=d.date?new Date(d.date).toLocaleDateString("fr-FR"):"date inconnue",nb=Object.keys(x.due).length;
 if(!confirm(`Remplacer votre progression actuelle par la sauvegarde du ${dt} (${nb} mots vus, ${x.xp||0} XP) ?`))return;
 Object.assign(S,{err:{},ok:{},k:{},pin:[]},x);save();setVocab(J0);render();alert("Progression restaurée ✔")})}
function bumpStreak(msgs){const t=today();if(S.last===t)return;const g=gap(),mq=g-1;if(g==1)S.streak++;else if(S.last&&mq>=1&&mq<=S.fz){S.fz-=mq;S.streak++;msgs.push(`🧊 ${mq>1?mq+" gels":"Gel"} de série utilisé${mq>1?"s":""} : série sauvée !`)}else{if(S.streak>=3&&S.last)S.ls={v:S.streak,d:t};S.streak=1}S.last=t}
function addXP(x,msgs){const t=today(),b=S.days[t]||0;S.xp+=x;S.days[t]=b+x;dq().xp+=x;if(b<S.goal&&b+x>=S.goal){S.gem+=5;msgs.push("🎯 Objectif du jour atteint (+💎5)");return 5}return 0}
let lastTab=null,FC=0;function render(){
 if(lastTab!==tab){lastTab=tab;scrollTo(0,0)}
 app.innerHTML=`<header><h1><img class="logo" src="icons/logo.png" width="38" height="38" alt=""><span class="brand">Nakhla</span></h1><span class="chip c-fire">${IC(I.fire)}${curStreak()}</span><span class="chip c-gem">${IC(I.gem)}${S.gem}</span><span class="chip c-star">${IC(I.star)}${S.days[today()]||0}/${S.goal}</span><button class="chip c-th" id="th" aria-label="Changer de thème (jour / nuit)">${IC(isDark()?I.sun:I.moon)}</button></header><main id="v"></main><nav>${[["path",I.map,"Parcours"],["rev",I.rev,"Révision"],["words",I.book,"Mots"],["me",I.user,"Profil"],["info",I.info,"À propos"]].map(([k,i,n])=>`<button data-t="${k}" class="${tab==k?"on":""}">${IC(i)}${n}</button>`).join("")}</nav>`;
 $("#th").onclick=()=>{theme();render()};app.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
 app.className="main";$("#v").className="v-"+tab;({path:vPath,rev:vRev,words:vWords,me:vMe,info:vInfo})[tab]($("#v"));
}
function vPath(v){
 const dn=ALL.filter(isDue).length;let n=0,found=false;
 const AP=autoPlan(),pd=phDue().length,hd=hardList().length,CN0=curNv(),ORDN=(ORD.find(o=>o[0]==(S.ord||"freq"))||[0,""])[1],pl=(n,a,b)=>n+" "+(n>1?b:a);
 let h=mascotHtml(84)+`<button class="card auto" id="auto"><span class="aui">${IC(I.play)}</span><span class="aut"><b>Continuer</b><small>${esc(AP.d)}</small></span></button>
 <div class="qrow"><button class="qchip${dn>=GATE1?" warn":""}" id="rv">${IC(I.rev)}${dn?dn+" à réviser":"Entraînement libre"}</button>${pd?`<button class="qchip" id="prv">${IC(I.quote)}${pl(pd,"phrase","phrases")}</button>`:""}${hd?`<button class="qchip" id="hdm">${IC(I.book)}${pl(hd,"difficile","difficiles")}</button>`:""}</div>
 <div class="prow">${NVS().length>1||ordBar()?`<button class="pick" id="pk" aria-haspopup="dialog"><span><small class="sub">Parcours${ORDN?` · ${esc(ORDN)}`:""}</small><b>${THN[THK[CN0-1]][0]}</b></span>${CHEV}</button>`:""}<button class="pick" id="qk" aria-haspopup="dialog"><span><small class="sub">Quêtes du jour</small><b>${dq().cl.length}/3 terminées</b></span>${CHEV}</button></div>`;h=`<div class="pside">${h}</div><div class="pmain">`;
 let pth="";const CN=curNv();LESSONS.forEach((l,li)=>{
  if((l.nv||1)!=CN)return;const m=l.w.filter(w=>lvl(w)>=3).length,vu=l.w.filter(w=>S.due[w.id]!==undefined).length,th=thOf(li);
  if(th!==pth){if(pth)h+=`<div class="sep"><i></i><span class="ar">${THN[th][1]}</span><i></i></div>`;pth=th}
  h+=`<div class="th-${th}"><div class="unit"><div style="flex:1"><div class="sub">${THN[th][0]} · Leçon ${lnum(li)}</div><b>${esc(l.t.replace(/^Leçon \d+( · )?/,"")||"Vocabulaire")}</b>${l.ta?`<div class="ar tar">${esc(l.ta)}</div>`:""}<div class="bar thin two"><i class="vu" style="width:${vu/l.w.length*100}%"></i><i style="width:${m/l.w.length*100}%"></i></div></div><span class="cnt"><b>${vu}/${l.w.length}</b><small>vus</small><b>${m}</b><small>maîtrisés</small></span></div><div class="dz d${li%3}">`;
  chunks(l.w).forEach((c,ci)=>{
   const done=c.every(w=>S.due[w.id]!==undefined),cur=!done&&!found;if(cur)found=true;
   const p=c.reduce((s,w)=>s+lvl(w),0)/c.length*20,off=[0,38,58,38,0,-38,-58,-38][n++%8];
   h+=`<div class="rg" style="--p:${p};transform:translateX(${off}px)">${cur?'<i class="go">Commencer</i><span class="mini">'+nk("happy",66)+'</span>':""}<button class="nd ${done?"dn":cur?"cu":p==0?"nw":""}" data-l="${li}" data-c="${ci}" aria-label="Étape ${ci+1}${done?", terminée":""}">${done?IC(I.check):ci+1}</button></div>`});
  h+=`<div class="sq">${l.xw.length?`<div><button class="ndq xp ${l.xw.every(w=>lvl(w)>=2)?"dn":""}" data-x="${li}" aria-label="Expressions de la leçon">${IC(I.chat)}</button><small class="xl">Expressions</small></div>`:""}<div><button class="ndq tr" data-l="${li}" data-c="-1" aria-label="Révision de la leçon">${IC(I.cup)}</button><small class="xl">Révision</small></div>${(()=>{const a=PHL[li]||[];if(!a.length)return"";const o=a.filter(phOpen),dn=o.length&&o.every(p=>lvl(p)>=2);return`<div><button class="ndq ph ${o.length?(dn?"dn":"on"):""}" data-p="${li}" aria-label="Phrases de la leçon">${IC(I.quote)}</button><small class="xl">Phrases ${o.length}/${a.length}</small></div>`})()}</div></div></div>`;
 });
 v.innerHTML=h+"</div>";if(FC){FC=0;const c=v.querySelector(".nd.cu");if(c)setTimeout(()=>c.scrollIntoView({block:"center"}),30)}if($("#hdm"))$("#hdm").onclick=()=>{tab="rev";render()};
 $("#auto").onclick=autoGo;$("#rv").onclick=()=>session(reviewSet(),"Révision",ALL);if($("#pk"))$("#pk").onclick=pickSheet;$("#qk").onclick=questSheet;if($("#prv"))$("#prv").onclick=()=>session(phDue().slice(0,6),"Révision des phrases",null);

 v.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>xsheet(LESSONS[+b.dataset.x]));v.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>phSheet(+b.dataset.p));
 v.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{const l=LESSONS[+b.dataset.l],ci=+b.dataset.c;ci<0?sheet("Révision · "+l.t,famSet(shuffle(l.w)),l.w):gate(()=>sheet("Étape "+(ci+1)+" · "+l.t,chunks(l.w)[ci],l.w),"Étape "+(ci+1)+" · "+l.t,chunks(l.w)[ci])});
}
const GATE1=30,GATE2=100,KEEP=60,PERDAY=40;
/* Étale le retard : garde les KEEP mots les plus urgents pour aujourd’hui, répartit les autres (PERDAY par jour) sur les jours suivants, sans toucher aux niveaux */
/* ===== Pilote automatique : le bouton « Continuer » compose la séance idéale ===== */
function nextNew(k){const r=[],cn=curNv();for(const nv of [cn,...NVS().filter(x=>x!=cn)])for(const l of LESSONS){if((l.nv||1)!=nv)continue;for(const w of l.w){if(r.length>=k)return r;if(S.due[w.id]===undefined)r.push(w)}}return r}
const exSet=()=>dueSorted().filter(w=>lvl(w)>=3).slice(0,20);
function autoPlan(){const dn=ALL.filter(isDue).length,ex=exSet(),pd=phDue().length;
 if(ex.length>=12)return{k:"ex",ws:ex,t:"Révision express",d:`${ex.length} mots bien connus à valider d’un geste`};
 if(pd>=4&&S.lastAuto!=="ph")return{k:"ph",ws:phDue().slice(0,6),t:"Révision des phrases",d:`${Math.min(6,pd)} phrases à revoir`};
 const nn=dn<5?SES-dn:dn<30?6:dn<60?4:dn<100?3:2;let nw=nextNew(nn);const rv=dueSorted().slice(0,SES-nw.length);
 if(nw.length+rv.length<SES)nw=nextNew(SES-rv.length);
 if(!nw.length&&!rv.length){const ws=reviewSet();return{k:"w",ws,nw:[],rv:ws,t:"Entraînement libre",d:"Tout est à jour : entraînement sur vos mots"}}
 return{k:"w",ws:[...nw,...rv],nw,rv,t:nw.length?"Séance du jour":"Révision",d:[nw.length?`${nw.length} nouveau${nw.length>1?"x":""} mot${nw.length>1?"s":""}`:"",rv.length?`${rv.length} révision${rv.length>1?"s":""}`:""].filter(Boolean).join(" + ")}}
function autoGo(){const a=autoPlan();S.lastAuto=a.k;save();if(a.k=="ex")return session(a.ws,a.t,null,"ex");if(a.k=="ph")return session(a.ws,a.t,null);if(a.nw.length)return mixSheet(a.t,a.nw,a.rv);session(shuffle(a.ws),a.t,ALL)}
const CHEV='<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
function questSheet(){const d=document.createElement("div");d.className="ov";d.innerHTML=`<div class="sh" role="dialog" aria-label="Quêtes du jour">${questsHtml().replace("<details class=\"card\">","<div class=\"qsh\">").replace("</details>","</div>").replace(/<summary>(.*?)<\/summary>/,"<h3>$1</h3>")}<button class="btn sec" id="qkx" style="margin-top:14px">Fermer</button></div>`;d.onclick=e=>{if(e.target===d)d.remove()};d.querySelector("#qkx").onclick=()=>d.remove();document.body.appendChild(d)}
function pickSheet(){const d=document.createElement("div");d.className="ov";
 d.innerHTML=`<div class="sh" role="dialog" aria-label="Parcours"><h3>Parcours</h3>${NVS().length>1?`<p class="sub" style="margin:8px 0 6px">Niveau</p>${nvBar()}`:""}${ordBar()}<button class="btn sec" id="pkx" style="margin-top:14px">Fermer</button></div>`;
 d.onclick=e=>{if(e.target===d)d.remove()};document.body.appendChild(d);nvWire(d);ordWire(d);
 d.querySelectorAll("[data-nv],[data-ord]").forEach(b=>b.addEventListener("click",()=>d.remove()));d.querySelector("#pkx").onclick=()=>d.remove()}
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)}
function spread(){const d=dueSorted(),rest=d.slice(KEEP),n=Date.now();rest.forEach((w,i)=>{S.due[w.id]=n+(1+Math.floor(i/PERDAY))*864e5+Math.random()*6*36e5});save();return rest.length}
/* Séance mixte : 6 révisions urgentes + 4 nouveaux mots de l’étape choisie */
function mixSheet(t,ws,rv0){const nw=rv0?ws:ws.filter(w=>S.due[w.id]===undefined).slice(0,4),rv=rv0||dueSorted().filter(w=>!nw.includes(w)).slice(0,SES-nw.length);
 const d=document.createElement("div");d.className="ov";
 d.innerHTML=`<div class="sh"><h3>${esc(t)}</h3><p class="sub" style="margin:4px 0 10px">${rv0?"":"Séance mixte : "}<b>${nw.length} nouveau${nw.length>1?"x":""} mot${nw.length>1?"s":""}</b>${rv.length?` + <b>${rv.length} mot${rv.length>1?"s":""} à réviser</b>`:""}. ${rv0?"Les nouveaux mots à découvrir :":"Vous avancez sans laisser le retard grossir."}</p>${nw.map(w=>`<div class="r"><span>${esc(w.f)}</span><span class="ar">${esc(dA(w.a))}</span></div>`).join("")}<button class="btn" style="width:100%;margin-top:14px">Commencer</button></div>`;
 d.onclick=e=>{if(e.target===d)d.remove()};d.querySelector("button").onclick=()=>{d.remove();session(shuffle([...nw,...rv]),t,ALL)};document.body.appendChild(d)}
function gate(go,t,ws){const dn=ALL.filter(isDue).length;if(dn<GATE1)return go();
 const nw=ws?ws.filter(w=>S.due[w.id]===undefined).length:0;
 const d=document.createElement("div");d.className="ov";
 d.innerHTML=`<div class="sh"><h3>🧠 Révisez d’abord</h3><p class="sub" style="margin:6px 0 12px">Vous avez <b>${dn} mots</b> en attente de révision. Si vous apprenez beaucoup de nouveaux mots maintenant, les anciens risquent de s’effacer de votre mémoire.</p><button class="btn" id="gr" style="width:100%">Réviser maintenant (10 mots)</button>${nw?`<button class="btn sec" id="gm" style="width:100%;margin-top:10px">Avancer en douceur (4 nouveaux + ${SES-Math.min(4,nw)} révisions)</button>`:""}${dn<GATE2?`<button class="btn sec" id="gg" style="width:100%;margin-top:10px">Apprendre quand même</button>`:`<button class="btn sec" id="gs" style="width:100%;margin-top:10px">Étaler mon retard sur les prochains jours</button><p class="sub" style="margin-top:8px">Garde les ${KEEP} mots les plus urgents pour aujourd’hui et répartit les ${dn-KEEP} autres (${PERDAY} par jour). Vos niveaux ne changent pas.</p>`}</div>`;
 d.onclick=e=>{if(e.target===d)d.remove()};d.querySelector("#gr").onclick=()=>{d.remove();session(dueSorted().slice(0,10),"Révision",ALL)};
 const g=d.querySelector("#gg");if(g)g.onclick=()=>{d.remove();go()};
 const m=d.querySelector("#gm");if(m)m.onclick=()=>{d.remove();mixSheet(t,ws)};
 const sp=d.querySelector("#gs");if(sp)sp.onclick=()=>{const k=spread();d.remove();render();toast(k+" mots répartis sur les "+Math.ceil(k/PERDAY)+" prochains jours · "+KEEP+" à réviser aujourd’hui")};
 document.body.appendChild(d)}
function sheet(t,ws,pool){
 const d=document.createElement("div");d.className="ov";
 d.innerHTML=`<div class="sh"><h3>${esc(t)}</h3>${ws.map(w=>`<div class="r"><span>${esc(w.f)}</span><span class="ar">${esc(dA(w.a))}</span></div>`).join("")}${ws.length<SES&&pool&&pool.length>ws.length?`<div class="sub" style="margin-top:8px">+ ${Math.min(SES-ws.length,pool.length-ws.length)} mot${SES-ws.length>1?"s":""} de la leçon en révision pour compléter la séance à ${SES} mots.</div>`:""}<button class="btn" style="width:100%;margin-top:14px">Commencer</button></div>`;
 d.onclick=e=>{if(e.target===d)d.remove()};
 d.querySelector("button").onclick=()=>{d.remove();session(ws,t,pool)};document.body.appendChild(d);
}
function xsheet(l){
 const d=document.createElement("div");d.className="ov";
 d.innerHTML=`<div class="sh"><h3>Expressions · ${esc(l.t.replace(/^Leçon \d+( · )?/,""))}</h3><div class="sub" style="margin-bottom:8px">Les expressions nouvelles du manuel pour cette leçon</div>${l.xw.map(w=>`<div class="r"><button class="sp" data-a="${esc(w.a)}">${SPK}</button><span>${esc(w.f)}</span><span class="ar">${esc(dA(w.a))}</span></div>`).join("")}<button class="btn" id="xgo" style="width:100%;margin-top:14px">S’entraîner</button></div>`;
 d.onclick=e=>{if(e.target===d)d.remove()};d.querySelectorAll(".sp").forEach(b=>b.onclick=()=>speak(b.dataset.a));
 d.querySelector("#xgo").onclick=()=>{d.remove();session(l.xw,"Expressions",ALLEX)};document.body.appendChild(d)}
const MST=3,isM=w=>lvl(w)>=MST;
const STR=[["fb","Faible",w=>lvl(w)<=1],["mo","Moyen",w=>lvl(w)==2],["so","Maîtrisé",w=>lvl(w)>=MST]];
const dueTxt=w=>{const t=S.due[w.id];if(t===undefined)return"";const d=Math.ceil((t-Date.now())/864e5);return d<=0?"à revoir":d==1?"demain":"dans "+d+" j"};
function vRev(v){
 const seenW=ALL.filter(w=>S.due[w.id]!==undefined),due=shuffle(ALL.filter(isDue)).sort((a,b)=>lvl(a)-lvl(b)),nw=ALL.length-seenW.length;
 const G=STR.map(([k,n,f])=>[k,n,seenW.filter(f).sort((a,b)=>lvl(a)-lvl(b)||(S.due[a.id]-S.due[b.id]))]);
 const fc=[...Array(7)].map((_,i)=>{const e=new Date();e.setHours(23,59,59,999);const end=e.getTime()+i*864e5,st=i?end-864e5:-Infinity;return seenW.filter(w=>S.due[w.id]>st&&S.due[w.id]<=end).length}),mx=Math.max(1,...fc);
 const nxt=seenW.filter(w=>!isDue(w)).sort((a,b)=>S.due[a.id]-S.due[b.id])[0];
 let h=`<div class="card"><b>🧠 Aujourd’hui</b><div style="font-size:1.6rem;font-weight:800;margin:6px 0">${due.length} mot${due.length>1?"s":""} à revoir</div>${due.length?`<button class="btn" id="rdo" style="width:100%">Réviser maintenant (${Math.min(10,due.length)})</button>`:`<div class="sub">Rien à revoir pour l’instant${nxt?" · prochaine révision : "+dueTxt(nxt):""}. Continuez le parcours pour découvrir de nouveaux mots.</div>`}</div>`;
 const HL=hardList();h+=`<details class="card hd"${HL.length?" open":""}><summary><b>📕 Carnet des mots difficiles</b> <span class="sub">· ${HL.length} mot${HL.length>1?"s":""}</span></summary><div class="sub" style="margin:6px 0 8px">Un mot raté 2 fois y entre automatiquement et en sort après 3 bonnes réponses d’affilée. Vous pouvez aussi en ajouter depuis la fiche d’un mot (☆).</div>${HL.length?`<button class="btn" id="hdo" style="width:100%;margin-bottom:8px">S’entraîner sur le carnet (${Math.min(10,HL.length)})</button>`+HL.slice(0,300).map(w=>`<div class="wr" data-a="${esc(w.a)}"><span class="wf">${esc(w.f)}<br><small class="tg du">${S.pin.includes(w.id)?"ajouté par vous":"raté "+(S.err[w.id]||0)+" fois"}</small> <small class="sub">${S.ok[w.id]?S.ok[w.id]+"/3 réussites":""}</small></span><span class="ar wa">${arHtml(w.a)}</span></div>`).join(""):`<div class="sub">Aucun mot difficile pour l’instant.</div>`}</details>`;
 h+=`<div class="card"><b>Force de vos mots</b><div class="seg">${G.map(([k,n,ws])=>ws.length?`<i class="${k}" style="flex:${ws.length}"></i>`:"").join("")}${nw?`<i class="nv" style="flex:${nw}"></i>`:""}</div><div class="lg">${G.map(([k,n,ws])=>`<span><i class="${k}"></i>${n} ${ws.length}</span>`).join("")}<span><i class="nv"></i>Pas encore vus ${nw}</span></div></div>`;
 h+=`<div class="card"><b>Révisions des 7 prochains jours</b><div class="wk">${fc.map((x,i)=>`<div><b class="sub" style="font-size:.7rem">${x||""}</b><i style="height:${x/mx*70}px"></i><small>${i?"DLMMJVS"[new Date(Date.now()+i*864e5).getDay()]:"Auj."}</small></div>`).join("")}</div></div>`;
 h+=G.map(([k,n,ws])=>`<details class="card gr"${k=="fb"&&ws.length?" open":""}><summary><b><i class="dt ${k}"></i>${n}</b> <span class="sub">· ${ws.length} mot${ws.length>1?"s":""}</span></summary>${ws.length?`<button class="btn sec" data-tr="${k}" style="width:100%;margin:8px 0">S’entraîner sur ces mots</button>`+(ws.length>150?`<div class="sub" style="margin-bottom:6px">Les 150 premiers sont affichés ; retrouvez les autres dans l’onglet Mots.</div>`:"")+ws.slice(0,150).map(w=>`<div class="wr" data-a="${esc(w.a)}"><span class="wf">${esc(w.f)}<br><small class="tg ${isDue(w)?"du":""}">${dueTxt(w)}</small> <small class="sub">${THN[thOf(w.li)][0]} · Leçon ${lnum(w.li)}</small></span><span class="ar wa">${arHtml(w.a)}</span></div>`).join(""):`<div class="sub" style="margin-top:6px">Aucun mot dans cette catégorie.</div>`}</details>`).join("");
 h+=`<div class="sub" style="text-align:center;margin:6px 0 14px">Faible : niveau 0–1 · Moyen : 2 · Maîtrisé : 3 à 5 (c’est ce chiffre qui compte dans « mots maîtrisés »). Chaque bonne réponse espace la prochaine révision (1, 3, 7, 16 puis 35 jours, et jusqu’à 1 an pour les mots bien sus). Une erreur fait redescendre le mot et il revient vite.</div>`;
 v.innerHTML=h;
 if($("#hdo"))$("#hdo").onclick=()=>session(shuffle(HL.slice(0,10)),"Carnet des mots difficiles",ALL);
 if($("#rdo"))$("#rdo").onclick=()=>session(dueSorted().slice(0,10),"Révision",ALL);
 v.querySelectorAll("[data-tr]").forEach(b=>b.onclick=()=>{const ws=G.find(g=>g[0]==b.dataset.tr)[2];const pr=[...ws.filter(isDue),...ws.filter(w=>!isDue(w))];session(pr.slice(0,10),"Révision · "+STR.find(x=>x[0]==b.dataset.tr)[1],ALL)});
 v.querySelectorAll(".wr").forEach(r=>r.onclick=()=>fiche(ALL.find(x=>x.a===r.dataset.a)));
}
function fiche(w){
 const P=isPl(w)?w.pl:isFem(w)?dA(w.a).match(FEM).slice(1,3):parts(w),L=isPl(w)?["Singulier","Pluriel"]:isFem(w)?["Masculin","Féminin"]:isPres(w)?["Accompli (passé)","Inaccompli (présent)"]:isV3(w)?["Passé","Présent","Nom verbal"]:isV2(w)?["Passé","Nom verbal"]:isPl(w)?["Singulier","Pluriel"]:null,d=document.createElement("div");d.className="ov";
 d.innerHTML=`<div class="sh"><div class="ar" style="font-size:2.2rem;text-align:center;line-height:1.8">${esc(dA(w.a))}</div><h3 style="text-align:center">${esc(w.f)}</h3>${L?L.map((n,i)=>`<div class="r"><span class="sub">${n}</span><span class="ar">${esc(P[i].replace(/\s*\(ـ\)/,""))}</span></div>`).join(""):""}${moreHtml(w)}${cxHtml(w)}<div class="dots" style="text-align:center;margin:10px">${"●".repeat(lvl(w))}<s>${"●".repeat(5-lvl(w))}</s> niveau ${lvl(w)}/5${S.due[w.id]!==undefined?" · révision "+dueTxt(w):""}</div><div class="row" style="gap:8px"><button class="btn lis" style="flex:1">${SPK} Écouter</button><button class="btn sec" id="pin" style="flex:1">${isHard(w)?"★ Retirer du carnet":"☆ Mot difficile"}</button></div>${famHtml(w)}</div>`;
 d.onclick=e=>{if(e.target===d)d.remove()};d.querySelector(".lis").onclick=()=>speak(w.a);
 d.querySelector("#pin").onclick=()=>{togglePin(w);d.remove();fiche(w);if(tab=="rev"||tab=="path")render()};
 d.querySelectorAll("[data-fa]").forEach(b=>b.onclick=()=>{const x=ALL.find(y=>y.a===b.dataset.fa);if(x&&x!==w){d.remove();fiche(x)}});
 const ft=d.querySelector("#ftr");if(ft)ft.onclick=()=>{const f=famOf(w);d.remove();session(famSet(f),"Famille "+w.r.replace(/ /g,""),f)};document.body.appendChild(d)}
function vWords(v){
 v.innerHTML=nvBar()+`<input id="sr" class="in" placeholder="Rechercher un mot (français, arabe ou racine : ك ت ب)…"><div id="ls"></div>`;nvWire(v);
 const f=()=>{const raw=$("#sr").value.trim(),q=norm(raw),qa=arN(raw),CN=curNv(),qr=arN(raw).replace(/\s/g,""),hit=w=>(q&&norm(w.f).includes(q))||(qa&&/[\u0600-\u06FF]/.test(qa)&&arN(w.a).includes(qa))||(qr.length==3&&w.r&&arN(w.r).replace(/\s/g,"")==qr);let nh=0;
  $("#ls").innerHTML=LESSONS.map(l=>{if(!raw&&(l.nv||1)!=CN)return"";if(raw&&nh>=300)return"";const r=l.w.filter(w=>!raw||hit(w));const rx=l.xw.filter(w=>!raw||hit(w));nh+=r.length;return r.length||rx.length?`<div class="lh th-${thOf(LESSONS.indexOf(l))}"><i></i><div><small>${THN[thOf(LESSONS.indexOf(l))][0]} · Leçon ${lnum(LESSONS.indexOf(l))}</small><b>${esc(l.t.replace(/^Leçon \d+( · )?/,""))}</b></div>${l.ta?`<span class="ar">${esc(l.ta.replace(/^[^:]*:\s*/,""))}</span>`:""}</div><div class="lb">`+(rx.length?`<details class="xd"><summary class="sub">💬 ${rx.length} expression${rx.length>1?"s":""}</summary>${rx.map(w=>`<div class="wr xr"><button class="sp sm" data-a="${esc(w.a)}" aria-label="Écouter">${SPK}</button><span class="wf">${esc(w.f)}</span><span class="ar wa"><span class="am">${esc(dA(w.a))}</span></span></div>`).join("")}</details>`:"")+r.map(w=>{const[k,n]=STRN(w);return`<div class="wr" data-a="${esc(w.a)}"><button class="sp sm" data-a="${esc(w.a)}" aria-label="Écouter">${SPK}</button><span class="wf">${esc(w.f)}<br><small class="pl ${k}">${n}</small></span><span class="ar wa">${arHtml(w.a)}</span></div>`}).join("")+"</div>":""}).join("");
  $("#ls").querySelectorAll(".sp").forEach(b=>b.onclick=()=>speak(b.dataset.a));$("#ls").querySelectorAll(".wr:not(.xr)").forEach(r=>r.onclick=e=>{if(!e.target.closest(".sp"))fiche(ALL.find(x=>x.a===r.dataset.a))})};
 $("#sr").oninput=f;f();
}
function vInfo(v){v.innerHTML=`<div class="card src"><b>📖 D’où vient ce vocabulaire ?</b><p>Les ${ALL.length.toLocaleString("fr-FR")} mots de Nakhla proviennent des dictionnaires de la série «&nbsp;<bdi class="ar" lang="ar">سلسلة تعليم اللغة العربية</bdi>&nbsp;» (niveaux 1 à 4), conçue par l’<b>Institut d’enseignement de la langue arabe</b> (<bdi class="ar" lang="ar">معهد تعليم اللغة العربية</bdi>) de l’<b>Université islamique Imam Muhammad ibn Saoud de Riyad</b>.</p><p>Depuis des décennies, des étudiants du monde entier apprennent l’arabe avec ces manuels. Chaque mot a été choisi pour vous faire progresser pas à pas, des premières phrases jusqu’à la lecture de vrais textes.</p><b>🌴 Continuez, chaque mot compte !</b><blockquote>On rapporte de ʿUmar ibn al-Khattâb&nbsp;: «&nbsp;Apprenez la langue arabe, car elle fait partie de votre religion.&nbsp;»</blockquote><p>Dix mots par jour, c’est plus de 3 600 mots en un an. Un palmier ne pousse pas en un jour, mais chaque goutte d’eau le fait grandir. Revenez demain, Nakhla vous attend !</p></div>`}
function vMe(v){
 const days=[...Array(7)].map((_,i)=>{const d=iso(new Date(Date.now()-(6-i)*864e5));return[d,S.days[d]||0]}),mx=Math.max(S.goal,...days.map(x=>x[1]));
 const L=lev(S.xp);v.innerHTML=`${seen()>=30&&(!S.bk||(Date.now()-new Date(S.bk))/864e5>14)?`<div class="card bkw">💾 Pensez à <a href="#" id="bkn">exporter votre progression</a> : sans sauvegarde, elle serait perdue si le navigateur est réinitialisé.</div>`:""}<div class="card"><b>Rang ${L[0]} · ${L[1]}</b><div class="bar" style="margin:8px 0"><i style="width:${(S.xp-L[2])/(L[3]-L[2])*100}%"></i></div><div class="sub">${S.xp-L[2]}/${L[3]-L[2]} XP vers le rang ${L[0]+1}</div></div><div class="grid"><div class="card st"><b>${S.xp}</b><span>XP total</span></div><div class="card st"><b>${curStreak()}</b><span>jours d’affilée</span></div><div class="card st"><b>${ALL.filter(w=>lvl(w)>=3).length}/${ALL.length}</b><span>mots maîtrisés</span></div><div class="card st"><b>${ALL.filter(w=>S.due[w.id]!==undefined).length}</b><span>mots vus</span></div></div>
 <div class="card"><b>7 derniers jours</b><div class="wk">${days.map(([d,x])=>`<div><i style="height:${x/mx*80}px;${x>=S.goal?"background:var(--y)":""}"></i><small>${"DLMMJVS"[new Date(d+"T12:00").getDay()]}</small></div>`).join("")}</div></div>
 ${typeof VOCAB_INLINE=="undefined"?`<div class="card"><b>📲 Installer / hors ligne</b>${DP?'<button class="btn" id="ins" style="width:100%;margin-top:8px">Installer l’application</button>':'<div class="sub" style="margin-top:6px">iPhone : Partager → Sur l’écran d’accueil. Android / PC : menu du navigateur → Installer. Après une première ouverture en ligne, l’app fonctionne sans connexion.</div>'}</div>`:""}${hasSp?"":`<div class="card"><b>🔈 Voix arabe absente</b><div class="sub" style="margin-top:6px">Votre appareil n’a pas de voix arabe : les boutons 🔊 restent muets et l’exercice d’écoute est désactivé. Pour l’installer :<br>• <b>Android</b> : Paramètres → Système → Langues → Synthèse vocale → moteur Google → Installer les données vocales → Arabe.<br>• <b>iPhone / iPad</b> : Réglages → Accessibilité → Contenu énoncé → Voix → Arabe.<br>• <b>Windows</b> : Paramètres → Heure et langue → Voix → Ajouter des voix → Arabe.<br>• <b>Mac</b> : Réglages → Accessibilité → Contenu énoncé → Voix du système → Gérer les voix → Arabe.<br>Puis relancez l’application.</div></div>`}<div class="card"><b>💾 Sauvegarde de la progression</b><div class="sub" style="margin:6px 0">Votre progression est enregistrée dans ce navigateur seulement. Exportez-la dans un fichier pour la garder en sécurité ou la transférer sur un autre appareil.</div><div class="sub" style="margin-bottom:8px">Dernière sauvegarde : <b>${S.bk?new Date(S.bk+"T12:00").toLocaleDateString("fr-FR"):"jamais"}</b></div><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" id="bex" style="flex:1">Exporter</button><label class="btn sec" style="flex:1;text-align:center;cursor:pointer">Importer<input type="file" id="bim" accept=".json,application/json" hidden></label></div></div><div class="card"><b>Boutique</b> <span class="sub">· vous avez 💎${S.gem}</span><div class="row" style="margin-top:8px"><button class="btn sec" id="sh2" ${S.gem<50||S.fz>=2?"disabled":""}>🧊 Gel 💎50 (${S.fz}/2)</button></div><div class="row" style="margin-top:8px;flex-wrap:wrap"><button class="btn sec shopb" id="sx2" ${S.gem<100?"disabled":""}>⚡ XP ×2 pour 3 séances 💎100${S.x2?" ("+S.x2+" restantes)":""}</button>${S.ls&&(new Date(today())-new Date(S.ls.d))/864e5<=7?`<button class="btn sec shopb" id="slr" ${S.gem<200?"disabled":""}>🔧 Récupérer ma série de ${S.ls.v} jours 💎200</button>`:""}</div><div class="sub" style="margin-top:6px">Chaque gel sauve votre série pour un jour manqué (2 au maximum). Une série perdue peut être récupérée pendant 7 jours.</div><div class="row" style="margin-top:8px;flex-wrap:wrap">${Object.entries(ACCN).map(([k,[n,pr]])=>{const o=S.own.includes(k);return`<button class="btn sec" data-ac="${k}" ${!o&&S.gem<pr?"disabled":""}>${o?(S.on==k?"✔ ":"")+n:n+" 💎"+pr}</button>`}).join("")}</div></div>
 <div class="card"><b>Calendrier d’activité</b><div class="cal">${[...Array(28)].map((_,i)=>{const x=S.days[iso(new Date(Date.now()-(27-i)*864e5))]||0;return`<i class="${x>=S.goal?"gl":x?"on":""}"></i>`}).join("")}</div></div>
 <div class="card"><b>Badges ${Object.keys(S.bd).length}/${BD.length}</b><div class="bds" style="margin-top:8px">${BD.map(b=>`<div class="bdg ${S.bd[b[0]]?"":"off"}">${bsv(b[0])}${b[2]}</div>`).join("")}</div></div>
 <div class="card"><b>Expressions de Nakhla ${S.ex.length}/${Object.keys(EXN).length}</b><div class="bar" style="margin:8px 0"><i style="width:${S.ex.length/Object.keys(EXN).length*100}%"></i></div><div class="gx">${Object.keys(EXN).map(k=>{const o=S.ex.includes(k);return`<div class="${o?"":"lk"}">${nk(o?k:"happy",58)}<small>${o?EXN[k]:EXH[k]}</small></div>`}).join("")}</div></div>
 <div class="card"><b>Accessibilité</b><div class="row" style="margin:8px 0">${[1,1.2,1.4].map((z,i)=>`<button class="btn ${S.az==z?"":"sec"}" data-az="${z}">${["A","A+","A++"][i]}</button>`).join("")}</div><div class="row"><button class="btn sec" id="hc">${S.hc?"✔ ":""}Contraste</button><button class="btn sec" id="rm">${S.rm?"✔ ":""}Sans animations</button></div></div>
 <div class="card"><b>Objectif quotidien</b><div class="row" style="margin:8px 0">${[[100,"1 séance"],[200,"2 séances"],[300,"3 séances"]].map(([g,n])=>`<button class="btn ${S.goal==g?"":"sec"}" data-g="${g}">${g} XP<small style="display:block;font-size:.65rem;opacity:.8">≈ ${n}</small></button>`).join("")}</div><button class="btn sec" id="sn" style="width:100%">${S.snd?"🔊 Sons activés":"🔇 Sons coupés"}</button></div>
 <div class="card"><b>Ajouter un tableau</b><div class="sub">Une ligne par mot : arabe|français</div><input id="it" class="in" placeholder="Titre (ex. Leçon 8)"><textarea id="id" class="in ar" rows="5" placeholder="عِلْمٌ / عُلومٌ|Science(s)"></textarea><button class="btn" id="ia" style="width:100%">Ajouter</button><div class="sub" id="im" style="margin-top:6px"></div></div>
 <button class="btn red" id="rs" style="width:100%">Réinitialiser la progression</button><div class="sub" style="text-align:center;margin-top:6px">Efface mots appris, XP, série, gemmes, badges et achats. Vos réglages et tableaux ajoutés sont conservés.</div>`;
 v.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{S.goal=+b.dataset.g;save();render()});
 $("#sn").onclick=()=>{S.snd=S.snd?0:1;save();render();sGood()};
 if($("#upv"))$("#upv").onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const j=JSON.parse(t);if(!j.lecons)throw 0;try{localStorage.setItem("av-vocab",JSON.stringify(j))}catch(x){}setVocab(j);render();alert("Vocabulaire mis à jour : "+j.lecons.length+" leçons")}catch(x){alert("Fichier JSON invalide")}})};
 $("#bex").onclick=exportProg;if($("#bkn"))$("#bkn").onclick=e=>{e.preventDefault();exportProg()};$("#bim").onchange=e=>{const f=e.target.files[0];if(f)importProg(f)};
 if($("#ins"))$("#ins").onclick=()=>{DP.prompt();DP=null;render()};
 $("#sh2").onclick=()=>{S.gem-=50;S.fz++;save();render()};
 if($("#sx2"))$("#sx2").onclick=()=>{if(S.gem<100)return;S.gem-=100;S.x2=(S.x2||0)+3;save();render()};
 if($("#slr"))$("#slr").onclick=()=>{if(S.gem<200||!S.ls)return;S.gem-=200;S.streak+=S.ls.v;S.ls=null;save();render()};
 v.querySelectorAll("[data-ac]").forEach(b=>b.onclick=()=>{const k=b.dataset.ac,pr=ACCN[k][1];if(S.own.includes(k))S.on=S.on==k?"":k;else if(S.gem>=pr){S.gem-=pr;S.own.push(k);S.on=k}else return;save();render()});
 v.querySelectorAll("[data-az]").forEach(b=>b.onclick=()=>{S.az=+b.dataset.az;save();applyA();render()});$("#hc").onclick=()=>{S.hc=S.hc?0:1;save();applyA();render()};$("#rm").onclick=()=>{S.rm=S.rm?0:1;save();applyA();render()};
 $("#ia").onclick=()=>{const d=$("#id").value,n=parse(d).length;if(!n){$("#im").textContent="Aucune ligne valide (arabe|français).";return}
  const c={t:$("#it").value.trim()||"Leçon "+(LESSONS.length+1),d};S.custom.push(c);LESSONS.push(c);build();buildPh();save();$("#im").textContent=n+" mots ajoutés au parcours ✔"};
 v.querySelectorAll(":scope>.card").forEach(c=>{const t=c.querySelector("b");if(!t||t.textContent.startsWith("Rang"))return;const d=document.createElement("details");d.className="card";if(t.textContent.startsWith("Badges")||t.textContent.includes("Sauvegarde"))d.open=true;const s=document.createElement("summary");s.append(t);d.append(s,...c.childNodes);c.replaceWith(d)});
 let ok=0;$("#rs").onclick=function(){if(!ok){ok=1;this.textContent="Toucher encore pour confirmer";return}Object.assign(S,{xp:0,streak:0,last:"",lv:{},due:{},days:{},err:{},ok:{},k:{},pin:[],gem:0,fz:0,q:{},bd:{},ses:0,perf:0,own:[],on:"",ex:["happy"],bk:"",x2:0,ls:null});save();render()};
}

const lvlOK=w=>lvl(w)>=1;
const typ=w=>!/[≠=]/.test(w.f)&&!/\((?!s\))/.test(w.f);
function pick(w,p){if(w.x){const o=["a2f","f2a"].concat(hasSp&&p?["listen"]:[]);return lvlOK(w)?o[Math.random()*o.length|0]:"a2f"}const l=lvl(w),sp=isPres(w)?"pres":isPl(w)?"plu":isFem(w)?"fem":null;if(sp&&(p?Math.random()<.6:(l>=1&&Math.random()<.4)))return sp;let o=p?(l<1?["f2a"]:["listen","type","f2a"]):(l<1?["a2f"]:["f2a","listen","type","a2f"]);o=o.filter(t=>(t!="type"||typ(w))&&(t!="listen"||hasSp));return o.length?o[Math.random()*o.length|0]:"a2f"}
let DP;addEventListener("beforeinstallprompt",e=>{e.preventDefault();DP=e;if(tab=="me")render()});
const parts=w=>w.a.split(" / ").map(s=>s.trim()),masdar=w=>parts(w).at(-1);
const isV3=w=>parts(w).length==3,isV2=w=>parts(w).length==2&&/\(ـ\)/.test(parts(w)[0]);
const isPl=w=>!!(w.pl&&w.pl[0]&&w.pl[1]);
const FEM=/^(.+?)\s+–\s+(.+?)(\s*\(.*\))?$/;const isFem=w=>{const m=dA(w.a).match(FEM);return !!m&&/[ٌُ]$/.test(m[1])&&/ةٌ$|ةُ$/.test(m[2])};
const femOpts=w=>{const m=dA(w.a).match(FEM),x=m[1],y=m[2],st=x.slice(0,-1),df=/ُ$/.test(x);return shuffle([y,st+(df?"َاتُ":"َاتٌ"),st+"ُونَ",st+"َانِ"]).map(v=>({x:v,ok:v===y}))};
const plOpts=w=>{const [sg,pl]=w.pl,df=/^ال/.test(pl),c=new Set([pl]),d=[];if(!/ات[ٌُ]?$/.test(pl)&&!/ة[ٌُ]$/.test(sg)&&/[ٌُ]$/.test(sg))d.push(sg.slice(0,-1)+(df?"َاتُ":"َاتٌ"));for(const x of shuffle(ALL.filter(z=>z.pl&&z!==w&&/^ال/.test(z.pl[1])===df))){if(d.length>=3)break;if(!c.has(x.pl[1])&&!d.includes(x.pl[1]))d.push(x.pl[1])}return shuffle([pl,...d.slice(0,3)]).map(v=>({x:v,ok:v===pl}))};
const strp=x=>x.replace(/\s*\(.*?\)/g,"").trim();
const PRES=/^يَ(.)ْ(.)([َُِ])(.)ُ$/,PAST=/^(.)َ(.)([َُِ])(.)َ$/;
const isPres=w=>{const P=parts(w);return P.length==2&&PAST.test(strp(P[0]))&&PRES.test(strp(P[1]))};
const presOpts=w=>{const c=strp(parts(w)[1]),m=c.match(PRES);return shuffle(["َ","ِ","ُ"].map(v=>{const x="يَ"+m[1]+"ْ"+m[2]+v+m[4]+"ُ";return{x,ok:x===c}}))};
const isAn=w=>w.a.includes("≠")&&w.f.includes("≠");
const mk=(ans,pl,get)=>{const s=new Set([ans]),d=[];for(const x of shuffle(pl)){const v=get(x);if(!s.has(v)){s.add(v);d.push(v)}if(d.length>=3)break}return shuffle([ans,...d]).map(v=>({x:v,ok:v===ans}))};
function uniqPairs(ws){const u=new Set(),r=[];for(const w of shuffle(ws)){if(!u.has(w.f)&&!u.has(w.a)&&!r.some(y=>sameMean(y,w))){u.add(w.f);u.add(w.a);r.push(w)}if(r.length>=5)break}return r}
/* ---- Phrases : débloquées quand tous leurs mots ont été vus ---- */
let PH=[],PHL={};const PTK=/[\u0621-\u064A\u064B-\u065F\u0670\u0671\u06D6-\u06ED]+/g;
function buildPh(){const F=((J0&&J0.lecons)||[]).flatMap(l=>l.mots.map(m=>m.ar)),L={};LESSONS.forEach((l,i)=>(l.w||[]).forEach(w=>{if(L[w.id]===undefined)L[w.id]=i}));
 PH=((J0&&J0.phrases)||[]).map(p=>({id:"ph:"+F[p[2]]+"|"+p[0],a:p[0],f:p[1],src:F[p[2]],k:p[3],req:p[4].filter(x=>x>=0).map(x=>F[x]),q:p[5],ph:1,x:1,tk:p[0].match(PTK)||[]})).filter(p=>p.src!==undefined&&p.tk[p.k]);
 PHL={};PH.forEach(p=>{const li=L[p.src];if(li!==undefined)(PHL[li]=PHL[li]||[]).push(p)})}
const phOpen=p=>S.due[p.src]!==undefined&&p.req.every(id=>S.due[id]!==undefined);
const phOrd=p=>!p.q&&p.tk.length>=3&&p.tk.length<=9;
const phHole=p=>{let j=-1;return esc(p.a).replace(/[\u0621-\u064A\u064B-\u065F\u0670\u0671\u06D6-\u06ED]+/g,m=>++j===p.k?'<span class="hole">ـــــ</span>':m)};
function phSet(li){const own=(PHL[li]||[]).filter(phOpen),ids=new Set(own.map(p=>p.id)),oth=PH.filter(p=>!ids.has(p.id)&&phOpen(p)),nw=a=>shuffle(a.filter(p=>S.due[p.id]===undefined)),du=a=>shuffle(a.filter(p=>S.due[p.id]!==undefined&&isDue(p))),ot=a=>a.filter(p=>S.due[p.id]!==undefined&&!isDue(p)).sort((a,b)=>lvl(a)-lvl(b)||(S.due[a.id]-S.due[b.id]));
 const r=[],seen=new Set();for(const p of [...nw(own),...du(own),...du(oth),...nw(oth),...ot(own),...ot(oth)]){if(r.length>=6)break;if(!seen.has(p.a)){seen.add(p.a);r.push(p)}}return r}
function phPlan(ps){let e=[];ps.forEach(p=>{const l=lvl(p),o=phOrd(p);if(l<1){e.push({w:p,t:"pmean"});e.push({w:p,t:"cloze"})}else if(l<2||!o){e.push({w:p,t:"cloze"});e.push({w:p,t:o?"porder":"pmean"})}else{e.push({w:p,t:Math.random()<.5?"cloze":"porder"});e.push({w:p,t:"ptrans"})}});return shuffle(e)}
const phDue=()=>PH.filter(p=>S.due[p.id]!==undefined&&isDue(p)&&phOpen(p)).sort((a,b)=>S.due[a.id]-S.due[b.id]);
/* révision en contexte : un mot connu revient parfois dans une de ses phrases */
const ctxOf=w=>{if(w.x||lvl(w)<2)return null;const c=PH.filter(p=>p.src===w.id&&phOpen(p));return c.length?c[Math.random()*c.length|0]:null};
const phOpts=(p,t)=>{if(t=="pmean"){const o=[p.f];for(const x of shuffle(PH)){if(o.length>=3)break;if(x.f!==p.f&&Math.abs(x.f.length-p.f.length)<p.f.length*.6+12&&!o.includes(x.f))o.push(x.f)}return shuffle(o).map(x=>({x,ok:x===p.f}))}
 const c=p.tk[p.k],al=/^(و|ف)?(ال|لل)/.test(dA(c).replace(/[\u064B-\u065F\u0670]/g,"")),bare=s=>s.replace(/[\u064B-\u065F\u0670]/g,""),o=[c];
 for(const x of shuffle(PH)){if(o.length>=4)break;const y=x.tk[x.k];if(!y||o.some(z=>bare(z)===bare(y)))continue;if(/^(و|ف)?(ال|لل)/.test(bare(y))!==al)continue;o.push(y)}return shuffle(o).map(x=>({x,ok:x===c}))};
function phSheet(li){const l=LESSONS[li],all=PHL[li]||[],op=all.filter(phOpen),d=document.createElement("div");d.className="ov";
 d.innerHTML=`<div class="sh"><h3>Phrases · ${esc(l.t.replace(/^Leçon \d+( · )?/,"")||"Vocabulaire")}</h3><p class="sub" style="margin:4px 0 10px">${op.length} phrase${op.length>1?"s":""} débloquée${op.length>1?"s":""} sur ${all.length}. Une phrase se débloque quand vous avez vu <b>tous ses mots</b> : vous la comprenez presque entièrement, et le mot de la leçon prend vie dans son contexte.</p>${op.slice(0,5).map(p=>`<div class="r ph"><button class="sp" data-a="${esc(p.a)}">${SPK}</button><span class="ar">${esc(p.a)}</span><small>${esc(p.f)}</small></div>`).join("")}${op.length>5?`<div class="sub">… et ${op.length-5} autre${op.length-5>1?"s":""}</div>`:""}${op.length?`<button class="btn" id="pgo" style="width:100%;margin-top:14px">S’entraîner${op.length<6?` (+ ${Math.min(6,PH.filter(phOpen).length)-op.length} phrases d’autres leçons)`:""}</button>`:`<p class="sub" style="margin-top:10px">🔒 Avancez dans les étapes de cette leçon pour débloquer ses premières phrases.</p>`}</div>`;
 d.onclick=e=>{if(e.target===d)d.remove()};d.querySelectorAll(".sp").forEach(b=>b.onclick=()=>speak(b.dataset.a));const g=d.querySelector("#pgo");if(g)g.onclick=()=>{d.remove();session(phSet(li),"Phrases · "+l.t,null)};document.body.appendChild(d)}
function plan(ws){if(ws[0]&&ws[0].ph)return phPlan(ws);let e=[];ws.forEach(w=>{const cp=Math.random()<.35&&ctxOf(w);e.push(cp?{w,t:"ctx",p:cp}:{w,t:pick(w,0)});if(ws.length<=8)e.push({w,t:pick(w,1)})});e=shuffle(e);const mp=uniqPairs(ws);if(mp.length>=3)e.splice(Math.min(4,e.length),0,{t:"match",ws:mp});return e}
const PR=["Excellent !","Bravo !","Parfait !","Super !"];
function confetti(){for(let i=0;i<30;i++){const s=document.createElement("span");s.className="cf";s.textContent=["🎉","⭐","✨","🎊"][i%4];s.style.cssText=`left:${Math.random()*100}%;animation-delay:${Math.random()}s`;document.body.appendChild(s);setTimeout(()=>s.remove(),4000)}}

function session(ws,title,pool,mode){
 if(!ws.length)return;pool=pool||ws;if(mode!="ex"&&ws.length<SES&&!ws[0].x){const ids=new Set(ws.map(w=>w.id)),ex=shuffle(pool.filter(w=>!ids.has(w.id)&&!w.x));const pr=[...ex.filter(isDue),...ex.filter(w=>S.due[w.id]!==undefined&&!isDue(w)).sort((a,b)=>lvl(a)-lvl(b)),...ex.filter(w=>S.due[w.id]===undefined)];ws=[...ws,...pr.slice(0,SES-ws.length)]}
 const ex0=[...S.ex],gd=new Set(),FL=new Set();let combo=0,xp=0,ok=0,tot=0,done=0,cur,miss=0;const q=mode=="ex"?ws.map(w=>({w,t:"flash"})):plan(ws),n0=q.length;
 const top=()=>`<div class="top"><button class="x" id="x" aria-label="Quitter">${IC(I.x)}</button><div class="bar"><i style="width:${done/n0*100}%"></i></div><b>${combo>=3?"🔥 "+combo:""}</b><span class="tm">${nk("happy",52)}</span></div>`;
 const grade=(c,w)=>{
  tot++;const e=cur;const mo=c?(combo+1>=5?"cool":combo+1>=3?"wink":"cheer"):"sad",tm=$(".tm");uk(mo);if(tm)tm.innerHTML=nk(mo,52);
  if(w&&!e.retry&&!w.x)srs(w,c,gd);else if(w&&!e.retry&&!(w.ph&&c&&gd.has(w.id))){if(w.ph)gd.add(w.id);const l=lvl(w),nl=c?Math.min(5,l+1):Math.max(0,l-1);S.lv[w.id]=nl;S.due[w.id]=Date.now()+IV[nl]*864e5}
  if(w&&!w.x&&!w.ph){if(!c&&!e.retry)FL.add(w.id);else if(c&&e.retry&&FL.has(w.id)){FL.delete(w.id);S.due[w.id]=Date.now()+864e5*(.9+Math.random()*.2)}}
  if(c){ok++;combo++;xp+=e.t=="flash"?5:(e.retry?5:10)+(combo>=5?2:0);sGood(combo)}else{combo=0;miss++;sBad()}
  save();const fb=$("#fb");fb.className="fbar "+(c?"ok":"ko");
  fb.innerHTML=`<div class="fm"><span class="fi">${IC(c?I.check:I.x)}</span><b>${c?PR[Math.random()*4|0]+(combo>=3?" 🔥×"+combo:""):"Réponse correcte"}</b>${w?(w.ph?`<div class="phfb"><span class="ar">${esc(w.a)}</span><div>${esc(w.f)}</div></div>`:`<div><span class="ar">${esc(dA(w.a))}</span> — ${esc(w.f)}</div>${e&&e.p?`<div class="phfb"><span class="ar">${esc(e.p.a)}</span><div>${esc(e.p.f)}</div></div>`:moreHtml(w,1)+cxHtml(w)}`):""}</div><button class="btn ${c?"":"red"}" id="nx">Continuer</button>`;
  $("#nx").onclick=()=>{if(c||e.t=="match")done++;else{const r=(e.retry||0)+1,ne={...e,retry:r};if((r>=2||ne.t=="flash")&&ne.w)ne.t=ne.w.ph?"pmean":"a2f";q.splice(Math.min(2,q.length),0,ne)}step()};
 };
 const opts=(w,k)=>{const o=[w];for(const x of [...shuffle(pool),...shuffle(ALL)]){if(o.length>=4)break;if(!o.some(y=>y[k]===x[k]||sameMean(x,y)))o.push(x)}return shuffle(o)};
 const quit=()=>{if(xp>0){const m=[];bumpStreak(m);addXP(xp,m);xp=0;save()}FC=1;render()};
 const step=()=>{
  if(!q.length)return fin();
  scrollTo(0,0);cur=q.shift();const{w,t}=cur;let body="",o,L,R,cor;
  if(t=="match"){
   L=shuffle(cur.ws);R=shuffle(cur.ws);
   body=`<div class="q"><div class="sub">Associez les paires</div></div><div class="mt"><div>${L.map((x,j)=>`<button class="opt ar sm" data-s="l" data-j="${j}">${esc(dA(x.a))}</button>`).join("")}</div><div>${R.map((x,j)=>`<button class="opt sm" data-s="r" data-j="${j}">${esc(x.f)}</button>`).join("")}</div></div>`;
  }else if(t=="type"){
   body=`<div class="q"><div class="sub">Écrivez la traduction en français</div><div class="big ar">${esc(dA(w.a))}</div><button class="sp" id="sp">${SPK}</button></div><input id="ti" class="in" autocomplete="off" autocapitalize="off">`;
  }else if(t=="vm"||t=="plu"||t=="ant"||t=="pres"||t=="fem"){
   const P=parts(w);let q,sh;
   if(t=="pres"){sh=strp(P[0]);q="Quel est l’inaccompli (المُضَارِع) de ce verbe ?";o=presOpts(w)}
   else if(t=="vm"){sh=P[0].replace(/\s*\(ـ\)/,"");q="Quel est le nom verbal (المصدر) de ce verbe ?";o=mk(masdar(w),ALL.filter(x=>x!==w&&(isV2(x)||isV3(x))),masdar)}
   else if(t=="plu"){sh=w.pl[0];q="Quel est le pluriel (الجَمْع) de ce mot ?";o=plOpts(w)}
   else if(t=="fem"){sh=dA(w.a).match(FEM)[1];q="Quel est le féminin (المُؤَنَّث) de ce mot ?";o=femOpts(w)}
   else{const A=w.a.split("≠").map(s=>s.trim()),i=Math.random()<.5?0:1;sh=A[i];q="Quel est le contraire de ce mot ?";o=mk(A[1-i],ALL.filter(x=>x!==w&&isAn(x)),x=>x.a.split("≠")[Math.random()<.5?0:1].trim())}
   cor=o.find(z=>z.ok);
   body=`<div class="q"><div class="sub">${q}</div><div class="big ar">${esc(sh)}</div><div class="sub">${esc(w.f)}</div></div><div class="opts">${o.map(z=>`<button class="opt ar">${esc(z.x)}</button>`).join("")}</div>`;
  }else if(t=="pmean"||t=="cloze"){
   o=phOpts(w,t);cor=o.find(z=>z.ok);
   body=t=="pmean"?`<div class="q"><div class="sub">Que signifie cette phrase ?</div><div class="big ar phr">${esc(w.a)}</div><button class="sp" id="sp">${SPK}</button></div><div class="opts">${o.map(z=>`<button class="opt phf">${esc(z.x)}</button>`).join("")}</div>`
   :`<div class="q"><div class="sub">Complétez la phrase</div><div class="big ar phr">${phHole(w)}</div><div class="fr">${esc(w.f)}</div></div><div class="opts">${o.map(z=>`<button class="opt ar">${esc(z.x)}</button>`).join("")}</div>`;
  }else if(t=="flash"){
   body=`<div class="q"><div class="sub">Révision express · connaissez-vous ce mot ?</div><div class="big ar">${esc(dA(w.a))}</div><button class="sp" id="sp">${SPK}</button><div class="flans" id="fla" hidden>${esc(w.f)}</div></div>`;
  }else if(t=="ctx"){
   o=phOpts(cur.p,"cloze");cor=o.find(z=>z.ok);
   body=`<div class="q"><div class="sub">Révision en contexte · complétez la phrase</div><div class="big ar phr">${phHole(cur.p)}</div><div class="fr">${esc(cur.p.f)}</div></div><div class="opts">${o.map(z=>`<button class="opt ar">${esc(z.x)}</button>`).join("")}</div>`;
  }else if(t=="ptrans"){
   const ex=[];for(const x of shuffle(PH)){if(ex.length>=3)break;for(const y of shuffle(x.tk)){if(!w.tk.includes(y)&&!ex.includes(y)){ex.push(y);break}}}
   const vo=shuffle([...w.tk.map(x=>({x,r:1})),...ex.map(x=>({x,r:0}))]);
   body=`<div class="q"><div class="sub">Traduisez en arabe</div><div class="fr">${esc(w.f)}</div></div><div class="pline ar" id="pl"></div><div class="opts pchips">${vo.map(z=>`<button class="opt ar">${esc(z.x)}</button>`).join("")}</div>`;
  }else if(t=="porder"){
   const vo=shuffle(w.tk.map((x,i)=>({x,i})));
   body=`<div class="q"><div class="sub">Remettez la phrase dans l’ordre</div><div class="fr">${esc(w.f)}</div></div><div class="pline ar" id="pl"></div><div class="opts pchips">${vo.map(z=>`<button class="opt ar" data-i="${z.i}">${esc(z.x)}</button>`).join("")}</div>`;
  }else if(t=="vorder"){
   const vo=shuffle(parts(w).map((x,i)=>({x,i})));
   body=`<div class="q"><div class="sub">Remettez les formes dans l’ordre</div><div class="fr">${esc(w.f)}</div></div><div class="sl">${["Passé","Présent","Nom verbal"].map((n,i)=>`<div class="slot" data-i="${i}"><small>${n}</small><span class="ar">&nbsp;</span></div>`).join("")}</div><div class="opts" style="margin-top:14px">${vo.map(z=>`<button class="opt ar" data-i="${z.i}">${esc(z.x)}</button>`).join("")}</div>`;
  }else{
   const k=t=="f2a"?"a":"f";o=opts(w,k);
   body=`<div class="q"><div class="sub">${t=="f2a"?"Comment dit-on en arabe ?":t=="listen"?"Écoutez et choisissez":"Que signifie ce mot ?"}</div>${t=="f2a"?`<div class="fr">${esc(w.f)}</div>`:t=="a2f"?`<div class="big ar">${esc(dA(w.a))}</div><button class="sp" id="sp">${SPK}</button>`:`<button class="sp" id="sp" style="font-size:2.4rem;padding:16px 30px">${SPK}</button>`}</div><div class="opts">${o.map(x=>`<button class="opt ${k=="a"?"ar":""}">${esc(k=="a"?dA(x.a):x.f)}</button>`).join("")}</div>`;
  }
  app.className="exv";app.innerHTML=top()+`<div class="ex">${body}</div><div class="fbar" id="fb">${t=="type"||t=="ptrans"?'<div class="row flr"><button class="btn sec" id="idk">Je ne sais pas</button><button class="btn" id="vf">Vérifier</button></div>':t=="flash"?'<button class="btn" id="rvl" style="width:100%">Voir la réponse</button>':""}</div>`;
  $("#x").onclick=quit;
  const sp=$("#sp");if(sp)sp.onclick=()=>speak(w.a);
  if(t=="listen")setTimeout(()=>speak(w.a),300);
  const bs=[...app.querySelectorAll(".opt")];
  if(o)bs.forEach((b,j)=>b.onclick=()=>{const c=o[j]===(cor||w);bs.forEach((x,k)=>{x.disabled=true;if(o[k]===(cor||w))x.classList.add("ok")});if(!c)b.classList.add("ko");grade(c,w)});
  if(t=="flash"){$("#rvl").onclick=()=>{$("#fla").hidden=false;$("#fb").innerHTML='<div class="row flr"><button class="btn red" id="fno">Je ne savais pas</button><button class="btn" id="fyes">Je savais</button></div>';$("#fno").onclick=()=>grade(false,w);$("#fyes").onclick=()=>{grade(true,w);$("#nx").click()}}}
  if(t=="type"){$("#ti").focus();const vf=()=>{const v=norm($("#ti").value);if(!v)return;$("#ti").disabled=true;{const vv=v.replace(/^(l |la |le |les |un |une |des |se |s |etre )/,"");grade(accepted(w).some(a=>a===v||a===vv),w)}};$("#vf").onclick=vf;$("#ti").onkeydown=e=>{if(e.key=="Enter")vf()};$("#idk").onclick=()=>{$("#ti").disabled=true;grade(false,w)}}
  if(t=="ptrans"){const pl=$("#pl"),sel=[];const draw=()=>{pl.innerHTML=sel.map((b,i)=>`<span data-k="${i}">${esc(b.textContent)}</span>`).join("");pl.querySelectorAll("span").forEach(x=>x.onclick=()=>{const b=sel.splice(+x.dataset.k,1)[0];b.disabled=false;b.classList.remove("ok");draw()})};
   bs.forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;b.classList.add("ok");sel.push(b);draw()});
   $("#vf").onclick=()=>{if(!sel.length)return;const got=sel.map(b=>b.textContent).join(" "),c=got===w.tk.join(" ");bs.forEach(b=>b.disabled=true);pl.querySelectorAll("span").forEach(x=>x.onclick=null);pl.classList.add(c?"good":"bad");grade(c,w)};$("#idk").onclick=()=>{bs.forEach(b=>b.disabled=true);pl.querySelectorAll("span").forEach(x=>x.onclick=null);grade(false,w)}}
  if(t=="porder"){let nx=0,err=0;const pl=$("#pl");bs.forEach(b=>b.onclick=()=>{if(b.disabled)return;if(b.textContent===w.tk[nx]){b.disabled=true;b.classList.add("ok");pl.insertAdjacentHTML("beforeend",`<span>${esc(b.textContent)}</span>`);if(++nx==w.tk.length)grade(!err,w)}else{err=1;sBad();b.classList.add("ko");setTimeout(()=>b.classList.remove("ko"),400)}})}
  if(t=="vorder"){let nx=0,err=0;bs.forEach(b=>b.onclick=()=>{if(b.disabled)return;if(+b.dataset.i===nx){b.disabled=true;b.classList.add("ok");app.querySelector(`.slot[data-i="${nx}"] span`).textContent=b.textContent;app.querySelector(`.slot[data-i="${nx}"]`).classList.add("f");if(++nx==3)grade(!err,w)}else{err=1;b.classList.add("ko");setTimeout(()=>b.classList.remove("ko"),400)}})}
  if(t=="match"){let sel=null,left=cur.ws.length;const get=b=>(b.dataset.s=="l"?L:R)[b.dataset.j];
   bs.forEach(b=>b.onclick=()=>{if(b.classList.contains("ok"))return;
    if(sel&&sel.dataset.s!==b.dataset.s){const s=sel;sel=null;
     if(get(s)===get(b)){[s,b].forEach(x=>{x.classList.remove("on");x.classList.add("ok")});if(left>1)sTick();if(!--left)grade(true,null)}
     else{[s,b].forEach(x=>x.classList.add("ko"));sBad();setTimeout(()=>[s,b].forEach(x=>x.classList.remove("ko","on")),450)}}
    else{bs.forEach(x=>x.classList.remove("on"));sel=sel===b?null:b;if(sel)b.classList.add("on")}})}
 };
 const fin=(win=true)=>{
    if(!miss)xp+=10;
  const st0=stg(),t=today(),lv0=lev(S.xp)[0],msgs=[],nbs=[];let up=0,gm=5+(!miss?10:0);
  if(!miss)msgs.push("✨ Sans faute : +10 XP");
  if(S.x2>0){xp*=2;S.x2--;msgs.push(`⚡ XP doublée (encore ${S.x2} séance${S.x2>1?"s":""})`)}
  bumpStreak(msgs);
  const gg=addXP(xp,msgs);S.ses++;if(!miss)S.perf++;
  const lv1=lev(S.xp);if(lv1[0]>lv0){up=1;msgs.push(`🆙 Rang ${lv1[0]} : ${lv1[1]} !`)}
  const qq=dq();qq.ses++;if(!miss)qq.perf++;
  QS.forEach(([n,f,g,r],i)=>{if(f(qq)>=g&&!qq.cl.includes(i)){qq.cl.push(i);gm+=r;msgs.push(`🎯 Quête : ${n} (+💎${r})`)}});
  checkBd().forEach(b=>{gm+=5;nbs.push(b);msgs.push(`🏅 Badge « ${b[2]} » (+💎5)`)});
  const em=up?"proud":nbs.length?"love":miss?"cheer":"wow";uk(em);S.ex.filter(x=>!ex0.includes(x)).forEach(x=>msgs.push("🎭 Nouvelle expression : "+EXN[x]));
  S.gem+=gm;gm+=gg;save();
  scrollTo(0,0);app.className="endv";app.innerHTML=`<div class="end">${nk(em,170)}<h2>Séance terminée !</h2><div class="sub" style="margin-top:-6px">${esc(title)}</div><div class="grid" style="margin:16px 0;grid-template-columns:repeat(3,1fr)"><div class="card st y"><b>+${xp}</b><span>XP</span></div><div class="card st"><b>+${gm}</b><span>💎</span></div><div class="card st g"><b>${Math.round(ok/tot*100)||0}%</b><span>précision</span></div></div><div class="card"><div class="sub">Objectif du jour · ${S.days[t]}/${S.goal} XP</div><div class="bar" style="margin-top:8px"><i style="width:${Math.min(100,S.days[t]/S.goal*100)}%"></i></div></div>${nbs.map(b=>`<div class="nb">${bsv(b[0])}<b>${b[2]}</b></div>`).join("")}${msgs.map(m=>`<p>${m}</p>`).join("")}</div><div class="fbar"><div class="row" style="gap:10px"><button class="btn sec" id="c" style="flex:1">Retour</button><button class="btn" id="cn" style="flex:2">Séance suivante</button></div></div>`;
  confetti();fan();const cf=()=>document.querySelectorAll(".cf").forEach(x=>x.remove());$("#c").onclick=()=>{cf();FC=1;render()};$("#cn").onclick=()=>{cf();autoGo()};
 };
 step();
}
function migrate(){if(S.goal<100){S.goal=S.goal>=100?S.goal:100}try{localStorage.removeItem("av-vocab")}catch(e){}for(const k of["lv","due"])for(const x of Object.keys(S[k])){if(!/^\d+:/.test(x))continue;const n=x.replace(/^\d+:/,""),v=S[k][x];S[k][n]=S[k][n]===undefined?v:k=="lv"?Math.max(S[k][n],v):Math.min(S[k][n],v);delete S[k][x]}}
function applyA(){const r=document.documentElement;r.style.setProperty("--az",S.az||1);r.classList.toggle("hc",!!S.hc);r.classList.toggle("rm",!!S.rm)}
function setVocab(j){J0=j;THEMES=j.themes||{};LESSONS=reorg(j).map(l=>({nv:l.niveau||1,dic:!!l.dictionnaire,t:l.titre,ta:l.titre_ar,x:l.expressions||[],mt:Object.fromEntries(l.mots.map(m=>[m.ar,{r:m.r,q:m.q,t:m.t,pl:m.pl,sk:m.sk}])),cx:Object.fromEntries(l.mots.filter(m=>m.ex).map(m=>[m.ar,[m.ex,m.exw||"",m.exf||""]])),d:l.mots.map(m=>m.ar+"|"+m.fr).join("\n")}));(S.custom||[]).forEach(c=>LESSONS.push(c));migrate();build();buildPh();save()}
async function init(){
 let j=typeof VOCAB_INLINE!="undefined"?VOCAB_INLINE:typeof VOCAB_FILE!="undefined"?VOCAB_FILE:null;
 if(!j){try{const r=await fetch("data/vocabulaire.json");if(!r.ok)throw 0;j=await r.json()}catch(e){}}
 if(!j||!j.lecons)return pickFile();
 Object.keys(SND).forEach(k=>{try{AU[k]=new Audio(sndSrc(k));AU[k].preload="auto"}catch(e){}});applyA();setVocab(j);render();
}
function pickFile(){
 app.className="endv";app.innerHTML=`<div class="end">${nk("sad",120)}<h2>Vocabulaire introuvable</h2><p class="sub">Le fichier data/vocabulaire.json n’a pas pu être chargé (ouverture directe de index.html ?). Sélectionnez-le manuellement, ou hébergez le dossier (GitHub Pages, serveur local).</p><input type="file" id="pf" accept=".json,application/json" class="in"></div>`;
 $("#pf").onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const j=JSON.parse(t);if(!j.lecons)throw 0;try{localStorage.setItem("av-vocab",JSON.stringify(j))}catch(x){}setVocab(j);render()}catch(x){alert("Fichier JSON invalide")}})}}
init();
if("serviceWorker"in navigator&&location.protocol.startsWith("http")&&typeof VOCAB_INLINE=="undefined")navigator.serviceWorker.register("sw.js").catch(()=>{});
