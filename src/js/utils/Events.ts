import * as THREE from "three";
import gsap from "gsap";
import { Space } from "../core/Space";
import { Planet } from "../scenes/models/Planet";

export class Events {
  space: Space;
  planetHideState: boolean;

  get camera() {
    return this.space.camera;
  }

  get pointer() {
    return this.space.pointer;
  }

  get raycaster() {
    return this.space.raycaster;
  }

  get scene() {
    return this.space.scene;
  }

  get planets() {
    return this.space.planets;
  }

  get composer() {
    return this.space.composer;
  }

  get modal() {
    return this.space.modal;
  }

  get apollo() {
    return this.space.apollo;
  }

  get nameWrapNode() {
    return this.space.nameWrapNode;
  }

  get introNode() {
    return this.space.introNode;
  }

  get loadingNode() {
    return this.space.loadingNode;
  }

  get isStart() {
    return this.space.isStart;
  }

  get isModal() {
    return this.space.isModal;
  }

  constructor(space: Space) {
    this.space = space;
    this.planetHideState = false;
  }

  startIntro() {
    const tl = gsap.timeline();

    this.camera.controls.autoRotate = false;
    this.camera.controls.enabled = false;

    const controlsAngle = {
      polar: this.camera.controls.getPolarAngle(),
      azimuthal: this.camera.controls.getAzimuthalAngle(),
    };

    tl.to(this.space.apollo.position, {
      y: 7,
      ease: "power3.in",
      duration: 7,
      onComplete: () => {
        this.apollo.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose();
            }
            if (child.material) {
              child.material.dispose();
            }
          }
        });
        this.scene.remove(this.apollo);
      },
    })
    .to(
      this.introNode, {
        opacity: 0,
        delay: -7,
        onComplete: () => {
          this.introNode.style.display = "none";
        }
      }
    )
      .to(controlsAngle, {
        polar: 0,
        azimuthal: 0,
        delay: -4,
        ease: "power1.inOut",
        duration: 2,
        onUpdate: () => {
          this.camera.controls.setPolarAngle(controlsAngle.polar);
          this.camera.controls.setAzimuthalAngle(controlsAngle.azimuthal);
          this.camera.controls.update();
        },
      })
      .to(this.camera.position, {
        y: 5,
        duration: 5,
        delay: -2,
      })
      .to(
        this.camera.controls.target,
        {
          y: 0,
          duration: 2,
          onUpdate: () => {
            this.camera.controls.update();
          },
        },
        "<"
      )
      .to(
        this.nameWrapNode,
        {
          opacity: 1,
          duration: 2,
          onComplete: () => {
            this.introNode.remove();
            this.loadingNode.remove();
            this.space.isStart = true;
            this.space.isModal = true;
            this.camera.controls.enabled = true;
            this.camera.resize();
          },
        },
      )

  }

  getPointerTarget(e: PointerEvent) {
    this.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.raycaster.layers.set(7);

    const intersetsArr = this.raycaster.intersectObjects(this.scene.children);

    if (intersetsArr[0]) {
      const target = intersetsArr[0].object;
      return target;
    }
  }

  handlePointerMove(
    e: PointerEvent,
    isNameTag?: boolean,
    nameVal?: string | undefined
  ) {
    if(!this.isStart || !this.isModal) return;

    let target;

    if (isNameTag && nameVal) {
      target = this.planets.find((planet) => planet.name === nameVal);
    } else {
      target = this.getPointerTarget(e) as Planet;
    }

    if (target) {
      this.composer.outLinePass.selectedObjects = [target];
      document.body.style.cursor = "pointer";
      target.isOrbitRevolution = false;
    } else {
      this.composer.outLinePass.selectedObjects = [];
      this.planets.forEach((planet) => {
        if (!planet.isActive) planet.isOrbitRevolution = true;
      });
      document.body.style.cursor = "auto";
    }
  }

  handlePointerDown(
    e: PointerEvent,
    isNameTag?: boolean,
    nameVal?: string | undefined
  ) {
    if(!this.isStart || !this.isModal) return;

    let target;

    if (isNameTag && nameVal) {
      target = this.planets.find((planet) => planet.name === nameVal);
    } else {
      target = this.getPointerTarget(e) as Planet;
    }

    if (target && !target.isActive) {
      this.modal.clearModalContents();
      this.modal.addModalContents(target.name);

      const targetNameTag = this.space.nameWrapNode.querySelectorAll("span")!;
      
      targetNameTag.forEach(
        el => {
          if(el.dataset.planet !== target.name) el.style.opacity = "0";
        }
      )

      target.isActive = true;

      const azimuthalAngle = {
        azimuthal: this.camera.controls.getAzimuthalAngle(),
      };

      const targetX = target.position.x;
      const targetZ = target.position.z;

      const calculatedAzimuthalAngle = Math.atan2(targetZ, targetX);

      this.camera.controls.enabled = false;

      const tl = gsap.timeline();

      tl.to(this.camera.position, {
        x: target.position.x,
        y: target.position.y,
        z: target.position.z + 0.5,
        duration: 1.2,
      })
        .to(
          this.camera.controls.target,
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration: 1.2,
            onUpdate: () => {
              this.camera.controls.update();
            },
          },
          "<"
        )
        .to(azimuthalAngle, {
          azimuthal: calculatedAzimuthalAngle,
          duration: 1.2,
          onUpdate: () => {
            this.camera.controls.setAzimuthalAngle(azimuthalAngle.azimuthal);
            this.camera.controls.update();
          },
          onComplete: () => {
            this.modal.showModalContents();
          },
        });
    }
  }

  resetCamera() {
    const tl = gsap.timeline();
    const controlsAngle = {
      polar: this.camera.controls.getPolarAngle(),
      azimuthal: this.camera.controls.getAzimuthalAngle(),
    };

    tl.to(controlsAngle, {
      azimuthal: 0,
      polar: -Math.PI / 2,
      duration: 1.2,
      onUpdate: () => {
        this.camera.controls.setAzimuthalAngle(controlsAngle.azimuthal);
        this.camera.controls.setPolarAngle(controlsAngle.polar);
        this.camera.controls.update();
      },
    })
      .to(this.camera.position, {
        x: 0,
        y: 5,
        z: 0,
        duration: 1.2,
      })
      .to(
        this.camera.controls.target,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.2,
          onUpdate: () => {
            this.camera.controls.update();
          },
          onComplete: () => {
            this.camera.controls.enabled = true;

            this.planets.forEach((planet) => {
              planet.isActive = false;
              planet.isOrbitRevolution = true;
            });
          },
        },
        "<"
      );
  }

  hidePlanets() {
    const condition = this.camera.position.y >= 8;
    
    if(condition !== this.planetHideState){
      this.planets.forEach(planet => {
        planet.visible = !condition;
      });

      this.planetHideState = condition;
    }
  }
}
