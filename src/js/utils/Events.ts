import gsap from "gsap";
import { Space } from "../core/Space";
import { Planet } from "../scenes/models/Planet";

export class Events {
  space: Space;

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

  constructor(space: Space) {
    this.space = space;
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
    let target;

    if (isNameTag && nameVal) {
      target = this.planets.find((planet) => planet.name === nameVal);
    } else {
      target = this.getPointerTarget(e) as Planet;
    }

    if (target && !target.isActive) {
      this.modal.clearModalContents();
      this.modal.addModalContents(target.name);

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
      .to(
        this.camera.position,
        {
          x: 0,
          y: 5,
          z: 0,
          duration: 1.2,
        }
      )
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
}
