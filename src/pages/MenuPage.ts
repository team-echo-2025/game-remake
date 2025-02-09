import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class MenuPage extends Page {
    keybinds!: ButtonTest;
    constructor() {
        super("menu-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    setup(): void {
        this.keybinds = this.scene.add_new.button({
            label: "test",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.keybinds);
                this.set_page("keybinds-page");
            }
        })
    }
}
