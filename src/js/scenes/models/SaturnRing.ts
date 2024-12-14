import * as THREE from "three";
import { Space } from "../../core/Space";
import { Planet } from "./Planet";

export class SaturnRing extends THREE.Mesh {
    space:Space
    saturn: Planet;
    orbitAngle: number;
    isOrbitRevolution: boolean;
    isActive: boolean;

    constructor(space:Space) {
        const saturn = space.planets.find(planet => planet.name === "SATURN")!;

        const material = new THREE.MeshBasicMaterial({
            map: space. textureLoader.load("saturn_ring_texture.png"),
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
        });

        const geometry = new THREE.RingGeometry(
            saturn.config.planetRadius + 0.1,
            saturn.config.planetRadius + 0.3,
            32
        );

        const vPos = geometry.attributes.position;
        const v3 = new THREE.Vector3();

        const innerRadius = geometry.parameters.innerRadius;
        const outerRadius = geometry.parameters.outerRadius;
        
        for (let i = 0; i < vPos.count; i++) {
          v3.fromBufferAttribute(vPos, i);

          const radialDist =
            (v3.length() - innerRadius) / (outerRadius - innerRadius);
          const u = radialDist;
          const v = (v3.z - 3) / 2;

          geometry.attributes.uv.setXY(i, u, v);
        }

        super(geometry, material);

        
        this.space = space;
        this.saturn = saturn;
        this.orbitAngle = this.saturn.orbitAngle;
        
        this.isOrbitRevolution = true;
        this.isActive = false;
        
        this.rotation.x = Math.PI / 2;

        this.receiveShadow = true;
    }

    update(){
        if(this.isOrbitRevolution){
            this.orbitAngle -= this.saturn.config.orbitSpeed!;
        }

        this.position.x = Math.cos(this.orbitAngle) * this.saturn.config.orbitRadius + this.saturn.config.orbitDistanceX!;
        this.position.z = Math.sin(this.orbitAngle) * this.saturn.config.orbitRadius + this.saturn.config.orbitDistanceZ!;

        // this.rotation.x += this.saturn.config.rotationSpeed!;
    }
}