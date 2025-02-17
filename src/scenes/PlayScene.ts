import Player from "../lib/Player";
import Scene from "../lib/Scene";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import Tilemap from "../lib/tilemap/Tilemap";

export default class PlayScene extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    aCircuit!: AccessCircuit;

    constructor() {
        super("play-scene");
    }

    onStart(): void {
        this.player = new Player(this);
        this.add(this.player);
        this.aCircuit = new AccessCircuit(this);
        this.add(this.aCircuit);
    }

    preload(): any {
        this.loadTilemap("tilemap", "assets/tilemaps/first-tilemap/outside.tmx")
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
    }
}
