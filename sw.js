// 保存済みの版をすぐ返し、裏で最新版を取りに行く（電波が弱くても待たされない）
const C='fcalc-v12';const F=['./','index.html','manifest.webmanifest','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const isPage=e.request.mode==='navigate';
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(isPage?'index.html':e.request,{ignoreSearch:true}) || await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{ if(r&&r.ok){ c.put(isPage?'index.html':e.request,r.clone()); } return r; });
    if(hit){ e.waitUntil(net.catch(()=>{})); return hit; }
    return net.catch(()=>c.match('index.html'));
  }));
});
