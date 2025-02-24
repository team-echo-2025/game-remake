import { sha } from "bun";
import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";

export enum ShapeState {
    unmoved,
    dragged
}
export enum ShapeType {
    medTriangle,
    largeTriangle,
    smallTriangle,
    square,
    quad
}
export default class DragHandler implements GameObject {
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    dragging: boolean;
    state: ShapeState;
    scene!: Scene;
    offsetX: number;
    offsetY: number;
    shapeType: ShapeType;
    rotation: number; // Rotation angle in radians

    constructor(scene: Scene, x: number, y: number, shapeType: ShapeType) {
        this.state = ShapeState.unmoved;
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.scene = scene;
        this.dragging = false;
        this.offsetX = -this.scene.p5.width / 2;
        this.offsetY = -this.scene.p5.height / 2;
        this.shapeType = shapeType;
        this.rotation = 0; // Default to no rotation
    }

    update() {
        if (this.dragging) {
            this.x = this.scene.p5.mouseX + this.offsetX;
            this.y = this.scene.p5.mouseY + this.offsetY;
        }
        this.draw();
    }

    draw(): void {
        this.scene.p5.push(); // Save the current drawing state
        this.scene.p5.translate(this.x, this.y); // Move the shape's origin to its position
        this.scene.p5.rotate(this.rotation); // Apply rotation

        if (this.shapeType === ShapeType.largeTriangle) {
            this.drawLargeTriangle(0, 0);
        } else if (this.shapeType === ShapeType.medTriangle) {
            this.drawMediumTriangle(0, 0);
        } else if (this.shapeType === ShapeType.smallTriangle) {
            this.drawSmallTriangle(0, 0);
        } else if (this.shapeType === ShapeType.square) {
            this.drawSquare(0, 0);
        } else {
            this.drawParallelogram(0, 0);
        }

        this.scene.p5.pop(); // Restore previous drawing state
    }
    preload(): any { }
    setup(): void { }

    drawParallelogram(x: number, y: number) {
        let base = this.scene.p5.width / 6;
        let height = base / 2;
        this.scene.p5.fill(0, 118, 182);
        this.scene.p5.strokeWeight(2);
        this.scene.p5.stroke(0);
        this.scene.p5.quad(x, y, x + base, y, x + base - 128, y + height, x - 128, y + height);
    }

    drawSquare(x: number, y: number) {
        let size = this.scene.p5.width / 9;
        this.scene.p5.fill(1, 35, 82);
        this.scene.p5.strokeWeight(2);
        this.scene.p5.stroke(0);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        this.scene.p5.rect(0, 0, size + 10, size);
    }

    drawLargeTriangle(x: number, y: number) {
        let size = this.scene.p5.width / 3;
        this.scene.p5.strokeWeight(2);
        this.scene.p5.stroke(0);
        this.scene.p5.fill(163, 13, 45);
        this.scene.p5.triangle(
            x, y,
            x + size, y,
            x + size / 2, y - size / 2
        );
    }

    drawMediumTriangle(x: number, y: number) {
        let base = this.scene.p5.width / 6;
        let height = base * Math.sqrt(2.25) / 3;
        this.scene.p5.strokeWeight(2);
        this.scene.p5.stroke(0);
        this.scene.p5.fill(251, 79, 20);
        this.scene.p5.triangle(
            x, y,
            x + base, y,
            x + base / 2, y - height
        );
    }

    drawSmallTriangle(x: number, y: number) {
        let base = this.scene.p5.width / 4.3;
        let height = base * Math.sqrt(2.2) / 3;
        this.scene.p5.strokeWeight(2);
        this.scene.p5.stroke(0);
        this.scene.p5.fill(18, 87, 64);
        this.scene.p5.triangle(
            x, y,
            x + base, y,
            x + base / 2, y - height
        );
    }

    rotateShape(angle: number) {
        this.rotation += angle;
    }
}