import gsap from "gsap";
import { Space } from "../core/Space";

export interface modalDataProps {
  imgSrc: {
    pc: string;
    mo: string;
  };
  titleContainer: {
    title: string;
    subtitles: string[];
  };
  contents: {
    contentsTitle: string;
    constentsList: {
      title: string;
      desc: string;
    }[];
  }[];
}

export class Modal {
  modalNode: HTMLElement;
  closeBtn: HTMLElement;
  data: Record<string, modalDataProps>;
  space: Space;

  constructor(space: Space, modalNode: HTMLElement, data: Record<string, modalDataProps>) {
    this.space = space;
    this.modalNode = modalNode;
    this.closeBtn = this.modalNode.querySelector(".modal_close")!;
    this.data = data;

    this.closeBtn.addEventListener("click", () => {
      this.hideModalContents();
      this.space.events.resetCamera();
    });
  }

  createImgContainer(nameVal: string) {
    const targetData = this.data[nameVal];

    return `
        <figure class="img_container">
            <img src="${targetData.imgSrc.pc}" alt="">
          </figure>
        `;
  }

  createTitleContainer(nameVal: string) {
    const targetData = this.data[nameVal];
    const { subtitles } = targetData.titleContainer;

    const subtitlesNodes = subtitles.map((el) => `<li>${el}</li>`);

    return `
          <div class="title_container">
            <h1>${targetData.titleContainer.title}</h1>
            <ul>${subtitlesNodes.join("")}</ul>
          </div>
        `;
  }

  createDescContainer(nameVal: string) {
    const { contents } = this.data[nameVal];

    const contentsNodes = contents.map((el) => {
      const listNodes = el.constentsList.map(
        (list) => `
                    <li>
                        <h6 class="title">${list.title}</h6>
                        <p>${list.desc}</p>
                    </li>
                `
      );

      return `
                <div class="desc_container">
                    <div class="subtitle_container">${el.contentsTitle}</div>
                    <ul>
                        ${listNodes.join("")}
                    </ul>
                </div>
            `;
    });

    return contentsNodes.join("");
  }

  composeModalContents(nameVal: string) {
    return `
        <div class="modal_container">
            <div class="modal_wrap">
                ${this.createImgContainer(nameVal)}
                ${this.createTitleContainer(nameVal)}
                <div class="contents_container">
                    ${this.createDescContainer(nameVal)}
                </div>
            </div>
        </div>
    `;
  }

  addModalContents(nameVal: string) {
    this.modalNode.insertAdjacentHTML(
      "beforeend",
      this.composeModalContents(nameVal)
    );
  }

  showModalContents() {
    const container = this.modalNode.querySelector(".modal_container");
    const tl = gsap.timeline();
    tl.to(this.modalNode, {
      x: 0,
      duration: 0.8,
      ease: "power1.in",
    }).to(container, {
      opacity: 1,
      duration: 0.8,
      ease: "power1.in",
    });
  }

  hideModalContents() {
    gsap.to(this.modalNode, {
      x: "100%",
      duration: 0.4,
      ease: "power1.in",
      onComplete: () => {
        this.clearModalContents();
      },
    });
  }

  clearModalContents() {
    const container = this.modalNode.querySelector(".modal_container");

    if (container) {
      container.remove();
    }
  }
}
