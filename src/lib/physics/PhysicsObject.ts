import GameObject from '../GameObject';

export type PhysicsObjectProps = Readonly<{
    offset?: { x: number, y: number };
    width: number;
    height: number;
    mass: number;
}>;

export default class PhysicsObject implements GameObject {
    private _x: number;
    private _y: number;
    width: number;
    height: number;
    velocity: { x: number; y: number } = { x: 0, y: 0 };
    mass: number;
    offset: { x: number; y: number };
    get x() {
        return this._x;
    }
    set x(x: number) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y: number) {
        this._y = y;
    }

    constructor(props: PhysicsObjectProps) {
        this._x = 0;
        this._y = 0;
        this.width = props.width;
        this.height = props.height;
        this.mass = props.mass;
        this.offset = props.offset ?? { x: 0, y: 0 };
    }

    setup(): void { }
    async preload(): Promise<void> { }
    draw(): void { }
    update(): void { }
    onCollide(): void { }
    onDestroy(): void { }

//draw(): void {
//    if (this.scene) {
//        this.scene.p5.push();
//        this.scene.p5.fill(0); // Set fill color to black
//        this.scene.p5.rect(this.x, this.y, this.width, this.height);
//        this.scene.p5.pop();
//    }
//}

//checkCollision(other: PhysicsObject | Player): boolean {
//    return (
//        this.x < other.x + PhysicsObject.PLAYER_SIZE &&
//        this.x + this.width > other.x &&
//        this.y < other.y + PhysicsObject.PLAYER_SIZE &&
//        this.y + this.height > other.y
//    );
//}

//preventPlayerPass(player: Player): void {
//    if (!this.checkCollision(player)) return;

//    const nextX = player.x + player.direction.x;
//    const nextY = player.y + player.direction.y;

//    const playerRight = nextX + PhysicsObject.PLAYER_SIZE;
//    const playerLeft = nextX;
//    const playerTop = nextY;
//    const playerBottom = nextY + PhysicsObject.PLAYER_SIZE;

//    const objRight = this.x + this.width;
//    const objLeft = this.x;
//    const objTop = this.y;
//    const objBottom = this.y + this.height;

//    if (playerRight > objLeft && playerLeft < objRight) {
//        if (playerBottom > objTop && playerTop < objBottom) {
//            // Determine which side is being collided with
//            const overlapX = Math.min(playerRight - objLeft, objRight - playerLeft);
//            const overlapY = Math.min(playerBottom - objTop, objBottom - playerTop);

//            if (overlapX < overlapY) {
//                // Horizontal collision
//                if (player.direction.x > 0) player.x = objLeft - PhysicsObject.PLAYER_SIZE;
//                if (player.direction.x < 0) player.x = objRight;
//                player.direction.x = 0; // Stop movement in X
//            } else {
//                // Vertical collision
//                if (player.direction.y > 0) player.y = objTop - PhysicsObject.PLAYER_SIZE;
//                if (player.direction.y < 0) player.y = objBottom;
//                player.direction.y = 0; // Stop movement in Y
//            }
//            //player.moving = false;
//        }
//    }
//}
}
