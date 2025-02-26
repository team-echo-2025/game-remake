import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class SettingPage extends Page {
    private mute!: ButtonTest;
    private keybinds!: ButtonTest;
    private back!: ButtonTest;
    private isMuted: boolean = false;
    constructor() {
        super("settings-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    cleanup = () => {
        this.scene.remove(this.mute)
        this.scene.remove(this.keybinds)
        this.scene.remove(this.back)
    }
    setup(): void {
        this.mute = this.scene.add_new.button({
            label: "Mute",
            font_key: 'jersey',
            callback: () => {
                //this.cleanup();
                this.handleMute();
            }
        })
        this.mute.x = 0;
        this.mute.y = -100;
        this.keybinds = this.scene.add_new.button({
            label: "Keybinds",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.set_page("keybinds-page");
            }
        })
        this.keybinds.x = 0;
        this.keybinds.y = 0;
        this.back = this.scene.add_new.button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.set_page("menu-page");
            }
        })
        this.back.x = 0;
        this.back.y = 100;
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") { // When ESC is pressed...
            this.cleanup();
            this.set_page("menu-page"); // ...return to main menu
        }
    };

    private handleMute(): void {
        this.isMuted = !this.isMuted; // Toggle mute state
        document.dispatchEvent(new CustomEvent("onmute", {
            detail: { mute: this.isMuted }
        }));
        localStorage.setItem("muted", this.isMuted + "")

        // Update button label dynamically
        this.mute.label = this.isMuted ? "Unmute" : "Mute";
    }
}
