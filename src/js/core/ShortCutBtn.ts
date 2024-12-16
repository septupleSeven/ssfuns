import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import { Space } from "./Space";

export class ShortCutBtn {
  slider: Swiper;
  space: Space;

  constructor(space: Space) {
    this.space = space;

    this.createBtnNode();
    this.addEvents();
    this.calcContainerHeight();

    Swiper.use([Navigation]);

    this.slider = new Swiper(this.space.sBtnNodes.slider, {
        slidesPerView: 3,
        simulateTouch: false,
        direction: "vertical",
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
                    <img src="/assets/images/symbols/symbols_${key}.svg"  alt="">
                  </div>
                  <p class="name">${title}</p>
                </button>
            `;

      slideNode += `<div class="swiper-slide">${btnNode}</div>`;
    }

    const sliderWrapper = this.space.sBtnNodes.slider.querySelector(".swiper-wrapper")!;
    sliderWrapper.insertAdjacentHTML("beforeend", slideNode);
  }

  addEvents() {
    const btns = this.space.sBtnNodes.slider.querySelectorAll("button");

    btns.forEach((btn) => {
      btn.addEventListener("pointerdown", (e) => {
        const targetBtn = e.target as HTMLElement;
        this.space.events.handlePointerDown(e, true, targetBtn.dataset.planet);
      });
    });
  }

  calcContainerHeight(){
    const { height:triggerHei } = window.getComputedStyle(this.space.sBtnNodes.slider.querySelector("button")!);

    const calcedTriggers = (parseInt(triggerHei) * 3) + (10 * 2);

    const container = this.space.sBtnNodes.container.querySelector(".s_btn_container") as HTMLElement;
    container.style.maxHeight = `${calcedTriggers}px`;
}
}
