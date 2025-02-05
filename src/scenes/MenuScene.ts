import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class MenuScene extends Scene {
    button1: Button;
    constructor() {
        super("menu-scene");
        this.button1 = new Button({
            label: "Play!",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
    }

    onStart(): void {
        this.add(this.button1);
    }

    draw() {
        this.button1.x = this.p5.mouseX - this.p5.width / 2;
        this.button1.y = this.p5.mouseY - this.p5.height / 2;
    }
}
