import GameObject from './GameObject';
import Scene from './Scene';
import Puzzle, { PuzzleState } from './Puzzle';

export default class Tasks implements GameObject {
    private scene: Scene;
    private puzzles: Puzzle[];
    private _counter: number;
    private previousStates: Map<Puzzle, PuzzleState>;

    constructor(scene: Scene, ...puzzles: Puzzle[]) {
        this.scene = scene;
        this.puzzles = puzzles;
        this._counter = this.puzzles.length;
        this.previousStates = new Map();

        for (const puzzle of this.puzzles) {
            this.previousStates.set(puzzle, puzzle.state);
        }
    }

    postDraw(): void {
        for (const puzzle of this.puzzles) {
            const prev = this.previousStates.get(puzzle);
            const current = puzzle.state;

            if (prev !== current) {
                this.previousStates.set(puzzle, current);
                if (current === PuzzleState.completed && prev !== PuzzleState.completed) {
                    this._counter = Math.max(0, this._counter - 1);
                }
            }
        }

        const p = this.scene.p5;
        p.push();
        p.fill(255, 0, 0);
        p.textSize(24);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(`Puzzles Left: ${this._counter}`, p.width / 2 - 20, -p.height / 2 + 50);
        p.pop();
    }

    updatePuzzles(puzzle: Puzzle, index: number): void {
        this.puzzles[index] = puzzle;
    }
}
