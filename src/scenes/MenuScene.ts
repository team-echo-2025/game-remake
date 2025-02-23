import p5 from "p5";
import PageManager from "../lib/PageManager";
import Scene from "../lib/Scene";
import DifficultyPage from "../pages/DifficultySelect";
import KeybindsPage from "../pages/KeybindsPage";
import MenuPage from "../pages/MenuPage";
import SettingPage from "../pages/SettingsPage";
import WorldSelectPage from "../pages/WordSelect";
import CreditsPage from "../pages/CreditsPage";

export default class MenuScene extends Scene {
    pManager: PageManager;
    imgLogo!: p5.Image;  // Declare imgLogo variable
    constructor() {
        super("menu-scene");
        this.pManager = new PageManager([
            new MenuPage(),
            new KeybindsPage(),
            new SettingPage(),
            new WorldSelectPage(),
            new DifficultyPage(),
            new CreditsPage(),
        ], this);
    }
    async preload(): Promise<any> {
        await this.pManager.preload();
        this.imgLogo = this.p5.loadImage('assets/background.png');  // Load the background image
    }
    setup(): void {
        this.pManager.setup();
    }
    postDraw(): void {
        this.p5.push();  // Save the current transformation matrix
        this.p5.clear();  // Clear the canvas

        // Draw the background image as a full-screen rectangle
        this.p5.texture(this.imgLogo);  // Set the image as the texture
        this.p5.beginShape();
        this.p5.vertex(-this.p5.width / 2, -this.p5.height / 2, 0, 0);  // Top-left corner
        this.p5.vertex(this.p5.width / 2, -this.p5.height / 2, this.imgLogo.width, 0);  // Top-right corner
        this.p5.vertex(this.p5.width / 2, this.p5.height / 2, this.imgLogo.width, this.imgLogo.height);  // Bottom-right corner
        this.p5.vertex(-this.p5.width / 2, this.p5.height / 2, 0, this.imgLogo.height);  // Bottom-left corner
        this.p5.endShape(this.p5.CLOSE);

        this.p5.pop();  // Restore the previous transformation matrix
        this.pManager.draw();
    }
    keyReleased(e: KeyboardEvent): void {
        this.pManager.keyReleased(e)
    }
    keyPressed(e: KeyboardEvent): void {
        this.pManager.keyPressed(e);
    }
    mouseClicked(e: MouseEvent): void {
        this.pManager.mouseClicked(e)
    }
}
