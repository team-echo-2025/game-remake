import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class WorldScene extends Scene {
    world1: Button;
    world2: Button;
    world3: Button;
    constructor() {
        super("world-scene");
        this.world1 = new Button({
            label: "WORLD 1",
            scene: this,
            font_size: 50,
            callback: () => { this.start("difficulty-scene") }
        })
        this.world2 = new Button({
            label: "WORLD 2",
            scene: this,
            font_size: 50,
            callback: () => { this.start("difficulty-scene") }
        })
        this.world3 = new Button({
            label: "WORLD 3",
            scene: this,
            font_size: 50,
            callback: () => { this.start("difficulty-scene") }
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
