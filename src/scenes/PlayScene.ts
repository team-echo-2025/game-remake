import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class PlayScene extends Scene {
    player: Player;
    button1: Button;
    constructor() {
        super("play-scene");
        this.button1 = new Button({
            label: "Menu!",
            scene: this,
            font_size: 50,
            callback: () => { this.start("menu-scene") }
        })
        this.player = new Player(this);
    }
    onStart(): void {
        this.add(this.player);
        this.add(this.button1);
    }
}
