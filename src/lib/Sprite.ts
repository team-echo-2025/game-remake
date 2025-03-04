import { Image } from "p5";
import GameObject from "./GameObject";
import Scene from "./Scene";

export default class Sprite implements GameObject {
    protected _zIndex?: number | undefined = 0;
    protected _x: number;
    protected _y: number;
    scene!: Scene;
    protected key!: string;
    protected asset!: Image;
    protected _width?: number;
    protected _height?: number;

    set zIndex(n: number) {
        this._zIndex = n;
        this.scene.update_zindex();
    }

    get zIndex(): number | undefined {
        return this._zIndex;
    }


    get x() {
        return this._x;
    }

    set x(_x: number) {
        this._x = _x;
    }

    get y() {
        return this._y;
    }

    set y(_y: number) {
        this._y = _y;
    }

    get width(): number {
        return this._width ? this._width : this.asset.width;
    }
    set width(w: number) {
        this._width = w;
    }
    get height(): number {
        return this._height ? this._height : this.asset.height;
    }
    set height(h: number) {
        this._height = h;
    }

    constructor(key: string) {
        this._x = 0;
        this._y = 0;
        this.key = key;
    }

    setup(): void {
        this.asset = this.scene.get_asset(this.key);
    }

    change_asset(key: string) {
        this.key = key;
        this.setup();
    }

    draw(): void {
        this.scene.p5.image(this.asset, this.x - this.asset.width / 2, this.y - this.asset.height / 2, this.width ? this.width : this.asset.width, this.height ? this.height : this.asset.height);
    }
}
