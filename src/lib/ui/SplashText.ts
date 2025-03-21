import { Font } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";

export type SplashTextProps = Readonly<{
    label: string;
    font_key: string;
    font_size?: number;
}>;
export default class SplashText implements GameObject{
    hidden: boolean = false;
    protected _x: number = 0;
    protected _y: number = 0;
    private _label: string;
    private font_size: number = 24;
    private font_key: string;
    private _scene!: Scene;
    private font!: Font;

    constructor(props: SplashTextProps){
        this._label = props.label;
        this.font_size = props.font_size ?? this.font_size;
        this.font_key = props.font_key;
    }

    set x(x: number) {
        this._x = x;
    }

    get x() {
        return this._x;
    }

    set y(y: number) {
        this._y = y;
    }

    get y() {
        return this._y;
    }

    set label(label: string) {
        this._label = label;
    }

    get label() {
        return this._label;
    }

    set scene(s: Scene) {
            this._scene = s;
        }
    
    get scene() {
        return this._scene;
    }

    preload(): any {}

    setup(): void {
        this.font = this._scene.get_asset(this.font_key);
        this._scene.p5.textFont(this.font);
        this._scene.p5.textSize(this.font_size);
    }

    private _draw(): void{
        var _p5 = this.scene.p5;
        _p5.push();
        _p5.rotate(30);
        _p5.textFont(this.font);
        _p5.textSize(this.font_size);
        _p5.text("test", this._x, this._y);
        _p5.pop()
    }

    draw(): void {
        this._draw();
    }
}