import p5, { Font } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";

export type ButtonProps = Readonly<{
    label: string;
    scene: Scene;
    callback?: (e: MouseEvent) => void;
    font_path?: string;
    font_size?: number;
}>;
export default class Button implements GameObject {
    private _x: number = 0;
    private _y: number = 0;
    private label: string;
    private font_size: number = 24;
    private scene: Scene;
    private font!: Font;
    private font_path: string = "assets/fonts/jersey.ttf";
    private width: number = 0;
    private height: number = 0;
    private padding_x: number = 40;
    private padding_y: number = 20;
    private callback?: (e: MouseEvent) => void;

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

    constructor(props: ButtonProps) {
        this.font_size = props.font_size ?? this.font_size;
        this.scene = props.scene;
        this.font_path = props.font_path ?? this.font_path;
        this.label = props.label;
        this.callback = props.callback;
    }

    async preload(): Promise<any> {
        await new Promise((res) => {
            this.font = this.scene.p5.loadFont(this.font_path, () => { res(true) })
        });
    }

    setup(): void {
        this.scene.p5.textFont(this.font);
        this.scene.p5.textSize(this.font_size);
        this.width = this.scene.p5.textWidth(this.label) + this.padding_x;
        this.height = this.scene.p5.textAscent() + this.scene.p5.textDescent() + this.padding_y;
    }

    draw(): void {
        this._draw();
    }

    private _draw(): void {
        this.scene.p5.push();
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.textFont(this.font);
        this.scene.p5.textSize(this.font_size);
        this.scene.p5.fill(255);
        this.scene.p5.rect(this._x, this._y, this.width, this.height, 10);
        this.scene.p5.fill(0);
        this.scene.p5.text(this.label, this._x, this._y - this.font_size / 6);
        this.scene.p5.pop();
    }

    mouseClicked(e: any): void {
        const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
        const y = this.scene.p5.mouseY - this.scene.p5.height / 2;
        const min_x = this._x - this.width / 2;
        const max_x = this._x + this.width / 2;
        const min_y = this._y - this.height / 2;
        const max_y = this._y + this.height / 2;
        if (x > min_x && x < max_x && y > min_y && y < max_y) {
            this.callback?.(e);
        }
    }
    onDestroy(): void {
    }
}
