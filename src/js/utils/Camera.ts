import * as THREE from "three";
import { Space } from "../core/Space";
import { OrbitControls, TrackballControls } from "three-stdlib";

interface CameraConfigProps {
  layer?: number;
}

export class Camera extends THREE.PerspectiveCamera {
  space: Space;
  controls!: OrbitControls;
  tControls!: TrackballControls;
  config: CameraConfigProps;

  get sizer() {
    return this.space.sizer;
  }

  constructor(space: Space, config: CameraConfigProps) {
    super(75, space.sizer.width / space.sizer.height, 0.01, 100);

    this.space = space;

    this.config = {
      ...config,
      layer: config.layer ?? 7,
    };

    this.layers.enable(this.config.layer!);

    this.position.y = 2.45;
    
    this.addControls();
    this.addTControls();
  }

  addControls() {
    this.controls = new OrbitControls(this, this.space.canvas);

    this.controls.target.set(0, 2.5, 0);
    this.controls.setAzimuthalAngle(Math.PI / 1.5);

    this.controls.maxDistance = 25;

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.enableZoom = false;

    this.controls.autoRotate = true;
    this.controls.enabled = false;
  }

  addTControls() {
    this.tControls = new TrackballControls(this, this.space.canvas);
    this.tControls.noRotate = true;
    this.tControls.noPan = true;
    this.tControls.noZoom = false;
    this.tControls.zoomSpeed = 1.5;

    this.tControls.target.set(0, 2.5, 0);

    this.controls.maxDistance = 25;

    this.tControls.enabled = false;
  }

  resize() {
    this.aspect = this.sizer.width / this.sizer.height;
    this.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.tControls.target.set(0, 0, 0);
  }
  
  update() {
    this.controls.update();
    this.updateTControls();
  }

  updateControlsAngle(
    angle: {
      polar?: number,
      azimuthal?: number,
    }
  ){
    if(angle.polar) this.controls.setPolarAngle(angle.polar);
    if(angle.azimuthal) this.controls.setAzimuthalAngle(angle.azimuthal);

    this.controls.update();
  }

  updateTControls() {
    this.tControls.target.set(
      this.controls.target.x,
      this.controls.target.y,
      this.controls.target.z,
    )
    this.tControls.update();
  }

  handleLockControls(isLock:boolean){
    this.controls.enabled = isLock;
    this.tControls.enabled = isLock;
  }

}
