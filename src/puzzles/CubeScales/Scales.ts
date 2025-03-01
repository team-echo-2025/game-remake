import GameObject from "../../lib/GameObject";
import Scene from "../../lib/Scene";
import Cube, { CubeState } from "./Cube";

export enum ScalesState {
    leanLeft,
    leanRight,
    balanced,
    start // Need to distinguish starting balanced position from solved balanced position
}

export default class CubeScales implements GameObject {
    leftWeight: number;
    rightWeight: number;
    state: ScalesState;
    scene!: Scene;
    baseY: number = 200; // Pivot
    tiltAngle: number = 0;
    constructor(scene: Scene) {
        this.state = ScalesState.start;
        this.scene = scene;
        this.leftWeight = 0;
        this.rightWeight = 0;
    }
    updateWeights(cubes: Cube[]) {
        this.leftWeight = 0;
        this.rightWeight = 0;

        for (let cube of cubes) {
            if (cube.state == CubeState.left) this.leftWeight += cube.weight;
            if (cube.state == CubeState.right) this.rightWeight += cube.weight;
        }
        console.log("Left: " + this.leftWeight + " Right: " + this.rightWeight);

        if (this.leftWeight > this.rightWeight) {
            this.state = ScalesState.leanLeft;
        } else if (this.rightWeight > this.leftWeight) {
            this.state = ScalesState.leanRight;
        } else {
            this.state = ScalesState.balanced; // Victory condition
        }

        let maxTilt = 15;
        let weightDifference = this.leftWeight - this.rightWeight;
        this.tiltAngle = this.scene.p5.map(weightDifference, -20, 20, maxTilt, -maxTilt, true);
    }
    draw(): void {
        let p5 = this.scene.p5;
        
        p5.fill(100);
        p5.rect(0, this.baseY - 80, 10, 20); // Pivot beam
        
        p5.push();
        p5.translate(0, this.baseY);
        p5.rotate(p5.radians(this.tiltAngle));
    
        let beamWidth = 250;
        let beamHeight = 20;
        let squareSize = 30;
        
        p5.fill(150);
        p5.rect(0, -100, beamWidth, beamHeight, 10); // Scales
        
        let topLeftX = 15 - beamWidth / 2;
        let topLeftY = -85 - beamHeight / 2;
        
        p5.fill(50);
        p5.rect(topLeftX, topLeftY - squareSize, squareSize, squareSize); // Left container

        let topRightX = 235 - beamWidth / 2;
        let topRightY = -85 - beamHeight / 2;
        
        p5.fill(50);
        p5.rect(topRightX, topRightY - squareSize, squareSize, squareSize); // Right container
    
        p5.pop();
    }
    preload(): any { }
    setup(): void { }
}
