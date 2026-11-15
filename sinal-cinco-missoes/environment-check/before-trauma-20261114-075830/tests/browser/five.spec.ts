import {test,expect} from '@playwright/test';
for(const id of ['trauma'])for(const mode of ['kids','teens'])test(`${id} ${mode}: exploração, apoio, autoria, resultado`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/tests/fixtures/react.html?test=1');await page.waitForFunction(()=>!!(window as any).reactHarness);await page.evaluate(({id,mode})=>(window as any).reactHarness.mount(id,mode),{id,mode});await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.mission);
 await page.evaluate(()=>{const s=(window as any).sinalTest.scene;s.cameras.main.stopFollow();s.cameras.main.setZoom(.75);s.cameras.main.centerOn(s.world.width/2,s.world.height/2);});
 await page.screenshot({path:`docs/five-missions/${id}-${mode}.png`});
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(800);await page.keyboard.up('ArrowRight');await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.phase==='incident');await page.locator('[data-action=engage]').click();
 for(let i=0;i<6;i++){
  await page.evaluate(()=>{const t=(window as any).sinalTest;t.position(t.scene.mission.task.target);});
  if(i===5)await page.waitForFunction(()=>{const s=(window as any).sinalTest.scene;return Math.hypot(s.marina.x-s.rafa.x,s.marina.y-s.rafa.y)<115;});
  const pos=await page.evaluate(()=>{const s=(window as any).sinalTest.scene;return{x:s.teddy.x,y:s.teddy.y};});
  await page.evaluate(()=>(window as any).sinalTest.scene.interact());await page.locator('[data-action=task]').click();
  expect(await page.evaluate(()=>{const s=(window as any).sinalTest.scene;return{x:s.teddy.x,y:s.teddy.y};})).toEqual(pos);
 }
 await expect(page.getByText('Você ajudou a proteger o espaço.')).toBeVisible();
 const events=await page.evaluate(()=>(window as any).sinalEvents);expect(events.filter((e:any)=>e.type==='mission-completed')).toHaveLength(1);expect(events.every((e:any)=>e.missionId===id)).toBe(true);expect(events.at(-1).result.clinicalReview).toBe('pending');expect(await page.evaluate(()=>(window as any).sinalTest.scene.actionLog.every((a:any)=>a.executor==='teddy'))).toBe(true);expect(errors).toEqual([]);
 await page.getByRole('button',{name:/Voltar ao Quartel/}).click();await expect(page.locator('canvas')).toHaveCount(0);
});
test('cancelamento de outro ponteiro não solta joystick',async({page})=>{
 await page.goto('/?test=1');await page.locator('[data-mode=kids]').click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.hud);
 const result=await page.evaluate(()=>{const h=(window as any).sinalTest.scene.hud;h.joystickId=42;h.stick={x:1,y:0};const el=document.querySelector('.sinal-stick')!;el.dispatchEvent(new PointerEvent('pointercancel',{pointerId:7}));const other=h.stick.x;el.dispatchEvent(new PointerEvent('pointercancel',{pointerId:42}));return{other,own:h.stick.x};});expect(result).toEqual({other:1,own:0});
});


