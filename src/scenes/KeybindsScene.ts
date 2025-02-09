import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class KeybindsScene extends Scene {
    buttonW: Button;
    buttonA: Button;
    buttonS: Button;
    buttonD: Button;
    buttonBack: Button;

    constructor() {
        super("keybinds-scene");
        // Create the player object
        // Create buttons for changing key bindings
        this.buttonW = new Button({
            label: `Up: ${localStorage.getItem("forward")?.toUpperCase()??"W"}`,
            scene: this,
            callback: () => this.changeKeybind('forward')
        });

        this.buttonA = new Button({
            label: `Left: ${localStorage.getItem("left")?.toUpperCase()??"A"}`,
            scene: this,
            callback: () => this.changeKeybind('left')
        });

        this.buttonS = new Button({
            label: `Down: ${localStorage.getItem("down")?.toUpperCase()??"S"}`,
            scene: this,
            callback: () => this.changeKeybind('down')
        });

        this.buttonD = new Button({
            label: `Right: ${localStorage.getItem("right")?.toUpperCase()??"D"}`,
            scene: this,
            callback: () => this.changeKeybind('right')
        });

        this.buttonBack = new Button({
            label: "Back",
            scene: this,
            callback: () => { this.start("setting-scene") }
        });
    }

    // Method to handle keybind changes
    changeKeybind(direction: 'forward' | 'left' | 'down' | 'right') {
        // Prompt the user for a new key and update the player's keybindings
        const newKey = prompt(`Press a new key for ${direction}:`);
        if (newKey) {
            if (direction === 'forward') {
                this.buttonW.label = `Up: ${newKey.toUpperCase()}`;
                localStorage.setItem("forward", newKey.toLowerCase());
            } else if (direction === 'left') {
                this.buttonA.label = `Left: ${newKey.toUpperCase()}`;
                localStorage.setItem("left", newKey.toLowerCase());
            } else if (direction === 'down') {
                this.buttonS.label = `Down: ${newKey.toUpperCase()}`;
                localStorage.setItem("down", newKey.toLowerCase());
            } else if (direction === 'right') {
                this.buttonD.label = `Right: ${newKey.toUpperCase()}`;
                localStorage.setItem("right", newKey.toLowerCase());
            }
        }
    }

    onStart(): void {
        this.add(this.buttonW);
        this.add(this.buttonA);
        this.add(this.buttonS);
        this.add(this.buttonD);
        this.add(this.buttonBack);
    }

    draw() {
        // Position buttons
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
