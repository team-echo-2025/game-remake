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
    postDraw(): void { }
    keyPressed = (e: KeyboardEvent) =>
    {
        if(e.key === "Escape")
        {
            this.cleanup();
        }
    }

}