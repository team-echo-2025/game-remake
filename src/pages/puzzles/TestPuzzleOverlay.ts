import Page from "../../lib/Page";
import ButtonTest from "../../lib/ui/ButtonTest";

export default class TestPuzzleOverlay extends Page {
    puzzleStart!: ButtonTest;
    constructor() {
        super("test-puzzle-overlay-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    cleanup() {
        this.scene.remove(this.puzzleStart);
    }
    setup(): void {
        this.puzzleStart = this.scene.add_new.button({
            label: "Start Test Puzzle",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.set_page('test-puzzle-page')
            }
        })
        this.puzzleStart.y = -100;
    }
}

