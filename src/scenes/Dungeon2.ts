
import Rectangle from "../lib/physics/Rectangle";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Tilemap from "../lib/tilemap/Tilemap";

export default class Dungeon2 extends Scene {
    player?: Player;
    tilemap?: Tilemap;

    constructor() {
        super("dungeon-2");
        this.physics.debug = true;
    }

    onStart(): void {
        this.camera.zoom = 3;
        this.player = new Player(this);
        this.player.body.x = 0;
        this.player.body.y = 348;
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
