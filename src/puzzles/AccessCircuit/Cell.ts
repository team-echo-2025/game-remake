import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";
import Ball from "./Ball";

export enum CellState {
    CORRECT,
    WRONG_POSITION,
    INCORRECT,
    EMPTY,
    OPEN,
}
export default class Cell implements GameObject {
    state: CellState;
    contains: Ball | null = null;
    bounding_box: any;
    scene: Scene;
    x: number;
    y: number;
    circleDiameter: number;
    constructor(scene: Scene, x: number, y: number , circleDiameter: number) {
        this.state = CellState.OPEN;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.circleDiameter = circleDiameter;
    }
    setup(){
        
    }
    preload(): any {
        
    }
    draw(){
        this.scene.p5.noFill();
        this.scene.p5.stroke(100);
        this.scene.p5.strokeWeight(3);
        this.scene.p5.ellipse(this.x, this.y, this.circleDiameter);
    }
}
