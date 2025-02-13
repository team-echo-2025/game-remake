import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";
import Tilemap from "../lib/Tilemap";

export default class PlayScene extends Scene {
    player: Player;
    tilemap: Tilemap;
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
        this.tilemap = new Tilemap(this);
    }
    onStart(): void {
        this.add(this.player);
        this.add(this.button1);
    }
    setup(): void {
        this.button1.x = -this.p5.width / 2 + this.button1.width / 2 + 10;
        this.button1.y = -this.p5.height / 2 + this.button1.height / 2 + 10;
        this.add(this.tilemap);
    }
}
