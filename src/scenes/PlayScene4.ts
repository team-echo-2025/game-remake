import BoxCollider from "../lib/physics/BoxCollider";
import Player from "../lib/Player";
import { PuzzleState } from "../lib/Puzzle";
import Scene from "../lib/Scene";
import { Vector2D } from "../lib/types/Physics";

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>


type SceneState = {
    access_puzzle: PuzzleState;
}


export default class PlayScene4 extends Scene {
    constructor() {
        super("new-scene");
        this.physics.debug = false;
        this.camera.zoom = 3;
    }

    onStart(): void {
        const player = new Player(this);
        this.physics.addObject(player);
        player.body.x = -300
        player.body.y = -500
    }

    preload(): any {
        this.loadTilemap("tilemap", "assets/tilemaps/tilesetFolder/scene5.tmx");
    }

    setup(): void {
        const tilemap = this.add_new.tilemap({ tilemap_key: 'tilemap' });
        this.bounds = new BoxCollider({ w: tilemap.width, h: tilemap.height, x: 0, y: 0 });
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
}



