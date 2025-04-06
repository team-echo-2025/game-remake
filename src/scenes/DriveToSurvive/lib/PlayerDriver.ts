import CarPhysicsObject from "../../../lib/physics/CarPhysiscsObject";
import Scene from "../../../lib/Scene";
import Sprite from "../../../lib/Sprite";
import { Vector2D } from "../../../lib/types/Physics";
import { KrabbyPatty } from "../DriveToSurvive";
type TireMark = {
    left_start: Vector2D;
    left_end: Vector2D;
    right_start: Vector2D;
    right_end: Vector2D;
    spawn_timestamp: number;
}
export default class PlayerDriver extends CarPhysicsObject {
    private asset!: Sprite;
    private _collectedPatties: number = 0;
    private pressed_keys: any = {};
    private scene!: Scene;
    private direction: Vector2D = { x: 0, y: 0 };
    private upKey: string;
    private leftKey: string;
    private downKey: string;
    private rightKey: string;
    private drifting: boolean = false;
    private tire_marks: TireMark[] = [];

    get collectedPatties() {
        return this._collectedPatties;
    }

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
        this.scene.loadImage("player-driver", "assets/tilemaps/racing/player-driver.png");
    }

    setup(): void {
        this.asset = this.scene.add_new.sprite("player-driver");
        this.asset.zIndex = 50;
        this.asset.width = 20;
        this.asset.height = 20 * 1.8;
        this.scene.camera.follow(this.body);
    }

    collectPatty(patty: KrabbyPatty) {
        this.scene.physics.remove(patty);
        this._collectedPatties++;
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

    rotatedOffset(
        offsetX: number,
        offsetY: number,
        heading: number
    ): { x: number; y: number } {
        const cosA = Math.cos(heading);
        const sinA = Math.sin(heading);
        const worldX = offsetX * cosA - offsetY * sinA;
        const worldY = offsetX * sinA + offsetY * cosA;
        return { x: worldX, y: worldY };
    }
    draw(): void {
        for (let n = this.tire_marks.length - 1; n >= 0; n--) {
            const mark = this.tire_marks[n];
            if (this.scene.p5.millis() - mark.spawn_timestamp > 1000) {
                this.tire_marks.splice(n, 1);
            } else {
                this.scene.p5.push();
                this.scene.p5.stroke(0);
                this.scene.p5.strokeWeight(2);
                this.scene.p5.line(mark.left_start.x, mark.left_start.y, mark.left_end.x, mark.left_end.y);
                this.scene.p5.line(mark.right_start.x, mark.right_start.y, mark.right_end.x, mark.right_end.y);

                this.scene.p5.pop();
            }
        }
        this.gas = this.direction.y > 0 ? 1 : 0;
        this.brake = this.direction.y < 0 ? 1 : 0;
        this.steer = this.direction.x;
        this.body.rotation = -this.heading + 270 * (Math.PI / 180);
        this.asset.rotation = -this.heading + 270 * (Math.PI / 180);
        this.asset.x = this.body.x - this.asset.width / 2;
        this.asset.y = this.body.y - this.asset.height / 2;

        const cx = this.body.x;
        const cy = this.body.y;
        const offset = 5;
        const leftLocal = { x: -this.body.halfHeight, y: -this.body.halfWidth + offset };
        const rightLocal = { x: -this.body.halfHeight, y: this.body.halfWidth - offset };
        const leftTirePos = this.rotatedOffset(leftLocal.x, leftLocal.y, this.heading);
        leftTirePos.x += cx;
        leftTirePos.y += cy;
        const rightTirePos = this.rotatedOffset(rightLocal.x, rightLocal.y, this.heading);
        rightTirePos.x += cx;
        rightTirePos.y += cy;
        if (this.scene.p5.keyIsDown(16)) {
            this.drifting = true;
            this.tire_marks.push({
                left_start: { x: leftTirePos.x, y: leftTirePos.y },
                left_end: { x: leftTirePos.x, y: leftTirePos.y },
                right_start: { x: rightTirePos.x, y: rightTirePos.y },
                right_end: { x: rightTirePos.x, y: rightTirePos.y },
                spawn_timestamp: this.scene.p5.millis(),
            })
        } else {
            this.drifting = false;
        }
        //this.scene.camera.rotation = this.heading + (90 * (Math.PI / 180));
    }
    update(dt: number, scene: Scene): void {
        super.update(dt, scene);
        if (this.drifting && this.tire_marks.length > 0) {
            const cx = this.body.x;
            const cy = this.body.y;
            const offset = 5;
            const leftLocal = { x: -this.body.halfHeight, y: -this.body.halfWidth + offset };
            const rightLocal = { x: -this.body.halfHeight, y: this.body.halfWidth - offset };
            const leftTirePos = this.rotatedOffset(leftLocal.x, leftLocal.y, this.heading);
            leftTirePos.x += cx;
            leftTirePos.y += cy;
            const rightTirePos = this.rotatedOffset(rightLocal.x, rightLocal.y, this.heading);
            rightTirePos.x += cx;
            rightTirePos.y += cy;
            const last = this.tire_marks[this.tire_marks.length - 1];
            last.left_end = { x: leftTirePos.x, y: leftTirePos.y };
            last.right_end = { x: rightTirePos.x, y: rightTirePos.y };
        }
    }
}
