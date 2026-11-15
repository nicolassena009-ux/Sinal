import {test,expect} from '@playwright/test';
test('cancelamento de outro ponteiro não solta joystick',async({page})=>{
 await page.goto('/?test=1');await page.locator('[data-mode=kids]').click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.hud);
 const result=await page.evaluate(()=>{const h=(window as any).sinalTest.scene.hud;h.joystickId=42;h.stick={x:1,y:0};const el=document.querySelector('.sinal-stick')!;el.dispatchEvent(new PointerEvent('pointercancel',{pointerId:7}));const other=h.stick.x;el.dispatchEvent(new PointerEvent('pointercancel',{pointerId:42}));return{other,own:h.stick.x};});expect(result).toEqual({other:1,own:0});
});



