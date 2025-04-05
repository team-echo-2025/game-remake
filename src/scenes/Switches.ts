import PhysicsObject from "../lib/physics/PhysicsObject";
import Player from "../lib/Player";
import Tilemap from "../lib/tilemap/Tilemap";
import Scene from "../lib/Scene";
import PageManager from "../lib/PageManager";
import SwitchesPage from "../pages/SwitchesPage";
import BoxCollider from "../lib/physics/BoxCollider";;
import RigidBody from "../lib/physics/RigidBody";
import { Vector2D } from "../lib/types/Physics";
import { Graphics } from "p5";
import { PuzzleState } from "../lib/Puzzle";
import Dialogue from "../lib/ui/Dialogue";


type StartArgs = Readonly<{
    starting_pos: Vector2D
}>
type SceneState = {
    access_puzzle: PuzzleState;
}

export default class Switches extends Scene {
    x: number = 0; //position of the stones
    y: number = 0;
    pManager: PageManager;
    player?: Player;
    tilemap?: Tilemap;
    firstSwitch: [number, number] | null;
    secondSwitch: [number, number] | null;
    foundSwitch: boolean;
    //positions: [number, number][];
    switchState: number;
    graveSwitch!: PhysicsObject;
    dialogue!: Dialogue;
    

    constructor() {
        super("Switches");
        this.physics.debug = false;
        this.pManager = new PageManager([new SwitchesPage()], this)
        this.firstSwitch = null;
        this.secondSwitch = null;
        this.foundSwitch = false;
        // this.positions = [ 
        //     [-309,-250], //top left
        //     [-305, -131], //bottom left
        //     [-143, -263], // top right
        //     [143, -131], // bottom right
        // ]
        this.switchState = 0;
        this.camera.zoom = 3;
        //this.initializePuzzle();
    }
    // initializePuzzle() { // 8x3
    //     const row = Math.floor(Math.random() * 8);
    //     const col = Math.floor(Math.random() * 3);
    //     this.firstSwitch = [row, col];

    //     const neighbors: [ number, number ][] = [];

    //     if (row > 0) neighbors.push([row - 10, col]);
    //     if (row < 7) neighbors.push([row + 10, col]);
    //     if (col > 0) neighbors.push([row, col - 10]);
    //     if (col < 2) neighbors.push([row, col + 10]);

    //     this.secondSwitch = neighbors[Math.floor(Math.random() * neighbors.length)];
    //     this.switchState = 0;
    // }

    onStart(): void {

        this.add(this.pManager);
        this.pManager.set_page("SwitchesPage");
        this.pManager.postDraw();

        this.player = new Player(this);
        this.player.body.x = -90;
        this.player.body.y = -70;
        this.physics.addObject(this.player);
    }
    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Switches.tmx");
    }
    setup(): void {
        this.graveSwitch = new PhysicsObject({
            width: 50,
            height: 50,
            mass: Infinity
        });   
        this.graveSwitch.overlaps = true;
        this.graveSwitch.body.x = this.x;
        this.graveSwitch.body.y = this.y;
        this.physics.addObject(this.graveSwitch);

        this.dialogue = new Dialogue(this, this.player!);

        //Ending
        //(0,-215)

    }

    keyPressed = (e: KeyboardEvent) => {
        // if(e.key === 'e'){
        //     if(!this.player || !this.player.body) return;
        //     this.pressSwitch(this.player.body.x, this.player.body.y);
        // }
        this.graveSwitch.onCollide = (other: RigidBody) => {
            if(e.key === 'e') {
                if(this.foundSwitch){
                    this.dialogue.addDialogue(this.x,this.y,"Hmm, there is nothing here");
                }
                else {
                    this.dialogue.addDialogue(this.x,this.y, "There seems to be a switch in another place");
                }
            } 
        }
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    }
    // pressSwitch(x: number, y: number) {
    //     if (!this.firstSwitch || !this.secondSwitch) {
    //         this.switchState = -1;
    //         return;
    //     }

    //     const row = Math.round((x + 18) / 10);
    //     const col = Math.round((y + 16) / 10);

    //     if (!this.foundSwitch) {
    //         if (row === this.firstSwitch[0] && col === this.firstSwitch[1]) {
    //             this.foundSwitch = true;
    //             this.switchState = 1;
    //         } else {
    //             this.resetPuzzle();
    //             this.switchState = -1;
    //         }
    //     } else {
    //         if (row === this.secondSwitch[0] && col === this.secondSwitch[1]) {
    //             this.switchState = 2;
    //         } else {
    //             this.resetPuzzle();
    //             this.switchState = -1;
    //         }
    //     }
    // }
    // resetPuzzle() {
    //     this.foundSwitch = false;
    //     this.initializePuzzle();
    // }
    onStop(): void {
         this.tilemap = undefined;
         this.player = undefined;
    }
    draw(): void {
         if (!this.player || !this.player.body) return;
    }
    postDraw(): void { }
} 
