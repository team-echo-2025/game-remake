import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Tilemap from "../lib/Tilemap";

export default class PlayScene extends Scene {
    player: Player;
    tilemap: Tilemap;

    constructor() {
        super("play-scene");
        this.player = new Player(this);
        this.tilemap = new Tilemap(this);
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStart(): void {
        this.add(this.player);
    }

    setup(): void {
        this.add(this.tilemap);
    }
}
