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
    protected _zIndex?: number | undefined = 1000;
    hidden?: boolean = false;
    scene!: Scene;
    puzzle!: Page;
    state!: PuzzleState;
    onCompleted?: () => void;
    onOpen?: () => void;
    static difficulty: string;

    constructor(scene: Scene) {
        this.state = PuzzleState.notStarted;
        this.scene = scene;
    }

    set zIndex(n: number) {
        this._zIndex = n;
        this.scene.update_zindex();
    }

    get zIndex(): number | undefined {
        return this._zIndex;
    }


    async preload(): Promise<void> { }

    setup(): void { }

    draw(): void { }

    postDraw(): void { }

    mouseClicked(_: MouseEvent): void { }

    onDestroy(): void { }
    mousePressed(e: MouseEvent): void { }
    mouseReleased(e: MouseEvent): void { }

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
