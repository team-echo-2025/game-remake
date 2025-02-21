import Rectangle from "./Rectangle";

export default class RigidBody extends Rectangle {
    velocity: { x: number; y: number };
    mass: number;
    restitution: number;
    friction: number;
    constructor(x: number, y: number, width: number, height: number, mass?: number, friction?: number, restitution?: number) {
        super({ x, y, w: width, h: height })
        this.mass = mass ?? 0;
        this.velocity = { x: 0, y: 0 };
        this.restitution = restitution ?? 0;
        this.friction = friction ?? .5;
    }
} 
