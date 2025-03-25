
import Scene from "../../lib/Scene";
import Square from "./Square";

export default class SquareLine {
    scene: Scene;
    lastAdded: Square;
    head: Square;
    tail?: Square;
    body: Square [] = [];

    constructor(head:Square){
        this.head = head;
        this.scene = head.scene;
        this.lastAdded = head;
    }
    addHead(nHead:Square){
        this.head = nHead;
    }
    addToBody(nBody:Square){
        if(!this.body.includes(nBody)){
            this.body.push(nBody);
            this.lastAdded = nBody;
            console.log(this.lastAdded);
        }

        else{
            //console.log("already in line body", nBody)
        }
    }
    addTail(nTail:Square){
        this.tail = nTail;
    }
    clearLine(){
        for(let square of this.body){
            square.color = null;
        }
        this.body.splice(0,this.body.length)
    }
    isEnd(check:Square):boolean{
        if(check===this.head)return true;
        if(check===this.tail)return true;
        return false;
    }
    inLine(check:Square):boolean{
        if(check===this.head)       return true;
        if(check===this.tail)           return true;
        if(this.body.includes(check))   return true;
        return false;
    }
    draw(){
        const p5 = this.scene.p5;
        if(this.head.color!=null && this.tail?.color!=null){
            p5.stroke(this.head.color.r, this.head.color.g, this.head.color.b); // Red color for the box
            p5.noFill();
            p5.strokeWeight(5); // Set stroke weight for the box
            p5.rect(
                this.head.x,
                this.head.y,
                this.head.size,
                this.head.size
            );

            p5.stroke(this.tail.color.r, this.tail.color.g, this.tail.color.b); // Red color for the box
            p5.noFill();
            p5.strokeWeight(5); // Set stroke weight for the box
            p5.rect(
                this.tail.x,
                this.tail.y,
                this.tail.size,
                this.tail.size
            );
        }

    }
}