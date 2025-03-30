import Scene from "./Scene";

export default interface GameObject {
    zIndex?: number;
    hidden?: boolean;
    setup?(): void;
    postSetup?(): void;
    update?(dt: number, scene?: Scene): void;
    draw?(): void;
    postDraw?(): void;
    preload?(): Promise<any>;
    keyPressed?(e: KeyboardEvent): void;
    keyReleased?(e: KeyboardEvent): void;
    mouseClicked?(e: MouseEvent): void;
    mousePressed?(e: MouseEvent): void;
    mouseReleased?(e: MouseEvent): void;
    onDestroy?(): void;
}
