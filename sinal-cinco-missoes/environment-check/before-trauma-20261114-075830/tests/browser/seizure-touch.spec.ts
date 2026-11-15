import {test,expect} from '@playwright/test';
test('Convulsão: joystick multitoque, rotação e descarregamento React',async({browser})=>{
 const context=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
 const page=await context.newPage();await page.goto('/tests/fixtures/react.html?test=1');
 await page.waitForFunction(()=>!!(window as any).reactHarness);
 for(let i=0;i<3;i++){
  await page.evaluate(()=>(window as any).reactHarness.mount('seizure'));
  await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.hud);
  if(i===0){
   const box=(await page.locator('.sinal-stick').boundingBox())!,button=(await page.locator('.sinal-interact').boundingBox())!;
   const cdp=await context.newCDPSession(page),one={id:1,x:box.x+95,y:box.y+56},two={id:2,x:button.x+35,y:button.y+35};
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[one]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[one,two]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[two]});
   expect(await page.evaluate(()=>(window as any).sinalTest.scene.hud.stick.x)).toBeGreaterThan(.5);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   expect(await page.evaluate(()=>(window as any).sinalTest.scene.hud.stick.x)).toBe(0);
   await page.setViewportSize({width:390,height:844});await expect(page.locator('.sinal-rotate')).toBeVisible();
   await page.screenshot({path:'docs/seizure/portrait.png'});
  }
  await page.evaluate(()=>{const s=(window as any).sinalTest.scene;s.audio.unlock();(window as any).oldContext=s.audio.context;(window as any).reactHarness.unmount();});
  await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.sinal-hud')).toHaveCount(0);
  await page.waitForFunction(()=>(window as any).oldContext?.state==='closed');
 }
 await context.close();
});
