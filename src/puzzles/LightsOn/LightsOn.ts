import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import Sprite from "../../lib/Sprite";

type Position = { row: number; col: number };

export default class LightsOn extends Puzzle {
    grid: boolean[][] = [];
    gridSize: number = 5; // 5x5 grid by default
    tileSize: number = 0;
    boardSize: number = 300;
    lastClicked: Position | null = null;

    // Win animation timing
    private winAnimationStart: number | null = null;
    private readonly winAnimationDuration = 2000; // milliseconds

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
        this.hide_page = true;
        this.player = player;
    }
    force_solve() {
        this.state = PuzzleState.completed;
        this.cleanup();
        this.hidden = true;
        this.hide_page = true;
        this.player.disabled = false;
        clearTimeout(this.collider_timeout);
        this.asset.change_asset('blockslide-success');
        this.scene.physics.remove(this.physics_object);
    }


    override setup(): void {
        // Reset state and animation
        this.state = PuzzleState.notStarted;
        this.winAnimationStart = null;

        // Physics collider setup
        this.physics_object = new PhysicsObject({ width: 100, height: 100, mass: Infinity });
        this.physics_object.overlaps = true;
        this.physics_object.body.x = this.x;
        this.physics_object.body.y = this.y;
        this.scene.physics.addObject(this.physics_object);
        this.physics_object.onCollide = (other: RigidBody) => {
            if (other === this.player.body) {
                clearTimeout(this.collider_timeout);
                if (!this.highlight) {
                    this.hidden = false;
                    this.highlight = true;
                    this.asset.change_asset(this.asset_key + "-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.highlight = false;
                    this.hide_page = true;
                    this.asset.change_asset(this.asset_key);
                }, 100);
            }
        };

        // Asset sprite
        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x;
        this.asset.y = this.y;
        this.asset.width = 32;
        this.asset.height = 48;
        this.asset.zIndex = 49;

        // Initialize grid
        this.setGridSize();
        this.generateSolvableGrid();
        this.tileSize = this.boardSize / this.gridSize;

        // Canvas
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }

    override setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;
        this.setup();
    }

    setGridSize(): void {
        switch (Puzzle.difficulty) {
            case "easy":   this.gridSize = 5; break;
            case "normal": this.gridSize = 7; break;
            case "hard":   this.gridSize = 9; break;
            default:        this.gridSize = 5;
        }
    }

    override postDraw(): void {
        const p = this.scene.p5;

        // Win animation phase
        if (this.winAnimationStart !== null) {
            const elapsed = p.millis() - this.winAnimationStart;
            // Draw full white board with glow
            this.draw_body();
            this.draw_board(20);
            // Overlay completion text
            p.push();
            p.textAlign(p.CENTER, p.CENTER);
            p.textStyle(p.BOLD);
            p.textSize(48);
            // draw black silhouette for outline
            p.fill(0);
            p.text("Lights On!", 0, 0);
            // draw yellow text on top for fill
            p.fill(255, 255, 0);
            p.text("Lights On!", 0, 0);
            p.pop();
            // After delay, finish puzzle
            if (elapsed >= this.winAnimationDuration) {
                this.force_solve();
            }
            return;
        }

        // Normal rendering
        if (this.state === PuzzleState.completed || this.state === PuzzleState.failed) return;
        if (this.hide_page) return;

        this.draw_body();
        this.draw_board();
        this.draw_footer();
        this.draw_header();

        if (this.isDisplayingHint) this.drawHint();
    }

    private draw_body(): void {
        const p = this.scene.p5;
        p.fill(200);
        p.rect(0, 0, this.boardSize + 20, this.boardSize + 20);
    }

    private draw_board(extraGlow: number = 0): void {
        const p = this.scene.p5;
        const startX = -this.boardSize / 2 + this.tileSize / 2;
        const startY = -this.boardSize / 2 + this.tileSize / 2;
        const glow = extraGlow || (10 + 5 * Math.sin(p.frameCount * 0.1));

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const isOn = this.grid[row][col];
                p.push();
                const x = startX + col * this.tileSize;
                const y = startY + row * this.tileSize;
                if (isOn && extraGlow > 0) {
                    p.drawingContext.shadowBlur = glow;
                    p.drawingContext.shadowColor = "rgba(255,255,200,0.8)";
                }
                p.noStroke();
                p.fill(isOn ? 255 : 50);
                p.rect(x, y, this.tileSize - 5, this.tileSize - 5, 8);
                p.drawingContext.shadowBlur = 0;
                p.pop();
            }
        }
    }

    private draw_footer(): void {
        const p = this.scene.p5;
        p.fill(50);
        p.rect(0, this.boardSize / 2 + 40, this.boardSize, 60);
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text("Make all tiles white to turn the lights on.\nClick a tile to begin", 0, this.boardSize / 2 + 40);
    }

    private draw_header(): void {
        const p = this.scene.p5;
        p.fill(50);
        p.rect(0, -this.boardSize / 2 - 40, this.boardSize, 60);
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(24);
        p.text("Lights On", 0, -this.boardSize / 2 - 30);
    }

    private generateSolvableGrid(): void {
        this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(false));
        const numShuffles = this.gridSize * 2;
        for (let i = 0; i < numShuffles; i++) {
            const row = Math.floor(Math.random() * this.gridSize);
            const col = Math.floor(Math.random() * this.gridSize);
            this.toggleTileInternal(row, col);
        }
    }

    override mousePressed(): void {
        const p = this.scene.p5;
        const col = Math.floor((p.mouseX - p.width / 2 + this.boardSize / 2) / this.tileSize);
        const row = Math.floor((p.mouseY - p.height / 2 + this.boardSize / 2) / this.tileSize);
        if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) return;
        // Prevent clicking same tile twice
        if (this.lastClicked && this.lastClicked.row === row && this.lastClicked.col === col) return;
        this.lastClicked = { row, col };
        this.toggleTileInternal(row, col);
        if (this.grid.every(r => r.every(tile => tile))) {
            this.winAnimationStart = this.scene.p5.millis();
        }
    }

    private toggleTileInternal(row: number, col: number): void {
        const toggle = (r: number, c: number) => {
            if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
                this.grid[r][c] = !this.grid[r][c];
            }
        };
        const toggleRow = Math.random() < 0.5;
        if (toggleRow) {
            for (let c = 0; c < this.gridSize; c++) toggle(row, c);
        } else {
            for (let r = 0; r < this.gridSize; r++) toggle(r, col);
        }
    }

    private toggleTile(row: number, col: number, checkWin: boolean = true): void {
        this.toggleTileInternal(row, col);
        if (checkWin && this.grid.every(r => r.every(tile => tile))) {
            this.winAnimationStart = this.scene.p5.millis();
        }
    }

    override keyPressed(e: KeyboardEvent): void {
        if (this.hide_page && this.highlight && e.key === 'e') {
            this.onOpen && this.onOpen();
            this.player.disabled = true;
            this.hide_page = false;
            this.setupHint();
        }
        if (!this.hide_page && e.key === 'Escape') {
            this.cleanup();
            this.player.disabled = false;
            this.hide_page = true;
        }
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
    
          // Body text
          p.textSize(20);
          p.textLeading(24);       
          p.textWrap(p.WORD);     
    
          const instr =
            'Click on a tile to begin. When a tile is clicked, every tile in the same row, or column will flip.\n\n' +
            'The same tile can not be clicked twice in a row.\n\n Make all tiles white to turn the lights on ';
    
          
          p.text(
            instr,
            -p.windowWidth/3,
            -p.windowHeight/20 + 15,
            rectWidth
          );
        p.pop();
    }
}
