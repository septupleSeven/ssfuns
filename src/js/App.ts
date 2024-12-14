import { getModalData } from "./constants/constants";
import { Space } from "./core/Space";

export default async function (){
    const modalData = await getModalData("../data/modalData.json");

    if(modalData){
        const space = new Space(
            {
                canvas: document.querySelector("#canvas")!,
                nameWrapNode: document.querySelector("#name_wrap")!,
                modalNode: document.querySelector("#modal")!,
                introNode: document.querySelector("#intro")!,
                loadingNode: document.querySelector("#loader")!,
                pBtnWrapNode: document.querySelector("#p_btn_wrap")!,
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