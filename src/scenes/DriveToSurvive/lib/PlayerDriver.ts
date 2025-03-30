import CarPhysicsObject from "../../../lib/physics/CarPhysiscsObject";
import Scene from "../../../lib/Scene";
import Sprite from "../../../lib/Sprite";
import { Vector2D } from "../../../lib/types/Physics";
export default class PlayerDriver extends CarPhysicsObject {
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
            height: 20 * 1.8,
            mass: 20 * 20
        });
        this.scene = scene
        this.upKey = localStorage.getItem("forward") ?? 'w';
        this.leftKey = localStorage.getItem("left") ?? 'a';
        this.downKey = localStorage.getItem("down") ?? 's';
        this.rightKey = localStorage.getItem("right") ?? 'd';
        this.scene.physics.addObject(this);
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
        const key = e.key.toLowerCase();
        if (!this.pressed_keys[this.upKey] && key == this.upKey) {
            this.direction.y += 1;
        }
        if (!this.pressed_keys[this.leftKey] && key == this.leftKey) {
            this.direction.x -= 1;
        }
        if (!this.pressed_keys[this.downKey] && key == this.downKey) {
            this.direction.y -= 1;
        }
        if (!this.pressed_keys[this.rightKey] && key == this.rightKey) {
            this.direction.x += 1;
        }
        if (!this.pressed_keys['shift'] && key == "shift") {
            this.handbreak = 1;
        }
        this.pressed_keys[key] = true;
    }

    keyReleased(e: KeyboardEvent): void {
        const key = e.key.toLowerCase();
        if (this.pressed_keys[this.upKey] && key == this.upKey) {
            this.direction.y -= 1;
        }
        if (this.pressed_keys[this.leftKey] && key == this.leftKey) {
            this.direction.x += 1;
        }
        if (this.pressed_keys[this.downKey] && key == this.downKey) {
            this.direction.y += 1;
        }
        if (this.pressed_keys[this.rightKey] && key == this.rightKey) {
            this.direction.x -= 1;
        }
        if (this.pressed_keys['shift'] && key == "shift") {
            this.handbreak = 0;
        }
        this.pressed_keys[key] = false;
    }

    draw(): void {
        this.gas = this.direction.y > 0 ? 1 : 0;
        this.brake = this.direction.y < 0 ? 1 : 0;
        this.steer = this.direction.x;
        this.asset.rotation = -this.heading + 270 * (Math.PI / 180);
        this.asset.x = this.body.x - this.asset.width / 2;
        this.asset.y = this.body.y - this.asset.height / 2;
        //this.scene.camera.rotation = this.heading + (90 * (Math.PI / 180));
    }
}
