import { Page } from "../lib/PageManager";
import Button from "../lib/ui/Button";

// import Button from "button"
export default class MenuPage extends Page {
    keybinds!: Button;
    constructor() {
        super("menu-page")
    }
    async preload(): Promise<void> {
        this.keybinds = new Button({
            label: "Keybinds",
            scene: this.scene,
            font_size: 50,
            callback: () => { this.set_page("keybinds-page"); }
        });
        await this.keybinds.preload();
    }
    setup(): void {
        this.keybinds.setup();
    }
    draw(): void {
        this.keybinds.draw();
    }
    mouseClicked(e: MouseEvent) {
        this.keybinds.mouseClicked(e)
    }
}
