import {test,expect} from '@playwright/test';
test('Queimaduras recupera falha de asset sem deixar uma tela vazia',async({page})=>{
 await page.route('**/assets/burns/characters.png',r=>r.abort());await page.goto('/?test=1');await page.locator('[data-mission=burns]').click();await page.locator('[data-mode=kids]').click();await expect(page.getByText('Não foi possível carregar a cozinha.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>(window as any).sinalEvents.some((e:any)=>e.type==='recoverable-error'&&e.missionId==='burns'))).toBe(true);
 await page.unroute('**/assets/burns/characters.png');await page.getByRole('button',{name:'Tentar novamente'}).click();await page.waitForFunction(()=>(window as any).sinalTest?.scene.mission.phase==='explore');await expect(page.locator('canvas')).toHaveCount(1);await expect(page.locator('.sinal-hud')).toHaveCount(1);
});
test('Queimaduras desmonta áudio, canvas e HUD em três montagens React',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/tests/fixtures/react.html?test=1');await page.waitForFunction(()=>!!(window as any).reactHarness);
 for(let i=0;i<3;i++){
  await page.evaluate(()=>(window as any).reactHarness.mount('burns'));await page.waitForFunction(()=>(window as any).sinalTest?.scene.scene.key==='kitchen');await expect(page.locator('canvas')).toHaveCount(1);await expect(page.locator('.sinal-hud')).toHaveCount(1);
  await page.evaluate(()=>{const s=(window as any).sinalTest.scene;s.interact();(window as any).closedAudio=s.audio.context;(window as any).reactHarness.unmount();});await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.sinal-hud')).toHaveCount(0);await page.waitForFunction(()=>(window as any).closedAudio.state==='closed');
 }
 expect(errors).toEqual([]);
});
