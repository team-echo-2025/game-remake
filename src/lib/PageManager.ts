import GameObject from "./GameObject";
import Page from "./Page";
import Scene from "./Scene";


export default class PageManager implements GameObject {
    pages: Map<string, Page>;
    current_page: Page | null = null;
    zIndex?: number | undefined;
    private _scene?: Scene;
    get scene() {
        return this._scene!;
    }
    set scene(_scene: Scene) {
        this._scene = _scene;
        this.update_scene(_scene);
    }

    constructor(pages: Page[], scene?: Scene) {
        this.pages = new Map();
        pages.forEach(page => {
            page.page_manager = this; // Assign PageManager reference
            this.pages.set(page.name, page);
        });
        if (scene)
            this.update_scene(scene);
        this._scene = scene;
    }
    update_scene(scene: Scene) {
        this.pages.forEach(page => {
            page.scene = scene;
        });
    }

    set_page(page_name: string): void {
        const page = this.pages.get(page_name);
        if (page) {
            this.zIndex = page.zIndex;
            page.setup();
            this.current_page = page;
        } else {
            console.error(`Page "${page_name}" not found.`);
        }
    }

    preload(): any {
        // const preloadPromises = Array.from(this.pages.values()).map(page => page.preload());
        // await Promise.all(preloadPromises);
        //const to_load = []
        for (const page of this.pages.values()) {
            page.preload()
        }
        //for (let page of this.pages.values()) {
        //    to_load.push(page.preload());
        //}
        //await Promise.all(to_load);
    }

    setup(): void {
        this.current_page?.setup();
    }

    draw(): void {
        this.current_page?.draw();
    }

    postDraw(): void {
        this.current_page?.postDraw();
    }

    mouseClicked(e: MouseEvent): void {
        this.current_page?.mouseClicked(e);
    }

    keyPressed(e: KeyboardEvent): void {
        this.current_page?.keyPressed(e);
    }

    keyReleased(e: KeyboardEvent): void {
        this.current_page?.keyReleased(e);
    }

    onDestroy(): void { }
}
