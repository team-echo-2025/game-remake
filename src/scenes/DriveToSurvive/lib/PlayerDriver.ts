import PhysicsObject from "../../../lib/physics/PhysicsObject";
import Scene from "../../../lib/Scene";
import Sprite from "../../../lib/Sprite";
import { Vector2D } from "../../../lib/types/Physics";
export default class PlayerDriver extends PhysicsObject {
    private asset!: Sprite;
    private pressed_keys: any = {};
    private scene!: Scene;
    private direction: Vector2D = { x: 0, y: 0 };
    private upKey: string;
    private leftKey: string;
    private downKey: string;
    private rightKey: string;

    constructor(scene: Scene) {
        super({
            width: 20,
            height: 20,
            mass: 20 * 20
        });
        this.scene = scene
        this.scene.physics.addObject(this);
        this.upKey = localStorage.getItem("forward") ?? 'w';
        this.leftKey = localStorage.getItem("left") ?? 'a';
        this.downKey = localStorage.getItem("down") ?? 's';
        this.rightKey = localStorage.getItem("right") ?? 'd';
    }

    preload(): any {
        this.scene.loadImage("player-driver", "assets/tilemaps/racing/PNG/Cars/car_black_1.png");
    }

    setup(): void {
        this.asset = this.scene.add_new.sprite("player-driver");
        this.asset.zIndex = 50;
        this.asset.width = 20;
        this.asset.height = 20 * 1.8;
        this.scene.camera.follow(this.body);
    }

    keyPressed(e: KeyboardEvent): void {
        //if (this.disabled) { return; }
        if (!this.pressed_keys[this.upKey] && e.key == this.upKey) {
            this.direction.y -= 1;
        }
        if (!this.pressed_keys[this.leftKey] && e.key == this.leftKey) {
            this.direction.x -= 1;
        }
        if (!this.pressed_keys[this.downKey] && e.key == this.downKey) {
            this.direction.y += 1;
        }
        if (!this.pressed_keys[this.rightKey] && e.key == this.rightKey) {
            this.direction.x += 1;
        }
        this.pressed_keys[e?.key] = true;
    }

    keyReleased(e: KeyboardEvent): void {
        //if (this.disabled) { return; }
        if (this.pressed_keys[this.upKey] && e.key == this.upKey) {
            this.direction.y += 1;
        }
        if (this.pressed_keys[this.leftKey] && e.key == this.leftKey) {
            this.direction.x += 1;
        }
        if (this.pressed_keys[this.downKey] && e.key == this.downKey) {
            this.direction.y -= 1;
        }
        if (this.pressed_keys[this.rightKey] && e.key == this.rightKey) {
            this.direction.x -= 1;
        }
        this.pressed_keys[e?.key] = false;
    }

    draw(): void {
        this.asset.x = this.body.x;
        this.asset.y = this.body.y;
        this.body.velocity.y = this.direction.y * 500;
        this.body.velocity.x = this.direction.x * 500;
    }
}
