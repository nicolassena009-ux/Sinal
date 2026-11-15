import Phaser from 'phaser';
import type {Rect} from '../core/movement';
import {CAFETERIA_MAP,cafeteriaObstacles,LAYERS} from './cafeteriaMap';
export function buildCafeteria(scene:Phaser.Scene):Rect[]{
 scene.add.image(0,235,'pixel-room','floor').setOrigin(0).setDisplaySize(1600,865).setDepth(LAYERS.floor).setName('layer:floor');
 scene.add.image(0,0,'pixel-room','walls').setOrigin(0).setDisplaySize(1600,235).setDepth(LAYERS.architecture).setName('layer:architecture');
 for(const item of CAFETERIA_MAP.furniture){
  const container=scene.add.container(item.x,item.y).setDepth(item.y).setName(item.id);
  const sprite=scene.add.image(0,0,'pixel-furniture',item.kind).setOrigin(.5,.97).setDisplaySize(item.width,item.height);
  if(item.kind==='chair'&&item.id.endsWith('-1'))sprite.setTint(0xc4eee9);
  container.add(sprite);
  if(item.meal)for(const x of [-59,61])container.add(scene.add.image(x,-117,'pixel-furniture','tray').setDisplaySize(74,40).setOrigin(.5,1).setName(item.id+':tray'));
 }
 const mat=scene.add.graphics().setDepth(LAYERS.groundDetails).setName('layer:ground-details');
 mat.fillStyle(0x6d3fc3,.45);mat.fillRect(100,995,130,38);mat.lineStyle(2,0xffd88e,.9);mat.strokeRect(105,1000,120,28);
 return cafeteriaObstacles();
}
