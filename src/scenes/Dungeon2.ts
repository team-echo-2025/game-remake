import PhysicsObject from "../lib/physics/PhysicsObject";
import Rectangle from "../lib/physics/Rectangle";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>

export default class Dungeon2 extends Scene {
    player?: Player;
    tilemap?: Tilemap;

    constructor() {
        super("dungeon-2");
        this.physics.debug = true;
    }

    onStart(args?: StartArgs): void {
        this.camera.zoom = 1;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? 0;
        this.player.body.y = args?.starting_pos?.y ?? 348;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon Floor 1.tmx")
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        this.bounds = new Rectangle({ x: this.tilemap.x, y: this.tilemap.y, w: this.tilemap.width, h: this.tilemap.height });
        const object = new PhysicsObject({
            width: 100,
            height: 50,
            mass: Infinity
        })
        object.body.x = 0;
        object.body.y = 400;
        object.overlaps = true;
        object.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('dungeon-1', {
                    starting_pos: { x: -103, y: -636 }
                });
            }
        }
        this.physics.addObject(object);
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
    }

}
