import p5, { Font, Image } from "p5";
import GameObject from "./GameObject";
import SceneManager from "./SceneManager";
import GameObjectFactory from "./GameObjectFactory";

export default class Scene implements GameObject {
    private _name: string;
    private _scene_manager!: SceneManager;
    protected p!: p5;
    private objects: GameObject[] = [];
    private game_object_factory: GameObjectFactory;
    private assets: Map<string, any> = new Map();
    private preloads: Promise<any>[] = []

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
        this.game_object_factory = new GameObjectFactory(this);
        this._name = name;
    }

    start(name: string) {
        this._scene_manager.start(name);
    }

    add(object: GameObject) {
        this.objects.push(object);
    }

    get_asset = (key: string) => {
        return this.assets.get(key);
    }

    get add_new() {
        return this.game_object_factory;
    }

    loadFont = (key: string, path: string) => {
        const font = new Promise<Font>((res) => {
            this.p5.loadFont(path, (font: Font) => {
                this.assets.set(key, font);
                res(font);
            })
        })
        this.preloads.push(font);
    }

    loadImage = (key: string, path: string) => {
        const image = new Promise<Image>((res) => {
            this.p5.loadImage(path, (img: Image) => {
                this.assets.set(key, img);
                res(img);
            })
        })
        this.preloads.push(image);
    }

    loadJSON = (key: string, path: string) => {
        const json = new Promise<Object>((res) => {
            this.p5.loadJSON(path, (jsn: Object) => {
                this.assets.set(key, jsn);
                res(jsn);
            })
        })
        this.preloads.push(json);
    }

    remove(object: GameObject) {
        this.objects = this.objects.filter(obj => {
            if (obj === object) {
                obj.onDestroy?.();
                return false;
            }
            return true;
        });
    }

    async preload(): Promise<any> { }
    async preload_objects(): Promise<any> {
        const to_load = []
        for (const obj of this.objects) {
            to_load.push(obj.preload());
        }
        for (const pre of this.preloads) {
            to_load.push(pre);
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
            if (!obj.hidden) {
                obj.draw();
            }
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
