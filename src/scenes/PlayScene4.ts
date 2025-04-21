import BoxCollider from "../lib/physics/BoxCollider";
import Player from "../lib/Player";
import { PuzzleState } from "../lib/Puzzle";
import Scene from "../lib/Scene";
import { Vector2D } from "../lib/types/Physics";
import Lever from "../puzzles/Dungeon/Lever";
import MagicCircle from "../puzzles/Dungeon/MagicCircle";
import Ghost from "../puzzles/Dungeon/Ghost";
import Tilemap from "../lib/tilemap/Tilemap";
type StartArgs = Readonly<{
    starting_pos: Vector2D
}>


type SceneState = {
    access_puzzle: PuzzleState;
}


export default class PlayScene4 extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    firstLever?: Lever;
    secondLever?: Lever;
    thirdLever?: Lever;
    fourthLever?: Lever;
    leversFlipped: boolean = false;
    magicCircle?: MagicCircle;
    magicCircleX: number = 10;
    magicCircleY: number = -120;
    magicCircleBounds: number = 15
    ghost?: Ghost;
    ghostAlive: boolean = true;


    constructor() {
        super("playscene-4");
        this.physics.debug = false;
        this.camera.zoom = 3;
    }

    onStart(): void {
        this.physics.debug = true;
        this.player = new Player(this);
        this.physics.addObject(this.player);
        this.player.body.x = -300
        this.player.body.y = -500

        this.ghost = new Ghost(this, this.player);
        this.physics.addObject(this.ghost);
        this.ghost.body.x = -200;
        this.ghost.body.y = -450;
    }

    preload(): any {
        this.loadTilemap("tilemap", "assets/tilemaps/tilesetFolder/scene5.tmx");
        this.loadImage("red_lever", "assets/puzzleImages/red.png");
        this.loadImage("blue_lever", "assets/puzzleImages/blue.png");
        this.loadImage("magic_circle", "assets/effects/magic_circle.png");
        this.loadImage("highlightedLever", "assets/puzzleImages/highlightedLever.png");
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({ tilemap_key: 'tilemap' });
        this.bounds = new BoxCollider({ w: this.tilemap.width, h: this.tilemap.height, x: 0, y: 0 });

        this.firstLever = new Lever(this, -610, -170, "red_lever", "blue_lever", "highlightedLever", this.player!);
        this.firstLever.setup();
        this.add(this.firstLever);

        this.secondLever = new Lever(this, -75, 480, "red_lever", "blue_lever", "highlightedLever", this.player!);
        this.secondLever.setup();
        this.add(this.secondLever);

        this.thirdLever = new Lever(this, 50, 180, "red_lever", "blue_lever", "highlightedLever", this.player!);
        this.thirdLever.setup();
        this.add(this.thirdLever);

        this.fourthLever = new Lever(this, 345, -520, "red_lever", "blue_lever", "highlightedLever", this.player!);
        this.fourthLever.setup();
        this.add(this.fourthLever);

        this.magicCircle = new MagicCircle(this, this.magicCircleX, this.magicCircleY, "magic_circle", this.player!)
        this.magicCircle.setup();
        this.add(this.magicCircle);

        // this.firstLever.flipped= true;
        // this.secondLever.flipped = true;
        // this.thirdLever.flipped = true;
        // this.fourthLever.flipped = true;
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
        this.ghost = undefined;
    }

    draw(): void {
        if (!this.leversFlipped) {
            if (this.leverCheck()) {
                this.leversFlipped = true;
                this.magicCircle?.activateCircle();
            }
        } else {
            if (this.ghostAlive)
                this.ghostKillCheck();
        }
    }

    leverCheck(): boolean {
        return this.firstLever!.flipped && this.secondLever!.flipped && this.thirdLever!.flipped && this.fourthLever!.flipped
    }

    ghostKillCheck(): void {
        if (this.magicCircleX - this.magicCircleBounds <= this.ghost!.body.x && this.ghost!.body.x <= this.magicCircleX + this.magicCircleBounds) {
            if (this.magicCircleY - this.magicCircleBounds <= this.ghost!.body.y && this.ghost!.body.y <= this.magicCircleY + this.magicCircleBounds) {
                this.ghost!.die();
                this.ghostAlive = false;
                setTimeout(() => {
                    this.scene_manager.page_manager?.set_page("non-loser");
                }, 2000);
            }
        }
    }
}
