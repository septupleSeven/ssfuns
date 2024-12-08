import { Space } from "./core/Space";

export default function (){
    const space = new Space(
        document.querySelector("#canvas")!,
        document.querySelector("#nameWrap")!
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
}