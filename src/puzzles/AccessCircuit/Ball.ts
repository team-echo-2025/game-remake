import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";
import Cell from "./Cell";

export default class Ball implements GameObject {
    color: {r:number, g:number, b:number};
    cellOfBall: Cell;
    scene: Scene;
    constructor(color: {r:number, g:number, b:number}, cellOfBall: Cell, scene: Scene) {
        this.color = color;
        this.cellOfBall = cellOfBall;
        this.scene = scene;
    }
    draw(): void {
        this.scene.p5.fill(this.color.r, this.color.g, this.color.b);
        this.scene.p5.noStroke();
        this.scene.p5.circle(this.cellOfBall.x, this.cellOfBall.y, this.cellOfBall.circleDiameter-4) //dynamically done -- originally -8
    }
    preload(): any { }
    setup(): void { }
} 
