import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class PausePage extends Page {
    backButton!: ButtonTest;
    quitButton!: ButtonTest; 
    helpButton!: ButtonTest;
    private keybinds: Record<string, string> = {
        forward: localStorage.getItem("forward") || "w",
        left: localStorage.getItem("left") || "a",
        down: localStorage.getItem("down") || "s",
        right: localStorage.getItem("right") || "d"
    };
    isDisplayingInstructions = false;
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
        this.scene.remove(this.helpButton);
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
        this.backButton.x = -200;
        this.backButton.y = -150;
        this.helpButton = this.scene.add_new.img_button({
            label: "How to Play",
            font_key: 'jersey',
            callback: () => {
                this.isDisplayingInstructions = !this.isDisplayingInstructions;
            },
            imageKey: "test"
        })
        this.helpButton.x = 0;
        this.helpButton.y = -150;
        this.scene.scene_manager.disableTimer();
        this.scene.scene_manager.paused = true;
        this.quitButton = this.scene.add_new.img_button({
            label: "Quit to Menu",
            font_key: 'jersey',
            callback: () => {
                this.scene.start("menu-scene");
            },
            imageKey: "test"
        }) 
        this.quitButton.x = 200;
        this.quitButton.y = -150;
        this.hidden = false; 
        this.scene.scene_manager.disableTimer();
        this.scene.scene_manager.paused = true;
    }

    postDraw(): void { 
        if (!this.hidden) {
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
            this.scene.p5.text('Game Paused', 0, -300);
            this.scene.p5.pop();

            // Instructions
            this.instructionDraw();
        }
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
            this.scene.p5.text("Move up, left, down, and right with '" +
                                this.keybinds.forward.toUpperCase() + "', '" +
                                this.keybinds.left.toUpperCase() + "', '" +
                                this.keybinds.down.toUpperCase() + "', and '" +
                                this.keybinds.right.toUpperCase() + "'.", 0, 40);
            this.scene.p5.text('Interact with objects by pressing \'E\'.', 0, 70);
            this.scene.p5.text('Exit puzzle screens by pressing \'Escape\'.', 0, 100);
            this.scene.p5.text('Stuck on a puzzle? Click its "How to Play" button in the bottom-right corner.', 0, 160);
            this.scene.p5.text('Hate the controls? Think your character is ugly?', 0, 220);
            this.scene.p5.text('Return to the main menu and visit Settings or Character Customization!', 0, 250);
            this.scene.p5.text('Be sure to read dialogue for more hints and instructions.', 0, 310);
            this.scene.p5.pop();
        } 
    }
}
