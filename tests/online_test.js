// Test du jeu en ligne : 2 navigateurs (hôte + invité) et un serveur PeerJS local.
// Prérequis : npm i peerjs@1.5.4 peer@1.0.2 dans un dossier, puis lancer un PeerServer sur 127.0.0.1:9000 (chemin /). Adapter `peerjs` ci-dessous.
const { chromium } = require('playwright');
const path='/home/claude/turf-hockey/index.html';
const peerjs='/tmp/peerlab/node_modules/peerjs/dist/peerjs.min.js';
const cfg={host:'127.0.0.1',port:9000,path:'/',secure:false,config:{iceServers:[]}};
(async()=>{
  const b=await chromium.launch();const errs=[];
  async function mk(name){const ctx=await b.newContext({viewport:{width:1100,height:640}});
    await ctx.addInitScript(c=>{window.TH26_PEER_CONFIG=c},cfg);
    await ctx.route('**/peerjs.min.js',r=>r.fulfill({path:peerjs,contentType:'application/javascript'}));
    await ctx.route('**/fonts.googleapis.com/**',r=>r.abort());
    const pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(name+': '+e));pg.on('console',m=>{if(m.type()==='error')errs.push(name+' console: '+m.text())});
    await pg.goto('file://'+path);return pg}
  const H=await mk('host'),G=await mk('guest');
  const vis=(p,i)=>p.evaluate(i=>!document.getElementById(i).hidden,i);
  const txt=(p,i)=>p.evaluate(i=>document.getElementById(i).textContent,i);
  await H.click('#onl');await H.click('#onCreate');
  await H.waitForFunction(()=>!document.getElementById('onCode').hidden,{timeout:15000});
  const code=await txt(H,'onCode');console.log('code',code);
  await G.click('#onl');await G.fill('#code',code);await G.click('#onJoin');
  await G.waitForFunction(()=>document.getElementById('onT').textContent.startsWith('Salle'),{timeout:15000});
  console.log('guest:',await txt(G,'onN'),'|',await txt(G,'onL'));
  console.log('host list:',await txt(H,'onL'));
  await H.click('#onPads');await H.waitForTimeout(600);
  console.log('guest pads msg:',await txt(G,'onN'));
  console.log('host asg:',await txt(H,'asgInfo'));
  await H.click('#kick');await G.waitForTimeout(1500);
  console.log('guest menu hidden?',await vis(G,'online'),await G.evaluate(()=>document.getElementById('n0').textContent+' '+document.getElementById('n1').textContent));
  // guest moves
  await G.keyboard.down('KeyD');await G.waitForTimeout(100);
  await G.keyboard.down('KeyD');await G.waitForTimeout(2500);await G.keyboard.up('KeyD');
  await G.screenshot({path:'/tmp/claude-0/-home-claude/86cff252-4446-5298-bad7-ad4e84c12904/scratchpad/g1.png'});
  await H.screenshot({path:'/tmp/claude-0/-home-claude/86cff252-4446-5298-bad7-ad4e84c12904/scratchpad/h1.png'});
  console.log('clock H/G',await txt(H,'clk'),await txt(G,'clk'),'score',await txt(G,'s0'),await txt(G,'s1'));
  // host pause
  await H.keyboard.down('Escape');await H.waitForTimeout(100);await H.keyboard.up('Escape');await G.waitForTimeout(800);
  console.log('guest overlay on host pause:',await vis(G,'gm'),await txt(G,'gmT'));
  await G.screenshot({path:'/tmp/claude-0/-home-claude/86cff252-4446-5298-bad7-ad4e84c12904/scratchpad/g2.png'});
  await H.click('#resume');await G.waitForTimeout(600);
  console.log('guest overlay after resume:',await vis(G,'gm'));
  // host back to lobby
  await H.keyboard.down('Escape');await H.waitForTimeout(100);await H.keyboard.up('Escape');await H.click('#quit');await G.waitForTimeout(800);
  console.log('guest back in lobby:',await vis(G,'online'),await txt(G,'onN'));
  // guest leaves
  await G.click('#onLeave');await H.waitForTimeout(800);console.log('host list after leave:',await txt(H,'onL'));
  await H.click('#onLeave');console.log('host menu:',await vis(H,'menu'));
  console.log('ERRORS',errs);
  await b.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1)});
