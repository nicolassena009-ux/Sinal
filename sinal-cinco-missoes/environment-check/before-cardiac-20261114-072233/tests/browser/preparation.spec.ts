import {test,expect} from '@playwright/test';
for(const mode of ['kids','teens'])test(`preparação mantém Teddy perto da vítima: ${mode}`,async({page})=>{
 await page.goto('/?test=1');await page.locator(`[data-mode=${mode}]`).click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.navigation);
 const original=await page.evaluate(()=>{const t=(window as any).sinalTest;t.position('rafa');t.scene.mission.transition('position');return{x:t.scene.teddy.x,y:t.scene.teddy.y};});
 await page.waitForTimeout(100);await page.keyboard.press('e');await page.keyboard.press('e');
 await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.phase==='back');
 expect(await page.evaluate(()=>{const a=(window as any).sinalTest.scene.teddy;return{x:a.x,y:a.y};})).toEqual(original);
 await page.evaluate(()=>{const s=(window as any).sinalTest.scene;s.perform('gesture');});
 expect(await page.evaluate(mode=>{const s=(window as any).sinalTest.scene;return(mode==='kids'?s.marina:s.teddy).animationState;},mode)).toBe('assist');
});
test('rota impossível libera controles e permite nova tentativa',async({page})=>{
 await page.goto('/?test=1');await page.locator('[data-mode=kids]').click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.navigation);
 await page.evaluate(()=>{const t=(window as any).sinalTest;t.position('rafa');t.scene.mission.transition('position');t.scene.navigation.obstacles.push({x:680,y:570,w:40,h:40});});await page.waitForTimeout(100);await page.keyboard.press('e');await page.keyboard.press('e');
 expect(await page.evaluate(()=>(window as any).sinalTest.scene.locked)).toBe(false);
 await expect(page.getByText(/acesso está bloqueado/)).toBeVisible();
});
