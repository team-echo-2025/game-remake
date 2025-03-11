import Puzzle, { PuzzleState } from "../../../lib/Puzzle";
import Scene from "../../../lib/Scene";
import Square from "./Square";

export default class DrawPuzzle extends Puzzle {
    squares: Square[][] = [];
    scene: Scene;
    squareSize: number = 50; // Size of each square
    selectedSquares: Square[] = [];
    totalPoints: number = 6; // Number of points to draw

    constructor(scene: Scene) {
        super(scene);
        this.scene = scene;
    }

    preload(): any {}

    setup(): void {
        this.generateBoard();
    }

    selectRandomSquares(): void {
        const allSquares = this.squares.flat();
        this.selectedSquares = [];

        while (this.selectedSquares.length < this.totalPoints && allSquares.length > 0) {
            const index = Math.floor(Math.random() * allSquares.length);
            const square = allSquares.splice(index, 1)[0];
            square.hasPoint = true;
            this.selectedSquares.push(square);
        }
    }

    draw(): void {
        this.drawBoard();
    }

    drawBoard(): void {
        const { columns, rows } = this.getBoardSize();
        this.squareSize = this.scene.p5.height / 16.15;
        const offsetX = (this.scene.p5.width - columns * this.squareSize) / 10;
        const offsetY = (this.scene.p5.height - rows * this.squareSize) / 10;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const square = this.squares[i][j];
                square.x = offsetX + j * this.squareSize;
                square.y = offsetY + i * this.squareSize;
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
                const square = new Square(this.scene, j * this.squareSize, i * this.squareSize, this.squareSize);
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
}
