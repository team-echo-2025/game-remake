import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class WorldSelectPage extends Page {
    w1?: ButtonTest;
    w2?: ButtonTest;
    w3?: ButtonTest;
    back!: ButtonTest;
    constructor() {
        super("world-select-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    cleanup = () => {
        this.w1 && this.scene.remove(this.w1);
        this.w2 && this.scene.remove(this.w2);
        this.w3 && this.scene.remove(this.w3);
        this.back && this.scene.remove(this.back);
        this.w1 = undefined;
        this.w2 = undefined;
        this.w3 = undefined;
    }
    setup(): void {
        this.w1 = this.scene.add_new.button({
            label: "World 1",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.set_page("difficulty-page");
            }
        })
        this.w1.y = -100;
        this.w2 = this.scene.add_new.button({
            label: "World 2",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.set_page("difficulty-page");
            }
        })
        this.w3 = this.scene.add_new.button({
            label: "World 3",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.set_page("difficulty-page");
            }
        })
        this.back = this.scene.add_new.button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.set_page("menu-page");
            }
        })
        this.w3.y = 100;
        this.back.y = 200;
    }
}
