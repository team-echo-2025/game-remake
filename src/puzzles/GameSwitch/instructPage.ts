import Page from "../../lib/Page";
import ButtonTest from "../../lib/ui/ButtonTest";

export default class InstructPage extends Page {
    backButton?: ButtonTest;
    quitButton?: ButtonTest;
    helpButton?: ButtonTest;
    private keybinds: Record<string, string> = {
        forward: localStorage.getItem("forward") || "w",
        left: localStorage.getItem("left") || "a",
        down: localStorage.getItem("down") || "s",
        right: localStorage.getItem("right") || "d"
    };
    isDisplayingInstructions = false;

    constructor() {
        super("switch-page")
    }

    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }

    cleanup() {
        this.scene.remove(this.backButton!);
        this.scene.remove(this.quitButton!);
        this.scene.remove(this.helpButton!);
        this.backButton = undefined;
        this.helpButton = undefined;
        this.quitButton = undefined;
        this.isDisplayingInstructions = false;
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
                this.scene.scene_manager.page_manager?.set_page("");
            },
            imageKey: "test"
        })
        this.backButton.x = -125;
        this.backButton.y = -150;
        this.helpButton = this.scene.add_new.img_button({
            label: "How to Play",
            font_key: 'jersey',
            callback: () => {
                this.isDisplayingInstructions = !this.isDisplayingInstructions;
            },
            imageKey: "test"
        })
        this.helpButton.x = 75;
        this.helpButton.y = -150;
    }

    postDraw(): void {
        // Background
        let rectWidth = 700;
        let rectHeight = 300;
        let rectX = 0;
        let rectY = -200;
        this.scene.p5.push()
        this.scene.p5.fill(255, 255, 255, 150);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);

        // Title
        this.scene.p5.fill(0);
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.textSize(75);
        this.scene.p5.text('Switches How To', 0, -300);
        this.scene.p5.pop();

        // Instructions
        this.instructionDraw();
    }

    instructionDraw(): void {
        if (this.isDisplayingInstructions) {
            // Background
            let rectWidth = 700;
            let rectHeight = 400;
            let rectX = 0;
            let rectY = 150;
            this.scene.p5.push()
            this.scene.p5.fill(255, 255, 255, 150);
            this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);

            // Instructions
            this.scene.p5.fill(0);
            this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
            this.scene.p5.textSize(50);
            this.scene.p5.text('How to Play', 0, -25);
            this.scene.p5.textSize(25);
            this.scene.p5.text("There are two \"switches\" in the graveyard that need flipped", 0, 40);
            this.scene.p5.text('Once you find the first switch it will change to a blue inscription.', 0, 70);
            this.scene.p5.text('The next switch will the be adjacent to the first (up, down, left, or right)', 0, 120);
            this.scene.p5.text('Once both switches have the blue inscription, the key will spawn', 0, 150);
            this.scene.p5.text('Be careful, each wrong choice will cost you 5 seconds', 0, 210);
            this.scene.p5.pop();
        }
    }
    onDestroy(): void {
        this.cleanup()
    }
}
