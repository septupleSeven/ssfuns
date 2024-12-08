import * as THREE from "three";

interface planetsConfigProps {
    texture: string;
    planetRadius: number;
    name: string;
    nameTag: string;
    orbitRadius: number;
    orbitColor?: THREE.ColorRepresentation;
    orbitDistanceX?: number;
    orbitDistanceZ?: number;
    orbitAngle?: number;
}

interface oribitsConfigProps {
    radius: number;
    segments: number;
    name: string;
    orbitColor: THREE.ColorRepresentation;
    orbitDistanceX?: number;
    orbitDistanceZ?: number;
}

export const planetsConfig:planetsConfigProps[] = [
    {
        texture: "mecury_texture.jpg",
        orbitRadius: 2,
        planetRadius: 0.1,
        name: "MECURY",
        nameTag: "수성",
        orbitColor: 0xffffff,
    }
]

function createOrbitsConfig(
    planetsConfig:planetsConfigProps[]
){
    const orbits:Record<string, oribitsConfigProps> = {};

    for(let i = 0; i < planetsConfig.length; i++){
        const {
            orbitRadius:planetORadius,
            orbitColor:planetOColor,
            name:planetName,
        } = planetsConfig[i];
        
        orbits[planetName] = {
            radius: planetORadius,
            segments: 100,
            orbitColor: planetOColor!,
            name: planetName
        }
    }

    return orbits
}

export const orbitsConfig = createOrbitsConfig(planetsConfig);