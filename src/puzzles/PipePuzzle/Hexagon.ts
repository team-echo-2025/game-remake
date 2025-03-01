import GameObject from "../../lib/GameObject";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";

type Point = { x:number, y:number};

export default class Hexagon implements GameObject {
    scene: Scene;
    transX!: number;
    transY!: number;
    scale!: number;
    rotation: number;
    hexDraw!: HexagonDraw;

    hexA: Point;
    hexB: Point;
    size: number;
    sideIndexA: number;
    sideIndexB: number;

    constructor(scene: Scene) {
        this.scene = scene;
        this.rotation = 0;

        this.hexA = { x: 100, y: 100 };
        this.hexB = { x: 150, y: 100 };
        this.size = 50;
        this.sideIndexA = 1; // Right side of hexA
        this.sideIndexB = 4; // Left side of hexB
    }

    preload(): any {
        // this.scene.loadImage(); //img path to pipe images points to side 1
        // this.scene.loadImage(); //img path to pipe images points to side 1,2,3
        // this.scene.loadImage(); //img path to pipe images points to side 1,2,4
        // this.scene.loadImage(); //img path to pipe images points to side 2,4
        // this.scene.loadImage(); //img path to pipe images points to side 1,2,3,6
        // this.scene.loadImage(); //img path to pipe images points to side 1,4
        // this.scene.loadImage(); //img path to pipe images points to side 1,3
        // this.scene.loadImage(); //img path to pipe images points to side 1,2
    }

    setup() { }

    draw() {
        this.scene.p5.push();
        this.scene.p5.translate(this.transX, this.transY);
        this.drawHex(0, 0, this.scale, this.rotation, this.size);
        this.scene.p5.pop();
    }
    

    drawHex(x: number, y: number, s: number, rotation: number = 0, size: number = 150) {
        let p = this.scene.p5;
        p.stroke(255);
        p.strokeWeight(5);
        p.fill('rgba(0, 0, 0, 0.25)');
        p.push();
        p.translate(x, y);
        p.rotate(rotation);
        p.scale(s);
        p.beginShape();
        for (let i = 0; i < 6; i++) {
            let angle = p.TWO_PI / 6 * i;
            let xOffset = Math.cos(angle) * size;
            let yOffset = Math.sin(angle) * size;
            p.vertex(xOffset, yOffset);
        }
        p.endShape(p.CLOSE);
        p.pop();
    }

    rotateShape(angle: number) {
        this.rotation += angle;
    }

    getHexCorner(center: Point, size: number, i: number, flatTop: boolean = true): Point {
        const angleDeg = flatTop ? 60 * i : 60 * i - 30;
        const angleRad = (Math.PI / 180) * angleDeg;
        return {
            x: center.x + size * Math.cos(angleRad),
            y: center.y + size * Math.sin(angleRad),
        };
    }

    getHexSide(center: Point, size: number, sideIndex: number, flatTop: boolean = true): [Point, Point] {
        const p1 = this.getHexCorner(center, size, sideIndex, flatTop);
        const p2 = this.getHexCorner(center, size, (sideIndex + 1) % 6, flatTop);
        return [p1, p2];
    }

    pointsAreClose(p1: Point, p2: Point, epsilon: number = 1e-6): boolean {
        return Math.abs(p1.x - p2.x) < epsilon && Math.abs(p1.y - p2.y) < epsilon;
    }

    sidesAreTouching(
        centerA: Point,
        centerB: Point,
        size: number,
        sideIndexA: number,
        sideIndexB: number,
        flatTop: boolean = true,
        epsilon: number = 1e-6
    ): boolean {
        const [a1, a2] = this.getHexSide(centerA, size, sideIndexA, flatTop);
        const [b1, b2] = this.getHexSide(centerB, size, sideIndexB, flatTop);

        return (
            (this.pointsAreClose(a1, b1, epsilon) && this.pointsAreClose(a2, b2, epsilon)) ||
            (this.pointsAreClose(a1, b2, epsilon) && this.pointsAreClose(a2, b1, epsilon))
        );
    }
}

class HexagonDraw extends Hexagon {
    scene: Scene
    constructor(scene: Scene) {
        super(scene);
        this.scene = scene;
    }
    drawHex(){
        this.scene.p5.beginShape();
        this.scene.p5.vertex(-75, -130);
        this.scene.p5.vertex(75, -130);
        this.scene.p5.vertex(150, 0);
        this.scene.p5.vertex(75, 130);
        this.scene.p5.vertex(-75, 130);
        this.scene.p5.vertex(-150, 0);
        this.scene.p5.endShape(this.scene.p5.CLOSE); 
        this.scene.p5.pop();

    }
}

//usage exapmle
// const hexA = { x: 100, y: 100 };
// const hexB = { x: 150, y: 100 };
// const size = 50;
// const sideIndexA = 1; // Right side of hexA
// const sideIndexB = 4; // Left side of hexB

// const touching = sidesAreTouching(hexA, hexB, size, sideIndexA, sideIndexB);
// console.log("Are the sides touching?", touching);


