import { BASE_URL, getModalData } from "./constants/constants";
import { Space } from "./core/Space";

export default async function (){
    const modalData = await getModalData(`${BASE_URL}/data/modalData.json`);

    if(modalData){
        const space = new Space(
            {
                canvas: document.querySelector("#canvas")!,
                nameWrapNode: document.querySelector("#name_wrap")!,
                modalNode: document.querySelector("#modal")!,
                introNode: document.querySelector("#intro")!,
                loadingNode: document.querySelector("#loader")!,
                pBtnWrapNode: document.querySelector("#p_btn_wrap")!,
                sBtnNodes: {
                    container: document.querySelector("#s_btn_wrap")!,
                    slider: document.querySelector("#s_btn_wrap .swiper")!,
                    nav: {
                        prev: document.querySelector("#s_btn_wrap .s_btn_prev")!,
                        next: document.querySelector("#s_btn_wrap .s_btn_next")!,
                    }
                },
                headerNode: document.querySelector("header")!,
                modalData
            }
        );
    
        const update = () => {
            space.update();
            requestAnimationFrame(() => update());
        }
    
        const initialize = () => {
            space.resize();
            window.addEventListener("resize", () => space.resize());
            update();
        };
    
        initialize();
    }else{
        console.log("Initialize Failed");
    }

}