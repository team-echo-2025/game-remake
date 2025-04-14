import PhysicsObject from "../lib/physics/PhysicsObject";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";
import PageManager from "../lib/PageManager";
import IcemazePage from "../pages/icemazePage";
import BoxCollider from "../lib/physics/BoxCollider";

type StartArgs = Readonly<{
    starting_pos: Vector2D;
}>;

export default class scene5 extends Scene
{
    player?: Player;
    tilemap?: Tilemap;

    constructor()
    {
        super("scene-5");
        this.physics.debug = false;
    }

    onStart(args?: StartArgs): void
    {
        this.camera.zoom = 2;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -350;
        this.player.body.y = args?.starting_pos?.y ?? -520;
        this.physics.addObject(this.player);
    }

    onStop(): void
    {
        this.tilemap = undefined;
        this.player = undefined;
    }

    preload(): any
    {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/tilesetFolder/scene5.tmx");
    }

    setup(): void
    {
        this.tilemap = this.add_new.tilemap({tilemap_key: "tilemap"});
    }
}