import { Font } from "p5";
import Scene from "../Scene";
import PhysicsObject from "../physics/PhysicsObject";
import RigidBody from "../physics/RigidBody";
import Player from "../Player";

//use physics to display the dialogue as seen in player and the puzzles
//this.onCollide
//or this.body.x .y
export default class Dialogue extends PhysicsObject {
    hidden: boolean = true;
    private font_size: number = 24;
    private scene: Scene;
    printText: boolean = false;
    private collider_timeout: any;
    player: Player;
    dialogues: { x: number; y: number; text: string }[] = [];
    currentText: string = "";
    
    constructor(scene: Scene, player: Player) {
        super({ width: 50, height: 50, mass: Infinity }); // Adjust collision size
        this.body.overlaps = true;
        this.scene = scene;
        this.player = player;
    }

    setup(): void {
        this.dialogues.forEach(dialogue => {
            const dialogueTrigger = new PhysicsObject({ width: 50, height: 50, mass: Infinity });
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
        if (this.printText) {
            this.scene.p5.fill(0);
            this.scene.p5.textSize(10);
            this.scene.p5.text(this.currentText, this.player.body.x-50, this.player.body.y - 25);
        }
    }

    addDialogue(x: number, y: number, text: string): void {
        this.dialogues.push({ x, y, text });
    }
}
