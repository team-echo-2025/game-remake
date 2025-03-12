import Scene from "../../../lib/Scene";
import Square from "./Square"; // Assuming you have the Square class in this location

export default class Cursor {
    scene: Scene; // Reference to the scene
    currentSquare: Square | null = null; // Track the square under the cursor
    active: boolean = false;

    constructor(scene: Scene) {
        this.scene = scene;
    }


    draw(): void {
        if (this.currentSquare) {
            const p5 = this.scene.p5;
            if(!this.currentSquare.hasPoint){
                p5.stroke(255, 25, 0); // Red color for the box
                p5.noFill();
                p5.strokeWeight(3); // Set stroke weight for the box
                p5.rect(
                    this.currentSquare.x,
                    this.currentSquare.y,
                    this.currentSquare.size,
                    this.currentSquare.size
                );
            }
            else if(this.currentSquare.color){
                p5.stroke(this.currentSquare.color.r, this.currentSquare.color.g, this.currentSquare.color.b); // Red color for the box
                p5.noFill();
                p5.strokeWeight(3); // Set stroke weight for the box
                p5.rect(
                    this.currentSquare.x,
                    this.currentSquare.y,
                    this.currentSquare.size,
                    this.currentSquare.size
                );
            }
            
        }
    }
    setSquare(nSquare: Square|null):void{
        if(nSquare == null) this.active=false;
        else this.active=true;
        this.currentSquare = nSquare;
    }
    validLineStart():boolean{
        if(this.currentSquare != null && this.currentSquare.hasPoint == true){
            return true;
        }
        return false;
    }
}