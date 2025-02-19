import Rectangle from "../physics/Rectangle";

export type BoundingBox = {
    halfw: number;
    halfh: number;
}

export type Vector2D = {
    x: number;
    y: number;
}

export type Point = {
    rect: Rectangle;
    data?: any;
}
