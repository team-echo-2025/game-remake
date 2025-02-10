import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class WorldSelectPage extends Page {
    w1!: ButtonTest;
    w2!: ButtonTest;
    w3!: ButtonTest;
    constructor() {
        super("world-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    setup(): void {
        this.w1 = this.scene.add_new.button({
            label: "World 1",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.w1);
                this.set_page("difficulty-page");
            }
        })
        this.w2 = this.scene.add_new.button({
            label: "World 2",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.w2);
                this.set_page("difficulty-page");
            }
        })
        this.w3 = this.scene.add_new.button({
            label: "World 3",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.w3);
                this.set_page("difficulty-page");
            }
        })
    }
}
