import { getModalData } from "./constants/constants";
import { Space } from "./core/Space";

export default async function (){
    const modalData = await getModalData("../data/modalData.json");

    if(modalData){
        const space = new Space(
            document.querySelector("#canvas")!,
            document.querySelector("#name_wrap")!,
            document.querySelector("#modal")!,
            modalData
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