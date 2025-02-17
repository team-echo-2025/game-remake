import GameObject from './GameObject';
import Player from './Player';

export default class PhysicsObject implements GameObject
{
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: { x: number; y: number } = { x: 0, y: 0 };
    mass: number;
    zIndex?: number = 1;
    private static readonly PLAYER_SIZE = 64; // Default player size

    constructor(x: number, y: number, width: number, height: number, mass: number)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mass = mass;
    }

    setup(): void {}
    draw(): void {}
    async preload(): Promise<void> {}

    checkCollision(other: PhysicsObject | Player): boolean
    {
        return (
            this.x < other.x + PhysicsObject.PLAYER_SIZE &&
            this.x + this.width > other.x &&
            this.y < other.y + PhysicsObject.PLAYER_SIZE &&
            this.y + this.height > other.y
        );
    }

    preventPlayerPass(player: Player): void
    {
        if (this.checkCollision(player))
        {
            if (player.direction.x > 0) player.x = this.x - PhysicsObject.PLAYER_SIZE;
            if (player.direction.x < 0) player.x = this.x + this.width;
            if (player.direction.y > 0) player.y = this.y - PhysicsObject.PLAYER_SIZE;
            if (player.direction.y < 0) player.y = this.y + this.height;

            // Stop player movement in collision direction
            player.moving = false;
        }
    }
}
