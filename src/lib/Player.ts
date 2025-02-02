import p5, { Image } from 'p5';
import GameObject from './GameObject';

export default class Player implements GameObject {
    player: any;
    pressed_keys: any = {};
    spritesheet: Image = new Image(0, 0);
    frames: Image[][] = [];
    x: number = 0;
    y: number = 0;
    anim_index: number = 0;
    anim_row: number = 6;
    start_anim_time: number = 0;
    moving: boolean = false;
    p: p5;
    forwardKey: string = 'w';
    leftKey: string = 'a';
    backKey: string = 's';
    rightKey: string = 'd';
    // For when we have webgl working
    // cam: any;
    constructor(p: p5) {
        this.p = p;
    }

    preload(): void {
        this.spritesheet = this.p.loadImage('assets/player.png');
    }

    setup(): void {
        for (let i = 0; i < 8; i++) {
            this.frames.push(this.#get_row(i));
        }
        // webgl
        // this.cam = this.p.createCamera();
        // this.cam.ortho();
        // this.p.setCamera(this.cam);
    }

    #get_row = (row: number) => {
        const _sprites: Image[] = []
        for (let j = 0; j < 8; j++) {
            _sprites.push(this.spritesheet.get(64 * j, 64 * row, 64, 64));
        }
        return _sprites;
    }

    keyPressed(e: KeyboardEvent): void {
        this.pressed_keys[e.key] = true;
    }

    keyReleased(e: KeyboardEvent): void {
        this.pressed_keys[e.key] = false;
        this.moving = false;
    }

    draw(): void {
        if (this.moving && this.p.millis() - this.start_anim_time > 100) {
            this.start_anim_time = this.p.millis();
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
        if (this.pressed_keys[this.backKey]) {
            this.anim_row = 4;
            this.y += 1;
            this.moving = true;
        }
        if (this.pressed_keys[this.rightKey]) {
            this.anim_row = 6;
            this.x += 1;
            this.moving = true;
        }
        this.p.circle(0, 0, 10);
        this.p.image(this.frames[this.anim_row][this.anim_index], this.x, this.y);
        // webgl
        // this.cam?.lookAt(this.x, this.y, 1);
    }
}
