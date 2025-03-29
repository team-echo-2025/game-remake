// import GameObject from "../../lib/GameObject";
// import Scene from "../../lib/Scene";

// export default class Switches implements GameObject {
//     cols: number; // grid needs to be 17 x 5
//     rows: number;
//     boxWidth: number = 48.53;
//     boxHeight: number = 66; // each box in grid needs to be 48.53 x 66

//     startX: number = -1780; 
//     startY: number = -970;
//     isOn: boolean = false;
    
//     scene: Scene;
//     constructor(scene: Scene){
//         this.cols = this.startY;
//         this.rows = this.startX;
//         this.scene = scene;
//     }
//     draw(): void {
//         this.scene.p5.noStroke();
//         this.scene.p5.rect(this.rows, this.cols, this.boxWidth, this.boxHeight);
//     }
//     toggle(): void {
//         this.isOn = !this.isOn;
//     }
   
//     containsPoint(px: number, py: number): boolean {
//         return px >= this.rows && px <= this.rows + this.boxWidth && py >= this.cols && py <= this.cols + this.boxHeight;
//     }
//     isSwitchOn(): boolean {
//         return this.isOn;
//     }
//     preload(): any {}
//     setup(): any {}
// }