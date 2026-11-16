import type {WorldDefinition} from '../core/mission';
import type {Vec} from '../core/movement';
import type {SupportId} from '../missions/support';
export interface Prop {id:string;kind:'table'|'chair'|'plant'|'bin'|'buffet';x:number;y:number;width:number;height:number}
export interface SupportWorld extends WorldDefinition {props:Prop[];points:Record<string,Vec>;labels:Record<string,string>}
function world(width:number,height:number,background:string,props:Prop[],points:Record<string,Vec>,labels:Record<string,string>):SupportWorld{
 return {width,height,background,bounds:{left:50,right:width-50,top:260,bottom:height-60},spawn:{x:180,y:height-130},victim:points.victim,adult:points.adult,props,points,labels,obstacles:props.map(p=>({x:p.x-p.width*.42,y:p.y-(p.kind==='table'||p.kind==='buffet'?60:25),w:p.width*.84,h:p.kind==='table'||p.kind==='buffet'?64:32}))};
}
const prop=(id:string,kind:Prop['kind'],x:number,y:number,width=230,height=148):Prop=>({id,kind,x,y,width,height});
export const WORLDS:Record<SupportId,SupportWorld>={
 seizure:world(1400,1000,'classroom',[
 prop('desk1','table',340,480),prop('desk2','table',1000,480),prop('desk3','table',340,740),prop('desk4','table',1000,740),prop('seat1','chair',335,540,65,98),prop('seat2','chair',995,540,65,98),prop('plant','plant',1260,370,95,125)
 ],{victim:{x:710,y:620},adult:{x:1120,y:320},bag:{x:620,y:730},safe:{x:180,y:350},phone:{x:1260,y:840}},{bag:'MOCHILA',safe:'GUARDAR',phone:'TELEFONE'}),
 cardiac_arrest:world(1800,850,'corridor',[
 prop('bench1','table',480,420,280,130),prop('bench2','table',1310,420,280,130),prop('plant','plant',1610,350,95,125),prop('bin','bin',160,350,70,98)
 ],{victim:{x:920,y:590},adult:{x:1150,y:310},phone:{x:270,y:540},resource:{x:1450,y:570},safe:{x:1650,y:710}},{phone:'TELEFONE · 192',resource:'DEA',safe:'ACESSO DO SOCORRO'}),
 burns:world(1300,950,'kitchen',[
 prop('counter1','buffet',380,440,350,185),prop('counter2','buffet',1000,440,350,185),prop('prep','table',720,700,290,155),prop('bin','bin',1130,790,70,98)
 ],{victim:{x:530,y:580},adult:{x:850,y:320},hazard:{x:380,y:505},sink:{x:1000,y:505},resource:{x:180,y:650},safe:{x:340,y:800}},{hazard:'RISCO · CALOR',sink:'PIA',resource:'PLACA',safe:'SINALIZAR'}),
 trauma:world(1700,1150,'courtyard',[
 prop('bench1','table',360,470,290,145),prop('bench2','table',1300,470,290,145),prop('planter','plant',520,780,130,170),prop('planter2','plant',1280,830,130,170),prop('bin','bin',1470,990,70,98)
 ],{victim:{x:900,y:730},adult:{x:1400,y:330},resource:{x:720,y:910},safe:{x:250,y:960},phone:{x:210,y:580}},{resource:'BOLA',safe:'GUARDAR',phone:'INTERFONE'})
};
