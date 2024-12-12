import * as THREE from "three";
import { Space } from "../core/Space";
import gsap from "gsap";

export class LoadHelper extends THREE.LoadingManager {
    space: Space;

    constructor(space: Space) {
     super();

     this.space = space;
     
     this.onLoad = () => {
        const tl = gsap.timeline();

        tl
        .to(this.space.loadingNode, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.space.loadingNode.style.display = "none";
            }
        })
        .to(this.space.introNode, {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            filter: "brightness(1)",
            duration: 2,
            onComplete: () => {
                this.space.introNode.style.pointerEvents = "auto";
            }
        })
     }
    }
}