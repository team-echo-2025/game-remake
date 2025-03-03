import GameObject from "../../lib/GameObject";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import Scene from "../../lib/Scene";



export default class Switches implements GameObject {
    private cols: number; // grid needs to be 17 x 5
    private rows: number;
    private cellWidth: number = 48.53;
    private cellHeight: number = 66; // each box in grid needs to be 48.53 x 66
    scene: Scene;


    private startX: number = -1780; 
    private startY: number = -970;
    private isOn: boolean = false;
    constructor(x: number, y: number){
        this.cols = y;
        this.rows = x;
    }
    toggle(): void {
        this.isOn = !this.isOn;
    }
    draw(): void {
        this.scene.p5.fill()
    }
    
    containsPoint() {}
    isSwitchOn(): boolean {
        return this.isOn;
    }
    preload(): any {}
    setup(): any {}
}