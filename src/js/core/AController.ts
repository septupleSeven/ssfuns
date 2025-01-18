import { Space } from "./Space";
import gsap from "gsap";

type dirType = "UP" | "BOTTOM" | "LEFT" | "RIGHT";

export class AController {
  space: Space;

  openBtn: HTMLButtonElement;
  controllerContainer: HTMLElement;
  controllerBtns: NodeList;

  isOpen: boolean;
  triggerAct: number | null;

  get camera() {
    return this.space.camera;
  }

  constructor(space: Space) {
    this.space = space;

    this.openBtn = this.space.aControllerNode.querySelector(
      "#a_controller_open_btn"
    )!;
    this.controllerContainer =
      this.space.aControllerNode.querySelector(".a_controller")!;
    this.controllerBtns = this.controllerContainer.querySelectorAll("button");

    this.triggerAct = null;

    this.isOpen = false;

    this.addEvent();
  }

  handleToggle() {
    const tl = gsap.timeline();
    const btnsArr = gsap.utils.toArray(this.controllerBtns);

    this.openBtn.disabled = true;

    if (this.isOpen) {
      const calcedHei =
        parseInt(window.getComputedStyle(this.space.aControllerNode).height) +
        20;

      tl.to(this.space.aControllerNode, {
        y: calcedHei,
      });

      btnsArr.forEach((btn) => {
        tl.to(
          btn as HTMLButtonElement,
          {
            display: "none",
            onComplete: () => {
              (btn as HTMLButtonElement).disabled = true;
            },
          },
          "<"
        );
      });

      tl.to(this.controllerContainer, {
        opacity: 0,
        onComplete: () => {
          this.isOpen = false;
          // this.camera.controls.enablePan = false;
          this.openBtn.disabled = false;
          this.space.aControllerNode.classList.remove("active");
        },
      });
    } else {
      btnsArr.forEach((btn) => {
        tl.to(
          btn as HTMLElement,
          {
            display: "flex",
            delay: -1,
            onComplete: () => {
              (btn as HTMLButtonElement).disabled = false;
            },
          },
          "<"
        );
      });

      tl.to(this.controllerContainer, {
        opacity: 1,
      }).to(this.space.aControllerNode, {
        y: 0,
        onComplete: () => {
          this.isOpen = true;
          // this.camera.controls.enablePan = true;
          this.openBtn.disabled = false;
          this.space.aControllerNode.classList.add("active");
        },
      });
    }
  }

  handleClose() {
    const tl = gsap.timeline();
    const btnsArr = gsap.utils.toArray(this.controllerBtns);

    this.openBtn.disabled = true;

    if (this.isOpen) {
      const calcedHei =
        parseInt(window.getComputedStyle(this.space.aControllerNode).height) +
        20;

      tl.to(this.space.aControllerNode, {
        y: calcedHei,
      });

      btnsArr.forEach((btn) => {
        tl.to(
          btn as HTMLButtonElement,
          {
            display: "none",
            onComplete: () => {
              (btn as HTMLButtonElement).disabled = true;
            },
          },
          "<"
        );
      });

      tl.to(this.controllerContainer, {
        opacity: 0,
        onComplete: () => {
          this.isOpen = false;
          // this.camera.controls.enablePan = false;
          this.openBtn.disabled = false;
          this.space.aControllerNode.classList.remove("active");
        },
      });
    }
  }

  handleCamera(dir: dirType) {
    const keydownEv = new KeyboardEvent("keydown", {
      code: this.camera.controls.keys[dir],
    });

    document.body.dispatchEvent(keydownEv);
  }

  handleHold(e: Event) {
    this.handleClear();

    const dir = e.target as HTMLElement;

    if (dir) {
      const dirData = dir.dataset.dir as dirType;
      this.triggerAct = setInterval(() => {
        this.handleCamera(dirData);
      }, 100);
    }
  }

  handleClear() {
    if (this.triggerAct) {
      clearInterval(this.triggerAct);
    }
  }

  addEvent() {
    this.openBtn.addEventListener("click", () => {
      this.handleToggle();
    });

    this.controllerBtns.forEach((btn) => {
      btn.addEventListener("mousedown", (e) => {
        this.handleHold(e);
      });

      btn.addEventListener("touchstart", (e) => {
        this.handleHold(e);
      });

      btn.addEventListener("mouseup", () => {
        this.handleClear();
      });

      btn.addEventListener("touchend", () => {
        this.handleClear();
      });
    });
  }
}
