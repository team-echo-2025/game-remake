import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Scene from "../../lib/Scene";
import Spritesheet from "../../lib/Spritesheet";

export default class Platform extends PhysicsObject {
    platform?: Spritesheet;
    scene: Scene;
    player: Player;
    flipped: boolean = false;
    containsPlayer: boolean = false;
    maxx: number = 0;
    minx: number = 0;
    speed: number = 50;

    constructor(scene: Scene, player: Player) {
        super({ width: 20, height: 17, mass: Infinity });
        this.scene = scene;
        this.overlaps = true;
        this.scene.physics.addObject(this);
        this.player = player;
    }
    preload(): any {
        this.scene.loadImage('ice_platform', 'assets/tilemaps/PetersTileMap/water-spritesheet.png');
    }
    setup(): void {
        this.platform = this.scene.add_new.spritesheet("ice_platform", 12, 14);
        this.platform.set_frame(12 * 9 + 6);
        this.platform.zIndex = 49;
        let timeout: Timer;
        this.onCollide = (other: RigidBody) => {
            if (other == this.player.body) {
                clearTimeout(timeout);
                this.player.on_platform = true;
                this.containsPlayer = true
                timeout = setTimeout(() => {
                    this.player.on_platform = false;
                    this.containsPlayer = false;
                }, 100);
            }
        }
    }
    update(dt: number, scene: Scene): void {
        this.platform!.x = this.body.x;
        this.platform!.y = this.body.y;
        if (this.body.x > this.maxx) {
            this.flipped = true;
        } else if (this.body.x < this.minx) {
            this.flipped = false;
        }
        if (this.flipped) {
            this.body.velocity.x = -this.speed;
        } else {
            this.body.velocity.x = this.speed;
        }
        if (this.containsPlayer) {
            if (this.player.body.x < this.body.x - this.body.halfWidth) {
                this.player.body.x = this.body.x - this.body.halfWidth;
            }
            if (this.player.body.x > this.body.x + this.body.halfWidth) {
                this.player.body.x = this.body.x + this.body.halfWidth;
            }
            this.player.body.velocity.x = this.body.velocity.x;
        }
        super.update(dt, scene);
    }
}
