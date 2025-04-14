import GameObject from './GameObject';
import Scene from './Scene';
export enum TaskState {
    Completed,
    NotCompleted
}
export class Task {
    scene: Scene;
    state: TaskState = TaskState.NotCompleted;
    onComplete?: () => void;
    message?: string;
    constructor(scene: Scene, message?: string) {
        this.scene = scene;
        this.message = message;
    }

    completeTask() {
        if (this.state == TaskState.Completed) return;
        this.state = TaskState.Completed;
        this.onComplete && this.onComplete();
    }

    display(startY: number): number {
        if (!this.message) return startY;
        this.scene.p5.push();
        this.scene.p5.fill(255, 0, 0);
        this.scene.p5.textSize(24);
        this.scene.p5.textAlign(this.scene.p5.RIGHT, this.scene.p5.TOP);
        this.scene.p5.text(this.message, this.scene.p5.width / 2 - 20, startY);
        this.scene.p5.pop();
        return startY + 20;
    }
}

export default class Tasks implements GameObject {
    private scene: Scene;
    private _counter: number;
    private tasks: Task[] = [];

    constructor(scene: Scene, ...tasks: Task[]) {
        this.scene = scene;
        this.tasks = tasks;
        this._counter = this.tasks.length;
        for (const task of this.tasks) {
            task.onComplete = () => { this._counter--; };
        }
    }

    postDraw(): void {
        const start = -this.scene.p5.height / 2 + 50;
        const p = this.scene.p5;
        p.push();
        p.fill(255, 0, 0);
        p.textSize(24);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(`Puzzles Left: ${this._counter}`, p.width / 2 - 20, start);
        p.pop();
        let y = start;
        for (const task of this.tasks) {
            y = task.display(start);
        }
    }
}


/*
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
*/
