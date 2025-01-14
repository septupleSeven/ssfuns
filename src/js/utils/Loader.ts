import * as THREE from "three";
import { Space } from "../core/Space";
import gsap from "gsap";

export class LoadHelper extends THREE.LoadingManager {
  space: Space;
  progressNode: HTMLElement;
  progressCurrent: HTMLElement;
  progressTotal: HTMLElement;

  constructor(space: Space) {
    super();

    this.space = space;

    this.progressNode =
      this.space.loadingNode.querySelector("#loder_progress")!;
    this.progressCurrent = this.progressNode.querySelector(".current")!;
    this.progressTotal = this.progressNode.querySelector(".total")!;

    this.onProgress = (_url, complete, total) => {
      this.progressCurrent.innerText = `${complete}`;
      this.progressTotal.innerText = `${total}`;
    };

    this.onLoad = () => {
      const tl = gsap.timeline();

      tl.to(this.space.loadingNode, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          this.space.loadingNode.style.display = "none";
        },
      }).to(this.space.introNode, {
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        filter: "brightness(1)",
        duration: 2,
        onComplete: () => {
          this.space.introNode.style.pointerEvents = "auto";
        },
      });
    };
  }
}
