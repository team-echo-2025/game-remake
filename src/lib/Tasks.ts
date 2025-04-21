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

    completeTask(new_message: string = "") {
        if (this.state == TaskState.Completed) return;
        this.state = TaskState.Completed;
        this.onComplete && this.onComplete();
        this.message = new_message;
    }

    display(startY: number): number {
        if (!this.message) return startY;
        let height = 20;
        this.scene.p5.push();
        switch (this.state) {
            case TaskState.Completed:
                this.scene.p5.fill(90);
                break;
            case TaskState.NotCompleted:
                this.scene.p5.fill(26, 30, 84);
                break;
        }
        this.scene.p5.textSize(21);
        this.scene.p5.textAlign(this.scene.p5.CENTER);
        let width = this.scene.p5.textWidth(this.message);
        let padding = 60;
        if (this.scene.timer.width < width + padding) {
            this.scene.timer.paddingX = (width + padding) - (this.scene.timer.width - this.scene.timer.paddingX);
        }
        this.scene.p5.text(this.message, this.scene.p5.width / 2 + width / 2 - this.scene.timer.width + padding / 2 - 10, startY + height);
        this.scene.p5.pop();
        return startY + height
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
        const start = -this.scene.p5.height / 2 + 125;
        const p = this.scene.p5;

        p.push();
        p.fill(26, 30, 84);
        p.textSize(21);
        p.textAlign(p.CENTER);
        let completed_tasks = this._counter <= 0;
        let text = completed_tasks ? "No puzzles left." : `Puzzles Left: ${this._counter}`;
        let width = p.textWidth(text);
        p.text(text, p.width / 2 + width / 2 - this.scene.timer.width / 2 - width / 2 - 10, start);
        p.pop();
        if (completed_tasks) {
            this.scene.timer.paddingY = 0;
            return
        }
        let y = start;
        for (const task of this.tasks) {
            y = task.display(y);
        }
        this.scene.timer.paddingY = y - start;
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
        p.fill(26, 30, 84);
        p.textSize(21);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(`Puzzles Left: ${this._counter}`, p.width / 2 - 40, -p.height / 2 + 105);
        p.pop();
    }

    updatePuzzles(puzzle: Puzzle, index: number): void {
        this.puzzles[index] = puzzle;
    }
}
*/
