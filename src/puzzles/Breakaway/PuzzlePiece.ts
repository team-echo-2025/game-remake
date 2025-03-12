import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";

export default class PuzzlePiece implements GameObject {
    scene: Scene;
    pos: any;
    idealPos: any;
    rot: number;
    targetRot: number;
    idealRot: number;
    color: any;
    isDragging: boolean = false;
    dragOffset: any;
    rotationStep = 90;
    rotationAnimStep = 5;

    constructor(pos: { x: number; y: number }, idealPos: { x: number; y: number }, idealRot: number, color: any, scene: Scene) {
        this.scene = scene;
        this.pos = this.scene.p5.createVector(pos.x, pos.y);
        this.idealPos = this.scene.p5.createVector(idealPos.x, idealPos.y);
        this.rot = 0;
        this.targetRot = 0;
        this.idealRot = idealRot;
        this.color = this.scene.p5.color(color);
        this.dragOffset = this.scene.p5.createVector(0, 0);
    }

    setup(): void { }

    draw(): void {
        this.scene.p5.push();
        this.scene.p5.translate(this.pos.x, this.pos.y);
        this.scene.p5.rotate(this.scene.p5.radians(this.rot));

        this.scene.p5.fill(this.color);
        this.scene.p5.stroke(0);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        this.scene.p5.rect(0, 0, 50, 50);

        this.scene.p5.pop();
    }

    update(): void {
        if (this.rot !== this.targetRot) {
            let diff = (this.targetRot - this.rot + 360) % 360;
            if (diff > 180) {
                let negDiff = 360 - diff;
                this.rot = negDiff < this.rotationAnimStep ? this.targetRot : (this.rot - this.rotationAnimStep + 360) % 360;
            } else {
                this.rot = diff < this.rotationAnimStep ? this.targetRot : (this.rot + this.rotationAnimStep) % 360;
            }
        }
    }

    mousePressed(e: MouseEvent): void {
        let d = this.scene.p5.dist(e.clientX, e.clientY, this.pos.x, this.pos.y);
        if (d < 25) {
            this.isDragging = true;
            this.dragOffset.set(e.clientX - this.pos.x, e.clientY - this.pos.y);
        }
    }

    mouseReleased(): void {
        this.isDragging = false;
    }

    mouseDragged(): void {
        if (this.isDragging) {
            this.pos.set(this.scene.p5.mouseX - this.dragOffset.x, this.scene.p5.mouseY - this.dragOffset.y);
        }
    }

    keyPressed(e: KeyboardEvent): void {
        if (e.key === "z" || e.key === "Z") {
            this.targetRot = (this.targetRot + this.rotationStep) % 360;
        } else if (e.key === "x" || e.key === "X") {
            this.targetRot = (this.targetRot - this.rotationStep + 360) % 360;
        }
    }

    isCorrectlyPlaced(threshold: number = 20, rotationThreshold: number = 30): boolean {
        let d = this.scene.p5.dist(this.pos.x, this.pos.y, this.idealPos.x, this.idealPos.y);
        let angleDiff = Math.abs(this.rot - this.idealRot) % 360;
        if (angleDiff > 180) angleDiff = 360 - angleDiff;

        return d < threshold && angleDiff < rotationThreshold;
    }
}
