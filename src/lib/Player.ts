import { Image } from 'p5';
import Scene from './Scene';
import PhysicsObject from './physics/PhysicsObject';
import { TestObject } from '../scenes/PhysicsTestScene';

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
    private launch_delay_start = 0;
    private scale: number = 1.5;
    private width: number = 64 * this.scale;
    private height: number = 64 * this.scale;
    shooting: boolean = true;

    constructor(scene: Scene) {
        super({ width: 24, height: 24, mass: 50 * 50, });
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
        this.scene.camera.follow(this.body);
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
        if (e.key == 'm') {
            this.shooting = !this.shooting;
        }
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

    mousePressed(_: MouseEvent) {
        if (!this.shooting) return;
        console.log('clicked')

        // Simple "cooldown": only launch if >1 second has passed
        if (this.scene.p5.millis() - this.launch_delay_start > 100) {
            this.launch_delay_start = this.scene.p5.millis();
            for (let i = 0; i < 3; i++) {
                const mx = this.scene.p5.mouseX + this.scene.camera.x - this.scene.p5.width / 2 + i * 64;
                const my = this.scene.p5.mouseY + this.scene.camera.y - this.scene.p5.height / 2 + i * 64;
                const dx = mx - this.body.x;
                const dy = my - this.body.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                if (length === 0) return;
                const nx = dx / length;
                const ny = dy / length;
                const launchSpeed = 500;
                const obj = new TestObject(this.scene);
                obj.body.w = Math.random() * (50 - 10) + 10;
                obj.body.h = Math.random() * (50 - 10) + 10;
                obj.body.x = this.body.x + nx * 100;
                obj.body.y = this.body.y + ny * 100;
                obj.body.mass = obj.body.w * obj.body.h + 1000;
                obj.body.velocity.x = nx * launchSpeed;
                obj.body.velocity.y = ny * launchSpeed;
                this.scene.physics.addObject(obj);
            }
        }
    }

    draw(): void {
        this.scene.p5.push();
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
            this.scene.p5.image(this.frames[this.anim_row][this.anim_index], this.body.x - this.width / 2, this.body.y - this.height / 1.8, this.width, this.height);
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
        this.body.velocity.x = this.direction.x * this.speed;
        this.body.velocity.y = this.direction.y * this.speed;
        this.scene.p5.fill(0);
        this.scene.p5.textSize(24);
        this.scene.p5.text("X: " + Math.round(this.body.x) + " Y: " + Math.round(this.body.y), this.scene.camera.x - this.scene.p5.width / 2 + 20, this.scene.camera.y - this.scene.p5.height / 2 + 20);
        this.scene.p5.pop();
    }
}
