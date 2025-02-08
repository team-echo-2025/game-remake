import { Page } from "../lib/PageManager";
import Button from "../lib/ui/Button";

// import Button from "button"
export default class MenuPage extends Page {
    keybinds: Button | null = null;
    constructor(){
        super("menu-page")
    }
    setup(): void {
        this.keybinds = new Button({
            label: "Keybinds",
            scene: this.scene,
            font_size: 50,
            callback: () => { this.set_page("keybinds_page"); }
        });
        this.keybinds.setup();
    }
    async preload(){
        await(this.keybinds?.preload());
    }
    draw(): void {
        // super.draw();
        // this.keybinds?.draw();
        this.keybinds?.draw();
    }
}
