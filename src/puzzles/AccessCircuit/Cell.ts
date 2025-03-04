import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";
import Ball from "./Ball";

export enum CellState {
    CORRECT,
    WRONG_POSITION,
    INCORRECT,
    EMPTY,
    FULL,
}
export default class Cell implements GameObject {
    protected _state: CellState;
    protected _contains: Ball | null = null;
    protected bounding_box: any;
    protected _locked: boolean = true;
    protected scene: Scene;
    x: number;
    y: number;
    circleDiameter: number;
    set locked(locked: boolean) {
        this._locked = locked;
    }
    get locked() {
        return this._locked;
    }
    get contains() {
        return this._contains;
    }
    get state() {
        return this._state;
    }
    set state(state: CellState) {
        this._state = state;
    }
    constructor(scene: Scene, x: number, y: number, circleDiameter: number, cellState?: CellState) {
        this._state = cellState ? cellState : CellState.EMPTY;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.circleDiameter = circleDiameter;
    }

    setup() { }

    preload(): any { }

    draw() {
        this.scene.p5.noFill();
        switch (this.state) {
            case CellState.CORRECT:
                this.scene.p5.stroke(127, 176, 105);
                break;
            case CellState.WRONG_POSITION:
                this.scene.p5.stroke(219, 161, 89);
                break;
            case CellState.INCORRECT:
                this.scene.p5.stroke(191, 26, 47);
                break;
            default:
                if (this.locked) {
                    this.scene.p5.stroke(100);
                } else {
                    this.scene.p5.stroke(200);
                }
                break;
        }
        this.scene.p5.strokeWeight(3);
        this.scene.p5.ellipse(this.x, this.y, this.circleDiameter);
    }

    placeBall(ball: Ball) {
        ball.x = this.x;
        ball.y = this.y;
        ball.cellOfBall = this;
        this._contains = ball;
        this._state = CellState.FULL;
    }

    pickupBall() {
        const temp = this._contains;
        this._contains = null;
        this._state = CellState.EMPTY;
        return temp;
    }
}
