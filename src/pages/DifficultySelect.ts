import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";
import Puzzle from "../lib/Puzzle"

export default class DifficultyPage extends Page {
    easy!: ButtonTest;
    medium!: ButtonTest;
    hard!: ButtonTest;
    back!: ButtonTest;
    set_difficulty!: Puzzle;
    constructor() {
        super("difficulty-page")
        this.set_difficulty = new Puzzle(this.scene);
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
                this.setDifficulty("easy");
            }
        })
        this.easy.y = -100;
        this.medium = this.scene.add_new.button({
            label: "Medium",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.scene.start("play-scene");
                this.setDifficulty("normal");
            }
        })
        this.hard = this.scene.add_new.button({
            label: "Hard",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.scene.start("play-scene");
                this.setDifficulty("hard");
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
        this.keyPressed = (e: KeyboardEvent) => {
            if (e.key === "Escape") { // When ESC is pressed...
                this.cleanup();
                this.set_page("menu-page"); // ...return to main menu
            }
        };
        this.back.y = 200;
    }
    setDifficulty(difficulty: string) {
        console.log(difficulty);
        this.set_difficulty.setDifficulty(difficulty);
    }
}
