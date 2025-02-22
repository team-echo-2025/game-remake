import Puzzle from "../../lib/Puzzle";
import Cell, { CellState } from "./Cell";
import Ball from "./Ball";
import DispenserCell from "./DispenserCell";
type RGB = Readonly<{
    r: number;
    g: number;
    b: number;
}>
export default class AccessCircuit extends Puzzle {
    zIndex = 1000;
    board: Cell[][] = [];
    colors: RGB[] = [
        { r: 0, g: 76, b: 84 },
        { r: 79, g: 38, b: 131 },
        { r: 1, g: 35, b: 82 },
        { r: 56, g: 6, b: 189 },
    ]
    balls: Ball[] = [];
    solution: RGB[] = [];
    dispenserCells: DispenserCell[] = [];
    dragging: Ball | null = null;
    current_row = 0;
    boardCircleDiameter = 0;
    dispensersWidth = 0;
    dispenserDiameter = 0;
    checkSolution(): boolean {
        for (let row of this.board) {
            let rowIsCorrect = true;

            for (let currentCell of row) {
                if (currentCell.state !== CellState.CORRECT) {
                    rowIsCorrect = false;
                    break;
                }
            }
            if (rowIsCorrect) {
                return true;
            }
        }

        return false;
    }
    preload(): any { }
    setup(): void {
        this.generateSolution();
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        //Making Cells
        this.setupBoard();
        this.setupFooter();
    }
    draw() {
        // draw puzzle
        this.draw_header();
        this.draw_body();
        this.draw_footer();
        for (let ball of this.balls) {
            ball.draw();
        }
        if (this.dragging) {
            const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
            const y = this.scene.p5.mouseY - this.scene.p5.height / 2;
            this.dragging.x = x;
            this.dragging.y = y;
            this.dragging.draw();
        }
    }
    mousePressed() {
        const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
        const y = this.scene.p5.mouseY - this.scene.p5.height / 2;
        for (let cell of this.dispenserCells) {
            const radius = cell.circleDiameter / 2
            if (cell.x - radius < x && cell.x + radius > x && cell.y - radius < y && cell.y + radius > y) {
                this.dragging = cell.pickupBall();
            }
        }
    }
    setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;
        console.log(`Access Circuit: Difficulty changed to ${Puzzle.difficulty}`);
        this.setup();  // Restart puzzle
    }

    checkRow() {
        for (let i = 0; i < this.board[this.current_row].length; i++) {
            if (this.board[this.current_row][i].state == CellState.EMPTY) {
                return;
            }
        }
        this.current_row++;
        if (this.current_row >= this.board.length) {
            return
        }
        for (let i = 0; i < this.board[this.current_row].length; i++) {
            this.board[this.current_row][i].locked = false;
        }
    }

    mouseReleased() {
        const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
        const y = this.scene.p5.mouseY - this.scene.p5.height / 2;
        let found = false;
        if (this.dragging) {
            if (this.current_row < this.board.length) {
                const row = this.board[this.current_row];
                for (let i = 0; i < row.length; i++) {
                    const cell = row[i];
                    const radius = cell.circleDiameter / 2
                    if (cell.state == CellState.EMPTY
                        && !cell.locked
                        && cell.x - radius < x
                        && cell.x + radius > x
                        && cell.y - radius < y
                        && cell.y + radius > y) {
                        if (this.dragging.cellOfBall instanceof DispenserCell) {
                            this.dragging.cellOfBall.dispenseBall();
                        }
                        cell.placeBall(this.dragging);
                        if (this.dragging.color == this.solution[i]) {
                            cell.state = CellState.CORRECT;
                            //} else if (this.solution.some(item => item == this.dragging?.color)) {
                        } else {
                            let solution_count = 0;
                            let filled_positions = 0;
                            for (let i = 0; i < row.length; i++) {
                                if (this.dragging.color == this.solution[i]) {
                                    solution_count++;
                                }
                                if (this.dragging.color == row[i].contains?.color) {
                                    filled_positions++;
                                }
                            }
                            console.log(filled_positions, solution_count)
                            if (solution_count > 0 && filled_positions <= solution_count) {
                                cell.state = CellState.WRONG_POSITION;
                            } else {
                                cell.state = CellState.INCORRECT;
                            }
                        }
                        this.balls.push(this.dragging);
                        found = true;
                        this.checkRow();
                        break;
                    }
                }
            }
            if (!found) {
                this.dragging.cellOfBall.placeBall(this.dragging);
            }
            this.dragging = null;
        }
    }

    draw_header() {
        let p5 = this.scene.p5;

        // Dimensions
        let headerWidth = p5.width / 3; // Same as body width
        let rectHeight = p5.height / 2; // Body height
        let headerHeight = rectHeight / 4; // 1/4 of body height

        // Positioning: Move the header slightly higher above the body
        let headerX = 0;
        let headerY = -this.scene.p5.height / 3 - -headerHeight / 3;

        // Draw header background
        p5.fill(0);
        p5.stroke(255);
        p5.rect(headerX, headerY, headerWidth, headerHeight);

        // Add text
        p5.fill(255);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(50);
        p5.text("Access Circuit", headerX, headerY - headerHeight / 8);


    }
    draw_body() {
        let rectWidth = this.scene.p5.width / 3;
        let rectHeight = this.scene.p5.height / 2;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(0);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
        this.draw_board();
    }
    draw_board() {
        const size = this.getBoardSize();
        let columns = size!.columns;
        let rows = size!.rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                this.board[i][j].draw();
            }
        }
    }
    draw_footer() {
        let p5 = this.scene.p5;

        // dimensions
        let footerWidth = p5.width / 3;
        let footerHeight = p5.height * 0.2;

        // Positioning
        let footerX = 0;
        let footerY = this.scene.p5.height / 4 + footerHeight / 2; // Positioned under the body

        // Draw footer background
        p5.fill(0);
        p5.stroke(255);
        p5.rect(footerX, footerY, footerWidth, footerHeight);
        //Box 2
        p5.fill(200);
        p5.noStroke();
        p5.rect(footerX, footerY + this.dispenserDiameter / 2 + 8, this.dispensersWidth, this.dispenserDiameter, 6);

        // p5.fill(255);
        // p5.stroke(0,0,255);
        // p5.rect(footerX, footerY*.6, footerWidth*4, footerHeight/3);

        for (let cell of this.dispenserCells) {
            cell.draw();
        }

        // Add text instructions
        p5.fill(255);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(16);
        p5.text("Drag a ball from here into the board!", footerX, footerY - footerHeight / 2 + 20);

    }
    setupFooter() {
        let p5 = this.scene.p5;
        let footerWidth = p5.width / 3;
        let footerHeight = p5.height * 0.2;

        // Positioning
        let footerX = 0;
        let footerY = this.scene.p5.height / 4 + footerHeight / 2;

        let paddingX = 10;
        let marginX = 5;
        //let circleDiameter = footerWidth / (this.colors.length) - paddingX * this.colors.length / 2 - marginX / this.colors.length;
        let circleDiameter = this.boardCircleDiameter;
        if (circleDiameter > footerHeight / 3) {
            circleDiameter = footerHeight / 3;
        }

        this.dispenserCells = [];

        const colors = [...this.colors];
        const length = colors.length;
        let width = colors.length * (circleDiameter + marginX / this.colors.length) + colors.length * paddingX * 2;
        if (width >= footerWidth) {
            circleDiameter = footerWidth / (this.colors.length) - paddingX * this.colors.length / 2 - marginX / this.colors.length;
            if (circleDiameter > footerHeight / 3) {
                circleDiameter = footerHeight / 3;
            }
            width = colors.length * (circleDiameter + marginX / this.colors.length) + colors.length * paddingX * 2;

        }
        let startX = footerX - width / 2 + circleDiameter / 2 + paddingX + marginX / 2;
        let startY = footerY - circleDiameter / 2;
        this.dispensersWidth = width;
        this.dispenserDiameter = circleDiameter;
        for (let i = 0; i < length; i++) {
            let x = startX + i * (circleDiameter + paddingX * 2);
            let y = startY;

            let randColorIndex = Math.floor(Math.random() * colors.length);
            let color = colors[randColorIndex];
            colors.splice(randColorIndex, 1); // Remove used color

            let cell = new DispenserCell({ color: color }, this.scene, x, y, circleDiameter);
            cell.dispenseBall();
            this.dispenserCells.push(cell);
        }
    }

    setupBoard() {
        const size = this.getBoardSize();
        let columns = size!.columns;
        let rows = size!.rows;

        let rectWidth = this.scene.p5.width / 3;
        let rectHeight = this.scene.p5.height / 1.8;
        let rectX = 0;
        let rectY = 0;

        let circleDiameter = rectWidth / (columns + 1) * 0.4;
        this.boardCircleDiameter = circleDiameter;
        let paddingX = rectWidth / (columns + 1);
        let paddingY = rectHeight / (rows + 1);

        let startX = rectX - rectWidth / 2 + paddingX;
        let startY = rectY - rectHeight / 2 + paddingY;

        this.board = Array.from({ length: rows }, () => Array(columns).fill(null));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let x = startX + j * paddingX;
                let y = startY + i * paddingY;
                const cell = new Cell(this.scene, x, y, circleDiameter);
                this.board[i][j] = cell
                cell.locked = true;
            }
        }
        for (let i = 0; i < columns; i++) {
            this.board[0][i].locked = false;
        }
    }
    getBoardSize() {
        switch (AccessCircuit.difficulty) {
            case "easy":
                return { columns: 2, rows: 3 };
            case "normal":
                return { columns: 3, rows: 4 };
            default:
                return { columns: 5, rows: 4 };
        }
    }
    generateSolution() {
        const size = this.getBoardSize();
        const columns = size.columns;
        const colors = [...this.colors, ...this.colors];
        for (let i = 0; i < columns; ++i) {
            let randColorIndex = Math.floor(Math.random() * colors.length);
            let color = colors[randColorIndex];
            colors.splice(randColorIndex, 1); // Remove used color
            this.solution.push(color);
        }
    }
}
