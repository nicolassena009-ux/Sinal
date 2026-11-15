import {test,expect} from '@playwright/test';

test('pixel art carregada, camadas e professora contornando a mesa',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?test=1');await page.locator('[data-mode=teens]').click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.navigation);
 await page.setViewportSize({width:1600,height:1100});
 const route=await page.evaluate(()=>{
  const s=(window as any).sinalTest.scene;s.cameras.main.stopFollow();s.cameras.main.setZoom(1);s.cameras.main.centerOn(800,550);
  const origin={x:s.marina.x,y:s.marina.y};const goal={x:700,y:590};const direct=s.navigation.segmentClear(origin,goal);const accepted=s.marina.goTo(goal);
  (window as any).routeSamples=[];s.events.on('postupdate',()=>{(window as any).routeSamples.push({x:s.marina.x,y:s.marina.y,free:s.navigation.walkable(s.marina)});});
  return {direct,accepted,count:s.marina.route.path.length,keys:['pixel-room','pixel-furniture','pixel-characters'].every(k=>s.textures.exists(k)),layers:['layer:floor','layer:architecture','layer:ground-details'].every(k=>!!s.children.getByName(k))};
 });
 expect(route).toMatchObject({direct:false,accepted:true,keys:true,layers:true});expect(route.count).toBeGreaterThan(1);
 await page.screenshot({path:'docs/visual-v2/refeitorio-desktop.png'});
 await page.waitForFunction(()=>(window as any).sinalTest.scene.marina.route.status==='arrived');
 expect(await page.evaluate(()=>(window as any).routeSamples.every((p:any)=>p.free))).toBe(true);
 const distance=await page.evaluate(()=>{const a=(window as any).routeSamples;return a.slice(1).reduce((sum:number,p:any,i:number)=>sum+Math.hypot(p.x-a[i].x,p.y-a[i].y),0);});expect(distance).toBeGreaterThan(Math.hypot(310,195));
 await page.keyboard.press('Escape');const frozen=await page.evaluate(()=>(window as any).sinalTest.scene.marina.x);await page.waitForTimeout(100);expect(await page.evaluate(()=>(window as any).sinalTest.scene.marina.x)).toBe(frozen);await page.getByRole('button',{name:'Continuar',exact:true}).click();
 // Foot depth remains ordered correctly before and behind the same table.
 await page.evaluate(()=>{(window as any).sinalTest.scene.teddy.setPosition(760,365);});await page.waitForTimeout(100);
 expect(await page.evaluate(()=>{const s=(window as any).sinalTest.scene;return s.teddy.depth<s.children.getByName('table-1').depth;})).toBe(true);
 await page.screenshot({path:'docs/visual-v2/profundidade-atras.png'});
 await page.evaluate(()=>{(window as any).sinalTest.scene.teddy.setPosition(760,580);});await page.waitForTimeout(100);
 expect(await page.evaluate(()=>{const s=(window as any).sinalTest.scene;return s.teddy.depth>s.children.getByName('table-1').depth;})).toBe(true);
 await page.screenshot({path:'docs/visual-v2/profundidade-frente.png'});expect(errors).toEqual([]);
});

test('novo cenário em celular horizontal e vertical',async({browser})=>{
 const context=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.goto('/?test=1');await page.locator('[data-mode=kids]').click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.navigation);
 await page.evaluate(()=>{const s=(window as any).sinalTest.scene;s.teddy.setPosition(700,600);s.cameras.main.centerOn(700,600);});await page.waitForTimeout(500);
 await expect(page.locator('.sinal-stick')).toBeVisible();await page.screenshot({path:'docs/visual-v2/refeitorio-mobile-horizontal.png'});
 await page.setViewportSize({width:390,height:844});await expect(page.locator('.sinal-rotate')).toBeVisible();await page.screenshot({path:'docs/visual-v2/refeitorio-mobile-vertical.png'});await context.close();
});
