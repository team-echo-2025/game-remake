import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class SettingPage extends Page {
    mute!: ButtonTest;
    keybind!: ButtonTest;
    back!: ButtonTest;
    constructor() {
        super("setting-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    setup(): void {
        this.mute = this.scene.add_new.button({
            label: "Mute",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.mute);
                this.set_page("world-page");
            }
        })
        this.keybind = this.scene.add_new.button({
            label: "Keybinds",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.keybind);
                this.set_page("keybind-page");
            }
        })
        this.back = this.scene.add_new.button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.back);
                this.set_page("menu-page");
            }
        })
    }
}
