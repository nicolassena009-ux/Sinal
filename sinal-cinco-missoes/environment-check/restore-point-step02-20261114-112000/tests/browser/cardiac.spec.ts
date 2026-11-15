import {test,expect} from '@playwright/test';
for(const shockable of [true,false])test('Ginásio e transferência · choque '+shockable,async({page})=>{
 if(!shockable)await page.setViewportSize({width:844,height:390});await page.goto('/?test=1');await page.locator('[data-mission=cardiac_arrest]').click();await page.locator('[data-mode=kids]').click();await page.waitForFunction(()=>!!(window as any).sinalTest?.scene.mission);
 await page.evaluate(value=>{(window as any).sinalTest.scene.mission.shockable=value;},shockable);
 const act=(id:string)=>page.locator('[data-action="'+id+'"]').click();
 await act('go-rafael');await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.recognized);
 await page.screenshot({path:'docs/cardiac/rcp.png'});await act('observe');if(shockable){await act('go-phone');await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.called);}
 await act('go-cabinet');await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.carrying);await act('go-rafael');
 await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.delivered);
 for(let i=0;i<4;i++)await act('device');
 await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.stage==='analysis');await page.screenshot({path:'docs/cardiac/analise.png'});
 if(shockable)await act('shock');else{await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.stage==='done');await act('go-phone');await page.waitForFunction(()=>(window as any).sinalTest.scene.mission.called);}await expect(page.getByRole('heading',{name:/VOCÊ AJUDOU A SALVAR TEMPO/})).toBeVisible({timeout:20000});
 expect(await page.evaluate(()=>(window as any).sinalEvents.filter((e:any)=>e.type==='mission-completed').length)).toBe(1);
});


