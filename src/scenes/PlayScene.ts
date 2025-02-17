import Player from "../lib/Player";
import Scene from "../lib/Scene";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
export default class PlayScene extends Scene {
    player!: Player;
    aCircuit!: AccessCircuit;
    constructor() {
        super("play-scene");
    }
    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };
    preload(): any { }
    setup(): void { }
    onStart(): void {
        this.player = new Player(this);
        this.aCircuit = new AccessCircuit(this);
        this.add(this.player);
        this.add(this.aCircuit);
    }
}
