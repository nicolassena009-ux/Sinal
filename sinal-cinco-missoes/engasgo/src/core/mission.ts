import type {EducationalResult,Mode} from '../integration/contract';
import type {Bounds,Rect,Vec} from './movement';
export interface MissionPresentation {number:string;title:string;place:string}
export interface MissionLogic {phase:string;elapsed:number;completed:string[];mode:Mode;tick(dt:number):void;result():EducationalResult}
export interface WorldDefinition {width:number;height:number;bounds:Bounds;obstacles:Rect[];spawn:Vec;victim:Vec;adult:Vec;background:string}
export interface Conclusion {title:string;summary:string;items:string[];note:string}
