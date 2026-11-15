import { useEffect, useRef } from 'react';
import type { EventSink, GameInput } from './contract';
/** Host supplies a stable input object; a new object deliberately starts a new instance. */
export function SinalGame({input,onEvent}:{input:GameInput;onEvent:EventSink}) {
  const ref=useRef<HTMLDivElement>(null);const callback=useRef(onEvent);callback.current=onEvent;
  useEffect(()=>{let disposed=false;let destroy:(()=>void)|undefined;
    void import('../game').then(({mountGame})=>{if(disposed||!ref.current)return;destroy=mountGame(ref.current,input,e=>callback.current(e)).destroy;}).catch(error=>{if(!disposed)callback.current({version:1,missionId:input.missionId,type:'recoverable-error',message:String(error)});});
    return()=>{disposed=true;destroy?.();};
  },[input]);
  return <div ref={ref} style={{width:'100%',height:'100%',minHeight:360}} aria-label="Sinal, missão educativa"/>;
}
