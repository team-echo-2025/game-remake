import { Point } from "../types/Physics";

export type RectangleProps = Readonly<{
    x: number;
    y: number;
    w: number;
    h: number;
}>
export default class Rectangle {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor({ x, y, w, h }: RectangleProps) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
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

    intersects(other: Rectangle): boolean {
        return !(other.left > this.right ||
            other.right < this.left ||
            other.top > this.bottom ||
            other.bottom < this.top);
    }
}
