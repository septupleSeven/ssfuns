export class Sizer {
    _width:number = 0;
    _height:number = 0;
    get width():number {return this._width}
    get height():number {return this._height}

    constructor() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        window.addEventListener("resize", () => this.resize());
    }

    resize = () => {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
    };
}