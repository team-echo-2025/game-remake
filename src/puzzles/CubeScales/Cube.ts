import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";

export default class CubeScales implements GameObject {
    weight: number;
    x: number;
    y: number;
    scene!: Scene;
    constructor(scene: Scene, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.weight = this.scene.p5.random(1, 10);
    }
    draw(): void {
        console.log("drawing a cube");
        this.scene.p5.fill(200);
        this.scene.p5.noStroke();
        this.scene.p5.rect(this.x, this.y, this.scene.p5.width / 25)
    }
    preload(): any { }
    setup(): void { }
}
