import Page from "../../lib/Page";
import ButtonTest from "../../lib/ui/ButtonTest";

export default class instructPage extends Page {
    backButton!: ButtonTest;
    exitButton!: ButtonTest;
    hidden = true;
    isDisplayingInstructions = false;

    constructor() {
        super("instruct-page")
    }

    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }

    cleanup() {
        this.scene.remove(this.backButton);
        this.scene.scene_manager.enableTimer();
        this.scene.scene_manager.paused = false;
        this.isDisplayingInstructions = false;
    }

    setup(): void {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        this.backButton = this.scene.add_new.img_button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.cleanup();
                this.hidden = true;
            },
            imageKey: "test"
        })
        this.backButton.x = -150;
        this.backButton.y = 50;
    }
    postDraw(): void {
        if(!this.hidden) {
            let rectWidth = 700;
            let rectHeight = 400;            
            let rectX = 0;
            let rectY = -50;
            this.scene.p5.push()
            this.scene.p5.fill(255,255,255,150);
            this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);

            this.scene.p5.fill(0);
            this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
            this.scene.p5.textSize(50);
            this.scene.p5.text('There seems to be switches behind the stones find them', 0 , -150);
            this.scene.p5.pop()

            
        }
    }
    instructionDraw(): void {
        if(this.isDisplayingInstructions) {
            // Background
            let rectWidth = 700;
            let rectHeight = 400;
            let rectX = 0;
            let rectY = 150;
            this.scene.p5.push()
            this.scene.p5.fill(255, 255, 255, 150);
            this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);

            this.scene.p5.fill(0);
            this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
            this.scene.p5.textSize(50);
            this.scene.p5.text('How to Play', 0, -25)
            this.scene.p5.textSize(25);
            this.scene.p5.text("There are switches behind the graveyards", 0, 40);
            this.scene.p5.text("To interact with the switches press \'E\'", 0, 70);
        }
    }
    onDestroy(): void {
        this.cleanup();
    }
}

