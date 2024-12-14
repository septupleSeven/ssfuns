import * as THREE from "three";
import { Space } from "../../core/Space";

interface PlanetConfigProps{
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
    layer?:number;
}

export class Planet extends THREE.Mesh {
    space: Space;
    config: PlanetConfigProps;
    orbitAngle: number;
    nameTag: HTMLElement;
    isOrbitRevolution: boolean;
    isActive: boolean;

    constructor(space:Space, config:PlanetConfigProps) {
        const material = new THREE.MeshPhongMaterial({
            map: space.textureLoader.load(config.texture),
        })
        
        const geometry = new THREE.SphereGeometry(config.planetRadius, 40, 40);
        
        super(geometry, material);

        // const axesHelper = new THREE.AxesHelper(2);
        // this.add(axesHelper)
        
        this.orbitAngle = 0;

        this.space = space;

        this.config = {
            ...config,
            orbitColor: config.orbitColor ?? 0xffffff,
            orbitDistanceX: config.orbitDistanceX ?? 0,
            orbitDistanceZ: config.orbitDistanceZ ?? 0,
            orbitSpeed: config.orbitSpeed ?? 0.01,
            rotationAngle: config.rotationAngle ?? 0,
            rotationSpeed: config.rotationSpeed ?? 0.001,
            layer: config.layer ?? 7
        };
        
        this.layers.set(this.config.layer!);
        this.name = config.name;

        this.nameTag = this.createNameTag(
            this.space.nameWrapNode,
            this.config.nameTag
        );

        this.isOrbitRevolution = true;
        this.isActive = false;

        this.rotation.order = 'ZYX';
        this.rotation.z = this.config.rotationAngle!;

        this.nameTag.addEventListener("pointerenter", e => {
            const nameTag = e.target as HTMLElement;
            this.space.events.handlePointerMove(e, true, nameTag.dataset.planet);
        });
        this.nameTag.addEventListener("pointerdown", e => {
            const nameTag = e.target as HTMLElement;
            this.space.events.handlePointerDown(e, true, nameTag.dataset.planet);
        });
    }

    update(){
        if(this.isOrbitRevolution){
            this.orbitAngle -= this.config.orbitSpeed!;
        }

        this.position.x = Math.cos(this.orbitAngle) * this.config.orbitRadius + this.config.orbitDistanceX!;
        this.position.z = Math.sin(this.orbitAngle) * this.config.orbitRadius + this.config.orbitDistanceZ!;

        this.rotation.y += this.config.rotationSpeed!;

        const NDCPos = this.getNDC();
        this.setNameTagPos(NDCPos);
    }

    getNDC(){
        const vector = this.position.clone().project(this.space.camera);

        const cWidthHalf = this.space.canvas.clientWidth / 2;
        const cHeightHalf = this.space.canvas.clientHeight / 2;

        return {
            x: (vector.x * cWidthHalf) + cWidthHalf,
            y: (vector.y * cHeightHalf) + cHeightHalf,
        }
    }

    createNameTag(
        wrapper: HTMLElement,
        nameVal: string
    ){
        const nameTag = document.createElement("span");
        nameTag.dataset.planet = this.name;
        nameTag.innerText = nameVal;
        
        wrapper.appendChild(nameTag);

        return nameTag;
    }

    setNameTagPos(
        NDCPos: {
            x: number,
            y: number
        }
    ){
        this.nameTag.style.transform = `translate(${NDCPos.x}px, ${-NDCPos.y + this.space.canvas.clientHeight}px)`;
    }
}