import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Switches from "./Switches";
import Scene from "../../lib/Scene";





export default class GraveyardSwitches extends Puzzle {
    cols : number; // grid 17x5
    rows : number;
    cellWidth: number; // cell size 48.53x66
    cellHeight: number; 
    startX: number; // starting point -1780x-970
    startY: number;  
    switches: Switches[] = [];
    lastMouseX: number = 0;
    lastMouseY: number = 0;
    physObj!: PhysicsObject;
    
    constructor(scene: Scene){
        super(scene);
        this.cols = 17;
        this.rows = 5;
        this.cellWidth = 48.53;
        this.cellHeight = 66;
        this.startX = -1780;
        this.startY = -970;

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'e') this.toggleSwitch();
        });

    }

    getHoveredSwitch(mouseX: number, mouseY: number) {
        const col = Math.floor((mouseX - this.startX) / this.cellWidth);
        const row = Math.floor((mouseY - this.startY) / this.cellHeight);
        if(col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            return row * this.cols + col;
        }
        return -1;
    }
    toggleSwitch(): void {
        const hoveredSwitch = this.getHoveredSwitch(this.lastMouseX, this.lastMouseY);
        if (hoveredSwitch !== -1) {
            this.switches[hoveredSwitch] = !this.switches[hoveredSwitch];
        }
    }
    draw(): void {}
}


