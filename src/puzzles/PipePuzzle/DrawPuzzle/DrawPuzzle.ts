import Puzzle, { PuzzleState } from "../../../lib/Puzzle";
import Scene from "../../../lib/Scene";
import Square, { RGB } from "./Square";
import Cursor from "./Cursor";
import SquareLine from "./SquareLine";


export default class DrawPuzzle extends Puzzle {
    squares: Square[][] = [];
    scene: Scene;
    squareSize: number = 50; // Size of each square
    selectedSquares: Square[] = [];
    totalPairs!: number; // Number of points to draw
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
        this.state = PuzzleState.notStarted;
    }

    preload(): any { }

    setup(): void {
        this.generateBoard();
        this.getBoardSize();
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }
    


    draw(): void {
        // this.generateBoard();
        if (this.checkSolution())
            if (this.solved())
                this.displayWinMessage();
        this.drawBoard();
        this.cursor.draw();
        if (this.lines.length != 0) {
            for (let i = 0; i < this.lines.length; i++) {
                this.lines[i].draw();
            }
        }
        const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
        const y = this.scene.p5.mouseY - this.scene.p5.height / 2

        if(this.cursor.validLineStart()){ //check if the stored square has a dot
            let tempSelect = this.getSquareAtMousePosition(x,y); // null or a square at mouse position
            if(this.currentLine!=null && tempSelect != null && this.cursor.currentSquare != null){ 

                if(this.currentLine){ //prove is defined
                    if(tempSelect.matchingPoint(this.currentLine.head) && !(tempSelect===this.currentLine.head)){ //if temp select is OTHER same colored point, finish line
                        this.currentLine.addTail(tempSelect);
                        console.log("finish line");
                        this.cursor.currentSquare = null;
                        this.lines.push(this.currentLine);
                        this.currentLine = undefined;
                    }
                    else // try  add to body
                        if(!tempSelect.hasPoint && !this.checkUsedInLine(tempSelect)){
                            if(this.isAdjacent(this.currentLine.lastAdded,tempSelect)){
                                console.log("adjacency");
                                this.currentLine.addToBody(tempSelect);
                                tempSelect.color=this.cursor.currentSquare.color; //recolor
                            }
                        }
                        console.log("edge case ff")    
                }

            }

        }
    }

    selectRandomSquares(): void {
        this.getBoardSize();
        const allSquares = this.squares.flat();
        this.selectedSquares = [];
        let colorIndex = 0;

        while (this.selectedSquares.length < this.totalPairs * 2 && allSquares.length > 0) {
            const index = Math.floor(Math.random() * allSquares.length);
            const square = allSquares.splice(index, 1)[0];
            square.hasPoint = true;
            //console.log(Math.floor(this.selectedSquares.length/2));
            square.color = this.colors[colorIndex]; //changes dot color every two dots
            this.selectedSquares.push(square);
            if (this.selectedSquares.length % 2 == 0) colorIndex++;
        }
        this.selectedSquares = [];
    }

    drawBoard(): void {
        const { columns, rows } = this.getBoardSize();
        this.squareSize = this.scene.p5.height / 16.15;
        const offsetX = -(columns * this.squareSize) / 2;
        const offsetY = -(rows * this.squareSize) / 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const square = this.squares[i][j];
                square.x = offsetX + (j * this.squareSize) + (j * 10);
                square.y = offsetY + (i * this.squareSize) + (i * 10);
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
                this.totalPairs = 2
                return this.totalPairs, { columns: 4, rows: 4 };
            case "normal":
                this.totalPairs = 3
                return this.totalPairs, { columns: 5, rows: 5 };
            case "hard":
                this.totalPairs = 4
                return this.totalPairs, { columns: 7, rows: 7 };
            default:
                this.totalPairs = 2
                return this.totalPairs, { columns: 4, rows: 4 };
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
                    console.log(square)
                    return square;
                }
            }
        }
        return null;
    }

    getAdjacentSquares(selected:Square):Square[]{
        let adjacencies:Square[] = [];
        let realSquare:Square;
        
        const p5 = this.scene.p5;
        const mx = selected.x;
        const my = selected.y;

        let temp:Square|null = this.getSquareAtMousePosition(mx - this.squareSize, my); //left check
        //console.log("getAdjacentSquares()", temp)
        if(temp!=null){
            realSquare = temp;
            adjacencies.push(realSquare);
        }
            
        temp = (this.getSquareAtMousePosition(mx + this.squareSize, my));//right check
        //console.log("getAdjacentSquares()", temp)
        if(temp!=null){
            realSquare = temp;
            adjacencies.push(realSquare);
        }

        temp = this.getSquareAtMousePosition(mx, my - this.squareSize);//up check
        //console.log("getAdjacentSquares()", temp)
        if(temp!=null){
            realSquare = temp;
            adjacencies.push(realSquare);
        }

        temp = this.getSquareAtMousePosition(mx, my + this.squareSize); //down check
        if(temp!=null){
            realSquare = temp;
            adjacencies.push(realSquare);
        }

        return adjacencies;
    }

    isAdjacent(lineTip:Square, nSquare:Square):boolean{
        let adjacencies:Square[] = this.getAdjacentSquares(lineTip);
        console.log(adjacencies);
        return adjacencies.includes(nSquare);
    }

    checkWipeLines(check:Square){//clears the line(s) which have the passed square as an endpoint
        if(this.lines.length!=0){
            for(let i = 0; i < this.lines.length; i++){
                if(this.lines[i].isEnd(check)){
                    this.lines[i].clearLine();
                    this.lines = this.lines.filter(item => item !==this.lines[i])
                    i--;
                }
            }
        }
    }

    checkUsedInLine(check: Square): boolean { // returns false if the square is unused
        if (this.lines.length != 0) {
            for (let i = 0; i < this.lines.length; i++) {
                if (this.lines[i].inLine(check)) {
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
        let found = this.getSquareAtMousePosition(x, y);
        this.cursor.setSquare(found);
        if (found != null) {
            this.checkWipeLines(found);
            this.currentLine = new SquareLine(found);
        }

    }
    checkSolution(): boolean {
        //get all 
        this.getBoardSize(); // find num pairs
        let found = false;
        let colRow = this.getBoardSize(); //get column & rows
        if (this.totalPairs == this.lines.length){
            for (let i = 0; i < colRow.columns; ++i)
                for (let j = 0; j < colRow.rows; ++j)
                    if (this.squares[i][j].color == null)
                        return false;
            this.state = PuzzleState.completed
            return true;
        }
        return false;
       
    }
    //changing color variable names to colored

    displayWinMessage(): void {
        let p5 = this.scene.p5;

        p5.fill(0, 0, 0, 150);
        p5.rect(0, 0, p5.width, p5.height);

        let boxWidth = p5.width / 3;
        let boxHeight = p5.height / 6;
        p5.fill(255);
        p5.stroke(0);
        p5.rect(0, 0, boxWidth, boxHeight, 10);

        p5.fill(0);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(32);
        p5.text("You Win!", 0, -boxHeight / 8);
        p5.textSize(16);
        p5.text("Click to continue.", 0, boxHeight / 4);
    }

    setDifficulty(difficulty: string): void {
        console.log(`Line Puzzle difficulty set to: ${Puzzle.difficulty}`);
        Puzzle.difficulty = difficulty;
        this.squares = [];
        for(let i = 0; i < this.lines.length; i++){
                this.lines[i].clearLine();
                this.lines = this.lines.filter(item => item !==this.lines[i])
                i--
        }
        this.setup();  // Restart puzzle with new difficulty
    }
}
