import Puzzle, { PuzzleState } from "../../../lib/Puzzle";
import Scene from "../../../lib/Scene";
import Square, {RGB} from "./Square";
import Cursor from "./Cursor";
import SquareLine from "./SquareLine";


export default class DrawPuzzle extends Puzzle {
    squares: Square[][] = [];
    scene: Scene;
    squareSize: number = 50; // Size of each square
    selectedSquares: Square[] = [];
    totalPairs: number = 3; // Number of points to draw
    colors: RGB[] = [
        { r: 184, g: 76, b: 84 },
        { r: 79, g: 138, b: 31 },
        { r: 56, g: 161, b: 189 },
    ];
    cursor: Cursor;
    lines: SquareLine[] = [];
    currentLine?: SquareLine;

    constructor(scene: Scene) {
        super(scene);
        this.scene = scene;
        this.cursor = new Cursor(scene);
    }

    preload(): any {}

    setup(): void {
        this.generateBoard();
    }


    selectRandomSquares(): void {
        const allSquares = this.squares.flat();
        this.selectedSquares = [];
        let colorIndex = 0;

        while (this.selectedSquares.length < this.totalPairs*2 && allSquares.length > 0) {
            const index = Math.floor(Math.random() * allSquares.length);
            const square = allSquares.splice(index, 1)[0];
            square.hasPoint = true;
            //console.log(Math.floor(this.selectedSquares.length/2));
            square.color = this.colors[colorIndex]; //changes dot color every two dots
            this.selectedSquares.push(square);
            if(this.selectedSquares.length % 2 == 0)    colorIndex++;
        }
        this.selectedSquares = [];
    }

    draw(): void {
        this.drawBoard();
        this.cursor.draw();
        if(this.lines.length!=0){
            for(let i = 0; i < this.lines.length; i++){
                this.lines[i].draw();
            }
        }
        const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
        const y = this.scene.p5.mouseY - this.scene.p5.height / 2

        if(this.cursor.validLineStart()){ //check if the stored square has a dot
            let tempSelect = this.getSquareAtMousePosition(x,y); // null or a square at mouse position
            if(this.currentLine!=null && tempSelect != null && this.cursor.currentSquare != null){ 
                if(tempSelect.color == null)// check if allowed to recolor
                    tempSelect.color=this.cursor.currentSquare.color; //recolor
                if(this.currentLine){ //prove is defined
                    if(tempSelect.matchingPoint(this.currentLine.head) && !(tempSelect===this.currentLine.head)){ //if temp select is OTHER colored point, finish line
                        this.currentLine.addTail(tempSelect);
                        console.log("finish line");
                        this.cursor.currentSquare = null;
                        this.lines.push(this.currentLine);
                        this.currentLine = undefined;
                    }
                    else // add to body
                        if(!tempSelect.hasPoint && !this.checkUsedInLine(tempSelect))
                            this.currentLine.addToBody(tempSelect);
                }
                
            }
            
        }
    }

    drawBoard(): void {
        const { columns, rows } = this.getBoardSize();
        this.squareSize = this.scene.p5.height / 16.15;
        const offsetX = -(columns * this.squareSize) / 2;
        const offsetY = -(rows * this.squareSize) / 2;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const square = this.squares[i][j];
                square.x = offsetX + (j * this.squareSize)+(j*10);
                square.y = offsetY + (i * this.squareSize)+(i*10);
                square.draw();
            }
        }
    }

    generateBoard() {
        this.squares = [];
        this.selectedSquares = [];
        const { columns, rows } = this.getBoardSize();

        for (let i = 0; i < rows; i++) {
            const row: Square[] = [];
            for (let j = 0; j < columns; j++) {
                let square = new Square(this.scene, j * this.squareSize, i * this.squareSize, this.squareSize);
                row.push(square);
            }
            this.squares.push(row);
        }

        // Randomly select squares for points
        this.selectRandomSquares();
    }

    getBoardSize() {
        switch (DrawPuzzle.difficulty) {
            case "easy":
                return { columns: 4, rows: 4 };
            case "normal":
                return { columns: 5, rows: 5 };
            default:
                return { columns: 7, rows: 7 };
        }
    }

    //Helper method to get the square under the mouse position
    getSquareAtMousePosition(mouseX: number, mouseY: number): Square | null {
        // Loop through all squares to find the one under the mouse
        for (let row of this.squares) {
            for (let square of row) {
                const min_x = square.x - this.squareSize / 2;
                const max_x = square.x + this.squareSize / 2;
                const min_y = square.y - this.squareSize / 2;
                const max_y = square.y + this.squareSize / 2;
                if (mouseX > min_x && mouseX < max_x && mouseY > min_y && mouseY < max_y) {
                    return square;
                }
            }
        }
        return null;
    }

    checkWipeLines(check:Square){//clears the line(s) which have the passed square as an endpoint
        if(this.lines.length!=0){
            for(let i = 0; i < this.lines.length; i++){
                if(this.lines[i].isEnd(check)){
                    this.lines[i].clearLine();
                    this.lines = this.lines.filter(item => item !==this.lines[i])
                }
            }
        }
    }
    checkUsedInLine(check:Square):boolean{ // returns false if the square is unused
        if(this.lines.length!=0){
            for(let i = 0; i < this.lines.length; i++){
                if(this.lines[i].inLine(check)){
                    console.log(check)
                    return true;
                }
            }
        }
        return false
    }

    mousePressed(): void {
        this.currentLine?.clearLine();
        const p5 = this.scene.p5;
        const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
        const y = this.scene.p5.mouseY - this.scene.p5.height / 2;
        let found = this.getSquareAtMousePosition(x,y); 
        this.cursor.setSquare(found);
        if(found!=null){
            this.checkWipeLines(found);
            this.currentLine= new SquareLine(found);
        }

    }

}
