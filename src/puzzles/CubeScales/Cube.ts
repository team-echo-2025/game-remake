import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";

export enum CubeState {
    left,
    right,
    unmoved,
    dragged
}

export default class CubeScales implements GameObject {
    weight: number;
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    dragging: boolean;
    state: CubeState;
    scene!: Scene;
    offsetX: number;
    offsetY: number;
    constructor(scene: Scene, x: number, y: number, weight: number) {
        this.state = CubeState.unmoved;
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.scene = scene;
        this.dragging = false;
        this.offsetX =  -this.scene.p5.width / 2;
        this.offsetY =  -this.scene.p5.height / 2;
        this.weight = Math.floor(this.scene.p5.random(1, 10));
    }
    update() {
        // Adjust location if being dragged
        if (this.dragging) {
          this.x = this.scene.p5.mouseX + this.offsetX;
          this.y = this.scene.p5.mouseY + this.offsetY;
        }
        this.postDraw();
    }
    postDraw(): void {
        this.scene.p5.fill(200);
        this.scene.p5.rect(this.x, this.y, this.scene.p5.width / 50)
    }
    preload(): any { }
    setup(): void { }
}
