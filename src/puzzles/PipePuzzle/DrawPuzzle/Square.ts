import GameObject from "../../../lib/GameObject";
import Scene from "../../../lib/Scene";

export default class Square implements GameObject {
    scene: Scene;
    x: number;
    y: number;
    size: number;
    hasPoint: boolean = false;

    constructor(scene: Scene, x: number, y: number, size: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    preload(): any {}

    setup(): void {}

    draw(): void {
        const p5 = this.scene.p5;
        p5.push();
        p5.translate(this.x, this.y);
        this.drawSquare();
        p5.pop();
    }

    drawSquare(): void {
        const p5 = this.scene.p5;
        p5.stroke(0);
        p5.noFill();
        p5.rect(0, 0, this.size, this.size);

        if (this.hasPoint) {
            this.drawCenterPoint();
        }
    }

    drawCenterPoint(): void {
        const p5 = this.scene.p5;
        // for(let i = 1; i < 7; ++i)
        //     p5.fill(i, i * 10, i * 20);
        p5.fill(0);
        p5.ellipse(this.size / 2, this.size / 2, 10, 10);
        //rn dots are drawn in the bottom right corner, needs fixed
    }
}
