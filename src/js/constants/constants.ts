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
    orbitSpeed?: number;
    rotationAngle?: number;
    rotationSpeed?: number;
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
        texture: "mercury_texture.jpg",
        orbitRadius: 2,
        planetRadius: 0.1,
        name: "MERCURY",
        nameTag: "수성",
        orbitColor: 0xffffff,
    },
    // {
    //     texture: "venus_texture.jpg",
    //     orbitRadius: 2.5,
    //     planetRadius: 0.2,
    //     name: "VENUS",
    //     nameTag: "금성",
    //     orbitColor: 0xffffff,
    //     orbitSpeed: 0.0015
    // },
    {
        texture: "saturn_texture.jpg",
        orbitRadius: 2.5,
        planetRadius: 0.2,
        name: "SATURN",
        nameTag: "토성",
        orbitColor: 0xffffff,
        orbitSpeed: 0.0015
    },
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

export async function getModalData (url: string) {
    try {
        const res = await fetch(url);

        if(!res.ok){
            throw new Error("Error: 500");
        }

        return await res.json();
    } catch (error: unknown) {
        console.error("Error:", error);
        return null;
    }
}