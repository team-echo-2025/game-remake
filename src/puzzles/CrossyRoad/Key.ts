import PhysicsObject from "../../lib/physics/PhysicsObject";
import Scene from "../../lib/Scene";
import Spritesheet from "../../lib/Spritesheet";

export default class Key extends PhysicsObject {
    private key_spritesheet?: Spritesheet; scene: Scene;
    private _x: number = 0;
    private _y: number = 0;

    get x() {
        return this._x;
    }

    set x(num: number) {
        this._x = num;
    }

    get y() {
        return this._y;
    }

    set y(num: number) {
        this._y = num;
    }

    get asset() {
        return this.key_spritesheet;
    }

    constructor(scene: Scene) {
        super({ width: 15, height: 25, mass: Infinity });
        this.overlaps = true;
        this.scene = scene;
    }

    preload(): any {
        this.scene.loadImage("key", "assets/keys/key-spritesheet.png");
    }

    setup(): void {
        this.key_spritesheet = this.scene.add_new.spritesheet("key", 12, 1, 600);
        this.key_spritesheet.display_width = 10;
        this.key_spritesheet.display_height = 20;
        this.key_spritesheet.zIndex = 49;
        this.key_spritesheet.play();
        this.key_spritesheet.end_col = 11;
    }

    draw(): void {
        if (this.key_spritesheet) {
            this.body.y = this.y + this.scene.p5.sin(this.scene.p5.millis() / 100);
            this.body.x = this.x;
            this.key_spritesheet.x = this.body.x + this.key_spritesheet.display_width! / 2;
            this.key_spritesheet.y = this.body.y + this.key_spritesheet.display_height! / 2;
        }
    }

    onDestroy(): void {
        if (this.key_spritesheet)
            this.scene.remove(this.key_spritesheet);
    }
}
