import Puzzle from "../lib/Puzzle"
import { PuzzleState } from "../lib/Puzzle"

export default class TestPuzzle extends Puzzle {
    checkSolution(e: KeyboardEvent): boolean {
        if (this.state == PuzzleState.completed) {
            return true;
        }
        if (e.key === "n") {
            this.state = PuzzleState.completed;
            return true;
        } else {
            this.state = PuzzleState.failed;
            return false;
        }
    }

    keyPressed = (e: KeyboardEvent) => {
        const _ = this.checkSolution(e);
    };
}
