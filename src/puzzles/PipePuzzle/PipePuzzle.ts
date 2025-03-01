import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Hexagon from "./Hexagon";
import Scene from "../../lib/Scene";

export default class PipePuzzle extends Puzzle {
    grid!: Hexagon[][];
    rows!: number;
    columns!: number;
    scene: Scene;
    hex!: Hexagon;
    hexSize: number = 100;
    hexSpacing: number = 10;

    constructor(scene: Scene) {
        super(scene);
        this.scene = scene;
        this.grid = [];
    }

    preload(): any {}

    setup() {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.generateGrid();
    }

    draw() {
        this.draw_board();
    }

    keyPressed(): void {
        if (this.hex) {
          if (this.scene.p5.key === 'r' || this.scene.p5.key === 'R') {
            this.hex.rotateShape(Math.PI / 4); // Rotate by 45 degrees
          }
          if (this.scene.p5.key === 't' || this.scene.p5.key === 'T') {
              this.hex.rotateShape(-Math.PI / 4); // Rotate counterclockwise
            }
        }
    }
    generateGrid() {
        this.grid = [];
        const { columns, rows } = this.getBoardSize();
        this.columns = columns;
        this.rows = rows;
    
        let hexWidth = this.hexSize * Math.sqrt(3);
        let hexHeight = this.hexSize * 1.5;
    
        for (let row = 0; row < rows; row++) {
            let rowArray: Hexagon[] = [];
            for (let col = 0; col < columns; col++) {
                let x = col * (hexWidth + this.hexSpacing);
                let y = row * (hexHeight + this.hexSpacing);
                if (row % 2 !== 0) x += hexWidth / 2; // Offset for staggered rows
    
                let hex = new Hexagon(this.scene);
                hex.transX = x;
                hex.transY = y;
                hex.scale = 1;
    
                rowArray.push(hex);
            }
            this.grid.push(rowArray);
        }
    }
    
    getBoardSize() {
        switch (PipePuzzle.difficulty) {
            case "easy":
                return { columns: 4, rows: 4 };
                case "normal":
                    return { columns: 5, rows: 5 };
                    default:
                        return { columns: 7, rows: 7 };
        }
    }
    draw_board() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j].draw();
            }
        }
    }
    
}

