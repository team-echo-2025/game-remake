import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class JKDevScene extends Scene {
    button1: Button;
    button2: Button;
    constructor() {
        super("jkdev-scene");
        this.button1 = new Button({
            label: "Test",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
        this.button2 = new Button({
            label: "Test",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
    }

    onStart(): void {
        this.add(this.button1);
        this.add(this.button2);
    }

    draw() {
        this.button1.x = 0;
        this.button1.y = 0;
        this.button2.x = 0;
        this.button2.y = -100;
    }
}
