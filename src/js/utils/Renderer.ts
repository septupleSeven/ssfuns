import * as THREE from "three";
import { Space } from "../core/Space";

export class Renderer extends THREE.WebGLRenderer{
    space:Space;
    get sizer() {
        return this.space.sizer;
    }

    get camera() {
        return this.space.camera;
    }

    get scene() {
        return this.space.scene;
    }

    constructor(space:Space) {
        super({
            canvas: space.canvas
        });
        this.space = space;
    }

    resize() {
        this.setSize(this.sizer.width, this.sizer.height);
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    update(){
        if(this.scene && this.camera){
            this.render(this.scene, this.camera);
        }
    }
}