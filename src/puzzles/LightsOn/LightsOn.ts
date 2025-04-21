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
    lastClicked: Position | null = null; // Track last clicked tile
    //Game references
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
        this.hidden = true;
        this.hide_page = true;
        this.onCompleted && this.onCompleted();
        this.player.disabled = false;
        clearTimeout(this.collider_timeout);
        this.asset.change_asset('blockslide-success');
        this.scene.physics.remove(this.physics_object);
    }

    async preload(): Promise<void> { }

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
                    this.hidden = false;
                    this.highlight = true
                    this.asset.change_asset("blockslide-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.highlight = false;
                    this.hidden = true;
                    this.asset.change_asset(this.asset_key);
                }, 100);
            }
        }
        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x;
        this.asset.y = this.y;
        this.asset.width = 32;
        this.asset.height = 48;
        this.asset.zIndex = 49;
        //Puzzle Setup
        this.state = PuzzleState.notStarted;  // Reset puzzle state to allow a new game
        this.setGridSize();
        this.generateSolvableGrid();
        this.tileSize = this.boardSize / this.gridSize;

        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }


    override setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;  // Update the global difficulty
        this.setup();  // Restart puzzle with new difficulty
    }


    setGridSize(): void {
        switch (Puzzle.difficulty) {
            case "easy":
                this.gridSize = 5;
                break;
            case "normal":
                this.gridSize = 7;
                break;
            case "hard":
                this.gridSize = 9;
                break;
            default:
                this.gridSize = 5;
        }
    }

    override postDraw(): void {
        
        
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return
        if (this.hide_page) return;
        this.draw_body();
        this.draw_board();
        this.draw_footer();
        this.draw_header();
        if (this.isDisplayingHint) {
            this.drawHint();
          }
    }

    draw_body(): void {
        let p5 = this.scene.p5;
        p5.fill(200);
        p5.rect(0, 0, this.boardSize + 20, this.boardSize + 20);
    }

    draw_footer(): void {
        let p5 = this.scene.p5;
        p5.fill(50);
        p5.rect(0, this.boardSize / 2 + 40, this.boardSize, 60);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(16);
        p5.text("Make all tiles white to turn the lights on.\nClick a tile to begin", 0, this.boardSize / 2 + 40);
    }

    draw_header(): void {
        let p5 = this.scene.p5;
        p5.fill(50);
        p5.rect(0, -this.boardSize / 2 - 40, this.boardSize, 60);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(24);
        p5.text("Lights On", 0, -this.boardSize / 2 - 30);
    }

    draw_board(): void {
        let p5 = this.scene.p5;
        let startX = -this.boardSize / 2 + this.tileSize / 2;
        let startY = -this.boardSize / 2 + this.tileSize / 2;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                let isOn = this.grid[row][col];
                p5.fill(isOn ? 255 : 50);
                p5.rect(startX + col * this.tileSize, startY + row * this.tileSize, this.tileSize - 5, this.tileSize - 5, 8);
            }
        }
    }

    generateSolvableGrid(): void {

        this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(false));

        // Apply more random toggles to create a harder starting board
        let numShuffles = this.gridSize * 2; // Increase difficulty by doubling the number of shuffles
        for (let i = 0; i < numShuffles; i++) {
            let row = Math.floor(Math.random() * this.gridSize);
            let col = Math.floor(Math.random() * this.gridSize);
            this.toggleTile(row, col, false); // Apply toggles without checking for a win
        }
    }

    override mousePressed(): void {
        let p5 = this.scene.p5;

        let col = Math.floor((p5.mouseX - p5.width / 2 + this.boardSize / 2) / this.tileSize);
        let row = Math.floor((p5.mouseY - p5.height / 2 + this.boardSize / 2) / this.tileSize);

        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            if (this.lastClicked && this.lastClicked.row === row && this.lastClicked.col === col) {
                return; // Prevent clicking the same tile twice in a row
            }
            this.lastClicked = { row, col };
            this.toggleTile(row, col, true);
        }

    }

    toggleTile(row: number, col: number, checkWin: boolean = true): void {
        let toggle = (r: number, c: number) => {
            if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
                this.grid[r][c] = !this.grid[r][c];
            }
        };

        let toggleRow = Math.random() < 0.5;

        if (toggleRow) {
            for (let c = 0; c < this.gridSize; c++) {
                toggle(row, c);
            }
        } else {
            for (let r = 0; r < this.gridSize; r++) {
                toggle(r, col);
            }
        }

        if (checkWin && this.checkWin()) {
            this.force_solve()
        }
    }
    override keyPressed(e: KeyboardEvent): void {
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return
        if (this.hide_page && this.highlight && e.key == 'e') {
            this.onOpen && this.onOpen();
            this.player.disabled = true;
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
        //Future Implementation???????

         if (this.grid.every(row => row.every(tile => tile))) {
             this.state = PuzzleState.completed;
             this.hidden = true;
             this.onCompleted && this.onCompleted();
             this.player.disabled = false;
             this.scene.physics.remove(this.physics_object);
             clearTimeout(this.collider_timeout);
             this.asset.change_asset('success-puzzle');
             this.cleanup();
             return true;
         }
         return false;
        
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
