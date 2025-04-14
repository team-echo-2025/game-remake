import Page from "../lib/Page";

export default class GraveyardPage extends Page 
{
    private _active: boolean = true;

    constructor() {
        super ("SwitchesPage");
    }

    preload(): any
    {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf');
    }

    cleanup(): void
    {
        this._active = false;
    }
    setup(): void {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }
    postDraw(): void { }
    keyPressed = (e: KeyboardEvent) =>
    {
        if(e.key === "Escape")
        {
            this.cleanup();
        }
    }

}