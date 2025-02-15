import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";
import PageManager from "../lib/PageManager";
import TestPuzzleOverlay from "../pages/TestPuzzleOverlay";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit"

export default class PlayScene extends Scene {
    player: Player;
    accessPuzzle!: AccessCircuit;
    constructor() {
        super("play-scene");
        this.player = new Player(this);
        this.accessPuzzle = new AccessCircuit(this);
    }
    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };
    async preload(): Promise<any> {
    }
    setup(): void {
    }
    onStart(): void {
        this.add(this.player);
        this.add(this.accessPuzzle);
    }
}
