import { Page } from "../lib/PageManager";
import Button from "../lib/ui/Button";

// import Button from "button"
export default class KeybindsPage extends Page {
    menu!: Button;
    constructor() {
        super("keybinds-page")
    }
    async preload(): Promise<void> {
        this.menu = new Button({
            label: "Menu",
            scene: this.scene,
            font_size: 50,
            callback: () => { this.set_page("menu-page"); }
        });
        await this.menu.preload();
    }
    setup(): void {
        this.menu.setup();
    }
    draw(): void {
        this.menu.draw();
    }
    mouseClicked(e: MouseEvent) {
        this.menu.mouseClicked(e)
    }
}
