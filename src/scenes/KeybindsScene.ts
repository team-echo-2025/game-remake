import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class KeybindsScene extends Scene {
    buttonW: Button;
    buttonA: Button;
    buttonS: Button;
    buttonD: Button;
    buttonBack: Button;
    private pressed_keys: Record<string, boolean> = {};
    private keybinds: Record<string, string> = {
        forward: localStorage.getItem("forward") || "w",
        left: localStorage.getItem("left") || "a",
        down: localStorage.getItem("down") || "s",
        right: localStorage.getItem("right") || "d"
    };
    private waitingForKey: string | null = null;

    constructor() {
        super("keybinds-scene");
        window.addEventListener("keydown", this.keyPressed.bind(this));
        window.addEventListener("keyup", this.keyReleased.bind(this));

        this.buttonW = new Button({
            label: `Up: ${this.keybinds.forward.toUpperCase()}`,
            scene: this,
            callback: () => this.setKeybindChange('forward')
        });

        this.buttonA = new Button({
            label: `Left: ${this.keybinds.left.toUpperCase()}`,
            scene: this,
            callback: () => this.setKeybindChange('left')
        });

        this.buttonS = new Button({
            label: `Down: ${this.keybinds.down.toUpperCase()}`,
            scene: this,
            callback: () => this.setKeybindChange('down')
        });

        this.buttonD = new Button({
            label: `Right: ${this.keybinds.right.toUpperCase()}`,
            scene: this,
            callback: () => this.setKeybindChange('right')
        });

        this.buttonBack = new Button({
            label: "Back",
            scene: this,
            callback: () => { this.start("setting-scene") }
        });
    }

    keyPressed(e: KeyboardEvent): void {
        if (this.waitingForKey) {
            this.keybinds[this.waitingForKey] = e.key.toLowerCase();
            localStorage.setItem(this.waitingForKey, e.key.toLowerCase());
            this.updateButtonLabels();
            this.waitingForKey = null;
        } else {
            const key = Object.keys(this.keybinds).find(k => this.keybinds[k] === e.key.toLowerCase());
            if (key) this.pressed_keys[key] = true;
        }
    }

    keyReleased(e: KeyboardEvent): void {
        const key = Object.keys(this.keybinds).find(k => this.keybinds[k] === e.key.toLowerCase());
        if (key) this.pressed_keys[key] = false;
    }

    setKeybindChange(direction: 'forward' | 'left' | 'down' | 'right') {
        this.waitingForKey = direction;
        alert(`Press a new key for ${direction}`);
    }

    updateButtonLabels(): void {
        this.buttonW.label = `Up: ${this.keybinds.forward.toUpperCase()}`;
        this.buttonA.label = `Left: ${this.keybinds.left.toUpperCase()}`;
        this.buttonS.label = `Down: ${this.keybinds.down.toUpperCase()}`;
        this.buttonD.label = `Right: ${this.keybinds.right.toUpperCase()}`;
    }

    onStart(): void {
        this.add(this.buttonW);
        this.add(this.buttonA);
        this.add(this.buttonS);
        this.add(this.buttonD);
        this.add(this.buttonBack);
    }

    draw() {
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
