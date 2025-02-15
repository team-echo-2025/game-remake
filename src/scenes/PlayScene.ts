import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";
import PageManager from "../lib/PageManager";
import TestPuzzleOverlay from "../pages/TestPuzzleOverlay";
import TestPuzzle from "../pages/TestPuzzlePage";

export default class PlayScene extends Scene {
    player: Player;
    pManager: PageManager;
    constructor() {
        super("play-scene");
        this.player = new Player(this);
        this.pManager = new PageManager([
            new TestPuzzleOverlay(),
            new TestPuzzle()
        ], this);
    }
    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
        this.pManager.keyPressed(e);
    };
    async preload(): Promise<any> {
        await this.pManager.preload();
    }
    setup(): void {
        this.pManager.setup();
    }
    onStart(): void {
        this.add(this.player);
    }
}
