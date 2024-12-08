import * as THREE from "three";

interface OribitConfigProps {
    radius: number;
    segments: number;
    name: string;
    orbitColor: THREE.ColorRepresentation;
    orbitDistanceX?: number;
    orbitDistanceZ?: number;
}

export class Orbit extends THREE.Line {
    constructor(config:OribitConfigProps) {
        const radius = config.radius;
        const segments = config.segments;
        const vertexArr = [];

        const oDistance = {
            x: config.orbitDistanceX ?? 0,
            z: config.orbitDistanceZ ?? 0,
        }

        for(let i = 0; i <= segments; i++){
            const angle = (i / segments) * (Math.PI * 2);
            vertexArr.push(
                Math.cos(angle) * radius + oDistance.x,
                0,
                Math.sin(angle) * radius + oDistance.z
            )
        }

        const material = new THREE.LineBasicMaterial({
            color: config.orbitColor
        });
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertexArr, 3));

        super(geometry, material);
    }
}