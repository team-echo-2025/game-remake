import {Image} from 'p5';
import Scene from './Scene';
import PhysicsObject from './physics/PhysicsObject';
import Player from './Player';
import {TestObject} from '../scenes/PhysicsTestScene';

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
    private speed: number = 75;
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

    constructor(scene: Scene, player: Player)
    {
        super({width: 0, height: 0, mass: 16 * 16,});
        this.scene = scene;
        this.player = player;
        this.direction = {x: 0, y: 0,};
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

    setup(): void
    {
        this.#setup_frames(this.spritesheet);
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

    private autoFollowPlayer(): void
    {
        const dx = this.player.body.x - this.body.x;
        const dy = this.player.body.y - this.body.y;

        if (Math.abs(dx) > this.followThreshold)
        {
            if (dx > 0)
            {
                if (!this.movements[3])
                {
                    this.startMoveRight();
                }
                if (this.movements[2])
                {
                    this.endMoveLeft();
                }
            } else
            {
                if (!this.movements[2])
                {
                    this.startMoveLeft();
                }
                if (this.movements[3])
                {
                    this.endMoveRight();
                }
            }
        } else
        {
            if (this.movements[2]) this.endMoveLeft();
            if (this.movements[3]) this.endMoveRight();
        }

        if (Math.abs(dy) > this.followThreshold)
        {
            if (dy > 0)
            {
                if (!this.movements[0])
                {
                    this.startMoveDown();
                }
                if (this.movements[1])
                {
                    this.endMoveUp();
                }
            } else
            {
                if (!this.movements[1])
                {
                    this.startMoveUp();
                }
                if (this.movements[0])
                {
                    this.endMoveDown();
                }
            }
        } else
        {
            if (this.movements[0]) this.endMoveDown();
            if (this.movements[1]) this.endMoveUp();
        }
    }

    startMoveDown(): void
    {
        this.direction.y = 1;
        this.movements[0] = true;
    }

    startMoveUp(): void
    {
        this.direction.y = -1;
        this.movements[1] = true;
    }

    startMoveLeft(): void
    {
        this.direction.x = -1;
        this.movements[2] = true;
    }

    startMoveRight(): void
    {
        this.direction.x = 1;
        this.movements[3] = true;
    }

    endMoveDown(): void
    {
        this.direction.y = 0;
        this.movements[0] = false;
    }

    endMoveUp(): void
    {
        this.direction.y = 0;
        this.movements[1] = false;
    }

    endMoveLeft(): void
    {
        this.direction.x = 0;
        this.movements[2] = false;
    }

    endMoveRight(): void
    {
        this.direction.x = 0;
        this.movements[3] = false;
    }

    draw(): void
    {
        if (this.fullyDead)
        {
            return;
        }
        this.autoFollowPlayer()

        this.scene.p5.push();

        this.moving = !(this.direction.x == 0 && this.direction.y == 0);

        const dx = this.player.body.x - this.body.x;
        const dy = this.player.body.y - this.body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!this.isAttacking && dist < this.attackRange)
        {
            this.isAttacking = true;
            this.anim_index = 0;
        }

        if (this.frames.length > 0 && this.frames[0].length > 0)
        {
            this.scene.p5.image(this.frames[this.anim_row][this.anim_index], this.body.x - this.width / 2, this.body.y - this.height / 1.8, this.width, this.height);
        }

        const now = this.scene.p5.millis();
        if (now - this.start_anim_time > 100)
        {
            this.start_anim_time = now;

            if (this.isDying)
            {
                // In the middle of the death animation
                this.anim_index++;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                this.direction.x = 0
                this.direction.y = 0;
                if (this.anim_index >= this.deathAnimation)
                {
                    this.scene.p5.pop();
                    this.fullyDead = true;
                    return;
                }
            } else if (this.isAttacking)
            {
                this.anim_index++;
                if (this.anim_index >= this.attackAnimation)
                {
                    this.anim_index = 0;
                    this.isAttacking = false;
                }
            } else
            {
                if (this.moving)
                {
                    this.anim_index = (this.anim_index + 1) % this.normalAnimation;
                } else
                {
                    this.anim_index = 0;
                }
            }
        }

        let rowToDraw = this.anim_row;
        if (this.isDying)
        {
            rowToDraw = 0;
        } else if (this.isAttacking)
        {
            if (this.movements[0]) rowToDraw = 5;
            else if (this.movements[1]) rowToDraw = 2;
            else if (this.movements[2]) rowToDraw = 8;
            else if (this.movements[3]) rowToDraw = 1;
        } else
        {
            if (this.movements[0]) rowToDraw = 13;
            else if (this.movements[1]) rowToDraw = 10;
            else if (this.movements[2]) rowToDraw = 16;
            else if (this.movements[3]) rowToDraw = 9;
        }
        this.anim_row = rowToDraw;

        if (!(this.direction.x == 0 && this.direction.y == 0))
        {
            this.body.velocity.x = this.direction.x * this.speed;
            this.body.velocity.y = this.direction.y * this.speed;
        }

        if (this.frames.length > 0 && this.frames[0].length > 0)
        {
            this.scene.p5.image
            (
                this.frames[this.anim_row][this.anim_index],
                this.body.x - this.width / 2,
                this.body.y - this.height / 1.8,
                this.width,
                this.height
            );
        }
        this.scene.p5.pop()
    }
}