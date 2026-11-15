import Phaser from 'phaser';
export class CameraRig {
  constructor(private camera: Phaser.Cameras.Scene2D.Camera, private reduced: boolean, width=1600,height=1100) { camera.setBounds(0, 0, width, height); }
  follow(target: Phaser.GameObjects.Container) { this.camera.startFollow(target, true, this.reduced ? 1 : 0.07, this.reduced ? 1 : 0.07); this.camera.zoomTo(1, this.reduced ? 0 : 450); }
  focus(x: number, y: number, zoom = 1.35) { this.camera.stopFollow(); this.camera.pan(x, y, this.reduced ? 0 : 650, 'Sine.easeInOut'); this.camera.zoomTo(zoom, this.reduced ? 0 : 650); }
}
