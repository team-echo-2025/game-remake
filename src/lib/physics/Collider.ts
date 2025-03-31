import { Point } from "../types/Physics";

export type ColliderProps = Readonly<{
    x: number;
    y: number;
    w: number;
    h: number;
    rotation?: number;
}>

export default class Collider {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _rotation: number;

    constructor({ x, y, w, h, rotation }: ColliderProps) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this._rotation = rotation ?? 0;
    }

    get x() { return this._x; }
    set x(x: number) {
        this._x = x;
    }
    get y() { return this._y; }
    set y(y: number) {
        this._y = y;
    }

    get w() { return this._width; }
    set w(w: number) {
        this._width = w;
    }

    get h() { return this._height; }
    set h(h: number) {
        this._height = h;
    }

    get rotation() { return this._rotation; }
    set rotation(num: number) {
        this._rotation = num;
    }

    get halfWidth() { return this._width / 2; }
    get halfHeight() { return this._height / 2; }

    get left() { return this._x - this.halfWidth; }
    get right() { return this._x + this.halfWidth; }
    get top() { return this._y - this.halfHeight; }
    get bottom() { return this._y + this.halfHeight; }

    containsPoint(point: Point): boolean {
        return point.rect.x >= this.left &&
            point.rect.x <= this.right &&
            point.rect.y >= this.top &&
            point.rect.y <= this.bottom;
    }

    intersects(_: Collider): boolean {
        throw new Error("Not implemented.");
    }
}
