import Scene from "../Scene";
import PhysicsObject from "../physics/PhysicsObject";
import RigidBody from "../physics/RigidBody";
import Player from "../Player";
import { Font } from "p5";

export default class Dialogue extends PhysicsObject {
    hidden: boolean = true;
    private scene: Scene;
    printText: boolean = false;
    writing: boolean = false; //when true text should not be redrawn
    private collider_timeout: any;
    private write_interval: any;
    player: Player;
    dialogues: { x: number; y: number; text: string, width: number, height: number}[] = [];
    currentText: string = "";
    dialogue_index: number = 0;
    fullText: string = "";
    zIndex: number = 200;
    font!: Font;
    static font_key: string = "jersey";

    constructor(scene: Scene, player: Player) {
        super({ width: 50, height: 50, mass: Infinity });
        this.body.overlaps = true;
        this.scene = scene;
        this.player = player;
        this.font = this.scene.get_asset(Dialogue.font_key);
    }

    setup(): void {
        this.dialogues.forEach(dialogue => {
            const dialogueTrigger = new PhysicsObject({ width: dialogue.width, height: dialogue.height, mass: Infinity });
            dialogueTrigger.body.x = dialogue.x;
            dialogueTrigger.body.y = dialogue.y;
            dialogueTrigger.overlaps = true;
            dialogueTrigger.onCollide = (other: RigidBody) => {
                if (other === this.player.body) {
                    if (this.fullText != dialogue.text) {
                        clearTimeout(this.collider_timeout);
                        this.fullText = dialogue.text;
                        this.printText = true;
                        this.startTypeWriterEffect(this.fullText);
                    }

                }
            };
            this.scene.physics.addObject(dialogueTrigger);
        });
    }

    draw(): void {
        if (this.printText) {
            this.scene.p5.push();
            this.scene.p5.fill(255);
            this.scene.p5.textSize(10);
            const width = this.scene.p5.textWidth(this.currentText);
            this.scene.p5.rectMode(this.scene.p5.CENTER)
            this.scene.p5.rect(this.player.body.x, this.player.body.y - 25, width + 10, 15, 20)
            this.scene.p5.fill(0);
            this.scene.p5.text(this.currentText, this.player.body.x - width / 2, this.player.body.y - 25);
            this.scene.p5.pop();
        }
    }

    addDialogue(x: number, y: number, text: string, width? : number, height? : number): void {
        this.dialogues.push({ x, y, text, width : width ?? 25, height: height??25 });
    }
    startTypeWriterEffect(text: string): void {
        this.writing = true;
        this.dialogue_index = 0;
        this.currentText = "";

        // Clear previous interval (if any)
        if (this.write_interval) {
            clearInterval(this.write_interval);
        }

        // Set a new interval to print text character by character
        this.write_interval = setInterval(() => {
            if (this.dialogue_index < this.fullText.length) {
                this.currentText = this.fullText.substring(0, ++this.dialogue_index);
            } else {
                this.collider_timeout = setTimeout(() => {
                    this.printText = false;
                    this.writing = false;
                }, 4000);  //4 seconds ... obv can be increased for more time
                clearInterval(this.write_interval); // Stop interval when the text is fully displayed

            }
        }, 100); // Adjust speed here (100ms per character)
    }

    killAll() : void {
        clearInterval(this.write_interval);
        this.printText = false;
    }

}
