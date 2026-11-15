const {spawn}=require('node:child_process');
const readline=require('node:readline');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const results={};
async function context7(){
 let id=0;
 async function rpc(method,params){
  const r=await fetch('https://mcp.context7.com/mcp',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:++id,method,params}),signal:AbortSignal.timeout(45000)});
  const raw=await r.text(); if(!r.ok)throw Error(r.status+': '+raw);
  const data=raw.startsWith('event:')?JSON.parse(raw.split('\n').find(x=>x.startsWith('data: ')).slice(6)):JSON.parse(raw);
  if(data.error)throw Error(JSON.stringify(data.error));return data.result;
 }
 results.initialize=await rpc('initialize',{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'sinal-environment-check',version:'1'}});
 results.tools=await rpc('tools/list',{});
 for(const libraryName of ['Phaser','TypeScript'])results[libraryName]=await rpc('tools/call',{name:'resolve-library-id',arguments:{libraryName,query:libraryName==='Phaser'?'Phaser 3.90 Arcade physics movement collisions':'TypeScript 5.9 type checking'}});
 const phaserText=JSON.stringify(results.Phaser); const match=phaserText.match(/\/[^\s"\\]+\/[^\s"\\]+/);
 if(match)results.docs=await rpc('tools/call',{name:'query-docs',arguments:{libraryId:match[0],query:'Phaser 3 Arcade Physics velocity and colliders'}});
}
async function playwright(){
 const child=spawn(process.execPath,[path.join(root,'engasgo/node_modules/playwright/cli.js'),'mcp','--headless','--isolated','--executable-path','C:/Program Files/Google/Chrome/Application/chrome.exe','--caps','vision','--output-dir',__dirname],{cwd:path.join(root,'engasgo'),stdio:['pipe','pipe','pipe'],windowsHide:true});
 const pending=new Map();let id=0;
 child.stderr.on('data',d=>process.stderr.write(d));
 readline.createInterface({input:child.stdout}).on('line',l=>{try{const m=JSON.parse(l);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}}catch{}});
 async function rpc(method,params){const n=++id;const data=await Promise.race([new Promise(resolve=>{pending.set(n,resolve);child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:n,method,params})+'\n')}),new Promise((_,reject)=>{const t=setTimeout(()=>reject(Error('MCP timeout '+method)),60000);t.unref()})]);if(data.error)throw Error(JSON.stringify(data.error));return data.result;}
 try{
 results.initialize=await rpc('initialize',{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'sinal-environment-check',version:'1'}});
 child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');
 results.tools=await rpc('tools/list',{});
 results.navigate=await rpc('tools/call',{name:'browser_navigate',arguments:{url:'http://127.0.0.1:5191/'}});
 results.screenshot=await rpc('tools/call',{name:'browser_take_screenshot',arguments:{type:'png',filename:path.join(__dirname,'sinal-browser.png')}});
 results.evaluate=await rpc('tools/call',{name:'browser_evaluate',arguments:{function:'() => ({ title: document.title, canvas: document.querySelectorAll("canvas").length, text: document.body.innerText.slice(0,1500) })'}});
 results.console=await rpc('tools/call',{name:'browser_console_messages',arguments:{level:'error'}});
 await rpc('tools/call',{name:'browser_close',arguments:{}});
 }finally{child.kill();}
}
(async()=>{const mode=process.argv[2];try{await(mode==='context7'?context7():playwright())}catch(e){results.error=e.message;process.exitCode=1}fs.writeFileSync(path.join(__dirname,mode+'-results.json'),JSON.stringify(results,null,2));for(const [key,value] of Object.entries(results)){if(value?.isError)process.exitCode=1;console.log(key, value?.isError?'ERROR':'recorded');}})();

