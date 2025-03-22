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

export default class Dungeon1 extends Scene {
    player?: Player;
    tilemap?: Tilemap;

    constructor() {
        super("dungeon-1");
        this.physics.debug = false;
    }

    onStart(args?: StartArgs): void {
        this.camera.zoom = 3;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -1767;
        this.player.body.y = args?.starting_pos?.y ?? 863;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon.tmx")
        this.loadImage("door", "assets/doors/prison_door.png");
        this.loadImage("puzzle", "assets/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/access_circuit_success.png");
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        this.bounds = new Rectangle({ x: this.tilemap.x, y: this.tilemap.y, w: this.tilemap.width, h: this.tilemap.height });
        const object = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        })
        object.body.x = -104;
        object.body.y = -725;
        object.overlaps = true;
        object.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('dungeon-2', {
                    starting_pos: { x: 0, y: 348 }
                });
            }
        }
        const enter_portal = new PhysicsObject({
            width: 50,
            height: 300,
            mass: Infinity
        })
        enter_portal.body.x = -1810;
        enter_portal.body.y = 863;
        enter_portal.overlaps = true;
        enter_portal.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start("play-scene", {
                    starting_pos: { x: 319, y: -300 }
                })
            }
        }

        this.physics.addObject(object);
        this.physics.addObject(enter_portal);
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "b") {
            this.player!.teleporting = !this.player?.teleporting;
        }
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };
    
    postDraw(): void {
        if (this.scene_manager.get_time() <= 0)
            this.start("menu-scene");
    }

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
    }

}
