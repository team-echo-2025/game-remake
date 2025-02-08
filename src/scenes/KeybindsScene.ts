import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class KeybindsScene extends Scene {
    buttonW: Button;
    buttonA: Button;
    buttonS: Button;
    buttonD: Button;
    buttonBack: Button
    constructor() {
        super("keybinds-scene");
        this.buttonW = new Button({
            label: "Up: W",
            scene: this,
            callback: () => { this.start("play-scene") }
        })
        this.buttonA = new Button({
            label: "Left: A",
            scene: this,
            callback: () => { this.start("setting-scene") }
        })
        
        this.buttonS = new Button({
            label: "Down: S",
            scene: this,
            callback: () => { this.start("character-scene") }
        })
        this.buttonD = new Button({
            label: "Right: D",
            scene: this,
            callback: () => { this.start("setting-scene") }
        })
        
        this.buttonBack = new Button({
            label: "Back",
            scene: this,
            callback: () => { this.start("setting-scene") }
        })
    }
    
    onStart(): void {
        this.add(this.buttonW);
        this.add(this.buttonA);
        this.add(this.buttonS);
        this.add(this.buttonD);
        this.add(this.buttonBack);
    }
    
    draw() {
        // this.buttonW.x = this.p5.mouseX - this.p5.width / 2;
        // this.buttonW.y = this.p5.mouseY - this.p5.height / 2;

        this.buttonW.x = 0;
        this.buttonW.y = -200;
        this.buttonA.x = 0;
        this.buttonA.y = -100;
        this.buttonS.x = 0;
        this.buttonS.y = 0;
        this.buttonD.x = 0;
        this.buttonD.y = 100;
        this.buttonBack.x = 0;
        this.buttonBack.y = 200;
        
    }
}
