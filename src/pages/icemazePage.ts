import Page from "../lib/Page";

export default class IcemazePage extends Page {
    private _active: boolean = true;

    constructor() {
        super("icemazePage");
    }

    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf');
    }

    cleanup(): void {
        this._active = false;
    }

    setup(): void {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }

    postDraw(): void {
        if (!this._active) return;

        let rectWidth = 1300;
        let rectHeight = 200;

        let rectX = 0;
        let rectY = -200;

        this.scene.p5.push()
        this.scene.p5.fill(255, 255, 255, 150);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
        this.scene.p5.fill(0);
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.textSize(75);
        this.scene.p5.text('Welcome to Icemaze, slide your way to freedom!', 0, -250);

        this.scene.p5.textSize(35);
        this.scene.p5.text('Hint: If you get stuck press "r" to reset to start', 0, -180);
        this.scene.p5.text('Press "ESC" to remove this message', 0, -150);
        this.scene.p5.pop();
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.cleanup();
        }
    };
}
