import * as THREE from "three";
import gsap from "gsap";
import { Space } from "../core/Space";
import { Planet } from "../scenes/models/Planet";

export class Events {
  space: Space;
  nameTagSize: number;
  isPlanetHide: boolean;
  isCameraPointActive: boolean;

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

  get pBtnWrapNode() {
    return this.space.pBtnWrapNode;
  }

  get headerNode() {
    return this.space.headerNode;
  }

  get satrunRing() {
    return this.space.satrunRing;
  }

  get sBtnNodes() {
    return this.space.sBtnNodes;
  }

  constructor(space: Space) {
    this.space = space;
    this.isPlanetHide = false;
    this.isCameraPointActive = false;
    this.nameTagSize = 0;
  }

  startIntro() {
    const tl = gsap.timeline();

    this.camera.controls.autoRotate = false;
    this.camera.handleLockControls(false);

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
      .to(this.introNode, {
        opacity: 0,
        delay: -7,
        onComplete: () => {
          this.introNode.style.display = "none";
        },
      })
      .to(controlsAngle, {
        polar: 0,
        azimuthal: 0,
        delay: -4,
        ease: "power1.inOut",
        duration: 1.8,
        onUpdate: () => {
          this.camera.updateControlsAngle(controlsAngle);
          this.camera.updateTControls();
        },
      })
      .to(this.camera.position, {
        y: 7,
        duration: 2.8,
        delay: -1.8,
      })
      .to(
        this.camera.controls.target,
        {
          y: 0,
          duration: 2.8,
          onUpdate: () => {
            this.camera.controls.update();
            this.camera.updateTControls();
          },
        },
        "<"
      )
      .to(this.headerNode, {
        y: 0,
        duration: 1.2,
      })
      .to(
        this.pBtnWrapNode,
        {
          opacity: 1,
          duration: 1.2,
        },
        "<"
      )
      .to(
        this.sBtnNodes.container,
        {
          opacity: 1,
          duration: 1.2,
        },
        "<"
      )
      .to(
        this.nameWrapNode,
        {
          opacity: 1,
          duration: 1.2,
          onComplete: () => {
            this.introNode.remove();
            this.loadingNode.remove();
            this.space.isStart = true;
            this.space.isModal = false;

            this.camera.resize();

            this.camera.handleLockControls(true);
            this.isCameraPointActive = false;
            this.lockAllUtilsBtn();
          },
        },
        "<"
      );
  }

  getPointerTarget(e: PointerEvent | MouseEvent) {
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
    isBtn?: boolean,
    nameVal?: string | undefined
  ) {
    if (!this.isStart || this.isModal || this.isCameraPointActive) return;

    let target;

    if (isBtn && nameVal) {
      target = this.planets.find((planet) => planet.name === nameVal);
    } else {
      target = this.getPointerTarget(e) as Planet;
    }

    if (target) {
      this.composer.outLinePass.selectedObjects = [target];
      document.body.style.cursor = "pointer";
      target.isOrbitRevolution = false;

      this.nameWrapNode.querySelectorAll("span").forEach((el) => {
        if (target.name !== el.dataset.planet) el.style.opacity = "0.4";
      });

      if (target.name === "SATURN") this.satrunRing.isOrbitRevolution = false;
    } else {
      this.composer.outLinePass.selectedObjects = [];
      this.planets.forEach((planet) => {
        if (!planet.isActive) planet.isOrbitRevolution = true;
      });

      if (!this.satrunRing.isActive) this.satrunRing.isOrbitRevolution = true;

      this.nameWrapNode.querySelectorAll("span").forEach((el) => {
        el.style.opacity = "1";
      });

      document.body.style.cursor = "auto";
    }
  }

  handlePointerDown(
    e: PointerEvent | MouseEvent,
    isBtn?: boolean,
    nameVal?: string | undefined
  ) {
    if (!this.isStart || this.isModal || this.isCameraPointActive) return;

    let target;

    if (isBtn && nameVal) {
      target = this.planets.find((planet) => planet.name === nameVal);
    } else {
      target = this.getPointerTarget(e) as Planet;
    }

    if (target && !target.isActive) {
      target.isOrbitRevolution = false;

      this.modal.clearModalContents();
      this.modal.addModalContents(target.name);

      const nameTags = this.space.nameWrapNode.querySelectorAll("span")!;

      nameTags.forEach((el) => {
        el.style.opacity = "0";
      });

      this.isCameraPointActive = true;
      this.lockAllUtilsBtn();

      target.isActive = true;
      if (!target.visible) target.visible = true;
      if (target.name === "SATURN") {
        this.space.satrunRing.isActive = true;
        if (!this.space.satrunRing.visible)
          this.space.satrunRing.visible = true;
      }

      const azimuthalAngle = {
        azimuthal: this.camera.controls.getAzimuthalAngle(),
      };

      const targetX = target.position.x - this.space.sun.position.x;
      const targetZ = target.position.z - this.space.sun.position.z;

      let calcedAzimuthalAngle = Math.atan2(targetZ, targetX);

      if ((targetX <= 0 && targetZ < 0) || (targetX >= 0 && targetZ > 0)) {
        calcedAzimuthalAngle += Math.PI;
      }

      this.camera.handleLockControls(false);

      const additinalZPos = target.name === "SUN" ? 0.5 : 0.25;

      const tl = gsap.timeline();

      tl.to(this.camera.position, {
        x: target.position.x,
        y: target.position.y,
        z: target.position.z + target.config.planetRadius + additinalZPos,
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
          azimuthal: calcedAzimuthalAngle,
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
    if (this.isCameraPointActive) return;
    this.lockControls();
    this.lockAllUtilsBtn();

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
        this.camera.updateControlsAngle(controlsAngle);
        this.camera.updateTControls();
      },
    })
      .to(this.camera.position, {
        x: 0,
        y: 7,
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
            this.camera.updateTControls();
          },
          onComplete: () => {
            this.planets.forEach((planet) => {
              planet.isActive = false;
              planet.isOrbitRevolution = true;

              if (!planet.visible) planet.visible = true;

              if (planet.name === "SATURN") {
                this.satrunRing.isActive = false;
                this.satrunRing.isOrbitRevolution = true;

                if (!this.satrunRing.visible) this.satrunRing.visible = true;
              }
            });

            this.camera.handleLockControls(true);

            this.isCameraPointActive = false;
            this.lockAllUtilsBtn();
          },
        },
        "<"
      );
  }

  hidePlanets() {
    if (!this.isStart || this.isModal) return;

    const currentPosVal =
      this.camera.controls.getPolarAngle() > 1.2
        ? this.camera.position.z
        : this.camera.position.y;

    const condition = currentPosVal >= 12;

    if (condition !== this.isPlanetHide) {
      this.planets.forEach((planet) => {
        planet.visible = !condition;
      });

      this.satrunRing.visible = !condition;

      this.isPlanetHide = condition;
    }
  }

  handleTagSize() {
    if (!this.isStart || this.isModal) return;

    const nameTags = this.space.nameWrapNode.querySelectorAll("span")!;
    const bodyFontSize = parseInt(
      window.getComputedStyle(document.querySelector("body")!).fontSize
    );

    const baseFontSize = window.innerWidth > 540 ? 1.5 : 1.25;

    const currentPosVal =
      this.camera.controls.getPolarAngle() > 1.2
        ? this.camera.position.z
        : this.camera.position.y;

    const calcedSize = Math.min(
      bodyFontSize * baseFontSize,
      bodyFontSize * (Math.round(currentPosVal) / 2.2)
    );

    if (this.nameTagSize !== calcedSize) {
      nameTags.forEach((el) => {
        el.style.fontSize = `${calcedSize}px`;
      });
      this.nameTagSize = calcedSize;
    }

    if (currentPosVal < 1.8) {
      this.space.nameWrapNode.style.opacity = "0";
    } else {
      this.space.nameWrapNode.style.opacity = "1";
    }
  }

  setCameraVertical() {
    if (this.isCameraPointActive) return;
    this.lockControls();
    this.lockAllUtilsBtn();

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
        this.camera.updateControlsAngle(controlsAngle);
        this.camera.updateTControls();
      },
      onComplete: () => {
        this.camera.handleLockControls(true);
        this.isCameraPointActive = false;
        this.lockAllUtilsBtn();
      },
    });
  }

  setCamerHorizontal() {
    if (this.isCameraPointActive) return;
    this.lockControls();
    this.lockAllUtilsBtn();

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
        this.camera.updateControlsAngle(controlsAngle);
        this.camera.updateTControls();
      },
    })
      .to(this.camera.position, {
        x: 0,
        y: 0,
        z: 5,
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
            this.camera.updateTControls();
          },
          onComplete: () => {
            this.camera.handleLockControls(true);
            this.isCameraPointActive = false;
            this.lockAllUtilsBtn();
          },
        },
        "<"
      );
  }

  handleCameraPoint(pointVal: string) {
    switch (pointVal) {
      case "refresh": {
        this.resetCamera();
        return;
      }
      case "vertical": {
        this.setCameraVertical();
        return;
      }
      case "horizontal": {
        this.setCamerHorizontal();
        return;
      }
    }
  }

  lockControls() {
    this.isCameraPointActive = true;

    if (this.camera.controls.enabled) {
      this.camera.handleLockControls(false);
    }
  }

  lockAllUtilsBtn() {
    this.space.pBtnWrapNode.querySelectorAll("button").forEach((el) => {
      el.disabled = this.isCameraPointActive;
    });
    this.space.sBtnNodes.slider.querySelectorAll("button").forEach((el) => {
      el.disabled = this.isCameraPointActive;
    });
  }
}
