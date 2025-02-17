import { Image } from 'p5';
import Scene from './Scene';
import PhysicsObject from './physics/PhysicsObject';

type Velocity = {
    x: number;
    y: number;
};

export default class Player extends PhysicsObject {
    zIndex?: number = 100;
    private pressed_keys: any = {};
    private spritesheet?: Image;
    private frames: Image[][] = [];
    private direction: Velocity;
    private anim_index: number = 0;
    private anim_row: number = 6;
    private start_anim_time: number = 0;
    private moving: boolean = false;
    private scene: Scene;
    private forwardKey: string = 'w';
    private leftKey: string = 'a';
    private downKey: string = 's';
    private rightKey: string = 'd';
    private speed: number = 100;
    constructor(scene: Scene) {
        super({ width: 64, height: 64, mass: 100, });
        this.scene = scene;
        this.direction = {
            x: 0,
            y: 0,
        }
    }

    async preload(): Promise<void> {
        await new Promise((resolve, reject) => {
            this.spritesheet = this.scene.p5.loadImage('assets/player.png', (_: Image) => {
                resolve(true);
            }, (err) => reject(err));
        })
        this.forwardKey = localStorage.getItem("forward") ?? 'w';
        this.leftKey = localStorage.getItem("left") ?? 'a';
        this.downKey = localStorage.getItem("down") ?? 's';
        this.rightKey = localStorage.getItem("right") ?? 'd';
    }

    setup(): void {
        this.#setup_frames(this.spritesheet);
    }

    #setup_frames(spritesheet?: Image) {
        if (!spritesheet) {
            return
        }
        for (let i = 0; i < 8; i++) {
            this.frames.push(this.#get_row(i, spritesheet));
        }
    }

    #get_row = (row: number, spritesheet?: Image) => {
        if (!spritesheet) {
            return []
        }
        const _sprites: Image[] = []
        for (let j = 0; j < 8; j++) {
            _sprites.push(spritesheet.get(64 * j, 64 * row, 64, 64));
        }
        return _sprites;
    }

    keyPressed(e: KeyboardEvent): void {
        if (!this.pressed_keys[this.forwardKey] && e.key == this.forwardKey) {
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
        if (this.pressed_keys[this.forwardKey] && e.key == this.forwardKey) {
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
        if (this.direction.x == 0 && this.direction.y == 0) {
            this.moving = false;
        } else {
            this.moving = true;
        }
        if (this.moving && this.scene.p5.millis() - this.start_anim_time > 100) {
            this.start_anim_time = this.scene.p5.millis();
            this.anim_index = (this.anim_index + 1) % 6;
        }
        if (this.frames.length > 0 && this.frames[0].length > 0) {
            this.scene.p5.image(this.frames[this.anim_row][this.anim_index], this.x - (64 * 1.5) / 2 + 32, this.y - (64 * 1.5) / 2 + 32, 64 * 1.5, 64 * 1.5);
        }
        if (this.pressed_keys[this.forwardKey]) {
            this.anim_row = 5;
        }
        if (this.pressed_keys[this.downKey]) {
            this.anim_row = 4;
        }
        if (this.pressed_keys[this.leftKey]) {
            this.anim_row = 7;
        }
        if (this.pressed_keys[this.rightKey]) {
            this.anim_row = 6;
        }
        // Example: If speed is in pixels per second:
        this.velocity.x = this.direction.x;
        this.velocity.y = this.direction.y;
        this.scene.camera.lookAt(this.x, this.y)
    }
}
//make event to let player know keybind changed, and needs re-read
