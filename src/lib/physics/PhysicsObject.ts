import GameObject from '../GameObject';
import RigidBody from './RigidBody';

export type PhysicsObjectProps = Readonly<{
    width: number;
    height: number;
    mass: number;
    friction?: number;
    offset?: { x: number, y: number };
}>;

export default class PhysicsObject implements GameObject {
    body: RigidBody;

    set overlaps(v: boolean) {
        this.body.overlaps = v;
    }

    set onCollide(func: any) {
        this.body.onOverlap = func;
    }

    constructor(props: PhysicsObjectProps) {
        this.body = new RigidBody(0, 0, props.width, props.height, props.mass, props.friction ?? 0.5);
    }

    setup(): void { }
    async preload(): Promise<void> { }
    draw(): void { }
    update(dt: number): void {
        this.body.x += this.body.velocity.x * dt / 1000;
        this.body.y += this.body.velocity.y * dt / 1000;
    }
    postDraw(): void { }
    onDestroy(): void { }
}
