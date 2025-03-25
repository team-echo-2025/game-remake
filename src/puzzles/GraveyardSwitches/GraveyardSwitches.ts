import PhysicsObject from "../../lib/physics/PhysicsObject";
import Switches from "./Switches";
import Scene from "../../lib/Scene";


export default class GraveyardSwitches extends Scene {
    //rowSwitch: number; 
    //colSwitch: number;  // grid 17x5
    //cellWidth: number; // cell size 48.53x66
    //cellHeight: number; 
    //startX: number; // starting point -1780x-970
    //startY: number;  
    physObj!: PhysicsObject;
    switches: [number, number][];
    firstSwitchIndex: [number, number] | null;
    secondSwitchIndex: [number, number] | null;
    foundFirstSwitch: boolean;
    private readonly origin = { x: -1780, y: -970 };
    private readonly graveyardSize = { width: 48.53, height: 66 };
    
    constructor(graveyardPositions: [number, number][]){
        super("graveyardSwitches");
        this.switches = graveyardPositions.map(([x,y]) => this.convertGrid(x,y));
  
        this.placeSwitch();
        this.firstSwitchIndex = null;
        this.secondSwitchIndex = null;
        this.foundFirstSwitch = false;
        // this.colSwitch = Math.floor(Math.random () * 5);
        // this.rowSwitch = Math.floor(Math.random() * 17);
        //this.cellWidth = 48.53;
        //this.cellHeight = 66;
        //this.startX = -1780;
        //this.startY = -970;   
    }

    convertGrid(x: number, y: number)  {
        const row = Math.round((y - this.origin.y) / this.graveyardSize.height);
        const col = Math.round((x - this.origin.x) / this.graveyardSize.width);
        return[row, col];
    }

    placeSwitch() {
        const firstIndex = 
        this.firstSwitchIndex = [this.rowSwitch, this.colSwitch];

        const neighbors = [ 
            [this.rowSwitch - 1, this.colSwitch ], [this.rowSwitch + 1, this.colSwitch],
            [this.rowSwitch, this.colSwitch + 1], [this.rowSwitch, this.colSwitch - 1],
        ].filter(([r,c]) => r >= 0 && r < 17 && c >= 0 && c < 5);

        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.secondSwitchIndex = [randomNeighbor[0], randomNeighbor[1]];
    }

    checkSwitch(rw: number, cl: number) {
        if (!this.firstSwitchIndex || !this.secondSwitchIndex) return -1;
        if (this.rowSwitch === this.firstSwitchIndex[0]  && this.colSwitch === this.firstSwitchIndex[1] && !this.foundFirstSwitch) {
            this.foundFirstSwitch = true;
            return 1;
        }
        if (this.rowSwitch === this.secondSwitchIndex[0] && this.colSwitch === this.secondSwitchIndex[1] && !this.foundFirstSwitch) {
            return 2;
        }
        if (this.foundFirstSwitch) {
            this.foundFirstSwitch = false;
            this.placeSwitch();
            return 0;
        }
        return -1;
    }
    resetPuzzle(): void {
        this.placeSwitch();
        this.foundFirstSwitch = false;
        
    }

    draw(): void {
        this.switches.forEach((sw) => sw.draw());
    }
}


