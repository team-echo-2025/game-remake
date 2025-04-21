import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import Square, { RGB } from "./Square";
import Cursor from "./Cursor";
import SquareLine from "./SquareLine";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import Sprite from "../../lib/Sprite";
import Player from "../../lib/Player";
import RigidBody from "../../lib/physics/RigidBody";
import Sound from "../../lib/Sound";

export default class DrawPuzzle extends Puzzle {
    squares: Square[][] = [];
    scene: Scene;
    squareSize: number = 50; // Size of each square
    selectedSquares: Square[] = [];
    totalPairs!: number; // Number of points to draw
    colors: RGB[] = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 50, g: 255, b: 255 },
        { r: 255, g: 13, b: 255 },
        { r: 56, g: 61, b: 119 },
        { r: 88, g: 224, b: 158 }
    ];
    cursor: Cursor;
    lines: SquareLine[] = [];
    currentLine?: SquareLine;
    //Game references
    physics_object!: PhysicsObject;
    highlight: boolean = false;
    asset_key: string;
    asset!: Sprite;
    player: Player;
    private collider_timeout: any;
    x: number = 0;
    y: number = 0;

    click_sfx!: Sound;
    draw_sfx!: Sound;

    constructor(scene: Scene, puzzle_asset_key: string, player: Player) {
        super(scene);
        this.scene = scene;
        this.cursor = new Cursor(scene);
        this.state = PuzzleState.notStarted;
        this.asset_key = puzzle_asset_key;
        this.player = player;
        this.hide_page = true;
        this.hidden = true;
    }
    force_solve() {
        this.state = PuzzleState.completed;
        this.hidden = true;
        this.hide_page = true;
        this.player.disabled = false;
        this.asset.change_asset('drawPuzzle-success');
        this.scene.physics.remove(this.physics_object);
    }
    //dot positions (0,0 is top left)
    //right now all puzzle sets have the same number of flows as rows and columns because of the solution check implementation
    //5x5
    //[(0,0)(0,4)]/[(2,0)(1,3)]/[(2,1)(2,4)]/[(4,0)(3,3)]/[(3,4)(4,1)]
    //i/j/k/l
    easyPuzzleSets: number[][][][] = [//this is not as insane as it appears 
        //i indexes sets of point pairs
        //j indexes point pairs
        //k indexes the points in the pairs
        //l 0=x 1=y
        //i = 0 [j=0[k=0[x,y],[x,y]],   [[],[]] ]
        // [ [[0,0],[1,4]], [[2,0],[1,3]], [[2,1],[2,4]], [[4,0],[3,3]], [[3,4],[4,1]] ],
        // [ [[0,0],[2,1]], [[1,1],[2,2]], [[0,1],[4,0]], [[0,4],[3,4]], [[4,4],[4,1]] ],
        // [ [[3,3],[2,2]], [[2,4],[0,0]], [[3,0],[3,4]], [[2,0],[3,1]], [[0,1],[1,4]] ],
        [[[0, 3], [3, 4]], [[0, 0], [1, 3]], [[1, 0], [3, 1]], [[4, 4], [2, 3]], [[2, 2], [2, 0]]]
    ]
    //6x6
    //[ [[0,0],[0,4]], [[0,5],[1,0]], [[2,0],[2,2]], [[2,3],[4,0]], [[2,4],[4,1]], [[5,0],[2,5]] ]
    normalPuzzleSets: number[][][][] = [
        [[[0, 0], [0, 4]], [[0, 5], [1, 0]], [[2, 0], [2, 2]], [[2, 3], [4, 0]], [[2, 4], [4, 1]], [[5, 0], [2, 5]]],
        [[[1, 1], [3, 3]], [[5, 5], [5, 3]], [[2, 5], [5, 2]], [[5, 1], [1, 5]], [[2, 1], [2, 3]], [[3, 2], [4, 1]]],
        [[[3, 5], [4, 3]], [[5, 5], [5, 3]], [[0, 0], [2, 2]], [[1, 4], [5, 2]], [[2, 1], [4, 2]], [[3, 2], [3, 4]]],
        [[[1, 1], [3, 2]], [[1, 2], [3, 3]], [[0, 0], [3, 5]], [[0, 1], [4, 4]], [[4, 1], [4, 3]], [[0, 4], [2, 5]]]
    ]
    //7x7
    //[[6,1],[4,5)],[[3,3],[2,4]],[[6,0],[5,6]],[[1,2],[5,1]],[[4,3],[6,6]],[[5,5],[4,4]]
    hardPuzzleSets: number[][][][] = [
        [[[2, 3], [4, 5]], [[3, 3], [2, 4]], [[6, 0], [5, 6]], [[1, 2], [5, 1]], [[4, 3], [6, 6]], [[5, 5], [4, 4]], [[2, 2], [6, 1]]],
        [[[1, 1], [3, 2]], [[1, 2], [3, 3]], [[0, 0], [3, 5]], [[0, 1], [4, 4]], [[4, 1], [4, 3]], [[0, 4], [2, 5]], [[0, 6], [6, 0]]],
        [[[5, 5], [5, 1]], [[1, 1], [3, 1]], [[0, 5], [3, 4]], [[0, 1], [4, 3]], [[4, 1], [1, 3]], [[0, 2], [1, 5]], [[2, 5], [3, 3]]],
        [[[1, 1], [3, 2]], [[1, 2], [3, 3]], [[0, 0], [3, 5]], [[0, 1], [4, 4]], [[4, 1], [4, 3]], [[0, 4], [2, 6]], [[3, 6], [6, 0]]]
    ]


    override setup(): void {
        //putting into game itself
        this.physics_object = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        });
        this.physics_object.overlaps = true;
        this.physics_object.body.x = this.x;
        this.physics_object.body.y = this.y;
        this.scene.physics.addObject(this.physics_object);
        this.physics_object.onCollide = (other: RigidBody) => {
            if (other == this.player.body) {
                clearTimeout(this.collider_timeout);
                if (!this.highlight) {
                    this.highlight = true
                    this.hidden = false;
                    this.asset.change_asset("drawPuzzle-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.highlight = false;
                    this.hidden = true;
                    this.asset.change_asset("drawPuzzle");
                }, 100);
            }
        }
        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x;
        this.asset.y = this.y;
        this.asset.width = 24;
        this.asset.height = 36;
        this.asset.zIndex = 49;
        //setting up puzzle
        this.generateBoard();
        this.getBoardSize();
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);

        this.click_sfx = this.scene.add_new.sound("lightSwitch");
        this.draw_sfx = this.scene.add_new.sound("draw");
    }

    override postDraw(): void {
        if (this.hide_page || this.state == PuzzleState.completed || this.state == PuzzleState.failed) return
        this.checkSolution();
        this.drawBody();
        // this.generateBoard();
        this.drawBoard();
        this.cursor.draw();
        if (this.lines.length != 0) {
            for (let i = 0; i < this.lines.length; i++) {
                this.lines[i].draw();
            }
        }
        const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
        const y = this.scene.p5.mouseY - this.scene.p5.height / 2

        if (this.cursor.validLineStart()) { //check if the stored square has a dot
            let tempSelect = this.getSquareAtMousePosition(x, y); // null or a square at mouse position
            if (this.currentLine != null && tempSelect != null && this.cursor.currentSquare != null && this.isAdjacent(this.currentLine.lastAdded, tempSelect)) {

                if (this.currentLine) { //prove is defined
                    if (tempSelect.matchingPoint(this.currentLine.head) && !(tempSelect === this.currentLine.head)) { //if temp select is OTHER same colored point, finish line
                        this.currentLine.addTail(tempSelect);
                        this.cursor.currentSquare = null;
                        this.lines.push(this.currentLine);
                        this.currentLine = undefined;
                    }
                    else // try  add to body
                        if (!tempSelect.hasPoint && !this.checkUsedInLine(tempSelect)) {
                            this.currentLine.addToBody(tempSelect);
                            tempSelect.color = this.cursor.currentSquare.color;
                            if (this.draw_sfx && typeof this.draw_sfx.play === "function") {
                                this.draw_sfx.play();
                            } //recolor
                        }

                }

            }

        }
    }

    selectSolvableSquares(): void {
        let pointSet: number[][][];
        let firstX: number;
        let firstY: number;
        let secondX: number;
        let secondY: number;
        let flipped: boolean = false;
        if (Math.random() < 0.5) {
            flipped = true;
        }
        switch (DrawPuzzle.difficulty) {
            case "easy":
                pointSet = this.easyPuzzleSets[Math.floor(Math.random() * this.easyPuzzleSets.length)];
                for (let i = 0; i < pointSet.length; i++) {// i indexes point pairs
                    let first = pointSet[i][0];
                    let second = pointSet[i][1];
                    if (flipped) {
                        firstX = this.getBoardSize().columns - first[0] - 1;
                        firstY = this.getBoardSize().rows - first[1] - 1;
                        secondX = this.getBoardSize().columns - second[0] - 1;
                        secondY = this.getBoardSize().rows - second[1] - 1;
                    }
                    else {
                        firstX = first[0];
                        firstY = first[1];
                        secondX = second[0];
                        secondY = second[1];
                    }
                    const square1 = this.squares[firstX][firstY];
                    const square2 = this.squares[secondX][secondY];
                    square1.hasPoint = true;
                    square1.color = this.colors[i];
                    square2.hasPoint = true;
                    square2.color = this.colors[i];
                }
                //this.selectRandomSquares();
                break;
            case "normal":
                pointSet = this.normalPuzzleSets[Math.floor(Math.random() * this.normalPuzzleSets.length)];

                for (let i = 0; i < pointSet.length; i++) {// i indexes point pairs
                    let first = pointSet[i][0];
                    let second = pointSet[i][1];
                    if (flipped) {
                        firstX = this.getBoardSize().columns - first[0] - 1;
                        firstY = this.getBoardSize().rows - first[1] - 1;
                        secondX = this.getBoardSize().columns - second[0] - 1;
                        secondY = this.getBoardSize().rows - second[1] - 1;
                    }
                    else {
                        firstX = first[0];
                        firstY = first[1];
                        secondX = second[0];
                        secondY = second[1];
                    }
                    const square1 = this.squares[firstX][firstY];
                    const square2 = this.squares[secondX][secondY];
                    square1.hasPoint = true;
                    square1.color = this.colors[i];
                    square2.hasPoint = true;
                    square2.color = this.colors[i];
                }
                //this.selectRandomSquares();
                break;
            case "hard":
                pointSet = this.hardPuzzleSets[Math.floor(Math.random() * this.hardPuzzleSets.length)];

                for (let i = 0; i < pointSet.length; i++) {// i indexes point pairs
                    let first = pointSet[i][0];
                    let second = pointSet[i][1];
                    if (flipped) {
                        firstX = this.getBoardSize().columns - first[0] - 1;
                        firstY = this.getBoardSize().rows - first[1] - 1;
                        secondX = this.getBoardSize().columns - second[0] - 1;
                        secondY = this.getBoardSize().rows - second[1] - 1;
                    }
                    else {
                        firstX = first[0];
                        firstY = first[1];
                        secondX = second[0];
                        secondY = second[1];
                    }
                    const square1 = this.squares[firstX][firstY];
                    const square2 = this.squares[secondX][secondY];
                    square1.hasPoint = true;
                    square1.color = this.colors[i];
                    square2.hasPoint = true;
                    square2.color = this.colors[i];
                }
                //this.selectRandomSquares();
                break;
            default:
                pointSet = this.easyPuzzleSets[Math.floor(Math.random() * this.easyPuzzleSets.length)];

                for (let i = 0; i < pointSet.length; i++) {// i indexes point pairs
                    let first = pointSet[i][0];
                    let second = pointSet[i][1];
                    if (flipped) {
                        firstX = this.getBoardSize().columns - first[0] - 1;
                        firstY = this.getBoardSize().rows - first[1] - 1;
                        secondX = this.getBoardSize().columns - second[0] - 1;
                        secondY = this.getBoardSize().rows - second[1] - 1;
                    }
                    else {
                        firstX = first[0];
                        firstY = first[1];
                        secondX = second[0];
                        secondY = second[1];
                    }
                    const square1 = this.squares[firstX][firstY];
                    const square2 = this.squares[secondX][secondY];
                    square1.hasPoint = true;
                    square1.color = this.colors[i];
                    square2.hasPoint = true;
                    square2.color = this.colors[i];
                }
                //this.selectRandomSquares();
                break;
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

            // Check if a path can be found to a second square
            let pairFound = false;
            for (let i = 0; i < 10; i++) { // Try up to 10 different attempts for solvable pairs
                const secondIndex = Math.floor(Math.random() * allSquares.length);
                const secondSquare = allSquares[secondIndex];

                // Ensure second square is not the same and it's solvable
                if (square !== secondSquare) {
                    const path = this.getConnectedPath(square, secondSquare);
                    if (path) {
                        secondSquare.hasPoint = true;
                        secondSquare.color = this.colors[colorIndex];
                        square.color = this.colors[colorIndex];
                        this.selectedSquares.push(square, secondSquare);
                        colorIndex = (colorIndex + 1) % this.colors.length;
                        pairFound = true;
                        break;
                    }
                }
            }

            if (!pairFound) {
                // If no valid pair is found, retry the process
                allSquares.push(square);
            }
        }
        // Reset selected squares if they were not successfully paired
        this.selectedSquares = this.selectedSquares.filter(square => square.hasPoint);
    }

    drawBody(): void {
        let rectWidth = this.scene.p5.width / 1.3;
        let rectHeight = this.scene.p5.height / 1.1;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(255, 182, 193);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
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
        let p5 = this.scene.p5;
        p5.fill(0);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize((24 + 32) / 2);
        p5.text("Connect the matching colored dots!", 0, offsetY + rows / this.squareSize - 50);
        p5.text("How To Play:", -(p5.windowWidth / 3 - 150), -(offsetY + rows * this.squareSize + 50));
        p5.text("Create a line by dragging from one colored ", -(p5.windowWidth / 3 - 150), -(offsetY + rows * this.squareSize - 80));
        p5.text("dot to the corresponding colored dot ", -(p5.windowWidth / 3 - 150), -(offsetY + rows * this.squareSize - 100));
        p5.text("Rules:", (p5.windowWidth / 3 - 150), -(offsetY + rows * this.squareSize + 50));
        p5.text("1. You can only create a line", (p5.windowWidth / 3 - 150), -(offsetY + rows * this.squareSize - 80));
        p5.text("   between horizontal and vertical squares", (p5.windowWidth / 3 - 150), -(offsetY + rows * this.squareSize - 100));
        p5.text("2. All squares must be filled", (p5.windowWidth / 3 - 150), -(offsetY + rows * this.squareSize - 140));
    }
    override keyPressed(e: KeyboardEvent): void {
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return
        if (this.hide_page && this.highlight && e.key == 'e') {
            this.onOpen && this.onOpen();
            this.player.disabled = true;
            this.hide_page = false;
        }
        if (!this.hide_page && e.key == 'Escape') {
            this.cleanup();
            this.player.disabled = false;
            this.hide_page = true;
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
        //this.selectRandomSquares();
        this.selectSolvableSquares();
    }

    getBoardSize() {
        switch (DrawPuzzle.difficulty) {
            case "easy":
                this.totalPairs = 5
                return this.totalPairs, { columns: 5, rows: 5 };
            case "normal":
                this.totalPairs = 6
                return this.totalPairs, { columns: 6, rows: 6 };
            case "hard":
                this.totalPairs = 7
                return this.totalPairs, { columns: 7, rows: 7 };
            default:
                this.totalPairs = 5
                return this.totalPairs, { columns: 5, rows: 5 };
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

    getAdjacentSquares(selected: Square): Square[] {
        let adjacencies: Square[] = [];
        let realSquare: Square;

        const p5 = this.scene.p5;
        const mx = selected.x;
        const my = selected.y;

        let temp: Square | null = this.getSquareAtMousePosition(mx - this.squareSize, my); //left check
        if (temp != null) {
            realSquare = temp;
            adjacencies.push(realSquare);
        }

        temp = (this.getSquareAtMousePosition(mx + this.squareSize, my));//right check
        if (temp != null) {
            realSquare = temp;
            adjacencies.push(realSquare);
        }

        temp = this.getSquareAtMousePosition(mx, my - this.squareSize);//up check
        if (temp != null) {
            realSquare = temp;
            adjacencies.push(realSquare);
        }

        temp = this.getSquareAtMousePosition(mx, my + this.squareSize); //down check
        if (temp != null) {
            realSquare = temp;
            adjacencies.push(realSquare);
        }

        return adjacencies;
    }

    isAdjacent(lineTip: Square, nSquare: Square): boolean {
        let adjacencies: Square[] = this.getAdjacentSquares(lineTip);
        return adjacencies.includes(nSquare);
    }

    checkWipeLines(check: Square) {//clears the line(s) which have the passed square as an endpoint
        if (this.lines.length != 0) {
            for (let i = 0; i < this.lines.length; i++) {
                if (this.lines[i].isEnd(check)) {
                    this.lines[i].clearLine();
                    this.lines = this.lines.filter(item => item !== this.lines[i])
                    i--;
                }
            }
        }
    }

    checkUsedInLine(check: Square): boolean { // returns false if the square is unused
        if (this.lines.length != 0) {
            for (let i = 0; i < this.lines.length; i++) {
                if (this.lines[i].inLine(check)) {
                    return true;
                }
            }
        }
        return false
    }

    override mousePressed(): void {
        if (this.hide_page ||
            this.state === PuzzleState.failed ||
            this.state === PuzzleState.completed) {
            return;
        }
        if (this.click_sfx && typeof this.click_sfx.play == "function") {
            this.click_sfx.play();
        }
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
    override checkSolution(): boolean {
        //get all 
        this.getBoardSize(); // find num pairs
        let found = false;
        let colRow = this.getBoardSize(); //get column & rows
        if (this.totalPairs == this.lines.length) {
            for (let i = 0; i < colRow.columns; ++i)
                for (let j = 0; j < colRow.rows; ++j)
                    if (this.squares[i][j].color == null)
                        return false;
            this.state = PuzzleState.completed;
            this.hide_page = true;
            this.onCompleted && this.onCompleted();
            this.player.disabled = false;
            this.scene.physics.remove(this.physics_object);
            clearTimeout(this.collider_timeout);
            this.asset.change_asset('drawPuzzle-success');
            return true;
        }
        return false;

    }


    getConnectedPath(start: Square, end: Square): Square[] | null {
        const queue: Square[] = [start];
        const visited: Set<Square> = new Set();
        const parentMap: Map<Square, Square | null> = new Map();

        visited.add(start);
        parentMap.set(start, null);

        // BFS traversal to find a path
        while (queue.length > 0) {
            const current = queue.shift()!;

            if (current === end) {
                // Reconstruct the path
                const path: Square[] = [];
                let currentSquare: Square | null = end;
                while (currentSquare !== null) {
                    path.unshift(currentSquare);
                    currentSquare = parentMap.get(currentSquare) || null;
                }
                return path;
            }

            // Get adjacent squares
            const adjacencies = this.getAdjacentSquares(current);
            for (const neighbor of adjacencies) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    parentMap.set(neighbor, current);
                }
            }
        }

        return null;  // No path found
    }

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

    override setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;
        this.squares = [];
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].clearLine();
            this.lines = this.lines.filter(item => item !== this.lines[i])
            i--
        }
        this.setup();  // Restart puzzle with new difficulty
    }

}
