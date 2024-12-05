import { Space } from "./core/Space";

export default function (){
    const space = new Space(document.querySelector("#canvas")!);

    const update = () => {
        space.update();
        requestAnimationFrame(() => update());
    }

    const initialize = () => {
        space.resize();
        update();
    };

    initialize();
}