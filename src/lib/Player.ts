import { Image } from 'p5';
import Scene from './Scene';
import PhysicsObject from './physics/PhysicsObject';
import { TestObject } from '../scenes/PhysicsTestScene';

type Velocity = {
    x: number;
    y: number;
};

export default class Player extends PhysicsObject {
    zIndex?: number = 50;
    private pressed_keys: any = {};
    private spritesheet?: Image;
    private hairTemplate!: Image;
    private clothes!: Image;
    private hat!: Image;
    private hairColor = { r: 255, g: 255, b: 255 };
    private frames: Image[][] = [];
    private hairFrames: Image[][] = [];
    private clothesFrames: Image[][] = [];
    private hatFrames: Image[][] = [];
    private direction: Velocity;
    private anim_index: number = 0;
    private anim_row: number = 6;
    private start_anim_time: number = 0;
    public moving: boolean = false;
    private scene: Scene;
    private forwardKey: string = 'w';
    private leftKey: string = 'a';
    private downKey: string = 's';
    private rightKey: string = 'd';
    private speed: number = 100;
    private launch_delay_start = 0;
    private scale: number = 1;
    private width: number = 64 * this.scale;
    private height: number = 64 * this.scale;
    disabled: boolean = false;
    shooting: boolean = false;
    teleporting: boolean = false;

    constructor(scene: Scene) {
        super({ width: 16, height: 16, mass: 16 * 16, });
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
        if (this.scene.scene_manager.playerHair != "none") {
            await new Promise((resolve, reject) => {
                this.scene.p5.loadImage(this.scene.scene_manager.playerHair, (img) => {
                    this.hairTemplate = img;
                    resolve(true);
                }, reject);
            });
        }
        await new Promise((resolve, reject) => {
            this.scene.p5.loadImage(this.scene.scene_manager.playerClothes, (img) => {
                this.clothes = img;
                resolve(true);
            }, reject);
        });
        if (this.scene.scene_manager.playerHat != "none") {
            await new Promise((resolve, reject) => {
                this.scene.p5.loadImage(this.scene.scene_manager.playerHat, (img) => {
                    this.hat = img;
                    resolve(true);
                }, reject);
            });
        }
        const savedHairColor = localStorage.getItem("hairColor");
        if (savedHairColor) {
            this.hairColor = JSON.parse(savedHairColor);
        }
        this.forwardKey = localStorage.getItem("forward") ?? 'w';
        this.leftKey = localStorage.getItem("left") ?? 'a';
        this.downKey = localStorage.getItem("down") ?? 's';
        this.rightKey = localStorage.getItem("right") ?? 'd';
    }

    setup(): void {
        this.#setup_frames(this.spritesheet);
        if (this.hairTemplate) this.#setup_hair_frames(this.hairTemplate);
        this.#setup_clothes_frames(this.clothes);
        if (this.hat) this.#setup_hat_frames(this.hat);
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

    #setup_hair_frames(spritesheet?: Image) {
        if (!spritesheet) return;
        for (let i = 0; i < 8; i++) {
            this.hairFrames.push(this.#get_row(i, spritesheet));
        }
    }
    #setup_clothes_frames(spritesheet?: Image) {
        if (!spritesheet) return;
        for (let i = 0; i < 8; i++) {
            this.clothesFrames.push(this.#get_row(i, spritesheet));
        }
    }
    #setup_hat_frames(spritesheet?: Image) {
        if (!spritesheet) return;
        for (let i = 0; i < 8; i++) {
            this.hatFrames.push(this.#get_row(i, spritesheet));
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
        //if (this.disabled) { return; }
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
        //if (this.disabled) { return; }
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
        if (this.teleporting) {
            this.body.x = this.scene.mouseX;
            this.body.y = this.scene.mouseY;
        }
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
        if (!this.disabled && this.moving && this.scene.p5.millis() - this.start_anim_time > 100) {
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
        if (!this.disabled && !(this.direction.x == 0 && this.direction.y == 0)) {
            this.body.velocity.x = this.direction.x * this.speed;
            this.body.velocity.y = this.direction.y * this.speed;
        }
        if (this.frames.length > 0 && this.frames[0].length > 0) {
            this.scene.p5.image(
                this.frames[this.anim_row][this.anim_index],
                this.body.x - this.width / 2,
                this.body.y - this.height / 1.8,
                this.width,
                this.height
            );
        }        
        if (this.hairTemplate) {
            if (this.hairFrames.length > 0 && this.hairFrames[this.anim_row].length > 0) {
                const shirtFrame = this.hairFrames[this.anim_row][this.anim_index];
                this.scene.p5.tint(this.hairColor.r, this.hairColor.g, this.hairColor.b);
                this.scene.p5.image(
                    shirtFrame,
                    this.body.x - this.width / 2,
                    this.body.y - this.height / 1.8,
                    this.width,
                    this.height
                );
                this.scene.p5.noTint();
            }
        }
        if (this.clothesFrames.length > 0 && this.clothesFrames[this.anim_row].length > 0) {
            const clothesFrame = this.clothesFrames[this.anim_row][this.anim_index];
            this.scene.p5.tint(255, 255, 255);
            this.scene.p5.image(
                clothesFrame,
                this.body.x - this.width / 2,
                this.body.y - this.height / 1.8,
                this.width,
                this.height
            );
            this.scene.p5.noTint();
        }
        if (this.hat) {
            if (this.hatFrames.length > 0 && this.hatFrames[this.anim_row].length > 0) {
                const hatFrame = this.hatFrames[this.anim_row][this.anim_index];
                this.scene.p5.tint(255, 255, 255);
                this.scene.p5.image(
                    hatFrame,
                    this.body.x - this.width / 2,
                    this.body.y - this.height / 1.8,
                    this.width,
                    this.height
                );
                this.scene.p5.noTint();
            }
        }
        this.scene.p5.pop();
    }

    postDraw(): void {
        this.scene.p5.push();
        this.scene.p5.fill(0);
        this.scene.p5.textSize(24);
        this.scene.p5.text("X: " + Math.round(this.body.x) + " Y: " + Math.round(this.body.y), 20 - this.scene.p5.width / 2, 20 - this.scene.p5.height / 2);
        this.scene.p5.pop();
    }
}