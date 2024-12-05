import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Space } from "../core/Space";

export class Camera extends THREE.PerspectiveCamera {
    space:Space;
    controls!: OrbitControls;

    get sizer() {
        return this.space.sizer;
    }

    constructor(space:Space) {
        super(
            75,
            space.sizer.width / space.sizer.height,
            0.1,
            100
        );
        this.space = space;

        this.addControls();
    }
    addControls(){
        this.controls = new OrbitControls(this, this.space.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
    }
    resize(){
        this.aspect = this.sizer.width / this.sizer.height
        this.updateProjectionMatrix();
    }
    update(){
        this.controls.update();
    }
}