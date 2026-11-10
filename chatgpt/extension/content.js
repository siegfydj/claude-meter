(() => {
  const ROOT_ID = "chatgpt-meter-root";
  const KEY = "chatgptMeterSnapshot";
  if (document.getElementById(ROOT_ID)) return;

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.cssText = "all:initial;position:fixed;right:18px;bottom:18px;z-index:2147483647";
  const shadow = root.attachShadow({mode:"closed"});
  const style = document.createElement("style");
  style.textContent = `
    .panel{box-sizing:border-box;width:292px;padding:12px;border:1px solid #555;border-radius:12px;
      background:#202123;color:#f5f5f5;box-shadow:0 8px 28px #0008;font:13px/1.45 system-ui,sans-serif}
    .head,.line,.foot{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .title{font-weight:700;font-size:14px}.muted{color:#aaa;font-size:11px}
    button{cursor:pointer;color:#ddd;background:transparent;border:0;font-size:17px}
    .metric{margin-top:10px}.track{height:6px;background:#444;border-radius:8px;overflow:hidden;margin-top:5px}
    .fill{height:100%;background:#8ab4f8}.empty{margin-top:12px;color:#ccc}
    a{color:#9ec5fe;text-decoration:none}.foot{margin-top:12px}
  `;
  const panel=document.createElement("section");
  panel.className="panel";
  panel.innerHTML='<div class="head"><span class="title">ChatGPT Usage</span><button id="hide" aria-label="Hide meter">×</button></div><div id="body" class="empty">Loading local snapshot…</div><div class="foot"><a href="https://chatgpt.com/settings/usage" target="_blank" rel="noopener">Open official Usage</a><span class="muted">Local only</span></div>';
  shadow.append(style,panel); document.documentElement.append(root);
  panel.querySelector("#hide").addEventListener("click",()=>root.remove());

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function render(s){
    const body=panel.querySelector("#body");
    if(!s||!Array.isArray(s.metrics)||!s.metrics.length){
      body.innerHTML='No readable snapshot yet. Visit <a href="https://chatgpt.com/settings/usage" target="_blank" rel="noopener">Usage settings</a> in this signed-in browser. Unsupported values remain unavailable.';
      return;
    }
    body.innerHTML=s.metrics.map(m=>{
      const p=Number.isFinite(m.percent)?Math.max(0,Math.min(100,m.percent)):null;
      return '<div class="metric"><div class="line"><span>'+esc(m.label)+'</span><strong>'+(p===null?'Not detected':p+'% used')+'</strong></div>'+
        (p===null?'':'<div class="track"><div class="fill" style="width:'+p+'%"></div></div>')+'</div>';
    }).join('')+'<p class="muted">Snapshot captured: '+esc(new Date(s.capturedAt).toLocaleString())+' · not live data</p>';
  }
  function capture(){
    if(!location.pathname.includes("/settings/usage")) return;
    // Read visible text only. No cookies, hidden app state, localStorage, or network calls.
    const lines=(document.body?.innerText||"").split(/\\n+/).map(x=>x.trim()).filter(Boolean);
    const metrics=[],seen=new Set();
    for(let i=0;i<lines.length;i++){
      const match=lines[i].match(/(?:^|\\s)(\\d{1,3})\\s*%(?:\\s|$)/);
      if(!match) continue;
      const pct=Number(match[1]); if(pct>100) continue;
      const label=(lines[i-1]||lines[i+1]||"Usage").slice(0,64);
      const id=label+":"+pct; if(seen.has(id)) continue; seen.add(id);
      metrics.push({label,percent:pct});
    }
    if(metrics.length) chrome.storage.local.set({[KEY]:{metrics:metrics.slice(0,8),capturedAt:new Date().toISOString()}});
  }
  chrome.storage.local.get([KEY],d=>render(d[KEY]));
  chrome.storage.onChanged.addListener((c,a)=>{if(a==="local"&&c[KEY])render(c[KEY].newValue);});
  capture();
  if(location.pathname.includes("/settings/usage")){
    let n=0;const timer=setInterval(()=>{capture();if(++n>=15)clearInterval(timer);},1000);
  }
})();
