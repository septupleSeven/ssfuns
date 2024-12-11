import * as THREE from "three";
import { Space } from "../core/Space";
import { OrbitControls } from "three-stdlib";

interface CameraConfigProps {
  layer?: number;
}

export class Camera extends THREE.PerspectiveCamera {
  space: Space;
  controls!: OrbitControls;
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
    // this.rotation.x = -Math.PI / 2;
    // this.position.set(0, 5, 0);
    // this.position.y = 5;
    this.position.y = 2.4;
    this.addControls();
  }

  addControls() {
    this.controls = new OrbitControls(this, this.space.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;

    this.controls.target.set(0, 2.5, 0);
    this.controls.setPolarAngle(Math.PI / 1.3)
  }

  resize() {
    this.aspect = this.sizer.width / this.sizer.height;
    this.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
  }
  
  update() {
    this.controls.update();
  }

}
