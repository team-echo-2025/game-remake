import { RGB } from "p5";
// ADD HEADER AND BLOCK AT THE BOTTOM OF FOOTER
import Puzzle from "../../lib/Puzzle";
import Cell, { CellState } from "./Cell";
import Ball from "./Ball";
import { randomUUIDv7 } from "bun";
export default class AccessCircuit extends Puzzle {
    board: Cell[][] = [];
    colors: {r:number, g:number, b:number}[] = [{r:0, g:76, b:84}, {r:79, g:38, b:131}, {r:1, g:35, b:82}]
    solution: Cell[] = [];
    dispenserCells: Cell[] = [];
    checkSolution(): boolean {
        // game logic
        return false;
    }
    preload(): any {}
    setup(): void {
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        //Making Cells
        this.setupFooter();
        this.setupBody();
    }
    draw() {
        // draw puzzle
        this.draw_body();
        this.draw_board();
        this.draw_base();
        // this.draw_board();
        this.draw_header();
        // this.draw_body();
        this.draw_footer();
    }
    mousePressed(e: any) { }
    mouseReleased(e: any) { }
    draw_base() {

    }
    draw_header() { }
    draw_body() {
        let rectWidth = this.scene.p5.width / 3;
        let rectHeight = this.scene.p5.height / 2;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(0);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
    }
    draw_board() {
        let columns = 3;
        let rows = 5;

       

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                this.board[i][j].draw();
            }
        }
    }
    draw_footer() {
        let p5 = this.scene.p5;

        // dimensions
        let footerWidth = p5.width / 3;
        let footerHeight = p5.height * 0.2;
        
        // Positioning
        let footerX = 0; 
        let footerY = this.scene.p5.height / 4 + footerHeight / 2; // Positioned under the body

        // Draw footer background
        p5.fill(0);
        p5.stroke(255);
        p5.rect(footerX, footerY, footerWidth, footerHeight);
        //Box 2
        p5.fill(255);
        p5.stroke(0,0,255);
        p5.rect(footerX, footerY*.6, footerWidth*4, footerHeight/3);

        for(let cell of this.dispenserCells){
            cell.draw();
            cell.contains?.draw();
        }

        // Add text instructions
        p5.fill(255);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(16);
        p5.text("Drag a ball from here into the board!", footerX, footerY - footerHeight / 2 + 20);
        
    }
    setupFooter(){
        let p5 = this.scene.p5;
        let footerWidth = p5.width / 3;
        let footerHeight = p5.height * 0.2;
        
        // Positioning
        let footerX = 0; 
        let footerY = this.scene.p5.height / 4 + footerHeight / 2; // Positioned under the body
        let columns = 3;
        let rows = 2;
        let circleDiameter =  footerWidth / (columns + 1) * 0.4  // 40% of horizontal spacing   );
        
        let paddingX = footerWidth / (columns + 1);
        // let paddingY = footerHeight / (rows + 2);
        
        let startX = footerX - footerWidth / 2 + paddingX;
        let startY = footerY - footerHeight * .1; //--> Centering bottom circles

        
        
        for (let i = 0; i < columns; i++) {
            let x = startX + i * paddingX;
            let y = startY;
            let randColor = Math.floor(Math.random() * this.colors.length)
            let calor = this.colors[randColor];
            this.colors.splice(randColor,1);
            console.log(Math.floor(Math.random() * this.colors.length));
            let cell = new Cell(this.scene, x, y, circleDiameter)
            this.dispenserCells.push(cell);
            cell.contains = new Ball(calor, cell, this.scene);
        }
        
    }
    setupBody(){
        let columns = 3;
        let rows = 5;

        let rectWidth = this.scene.p5.width / 3;
        let rectHeight = this.scene.p5.height / 1.8;
        let rectX = 0;
        let rectY = 0;

        let circleDiameter = rectWidth / (columns + 1) * 0.4   // 40% of vertical spacing
        let paddingX = rectWidth / (columns + 1);
        let paddingY = rectHeight / (rows + 1);

        let startX = rectX - rectWidth / 2 + paddingX;
        let startY = rectY - rectHeight / 2 + paddingY;

        for (let i = 0; i < rows; i++) {
            this.board.push([]);
            for (let j = 0; j < columns; j++) {
                let x = startX + j * paddingX;
                let y = startY + i * paddingY;
                this.board[i].push(new Cell(this.scene, x, y, circleDiameter));
                // this.scene.p5.ellipse(x, y, circleDiameter);
            }
        }
    }

}
