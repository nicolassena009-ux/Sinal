import Phaser from 'phaser';
export const PIXEL_ASSETS = {room:'/assets/pixel/cafeteria-room.png',furniture:'/assets/pixel/furniture.png',characters:'/assets/pixel/characters-study.png'};
/** Manually registered frames of newly produced assets, not slices of concept boards. */
export const FURNITURE_FRAMES = {
 table:{x:36,y:142,width:440,height:283},chair:{x:651,y:96,width:236,height:356},
 buffet:{x:1034,y:140,width:491,height:262},plant:{x:104,y:564,width:309,height:405},
 bin:{x:650,y:605,width:236,height:327},tray:{x:1066,y:645,width:417,height:226}
};
export function loadPixelAssets(scene:Phaser.Scene,includeRoom=true){for(const [key,url]of Object.entries(PIXEL_ASSETS)){if(includeRoom||key!=='room')scene.load.image('pixel-'+key,url);};}
export function generateTextures(scene:Phaser.Scene){
 const furniture=scene.textures.get('pixel-furniture');furniture.setFilter(Phaser.Textures.FilterMode.NEAREST);
 for(const [name,r]of Object.entries(FURNITURE_FRAMES))if(!furniture.has(name))furniture.add(name,0,r.x,r.y,r.width,r.height);
 if(scene.textures.exists('pixel-room')){const room=scene.textures.get('pixel-room');room.setFilter(Phaser.Textures.FilterMode.NEAREST);
 if(!room.has('walls')){room.add('walls',0,0,0,1536,286);room.add('floor',0,0,286,1536,738);}
 }
 const people=scene.textures.get('pixel-characters');people.setFilter(Phaser.Textures.FilterMode.NEAREST);
 for(const [row,name]of ['teddy','marina','rafa','lia'].entries())for(let frame=0;frame<4;frame++)if(!people.has(name+'-'+frame))people.add(name+'-'+frame,0,frame*384,row*256,384,256);
}
