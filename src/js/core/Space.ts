import * as THREE from "three";
import { Sizer } from "../utils/Sizer";
import { Camera } from "../utils/Camera";
import { Renderer } from "../utils/Renderer";
import { Sun } from "../scenes/models/Sun";
import { SunGlow } from "../scenes/models/SunGlow";
import { Orbit } from "../scenes/models/Orbit";
import { Planet } from "../scenes/models/Planet";
import { SunLight } from "../scenes/tools/Sunlight";
import { Composer } from "../utils/Composer";
import { orbitsConfig, planetsConfig } from "../constants/constants";

export class Space {
    sizer: Sizer;
    camera: Camera;
    renderer: Renderer;
    scene: THREE.Scene;

    canvas: HTMLCanvasElement;
    nameWrap: HTMLElement;

    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;

    raycaster:THREE.Raycaster;
    pointer:THREE.Vector2;
    
    composer: Composer;

    sun: Sun;
    sunGlow: SunGlow;
    sunLight: SunLight;

    planets: Planet[];
    orbits: Orbit[];

    constructor(
        canvas:HTMLCanvasElement,
        nameWrap: HTMLElement,
    ) {
        this.canvas = canvas;
        this.nameWrap = nameWrap;

        this.sizer = new Sizer();
        this.camera = new Camera(this, {});
        this.scene = new THREE.Scene();
        this.renderer = new Renderer(this);
        
        this.textureLoader = new THREE.TextureLoader().setPath("../../assets/textures/")
        this.cubeTextureLoader = new THREE.CubeTextureLoader().setPath("../../assets/cubeMap/")

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.composer = new Composer(this);

        this.sun = new Sun(this, {
            rotation: 0.001
        });
        this.sunGlow = new SunGlow(this);
        this.sunLight = new SunLight({
            color: 0xffffff,
            intensity: 1000,
            distance: 1000,
            decay: 10,
        })

        this.planets = [];

        for(let i = 0; i < planetsConfig.length; i++){
            const planetIns =  new Planet(
                this,
                planetsConfig[i]
            )
            this.planets.push(planetIns);
        }

        this.orbits = [];

        for (const key in orbitsConfig) {
            const{ 
                radius, 
                name,
                orbitColor
            } = orbitsConfig[key];

            const orbitIns = new Orbit({
                radius,
                segments: 100,
                name,
                orbitColor
            });

            this.orbits.push(orbitIns);
        }

        this.camera.position.set(0, 0, 3);

        // const lightHelper = new THREE.PointLightHelper(
        //     this.sunLight
        // )

        this.scene.add(
            this.sun,
            this.sunGlow,
            this.sunLight,
            ...this.orbits,
            ...this.planets,
            // lightHelper,
        );

        this.drawCubeTexture();

        window.addEventListener("pointermove", e => {
            const target = this.handlePointerDown(e);
            const targetPlanet = this.planets.find(
                planet => target && planet.name === target.name
            );

            if(target){
                this.composer.outLinePass.selectedObjects = [target];
            }else{
                this.composer.outLinePass.selectedObjects = [];
                this.planets.forEach(planet => {
                    if(!planet.isActive) planet.isOrbitRevolution = true
                })
            }

            if(targetPlanet){
                targetPlanet.isOrbitRevolution = false;
            }

        });
    }

    resize(){
        this.camera.resize();
        this.composer.resize();
        this.renderer.resize();
    }

    update(){
        this.camera.update();

        this.sun.update();
        this.sunGlow.update();

        // this.planet.update();
        this.planets.forEach(
            planet => {planet.update();}
        )

        this.composer.update();
    }

    drawCubeTexture(){
        const cubeTexture = this.cubeTextureLoader.load([
            "px.png",
            "nx.png",
            "py.png",
            "ny.png",
            "pz.png",
            "nz.png",
        ]);

        this.scene.background = cubeTexture;
    }

    handlePointerDown(e:PointerEvent){
        this.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        this.pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2
        
        this.raycaster.setFromCamera(this.pointer, this.camera);
        this.raycaster.layers.set(7);

        const intersetsArr =  this.raycaster.intersectObjects(this.scene.children);
        
        if(intersetsArr[0]){
            const target = intersetsArr[0].object;
            return target;
        }
    }
}