import BoxCollider from "../lib/physics/BoxCollider";
import Player from "../lib/Player";
import { PuzzleState } from "../lib/Puzzle";
import Scene from "../lib/Scene";
import { Vector2D } from "../lib/types/Physics";
import Lever from "../puzzles/Dungeon/Lever";

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>


type SceneState = {
    access_puzzle: PuzzleState;
}


export default class PlayScene4 extends Scene {
    player?: Player;
    firstLever?: Lever;
    secondLever?: Lever;
    thirdLever?: Lever;


    constructor() {
        super("new-scene");
        this.physics.debug = false;
        this.camera.zoom = 3;
    }

    onStart(): void {
        this.player = new Player(this);
        this.physics.addObject(this.player);
        this.player.body.x = -300
        this.player.body.y = -500
    }

    preload(): any {
        this.loadTilemap("tilemap", "assets/tilemaps/tilesetFolder/scene5.tmx");
        this.loadImage("red_lever", "assets/puzzleImages/red.png");
        this.loadImage("blue_lever", "assets/puzzleImages/blue.png");
    }

    setup(): void {
        const tilemap = this.add_new.tilemap({ tilemap_key: 'tilemap' });
        this.bounds = new BoxCollider({ w: tilemap.width, h: tilemap.height, x: 0, y: 0 });

        this.firstLever = new Lever(this, -610,-170,"red_lever", "blue_lever", this.player!);
        this.firstLever.setup();
        this.add(this.firstLever);

        this.secondLever = new Lever(this, -75, 480,"red_lever", "blue_lever", this.player!);
        this.secondLever.setup();
        this.add(this.secondLever);

        this.thirdLever = new Lever(this, 50,180,"red_lever", "blue_lever", this.player!);
        this.thirdLever.setup();
        this.add(this.thirdLever);

        this.thirdLever = new Lever(this, 345,-520,"red_lever", "blue_lever", this.player!);
        this.thirdLever.setup();
        this.add(this.thirdLever);
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
    }

    postDraw(): void {
    }
    draw(): void { }

    leverCheck():boolean{
        return this.firstLever!.flipped && this.secondLever!.flipped && this.thirdLever!.flipped
    }
}