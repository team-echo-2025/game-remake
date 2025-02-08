import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class DifficultyScene extends Scene {
    world1: Button;
    world2: Button;
    world3: Button;
    constructor() {
        super("difficulty-scene");
        this.world1 = new Button({
            label: "EASY",
            scene: this,
            font_size: 50,
            callback: () => { this.start("play-scene") }
        })
        this.world2 = new Button({
            label: "NORMAL",
            scene: this,
            font_size: 50,
            callback: () => { this.start("play-scene") }
        })
        this.world3 = new Button({
            label: "HARD",
            scene: this,
            font_size: 50,
            callback: () => { this.start("play-scene") }
        })
    }

    onStart(): void {
        this.add(this.world1);
        this.add(this.world2);
        this.add(this.world3);
    }

    draw() {
        this.world1.y = -100;
        this.world3.y = 100;
    }
}
