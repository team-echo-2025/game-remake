import Player from "../lib/Player";
import Scene from "../lib/Scene";

export default class PlayScene extends Scene {
    player: Player;
    constructor() {
        super("play-scene");
        this.player = new Player(this);
    }
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };
    onStart(): void {
        this.add(this.player);
    }
}
