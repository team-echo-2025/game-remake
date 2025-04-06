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
    positions: [number, number][];
    switchState: number;
    graveSwitch!: PhysicsObject;
    dialogue!: Dialogue;
    inRange: boolean = false;

    constructor() {
        super("Switches");
        this.physics.debug = false;
        this.pManager = new PageManager([new SwitchesPage()], this)
        this.firstSwitch = null;
        this.secondSwitch = null;
        this.foundSwitch = false;
        this.positions = [ // graveyard positions
            [-302,-257], [-238,-257], [-175, -257], [-111, -257], [-47, -257], [17, -257], [81, -257], [145, -257], 
            [-302, -190], [-238,-190], [-175, -190], [-111, -190], [-47, -190], [17, -190], [81, -190], [145, -190],   
            [-302, -125], [-238,-125], [-175, -125], [-111, -125], [-47, -125], [17, -125], [81, -125], [145, -125]
        ]
        this.switchState = 0;
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
    }
    setup(): void {
        // Boundaries of the grid
        this.tilemap = this.add_new.tilemap({ tilemap_key: "tilemap" });
        const gridSize = new PhysicsObject({
            width: 550,
            height: 220,
            mass: Infinity
        })
        gridSize.body.x = -82;
        gridSize.body.y = -190; //(350,-295), (188,-295), (188,-95),(350,-95) corners
        gridSize.overlaps = true;
        this.physics.addObject(gridSize);
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
        
        this.graveSwitch.onCollide = (other: RigidBody) => {
            if(other == this.player?.body){
                if(!this.inRange){
                    this.inRange = true;
                }
            }
        }


        if(this.positions.length < 2){  
            return
        }

        const shuffled = [...this.positions].sort(()=> Math.random() - 0.5);
        this.firstSwitch = shuffled[0];
        this.secondSwitch = shuffled[1];
        //Ending
        //(0,-215)

    }

    keyPressed = (e: KeyboardEvent) => {
        // if(e.key === 'e'){
        //     if(!this.player || !this.player.body) return;
        //     this.pressSwitch(this.player.body.x, this.player.body.y);
        // }

        if(e.key === 'e') {              
            if(this.foundSwitch){
                this.dialogue.addDialogue(100,50,"Hmm, there is nothing here");
            }
            else {
                this.dialogue.addDialogue(110,60, "There seems to be a switch in another place");
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
