import GameObject from "./GameObject";
import Page from "./Page";
import Scene from "./Scene";
import ButtonTest from "../lib/ui/ButtonTest"
import SceneManager from "./SceneManager";

export enum PuzzleState {
    completed,
    inProgress,
    failed,
    notStarted
}

export default class Puzzle implements GameObject {
    protected _zIndex?: number | undefined = 200;
    hidden?: boolean = false;
    scene!: Scene;
    puzzle!: Page;
    state!: PuzzleState;
    hintButton!: ButtonTest;
    isDisplayingHint = false;
    onCompleted?: () => void;
    onOpen?: () => void;
    x: number = 0;
    y: number = 0;
    asset?: any;
    hide_page: boolean = true;
    static difficulty: string = 'easy';

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


    preload(): any { }

    setup(): void { }

    draw(): void { }

    postDraw(): void { }

    drawHint(): void { }

    setupHint(): void {
        this.hintButton = this.scene.add_new.img_button({
            label: "How to Play",
            font_key: 'jersey',
            callback: () => {
                this.isDisplayingHint = !this.isDisplayingHint;
            },
            imageKey: "test"
        })
        const p = this.scene.p5;
        this.hintButton.x = p.width / 2 - 100;
        this.hintButton.y = p.height / 2 - 50;
    }

    cleanup(): void {
        this.scene.remove(this.hintButton);
        this.hide_page = true;
        this.isDisplayingHint = false;
    }

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
        switch (difficulty) {
            case "easy":
                SceneManager.DURATION = 500;
                break;
            case "normal":
                SceneManager.DURATION = 600;
                break;
            case "hard":
                SceneManager.DURATION = 700;
                break;

        }
    }
}
