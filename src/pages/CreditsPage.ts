import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class CreditsPage extends Page {
    backButton!: ButtonTest;
    p5Button!: ButtonTest;
    howlButton!: ButtonTest;

    constructor() {
        super("credits-page")
    }

    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }

    cleanup() {
        this.scene.remove(this.backButton);
        this.scene.remove(this.p5Button);
        this.scene.remove(this.howlButton);
    }

    setup(): void {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        this.backButton = this.scene.add_new.button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                this.set_page('menu-page')
            }
        })
        this.backButton.x = 0;
        this.backButton.y = 300;
        this.p5Button = this.scene.add_new.button({
            label: "p5.js",
            font_key: 'jersey',
            callback: () => {
                window.location.href = "https://p5js.org/";
            }
        })
        this.p5Button.x = -100;
        this.p5Button.y = 200;
        this.howlButton = this.scene.add_new.button({
            label: "howler.js",
            font_key: 'jersey',
            callback: () => {
                this.cleanup()
                window.location.href = "https://howlerjs.com/";
            }
        })
        this.howlButton.x = 100;
        this.howlButton.y = 200;
    }

    draw(): void {
        // Background
        let rectWidth = 400;
        let rectHeight = 600;

        let rectX = 0;
        let rectY = -50;
        this.scene.p5.push()
        this.page_manager.scene.p5.fill(255, 255, 255, 150);
        this.page_manager.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);

        // Member title
        this.page_manager.scene.p5.fill(0);
        this.page_manager.scene.p5.textAlign(this.page_manager.scene.p5.CENTER, this.page_manager.scene.p5.CENTER);
        this.page_manager.scene.p5.textSize(75);
        this.page_manager.scene.p5.text('Team Echo is...', 0, -300);
        // Member credits
        this.page_manager.scene.p5.textSize(35);
        this.page_manager.scene.p5.text('Layth Alabed', 0, -230);
        this.page_manager.scene.p5.text('Christian Auman', 0, -195);
        this.page_manager.scene.p5.text('Konnor Duncan', 0, -160);
        this.page_manager.scene.p5.text('Ishan Gajera', 0, -125);
        this.page_manager.scene.p5.text('Jacob Kotik', 0, -90);
        this.page_manager.scene.p5.text('Andrew Leonard', 0, -55);
        this.page_manager.scene.p5.text('James Markijohn', 0, -20);
        this.page_manager.scene.p5.text('Peter Nguyen', 0, 15);
        this.page_manager.scene.p5.text('Eli Rogers', 0, 50);
        // Built with title
        this.page_manager.scene.p5.textSize(75);
        this.page_manager.scene.p5.text('Built with...', 0, 125);
        this.scene.p5.pop()
    }
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.cleanup();
            this.set_page("menu-page");
        }
    };
}
