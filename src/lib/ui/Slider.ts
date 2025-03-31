import p5, { Font } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import { debug } from "webpack";
export type SliderProps = Readonly<{
    scene: Scene;
    key: string;
    color?: string;
    callback?: (e: string) => void;
}>;

export default class Slider implements GameObject {
    private _scene!: Scene;
    protected _x: number = 0;
    protected _y: number = 0;
    protected _slider: p5.Element; // will be Slider
    private previous: string = "";
    protected callback?: (e: string) => void;
    protected key: string = "";
    protected color?: string;

    constructor(props: SliderProps) {
        this._scene = props.scene;
        this._slider = this.scene.p5.createSlider(0.0, 1.0, 1.0, 0.01);
        this._slider.position(this._x, this._y)
        this._slider.size(200);
        this.key = props.key;
        this.color = props.color;
        this.callback = props.callback;

        // lets us specify the color (must be a web color: https://htmlcolorcodes.com/color-names/)
        if (this.color && this.isValidCSSColor(this.color)) {
            this._slider.elt.style.setProperty("accent-color", this.color);
        }        
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
        this._slider.value(localStorage.getItem(this.key) || "1.0");
    }
    draw(): void {
        this._draw();
    }

    private _draw(): void {
        this._scene.p5.push();
        this._slider.position(this._x - (this.scene.camera.x), this._y - (this.scene.camera.y));
        // if(""+(this._slider.value())!=this.localState.value){
        //     localStorage.setItem(this.key, this._slider.value()+"");
        // }
        if (this.previous != "" + (this._slider.value())) {
            this.callback?.("" + (this._slider.value()));
        }
        this.previous = "" + (this._slider.value());
        this._scene.p5.pop();
    }
    private isValidCSSColor(color: string): boolean {
        const s = new Option().style;
        s.color = '';
        s.color = color;
        return s.color !== '';
    }
    preload(): any {
    }
    onDestroy(): void {
        this._slider.remove();
    }

}
