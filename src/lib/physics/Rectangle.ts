import { BoundingBox, Vector2D } from "../types/Physics";

export type RectangleProps = Readonly<{
    x: number;
    y: number;
    w: number;
    h: number;
}>

export default class Rectangle {
    box!: BoundingBox;
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;
    get w() {
        return this._w;
    }
    get h() {
        return this._h;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set w(w: number) {
        this._w = w;
        this.update_bounds();
    }
    set h(h: number) {
        this._h = h;
        this.update_bounds();
    }
    set x(x: number) {
        this._x = x;
    }
    set y(y: number) {
        this._y = y;
    }

    constructor({ x, y, w, h }: RectangleProps) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this.update_bounds();
    }

    update_bounds() {
        this.box = {
            halfh: this._h / 2,
            halfw: this._w / 2,
        }
    }

    containsPoint(point: Vector2D): boolean {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }

    containsPointTL(point: Vector2D): boolean {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h
        );
    }


    intersects(range: Rectangle): boolean {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
}
