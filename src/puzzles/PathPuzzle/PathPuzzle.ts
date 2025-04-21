import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import Sprite from "../../lib/Sprite";
import Sound from "../../lib/Sound";

import {
    PathCell,
    generateRandomPath,
    buildSolutionGrid,
    scrambleGrid,
    isSolutionPathComplete,
    findAllPaths,
    findSolutionPath,
    rotateTile,
    getOpenEdges
} from "./PathUtils";

export default class PathPuzzle extends Puzzle {
    grid: PathCell[][] = [];
    gridSize: number = 5;
    tileSize: number = 0;
    boardSize: number = 300;

    physics_object!: PhysicsObject;
    highlight: boolean = false;
    asset_key: string;
    asset!: Sprite;
    player: Player;
    private collider_timeout: any;
    x: number = 0;
    y: number = 0;

    click_sfx!: Sound;

    // Track when puzzle was completed, for the 1-sec pause
    private puzzleCompleteAt: number | null = null;

    // The coordinates that define the intended solution path
    solutionSet: Set<string> = new Set();

    constructor(scene: Scene, puzzle_asset_key: string, player: Player) {
        super(scene);
        this.asset_key = puzzle_asset_key;
        this.hidden = true;
        this.hide_page = true;
        this.player = player;
    }

    force_solve() {
        this.state = PuzzleState.completed;
        this.hidden = true;
        this.hide_page = true;
        this.player.disabled = false;
        this.asset.change_asset('scales-success');
        this.scene.physics.remove(this.physics_object);
    }

    override setup(): void {
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
                    this.hidden = false;
                    this.asset.change_asset("scales-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.highlight = false;
                    this.hidden = true;
                    this.asset.change_asset("scales");
                }, 100);
            }
        };

        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x;
        this.asset.y = this.y;
        this.asset.width = 24;
        this.asset.height = 36;
        this.asset.zIndex = 49;

        this.state = PuzzleState.notStarted;
        this.setGridSize();

        // 1) Generate a random "intended" path
        const pathCoords = generateRandomPath(this.gridSize);

        // 2) Fill the solutionSet
        this.solutionSet.clear();
        pathCoords.forEach(([r, c]) => {
            this.solutionSet.add(`${r},${c}`);
        });

        // 3) Build a solved board for that path
        let solvedBoard = buildSolutionGrid(this.gridSize, pathCoords);

        // 4) Scramble it
        scrambleGrid(solvedBoard);

        // 5) Assign
        this.grid = solvedBoard;
        this.tileSize = this.boardSize / this.gridSize;

        // p5 setup
        this.scene.p5.createCanvas(
            this.scene.p5.windowWidth,
            this.scene.p5.windowHeight
        );
        this.scene.p5.rectMode(this.scene.p5.CENTER);

        this.click_sfx = this.scene.add_new.sound("lightSwitch");
    }

    override setDifficulty(difficulty: string): void {
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

    override mousePressed(): void {
        if (this.hide_page ||
            this.state === PuzzleState.failed ||
            this.state === PuzzleState.completed) {
            return;
        }
        const p5 = this.scene.p5;

        const col = Math.floor(
            (p5.mouseX - p5.width / 2 + this.boardSize / 2) / this.tileSize
        );
        const row = Math.floor(
            (p5.mouseY - p5.height / 2 + this.boardSize / 2) / this.tileSize
        );

        // If in range, rotate that tile
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            rotateTile(this.grid[row][col]);
            if (this.click_sfx && typeof this.click_sfx.play === "function") {
                this.click_sfx.play();
            }

            // Check if puzzle is now solved
            if (this.checkWin()) {
                this.state = PuzzleState.completed;
                this.puzzleCompleteAt = p5.millis();  // record the time we solved it
                this.player.disabled = true;          // prevent movement
                this.asset.change_asset("scales-success");
                clearTimeout(this.collider_timeout);
                // Do NOT hide puzzle yet
            }
        }
    }

    override keyPressed(e: KeyboardEvent): void {
        if (this.state === PuzzleState.completed || this.state === PuzzleState.failed) return;
        if (this.hide_page && this.highlight && e.key === 'e') {
            this.player.disabled = true;
            this.onOpen && this.onOpen();
            this.hide_page = false;
            this.setupHint();
        }
        if (!this.hide_page && e.key == 'Escape') {
            this.cleanup();
            this.player.disabled = false;
            this.hide_page = true;
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

    override solved(): boolean {
        return this.state === PuzzleState.completed;
    }

    override postDraw(): void {
        // Don’t draw if puzzle is hidden or in failed state
        if (this.hide_page) return;
        if (this.state === PuzzleState.failed) return;

        this.draw_body();
        this.draw_board();

        // 1) Get all physical paths from (0,0) to (end)
        const allPaths = findAllPaths(this.grid);

        // 2) See if the solution path is formed
        const solPath = findSolutionPath(this.grid, this.solutionSet);

        if (solPath) {
            // If the correct path exists, draw ONLY it in green
            this.drawPathLine(solPath, "green");
        } else {
            // Otherwise, draw ALL found paths in red
            for (const path of allPaths) {
                this.drawPathLine(path, "red");
            }
        }

        this.draw_footer();
        this.draw_header();
        if (this.isDisplayingHint) {
            this.drawHint();
          }

        // If puzzle completed, handle the 1-second delay
        if (this.state === PuzzleState.completed && this.puzzleCompleteAt) {
            const now = this.scene.p5.millis();
            if (now - this.puzzleCompleteAt > 1000) {
                this.finishPuzzle();
            }
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
                const tileX = startX + c * this.tileSize;
                const tileY = startY + r * this.tileSize;

                // Fill entire square for start (green) or end (red), else normal
                if (r === 0 && c === 0) {
                    p5.fill(0, 200, 0); // green start tile
                } else if (r === this.gridSize - 1 && c === this.gridSize - 1) {
                    p5.fill(200, 0, 0); // red end tile
                } else {
                    p5.fill(240); // normal tile
                }

                p5.rect(
                    tileX,
                    tileY,
                    this.tileSize - 5,
                    this.tileSize - 5,
                    8
                );

                // Draw lines for open edges
                p5.stroke(0);
                p5.strokeWeight(4);
                const edges = getOpenEdges(this.grid[r][c]);
                const half = (this.tileSize - 5) / 2 - 4;

                if (edges[0]) p5.line(tileX, tileY, tileX, tileY - half); // top
                if (edges[1]) p5.line(tileX, tileY, tileX + half, tileY); // right
                if (edges[2]) p5.line(tileX, tileY, tileX, tileY + half); // bottom
                if (edges[3]) p5.line(tileX, tileY, tileX - half, tileY); // left

                p5.noStroke();
            }
        }
    }

    draw_footer(): void {
        const p5 = this.scene.p5;
        const footerHeight = 100;
        const footerY = this.boardSize / 2 + footerHeight / 2 + 10;

        p5.fill(50);
        p5.rect(0, footerY, this.boardSize, footerHeight);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(20);
        p5.text(
            "Click to rotate tiles and find the\n correct path from the green tile\n to the red tile",
            0,
            footerY
        );
    }

    draw_header(): void {
        const p5 = this.scene.p5;
        p5.fill(50);
        p5.rect(0, -this.boardSize / 2 - 40, this.boardSize, 60);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(20);
        p5.text("Find the Path!", 0, -this.boardSize / 2 - 30);
    }

    // Highlight a given path in a chosen color
    private drawPathLine(path: [number, number][], color: string) {
        const p5 = this.scene.p5;
        const startX = -this.boardSize / 2 + this.tileSize / 2;
        const startY = -this.boardSize / 2 + this.tileSize / 2;

        p5.stroke(color);
        p5.strokeWeight(4);

        for (let i = 0; i < path.length - 1; i++) {
            const [r1, c1] = path[i];
            const [r2, c2] = path[i + 1];

            const x1 = startX + c1 * this.tileSize;
            const y1 = startY + r1 * this.tileSize;
            const x2 = startX + c2 * this.tileSize;
            const y2 = startY + r2 * this.tileSize;

            p5.line(x1, y1, x2, y2);
        }

        p5.noStroke();
    }

    // After the 1s delay, finalize and exit the puzzle
    private finishPuzzle(): void {
        this.cleanup();
        this.hide_page = true;
        this.hidden = true;
        this.player.disabled = false;
        this.scene.physics.remove(this.physics_object);
        clearTimeout(this.collider_timeout);

        this.onCompleted && this.onCompleted();

        // Reset timestamp if puzzle re-used
        this.puzzleCompleteAt = null;
    }
    override drawHint(): void {
        const p = this.scene.p5;
        // your original box sizing & position
        const rectWidth  = p.windowHeight/2;
        const rectHeight = p.windowHeight/2 + 60;
        const rectX      = -p.windowWidth/3;
        const rectY      = -50;
    
        p.push();
          // Background
          p.fill(255, 255, 255, 180);
          p.rect(rectX, rectY, rectWidth, rectHeight);
    
          // Title
          p.fill(0);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(32);
          p.text(
            'How To Play',
            -p.windowWidth/3,
            -p.windowHeight/4 - 25
          );
    
          
          p.textSize(20);
          p.textLeading(24);       
          p.textWrap(p.WORD);      
    
          const instr =
            'Click on a tile to rotate it.\n\n There may be multiple paths connecting the green and red tiles.\n\n ' +
            'When a wrong path is found it will highlight in red. When the correct path is found, it will highlight in green';
    
         
          p.text(
            instr,
            -p.windowWidth/3,
            -p.windowHeight/20 + 15,
            rectWidth
          );
        p.pop();
    }
    
}
