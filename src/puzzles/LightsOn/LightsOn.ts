import Puzzle, { PuzzleState } from "../../lib/Puzzle";

type Position = { row: number; col: number };

export default class LightsOn extends Puzzle {
    grid: boolean[][] = [];
    gridSize: number = 5; // 5x5 grid by default
    tileSize: number = 0;
    boardSize: number = 300; 
    lastClicked: Position | null = null; // Track last clicked tile
    
    
    
    async preload(): Promise<void> { }

    setup(): void {
    
        this.state = PuzzleState.notStarted;  // Reset puzzle state to allow a new game
        this.setGridSize();  
        this.generateSolvableGrid();  
        this.tileSize = this.boardSize / this.gridSize;
    
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }
    

    setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;  // Update the global difficulty
        console.log(`Lights On difficulty set to: ${Puzzle.difficulty}`);
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

    draw(): void {
        if (this.solved()) {
            this.displayWinMessage();
        } else {
            this.draw_body();
            this.draw_board();
            this.draw_footer();
            this.draw_header();
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

    mousePressed(): void {
        let p5 = this.scene.p5;
        
        if (this.solved()) {
            this.scene.start(this.scene.name);
            return;
        }
        
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
            this.state = PuzzleState.completed;
        }
    }

    checkWin(): boolean {
        return this.grid.every(row => row.every(tile => tile));
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
}