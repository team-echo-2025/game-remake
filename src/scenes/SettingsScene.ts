import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class SettingsScene extends Scene {
    buttonMute: Button;
    buttonKeybinds: Button;
    buttonBack: Button;
    private isMuted = false;

    constructor() {
        super("setting-scene");

        this.buttonMute = new Button({
            label: "Mute: OFF",
            scene: this,
            callback: () => this.toggleMute()
        });

        this.buttonKeybinds = new Button({
            label: "Keybinds",
            scene: this,
            callback: () => this.start("keybinds-scene")
        });

        this.buttonBack = new Button({
            label: "Back",
            scene: this,
            callback: () => this.start("menu-scene")
        });

        // Listen for mute event updates
        document.addEventListener("onmute", (event: Event) => {
            const muteEvent = event as CustomEvent;
            this.isMuted = muteEvent.detail.mute;
            this.updateMuteLabel();
        });
    }

    onStart(): void {
        this.add(this.buttonMute);
        this.add(this.buttonKeybinds);
        this.add(this.buttonBack);
    }

    draw(): void {
        this.buttonMute.x = 0;
        this.buttonMute.y = -100;
        this.buttonKeybinds.x = 0;
        this.buttonKeybinds.y = 0;
        this.buttonBack.x = 0;
        this.buttonBack.y = 100;
    }

    private toggleMute(): void {
        this.isMuted = !this.isMuted;
        document.dispatchEvent(new CustomEvent("onmute", {
            detail: { mute: this.isMuted }
        }));
        this.updateMuteLabel();
    }

    private updateMuteLabel(): void {
        this.buttonMute.label = `Mute: ${this.isMuted ? "ON" : "OFF"}`;
    }
}
