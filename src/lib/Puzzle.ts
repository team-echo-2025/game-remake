import GameObject from "./GameObject";
import Page from "./Page";
import Scene from "./Scene";

export enum PuzzleState {
    completed,
    inProgress,
    failed,
    notStarted
}

export default class Puzzle implements GameObject {
    scene!: Scene;
    puzzle!: Page;
    state!: PuzzleState;
    static difficulty: string;

    constructor(scene: Scene) {
        this.state = PuzzleState.notStarted;
        this.scene = scene;
    }

    async preload(): Promise<void> { }

    setup(): void { }

    draw(): void { }

    mouseClicked(_: MouseEvent): void { }

    onDestroy(): void { }

    keyPressed(e: KeyboardEvent): void { }

    keyReleased(e: KeyboardEvent): void { }

    checkSolution(args: any): boolean { 
        throw new Error("Not implemented");
    }

    solved(): boolean {
        return this.state == PuzzleState.completed;
    }

    failed(): boolean {
        return this.state == PuzzleState.failed;
    }

    inProgress(): boolean {
        return this.state == PuzzleState.inProgress;
    }

    notStarted(): boolean {
        return this.state == PuzzleState.notStarted;
    }

    setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;
    }
}
