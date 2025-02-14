export default interface GameObject {
    zIndex?: number;
    hidden?: boolean;
    setup(): void;
    draw(): void;
    preload(): Promise<any>;
    keyPressed?(e: KeyboardEvent): void;
    keyReleased?(e: KeyboardEvent): void;
    mouseClicked?(e: MouseEvent): void;
    onDestroy?(): void;
}
