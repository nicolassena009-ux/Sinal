import {AudioBus} from './audio';
/** Keeps the existing Engasgo audio behavior unchanged. */
export class KitchenAudio extends AudioBus {
 volume=.5;
 override tone(f=520,duration=.09,volume=.025){super.tone(f,duration,volume*this.volume);}
}
