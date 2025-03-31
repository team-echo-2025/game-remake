import Collider from "../physics/Collider";

export type BoundingBox = {
    halfw: number;
    halfh: number;
}

export type Vector2D = {
    x: number;
    y: number;
}

export type Point = {
    rect: Collider;
    data?: any;
}
