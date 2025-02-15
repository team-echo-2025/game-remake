import Page from "../lib/Page";
import Scene from "../lib/Scene";
import Puzzle from "../lib/Puzzle"
import {PuzzleState} from "../lib/Puzzle"

export default class AccessCircuit extends Puzzle {
    checkSolution(): boolean { 
        // game logic
        return false;
    }

    // draw puzzle
    draw() { }
}
