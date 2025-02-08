import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class DifficultyScene extends Scene {
    easy: Button;
    normal: Button;
    hard: Button;
    buttonBack: Button;
    constructor() {
        super("difficulty-scene");
        this.easy = new Button({
            label: "EASY",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
        this.normal = new Button({
            label: "NORMAL",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
        this.hard = new Button({
            label: "HARD",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
        this.buttonBack = new Button({
            label: "Back",
            scene: this,
            callback: () => { this.start("world-scene") }
        })
    }

    onStart(): void {
        this.add(this.easy);
        this.add(this.normal);
        this.add(this.hard);
        this.add(this.buttonBack);
    }

    draw() {
        this.buttonBack.y = 200;
        this.easy.y = -100;
        this.hard.y = 100;
    }
}
