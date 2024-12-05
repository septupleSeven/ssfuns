import * as THREE from "three";
import { Sizer } from "../utils/Sizer";
import { Camera } from "../utils/Camera";
import { Renderer } from "../utils/Renderer";
import { Sun } from "../scenes/models/Sun";
import { SunGlow } from "../scenes/models/SunGlow";
import { Orbit } from "../scenes/models/Orbit";
import { Planet } from "../scenes/models/Planet";
import { SunLight } from "../scenes/tools/Sunlight";

export class Space {
    sizer: Sizer;
    camera: Camera;
    renderer: Renderer;
    scene: THREE.Scene;
    canvas: HTMLCanvasElement;

    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;

    sun: Sun;
    sunGlow: SunGlow;
    sunLight: SunLight;

    orbit:Orbit;
    planet:Planet;

    constructor(canvas:HTMLCanvasElement) {
        this.canvas = canvas;

        this.sizer = new Sizer();
        this.camera = new Camera(this);
        this.scene = new THREE.Scene();
        this.renderer = new Renderer(this);
        
        this.textureLoader = new THREE.TextureLoader().setPath("../../assets/textures/")
        this.cubeTextureLoader = new THREE.CubeTextureLoader().setPath("../../assets/cubeMap/")
        
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

        this.orbit = new Orbit({
            radius: 2,
            segments: 100
        });
        this.planet = new Planet(
            this,
            {
                texture: "mecury_texture.jpg",
                orbitRadius: 2,
                planetRadius: 0.1,
            }
        )

        this.camera.position.set(0, 0, 3);

        // const lightHelper = new THREE.PointLightHelper(
        //     this.sunLight
        // )

        this.scene.add(
            this.sun,
            this.sunGlow,
            this.sunLight,
            this.orbit,
            this.planet,
            // lightHelper,
        );

        this.drawCubeTexture();
    }

    resize(){
        this.camera.resize();
        this.renderer.resize();
    }

    update(){
        this.camera.update();

        this.sun.update();
        this.sunGlow.update();

        this.planet.update();
        // console.log(this.planet.position)

        this.renderer.update();
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
}

// export const sSpace = new Space(document.querySelector("#canvas")!)