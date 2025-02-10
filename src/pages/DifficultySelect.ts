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
    cleanup = () => {
        this.scene.remove(this.easy)
        this.scene.remove(this.medium)
        this.scene.remove(this.hard)
        this.scene.remove(this.back)
    }
    setup(): void {
        this.easy = this.scene.add_new.button({
            label: "Easy",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.scene.start("play-scene");
            }
        })
        this.easy.y = -100;
        this.medium = this.scene.add_new.button({
            label: "Medium",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.scene.start("play-scene");
            }
        })
        this.hard = this.scene.add_new.button({
            label: "Hard",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.scene.start("play-scene");
            }
        })
        this.hard.y = 100;
        this.back = this.scene.add_new.button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.set_page("world-select-page");
            }
        })
        this.back.y = 200;
    }
}
