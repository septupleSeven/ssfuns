import * as THREE from "three";
import sunGlowVertexShader from '../../../shaders/sunGlow/vertex.glsl?raw';
import sunGlowFragmentShader from '../../../shaders/sunGlow/fragment.glsl?raw';
import { Space } from "../../core/Space";

export class SunGlow extends THREE.Mesh {
    space:Space;
    get camera (){
        return this.space.camera;
    }
    
    constructor(space:Space) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uZoom: {
                  value: 1,
                }  
            },
            vertexShader: sunGlowVertexShader,
            fragmentShader: sunGlowFragmentShader,
            side: THREE.BackSide,
            transparent: true,
        }) as THREE.ShaderMaterial;

        const geometry = new THREE.SphereGeometry(0.525, 40, 40);

        super(geometry, material);
        this.space = space;
    }

    update(){
        if (this.material instanceof THREE.ShaderMaterial) {
            this.material.uniforms.uZoom.value = this.camera.controls.target.distanceTo(this.camera.controls.object.position);;
        }
    }
}