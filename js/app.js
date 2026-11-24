const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cur=1,stack=[],breaks=4;
const navPages=[3,5,7,8,9,10,12,13];
const IMG={"silver": "images/img-silver.jpg", "black": "images/img-black.jpg", "rose": "images/img-rose.jpg", "gold": "images/img-gold.jpg", "pink": "images/img-pink.jpg", "classic": "images/img-classic.jpg", "flat": "images/img-flat.jpg", "wave": "images/img-wave.jpg", "star": "images/img-star.jpg", "lotus": "images/img-lotus.jpg", "moon": "images/img-moon.jpg"};
const metals={Pink:['#ffe9ef','#e8a9bb','#f9cfdb'],Silver:['#f4f6fa','#aab3c2','#e6eaf2'],Gold:['#fff0b8','#c9a24b','#f4dc93'],Black:['#6b6b78','#1d1d26','#4a4a58'],'Rose Gold':['#ffe1da','#c98f86','#f3c5bd']};
const symbols={Moon:'🌙',Star:'⭐',Flower:'🌸',Butterfly:'🦋',Sun:'☀️'};
const my={color:'Silver',sym:'Star',shape:'Classic',pat:'Lucky Star'};
function ring(m,sym,ini){const[a,b,c]=metals[m];const k='g'+Math.random().toString(36).slice(2,7);
return `<svg viewBox="0 0 260 210" width="100%" height="100%"><defs>
<linearGradient id="${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".3" stop-color="${c}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient>
<linearGradient id="${k}i" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>
<radialGradient id="${k}s"><stop offset="0" stop-color="#5b4a9e" stop-opacity=".4"/><stop offset="1" stop-color="#5b4a9e" stop-opacity="0"/></radialGradient>
<radialGradient id="${k}g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#a8d4ee"/><stop offset="1" stop-color="#5f8fc8"/></radialGradient>
<filter id="${k}b"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
<ellipse cx="130" cy="182" rx="104" ry="15" fill="url(#${k}s)"/>
<ellipse cx="130" cy="108" rx="64" ry="50" fill="none" stroke="url(#${k}i)" stroke-width="11" opacity=".85"/>
<ellipse cx="130" cy="108" rx="58" ry="44" fill="none" stroke="#0003" stroke-width="3" filter="url(#${k}b)"/>
<ellipse cx="130" cy="114" rx="78" ry="62" fill="none" stroke="url(#${k})" stroke-width="26"/>
<ellipse cx="130" cy="114" rx="91" ry="75" fill="none" stroke="#0002" stroke-width="1.2"/>
<ellipse cx="130" cy="114" rx="65" ry="49" fill="none" stroke="#0002" stroke-width="1.2"/>
<ellipse cx="130" cy="114" rx="80" ry="64" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="5" stroke-linecap="round" stroke-dasharray="60 450" stroke-dashoffset="-325" filter="url(#${k}b)"/>
<ellipse cx="130" cy="114" rx="80" ry="64" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" stroke-dasharray="26 450" stroke-dashoffset="-70" filter="url(#${k}b)"/>
<circle cx="130" cy="48" r="13" fill="${b}" opacity=".5"/>
<circle cx="130" cy="46" r="10.5" fill="url(#${k}g)" stroke="#fff" stroke-width="2"/>
<path d="M126 41l3-3" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
<text x="130" y="140" font-size="15" text-anchor="middle" opacity=".9">${sym||''}</text>
${ini?`<text x="130" y="174" font-size="13" text-anchor="middle" fill="#5b4a9e" font-weight="500">${ini}</text>`:''}</svg>`}

let cardCanvas;
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
const LK=[{c:'Lavender',h:'#b9a6ee',i:'เครื่องประดับสีเงิน',a:'เดินเล่นในสวน 10 นาที',f:['“ฉันเลือกสิ่งที่ดีให้กับตัวเอง','และพร้อมรับโอกาสใหม่ ๆ”']},{c:'Mint',h:'#9fd8c4',i:'ต้นไม้เล็ก ๆ บนโต๊ะ',a:'ยืดเส้นริมหน้าต่าง 5 นาที',f:['“ฉันค่อย ๆ ก้าวไปอย่างมั่นคง','และดูแลใจตัวเองเสมอ”']},{c:'Sky Blue',h:'#8fc5ea',i:'สร้อยข้อมือมุก',a:'มองท้องฟ้าและหายใจลึก ๆ 3 นาที',f:['“ฉันมีพลังพอสำหรับวันนี้','และพร้อมพักเมื่อต้องการ”']},{c:'Gold',h:'#e3c872',i:'แหวนทองเรียบ ๆ',a:'จดสิ่งดี ๆ 3 ข้อก่อนนอน',f:['“ฉันเห็นคุณค่าในทุกก้าวเล็ก ๆ','ที่ฉันทำ”']}];let li=0;
function applyLK(){const L=LK[li];$('#lkc').innerHTML=`<span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:${L.h};margin-right:8px;border:2px solid #fff"></span>${L.c}`;$('#lki').textContent=L.i;$('#lka').textContent=L.a;$('#lkf').textContent=L.f.join(' ')}
function nextLK(){do{li=(li+1)%LK.length}while(!has('l:'+li));applyLK();$('#rtn').textContent='เพิ่มลงใน My Routine';$('#routine').style.display='none';toast('สุ่ม Lucky Card ใหม่แล้ว ✨')}
async function makeCard(){try{await document.fonts.load('500 40px Prompt')}catch(e){}
const L=LK[li],c=cardCanvas=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d'),F='Prompt, sans-serif';
let g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#d6e9f8');g.addColorStop(.5,'#e6defa');g.addColorStop(1,'#f8f3ea');x.fillStyle=g;x.fillRect(0,0,1080,1350);
[[200,200,380,'#ffffffcc'],[900,1100,420,'#b9a6ee66'],[880,260,240,'#f4e7b866']].forEach(([a,b,r,col])=>{const q=x.createRadialGradient(a,b,0,a,b,r);q.addColorStop(0,col);q.addColorStop(1,'#ffffff00');x.fillStyle=q;x.fillRect(0,0,1080,1350)});
x.fillStyle='#c9a24b';for(let i=0;i<40;i++){x.globalAlpha=.3+Math.random()*.6;x.beginPath();x.arc(Math.random()*1080,Math.random()*1350,1+Math.random()*3,0,7);x.fill()}x.globalAlpha=1;
const st4=(cx,cy,r)=>{x.beginPath();for(let k=0;k<8;k++){const a=k*Math.PI/4-Math.PI/2,d=k%2?r*.28:r;x[k?'lineTo':'moveTo'](cx+Math.cos(a)*d,cy+Math.sin(a)*d)}x.closePath();x.fillStyle='#f7e8b8';x.fill();x.strokeStyle='#c9a24b';x.lineWidth=2.5;x.stroke()};
x.strokeStyle='#c9a24b';x.lineWidth=2.5;x.setLineDash([10,10]);const cp=[[110,250],[175,185],[250,225],[320,160]];x.beginPath();cp.forEach(([a,b],i)=>x[i?'lineTo':'moveTo'](a,b));x.stroke();x.setLineDash([]);x.fillStyle='#f7e8b8';cp.forEach(([a,b])=>{x.beginPath();x.arc(a,b,9,0,7);x.fill();x.stroke()});
st4(950,200,46);st4(860,290,20);st4(120,1010,22);
[[150,1190],[930,1190]].forEach(([cx,cy])=>[-50,-25,0,25,50].forEach(a=>{x.save();x.translate(cx,cy+60);x.rotate(a*Math.PI/180);x.fillStyle='#d9cff5cc';x.strokeStyle='#a996ea';x.lineWidth=2;x.beginPath();x.ellipse(0,-50,18,52,0,0,7);x.fill();x.stroke();x.restore()}));
x.strokeStyle='#c9a24b';x.lineWidth=3;rr(x,50,50,980,1250,60);x.stroke();
x.save();x.translate(540,115);let lg=x.createLinearGradient(-40,-30,40,30);lg.addColorStop(0,'#fff0b8');lg.addColorStop(.5,'#c9a24b');lg.addColorStop(1,'#f4dc93');x.strokeStyle=lg;x.lineWidth=11;x.beginPath();x.ellipse(0,6,38,29,0,0,7);x.stroke();x.fillStyle='#a8d4ee';x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.arc(0,-25,9,0,7);x.fill();x.stroke();x.restore();
x.textAlign='center';x.fillStyle='#c9a24b';x.font='500 34px '+F;x.fillText('My Ring, My Story',540,210);
x.fillStyle='#35305a';x.font='500 66px '+F;x.fillText('✨ Lucky Lifestyle',540,295);
[['🎨 Lucky Color',L.c],['💎 Lucky Item',L.i],['🌿 Lucky Activity',L.a]].forEach(([l,v],i)=>{const y=345+i*180;x.fillStyle='#ffffffc4';rr(x,110,y,860,152,40);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
x.textAlign='left';x.fillStyle='#7c7a98';x.font='400 34px '+F;x.fillText(l,160,y+60);x.fillStyle='#35305a';x.font='500 48px '+F;x.fillText(v,160,y+118);
if(i==0){x.fillStyle=L.h;x.beginPath();x.arc(890,y+76,34,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=5;x.stroke()}});
x.textAlign='center';x.fillStyle='#ece5fbee';rr(x,110,905,860,250,50);x.fill();x.strokeStyle='#c9a24b';x.lineWidth=2.5;x.stroke();
x.fillStyle='#c9a24b';x.font='500 32px '+F;x.fillText('💬 Affirmation',540,968);
x.fillStyle='#35305a';x.font='italic 400 44px '+F;x.fillText(L.f[0],540,1048);x.fillText(L.f[1],540,1112);
x.fillStyle='#c9a24b';x.font='500 32px '+F;x.fillText('✦ Wellness × Lucky Lifestyle ✦',540,1262);
$('#lcImg').src=c.toDataURL('image/png');$('#ov').classList.add('on')}
function sendCard(){cardCanvas.toBlob(async b=>{const f=new File([b],'lucky-card.png',{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'My Lucky Card'});return}}catch(e){if(e.name=='AbortError')return}toast('กดค้างที่รูปเพื่อบันทึก')})}
// break complete celebration
function celebrate(){const b=$('#burst');b.innerHTML='';const ch=['✦','✧','✿','🍃','✨','❀'];
for(let k=0;k<2;k++){const d=document.createElement('i');d.className='rp';d.style.animationDelay=k*.5+'s';b.appendChild(d)}
for(let k=0;k<26;k++){const d=document.createElement('i');d.className='pa';const a=Math.random()*6.28,r=90+Math.random()*130;d.textContent=ch[k%6];d.style.cssText=`--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r}px;--r:${Math.random()*360}deg;font-size:${14+Math.random()*20}px;color:${k%2?'#c9a24b':'#a996ea'};animation-delay:${Math.random()*.4}s`;b.appendChild(d)}
$$('#p6 .row .card').forEach((c,k)=>{c.classList.remove('pop');void c.offsetWidth;c.style.animationDelay=.3+k*.15+'s';c.classList.add('pop')});
const e=$('#pts');let n=0;clearInterval(e._t);e._t=setInterval(()=>{n=Math.min(S.gain,n+2);e.textContent='+'+n;if(n>=S.gain)clearInterval(e._t)},60)}
function drawMy(){$$('.ringbox').forEach(e=>e.innerHTML=ring(my.color,symbols[my.sym],''));updPrev()}
function go(n,reset){if(reset)stack=[];else if(cur!==n)stack.push(cur);show(n)}
function back(){show(stack.pop()||3)}
function show(n){cur=n;if(n==3||n==9)renderAll();if(n==4){brkTick();btAlert()}if(n==6){breakDone();setTimeout(celebrate,60)}if(n==9)renderWeek();if(n==12)renderRewards();if(n==13)renderCouple();$$('.pg').forEach(p=>p.classList.remove('on'));const p=$('#p'+n);p.classList.add('on');p.scrollTop=0;
$('#nav').classList.toggle('show',navPages.includes(n));$('#back').style.display=[1,2,3].includes(n)?'none':'block';if(n==2)$('#back').style.display='block';
$$('#nav button').forEach(b=>b.classList.toggle('on',+b.dataset.t===n||(n==8&&b.dataset.t==7)))}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2000)}
function single(box,fn){box.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;[...box.children].forEach(c=>c.classList.remove('sel'));b.classList.add('sel');fn&&fn(b.dataset.v)})}
// goals
const goals=[['🌙','การนอน','พักผ่อนให้เพียงพอ'],['🚶','การเคลื่อนไหว','ขยับร่างกายให้มากขึ้น'],['⏸️','การพัก','ไม่ลืมพักระหว่างวัน'],['🧘','ความผ่อนคลาย','ลดความตึงเครียด'],['🌿','สุขภาพประจำวัน','ดูแลตัวเองในทุกวัน']];
$('#goals').innerHTML=goals.map(g=>`<button class="opt" data-v="${g[1]}"><span class="e">${g[0]}</span><div>${g[1]}<small>${g[2]}</small></div></button>`).join('');
single($('#goals'),v=>{const t=$('#goalTag');t.style.display='inline-block';t.textContent='เป้าหมาย: '+v});
// lucky break
$$('.act').forEach(b=>b.onclick=()=>{b.classList.toggle('sel');$('#prog').textContent=$$('.act.sel').length+' / 3'});
// feel
$('#feel').innerHTML=$('#feel').innerHTML;single($('#feel'));$$('#feel .chip').forEach(c=>c.dataset.v=c.textContent);
function saveFeel(){const f=$('#feel .sel');day().fl=f?f.textContent:'';svG();toast('บันทึกแล้ว ✨');go(3,1)}
// mystic
const affs=['ฉันค่อย ๆ ก้าวไปอย่างมั่นคง','ฉันมีพลังพอสำหรับวันนี้','ฉันขอดูแลใจตัวเองก่อน','ทุกจังหวะพักคือการเติมพลังให้ฉัน'];let ai=0;
function makeAff(){$('#affCard').style.display='block';$('#aff').textContent='“'+affs[ai++%affs.length]+'”';toast('สร้าง Affirmation แล้ว ✨')}
function addRtn(){$('#rtxt').textContent='🌿 '+LK[li].a+' · ทุกวัน';$('#routine').style.display='block';$('#rtn').textContent='✓ เพิ่มลงใน My Routine แล้ว';toast('เพิ่มลงใน My Routine แล้ว')}
// my ring
const HERO="images/hero.png";
const CUT={"silver": "images/cut-silver.png", "black": "images/cut-black.png", "rose": "images/cut-rose.png", "gold": "images/cut-gold.png", "pink": "images/cut-pink.png"};
const DQ=['วันนี้ค่อย ๆ ไป ก็ถึงได้เหมือนกัน ✨','ใจที่สงบ คือพลังที่ดีที่สุดของวันนี้','เริ่มเล็ก ๆ แต่เริ่มวันนี้เลย 🌱','คุณทำได้ดีกว่าที่คิดเสมอ','พักสักนิด แล้วไปต่ออย่างมั่นใจ','ทุกก้าวเล็ก ๆ ล้วนมีความหมายในเรื่องราวของคุณ','วันนี้ลองใจดีกับตัวเองให้มากขึ้นอีกนิดนะ 💜','หายใจลึก ๆ แล้วเริ่มใหม่ได้เสมอ 🌬️','โอกาสดี ๆ กำลังเดินเข้าหาคุณ','ขอบคุณตัวเองที่ยังพยายามอยู่เสมอ','แสงเล็ก ๆ ในวันนี้ ก็พอจะสว่างให้ใจ ☀️','เชื่อมั่นในจังหวะชีวิตของตัวเอง','ร่างกายที่ได้พักคือของขวัญที่ดีที่สุด'];let qo=0,profFrom=0;
const COLS=[['Silver','silver','Brushed Titanium'],['Black','black','Black Ceramic'],['Rose Gold','rose','Stainless Steel'],['Gold','gold','Titanium'],['Pink','pink','Ceramic']];
const P={name:'',dob:'2004-01-01',sex:'x',h:165,w:55,act:1,sleep:7.3,brk:45,saved:false,vib:true,auto:true,qs:'22:00',qe:'07:00',consent:false},D={color:'Silver',name:'',saved:false},S={hr:72,steps:6240,temp:null,breaks:4,last:Date.now(),alerted:0};
const ld=(k,o)=>{try{Object.assign(o,JSON.parse(localStorage.getItem(k)||'{}'))}catch(e){}},sv=(k,o)=>{try{localStorage.setItem(k,JSON.stringify(o))}catch(e){}};
const rw=(l,v)=>`<div class="rw"><span>${l}</span><b>${v}</b></div>`;
function setQuotes(){const t=DQ[(Math.floor(Date.now()/864e5)+qo)%DQ.length];$$('.qt').forEach(e=>e.textContent=t)}
function nextQuote(){qo++;setQuotes()}
// ---- คำนวณจากข้อมูลส่วนตัว (สูตรมาตรฐาน) ----
function calc(p){const n=new Date(),b=new Date(p.dob);let a=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()==b.getMonth()&&n.getDate()<b.getDate()))a--;a=isNaN(a)?20:Math.max(10,Math.min(100,a));
const bmi=p.w/Math.pow(p.h/100,2),bmr=10*p.w+6.25*p.h-5*a+(p.sex=='m'?5:p.sex=='f'?-161:-78);// Mifflin-St Jeor
return{a,bmi,bmr,tdee:bmr*[1.2,1.375,1.55,1.725][p.act],hrmax:208-0.7*a,/* Tanaka */stepGoal:[6000,8000,10000,12000][p.act],sleepGoal:a<18?9:8,stride:p.h*0.415/100,cat:bmi<18.5?'น้ำหนักน้อย':bmi<23?'สมส่วน':bmi<25?'น้ำหนักเกิน':bmi<30?'อ้วนระดับ 1':'อ้วนระดับ 2'}}
const zone=z=>z<50?'พัก':z<60?'เบามาก':z<70?'เบา':z<80?'ปานกลาง':z<90?'หนัก':'หนักมาก';
function renderAll(){const c=calc(P),sl=P.sleep,sS=Math.min(1,sl/c.sleepGoal),sT=Math.min(1,S.steps/c.stepGoal),sB=Math.min(1,S.breaks/5),sH=S.hr<45?.6:S.hr<=100?1:Math.max(0,1-(S.hr-100)/60);
const sc=Math.round(100*(.3*sS+.3*sT+.2*sB+.2*sH)),lab=sc>=85?'ยอดเยี่ยม':sc>=70?'ดี':sc>=50?'พอใช้':'ควรดูแลตัวเอง',T=(i,v)=>{const e=document.getElementById(i);if(e)e.textContent=v};
T('sc1',sc);T('sc1l',lab);T('sc2',sc);T('sc2l',lab);$('#scArc').setAttribute('stroke-dashoffset',(389*(1-sc/100)).toFixed(0));
T('hr1',S.hr);T('hr2',S.hr);T('st1',S.steps.toLocaleString());T('st2',S.steps.toLocaleString());
const hh=Math.floor(sl),mm=Math.round((sl-hh)*60);T('sl1',hh+' ชม.');T('sl2',mm+' นาที');T('sl3',hh+'h '+mm+'m');T('brk2',S.breaks+' / 5');
if(S.temp!=null){T('tmp1',S.temp.toFixed(1)+' °C');T('tmp2',S.temp<30?'ต่ำกว่าปกติ':S.temp>37.5?'สูงกว่าปกติ':'ปกติ')}
const h=new Date().getHours(),g=h<12?'สวัสดีตอนเช้า':h<17?'สวัสดีตอนบ่าย':h<20?'สวัสดีตอนเย็น':'สวัสดีตอนค่ำ';T('hello',g+(P.name?', '+P.name:'')+' '+(h<12?'☀️':h<17?'🌤️':h<20?'🌇':'🌙'));
const km=S.steps*c.stride/1000,zp=S.hr/c.hrmax*100;
$('#analysis').innerHTML='<h3>การวิเคราะห์จากข้อมูลของฉัน</h3>'+(P.saved?'':'<p class="tag" style="margin-top:4px">ใช้ค่าตั้งต้นอยู่ — กรอกข้อมูลส่วนตัวเพื่อให้แม่นยำขึ้น</p>')+rw('อายุ',c.a+' ปี')+rw('BMI',c.bmi.toFixed(1)+' · '+c.cat)+rw('พลังงานพื้นฐาน (BMR)',Math.round(c.bmr).toLocaleString()+' kcal/วัน')+rw('พลังงานที่ใช้ต่อวัน (TDEE)',Math.round(c.tdee).toLocaleString()+' kcal')+rw('ชีพจรสูงสุด (โดยประมาณ)',Math.round(c.hrmax)+' BPM')+rw('ชีพจรตอนนี้',S.hr+' BPM · โซน'+zone(zp)+' ('+Math.round(zp)+'%)')+rw('ก้าว (เป้า '+c.stepGoal.toLocaleString()+')',Math.round(sT*100)+'% · '+km.toFixed(2)+' กม. · ≈'+Math.round(0.57*P.w*km)+' kcal')+rw('การนอน (เป้า '+c.sleepGoal+' ชม.)',Math.round(sS*100)+'%')+rw('การพักวันนี้',Math.round(sB*100)+'%')+rw('คะแนนจากชีพจร',Math.round(sH*100)+'%')+'<p style="font-size:11.5px;margin-top:10px">คะแนน = นอน 30% + ก้าว 30% + พัก 20% + ชีพจร 20% คำนวณจากสูตร Mifflin-St Jeor และ Tanaka เป็นค่าประมาณเพื่อการดูแลตัวเอง ไม่ใช่การวินิจฉัยทางการแพทย์</p>';checkMissions();trackDay();renderG();if(cur==9)renderWeek()}
function brkTick(){const el=(Date.now()-S.last)/60000,left=Math.max(0,Math.ceil(P.brk-el)),T=(i,v)=>{const e=document.getElementById(i);if(e)e.textContent=v};T('nb1',left>0?left+' นาที':'ถึงเวลาแล้ว');T('nb2',left>0?'เตือนให้พักทุก '+P.brk+' นาที · ผ่านไปแล้ว '+Math.floor(el)+' นาที':'ทำงานต่อเนื่องมานานแล้ว ถึงเวลาพักสักครู่');T('workmin','ทำงานต่อเนื่อง '+Math.max(1,Math.floor(el))+' นาที');if(left==0&&!S.alerted&&cur==3&&P.auto&&!quiet()){S.alerted=1;go(4)}}
function simDue(){S.last=Date.now()-P.brk*60000;S.alerted=1;go(4)}
function btAlert(){try{if(P.vib&&!quiet()&&bt.alert&&bt.dev&&bt.dev.gatt.connected)bt.alert.writeValue(Uint8Array.of(1))}catch(e){}}
// ---- ข้อมูลส่วนตัว ----
const readP=()=>({name:$('#fn').value.trim(),dob:$('#fd').value,sex:P.sex,h:+$('#fh').value,w:+$('#fw').value,act:P.act,sleep:+$('#fs').value,brk:P.brk,vib:P.vib,auto:P.auto,qs:$('#fq1').value||'22:00',qe:$('#fq2').value||'07:00'}),okP=q=>q.dob&&q.h>=120&&q.h<=220&&q.w>=30&&q.w<=200&&q.sleep>=0&&q.sleep<=14;
function sumP(){const q=readP();if(!okP(q)){$('#psum').innerHTML='<p>กรอกข้อมูลให้ครบ (ส่วนสูง 120–220 ซม. น้ำหนัก 30–200 กก.) เพื่อดูสรุป</p>';return}const c=calc(q);$('#psum').innerHTML='<h3>สรุปจากข้อมูลของคุณ</h3>'+rw('อายุ',c.a+' ปี')+rw('BMI',c.bmi.toFixed(1)+' · '+c.cat)+rw('BMR',Math.round(c.bmr)+' kcal/วัน')+rw('พลังงานที่ใช้ต่อวัน',Math.round(c.tdee)+' kcal')+rw('ชีพจรสูงสุด',Math.round(c.hrmax)+' BPM')+rw('เป้าหมายก้าว',c.stepGoal.toLocaleString()+' ก้าว')+rw('เป้าหมายการนอน',c.sleepGoal+' ชม.')}
function saveProfile(){const q=readP();if(!$('#fc').checked){toast('กรุณาติ๊กยอมรับเรื่องความเป็นส่วนตัวก่อน');return}if(!okP(q)){toast('กรุณากรอกข้อมูลให้ครบและอยู่ในช่วงที่เหมาะสม');return}Object.assign(P,q,{saved:true,consent:true});sv('mrms_p',P);if(!D.saved&&!$('#dn').value)$('#dn').value=P.name;updPrev();renderWelcome();renderAll();brkTick();toast('บันทึกข้อมูลแล้ว ✨');profFrom?go(2):back()}
// ---- ดีไซน์แหวน (สี + ชื่อ) ----
function updPrev(){const c=COLS.find(a=>a[0]==my.color),im=$('#pvImg');if(im.dataset.k!=c[1]){im.dataset.k=c[1];im.src=IMG[c[1]];im.classList.remove('pop');void im.offsetWidth;im.classList.add('pop')}$('#pvEng').textContent=$('#dn').value;$('#pvTxt').textContent=c[0]+' ('+c[2]+')'}
function renderWelcome(){const w=$('#wRing');w.innerHTML='';w.classList.toggle('sv',D.saved);if(!D.saved){const i=new Image();i.src=HERO;i.alt='Smart Ring';w.appendChild(i)}else{const c=COLS.find(a=>a[0]==D.color)||COLS[0],i=new Image(),n=document.createElement('div');i.src=CUT[c[1]];i.alt=c[0];n.className='wname';n.textContent=D.name;w.append(i,n)}$('#wHello').textContent=P.name?' '+P.name:''}
function saveDesign(){D.color=my.color;D.name=$('#dn').value.trim();D.saved=true;sv('mrms_d',D);drawMy();renderWelcome();$('#wBk').style.display='block';toast('บันทึกแล้ว ✨ แหวนในหน้าแรกเปลี่ยนตามดีไซน์ของคุณ');go(1)}

// ================= Gamification / สรุปสัปดาห์ / Couple / ความเป็นส่วนตัว =================
const td=(n=new Date())=>n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0'),dd=(a,b)=>Math.round((new Date(b+'T00:00')-new Date(a+'T00:00'))/864e5);
const G={pts:0,streak:0,last:'',grace:1,un:[],days:{},la:0},CP={a:'Silver',b:'Rose Gold',an:'',bn:'',sc:1,ss:0};
const day=k=>{k=k||td();return G.days[k]||(G.days[k]={br:0,hs:0,hn:0,st:0,sc:0,m:[0,0,0],gs:0,ma:0})},svG=()=>sv('mrms_g',G);
const LV=[[0,'ดาวดวงแรก','✦'],[100,'จันทร์เสี้ยว','🌙'],[250,'จันทร์ครึ่งดวง','🌓'],[500,'จันทร์เต็มดวง','🌕']],lvl=()=>{let l=0;LV.forEach((v,i)=>{if(G.pts>=v[0])l=i});return l};
const ITEMS=[['c:Gold','ปลดล็อกสี Gold ของแหวน','💛',80],['c:Pink','ปลดล็อกสี Pink ของแหวน','🌸',150],['l:2','Lucky Card ชุด Sky Blue','💎',60],['l:3','Lucky Card ชุด Gold','✨',120]];
const has=k=>!ITEMS.some(a=>a[0]==k)||G.un.includes(k);
function addPts(n,why){const l0=lvl();G.pts+=n;svG();if(lvl()>l0)toast('เลเวลอัป! '+LV[lvl()][2]+' '+LV[lvl()][1]);else if(why)toast('+'+n+' แต้ม · '+why)}
function buy(k){const it=ITEMS.find(a=>a[0]==k);if(!it||has(k))return;if(G.pts<it[3]){toast('ต้องการอีก '+(it[3]-G.pts)+' แต้ม · ดูวิธีสะสมได้ที่หน้า Mission');return}G.pts-=it[3];G.un.push(k);svG();toast('ปลดล็อกแล้ว 🎉 '+it[1]);renderTiles();renderRewards();renderG()}
function streakNow(){if(!G.last)return 0;const g=dd(G.last,td());return g<=1?G.streak:(g==2&&G.grace>0?G.streak:0)}
function touchStreak(){const t=td();if(G.last==t)return;if(!G.last)G.streak=1;else{const g=dd(G.last,t);if(g==1)G.streak++;else if(g==2&&G.grace>0){G.grace--;G.streak++;toast('ใช้วันพักใจ 1 วัน streak ยังอยู่ 💜')}else G.streak=1}G.last=t;if(G.streak%7==0&&G.grace<2)G.grace++;svG()}
function breakDone(){const d=day(),ok=Date.now()-(G.la||0)>6e5;S.gain=0;if(ok){G.la=Date.now();d.br++;S.gain=20;G.pts+=20;touchStreak()}S.breaks=d.br;S.last=Date.now();S.alerted=0;$('#brk').textContent=Math.min(5,d.br)+' / 5';$('#strk').textContent=streakNow()+' วัน';svG();renderAll()}
function checkMissions(){const d=day(),c=calc(P);if(d.br>=3&&!d.m[0]){d.m[0]=1;addPts(15,'ภารกิจ: พักครบ 3 ครั้ง')}if(S.liveSteps){if(S.steps>=.6*c.stepGoal&&!d.m[1]){d.m[1]=1;addPts(15,'ภารกิจ: เดินถึง 60% ของเป้า')}if(S.steps>=c.stepGoal&&!d.gs){d.gs=1;addPts(30,'ถึงเป้าก้าวแล้ว!')}}if(d.m[0]&&d.m[1]&&d.m[2]&&!d.ma){d.ma=1;addPts(50,'ครบทุกภารกิจวันนี้ 🎉')}}
function doMs(i){const d=day();if(d.m[i])return;d.m[i]=1;addPts(15,'ภารกิจสำเร็จ');checkMissions();renderG();renderRewards()}
function trackDay(){const d=day();if(S.liveSteps)d.st=S.steps;d.sc=+$('#sc1').textContent||0}
function renderG(){const L=lvl(),nx=LV[L+1],pr=nx?(G.pts-LV[L][0])/(nx[0]-LV[L][0]):1,d=day();$('#hLv').textContent=LV[L][2]+' '+LV[L][1];$('#hBar').style.width=Math.round(pr*100)+'%';$('#hMs').textContent='ภารกิจวันนี้ '+d.m.filter(Boolean).length+' / 3 · '+G.pts+' แต้ม';if($('#p12').classList.contains('on'))renderRewards()}
function renderRewards(){const d=day(),L=lvl(),nx=LV[L+1],pr=nx?Math.round((G.pts-LV[L][0])/(nx[0]-LV[L][0])*100):100,c=calc(P),ms=[['พักครบ 3 ครั้ง','🌿',d.br+' / 3'],['เดินให้ถึง 60% ของเป้า','🚶',S.liveSteps?Math.min(100,Math.round(S.steps/(.6*c.stepGoal)*100))+'%':'รอข้อมูลจากแหวนหรือโหมดจำลอง'],['หายใจลึก ๆ 5 ครั้ง','🌬️','แตะเมื่อทำเสร็จ']];
$('#gm').innerHTML=`<div class="card mystic center"><div style="font-size:38px">${LV[L][2]}</div><h2>${LV[L][1]}</h2><p>${G.pts} แต้ม${nx?' · อีก '+(nx[0]-G.pts)+' แต้มถึง '+nx[1]:' · เลเวลสูงสุดแล้ว'}</p><div class="bar" style="margin-top:10px"><i style="width:${pr}%"></i></div></div><div class="card"><h3>🔥 Streak ${streakNow()} วัน</h3><p style="margin-top:4px">วันพักใจเหลือ ${G.grace} วัน ถ้าขาดไปหนึ่งวัน streak จะยังไม่หายทันที</p></div><h3 style="margin-top:18px">ภารกิจวันนี้</h3>`+ms.map((m,i)=>`<button class="opt${d.m[i]?' sel':''}" ${i==2?'onclick="doMs(2)"':'style="cursor:default"'}><span class="e">${m[1]}</span><div>${m[0]}<small>${d.m[i]?'สำเร็จแล้ว ✓':m[2]}</small></div></button>`).join('')+`<p style="font-size:12px;margin-top:6px">ภารกิจละ +15 แต้ม ครบทั้ง 3 ข้อรับโบนัส +50 แต้ม พักได้แต้มทุก 10 นาที ถึงเป้าก้าวรับ +30 แต้ม</p><h3 style="margin-top:18px">แลกรางวัล</h3>`+ITEMS.map(it=>`<button class="opt${has(it[0])?' sel':''}" onclick="buy('${it[0]}')"><span class="e">${it[2]}</span><div>${it[1]}<small>${has(it[0])?'ปลดล็อกแล้ว ✓':it[3]+' แต้ม'}</small></div></button>`).join('')}
function renderTiles(){$('#cols').innerHTML=COLS.map(([n,k,m])=>{const lk=!has('c:'+n),it=ITEMS.find(a=>a[0]=='c:'+n);return `<button class="tile${n==my.color?' sel':''}${lk?' lock':''}" data-v="${n}"><img src="${IMG[k]}" alt="${n}">${n}<small>${lk?'🔒 '+it[3]+' แต้ม':m}</small></button>`}).join('')}
// ---- สรุป 7 วัน ----
function renderWeek(){const nm=['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],rows=[];for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);rows.push({l:nm[x.getDay()],d:G.days[td(x)]})}
const hr=rows.map(r=>r.d&&r.d.hn?Math.round(r.d.hs/r.d.hn):null),st=rows.map(r=>r.d&&r.d.st?r.d.st:null),br=rows.map(r=>r.d&&r.d.br?r.d.br:null),has1=[...hr,...st,...br].some(v=>v!=null);
const bars=(v,f)=>{const mx=Math.max(1,...v.filter(q=>q!=null));return '<div class="bars">'+v.map(q=>`<i title="${q==null?'ไม่มีข้อมูล':f(q)}" style="height:${q==null?4:Math.max(10,q/mx*100)}%;${q==null?'opacity:.3':''}"></i>`).join('')+'</div>'},lab='<div class="wl">'+rows.map(r=>`<span>${r.l}</span>`).join('')+'</div>';
const sc=rows.filter(r=>r.d&&r.d.sc).map(r=>r.d.sc),avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0,best=rows.reduce((b,r)=>r.d&&r.d.sc>(b.d?b.d.sc:0)?r:b,{});
const demo=Object.values(G.days).some(d=>d.demo);
$('#wkc').innerHTML='<h3>แนวโน้ม 7 วัน</h3>'+(has1?'':'<p style="font-size:12.5px;margin-top:4px">ยังไม่มีข้อมูลย้อนหลัง ใช้งานต่อเนื่องหลายวัน หรือโหลดข้อมูลตัวอย่างเพื่อดูตัวอย่างกราฟ</p>')+'<h3 style="margin-top:12px;font-size:13px;color:var(--mut)">ชีพจรเฉลี่ย (BPM)</h3>'+bars(hr,q=>q+' BPM')+'<h3 style="margin-top:12px;font-size:13px;color:var(--mut)">ก้าว</h3>'+bars(st,q=>q.toLocaleString()+' ก้าว')+'<h3 style="margin-top:12px;font-size:13px;color:var(--mut)">จำนวนครั้งที่พัก</h3>'+bars(br,q=>q+' ครั้ง')+lab+(sc.length?rw('คะแนนเฉลี่ย',avg(sc)+' / 100')+rw('พักรวม',br.reduce((x,y)=>x+(y||0),0)+' ครั้ง')+rw('ก้าวเฉลี่ย (วันที่มีข้อมูล)',avg(st.filter(Boolean)).toLocaleString())+rw('วันที่ดีที่สุด',best.l?best.l+' ('+best.d.sc+')':'-'):'')+(demo?'<p style="font-size:11.5px;margin-top:8px;color:#b0476a">มีข้อมูลตัวอย่างปนอยู่ ไม่ใช่ข้อมูลจริง</p><button class="btn sec" style="margin-top:8px" onclick="clearDemo()">ล้างข้อมูลตัวอย่าง</button>':'<button class="btn sec" style="margin-top:12px;font-size:13px" onclick="seedDemo()">โหลดข้อมูลตัวอย่าง 7 วัน (สำหรับสาธิต)</button>')}
function seedDemo(){const c=calc(P);for(let i=1;i<=6;i++){const x=new Date();x.setDate(x.getDate()-i);const k=td(x);if(G.days[k]&&!G.days[k].demo)continue;const st=Math.round(4000+Math.random()*6500),br=2+Math.floor(Math.random()*4),h=68+Math.random()*12,sl=6+Math.random()*2.5;G.days[k]={br,hs:Math.round(h*100),hn:100,st,sc:Math.round(100*(.3*Math.min(1,sl/c.sleepGoal)+.3*Math.min(1,st/c.stepGoal)+.2*Math.min(1,br/5)+.2)),m:[0,0,0],gs:0,ma:0,demo:1}}svG();renderWeek();toast('โหลดข้อมูลตัวอย่างแล้ว (ไม่ใช่ข้อมูลจริง)')}
function clearDemo(){for(const k in G.days)if(G.days[k].demo)delete G.days[k];svG();renderWeek()}
function hrWarn(){const h=bt.hist.slice(-10);let m='';if(h.length>=10){const a=Math.round(h.reduce((x,y)=>x+y,0)/10);if(a>110)m=a+' BPM';else if(a<45)m=a+' BPM'}const hi=m&&parseInt(m)>100;['warn','warnH'].forEach(i=>{const e=document.getElementById(i);e.style.display=m?'block':'none';e.innerHTML=m?`<h3>💗 ชีพจรเฉลี่ย ${m} ${hi?'สูง':'ต่ำ'}กว่าช่วงปกติขณะพัก</h3><p style="margin-top:4px;color:var(--ink)">ลองนั่งพักและหายใจลึก ๆ สักครู่ ถ้ากำลังออกกำลังกายอยู่ถือว่าปกติ แต่ถ้ามีอาการเจ็บหน้าอก เวียนหัว หรือใจสั่นผิดปกติ ควรปรึกษาแพทย์ แอปนี้ไม่ได้วินิจฉัยโรค</p>`:''})}
function quiet(){const n=new Date(),t=n.getHours()*60+n.getMinutes(),f=q=>{const[a,b]=(q||'0:0').split(':');return +a*60+ +b},a=f(P.qs),b=f(P.qe);return a==b?false:a<b?t>=a&&t<b:t>=a||t<b}
function wipeAll(){try{['mrms_p','mrms_d','mrms_g','mrms_c'].forEach(k=>localStorage.removeItem(k))}catch(e){}toast('ลบข้อมูลทั้งหมดแล้ว');setTimeout(()=>{try{location.reload()}catch(e){}},700)}
// ---- Couple Ring ----
const DOT={Silver:'#d9dde6',Black:'#2a2a33','Rose Gold':'#d99a8e',Gold:'#e5c15a',Pink:'#f3b9cc'};
function renderCouple(){const f=(id,key)=>{$('#'+id).innerHTML=COLS.map(([n])=>`<button class="dot${CP[key]==n?' sel':''}" data-v="${n}" title="${n}" style="background:${DOT[n]}"></button>`).join('')};f('cpa','a');f('cpb','b');
const ci=(c,n)=>`<div><img src="${CUT[COLS.find(a=>a[0]==c)[1]]}" alt="${c}"><b>${esc(n||'')}</b></div>`;$('#cpv').innerHTML=ci(CP.a,CP.an)+'<span>+</span>'+ci(CP.b,CP.bn);
const ia=(CP.an||'A').trim()[0].toUpperCase(),ib=(CP.bn||'B').trim()[0].toUpperCase();$('#cpt').textContent=ia+' + '+ib+' = '+ia+ib;
$('#cps').innerHTML=`<button class="chip${CP.sc?' sel':''}" data-k="sc">แชร์ Lucky Card</button><button class="chip${CP.ss?' sel':''}" data-k="ss">แชร์ Streak</button><button class="chip" style="opacity:.6;cursor:default">🔒 ข้อมูลสุขภาพ: ไม่แชร์</button>`}
function saveCouple(){sv('mrms_c',CP);toast('บันทึกดีไซน์คู่แล้ว 💞')}
function initExtra(){$('#fc').checked=!!P.consent;$('#fq1').value=P.qs;$('#fq2').value=P.qe;
$('#fv').innerHTML=[['vib','สั่นที่แหวน'],['auto','เปิดหน้าเตือนพักอัตโนมัติ']].map(([k,t])=>`<button class="chip${P[k]?' sel':''}" data-k="${k}">${t}</button>`).join('');
$('#fv').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;P[b.dataset.k]=!P[b.dataset.k];b.classList.toggle('sel',P[b.dataset.k])};
['cpa','cpb'].forEach((id,i)=>$('#'+id).onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const k=i?'b':'a',n=b.dataset.v;if(!has('c:'+n)){toast('ปลดล็อกสีนี้ในหน้า Mission ก่อน');return}CP[k]=n;renderCouple()});
$('#cpan').value=CP.an;$('#cpbn').value=CP.bn;$('#cpan').oninput=e=>{CP.an=e.target.value;renderCouple()};$('#cpbn').oninput=e=>{CP.bn=e.target.value;renderCouple()};
$('#cps').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;CP[b.dataset.k]=CP[b.dataset.k]?0:1;renderCouple()};renderCouple()}
function initApp(){ld('mrms_p',P);ld('mrms_d',D);ld('mrms_g',G);ld('mrms_c',CP);my.color=D.color;S.breaks=day().br;
$('#fn').value=P.name;$('#fd').value=P.dob;$('#fh').value=P.h;$('#fw').value=P.w;$('#fs').value=P.sleep;
$('#fx').innerHTML=[['m','ชาย'],['f','หญิง'],['x','ไม่ระบุ']].map(([v,t])=>`<button class="chip${P.sex==v?' sel':''}" data-v="${v}">${t}</button>`).join('');single($('#fx'),v=>{P.sex=v;sumP()});
$('#fa').innerHTML=['นั่งทำงานเป็นหลัก','เดินเบา ๆ 1–3 วัน/สัปดาห์','ออกกำลังกายปานกลาง 3–5 วัน/สัปดาห์','ออกกำลังกายหนักเกือบทุกวัน'].map((t,i)=>`<button class="opt${P.act==i?' sel':''}" data-v="${i}" style="padding:10px 14px;margin-top:6px">${t}</button>`).join('');single($('#fa'),v=>{P.act=+v;sumP()});
$('#fb').innerHTML=[30,45,60].map(m=>`<button class="chip${P.brk==m?' sel':''}" data-v="${m}">ทุก ${m} นาที</button>`).join('');single($('#fb'),v=>{P.brk=+v;sumP()});
['fd','fh','fw','fs'].forEach(i=>$('#'+i).addEventListener('input',sumP));
renderTiles();$('#cols').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const n=b.dataset.v;if(!has('c:'+n)){buy('c:'+n);return}my.color=n;renderTiles();drawMy()};
$('#dn').value=D.name||P.name;initExtra();setQuotes();renderWelcome();renderAll();sumP();brkTick();setInterval(brkTick,15000)}
const BT_SVC='12345678-1234-5678-1234-56789abcdef0',BT_TEMP='12345678-1234-5678-1234-56789abcdef1',BT_STEP='12345678-1234-5678-1234-56789abcdef2',BT_ALERT='12345678-1234-5678-1234-56789abcdef3';
let bt={dev:null,sim:null,hist:[]};
function setHR(v){S.hr=v;const dy=day();dy.hs+=v;dy.hn++;if(dy.hn%10==0)svG();bt.hist=[...bt.hist,v].slice(-30);const e=$('#hrLive');if(e)e.textContent=v;const h=bt.hist;if(h.length>1){const mn=Math.min(...h)-3,mx=Math.max(...h)+3;$('#sp').setAttribute('points',h.map((q,i)=>(i*200/(h.length-1)).toFixed(1)+','+(40-(q-mn)/(mx-mn)*36).toFixed(1)).join(' '))}hrWarn();renderAll()}
function btStatus(t,ok){$('#btSt').textContent=t;$('#btDot').style.background=ok?'#6fcf97':'#c9c7d8'}
function stopSim(){clearInterval(bt.sim);bt.sim=null;$('#simBtn').textContent='โหมดจำลอง'}
function simToggle(){if(bt.sim){stopSim();btStatus('หยุดโหมดจำลองแล้ว',0);return}let v=72;bt.sim=setInterval(()=>{v=Math.max(62,Math.min(88,v+Math.round(Math.random()*5-2.5)));S.steps+=Math.floor(Math.random()*5);S.liveSteps=1;setHR(v)},1000);$('#simBtn').textContent='หยุดจำลอง';btStatus('โหมดจำลอง (ไม่ใช่ข้อมูลจากแหวนจริง)',1)}
async function btToggle(){
 if(bt.dev&&bt.dev.gatt.connected){bt.dev.gatt.disconnect();return}
 if(!navigator.bluetooth){btStatus('เบราว์เซอร์นี้ไม่รองรับบลูทูธ — ใช้ Chrome บน Android หรือคอมพิวเตอร์ หรือลองโหมดจำลอง',0);return}
 try{btStatus('กำลังค้นหาอุปกรณ์…',0);
  const d=await navigator.bluetooth.requestDevice({filters:[{services:['heart_rate']}],optionalServices:[BT_SVC]});bt.dev=d;
  d.addEventListener('gattserverdisconnected',()=>{btStatus('ตัดการเชื่อมต่อแล้ว',0);$('#btBtn').textContent='เชื่อมต่อแหวน'});
  const sv=await d.gatt.connect(),svc=await sv.getPrimaryService('heart_rate'),ch=await svc.getCharacteristic('heart_rate_measurement');
  await ch.startNotifications();
  ch.addEventListener('characteristicvaluechanged',e=>{const v=e.target.value;setHR(v.getUint8(0)&1?v.getUint16(1,true):v.getUint8(1))});
  try{const cs=await sv.getPrimaryService(BT_SVC);
   const tc=await cs.getCharacteristic(BT_TEMP);await tc.startNotifications();tc.addEventListener('characteristicvaluechanged',e=>{S.temp=e.target.value.getInt16(0,true)/100;renderAll()});
   const sc=await cs.getCharacteristic(BT_STEP);await sc.startNotifications();sc.addEventListener('characteristicvaluechanged',e=>{S.steps=e.target.value.getUint32(0,true);S.liveSteps=1;renderAll()});try{bt.alert=await cs.getCharacteristic(BT_ALERT)}catch(_){}}catch(_){}
  if(bt.sim)stopSim();btStatus('เชื่อมต่อแล้ว: '+(d.name||'Smart Ring'),1);$('#btBtn').textContent='ตัดการเชื่อมต่อ'
 }catch(e){const n=e.name;btStatus(n=='NotFoundError'?'ยกเลิกหรือไม่พบอุปกรณ์':(n=='SecurityError'||n=='NotAllowedError')?'หน้านี้ไม่ได้รับอนุญาตให้ใช้บลูทูธ — ลองเปิดไฟล์ HTML ที่ดาวน์โหลดไว้ใน Chrome หรือใช้โหมดจำลอง':'เชื่อมต่อไม่สำเร็จ: '+e.message,0)}}

(function(){const L=[...$('#bg').children],r=(a,b)=>a+Math.random()*(b-a);
const add=(l,cls,css,html)=>{const d=document.createElement('div');d.className=cls;d.style.cssText=css;if(html)d.innerHTML=html;l.appendChild(d);return d};
for(let i=0;i<4;i++){const w=r(240,360);add(L[0],'cloud',`top:${12+i*22}%;width:${w}px;height:${w*.4}px;animation-duration:${r(60,110)}s;animation-delay:-${r(0,90)}s`)}
const S='stroke="#c9a24b" stroke-width="1.6" stroke-linejoin="round"',P='stroke="#a996ea" stroke-width="1.8"';
const lotus='<svg viewBox="0 0 100 100" width="100%">'+[-64,-32,0,32,64].map(a=>`<ellipse cx="50" cy="50" rx="11" ry="30" fill="#e5dcfa" ${P} transform="rotate(${a} 50 82)"/>`).join('')+'<circle cx="50" cy="78" r="5" fill="#f1e4b4" '+S+'/></svg>';
const bfly='<svg viewBox="0 0 100 100" width="100%"><ellipse cx="30" cy="35" rx="24" ry="18" fill="#d9cff5" '+P+' transform="rotate(-25 30 35)"/><ellipse cx="70" cy="35" rx="24" ry="18" fill="#d9cff5" '+P+' transform="rotate(25 70 35)"/><ellipse cx="33" cy="64" rx="16" ry="12" fill="#cfe6f7" '+P+' transform="rotate(25 33 64)"/><ellipse cx="67" cy="64" rx="16" ry="12" fill="#cfe6f7" '+P+' transform="rotate(-25 67 64)"/><path d="M50 28v46" '+S+'/><path d="M50 28q-8-14-14-16M50 28q8-14 14-16" fill="none" '+S+'/></svg>';
const sun='<svg viewBox="0 0 100 100" width="100%">'+Array.from({length:12},(_,k)=>`<path d="M50 6v14" ${S} transform="rotate(${k*30} 50 50)"/>`).join('')+'<circle cx="50" cy="50" r="22" fill="#f7e8b8" '+S+'/></svg>';
const moon='<svg viewBox="0 0 100 100" width="100%"><path d="M64 8a42 42 0 1 0 28 62A34 34 0 0 1 64 8z" fill="#f4e7b8" '+S+'/><path d="M24 22l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#c9a24b"/></svg>';
const star='<svg viewBox="0 0 100 100" width="100%"><path d="M50 4L59 41 96 50 59 59 50 96 41 59 4 50 41 41z" fill="#f7e8b8" '+S+'/></svg>';
const fern='<svg viewBox="0 0 120 200" width="100%"><path d="M60 200C58 140 64 80 60 10" stroke="#8fd1b8" stroke-width="2.5" fill="none"/>'+[30,62,94,126,158].map((y,k)=>{const x=k%2?82:38;return `<ellipse cx="${x}" cy="${y}" rx="24" ry="10" fill="#cdeee1" stroke="#8fd1b8" stroke-width="1.8" transform="rotate(${k%2?-30:30} ${x} ${y})"/>`}).join('')+'</svg>';
const cn=pts=>'<svg viewBox="0 0 200 120" width="100%"><polyline points="'+pts+'" fill="none" stroke="#c9a24b" stroke-width="1.6" stroke-dasharray="5 5"/>'+pts.split(' ').map(q=>{const[x,y]=q.split(',');return `<circle cx="${x}" cy="${y}" r="5" fill="#f7e8b8" stroke="#c9a24b" stroke-width="1.6"/>`}).join('')+'</svg>';
// layer 0: ferns
add(L[0],'sway','left:-30px;bottom:-16px;width:170px',fern);add(L[0],'sway','right:-34px;top:250px;width:150px;rotate:200deg',fern);
// layer 1: stars + constellations + big sparkle
for(let i=0;i<14;i++){const z=r(3,6);add(L[1],'st',`left:${r(2,98)}%;top:${r(2,95)}%;width:${z}px;height:${z}px;animation-duration:${r(3,6)}s;animation-delay:-${r(0,6)}s`)}
add(L[1],'con','left:3%;top:14%;width:250px',cn('10,90 55,50 100,66 150,22 190,56'));
add(L[1],'con','right:0;bottom:24%;width:240px',cn('12,30 60,70 110,40 160,92 192,60'));
add(L[1],'mo','left:46%;top:44%;width:62px;opacity:.8',star);
// layer 2: large motifs
add(L[2],'mo','right:14px;top:52px;width:110px;opacity:.9',moon);
add(L[2],'mo','left:10px;top:120px;width:100px;opacity:.85;animation-duration:14s',sun).firstChild.style.animation='spin 60s linear infinite';
add(L[2],'mo','right:8px;top:430px;width:120px;opacity:.9;animation-duration:7s',bfly);
add(L[2],'mo','left:-6px;bottom:150px;width:150px;opacity:.9;animation-duration:11s',lotus);
const ch=['✿','❀','🍃','✧','❁','🌿'];for(let i=0;i<7;i++){const d=add(L[2],'pt',`left:${r(5,90)}%;font-size:${r(30,52)}px;font-style:normal;color:${i%2?'#b9a6ee':'#c9a24b'};animation-duration:${r(26,42)}s;animation-delay:-${r(0,40)}s`);d.textContent=ch[i%6]}
const mv=(x,y)=>L.forEach(l=>{const k=+l.dataset.d;l.style.transform=`translate(${-x*k}px,${-y*k}px)`});
$('#app').addEventListener('pointermove',e=>{const b=e.currentTarget.getBoundingClientRect();mv((e.clientX-b.left)/b.width-.5,(e.clientY-b.top)/b.height-.5)});
$('#app').addEventListener('pointerleave',()=>mv(0,0));
addEventListener('deviceorientation',e=>{if(e.gamma!=null)mv(Math.max(-1,Math.min(1,e.gamma/30))/2,Math.max(-1,Math.min(1,(e.beta-45)/30))/2)});})();
initApp();applyLK();drawMy();show(1);
// keyboard support for clickable cards (role=button)
document.addEventListener('keydown',e=>{const t=e.target;if((e.key==='Enter'||e.key===' ')&&t.matches&&t.matches('[role=button]')){e.preventDefault();t.click()}});

