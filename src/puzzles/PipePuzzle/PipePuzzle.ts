import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Hexagon from "./Hexagon";
import Scene from "../../lib/Scene";
import GrowingTree, {Grid} from "./GrowingTree";
//algo need to define end nodes and the path between them
export default class PipePuzzle extends Puzzle {
    grid!: Hexagon[][];  // We will modify this to work with the Grid class
    rows!: number;
    columns!: number;
    scene: Scene;
    hex!: Hexagon;
    hexSize: number = this.scene.p5.windowWidth / 15;
    gridInstance!: Grid; // Instance of the Grid class
    bigTree: GrowingTree

    constructor(scene: Scene) {
        super(scene);
        this.scene = scene;
        this.grid = [];
        this.gridInstance = new Grid(0);  // Initialize with a total of 0 (this will change later)
        this.bigTree  = new GrowingTree(this.gridInstance);
    }

    preload(): any {}

    setup() {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.generateGrid();  // Use the modified generateGrid function
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
// hexWidth and hexHeight handle the plcement of the hexagons relative to each other
    generateGrid() {
    const { columns, rows } = this.getBoardSize();
    this.columns = columns;
    this.rows = rows;

    // Initialize the Grid and GrowingTree with the total number of cells
    const totalCells = columns * rows;
    this.gridInstance = new Grid(totalCells);
    this.bigTree = new GrowingTree(this.gridInstance);

    // Initialize the empty cells set with all the cells
    for (let i = 0; i < totalCells; i++) {
        this.gridInstance.emptyCells.add(i);
    }

    // Generate the maze using Growing Tree Algorithm
    const tiles = this.bigTree.generate(0.5); // Branching amount set to 0.5 for balanced behavior

    // Loop over rows and columns to create the grid
    let hexWidth = 87; 
    let hexHeight = 75;

    for (let row = 0; row < rows; row++) {
        let rowArray: Hexagon[] = [];
        for (let col = 0; col < columns; col++) {
            let x = col * hexWidth - hexWidth * columns / 2;
            let y = row * hexHeight - hexHeight * rows / 2;

            if (row % 2 !== 0) {
                x += hexWidth / 2; 
            }

            let hex = new Hexagon(this.scene);
            hex.transX = x;
            hex.transY = y;
            hex.scale = 1;

            // Determine the index of the current hexagon in the grid
            const index = row * columns + col;

            // Apply the tile state from the maze generation
            hex.tileState = tiles[index];

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

