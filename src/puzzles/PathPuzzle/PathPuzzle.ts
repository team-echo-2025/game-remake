import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import Sprite from "../../lib/Sprite";
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
  // Game references
  physics_object!: PhysicsObject;
  highlight: boolean = false;
  asset_key: string;
  asset!: Sprite;
  player: Player;
  private collider_timeout: any;
  x: number = 0;
  y: number = 0;

  constructor(scene: Scene, puzzle_asset_key: string, player: Player) {
    super(scene);
    this.asset_key = puzzle_asset_key;
    this.hidden = true;
    this.player = player;
  }

  force_solve() {
    this.state = PuzzleState.completed;
    this.hidden = true;
    this.player.disabled = false;
    this.asset.change_asset('success-puzzle');
    this.scene.physics.remove(this.physics_object);
  }

  force_fail() {
    this.state = PuzzleState.failed;
    this.hidden = true;
    this.player.disabled = false;
    this.asset.change_asset('broken-puzzle');
    this.scene.physics.remove(this.physics_object);
  }

  // The set of cell coordinates (e.g. "0,0") that define the solution path
  solutionSet: Set<string> = new Set();

  async preload(): Promise<void> { }

  setup(): void {
    // Putting the puzzle into the game
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
          this.highlight = true;
          this.asset.change_asset("scales-highlight");
        }
        this.collider_timeout = setTimeout(() => {
          this.highlight = false;
          this.asset.change_asset("scales");
        }, 100);
      }
    }
    this.asset = this.scene.add_new.sprite(this.asset_key);
    this.asset.x = this.x;
    this.asset.y = this.y;
    this.asset.width = 24;
    this.asset.height = 36;
    // Puzzle setup
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
        // Puzzle is solved
        this.state = PuzzleState.completed;
        this.hidden = true;
        this.player.disabled = false;
        this.asset.change_asset('success-puzzle');
        this.scene.physics.remove(this.physics_object);
      }
    }
  }

  keyPressed(e: KeyboardEvent): void {
    if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
    if (this.hidden && this.highlight && e.key == 'e') {
      this.player.disabled = true;
      this.hidden = false;
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

  draw() {
    if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
  }

  postDraw(): void {
    this.solved();
    if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
    if (this.hidden) return;
    // Always draw the board
    this.draw_body();
    this.draw_board();
    this.draw_footer();
    this.draw_header();
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
