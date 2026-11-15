import {test,expect,type Page} from '@playwright/test';
async function ready(page:Page,mode='teens'){await page.goto('/?test=1');await page.locator(`[data-mode=${mode}]`).click();await expect(page.locator('canvas')).toBeVisible();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.hud);}
async function near(page:Page,id:string){await page.evaluate(id=>(window as any).sinalTest.position(id),id);}
async function phase(page:Page,p:string){await page.waitForFunction(p=>(window as any).sinalTest.state().phase===p,p);await page.waitForTimeout(100);}
test('menu, movimentação, pausa, redimensionamento, retorno e descarregamento',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await page.screenshot({path:'test-results/menu.png'});await ready(page);
 const before=await page.evaluate(()=>(window as any).sinalTest.state());await page.keyboard.down('ArrowRight');await page.waitForFunction(x=>(window as any).sinalTest.state().x>x+40,before.x);await page.keyboard.up('ArrowRight');expect((await page.evaluate(()=>(window as any).sinalTest.state())).x).toBeGreaterThan(before.x+40);
 await page.keyboard.press('Escape');await expect(page.getByText('Missão em pausa')).toBeVisible();const paused=await page.evaluate(()=>(window as any).sinalTest.scene.mission.elapsed);await page.waitForTimeout(300);expect(await page.evaluate(()=>(window as any).sinalTest.scene.mission.elapsed)).toBe(paused);await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await page.setViewportSize({width:844,height:390});await page.screenshot({path:'test-results/mobile-landscape.png'});expect(await page.locator('canvas').evaluate(c=>c.clientWidth)).toBe(844);
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Voltar ao Quartel-General',exact:true}).click();await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.sinal-hud')).toHaveCount(0);await expect(page.locator('[data-mode=kids]')).toBeVisible();expect(errors).toEqual([]);
});
for(const mode of ['teens','kids'])test(`missão completa ${mode}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await ready(page,mode);
 // Advance only the opening wait; progression and clinical actions use the real UI.
 await page.evaluate(()=>(window as any).sinalTest.scene.mission.explore(230));await phase(page,'cough');expect(await page.evaluate(()=>(window as any).sinalTest.scene.rafa.behavior)).toBe('cough');await near(page,'rafa');await page.keyboard.press('e');await phase(page,'monitor');expect(await page.evaluate(()=>(window as any).sinalTest.scene.teddy.animationState)).toBe('observe');
 await page.getByRole('button',{name:/Continue tossindo/}).click();await page.getByRole('button',{name:/Observar novamente/}).click();await phase(page,'severe');await page.locator('canvas').click({position:{x:500,y:300}});await page.keyboard.press('e');await phase(page,'help');
 expect(await page.evaluate(()=>(window as any).sinalTest.scene.rafa.behavior)).toBe('distress');await near(page,'marina');await page.keyboard.press('e');await phase(page,'call');await near(page,'lia');await page.keyboard.press('e');await phase(page,'position');await near(page,'rafa');await page.keyboard.press('e');await page.keyboard.press('e');await phase(page,'back');
 for(let i=0;i<10;i++){await page.waitForFunction(()=>{const m=(window as any).sinalTest.scene.mission;return m.elapsed-m.lastGesture>=1.25;});await page.getByRole('button',{name:mode==='kids'?/Acompanhar ação/:/Praticar movimento/}).click();if(i===2)await page.screenshot({path:`test-results/procedure-${mode}.png`});}
 await phase(page,'reassess');await page.getByRole('button',{name:/Verificar respiração/}).click();await page.getByRole('button',{name:/Acolher Rafa/}).click();await phase(page,'complete');await expect(page.getByText('Cuidar começa')).toBeVisible();await page.screenshot({path:`test-results/result-${mode}.png`});
 const events=await page.evaluate(()=>(window as any).sinalEvents);expect(events.filter((e:any)=>e.type==='mission-completed')).toHaveLength(1);expect(events.filter((e:any)=>e.type==='objective-completed')).toHaveLength(6);expect(errors).toEqual([]);
 await page.getByRole('button',{name:'Jogar novamente'}).click();await phase(page,'explore');await expect(page.locator('canvas')).toHaveCount(1);await expect(page.locator('.sinal-hud')).toHaveCount(1);
});
test('mobile joystick, retorno ao centro e retrato',async({browser})=>{
 const context=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});const page=await context.newPage();await ready(page,'kids');const stick=page.locator('.sinal-stick');await expect(stick).toBeVisible();const box=(await stick.boundingBox())!;
 await page.mouse.move(box.x+56,box.y+56);await page.mouse.down();await page.mouse.move(box.x+98,box.y+56);await page.waitForTimeout(400);expect(await page.evaluate(()=>(window as any).sinalTest.scene.hud.stick.x)).toBeGreaterThan(.5);await page.mouse.up();expect(await page.evaluate(()=>(window as any).sinalTest.scene.hud.stick.x)).toBe(0);
 const cdp=await context.newCDPSession(page);const one={x:box.x+96,y:box.y+56,id:1};const button=(await page.locator('.sinal-interact').boundingBox())!;const two={x:button.x+35,y:button.y+35,id:2};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[one]});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[one,two]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[two]});expect(await page.evaluate(()=>(window as any).sinalTest.scene.hud.stick.x)).toBeGreaterThan(.5);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});expect(await page.evaluate(()=>(window as any).sinalTest.scene.hud.stick.x)).toBe(0);
 await page.setViewportSize({width:390,height:844});await expect(page.locator('.sinal-rotate')).toBeVisible();await page.screenshot({path:'test-results/mobile-portrait.png'});await context.close();
});
test('percurso real da entrada até Rafa e gesto com arrasto',async({page})=>{
 await ready(page);await page.keyboard.press('e');await expect(page.getByRole('heading',{name:'Bem-vindo ao refeitório'})).toBeVisible();
 async function walk(key:string,axis:'x'|'y',value:number,greater:boolean){await page.keyboard.down(key);await page.waitForFunction(({axis,value,greater})=>{const n=(window as any).sinalTest.state()[axis];return greater?n>=value:n<=value;},{axis,value,greater},{timeout:15000});await page.keyboard.up(key);}
 await walk('ArrowRight','x',535,true);await walk('ArrowUp','y',610,false);await walk('ArrowRight','x',710,true);await page.screenshot({path:'test-results/exploration.png'});
 expect(await page.evaluate(()=>(window as any).sinalTest.scene.walls.some((r:any)=>{const t=(window as any).sinalTest.scene.teddy;return t.x>r.x&&t.x<r.x+r.w&&t.y>r.y&&t.y<r.y+r.h;}))).toBe(false);
 await phase(page,'cough');await page.keyboard.press('e');await phase(page,'monitor');await page.keyboard.press('e');await page.keyboard.press('e');await phase(page,'severe');await page.keyboard.press('e');await phase(page,'help');await near(page,'marina');await page.keyboard.press('e');await phase(page,'call');await near(page,'lia');await page.keyboard.press('e');await phase(page,'position');await near(page,'rafa');await page.keyboard.press('e');await page.keyboard.press('e');await phase(page,'back');
 const art=(await page.locator('[data-gesture=back]').boundingBox())!;await page.mouse.move(art.x+50,art.y+70);await page.mouse.down();await page.mouse.move(art.x+110,art.y+70,{steps:6});await page.mouse.up();await expect(page.locator('.sinal-count .done')).toHaveCount(1);
});



