import * as THREE from "three";
import sunVertexShader from '../../../shaders/sun/vertex.glsl?raw';
import sunFragmentShader from '../../../shaders/sun/fragment.glsl?raw';
import { Space } from "../../core/Space";

interface SunConfigProps {
    rotation: number;
}

export class Sun extends THREE.Mesh {
    config:SunConfigProps;
    isActive: boolean;

    constructor(space:Space, config:SunConfigProps) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: {
                    value:  space.textureLoader.load("sun_texture.jpg")
                }
            },
            vertexShader: sunVertexShader,
            fragmentShader: sunFragmentShader,
            // wireframe:true,
            transparent: true,
            side: THREE.DoubleSide
        });

        const geometry = new THREE.SphereGeometry(0.325, 40, 40);

        super(geometry, material);

        this.layers.set(7)
        this.name = "SUN"
        
        this.config = config;
        this.isActive = false;
    }
    
    update(){
        this.rotation.y += this.config.rotation;
    }
}