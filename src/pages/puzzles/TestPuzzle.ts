import Page from "../../lib/Page";
import ButtonTest from "../../lib/ui/ButtonTest";

export default class TestPuzzle extends Page {
    returnButton!: ButtonTest;
    constructor() {
        super("test-puzzle-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
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

