import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class MenuScene extends Scene {
    button1: Button;
    KDbutton: Button;
    button2: Button;
    button3: Button;
    constructor() {
        super("menu-scene");
        this.button1 = new Button({
            label: "Play!",
            scene: this,
            callback: () => { this.start("world-scene") }
        })
        this.button2 = new Button({
            label: "Settings",
            scene: this,
            callback: () => { this.start("setting-scene") }
        })
        
        this.button3 = new Button({
            label: "Character Customization",
            scene: this,
            callback: () => { this.start("character-scene") }
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
        this.add(this.button2);
        this.add(this.button3);
    }
    
    draw() {
        this.button1.x = 2//this.p5.mouseX - this.p5.width / 2;
        this.button1.y = 2//this.p5.mouseY - this.p5.height / 2;
        this.KDbutton.x = 300
        this.KDbutton.y = 300
        // this.button1.x = this.p5.mouseX - this.p5.width / 2;
        // this.button1.y = this.p5.mouseY - this.p5.height / 2;

        this.button1.x = 0;
        this.button1.y = -100;
        this.button2.x = 0;
        this.button2.y = 0;
        this.button3.x = 0;
        this.button3.y = 100;
        
    }
}
