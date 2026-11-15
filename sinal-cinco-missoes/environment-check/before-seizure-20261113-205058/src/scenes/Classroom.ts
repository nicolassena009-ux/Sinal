import {SupportScene} from './SupportScene';
import type {GameInput,EventSink} from '../integration/contract';
export class Classroom extends SupportScene{constructor(host:HTMLElement,input:GameInput,emit:EventSink,restart:()=>void,leave:()=>void){super(host,input,emit,restart,leave,'seizure');}}
