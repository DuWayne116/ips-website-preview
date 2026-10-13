const b=document.querySelector('.burger'),m=document.getElementById('menu');
if(b){b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');b.setAttribute('aria-expanded',false)}));}
const yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
// animated counters
const cs=document.querySelectorAll('.count');
if(cs.length&&'IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,to=+el.dataset.to,t0=performance.now(),d=1600;
  const f=t=>{const p=Math.min((t-t0)/d,1),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-US');if(p<1)requestAnimationFrame(f)};el.textContent='0';requestAnimationFrame(f)}),{threshold:.4});
 cs.forEach(c=>io.observe(c));}
// forms: timestamp for spam check, AJAX submit to PHP, mailto fallback if PHP unavailable
document.querySelectorAll('form[data-mailto]').forEach(form=>{
 const ts=form.querySelector('.ts');if(ts)ts.value=Math.floor(Date.now()/1000);
 form.addEventListener('submit',async ev=>{
  ev.preventDefault();if(!form.reportValidity())return;
  const btn=form.querySelector('[type=submit]');btn.disabled=true;const old=btn.textContent;btn.textContent='Sending…';
  let box=form.querySelector('.msg');if(!box){box=document.createElement('p');box.className='msg';box.setAttribute('role','status');form.appendChild(box)}
  try{
   const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
   const ct=r.headers.get('content-type')||'';if(!ct.includes('json'))throw new Error('nophp');
   const j=await r.json();box.className='msg '+(j.ok?'ok':'err');box.textContent=j.message;if(j.ok)form.reset();
  }catch(e){
   // PHP not available (e.g. static preview): open the visitor's email app instead
   const fd=new FormData(form),lines=[];fd.forEach((v,k)=>{if(['website','ts','attachments[]'].includes(k)||v instanceof File)return;if(v)lines.push(k+': '+v)});
   const subj=form.id==='booking'?'Load booking request':'Quote request';
   location.href='mailto:'+form.dataset.mailto+'?subject='+encodeURIComponent(subj+' – '+(fd.get('company')||fd.get('name')||''))+'&body='+encodeURIComponent(lines.join('\n'));
   box.className='msg ok';box.textContent='Your email app has opened with your details – please press send.'+(form.querySelector('input[type=file]')?' Attach any photos to that email.':'');
  }finally{btn.disabled=false;btn.textContent=old}
 });
});
