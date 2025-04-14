import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class PausePage extends Page {
    backButton!: ButtonTest;
    quitButton!: ButtonTest;
    hidden = true;

    constructor() {
        super("pause-page")
    }

    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }

    cleanup() {
        this.scene.remove(this.backButton);
        this.scene.remove(this.quitButton);
        this.scene.scene_manager.enableTimer();
        this.scene.scene_manager.paused = false;
    }

    setup(): void {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        this.backButton = this.scene.add_new.img_button({
            label: "Return to Game",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.hidden = true;
            },
            imageKey: "test"
        })
        this.backButton.x = -100;
        this.backButton.y = 0;
        this.quitButton = this.scene.add_new.img_button({
            label: "Quit to Menu",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.scene.start("menu-scene");
            },
            imageKey: "test"
        })
        this.quitButton.x = 100;
        this.quitButton.y = 0;
        this.hidden = false;
        this.scene.scene_manager.disableTimer();
        this.scene.scene_manager.paused = true;
    }

    postDraw(): void {
        if (!this.hidden) {
            // Background
            let rectWidth = 400;
            let rectHeight = 300;

            let rectX = 0;
            let rectY = -50;
            this.scene.p5.push()
            this.scene.p5.fill(255, 255, 255, 150);
            this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);

            // Title title
            this.scene.p5.fill(0);
            this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
            this.scene.p5.textSize(75);
            this.scene.p5.text('Game Paused', 0, -150);
            this.scene.p5.pop()
        }
    }
}
