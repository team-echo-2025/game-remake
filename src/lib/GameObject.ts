import p5 from "p5";

export default interface GameObject {
    setup(p: p5): void;
    draw(p: p5): void;
    preload(p: p5): void;
    keyPressed?(e: KeyboardEvent): void;
    keyReleased?(e: KeyboardEvent): void;
}
