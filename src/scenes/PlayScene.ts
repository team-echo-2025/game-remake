import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class PlayScene extends Scene {
    player: Player;
    constructor() {
        super("play-scene");
        this.player = new Player(this);
    }
    onStart(): void {
        this.add(this.player);
    }
}
