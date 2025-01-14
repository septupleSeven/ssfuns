import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Space } from "./Space";
import { BASE_URL } from "../constants/constants";

export class ShortCutBtn {
  slider: Swiper | null;
  space: Space;

  direction: "horizontal" | "vertical" | undefined;
  perView: number;
  isRes: boolean;

  constructor(space: Space) {
    this.space = space;
    this.direction = "vertical";
    this.perView = 3;
    this.isRes = false;

    this.createBtnNode();
    this.addEvents();
    this.calcContainerHeight();

    Swiper.use([Navigation]);

    this.slider = null;

    this.init();
  }

  init() {
    this.slider = new Swiper(this.space.sBtnNodes.slider, {
      slidesPerView: this.perView,
      simulateTouch: false,
      direction: this.direction,
      loop: true,
      navigation: {
        nextEl: this.space.sBtnNodes.nav.next,
        prevEl: this.space.sBtnNodes.nav.prev,
      },
    });
  }

  createBtnNode() {
    let slideNode: string = "";

    for (const key in this.space.modalData) {
      if (key === "SUN") continue;

      const { title } = this.space.modalData[key].titleContainer;

      const btnNode = `
                <button class="s_btn_trigger" data-planet="${key}">
                  <div class="symbol">
                    <img src="${BASE_URL}/assets/images/symbols/symbols_${key}.svg"  alt="">
                  </div>
                  <p class="name">${title}</p>
                </button>
            `;

      slideNode += `<div class="swiper-slide">${btnNode}</div>`;
    }

    const sliderWrapper =
      this.space.sBtnNodes.slider.querySelector(".swiper-wrapper")!;
    sliderWrapper.insertAdjacentHTML("beforeend", slideNode);
  }

  addEvents() {
    const btns = this.space.sBtnNodes.slider.querySelectorAll("button");
    btns.forEach((btn) => {
      btn.addEventListener("pointerenter", (e) => {
        const nameTag = e.target as HTMLElement;
        this.space.events.handlePointerMove(e, true, nameTag.dataset.planet);
      });
      btn.addEventListener("click", (e) => {
        const targetBtn = e.target as HTMLElement;
        this.space.events.handlePointerDown(e, true, targetBtn.dataset.planet);
      });
    });
  }

  calcContainerHeight() {
    const { height: triggerHei } = window.getComputedStyle(
      this.space.sBtnNodes.slider.querySelector("button")!
    );

    const calcedTriggers =
      parseInt(triggerHei) * this.perView + 10 * (this.perView - 1);

    const container = this.space.sBtnNodes.container.querySelector(
      ".s_btn_container"
    ) as HTMLElement;
    container.style.maxHeight = `${calcedTriggers}px`;
  }

  calcContainerWidth() {
    const { width: triggerWidth } = window.getComputedStyle(
      this.space.sBtnNodes.slider.querySelector("button")!
    );

    const calcedTriggers =
      parseInt(triggerWidth) * this.perView + 10 * (this.perView - 1);

    const container = this.space.sBtnNodes.container.querySelector(
      ".s_btn_container"
    ) as HTMLElement;
    container.style.maxWidth = `${calcedTriggers}px`;
  }

  resize() {
    if (this.isRes) return;

    this.isRes = true;

    let newPerView: number;

    if (window.innerHeight <= 540 && window.innerHeight > 340) {
      newPerView = 2;
    } else if (window.innerHeight <= 340) {
      newPerView = 1;
    } else {
      newPerView = 3;
    }

    if (this.perView === newPerView) {
      this.isRes = false;
      return;
    }

    this.perView = newPerView;

    this.calcContainerHeight();

    if (this.slider) {
      this.slider!.params.slidesPerView = this.perView;
      this.slider!.update();
    }

    this.isRes = false;
  }
}
