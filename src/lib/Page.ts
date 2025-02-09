import GameObject from "./GameObject";
import PageManager from "./PageManager";
import Scene from "./Scene";

export default class Page implements GameObject {
    name: string;
    scene!: Scene;
    page_manager!: PageManager; // Reference to PageManager

    constructor(name: string) {
        this.name = name;
    }

    async preload(): Promise<void> { }

    setup(): void { }

    draw(): void { }

    set_page(page_name: string): void {
        if (this.page_manager) {
            this.page_manager.set_page(page_name);
        } else {
            console.error("PageManager not set for", this.name);
        }
    }

    mouseClicked(_: MouseEvent): void { }

    onDestroy(): void { }
}
