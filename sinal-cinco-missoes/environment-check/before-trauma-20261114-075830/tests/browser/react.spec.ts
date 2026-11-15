import {test,expect} from '@playwright/test';
test('React StrictMode: cinco montagens, troca de input e desmontagem',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/tests/fixtures/react.html?test=1');await page.waitForFunction(()=>!!(window as any).reactHarness);
 for(const id of ['choking','seizure','cardiac_arrest','burns','trauma']){await page.evaluate(id=>(window as any).reactHarness.mount(id),id);await page.waitForFunction(id=>(window as any).reactHarness.events.some((e:any)=>e.type==='loaded'&&e.missionId===id),id);await expect(page.locator('canvas')).toHaveCount(1);await expect(page.locator('.sinal-hud')).toHaveCount(1);}
 await page.evaluate(()=>(window as any).reactHarness.unmount());await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.sinal-hud')).toHaveCount(0);expect(errors).toEqual([]);
});
