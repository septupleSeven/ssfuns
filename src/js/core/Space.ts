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
import gsap from "gsap";
import { Modal, modalDataProps } from "../utils/Modal";
import { Events } from "../utils/Events";
import GUI from "lil-gui";
import { GLTFLoader } from "three-stdlib";

export class Space {
  sizer: Sizer;
  camera: Camera;
  renderer: Renderer;
  scene: THREE.Scene;

  canvas: HTMLCanvasElement;
  nameWrap: HTMLElement;
  modalNode: HTMLElement;

  modal: Modal;
  modalData: Record<string, any>;

  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  gltfLoader: GLTFLoader;

  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;

  composer: Composer;

  sun: Sun;
  sunGlow: SunGlow;
  sunLight: SunLight;

  planets: Planet[];
  orbits: Orbit[];

  apollo!: THREE.Group;

  events: Events;

  isStart: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    nameWrap: HTMLElement,
    modalNode: HTMLElement,
    modalData: Record<string, modalDataProps>
  ) {
    this.canvas = canvas;
    this.nameWrap = nameWrap;
    this.modalNode = modalNode;

    this.modalData = modalData;
    this.modal = new Modal(this, this.modalNode, this.modalData);

    this.sizer = new Sizer();
    this.camera = new Camera(this, {});
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this);

    this.textureLoader = new THREE.TextureLoader().setPath(
      "../../assets/textures/"
    );
    this.cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
      "../../assets/cubeMap/"
    );
    this.gltfLoader = new GLTFLoader().setPath(
      "../../assets/models/"
    );

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.composer = new Composer(this);

    this.sun = new Sun(this, {
      rotation: 0.001,
    });
    this.sunGlow = new SunGlow(this);
    this.sunLight = new SunLight({
      color: 0xffffff,
      intensity: 1000,
      distance: 10000,
      decay: 8.5,
    });

    this.planets = [];

    for (let i = 0; i < planetsConfig.length; i++) {
      const planetIns = new Planet(this, planetsConfig[i]);
      this.planets.push(planetIns);
    }

    this.orbits = [];

    for (const key in orbitsConfig) {
      const { radius, name, orbitColor } = orbitsConfig[key];

      const orbitIns = new Orbit({
        radius,
        segments: 100,
        name,
        orbitColor,
      });

      this.orbits.push(orbitIns);
    }

    this.events = new Events(this);

    // const lightHelper = new THREE.PointLightHelper(
    //     this.sunLight
    // )

    // const gui = new GUI();

    // const cameraRotaionFolder = gui.addFolder("cameraRotaion");
    // cameraRotaionFolder.add(this.camera.rotation, "x").max(3).min(-3).step(0.1);
    // cameraRotaionFolder.add(this.camera.rotation, "y").max(3).min(-3).step(0.1);
    // cameraRotaionFolder.add(this.camera.rotation, "z").max(3).min(-3).step(0.1);

    // const cameraPositionFolder = gui.addFolder("cameraPosition");
    // cameraPositionFolder
    //   .add(this.camera.position, "x")
    //   .max(5)
    //   .min(-5)
    //   .step(0.1);
    // cameraPositionFolder
    //   .add(this.camera.position, "y")
    //   .max(5)
    //   .min(-5)
    //   .step(0.1);
    // cameraPositionFolder
    //   .add(this.camera.position, "z")
    //   .max(5)
    //   .min(-5)
    //   .step(0.1);

    // gui.hide();

    this.scene.add(
      this.sun,
      this.sunGlow,
      this.sunLight,
      ...this.orbits,
      ...this.planets
      // lightHelper,
    );

    this.gltfLoader.load("apollo/scene.gltf", gltf => {
      this.apollo = gltf.scene;
      this.apollo.position.set(0, 2.5, -0.2);
      this.apollo.rotation.set(Math.PI / 2, -Math.PI / 3, 0)
      this.apollo.scale.set(0.1, 0.1, 0.1);
      // this.apollo.traverse(child => {
      //   if (child instanceof THREE.Mesh && child.material) {
      //     child.material.side = THREE.DoubleSide;
      //     child.material.depthWrite = true;
      //   }
      // })
      this.scene.add(this.apollo);
    });

    this.drawCubeTexture();

    window.addEventListener("pointermove", (e) => {
      const nameTag = e.target as HTMLElement;
      if (nameTag && nameTag.dataset.planet) {
        this.events.handlePointerMove(e, true, nameTag.dataset.planet);
      } else {
        this.events.handlePointerMove(e);
      }
    });

    window.addEventListener("pointerdown", (e) => {
      const nameTag = e.target as HTMLElement;
      if (nameTag && nameTag.dataset.planet) {
        this.events.handlePointerDown(e, true, nameTag.dataset.planet);
      } else {
        this.events.handlePointerDown(e);
      }
    });

    // window.addEventListener("wheel", () => {
    //   console.log(this.camera.position)
    // })
  }

  resize() {
    // this.camera.resize();
    this.composer.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();

    this.sun.update();
    this.sunGlow.update();

    this.planets.forEach((planet) => {
      planet.update();
    });

    this.composer.update();
  }

  drawCubeTexture() {
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
