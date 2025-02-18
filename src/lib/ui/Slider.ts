import p5, { Font } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import { debug } from "webpack";
export type SliderProps = Readonly<{
    scene: Scene;
    key: string;
}>;

export default class Slider implements GameObject {
    private _scene!: Scene;
    private key!: string
    protected _x: number = 0;
    protected _y: number = 0;
    protected _slider: p5.Element; // will be Slider
    private localState: Record<string, string>={
        value: localStorage.getItem(this.key) || "1.0"
    };
    constructor(props: SliderProps){
        this._scene = props.scene;
        this.key = props.key;
        this._slider = this.scene.p5.createSlider(0.0, 1.0, 1.0, 0.01);
        this._slider.position(this._x,this._y)
    }

    set x(x: number) {
        this._x = x;
        console.log("this._x", this._x)
    }

    get x() {
        return this._x;
    }

    set y(y: number) {
        this._y = y;
        console.log("this._y", this._y)
    }

    get y() {
        return this._y;
    }
    get slider() {
        return this._slider;
    }
    set scene(s: Scene) {
        this._scene = s;
    }
    get scene() {
        return this._scene;
    }

    setup(): void { 
    }
    draw(): void {
        this._draw();
    }

    private _draw(): void {
        this._scene.p5.push();
        this._slider.position(this._x - (this.scene.camera.x),this._y - (this.scene.camera.y));
        if(this._slider.value()!=this.localState.value){
            localStorage.setItem(this.key, this._slider.value()+"");
        }
        this._scene.p5.pop();
    }
    preload(): any {
    }


}