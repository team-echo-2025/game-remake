import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import {
  PathCell,
  generateRandomPath,
  buildSolutionGrid,
  scrambleGrid,
  isSolutionPathComplete,
  rotateTile,
  getOpenEdges,
} from "./PathUtils";


export default class PathPuzzle extends Puzzle {
  grid: PathCell[][] = [];
  gridSize: number = 5;
  tileSize: number = 0;
  boardSize: number = 300;

  // The set of cell coordinates (e.g. "0,0") that define the solution path
  solutionSet: Set<string> = new Set();

  async preload(): Promise<void> {}

  setup(): void {
    this.state = PuzzleState.notStarted;
    this.setGridSize();

    // 1) Generate a random path from top-left to bottom-right
    const pathCoords = generateRandomPath(this.gridSize);

    // 2) Store the path in a set for quick lookups
    this.solutionSet.clear();
    pathCoords.forEach(([r, c]) => {
      this.solutionSet.add(`${r},${c}`);
    });

    // 3) Build a solved board
    let solvedBoard = buildSolutionGrid(this.gridSize, pathCoords);

    // 4) Scramble it
    scrambleGrid(solvedBoard);

    // 5) Assign to puzzle
    this.grid = solvedBoard;
    this.tileSize = this.boardSize / this.gridSize;

    // p5 setup
    this.scene.p5.createCanvas(
      this.scene.p5.windowWidth,
      this.scene.p5.windowHeight
    );
    this.scene.p5.rectMode(this.scene.p5.CENTER);
  }

  setDifficulty(difficulty: string): void {
    Puzzle.difficulty = difficulty;
    this.setup();
  }

  setGridSize(): void {
    switch (Puzzle.difficulty) {
      case "easy":
        this.gridSize = 4;
        break;
      case "normal":
        this.gridSize = 5;
        break;
      case "hard":
        this.gridSize = 6;
        break;
      default:
        this.gridSize = 4;
    }
  }

  mousePressed(): void {
    const p5 = this.scene.p5;
    if (this.solved()) {
      this.scene.start(this.scene.name);
      return;
    }

    // Figure out which tile was clicked
    const col = Math.floor(
      (p5.mouseX - p5.width / 2 + this.boardSize / 2) / this.tileSize
    );
    const row = Math.floor(
      (p5.mouseY - p5.height / 2 + this.boardSize / 2) / this.tileSize
    );

    // If it’s in range, rotate that tile
    if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
      rotateTile(this.grid[row][col]);
      if (this.checkWin()) {
        this.state = PuzzleState.completed;
      }
    }
  }

  checkWin(): boolean {
    return isSolutionPathComplete(
      this.grid,
      0,
      0,
      this.gridSize - 1,
      this.gridSize - 1,
      this.solutionSet
    );
  }

  solved(): boolean {
    return this.state === PuzzleState.completed;
  }

  
  solvePuzzle(): void {
    this.state = PuzzleState.completed;
  }


  postDraw(): void {
    // Always draw the board
    this.draw_body();
    this.draw_board();
    this.draw_footer();
    this.draw_header();

    // If solved, show the win message 
    if (this.solved()) {
      this.displayWinMessage();
    }
  }

  draw_body(): void {
    const p5 = this.scene.p5;
    p5.fill(200);
    p5.rect(0, 0, this.boardSize + 20, this.boardSize + 20);
  }

  draw_board(): void {
    const p5 = this.scene.p5;
    const startX = -this.boardSize / 2 + this.tileSize / 2;
    const startY = -this.boardSize / 2 + this.tileSize / 2;

    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        p5.fill(240);
        p5.rect(
          startX + c * this.tileSize,
          startY + r * this.tileSize,
          this.tileSize - 5,
          this.tileSize - 5,
          8
        );

        p5.stroke(0);
        p5.strokeWeight(4);
        const edges = getOpenEdges(this.grid[r][c]);
        const cx = startX + c * this.tileSize;
        const cy = startY + r * this.tileSize;
        const half = (this.tileSize - 5) / 2 - 4;

        if (edges[0]) p5.line(cx, cy, cx, cy - half); // top
        if (edges[1]) p5.line(cx, cy, cx + half, cy); // right
        if (edges[2]) p5.line(cx, cy, cx, cy + half); // bottom
        if (edges[3]) p5.line(cx, cy, cx - half, cy); // left

        p5.noStroke();

        // Draw start marker 
        if (r === 0 && c === 0) {
          p5.fill(0, 200, 0);
          p5.ellipse(cx, cy, this.tileSize / 3);
          p5.fill(255);
          p5.textAlign(p5.CENTER, p5.CENTER);
          p5.textSize(12);
          
        }
        // Draw end marker 
        else if (r === this.gridSize - 1 && c === this.gridSize - 1) {
          p5.fill(200, 0, 0);
          p5.ellipse(cx, cy, this.tileSize / 3);
          p5.fill(255);
          p5.textAlign(p5.CENTER, p5.CENTER);
          p5.textSize(12);
         
        }
      }
    }
  }

  draw_footer(): void {
    const p5 = this.scene.p5;
    p5.fill(50);
    p5.rect(0, this.boardSize / 2 + 40, this.boardSize, 60);
    p5.fill(255);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(16);
    p5.text(
      "Only one unique path connects the green\nand red. Find the right path!",
      0,
      this.boardSize / 2 + 40
    );
  }

  draw_header(): void {
    const p5 = this.scene.p5;
    p5.fill(50);
    p5.rect(0, -this.boardSize / 2 - 40, this.boardSize, 60);
    p5.fill(255);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(20);
    p5.text("Find the Path", 0, -this.boardSize / 2 - 30);
  }

  displayWinMessage(): void {
    const p5 = this.scene.p5;
    const boxWidth = p5.width / 3;
    const boxHeight = p5.height / 6;

    p5.fill(255);
    p5.stroke(0);
    p5.rect(0, 0, boxWidth, boxHeight, 10);

    p5.fill(0);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(28);
    p5.text("Path Complete!", 0, -boxHeight / 8);
    p5.textSize(16);
    p5.text("Click to restart.", 0, boxHeight / 4);
  }
}
