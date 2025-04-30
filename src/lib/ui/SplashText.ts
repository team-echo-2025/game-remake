import { Font } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";

export type SplashTextProps = Readonly<{
    label: string;
    font_key: string;
    font_size?: number;
}>;
export default class SplashText implements GameObject{

    static quotes:string[] = [    "I don't know how happen but happen did",
        // "All white people suck.",
        "This week is just a continuation of the last",
        "whatever boats ur float",
        // "they actually try, \nthey're just not as good as y'all",
        "feels good.. I like it.\nWhy arent more people like this",
        "Hail Developer, Philosopher, King Eli",
        "This feature was made by Konnor Duncan",
        "Inspired by Minecraft",
        "James broke everything",
        "Eli leaks everything",
        "Now with a blue shield bar!",
        "I'll just pull the race card",
        "Brought to you by Team Echo!",
        "Delozier looks like Mark Hamill",
        "The ice cream truck song is racist",
        // "How's it racist if it's true"
        "Eli: \nGarbage Collector",
        "Konnor: \nWidget Boy",
        "James: \nWreck-It-Ralph",
        "Christian: \nPrometheus",
        "The James Effect"

    ]

    hidden: boolean = false;
    protected _x: number = 0;
    protected _y: number = 0;
    private _label: string;
    private font_size: number = 24;
    private font_key: string;
    private _scene!: Scene;
    private font!: Font;

    constructor(props: SplashTextProps){
        this._label = props.label;
        this.font_size = props.font_size ?? this.font_size;
        this.font_key = props.font_key;
    }

    set x(x: number) {
        this._x = x;
    }

    get x() {
        return this._x;
    }

    set y(y: number) {
        this._y = y;
    }

    get y() {
        return this._y;
    }

    set label(label: string) {
        this._label = label;
    }

    get label() {
        return this._label;
    }

    set scene(s: Scene) {
            this._scene = s;
        }
    
    get scene() {
        return this._scene;
    }

    preload(): any {}

    setup(): void {
        this._scene.p5.push();
        this.font = this._scene.get_asset(this.font_key);
        this._scene.p5.textFont(this.font);
        this._scene.p5.textSize(this.font_size);
        this._label = "test123"
        this.getQuote();
        this._scene.p5.pop();
    }

    postDraw(): void {
        this._draw();
    }

    private _draw(): void {
        const shadowOffsetX = 3; // Horizontal shadow offset
        const shadowOffsetY = 4; // Vertical shadow offset
        const shadowColor = this._scene.p5.color(0, 0, 0, 150);
        const pulseSpeed = 0.0055;  // Adjust for speed of pulsing
        const pulseAmount = 1;
        const pulsingFontSize = this.font_size + Math.sin(this._scene.p5.millis() * pulseSpeed) * pulseAmount;


        this._scene.p5.push();
        // Draw the shadow text first
        this._scene.p5.textAlign(this._scene.p5.CENTER, this._scene.p5.CENTER);
        this._scene.p5.textSize(pulsingFontSize);
        this._scene.p5.textFont(this.font);

        this._scene.p5.fill(shadowColor); // Set shadow color
        this._scene.p5.translate(this._x + shadowOffsetX, this._y + shadowOffsetY - this.font_size / 6);
        this._scene.p5.rotate(-0.4); // Rotate shadow if needed (same as main text)
        this._scene.p5.text(this._label, 0, 0); // Draw the shadow text

        this._scene.p5.fill(0, 0, 0, 100); // Set shadow color
        this._scene.p5.translate(1, 1);
        this._scene.p5.text(this._label, 0, 0); // Draw the shadow text
        this._scene.p5.translate(1, 1);
        this._scene.p5.text(this._label, 0, 0); // Draw the shadow text
        this._scene.p5.translate(1, 1);
        this._scene.p5.text(this._label, 0, 0); // Draw the shadow text

        this._scene.p5.fill(255, 190, 0);
        this._scene.p5.translate(-shadowOffsetX, -shadowOffsetY);
        this._scene.p5.text(this._label, 0, 0);
        this._scene.p5.pop();
    }

    draw(): void {
        this._draw();
    }
    getQuote():void {
        const randomIndex = Math.floor(Math.random() * SplashText.quotes.length);
        // Get the random string from the array
        this._label = SplashText.quotes[randomIndex];

        if((this._scene.p5.hour() == 20 || this._scene.p5.hour() == 8) && this.scene.p5.minute() == 14) //8:14 override
            this._label = "I'm gonna whip it out at 8:14"
    }
}