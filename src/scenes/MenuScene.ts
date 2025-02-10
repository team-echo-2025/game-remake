import PageManager from "../lib/PageManager";
import Scene from "../lib/Scene";
import DifficultyPage from "../pages/DifficultySelect";
import KeybindsPage from "../pages/KeybindsPage";
import MenuPage from "../pages/MenuPage";
import SettingPage from "../pages/SettingsPage";
import WorldSelectPage from "../pages/WordSelect";

export default class MenuScene extends Scene {
    pManager: PageManager;
    constructor() {
        super("menu-scene");
        this.pManager = new PageManager([
            new MenuPage(),
            new KeybindsPage(),
            new SettingPage(),
            new WorldSelectPage(),
            new DifficultyPage(),
        ], this);
    }
    async preload(): Promise<any> {
        await this.pManager.preload();
    }
    setup(): void {
        this.pManager.setup();
    }
    draw(): void {
        this.pManager.draw();
    }
    keyReleased(e: KeyboardEvent): void {
        this.pManager.keyReleased(e)
    }
    keyPressed(e: KeyboardEvent): void {
        this.pManager.keyPressed(e)
    }
    mouseClicked(e: MouseEvent): void {
        this.pManager.mouseClicked(e)
    }
}
