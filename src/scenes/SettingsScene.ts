import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class SettingsScene extends Scene {
    button1: Button;
    button2: Button;
    button3: Button;
    constructor() {
        super("setting-scene"); //sets name for scene
        this.button1 = new Button({
                    label: "Mute",
                    scene: this,
                    callback: () => { this.start("play-scene") }
                })
                this.button2 = new Button({
                    label: "Keybinds",
                    scene: this,
                    callback: () => { this.start("keybinds-scene") }
                })
                
                this.button3 = new Button({
                    label: "Back",
                    scene: this,
                    callback: () => { this.start("menu-scene") }
                })
            }
            
            onStart(): void {
                this.add(this.button1);
                this.add(this.button2);
                this.add(this.button3);
            }
            
            draw() {
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
