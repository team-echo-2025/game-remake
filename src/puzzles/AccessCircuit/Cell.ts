import Ball from "./Ball";

export enum CellState {
    CORRECT,
    WRONG_POSITION,
    INCORRECT,
    EMPTY,
    OPEN,
}
export default class Cell {
    state: CellState;
    contains: Ball | null = null;
    bounding_box: any;
    constructor() {
        this.state = CellState.OPEN;
    }
}
