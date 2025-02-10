import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class DifficultyPage extends Page {
    easy!: ButtonTest;
    medium!: ButtonTest;
    hard!: ButtonTest;
    back!: ButtonTest;
    constructor() {
        super("difficulty-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    setup(): void {
        this.easy = this.scene.add_new.button({
            label: "Easy",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.easy);
                this.set_page("play-page");
            }
        })
        this.medium = this.scene.add_new.button({
            label: "Medium",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.medium);
                this.set_page("play-page");
            }
        })
        this.hard = this.scene.add_new.button({
            label: "Hard",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.hard);
                this.set_page("play-page");
            }
        })
        this.back = this.scene.add_new.button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.back);
                this.set_page("world-page");
            }
        })
    }
}
