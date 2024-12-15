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
        planetRadius: 0.04,
        name: "MERCURY",
        nameTag: "수성",
        orbitRadius: 1.3,
        orbitDistanceX: -0.1,
        orbitDistanceZ: 0.15,
        orbitColor: 0xa9a9a9,
        orbitSpeed: 0.01,
        rotationAngle: -0.001,
    },
    {
        texture: "venus_texture.jpg",
        planetRadius: 0.08,
        name: "VENUS",
        nameTag: "금성",
        orbitRadius: 2,
        orbitDistanceX: 0.05,
        orbitDistanceZ: 0.05,
        orbitColor: 0xffd700,
        orbitSpeed: 0.0039,
        rotationAngle: -3.096,
    },
    {
        texture: "earth_texture.jpg",
        planetRadius: 0.09,
        name: "EARTH",
        nameTag: "지구",
        orbitRadius: 2.4,
        orbitDistanceX: 0,
        orbitDistanceZ: 0,
        orbitColor: 0x1e90ff,
        orbitSpeed: 0.0024,
        rotationAngle: -0.409,
    },
    {
        texture: "mars_texture.jpg",
        planetRadius: 0.045,
        name: "MARS",
        nameTag: "화성",
        orbitRadius: 3,
        orbitDistanceX: -0.1,
        orbitDistanceZ: -0.08,
        orbitColor: 0xcf4724,
        orbitSpeed: 0.0015,
        rotationAngle: -0.440,
    },
    {
        texture: "jupiter_texture.jpg",
        planetRadius: 0.165,
        name: "JUPITER",
        nameTag: "목성",
        orbitRadius: 5,
        orbitDistanceX: 0.1,
        orbitDistanceZ: 0.09,
        orbitColor: 0x8f704c,
        orbitSpeed: 0.0002,
        rotationAngle: -0.055,
    },
    {
        texture: "saturn_texture.jpg",
        planetRadius: 0.145,
        name: "SATURN",
        nameTag: "토성",
        orbitRadius: 7,
        orbitDistanceX: 0.1,
        orbitDistanceZ: 0.1,
        orbitColor: 0xffec84,
        orbitSpeed: 0.00008,
        rotationAngle: -0.466,
    },
    {
        texture: "uranus_texture.jpg",
        planetRadius: 0.123,
        name: "URANUS",
        nameTag: "천왕성",
        orbitRadius: 10,
        orbitDistanceX: 0.1,
        orbitDistanceZ: 0.1,
        orbitColor: 0x6deae9,
        orbitSpeed: 0.00003,
        rotationAngle: -1.706,
    },
    {
        texture: "neptune_texture.jpg",
        planetRadius: 0.120,
        name: "NEPTUNE",
        nameTag: "해왕성",
        orbitRadius: 13,
        orbitDistanceX: 0.1,
        orbitDistanceZ: 0.1,
        orbitColor: 0x335ee0,
        orbitSpeed: 0.00001,
        rotationAngle: -0.494,
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
            orbitDistanceZ,
            orbitDistanceX,
            name:planetName,
        } = planetsConfig[i];
        
        orbits[planetName] = {
            radius: planetORadius,
            segments: 100,
            orbitColor: planetOColor!,
            orbitDistanceZ,
            orbitDistanceX,
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