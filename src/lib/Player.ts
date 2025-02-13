import { Image } from 'p5';
import GameObject from './GameObject';
import Scene from './Scene';

export default class Player implements GameObject {
    player: any;
    pressed_keys: any = {};
    spritesheet?: Image;
    frames: Image[][] = [];
    x: number = 0;
    y: number = 0;
    anim_index: number = 0;
    anim_row: number = 6;
    start_anim_time: number = 0;
    moving: boolean = false;
    scene: Scene;
    forwardKey: string = 'w';
    leftKey: string = 'a';
    downKey: string = 's';
    rightKey: string = 'd';
    constructor(scene: Scene) {
        this.scene = scene;
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
        this.pressed_keys[e?.key] = true;
    }

    keyReleased(e: KeyboardEvent): void {
        this.pressed_keys[e?.key] = false;
        this.moving = false;
    }

    draw(): void {
        this.scene.p5.background(135, 206, 235);
        if (this.moving && this.scene.p5.millis() - this.start_anim_time > 100) {
            this.start_anim_time = this.scene.p5.millis();
            this.anim_index = (this.anim_index + 1) % 6;
        }
        if (this.pressed_keys[this.forwardKey]) {
            this.anim_row = 5;
            this.moving = true;
            this.y -= 1;
        }
        if (this.pressed_keys[this.leftKey]) {
            this.anim_row = 7;
            this.x -= 1;
            this.moving = true;
        }
        if (this.pressed_keys[this.downKey]) {
            this.anim_row = 4;
            this.y += 1;
            this.moving = true;
        }
        if (this.pressed_keys[this.rightKey]) {
            this.anim_row = 6;
            this.x += 1;
            this.moving = true;
        }
        if (this.frames.length > 0 && this.frames[0].length > 0) {
            this.scene.p5.image(this.frames[this.anim_row][this.anim_index], this.x, this.y);
        }
    }
}
//make event to let player know keybind changed, and needs re-read
