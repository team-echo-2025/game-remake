import { Graphics } from "p5";
import PhysicsObject from "../lib/physics/PhysicsObject";
import Rectangle from "../lib/physics/Rectangle";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";

type StartArgs = Readonly<{
    starting_pos: Vector2D;
}>;

export default class IceMaze extends Scene {
    player?: Player;
    tilemap?: Tilemap;

    constructor() {
        super("iceMaze");
        this.physics.debug = false;
    }

    onStart(args?: StartArgs): void {
        this.camera.zoom = 4;

        // Create the player
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -215;
        this.player.body.y = args?.starting_pos?.y ?? -215;
        this.physics.friction = 0;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/iceMaze.tmx");
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({ tilemap_key: "tilemap" });
        this.bounds = new Rectangle
            ({
                x: this.tilemap.x,
                y: this.tilemap.y,
                w: this.tilemap.width,
                h: this.tilemap.height,
            });

        const mazeBeginning = new PhysicsObject
            ({
                width: 25,
                height: 25,
                mass: Infinity
            })
        mazeBeginning.body.x = -250;
        mazeBeginning.body.y = -215;
        mazeBeginning.overlaps = true;
        mazeBeginning.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('dungeon-1', { starting_pos: { x: -103, y: -636 } });
            }
        }
        this.physics.addObject(mazeBeginning);

        const mazeEnding = new PhysicsObject
            ({
                width: 100,
                height: 50,
                mass: Infinity
            })
        mazeEnding.body.x = 215;
        mazeEnding.body.y = 250;
        mazeEnding.overlaps = true;
        mazeEnding.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('dungeon-2', { starting_pos: { x: 0, y: 348 } });
            }
        }
        this.physics.addObject(mazeEnding);
    }

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
    }

    draw(): void {
        if (!this.player || !this.player.body) return;
        if (!(this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0)) { this.player.disabled = true }
        if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0) { this.player.disabled = false }
    }

    postDraw(): void { }
}
