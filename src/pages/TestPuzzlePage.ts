import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";
import Puzzle from "../lib/Puzzle";
import TestPuzzle from "../puzzles/TestPuzzle"

export default class TestPuzzlePage extends Page {
    returnButton!: ButtonTest;
    puzzle!: TestPuzzle;
    constructor() {
        super("test-puzzle-page")
        this.puzzle = new TestPuzzle();
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
        this.scene.add(this.puzzle)
    }
    cleanup() {
        this.scene.remove(this.returnButton);
    }
    setup(): void {
        this.returnButton = this.scene.add_new.button({
            label: "This Should Return You To The Play Scene",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.set_page('test-puzzle-overlay-page')
            }
        })
        this.returnButton.y = -100;
    }
}

