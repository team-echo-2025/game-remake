import Scene from "../../lib/Scene";
import Tilemap from "../../lib/tilemap/Tilemap";
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
        this.camera.zoom = .2;
    }

    preload(): any {
        this.loadTilemap("map", "assets/tilemaps/racing/racetrack.tmx");
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "map",
        });
    }

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
    }
}
