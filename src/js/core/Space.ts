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
import { Modal, modalDataProps } from "./Modal";
import { Events } from "../utils/Events";
import { GLTFLoader } from "three-stdlib";
import { LoadHelper } from "../utils/Loader";
import { SaturnRing } from "../scenes/models/SaturnRing";
import { ShortCutBtn } from "./ShortCutBtn";

interface SpaceConfigProps {
  canvas: HTMLCanvasElement;
  nameWrapNode: HTMLElement;
  modalNode: HTMLElement;
  modalData: Record<string, modalDataProps>;
  pBtnWrapNode: HTMLElement;
  sBtnNodes: {
    container: HTMLElement,
    slider: HTMLElement,
    nav: {
        next: HTMLElement,
        prev: HTMLElement,
    }
  };
  introNode: HTMLElement;
  loadingNode: HTMLElement;
  headerNode: HTMLElement;
}

export class Space {
  sizer: Sizer;
  camera: Camera;
  renderer: Renderer;
  scene: THREE.Scene;

  canvas: HTMLCanvasElement;
  nameWrapNode: HTMLElement;
  modalNode: HTMLElement;
  introNode: HTMLElement;
  loadingNode: HTMLElement;
  pBtnWrapNode: HTMLElement;
  sBtnNodes: {
    container: HTMLElement,
    slider: HTMLElement,
    nav: {
        next: HTMLElement,
        prev: HTMLElement,
    }
  };
  headerNode: HTMLElement;

  modal: Modal;
  modalData: Record<string, any>;

  shortCutBtn: ShortCutBtn;

  loadingManager: THREE.LoadingManager;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  gltfLoader: GLTFLoader;

  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;

  composer: Composer;

  sun: Sun;
  sunGlow: SunGlow;
  sunLight: SunLight;
  satrunRing: SaturnRing;

  planets: Planet[];
  orbits: Orbit[];

  apollo!: THREE.Group;

  events: Events;

  isStart: boolean;
  isModal: boolean;

  constructor(
    config: SpaceConfigProps
  ) {
    this.isStart = false;
    this.isModal = true;

    this.canvas = config.canvas;
    this.nameWrapNode = config.nameWrapNode;
    this.modalNode = config.modalNode;
    this.introNode = config.introNode;
    this.loadingNode = config.loadingNode;
    this.pBtnWrapNode = config.pBtnWrapNode;
    this.sBtnNodes = config.sBtnNodes;
    this.headerNode = config.headerNode;

    this.modalData = config.modalData;
    this.modal = new Modal(this, this.modalNode, this.modalData);

    this.shortCutBtn = new ShortCutBtn(this);

    this.sizer = new Sizer();
    this.camera = new Camera(this, {});
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this);

    this.loadingManager = new LoadHelper(this);

    this.textureLoader = new THREE.TextureLoader(this.loadingManager).setPath(
      "../../assets/textures/"
    );
    this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager).setPath(
      "../../assets/cubeMap/"
    );
    this.gltfLoader = new GLTFLoader(this.loadingManager).setPath(
      "../../assets/models/"
    );

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.composer = new Composer(this);

    this.sun = new Sun(this, {
      rotation: 0.001,
      planetRadius: 0.325
    });
    this.sunGlow = new SunGlow(this);
    this.sunLight = new SunLight({
      color: 0xffffff,
      intensity: 1,
      distance: 0,
      decay: 0,
    });

    this.planets = [];

    for (let i = 0; i < planetsConfig.length; i++) {
      const planetIns = new Planet(this, planetsConfig[i]);
      this.planets.push(planetIns);
    }

    this.orbits = [];

    for (const key in orbitsConfig) {
      const orbitIns = new Orbit(orbitsConfig[key]);
      this.orbits.push(orbitIns);
    }

    this.satrunRing = new SaturnRing(this);

    this.events = new Events(this);

    // const lightHelper = new THREE.PointLightHelper(
    //     this.sunLight
    // )

    this.scene.add(
      this.sun,
      this.sunGlow,
      this.sunLight,
      ...this.orbits,
      ...this.planets,
      this.satrunRing,
      // lightHelper,
    );

    this.gltfLoader.load("apollo/scene.gltf", gltf => {
      this.apollo = gltf.scene;
      this.apollo.position.set(-0.015, 2.5, 0.2);
      this.apollo.rotation.set(-Math.PI / 2, Math.PI / 1.5, 0)
      this.apollo.scale.set(0.1, 0.1, 0.1);
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

    window.addEventListener("wheel", () => {
      this.events.hidePlanets();
      this.events.handleTagSize();
    })

    this.introNode.addEventListener("click", () => {
      this.events.startIntro();
    });

    this.pBtnWrapNode.querySelectorAll("button").forEach(
      el => {
        const events = this.events;

        el.addEventListener("click", function(){
          const thisPoint = this.dataset.point!;
          events.handleCameraPoint(thisPoint);
        })
      }
    )

  }

  resize() {
    if(this.isStart){
      this.camera.resize();
    }
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

    this.satrunRing.update();

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
