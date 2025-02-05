import p5 from "p5";
import GameObject from "./GameObject";
import SceneManager from "./SceneManager";

export default class Scene implements GameObject {
    private _name: string;
    private _scene_manager!: SceneManager;
    protected p!: p5;
    private objects: GameObject[] = [];

    set p5(p: p5) {
        this.p = p;
    }

    get p5() {
        return this.p;
    }

    set scene_manager(manager: SceneManager) {
        this._scene_manager = manager;
    }

    get name() {
        return this._name;
    }

    constructor(name: string) {
        if (name.length <= 0) {
            throw new Error("Scene name not specified.");
        }
        this._name = name;
    }

    start(name: string) {
        this._scene_manager.start(name);
    }

    add(object: GameObject) {
        this.objects.push(object);
    }

    async preload(): Promise<any> { }
    async preload_objects(): Promise<any> {
        const to_load = []
        for (const obj of this.objects) {
            to_load.push(obj.preload());
        }
        await Promise.all(to_load);
    }

    setup(): void { }
    setup_objects(): void {
        for (const obj of this.objects) {
            obj.setup();
        }
    }

    draw(): void { }
    draw_objects(): void {
        for (const obj of this.objects) {
            obj.draw();
        }
    }

    keyPressed(_: KeyboardEvent): void { }
    keyPressed_objects(e: KeyboardEvent): void {
        for (const obj of this.objects) {
            obj.keyPressed?.(e)
        }
    }

    keyReleased(_: KeyboardEvent): void { }
    keyReleased_objects(e: KeyboardEvent): void {
        for (const obj of this.objects) {
            obj.keyReleased?.(e);
        }
    }

    mouseClicked(_: MouseEvent): void { }
    mouseClicked_objects(e: MouseEvent): void {
        for (const obj of this.objects) {
            obj.mouseClicked?.(e);
        }
    }

    onStop() {
        for (const obj of this.objects) {
            obj.onDestroy?.();
        }
        this.objects.length = 0;
    }

    onStart() { }
}
