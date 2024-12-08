import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Space } from "../core/Space";

interface CameraConfigProps {
    layer?:number;
}

export class Camera extends THREE.PerspectiveCamera {
    space:Space;
    controls!: OrbitControls;
    config: CameraConfigProps;

    get sizer() {
        return this.space.sizer;
    }

    constructor(space:Space, config:CameraConfigProps) {
        super(
            75,
            space.sizer.width / space.sizer.height,
            0.1,
            100
        );
        this.space = space;

        this.config = {
            ...config,
            layer: config.layer ?? 7
        };
        
        this.layers.enable(this.config.layer!);

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