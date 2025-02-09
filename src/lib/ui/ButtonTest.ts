import { Font } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";

export type ButtonTestProps = Readonly<{
    label: string;
    font_key: string;
    callback?: (e: MouseEvent) => void;
    font_size?: number;
}>;
export default class ButtonTest implements GameObject {
    protected _x: number = 0;
    protected _y: number = 0;
    private _label: string;
    private font_size: number = 24;
    private font_key: string;
    private _scene!: Scene;
    private font!: Font;
    protected _width: number = 0;
    protected _height: number = 0;
    private padding_x: number = 40;
    private padding_y: number = 20;
    protected _callback?: (e: MouseEvent) => void;

    preload(): any { }

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
    set height(_height: number) {
        this._height = _height;
    }
    get height() {
        return this._height;
    }
    set width(_width: number) {
        this._width = _width;
    }
    get width() {
        return this._width;
    }
    set callback(_callback: (e: MouseEvent) => void) {
        this._callback = _callback;
    }
    get callback() {
        if (this._callback)
            return this?._callback;
        return (): void => { };
    }

    set scene(s: Scene) {
        this._scene = s;
    }

    get scene() {
        return this._scene;
    }

    constructor(props: ButtonTestProps) {
        this.font_size = props.font_size ?? this.font_size;
        this._label = props.label;
        this._callback = props.callback;
        this.font_key = props.font_key;
    }

    setup(): void {
        this.font = this._scene.get_asset(this.font_key);
        this._scene.p5.textFont(this.font);
        this._scene.p5.textSize(this.font_size);
        this._width = this._scene.p5.textWidth(this._label) + this.padding_x;
        this._height = this._scene.p5.textAscent() + this._scene.p5.textDescent() + this.padding_y;
    }

    draw(): void {
        this._draw();
    }

    private _draw(): void {
        this._scene.p5.push();
        this._scene.p5.rectMode(this._scene.p5.CENTER);
        this._scene.p5.textAlign(this._scene.p5.CENTER, this._scene.p5.CENTER);
        this._scene.p5.textFont(this.font);
        this._scene.p5.textSize(this.font_size);
        this._scene.p5.fill(255);
        this._scene.p5.rect(this._x, this._y, this._width, this._height, 10);
        this._scene.p5.fill(0);
        this._scene.p5.text(this._label, this._x, this._y - this.font_size / 6);
        this._scene.p5.pop();
    }

    mouseClicked(e: any): void {
        const x = this._scene.p5.mouseX - this._scene.p5.width / 2;
        const y = this._scene.p5.mouseY - this._scene.p5.height / 2;
        const min_x = this._x - this._width / 2;
        const max_x = this._x + this._width / 2;
        const min_y = this._y - this._height / 2;
        const max_y = this._y + this._height / 2;
        if (x > min_x && x < max_x && y > min_y && y < max_y) {
            this._callback?.(e);
        }
    }
    onDestroy(): void {
    }
}
