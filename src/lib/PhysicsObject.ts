import GameObject from './GameObject';
import Player from './Player';

export type PhysicsObjectProps = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
    mass: number;
    isMoveable: boolean;
    scene: any;
}>;

export default class PhysicsObject implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: { x: number; y: number } = { x: 0, y: 0 };
    mass: number;
    isMoveable: boolean;
    zIndex?: number = 1;
    private static readonly PLAYER_SIZE = 64; // Default player size
    scene: any; // Reference to the scene for drawing

    constructor(props: PhysicsObjectProps) {
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.mass = props.mass;
        this.isMoveable = props.isMoveable;
        this.scene = props.scene;
    }

    setup(): void {}
    async preload(): Promise<void> {}

    draw(): void {
        if (this.scene) {
            this.scene.p5.push();
            this.scene.p5.fill(0); // Set fill color to black
            this.scene.p5.rect(this.x, this.y, this.width, this.height);
            this.scene.p5.pop();
        }
    }

    checkCollision(other: PhysicsObject | Player): boolean {
        return (
            this.x < other.x + PhysicsObject.PLAYER_SIZE &&
            this.x + this.width > other.x &&
            this.y < other.y + PhysicsObject.PLAYER_SIZE &&
            this.y + this.height > other.y
        );
    }

    preventPlayerPass(player: Player): void {
        if (!this.checkCollision(player)) return;

        const nextX = player.x + player.direction.x;
        const nextY = player.y + player.direction.y;

        const playerRight = nextX + PhysicsObject.PLAYER_SIZE;
        const playerLeft = nextX;
        const playerTop = nextY;
        const playerBottom = nextY + PhysicsObject.PLAYER_SIZE;

        const objRight = this.x + this.width;
        const objLeft = this.x;
        const objTop = this.y;
        const objBottom = this.y + this.height;

        if (playerRight > objLeft && playerLeft < objRight) {
            if (playerBottom > objTop && playerTop < objBottom) {
                // Determine which side is being collided with
                const overlapX = Math.min(playerRight - objLeft, objRight - playerLeft);
                const overlapY = Math.min(playerBottom - objTop, objBottom - playerTop);

                if (overlapX < overlapY) {
                    // Horizontal collision
                    if (player.direction.x > 0) player.x = objLeft - PhysicsObject.PLAYER_SIZE;
                    if (player.direction.x < 0) player.x = objRight;
                    player.direction.x = 0; // Stop movement in X
                } else {
                    // Vertical collision
                    if (player.direction.y > 0) player.y = objTop - PhysicsObject.PLAYER_SIZE;
                    if (player.direction.y < 0) player.y = objBottom;
                    player.direction.y = 0; // Stop movement in Y
                }
                //player.moving = false;
            }
        }
    }
}
