import Scene from "../../lib/Scene";
import Ball from "./Ball";
import Cell, { CellState } from "./Cell";

type BallProps = Readonly<{
    color: { r: number, g: number, b: number },
}>
export default class DispenserCell extends Cell {
    ballProps: BallProps;
    constructor(ballProps: BallProps, scene: Scene, x: number, y: number, circleDiameter: number, cellState?: CellState) {
        super(scene, x, y, circleDiameter, cellState)
        this.ballProps = ballProps;
    }
    draw() {
        this.scene.p5.noFill();
        this.scene.p5.stroke(200);
        this.scene.p5.strokeWeight(3);
        this.scene.p5.rect(this.x, this.y + 10, this.circleDiameter + 15, this.circleDiameter + 30, 10);
        this.scene.p5.noStroke();
        this.scene.p5.ellipse(this.x, this.y, this.circleDiameter);
        this.contains?.draw();
    }
    pickupBall() {
        const temp = this._contains;
        this._contains = null;
        this._state = CellState.EMPTY;
        return temp;
    }
    dispenseBall() {
        if (this.contains) {
            throw new Error("Cannot dispense ball because it already exists.");
        }
        this._contains = new Ball(this.ballProps.color, this, this.scene);
        this._state = CellState.FULL;
    }
}
