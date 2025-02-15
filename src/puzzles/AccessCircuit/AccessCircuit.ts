import { RGB } from "p5";
import Puzzle from "../../lib/Puzzle";
import Cell from "./Cell";
export default class AccessCircuit extends Puzzle {
    board: Cell[][] = [];
    colors: RGB[] = [];
    checkSolution(): boolean {
        // game logic
        return false;
    }
    preload(): any { }
    setup(): void { }
    draw() {
        // draw puzzle
    }
    mousePressed(e: any) { }
    mouseReleased(e: any) { }
    draw_base() { }
    draw_header() { }
    draw_footer() { }
    draw_body() { }
    draw_board() { }

}
