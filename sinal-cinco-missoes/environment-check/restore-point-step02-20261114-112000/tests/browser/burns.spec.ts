import {test,expect,type Page} from '@playwright/test';
async function ready(page:Page,mode='kids'){await page.goto('/?test=1');await page.locator('[data-mission=burns]').click();await page.locator(`[data-mode=${mode}]`).click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.mission);}
async function phase(page:Page,value:string){await page.waitForFunction(value=>(window as any).sinalTest.scene.mission.phase===value,value);}
// Uses the actual scene navigation and interaction, without positioning or advancing the mission.
async function approach(page:Page,id:string){await page.evaluate(id=>(window as any).sinalTest.scene.requestInteraction(id),id);await page.waitForFunction(()=>(window as any).sinalTest.scene.teddy.route.status!=='moving');}
for(const mode of ['kids','teens','mobile'])test(`queimaduras: percurso integral ${mode}`,async({page:desktop,browser})=>{
 const context=mode==='mobile'?await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true}):undefined;const page=context?await context.newPage():desktop;
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await ready(page,mode==='mobile'?'kids':mode);
 expect(await page.evaluate(()=>(window as any).sinalTest.scene.actors.map((a:any)=>a.role))).toEqual(['teddy','sister','mother']);
 await page.screenshot({path:`docs/burns/kitchen-${mode}.png`});await approach(page,'mother');await phase(page,'assess');
 await approach(page,'sister');await phase(page,'secure');await approach(page,'mother');await phase(page,'moveToSink');await approach(page,'mother');await phase(page,'cooling');
 expect(await page.evaluate(()=>(window as any).sinalTest.scene.sister.x)).toBeCloseTo(780,0);
 await approach(page,'sink');await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.waterRunning);
 if(mode==='mobile')expect(await page.evaluate(()=>{const s=(window as any).sinalTest.scene;const c=s.cameras.main;const p=c.matrix.transformPoint(s.sister.x-c.scrollX,s.sister.y-55-c.scrollY);const r=s.hud.panel.getBoundingClientRect();return p.x>r.left&&p.x<r.right&&p.y>r.top&&p.y<r.bottom;})).toBe(false);
 await page.screenshot({path:`docs/burns/cooling-${mode}.png`});await page.keyboard.press('Escape');const cooling=await page.evaluate(()=>(window as any).sinalTest.scene.mission.simulatedCoolingSeconds);await page.waitForTimeout(400);expect(await page.evaluate(()=>(window as any).sinalTest.scene.mission.simulatedCoolingSeconds)).toBe(cooling);await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await approach(page,'fridge');await expect(page.getByText(/Não use gelo, manteiga/)).toBeVisible();await phase(page,'protection');await approach(page,'kit');await approach(page,'mother');await phase(page,'seekHelp');await page.waitForFunction(()=>!(window as any).sinalTest.scene.locked);await page.keyboard.press('e');await page.getByRole('button',{name:'Acompanhar a mãe à avaliação'}).click();await phase(page,'complete');await expect(page.getByRole('heading',{name:'MISSÃO CONCLUÍDA — QUEIMADURAS'})).toBeVisible();await page.screenshot({path:`docs/burns/complete-${mode}.png`});
 const events=await page.evaluate(()=>(window as any).sinalEvents);expect(events.filter((e:any)=>e.type==='mission-completed')).toHaveLength(1);expect(events.find((e:any)=>e.type==='mission-completed').result.clinicalReview).toBe('pending');
 expect(await page.evaluate(()=>(window as any).sinalTest.scene.actionLog.every((a:any)=>a.executor==='mother'))).toBe(true);expect(errors).toEqual([]);
 await page.getByRole('button',{name:'Jogar novamente'}).click();await phase(page,'explore');await expect(page.locator('canvas')).toHaveCount(1);
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Voltar ao Quartel-General',exact:true}).click();await page.locator('[data-mission=choking]').click();await page.locator('[data-mode=kids]').click();await page.waitForFunction(()=>(window as any).sinalTest?.scene.scene.key==='cafeteria');await context?.close();
});
test('cozinha: movimento, colisão, saída durante cena e orientação',async({page})=>{
 await ready(page);await page.getByRole('button',{name:'Explorar a cozinha'}).click();const x=await page.evaluate(()=>(window as any).sinalTest.scene.teddy.x);await page.keyboard.down('ArrowRight');await page.waitForTimeout(700);await page.keyboard.up('ArrowRight');expect(await page.evaluate(()=>(window as any).sinalTest.scene.teddy.x)).toBeGreaterThan(x+80);
 // Approach the table from the left and push against its full footprint.
 await page.evaluate(()=>{const s=(window as any).sinalTest.scene;s.teddy.goTo({x:450,y:610});});await page.waitForFunction(()=>(window as any).sinalTest.scene.teddy.route.status==='arrived');await page.keyboard.down('ArrowRight');await page.waitForTimeout(900);await page.keyboard.up('ArrowRight');expect(await page.evaluate(()=>(window as any).sinalTest.scene.teddy.x)).toBeLessThanOrEqual(471);
 await page.setViewportSize({width:844,height:390});await page.screenshot({path:'docs/burns/landscape.png'});await page.setViewportSize({width:390,height:844});await expect(page.locator('.sinal-rotate')).toBeVisible();await page.screenshot({path:'docs/burns/portrait.png'});
 await approach(page,'mother');await phase(page,'incident');await page.keyboard.press('Escape');await page.getByRole('button',{name:'Voltar ao Quartel-General',exact:true}).click();await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.sinal-hud')).toHaveCount(0);
});
