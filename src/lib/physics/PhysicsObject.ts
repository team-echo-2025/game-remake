import GameObject from '../GameObject';
import Scene from '../Scene';
import BoxCollider from './BoxCollider';
import RigidBody from './RigidBody';

export type PhysicsObjectProps = Readonly<{
    width: number;
    height: number;
    mass: number;
    friction?: number;
    offset?: { x: number, y: number };
    id?: any;
}>;

export default class PhysicsObject implements GameObject {
    id: any;
    body: RigidBody;
    zIndex?: number | undefined;
    hidden?: boolean | undefined;

    set overlaps(v: boolean) {
        this.body.overlaps = v;
    }

    set onCollide(func: any) {
        this.body.onOverlap = func;
    }

    constructor(props: PhysicsObjectProps) {
        this.body = new RigidBody(new BoxCollider({ x: 0, y: 0, w: props.width, h: props.height }), props.mass, props.friction ?? 0.5);
        this.id = Date.now();
    }

    setup(): void { }
    async preload(): Promise<void> { }
    draw(): void { }
    update(dt: number, _: Scene): void {
        if (this.hidden) return;
        this.body.x += this.body.velocity.x * dt / 1000;
        this.body.y += this.body.velocity.y * dt / 1000;
    }
    postDraw(): void { }
    onDestroy(): void { }
    keyPressed(_e: KeyboardEvent): void { }
    keyReleased(_e: KeyboardEvent): void { }
}
