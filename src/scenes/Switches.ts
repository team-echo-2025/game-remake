import PhysicsObject from "../lib/physics/PhysicsObject";
import Player from "../lib/Player";
import Tilemap from "../lib/tilemap/Tilemap";
import Scene from "../lib/Scene";
import PageManager from "../lib/PageManager";
import SwitchesPage from "../pages/SwitchesPage";
import Rectangle from "../lib/physics/Rectangle";
import RigidBody from "../lib/physics/RigidBody";
import { Vector2D } from "../lib/types/Physics";

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>

export default class Switches extends Scene {
    pManager: PageManager;
    player?: Player;
    tilemap?: Tilemap;
    firstSwitch: [number, number] | null;
    secondSwitch: [number, number] | null;
    foundSwitch: boolean;

    constructor() {
        super("Switches");
        this.physics.debug = false;
        this.pManager = new PageManager([new SwitchesPage()], this)
        this.firstSwitch = null;
        this.secondSwitch = null;
        this.foundSwitch = false;
        
    }

    onStart(args?: any): void {
        this.camera.zoom = 4;

        this.add(this.pManager);
        this.pManager.set_page("SwitchesPage");
        this.pManager.postDraw();

        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -215;
        this.player.body.y = args?.starting_pos?.y ?? -215;
        this.physics.addObject(this.player);
    }
    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/graveyardSwitch.tmx");
    }
    setup(): void {
        // Boundaries of the grid
        this.tilemap = this.add_new.tilemap({tilemap_key: "tilemap" });
        this.bounds = new Rectangle({
            x: this.tilemap.x,
            y: this.tilemap.y,
            w: this.tilemap.width,
            h: this.tilemap.height,
        });
        const gridSize = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        })
        gridSize.body.x = 0;
        gridSize.body.y = -215;
        gridSize.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('playscene-2', {starting_pos : { x: -103, y: -636 } }); 
            }
        }
        this.physics.addObject(gridSize);

        //Ending

    }
    keyPressed = (e: KeyboardEvent) => {
        if(e.key === 'e'){
            if(!this.player || !this.player.body) return;
        }
        if (e.key === "Escape"){
            this.pManager?.keyPressed(e);
        } 
    }
    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
    }
    draw(): void {
        if (!this.player || !this.player.body) return;
    }
    postDraw(): void { }
} 