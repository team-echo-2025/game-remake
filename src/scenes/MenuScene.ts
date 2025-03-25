import p5 from "p5";
import PageManager from "../lib/PageManager";
import Scene from "../lib/Scene";
import DifficultyPage from "../pages/DifficultySelect";
import KeybindsPage from "../pages/KeybindsPage";
import MenuPage from "../pages/MenuPage";
import SettingPage from "../pages/SettingsPage";
import WorldSelectPage from "../pages/WordSelect";
import CreditsPage from "../pages/CreditsPage";
import CharacterPage from "../pages/CharacterPage";
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";
export default class MenuScene extends Scene {
    pManager: PageManager;
    imgLogo!: p5.Image;  // Declare imgLogo variable
    private background_music!: Sound;
    private bgm_manager!: SoundManager;
    private sfx_manager!: SoundManager;
    zIndex?: number | undefined = -100;
    constructor() {
        super("menu-scene");
        this.pManager = new PageManager([
            new MenuPage(),
            new KeybindsPage(),
            new SettingPage(),
            new CharacterPage(),
            new WorldSelectPage(),
            new DifficultyPage(),
            new CreditsPage(),
        ], this);
    }
    onStart(args?: any): void {
        this.add(this.pManager);
    }
    async preload(): Promise<any> {
        this.loadFont('jersey', 'assets/fonts/jersey.ttf')
        this.imgLogo = this.p5.loadImage('assets/background.png');  // Load the background image
        this.loadSound("background_music", "assets/background_music.mp3")
        this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3")
    }
    setup(): void {
        this.background_music = this.add_new.sound("background_music");

        const bgm_props: SoundManagerProps = {
            group: "BGM",
            sounds: [this.background_music]
        }
        this.bgm_manager = this.add_new.soundmanager(bgm_props);
        this.bgm_manager.play();
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
    }
}
