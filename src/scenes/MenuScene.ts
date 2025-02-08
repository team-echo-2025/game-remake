import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class MenuScene extends Scene {
    button1: Button;
    KDbutton: Button;
    constructor() {
        super("menu-scene");
        this.button1 = new Button({
            label: "Play!",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
        this.KDbutton = new Button({
            label: "KD DEV",
            scene: this,
            callback: () => { this.start("kd-dev-scene") }
        })
    }

    onStart(): void {
        this.add(this.button1);
        this.add(this.KDbutton);
    }

    draw() {
        this.button1.x = 2//this.p5.mouseX - this.p5.width / 2;
        this.button1.y = 2//this.p5.mouseY - this.p5.height / 2;
        this.KDbutton.x = 300
        this.KDbutton.y = 300
    }
}
