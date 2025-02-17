import Player from "../lib/Player";
import Scene from "../lib/Scene";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import Tilemap from "../lib/tilemap/Tilemap";
import ButtonTest from "../lib/ui/ButtonTest";

export default class PlayScene extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    aCircuit!: AccessCircuit;
    button!: ButtonTest;

    constructor() {
        super("play-scene");
    }

    onStart(): void {
        this.physics.debug = false;
        this.player = new Player(this);
        this.physics.addObject(this.player);
        this.aCircuit = new AccessCircuit(this);
        this.aCircuit.hidden = true;
        this.add(this.aCircuit);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/first-tilemap/outside.tmx")
    }

    setup(): void {
        this.button = this.add_new.button({
            label: "Puzzle",
            font_key: "jersey",
            callback: () => {
                this.aCircuit.hidden = false;
            }
        });
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "Escape" && !this.aCircuit.hidden) {
            this.aCircuit.hidden = true;
        } else if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
    }
}
