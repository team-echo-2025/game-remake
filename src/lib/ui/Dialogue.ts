import Scene from "../Scene";
import PhysicsObject from "../physics/PhysicsObject";
import RigidBody from "../physics/RigidBody";
import Player from "../Player";
import { Font } from "p5";

//use physics to display the dialogue as seen in player and the puzzles
//this.onCollide
//or this.body.x .y
export default class Dialogue extends PhysicsObject {
    hidden: boolean = true;
    private scene: Scene;
    printText: boolean = false;
    private collider_timeout: any;
    player: Player;
    dialogues: { x: number; y: number; text: string }[] = [];
    currentText: string = "";
    zIndex: number = 200;
    font!: Font;
    static font_key: string = "courier";
    
    
    constructor(scene: Scene, player: Player) {
        super({ width: 50, height: 50, mass: Infinity });
        this.body.overlaps = true;
        this.scene = scene;
        this.player = player;
        this.font = this.scene.get_asset(Dialogue.font_key);
        if(this.font === undefined){
            console.error("Dialogue font: Courier not loaded in scene");
        }
    }

    setup(): void {
        this.dialogues.forEach(dialogue => {
            const dialogueTrigger = new PhysicsObject({ width: 25, height: 25, mass: Infinity });
            dialogueTrigger.body.x = dialogue.x;
            dialogueTrigger.body.y = dialogue.y;
            dialogueTrigger.overlaps = true;
            dialogueTrigger.onCollide = (other: RigidBody) => {
                if (other === this.player.body) {
                    clearTimeout(this.collider_timeout);
                    this.currentText = dialogue.text;
                    this.printText = true;
                    this.collider_timeout = setTimeout(() => {
                        this.printText = false;
                    }, 3000);  //3 seconds ... obv can be increased for more time
                }
            };
            this.scene.physics.addObject(dialogueTrigger);
        });
    }

    draw(): void {
        //add thought bubble with a background so text doesnt get lost in scene
        //use player offset for position of text
        if (this.printText) {
            this.scene.p5.push();
            this.scene.p5.textFont(this.font);
            this.scene.p5.textSize(10);
            this.scene.p5.fill(255);
            let aWidth = this.scene.p5.textWidth(this.currentText);
            this.scene.p5.rect(this.player.body.x, this.player.body.y - 25, aWidth, 15, 20)
            this.scene.p5.fill(0);
            this.scene.p5.text(this.currentText, this.player.body.x-50, this.player.body.y - 25);
            this.scene.p5.push();
        }
    }

    addDialogue(x: number, y: number, text: string): void {
        this.dialogues.push({ x, y, text });
    }
}
