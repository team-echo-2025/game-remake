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
import Sprite from "../lib/Sprite";

// look at scene 3 and puzzles

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>
type SceneState = {
    access_puzzle: PuzzleState;
}

export default class Switches extends Scene {
    pManager: PageManager;
    player?: Player;
    tilemap?: Tilemap;
    firstSwitch?: [number, number];
    secondSwitch?: [number, number];
    foundFirst: boolean;
    positions: [number, number][] = [];
    switches: PhysicsObject[] =[];
    graveSwitch!: PhysicsObject;
    dialogue!: Dialogue;
    inRange: boolean = false;
    private collider_timeout: any;
    asset!: Sprite;

    constructor() {
        super("Switches");
        this.physics.debug = false;
        this.pManager = new PageManager([new SwitchesPage()], this)
        this.foundFirst = false;

        this.camera.zoom = 3;
    }


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
        this.loadImage("switchesOff", "assets/tilemaps/PetersTileMap/switchesOff.png");
        this.loadImage("switchesOn", "assets/tilemaps/PetersTilemap/switchesOn.png");
    }
    setup(): void {
        // Boundaries of the grid
        this.tilemap = this.add_new.tilemap({ tilemap_key: "tilemap" });

        this.positions = [ // graveyard positions
            [-302,-257], [-238,-257], [-175, -257], [-111, -257], [-47, -257], [17, -257], [81, -257], [145, -257], 
            [-302, -190], [-238,-190], [-175, -190], [-111, -190], [-47, -190], [17, -190], [81, -190], [145, -190],   
            [-302, -125], [-238,-125], [-175, -125], [-111, -125], [-47, -125], [17, -125], [81, -125], [145, -125]
        ]

        const shuffled = [...this.positions].sort(()=> Math.random() - 0.5);
        this.firstSwitch = shuffled[0]; //first position should be random
        this.secondSwitch = this.findAdjacent(shuffled[0]); // second position should be 1 up, down, left, and right of it.

        for(const pos of this.positions){

            const switchObj = new PhysicsObject({
            width: 50,
            height: 50,
            mass: Infinity
            });   
            switchObj.body.x = pos[0];
            switchObj.body.y = pos[1];
            switchObj.overlaps = true;
            this.physics.addObject(switchObj);
            this.switches.push(switchObj);

            switchObj.onCollide = (other: RigidBody) => {
                if (other === this.player?.body) {
                    this.handleSwitchPress(pos);
                }
            };

        
        }
        this.dialogue = new Dialogue(this, this.player!);
        // this.graveSwitch.onCollide = (other: RigidBody) => {
        //     if(other == this.player?.body){
        //         clearTimeout(this.collider_timeout);
        //         if(!this.inRange && this.foundFirst){
        //             this.inRange = true;
        //             this.asset.change_asset("switchesOn");
        //         }
        //         this.collider_timeout = setTimeout(() => {
        //             this.inRange = false;
        //             this.asset.change_asset("switchesOff");
        //         }, 100);
        //     }
        // }
        


    }

    findAdjacent(pos: [number, number]): [number, number] | undefined {
        const [x, y ] = pos;
        const possible = [
            [x + 64, y], [x - 64, y], [x, y + 64], [x, y - 64]
        ];
        for(const p of possible) {
            if (this.positions.find(q => q[0] === p[0] && q[1] === p[1])) {
                return [p[0], p[1]];
            }
        }
        return undefined;
        
    }
    handleSwitchPress(pos: [number,number]){
        if(!this.foundFirst) {
            if(this.firstSwitch && pos[0] === this.firstSwitch[0] && pos[1] === this.firstSwitch[1]) {
                this.foundFirst = true;
                this.dialogue.addDialogue(110, 50, "You found the first switch! Find the second one!");
            } 
            else {
                this.dialogue.addDialogue(110, 50, "Wrong switch! Try again.");
            }
        }
        else {
            if (this.secondSwitch && pos[0] === this.secondSwitch[0] && pos[1] === this.secondSwitch[1]) {
                this.dialogue.addDialogue(110, 50, "Both switches activated! Puzzle complete!");
                // move the player somewhere like scene 5
            } else {
                this.dialogue.addDialogue(110, 50, "Wrong second switch! Start over.");
                this.foundFirst = false;
            }
        }
    }
    keyPressed = (e: KeyboardEvent) => {

        if(e.key === 'e') {              
            if(this.foundFirst){
                this.dialogue.addDialogue(110,50,"Hmm, there is nothing here");
                
            }
            else {
                this.dialogue.addDialogue(110,50, "There seems to be a switch in another place");
            }
        } 

        if (e.key === "Escape") {
            this.start("menu-scene");
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
