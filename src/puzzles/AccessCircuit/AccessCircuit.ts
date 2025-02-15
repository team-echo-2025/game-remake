import { RGB } from "p5";
import Puzzle from "../../lib/Puzzle";
import Cell from "./Cell";
export default class AccessCircuit extends Puzzle {
    board: Cell[][] = [];
    colors: RGB[] = [];
    solution: Cell[] = [];
    checkSolution(): boolean {
        // game logic
        return false;
    }
    preload(): any { }
    setup(): void {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }
    draw() {
        // draw puzzle
        this.draw_body();
        this.draw_board();
    }
    mousePressed(e: any) { }
    mouseReleased(e: any) { }
    draw_base() {

    }
    draw_header() { }
    draw_footer() { }
    draw_body() {
        let rectWidth = this.scene.p5.width / 3;
        let rectHeight = this.scene.p5.height / 2;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(163, 108, 49);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
    }
    draw_board() {
        let columns = 3;
        let rows = 5;

        let rectWidth = this.scene.p5.width / 3;
        let rectHeight = this.scene.p5.height / 2;
        let rectX = 0;
        let rectY = 0;

        let circleDiameter = rectWidth / (columns + 1);
        let paddingX = rectWidth / (columns + 1);
        let paddingY = rectHeight / (rows + 1);

        let startX = rectX - rectWidth / 2 + paddingX;
        let startY = rectY - rectHeight / 2 + paddingY;

        this.scene.p5.noFill();
        this.scene.p5.stroke(100);
        this.scene.p5.strokeWeight(3);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let x = startX + j * paddingX;
                let y = startY + i * paddingY;
                this.scene.p5.ellipse(x, y, circleDiameter);
            }
        }
    }

}
