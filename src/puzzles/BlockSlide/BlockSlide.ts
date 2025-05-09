import Puzzle, { PuzzleState } from "../../lib/Puzzle";
//Needed to put into game
import Sprite from "../../lib/Sprite";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Scene from "../../lib/Scene";
import Player from "../../lib/Player";
import Sound from "../../lib/Sound"; // NEW: Import the Sound class

type Position = { row: number; col: number };

export default class BlockSlide extends Puzzle {
    grid: number[][] = [];
    emptyPos: Position = { row: 0, col: 0 }; // The empty tile
    tileSize: number = 0;
    gridSize: number = 4; // Grid will be 4x4 by default
    isAnimating: boolean = false; // Will prevent clicks while animations are going on
    hide_page: boolean = true;
    animations: {
        [key: string]: {
            x: number; y: number;
            startX: number; startY: number;
            targetX: number; targetY: number;
            progress: number;
        }
    } = {};
    //Game references
    physics_object!: PhysicsObject;
    highlight: boolean = false;
    asset_key: string;
    asset!: Sprite;
    player: Player;
    private collider_timeout: any;
    x: number = 0;
    y: number = 0;

    // NEW: Add move sound property
    private moveSound!: Sound;

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
        this.cleanup();
        this.player.disabled = false;
        this.onCompleted && this.onCompleted();
        clearTimeout(this.collider_timeout);
        this.asset.change_asset('blockslide-success');
        this.scene.physics.remove(this.physics_object);

    }

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
                    this.asset.change_asset("blockslide-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.hidden = true;
                    this.highlight = false;
                    this.asset.change_asset("blockslide");
                }, 100);
            }
        }
        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x;
        this.asset.y = this.y;
        this.asset.width = 32;
        this.asset.height = 48;
        this.asset.zIndex = this.zIndex ?? 0;

        // NEW: Initialize the move sound (make sure "clack" is preloaded)
        this.moveSound = this.scene.add_new.sound("clack");

        //puzzle setup
        this.setGridSize();  // Adjusted based on difficulty
        this.generateGrid();
        this.tileSize = this.scene.p5.width / 25; // One 25th the width of screen, change to adjust tile size

        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }

    override keyPressed(e: KeyboardEvent): void {
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return
        if (this.highlight && e.key == 'j') {
            this.force_solve();
        }
        if (this.hide_page && this.highlight && e.key == 'e') {
            this.onOpen && this.onOpen();
            this.hide_page = false;
            this.player.disabled = true;
            this.setupHint();
        }
        if (!this.hide_page && e.key == 'Escape') {
            this.cleanup();
        }
    }

    override postDraw(): void {
        if (this.hide_page || this.state == PuzzleState.completed || this.state == PuzzleState.failed) return
        if (this.hidden) return;

        this.draw_body();
        this.draw_board();
        this.draw_header();
        if (this.isDisplayingHint) this.drawHint();
    }

    generateGrid(): void {
        let numbers = Array.from({ length: this.gridSize ** 2 - 1 }, (_, i) => i + 1);
        numbers.push(0); // Add the empty tile

        do {
            this.shuffle(numbers);
        } while (!this.isSolvable(numbers));

        this.grid = Array.from({ length: this.gridSize }, () => []);

        let index = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = numbers[index++];
            }
        }

        this.emptyPos = this.findEmptyPosition();
    }

    draw_body(): void {
        let rectWidth = this.scene.p5.width / 2.5;
        let rectHeight = this.scene.p5.height / 2;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(0);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
    }

    draw_board(): void {
        let p5 = this.scene.p5;
        let gridSizePixels = this.tileSize * this.gridSize;
        let startX = -gridSizePixels / 2 + this.tileSize / 2;
        let startY = -gridSizePixels / 2 + this.tileSize / 2;

        let animationActive = false;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                let tileValue = this.grid[row]?.[col];
                if (tileValue === 0) continue; // Skip the empty tile

                let key = `${row}-${col}`;
                let anim = this.animations[key];

                let x = startX + col * this.tileSize;
                let y = startY + row * this.tileSize;

                // Applying animation on movement
                if (anim) {
                    anim.progress = Math.min(anim.progress + 0.3, 1);
                    anim.x = anim.startX + (anim.targetX - anim.startX) * anim.progress;
                    anim.y = anim.startY + (anim.targetY - anim.startY) * anim.progress;

                    x = anim.x;
                    y = anim.y;

                    animationActive = true;

                    if (anim.progress >= 1) {
                        delete this.animations[key];

                        // Swap grid values only after animation completes
                        let { row: emptyRow, col: emptyCol } = this.emptyPos;
                        [this.grid[emptyRow][emptyCol], this.grid[row][col]] = [this.grid[row][col], this.grid[emptyRow][emptyCol]];
                        this.emptyPos = { row, col };

                        // When the game is won, set state to completed
                        if (this.checkSolution()) {
                            this.state = PuzzleState.completed;
                        }
                    }
                }

                if (this.isValidMove(row, col)) {
                    p5.fill(150, 200, 255);  // Light blue
                } else {
                    p5.fill(200);  // Grey
                }

                // Draw tile
                p5.rect(x, y, this.tileSize - 5, this.tileSize - 5, 8);

                // Draw tile number
                p5.fill(0);
                p5.textSize(24);
                p5.textAlign(p5.CENTER, p5.CENTER);
                p5.text(tileValue.toString(), x, y);
            }
        }
        this.isAnimating = animationActive;
    }
    override setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;
        //this.setup();  // Restart puzzle
    }

    override drawHint(): void {
        let p5 = this.scene.p5;

        // dimensions
        let footerWidth = p5.width / 2.5;
        let footerHeight = p5.height / 8;

        // Positioning
        let footerX = 0;
        let footerY = this.scene.p5.height / 4 + footerHeight / 2; // Positioned under the body

        // Draw footer background
        p5.fill(0);
        p5.stroke(255);
        p5.rect(footerX, footerY, footerWidth, footerHeight);

        // Add text instructions
        p5.fill(255);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(16);
        p5.text("Place the tiles in the correct positions!", footerX, footerY - footerHeight / 2 + 20);
        p5.text("Click on blue tiles to move them.", footerX, footerY - footerHeight / 2 + 50);
    }

    draw_header() {
        let p5 = this.scene.p5;

        // Dimensions
        let headerWidth = p5.width / 2.5; // Same as body width
        let rectHeight = p5.height / 8; // Body height

        // Positioning: Move the header slightly higher above the body
        let headerX = 0;
        let headerY = -this.scene.p5.height / 3 - -rectHeight / 3;

        // Draw header background
        p5.fill(0);
        p5.stroke(255);
        p5.rect(headerX, headerY, headerWidth, rectHeight);

        // Add text
        p5.fill(255);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(50);
        p5.text("Block Slide", headerX, headerY - rectHeight / 8);
    }

    override mousePressed(): void {
        if (this.hide_page ||
            this.state === PuzzleState.failed ||
            this.state === PuzzleState.completed) {
            return;
        }
        let p5 = this.scene.p5;

        if (this.isAnimating) return;

        // Get the top-left corner of the board
        let gridSizePixels = this.tileSize * this.gridSize;
        let startX = -gridSizePixels / 2;
        let startY = -gridSizePixels / 2;

        // Convert mouse position to grid coordinates to improve accuracy
        let col = Math.floor((p5.mouseX - p5.width / 2 - startX) / this.tileSize);
        let row = Math.floor((p5.mouseY - p5.height / 2 - startY) / this.tileSize);

        // Validate click
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            if (this.isValidMove(row, col)) {
                this.moveTile(row, col);
            }
        }
    }

    isValidMove(row: number, col: number): boolean {
        if (row < 0 || col < 0 || row >= this.gridSize || col >= this.gridSize) {
            return false; // Prevent out-of-bounds errors
        }

        let { row: emptyRow, col: emptyCol } = this.emptyPos;

        return (
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)
        );
    }

    moveTile(row: number, col: number): void {
        if (!this.isValidMove(row, col) || this.isAnimating) return;

        let { row: emptyRow, col: emptyCol } = this.emptyPos;
        let key = `${row}-${col}`;

        // Calculate centered positions for animations
        let startX = (-this.gridSize / 2 + col + 0.5) * this.tileSize;
        let startY = (-this.gridSize / 2 + row + 0.5) * this.tileSize;
        let targetX = (-this.gridSize / 2 + emptyCol + 0.5) * this.tileSize;
        let targetY = (-this.gridSize / 2 + emptyRow + 0.5) * this.tileSize;

        this.isAnimating = true;

        // NEW: Play the clack sound effect when a tile is moved
        this.moveSound.play();

        // Start animation
        this.animations[key] = {
            x: startX, y: startY,
            startX, startY,
            targetX, targetY,
            progress: 0
        };
    }

    // Randomize tile positions
    shuffle(array: number[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Count inversions in the flattened array
    countInversions(array: number[]): number {
        let inversions = 0;
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] > array[j] && array[i] !== 0 && array[j] !== 0) {
                    inversions++;
                }
            }
        }
        return inversions;
    }

    // Check if the puzzle is solvable
    isSolvable(array: number[]): boolean {
        let inversions = this.countInversions(array);
        let emptyRow = Math.floor(array.indexOf(0) / this.gridSize);
        return (inversions + emptyRow) % 2 === 0;
    }


    // Find the empty tile's position
    findEmptyPosition(): Position {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row]?.[col] === 0) {
                    return { row, col };
                }
            }
        }
        return { row: this.gridSize - 1, col: this.gridSize - 1 }; // Default fallback
    }

    override checkSolution(): boolean {
        let correct = 1;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (row === this.gridSize - 1 && col === this.gridSize - 1) {
                    if (this.grid[row][col] === 0) { // Ensure last tile is empty
                        this.state = PuzzleState.completed;
                        this.hidden = true;
                        this.cleanup();
                        this.onCompleted && this.onCompleted();
                        this.player.disabled = false;
                        this.scene.physics.remove(this.physics_object);
                        clearTimeout(this.collider_timeout);
                        this.asset.change_asset('blockslide-success');
                        return true;
                    }
                    return false;
                }
                if (this.grid[row][col] !== correct) {
                    return false;
                }
                correct++;
            }
        }
        this.state = PuzzleState.completed;
        this.hidden = true;
        this.cleanup();
        this.onCompleted && this.onCompleted();
        this.player.disabled = false;
        this.scene.physics.remove(this.physics_object);
        clearTimeout(this.collider_timeout);
        this.asset.change_asset('blockslide-success');
        return true;
    }

    override cleanup() {
        super.cleanup();
        this.player.disabled = false;
        this.hide_page = true;
    }


    // Dynamic grid based on difficulty
    setGridSize(): void {
        switch (Puzzle.difficulty) {
            case "easy":
            case "normal":
            case "hard":
                this.gridSize = 3;
                break;
        }
    }
}
