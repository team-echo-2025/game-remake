import BoxCollider from "../../lib/physics/BoxCollider";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import Scene from "../../lib/Scene";
import Tilemap from "../../lib/tilemap/Tilemap";
import { TestObject } from "../PhysicsTestScene2";
import PlayerDriver from "./lib/PlayerDriver";

export default class DriveToSurvive extends Scene {
    private tilemap?: Tilemap;
    private player?: PlayerDriver;

    constructor() {
        super("drive-to-survive");
        this.physics.debug = true;
    }

    onStart(): void {
        this.player = new PlayerDriver(this);
        this.camera.zoom = 2;
        this.player.body.x = 0;
        this.player.body.y = 0;
        this.physics.friction = 0;
    }

    preload(): any {
        this.loadTilemap("map", "assets/tilemaps/racing/BoatMap.tmx");
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "map",
        }); 
        const obj = new TestObject(this, 100, 100);
        this.physics.addObject(obj);
        this.bounds = new BoxCollider({ 
            x: this.tilemap.x,
            y: this.tilemap.y,
            w: this.tilemap.width,
            h: this.tilemap.height,
        })
    }

    keyPressed(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    }

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
    }
}
