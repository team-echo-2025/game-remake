import GameObject from "./GameObject";
import p5 from "p5"
import Scene from "./Scene";

class Page implements GameObject {
    name: string;
    scene!: Scene;
    page_manager: PageManager | null = null; // Reference to PageManager

    constructor(name: string) {
        this.name = name;

    }

    async preload(): Promise<void> {
        // load assets
    }
    onStart() {
        console.log("heelllo")
    }

    setup(): void {
        //shoutout setup
    }

    draw(): void {
        // we'll see when we need this
    }

    set_page(page_name: string): void {
        console.log(page_name)
        if (this.page_manager) {
            this.page_manager.set_page(page_name);
        } else {
            console.error("PageManager not set for", this.name);
        }
    }
    mouseClicked(e: MouseEvent): void {
    }
}

class PageManager implements GameObject {
    pages: Map<string, Page>;
    current_page: Page | null = null;
    scene: Scene;

    constructor(pages: Page[], scene: Scene) {
        this.pages = new Map();
        pages.forEach(page => {
            page.page_manager = this; // Assign PageManager reference
            this.pages.set(page.name, page);
            page.scene = scene;
        });
        this.scene = scene;
        this.current_page = pages[0];
    }

    set_page(page_name: string): void {
        const page = this.pages.get(page_name);
        if (page) {
            console.log(page)
            this.current_page = page;
        } else {
            console.error(`Page "${page_name}" not found.`);
        }
    }

    async preload(): Promise<void> {
        // const preloadPromises = Array.from(this.pages.values()).map(page => page.preload());
        // await Promise.all(preloadPromises);
        for (let page of this.pages.values()) {
            await page.preload();
        }
    }

    setup(): void {
        for (let page of this.pages.values()) {
            page.setup();
        }
    }

    draw(): void {
        this.current_page?.draw();
    }

    onStart(): void {
        this.current_page?.onStart();
    }
    mouseClicked(e: MouseEvent): void {
        this.current_page?.mouseClicked(e);
    }
}
export { Page, PageManager }
