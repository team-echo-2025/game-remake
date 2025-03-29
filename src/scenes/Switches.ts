import PhysicsObject from "../lib/physics/PhysicsObject";
import Player from "../lib/Player";
import Tilemap from "../lib/tilemap/Tilemap";
import Scene from "../lib/Scene";
import PageManager from "../lib/PageManager";
import SwitchesPage from "../pages/SwitchesPage";


export default class Switches extends Scene {
    pManager: PageManager;
    player?: Player;
    tilemap?: Tilemap;

    constructor() {
        super("Switches");
        this.physics.debug = false;
        this.pManager = new PageManager([new SwitchesPage()], this)
    }

    onStart(args?: any): void {
        this.camera.zoom = 4;

        this.add(this.pManager);
        this.pManager.set_page("SwitchesPage");
        this.pManager.postDraw();
    }
}