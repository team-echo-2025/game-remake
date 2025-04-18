import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";

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
    private button_sfx!: Sound;
    private sfx_manager!: SoundManager;

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
        this.button_sfx = this.scene.add_new.sound("button_sfx")
        const sfx_props: SoundManagerProps = {
            group: "SFX",
            sounds: [this.button_sfx]
        }
        this.sfx_manager = this.scene.add_new.soundmanager(sfx_props);
        this.buttonW = this.scene.add_new.img_button({
            label: `Up: ${this.keybinds.forward.toUpperCase()}`,
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.setKeybindChange('forward')
            },
            imageKey: "test"
        });

        this.buttonA = this.scene.add_new.img_button({
            label: `Left: ${this.keybinds.left.toUpperCase()}`,
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.setKeybindChange('left')
            },
            imageKey: "test"
        });

        this.buttonS = this.scene.add_new.img_button({
            label: `Down: ${this.keybinds.down.toUpperCase()}`,
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.setKeybindChange('down')
            },
            imageKey: "test"
        });

        this.buttonD = this.scene.add_new.img_button({
            label: `Right: ${this.keybinds.right.toUpperCase()}`,
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.setKeybindChange('right')
            },
            imageKey: "test"
        });

        this.buttonBack = this.scene.add_new.img_button({
            label: "Back",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("settings-page")
            },
            imageKey: "test"
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
    postDraw(): void {
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.push();
        this.scene.p5.textSize(28);
        this.scene.p5.fill(0);
        this.scene.p5.text('Interaction Key: E', 0, -300);
        this.scene.p5.pop();
    }

    keyPressed(e: KeyboardEvent): void {
        if (this.waitingForKey) {
            this.keybinds[this.waitingForKey] = e.key.toLowerCase();
            localStorage.setItem(this.waitingForKey, e.key);
            this.updateButtonLabels();
            this.waitingForKey = null;
        } else {
            const key = Object.keys(this.keybinds).find(k => this.keybinds[k] === e.key.toLowerCase());
            if (key) this.pressed_keys[key] = true;
        }
        if (e.key === "Escape") { // When ESC is pressed...
            this.cleanup();
            this.set_page("menu-page"); // ...return to main menu
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
    onDestroy(): void {
        this.cleanup();
    }
}
