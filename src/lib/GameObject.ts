export default interface GameObject {
    id?: number;
    hidden?: boolean;
    setup(): void;
    draw(): void;
    preload(): Promise<any>;
    keyPressed?(e: KeyboardEvent): void;
    keyReleased?(e: KeyboardEvent): void;
    mouseClicked?(e: MouseEvent): void;
    mousePressed?(e: MouseEvent): void;
    mouseReleased?(e: MouseEvent): void;
    onDestroy?(): void;
}
