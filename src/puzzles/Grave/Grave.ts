import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Scene from "../../lib/Scene";

class GraveyardPuzzle extends Puzzle {
    private gridSize = { width: 17, height: 5 }; //17x5 graveyard
    private player: Player;
    private correctTombstones: { x: number; y: number }[];
    private firstTombstoneActivated: boolean;
    private secondTombstoneActivated: boolean;
    private attempts: number;
    private playerPosition: { x: number; y: number };

    constructor(scene: Scene, player: Player) {
        super(scene);
        this.player = player;
        this.firstTombstoneActivated = false;
        this.secondTombstoneActivated = false;
        this.attempts = 0;
        this.playerPosition = { x: Math.floor(this.gridSize.width / 2), y: Math.floor(this.gridSize.height / 2) };

        // Select two random correct tombstones
        this.correctTombstones = this.getRandomTombstones();
    }
    // Select two random correct tombstones
    private getRandomTombstones(): { x: number; y: number }[] {
        let tombstones: { x: number; y: number }[] = [];

        while (tombstones.length < 2) {
            let x = Math.floor(Math.random() * this.gridSize.width);
            let y = Math.floor(Math.random() * this.gridSize.height);

            if (!tombstones.some(t => t.x === x && t.y === y)) {
                tombstones.push({ x, y });
            }
        }

        return tombstones;
    }

    // Move the player within the grid
    movePlayer(direction: "up" | "down" | "left" | "right") {
        let { x, y } = this.playerPosition;

        if (direction === "up" && y > 0) y--;
        else if (direction === "down" && y < this.gridSize.height - 1) y++;
        else if (direction === "left" && x > 0) x--;
        else if (direction === "right" && x < this.gridSize.width - 1) x++;

        this.playerPosition = { x, y };
    }

    // Player interacts with a tombstone
    interact() {
        let { x, y } = this.playerPosition;

        if (this.correctTombstones.some(t => t.x === x && t.y === y)) {
        } else {
            this.resetPuzzle();
        }
    }

    // Handle activating the correct tombstones
    private activateTombstone(): string {
        if (!this.firstTombstoneActivated) {
            this.firstTombstoneActivated = true;
            return "You touched the first correct tombstone... a whisper fills the air.";
        } else if (!this.secondTombstoneActivated) {
            this.secondTombstoneActivated = true;
            return "You touched the second correct tombstone... the spirits grant you passage!";
        } else {
            this.resetPuzzle();
            return "A terrible force sweeps through... the puzzle resets.";
        }
    }

    // Reset the puzzle
    private resetPuzzle() {
        this.firstTombstoneActivated = false;
        this.secondTombstoneActivated = false;
        this.attempts++;
        this.correctTombstones = this.getRandomTombstones();
    }

    // Check if the puzzle is solved
    isSolved(): boolean {
        return this.firstTombstoneActivated && this.secondTombstoneActivated;
    }
}

// Initialize game components
const scene = new Scene("Graveyard"); // Provide a name for the scene
const player = new Player(scene); // Pass scene to Player
const puzzle = new GraveyardPuzzle(scene, player);

// Example usage
puzzle.movePlayer("left");
puzzle.interact(); // Interact with a tombstone

puzzle.movePlayer("right");
puzzle.movePlayer("up");
puzzle.interact();
