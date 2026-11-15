import React from 'react';
import {createRoot} from 'react-dom/client';
import {SinalGame} from '../../src/integration/SinalGame';
import {defaults,type MissionId,type GameEvent,type Mode} from '../../src/integration/contract';
const root=createRoot(document.getElementById('root')!);const events:GameEvent[]=[];
(window as any).reactHarness={events,mount:(id:MissionId,mode:Mode='kids')=>root.render(<React.StrictMode><div style={{width:'100vw',height:'100vh'}}><SinalGame input={defaults(mode,id)} onEvent={e=>{events.push(e);if(e.type==='return-menu')root.render(null);}}/></div></React.StrictMode>),unmount:()=>root.render(null)};

(window as any).sinalEvents=events;
