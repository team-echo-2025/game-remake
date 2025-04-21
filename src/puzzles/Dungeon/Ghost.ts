import { Image } from 'p5';
import Scene from '../../lib/Scene';
import PhysicsObject from '../../lib/physics/PhysicsObject';
import Player from '../../lib/Player';
import { TestObject } from '../../scenes/PhysicsTestScene';
import RigidBody from '../../lib/physics/RigidBody';

type Velocity = {
    x: number;
    y: number;
};

export default class Ghost extends PhysicsObject
{
    zIndex?: number = 100;
    private player: Player;
    private followThreshold = 5;
    private attackRange = 50;
    private ghostDebug = true;
    private movements: any = {};
    private spritesheet?: Image;
    private frames: Image[][] = [];
    private direction: Velocity;
    private anim_index: number = 0;
    private anim_row: number = 6;
    private start_anim_time: number = 0;
    public moving: boolean = false;
    private scene: Scene;
    private speed: number = 85;
    private launch_delay_start = 0;
    private scale: number = 1;
    private width: number = 128 * this.scale;
    private height: number = 128 * this.scale;
    private attackAnimation = 22;
    private deathAnimation = 22;
    private normalAnimation = 10;
    private isAttacking = false;
    private isDying = false;
    private fullyDead = false;
    private flashUntil = 0;
    private lastStrikeTime = 0;
    private strikeCooldown = 1000;
    private strikeDistance = 25;
    private readonly TILE_SIZE   = 32;
    private readonly MAX_TRAIL   = Infinity;
    private trail: { col: number; row: number }[] = [];
    private crumbPtr = 0;
    private lastRecorded?: { col: number; row: number };
    private gameOver = false;

    private in_range: boolean = false;
    private collider_timeout: any;

    constructor(scene: Scene, player: Player)
    {
        super({width: 0, height: 0, mass: 16 * 16,});
        this.scene = scene;
        this.player = player;
        this.direction = {x: 0, y: 0,};
        addEventListener('time-up', () => {this.gameOver = true;});
    }



    async preload(): Promise<void>
    {
        await new Promise((resolve, reject) =>
        {
            this.spritesheet = this.scene.p5.loadImage('assets/Ghost.png', (_: Image) =>
            {
                resolve(true);
            }, (err) => reject(err));
        })
    }

    public flashRed(duration = 150)
    {
        this.flashUntil = this.scene.p5.millis() + duration;
    }

    drawFlashOverlay()
    {
        if (this.scene.p5.millis() >= this.flashUntil) return;

        this.scene.p5.push();
        this.scene.p5.resetMatrix();
        this.scene.p5.noStroke();
        this.scene.p5.fill(255, 0, 0, 160);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        this.scene.p5.rect(0, 0, this.scene.p5.width, this.scene.p5.height);
    }

    setup(): void
    {
        this.#setup_frames(this.spritesheet);
        this.onCollide = (other: RigidBody) =>
        {
            if (other == this.player.body)
            {
                clearTimeout(this.collider_timeout);
                if (!this.in_range)
                {
                    this.in_range = true;
                    console.log("ghost enter collide");
                }
                this.collider_timeout = setTimeout(() =>
                {
                    console.log("ghost exit collide");
                    this.in_range = false;
                }, 100);
            }
        }
    }


    #setup_frames(spritesheet?: Image)
    {
        if (!spritesheet)
        {
            return
        }
        for (let i = 0; i < 17; i++)
        {
            this.frames.push(this.#get_row(i, spritesheet));
        }
    }

    #get_row = (row: number, spritesheet?: Image) =>
    {
        if (!spritesheet)
        {
            return []
        }
        const _sprites: Image[] = []
        for (let j = 0; j < 24; j++)
        {
            _sprites.push(spritesheet.get(256 * j, 256 * row, 256, 256));
        }
        return _sprites;
    }

    keyPressed(e: KeyboardEvent): void
    {
        if (this.ghostDebug)
        {
            if (e.key == 'p')
            {
                this.die();
            }
            if (e.key == 'i')
            {
                this.startMoveUp()
            }
            if (e.key == 'j')
            {
                this.startMoveLeft()
            }
            if (e.key == 'k')
            {
                this.startMoveDown()
            }
            if (e.key == 'l')
            {
                this.startMoveRight()
            }
        }
    }

    keyReleased(e: KeyboardEvent): void
    {
        if (this.ghostDebug)
        {
            if (e.key == 'i')
            {
                this.endMoveUp()
            }
            if (e.key == 'j')
            {
                this.endMoveLeft()
            }
            if (e.key == 'k')
            {
                this.endMoveDown()
            }
            if (e.key == 'l')
            {
                this.endMoveRight()
            }
        }
    }

    public die(): void
    {
        this.isDying = true
        this.moving = false
        this.isAttacking = false;
        this.anim_index = 0;
        this.anim_row = 0
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.direction.x = 0
        this.direction.y = 0;
    }

    private toTile(x: number, y: number) {
        return {
            col: Math.floor(x / this.TILE_SIZE),
            row: Math.floor(y / this.TILE_SIZE),
        };
    }

    private recordPlayerStep(): void {
        const tile = this.toTile(this.player.body.x, this.player.body.y);
        if (!this.lastRecorded || this.lastRecorded.col !== tile.col || this.lastRecorded.row !== tile.row) {
            this.trail.push(tile);
            if (this.trail.length > this.MAX_TRAIL) this.trail.shift();
            this.lastRecorded = tile;
        }
    }

    private reachedTile(col: number, row: number): boolean {
        const here = this.toTile(this.body.x, this.body.y);
        return here.col === col && here.row === row;
    }

    private setDirectionTowards(col: number, row: number): void {
        const px = col * this.TILE_SIZE + this.TILE_SIZE / 2;
        const py = row * this.TILE_SIZE + this.TILE_SIZE / 2;
        const dx = px - this.body.x;
        const dy = py - this.body.y;
        const mag = Math.hypot(dx, dy) || 1;
        this.direction.x = dx / mag;
        this.direction.y = dy / mag;
        this.syncMovementFlags();
    }

    private syncMovementFlags(): void
    {
        this.movements[0] = this.movements[1] = this.movements[2] = this.movements[3] = false;

        if (this.direction.x === 0 && this.direction.y === 0) return;

        if (Math.abs(this.direction.y) >= Math.abs(this.direction.x))
        {
            if (this.direction.y > 0) this.movements[0] = true;
            else this.movements[1] = true;
        } else
        {
            if (this.direction.x > 0) this.movements[3] = true;
            else this.movements[2] = true;
        }
    }

    private autoFollowPlayer(): void {
        this.recordPlayerStep();

        if (this.crumbPtr >= this.trail.length) {
            this.direction.x = this.direction.y = 0;
            return;
        }

        const target = this.trail[this.crumbPtr];
        if (this.reachedTile(target.col, target.row)) {
            this.crumbPtr++;
            if (this.crumbPtr >= this.trail.length) {
                this.direction.x = this.direction.y = 0;
                return;
            }
        }

        this.setDirectionTowards(target.col, target.row);
    }

    startMoveDown(): void {
        this.direction.y = 1;
        this.movements[0] = true;
    }

    startMoveUp(): void {
        this.direction.y = -1;
        this.movements[1] = true;
    }

    startMoveLeft(): void {
        this.direction.x = -1;
        this.movements[2] = true;
    }

    startMoveRight(): void {
        this.direction.x = 1;
        this.movements[3] = true;
    }

    endMoveDown(): void {
        this.direction.y = 0;
        this.movements[0] = false;
    }

    endMoveUp(): void {
        this.direction.y = 0;
        this.movements[1] = false;
    }

    endMoveLeft(): void {
        this.direction.x = 0;
        this.movements[2] = false;
    }

    endMoveRight(): void {
        this.direction.x = 0;
        this.movements[3] = false;
    }

    draw(): void {
        if (this.fullyDead) { return; }
        if (this.gameOver) { return; }

        this.autoFollowPlayer()

        this.scene.p5.push();

        this.moving = !(this.direction.x == 0 && this.direction.y == 0);

        const dx = this.player.body.x - this.body.x;
        const dy = this.player.body.y - this.body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.strikeDistance) {
            const now = this.scene.p5.millis();
            if (now - this.lastStrikeTime > this.strikeCooldown) {
                this.flashRed(150);
                this.scene.scene_manager.deductTime?.(10);
                this.lastStrikeTime = now;
            }
        }

        if (!this.isAttacking && dist < this.attackRange) {
            this.isAttacking = true;
            this.anim_index = 0;
        }

        if (this.frames.length > 0 && this.frames[0].length > 0) {
            this.scene.p5.image(this.frames[this.anim_row][this.anim_index], this.body.x - this.width / 2, this.body.y - this.height / 1.8, this.width, this.height);
        }

        const now = this.scene.p5.millis();
        if (now - this.start_anim_time > 100) {
            this.start_anim_time = now;

            if (this.isDying) {
                // In the middle of the death animation
                this.anim_index++;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                this.direction.x = 0
                this.direction.y = 0;
                if (this.anim_index >= this.deathAnimation) {
                    this.scene.p5.pop();
                    this.fullyDead = true;
                    return;
                }
            } else if (this.isAttacking) {
                this.anim_index++;
                if (this.anim_index >= this.attackAnimation) {
                    this.anim_index = 0;
                    this.isAttacking = false;
                }
            } else {
                if (this.moving) {
                    this.anim_index = (this.anim_index + 1) % this.normalAnimation;
                } else {
                    this.anim_index = 0;
                }
            }
        }

        let rowToDraw = this.anim_row;
        if (this.isDying) {
            rowToDraw = 0;
        } else if (this.isAttacking) {
            if (this.movements[0]) rowToDraw = 5;
            else if (this.movements[1]) rowToDraw = 2;
            else if (this.movements[2]) rowToDraw = 8;
            else if (this.movements[3]) rowToDraw = 1;
        } else {
            if (this.movements[0]) rowToDraw = 13;
            else if (this.movements[1]) rowToDraw = 10;
            else if (this.movements[2]) rowToDraw = 16;
            else if (this.movements[3]) rowToDraw = 9;
        }
        this.anim_row = rowToDraw;

        if (!(this.direction.x == 0 && this.direction.y == 0)) {
            this.body.velocity.x = this.direction.x * this.speed;
            this.body.velocity.y = this.direction.y * this.speed;
        }

        if (this.frames.length > 0 && this.frames[0].length > 0) {
            this.scene.p5.image
                (
                    this.frames[this.anim_row][this.anim_index],
                    this.body.x - this.width / 2,
                    this.body.y - this.height / 1.8,
                    this.width,
                    this.height
                );
        }

        this.drawFlashOverlay();

        this.scene.p5.pop()
    }
}
