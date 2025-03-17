import GameObject from "../../../lib/GameObject";
import Scene from "../../../lib/Scene";

export type RGB = Readonly<{
    r: number;
    g: number;
    b: number;
}>
export default class Square implements GameObject {
    scene: Scene;
    x: number;
    y: number;
    size: number;
    dotsize: number = 10;
    hasPoint: boolean = false;
    color: RGB | null = null;

    constructor(scene: Scene, x: number, y: number, size: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    preload(): any { }

    setup(): void { }

    draw(): void {
        const p5 = this.scene.p5;
        p5.push();
        p5.translate(this.x, this.y);
        this.drawSquare();
        p5.pop();
    }

    drawSquare(): void {
        const p5 = this.scene.p5;
        if (this.hasPoint) {
            p5.stroke(0);
            p5.fill(255, 255, 255);
            p5.rect(0, 0, this.size, this.size);
            this.drawCenterPoint();
        }
        else {
            p5.stroke(0);
            if (this.color == null) p5.fill(255, 255, 255);
            else p5.fill(this.color.r, this.color.g, this.color.b)
            p5.rect(0, 0, this.size, this.size);
        }



    }

    drawCenterPoint(): void {
        const p5 = this.scene.p5;
        // for(let i = 1; i < 7; ++i)
        //     p5.fill(i, i * 10, i * 20);
        if (this.color != null)
            p5.fill(this.color.r, this.color.g, this.color.b);
        p5.ellipse(0, 0, 10, 10);
    }

    matchingPoint(rhs: Square): boolean {//used to check if this and rhs are matching endpoints
        if (this.hasPoint && rhs.hasPoint) {
            return this.color == rhs.color;
        }
        return false;
    }
}
