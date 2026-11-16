// Test de la liste publique : 5 navigateurs + serveur PeerJS local (voir online_test.js).
const { chromium } = require('playwright');
const path='/home/claude/turf-hockey/index.html',peerjs='/tmp/peerlab/node_modules/peerjs/dist/peerjs.min.js';
const cfg={host:'127.0.0.1',port:9000,path:'/',secure:false,config:{iceServers:[]}};
(async()=>{const b=await chromium.launch();const errs=[];
  async function mk(n){const ctx=await b.newContext({viewport:{width:1100,height:640}});
    await ctx.addInitScript(c=>{window.TH26_PEER_CONFIG=c},cfg);
    await ctx.route('**/peerjs.min.js',r=>r.fulfill({path:peerjs,contentType:'application/javascript'}));
    await ctx.route('**/fonts.googleapis.com/**',r=>r.abort());
    const pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(n+': '+e));await pg.goto('file://'+path);return pg}
  const txt=(p,i)=>p.evaluate(i=>document.getElementById(i).textContent,i);
  const A=await mk('A'),B=await mk('B'),C=await mk('C'),D=await mk('D');
  const host=async p=>{await p.click('#onl');await p.click('#onCreate');await p.waitForFunction(()=>!document.getElementById('onCode').hidden,{timeout:15000});await p.click('#onPub')};
  // liste vide
  await D.click('#onl');await D.click('#onList');await D.waitForFunction(()=>document.getElementById('onN').textContent.startsWith('Aucune'),{timeout:15000});console.log('empty list ok');
  try{await host(A)}catch(e){console.log('A state',await txt(A,'onT'),'|',await txt(A,'onN'))}await A.waitForTimeout(1500);
  await host(B);await B.waitForTimeout(2500);
  await D.waitForFunction(()=>!document.getElementById('rm1').hidden,{timeout:20000});
  console.log('rooms:',await txt(D,'rm0'),'|',await txt(D,'rm1'));
  await D.click('#rm0');await D.waitForFunction(()=>document.getElementById('onT').textContent.startsWith('Salle'),{timeout:15000});
  console.log('D joined:',await txt(D,'onL'));
  // A is registry holder? check which host sees D
  console.log('A:',await txt(A,'onL'),'| B:',await txt(B,'onL'));
  // A leaves -> B must keep listed after re-claim
  await A.click('#onLeave');await B.waitForTimeout(7000);
  const E=await mk('E');await E.click('#onl');await E.click('#onList');
  await E.waitForFunction(()=>!document.getElementById('rm0').hidden,{timeout:20000}).catch(()=>{});
  console.log('after A left, E sees:',await txt(E,'onN'),'|',await E.evaluate(()=>document.getElementById('rm0').hidden?'none':document.getElementById('rm0').textContent));
  console.log('ERRORS',errs.filter(e=>!/ERR_FAILED/.test(e)));await b.close()})().catch(e=>{console.error('FAIL',e);process.exit(1)});
