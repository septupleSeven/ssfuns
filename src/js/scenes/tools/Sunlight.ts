import * as THREE from "three";

interface SunLightConfigProps {
    color: THREE.ColorRepresentation,
    intensity: number,
    distance: number,
    decay: number,
}

export class SunLight extends THREE.PointLight {
    constructor(config:SunLightConfigProps) {
        super(
            config.color,
            config.intensity,
            config.distance,
            config.decay
        );
    }
}