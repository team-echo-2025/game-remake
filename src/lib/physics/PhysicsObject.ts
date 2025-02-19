import GameObject from '../GameObject';
import RigidBody from './RigidBody';

export type PhysicsObjectProps = Readonly<{
    offset?: { x: number, y: number };
    width: number;
    height: number;
    mass: number;
    friction?: number;
}>;

export default class PhysicsObject implements GameObject {
    body: RigidBody;

    constructor(props: PhysicsObjectProps) {
        this.body = new RigidBody(0, 0, props.width, props.height, props.mass, props.friction ?? 0.5);
    }

    setup(): void { }
    async preload(): Promise<void> { }
    draw(): void { }
    update(): void { }
    onDestroy(): void { }
    onCollide(_: GameObject): void { }
}
