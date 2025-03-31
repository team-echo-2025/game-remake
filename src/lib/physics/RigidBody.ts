import Collider from "./Collider";

export default class RigidBody {
    collider: Collider;
    overlaps: boolean = false;
    velocity: { x: number; y: number };
    mass: number;
    restitution: number;
    friction: number;
    onOverlap?: (other: RigidBody) => void;

    get rotation() {
        return this.collider.rotation;
    }

    set rotation(num: number) {
        this.collider.rotation = num;
    }

    get x() {
        return this.collider.x;
    }

    set x(num: number) {
        this.collider.x = num;
    }

    get y() {
        return this.collider.y;
    }

    set y(num: number) {
        this.collider.y = num;
    }

    get w() {
        return this.collider.w;
    }

    set w(num: number) {
        this.collider.w = num;
    }

    get h() {
        return this.collider.h;
    }

    set h(num: number) {
        this.collider.h = num;
    }

    get halfWidth() {
        return this.collider.halfWidth;
    }
    get halfHeight() {
        return this.collider.halfHeight;
    }

    constructor(collider: Collider, mass?: number, friction?: number, restitution?: number) {
        this.collider = collider;
        this.mass = mass ?? 0;
        this.velocity = { x: 0, y: 0 };
        this.restitution = restitution ?? 0;
        this.friction = friction ?? .5;
    }
} 
