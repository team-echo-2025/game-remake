import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class KeybindsPage extends Page {
    buttonW!: ButtonTest;
    buttonA!: ButtonTest;
    buttonS!: ButtonTest;
    buttonD!: ButtonTest;
    buttonBack!: ButtonTest;
    private pressed_keys: Record<string, boolean> = {};
    private keybinds: Record<string, string> = {
        forward: localStorage.getItem("forward") || "w",
        left: localStorage.getItem("left") || "a",
        down: localStorage.getItem("down") || "s",
        right: localStorage.getItem("right") || "d"
    };
    private waitingForKey: string | null = null;

    constructor() {
        super("keybinds-page")
    }
    cleanup = () => {
        this.scene.remove(this.buttonW);
        this.scene.remove(this.buttonA);
        this.scene.remove(this.buttonS);
        this.scene.remove(this.buttonD);
        this.scene.remove(this.buttonBack);
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    setup(): void {
        this.buttonW = this.scene.add_new.button({
            label: `Up: ${this.keybinds.forward.toUpperCase()}`,
            font_key: "jersey",
            callback: () => this.setKeybindChange('forward')
        });

        this.buttonA = this.scene.add_new.button({
            label: `Left: ${this.keybinds.left.toUpperCase()}`,
            font_key: "jersey",
            callback: () => this.setKeybindChange('left')
        });

        this.buttonS = this.scene.add_new.button({
            label: `Down: ${this.keybinds.down.toUpperCase()}`,
            font_key: "jersey",
            callback: () => this.setKeybindChange('down')
        });

        this.buttonD = this.scene.add_new.button({
            label: `Right: ${this.keybinds.right.toUpperCase()}`,
            font_key: "jersey",
            callback: () => this.setKeybindChange('right')
        });

        this.buttonBack = this.scene.add_new.button({
            label: "Back",
            font_key: "jersey",
            callback: () => {
                this.cleanup();
                this.set_page("settings-page")
            }
        });
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
        this.updateButtonLabels()
        this.waitingForKey = direction;
        switch (direction) {
            case "forward":
                this.buttonW.label = "Up: _";
                break;
            case "left":
                this.buttonA.label = "Left: _";
                break;
            case "down":
                this.buttonS.label = "Down: _";
                break;
            case "right":
                this.buttonD.label = "Right: _";
                break;
        }
    }

    updateButtonLabels(): void {
        this.buttonW.label = `Up: ${this.keybinds.forward.toUpperCase()}`;
        this.buttonA.label = `Left: ${this.keybinds.left.toUpperCase()}`;
        this.buttonS.label = `Down: ${this.keybinds.down.toUpperCase()}`;
        this.buttonD.label = `Right: ${this.keybinds.right.toUpperCase()}`;
    }
}
