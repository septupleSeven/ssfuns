import * as THREE from "three";
import { Space } from "../../core/Space";

interface PlanetConfigProps{
    texture: string;
    orbitRadius: number;
    planetRadius: number;
    rotation?: number;
}

export class Planet extends THREE.Mesh {
    orbitAngle: number;
    config: PlanetConfigProps;

    constructor(space:Space, config:PlanetConfigProps) {
        const material = new THREE.MeshPhongMaterial({
            map: space.textureLoader.load(config.texture),
        })
        
        const geometry = new THREE.SphereGeometry(config.planetRadius, 40, 40);
        
        super(geometry, material);
        
        this.orbitAngle = 0;
        this.config = {
            ...config,
            rotation: config.rotation ?? 0.001
        };
    }

    update(){
        this.orbitAngle += 0.01;

        this.position.x = Math.cos(this.orbitAngle) * this.config.orbitRadius;
        this.position.z = Math.sin(this.orbitAngle) * this.config.orbitRadius;

        this.rotation.y -= this.config.rotation!;
    }
}