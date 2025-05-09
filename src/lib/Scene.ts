import p5, { Font, Image, XML } from "p5";
import GameObject from "./GameObject";
import SceneManager from "./SceneManager";
import GameObjectFactory from "./GameObjectFactory";
import Camera from "./Camera";
import WorldPhysics from "./physics/WorldPhysics";
import { Howl } from "howler";
import Timer from "./Timer";
import BoxCollider from "./physics/BoxCollider";
import SoundManager from "./SoundManager";

export default class Scene implements GameObject {
    zIndex?: number | undefined;
    private _name: string;
    private _scene_manager!: SceneManager;
    protected p!: p5;
    private objects: GameObject[] = [];
    private game_object_factory: GameObjectFactory;
    private _physics: WorldPhysics;
    private assets: Map<string, any> = new Map();
    private preloads: Promise<any>[] = []
    private _camera: Camera;
    private _bounds: BoxCollider;

    private _timer?: Timer;
    private start_time = 0;
    private frames = 0;
    private display_frames = 0;
    private _managers: SoundManager[] = []

    get managers() {
        return this._managers;
    }

    get timer(): Timer {
        return this._timer as Timer;
    }

    get _objects() {
        return this.objects;
    }

    get mouseX() {
        return (this.p5.mouseX / this._camera.zoom) + this.camera.x - (this.p5.width / 2) / this._camera.zoom;
    }
    get mouseY() {
        return (this.p5.mouseY / this._camera.zoom) + this.camera.y - (this.p5.height / 2) / this._camera.zoom;
    }

    get bounds() {
        return this._bounds;
    }

    set bounds(bounds: BoxCollider) {
        this._bounds = bounds;
    }

    get physics() {
        return this._physics;
    }

    get camera() {
        return this._camera;
    }


    set p5(p: p5) {
        this.p = p;
    }

    get p5() {
        return this.p;
    }

    set scene_manager(manager: SceneManager) {
        this._scene_manager = manager;
    }

    get scene_manager() {
        return this._scene_manager;
    }

    get name() {
        return this._name;
    }

    constructor(name: string) {
        if (name.length <= 0) {
            throw new Error("Scene name not specified.");
        }
        this._bounds = new BoxCollider({ x: 0, y: 0, w: Infinity, h: Infinity });
        this.game_object_factory = new GameObjectFactory(this);
        this._camera = new Camera(this);
        this._name = name;
        this._physics = new WorldPhysics();
        this._physics.scene = this;
    }

    start(name: string, args?: any) {
        this._scene_manager.start(name, args);
    }

    add_manager(object: SoundManager) {
        this._managers.push(object);
    }
    add(object: GameObject) {
        this.objects.push(object);
        this.objects.sort((obj1, obj2) => {
            const z1 = obj1.zIndex ?? 0;
            const z2 = obj2.zIndex ?? 0;
            return z1 - z2;
        })
    }

    update_zindex() {
        this.objects.sort((obj1, obj2) => {
            const z1 = obj1.zIndex ?? 0;
            const z2 = obj2.zIndex ?? 0;
            return z1 - z2;
        })
    }

    get_asset = (key: string) => {
        return this.assets.get(key);
    }

    set_asset = (key: string, asset: any) => {
        this.assets.set(key, asset);
    }

    get add_new() {
        return this.game_object_factory;
    }

    loadSound = (key: string, path: string) => {//
        const sound: Promise<Howl> = new Promise<Howl>(res => {
            const temp: Howl = new Howl({
                src: [path]
            });
            this.assets.set(key, temp);
            res(temp)
        });
        this.preloads.push(sound);

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

    loadXML = (key: string, path: string) => {
        const xml = new Promise<XML>((res) => {
            this.p5.loadXML(path, (xml: XML) => {
                this.assets.set(key, xml);
                res(xml);
            })
        })
        this.preloads.push(xml);
    }

    loadTilemap = (key: string, path: string) => {
        const xml = new Promise<XML>((res) => {
            this.p5.loadXML(path, async (xml: XML) => {
                this.assets.set(key, xml);
                const to_load = []
                for (let item of xml.getChildren()) {
                    const name = item.getName()
                    if (name == 'tileset') {
                        const source = item.getString("source")
                        const container = path.substring(0, path.lastIndexOf("/") + 1);
                        if (source) {
                            to_load.push(this.loadTileset(`${key}/${source}`, `${container}/${source}`));
                        } else {
                            throw new Error(`Cannot find tileset file.`);
                        }
                    }
                }
                await Promise.all(to_load);
                res(xml);
            })
        })
        this.preloads.push(xml);
    }

    loadTileset = async (key: string, path: string) => {
        await new Promise<XML>((res) => {
            this.p5.loadXML(path, async (xml: XML) => {
                this.assets.set(key, xml);
                const to_load = []
                for (let item of xml.getChildren()) {
                    const name = item.getName();
                    if (name == "image") {
                        const container = path.substring(0, path.lastIndexOf("/") + 1);
                        const source = item.getString("source");
                        to_load.push(new Promise<void>((res2) => {
                            this.p5.loadImage(`${container}/${source}`, (img: Image) => {
                                this.assets.set(`${key}/${source}`, img);
                                res2()
                            });
                        }))
                    }
                }
                await Promise.all(to_load);
                res(xml);
            })
        })
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
        let total = this.objects.length;
        let current = 0;
        let previous = this.scene_manager.loading_scene.loading_progress;
        for (const obj of this.objects) {
            if (obj.preload) {
                let pre = obj.preload()
                pre && to_load.push(pre.then(() => {
                    this.scene_manager.loading_scene.loading_progress = previous + ((current++) / total) * 60;
                }));
            }
        }
        total += this.preloads.length;
        for (const pre of this.preloads) {
            to_load.push(pre.then(() => {
                this.scene_manager.loading_scene.loading_progress = previous + ((current++) / total) * 60;
            }));
        }
        await Promise.all(to_load);
    }

    postSetup(): void { }
    postSetup_objects(): void {
        for (const obj of this.objects) {
            obj.postSetup?.();
        }
    }

    setup(): void { }
    setup_objects(): void {
        this._camera.setup();
        this._physics.setup();
        for (const obj of this.objects) {
            obj.setup && obj.setup();
        }
    }

    update(): void { }
    update_objects(): void {
        this._physics.update();
    }

    draw(): void { }
    draw_objects(): void {
        let drawn: boolean = false;
        if (this.objects.length > 0 && (this.zIndex ?? 0) < (this.objects[0].zIndex ?? 0)) {
            this.draw();
            drawn = true;
        }
        for (const obj of this.objects) {
            if (!drawn && (this.zIndex ?? 0) < (obj?.zIndex ?? 0)) {
                drawn = true;
                this.draw();
            }
            if (!obj.hidden) {
                obj.draw && obj.draw();
            }
        }
        if (!drawn) {
            this.draw();
        }
        this.frames++;
        const now = this.p5.millis();
        const delta = now - this.start_time;
        this.start_time = now;

        if (delta > 0) {
            const alpha = 0.05
            const fps = 1000 / delta;
            this.display_frames = alpha * fps + (1 - alpha) * this.display_frames;
        }
        //this.p5.push();
        //this.p5.noFill();
        //this.p5.rectMode("center");
        //this.p5.rect(this._bounds.x, this._bounds.y, this._bounds.halfWidth * 2, this._bounds.halfHeight * 2);
        //this.p5.pop();
    }

    postDraw(): void { }
    postDraw_objects(): void {
        this._physics.postDraw();
        let drawn: boolean = false;
        if (this.objects.length > 0 && (this.zIndex ?? 0) < (this.objects[0].zIndex ?? 0)) {
            this.p5.push();
            this.p5.translate(0, 0, this.zIndex ?? 0);
            this.postDraw();
            this.p5.pop();
            drawn = true;
        }
        for (const obj of this.objects) {
            if (!drawn && (this.zIndex ?? 0) < (obj?.zIndex ?? 0)) {
                drawn = true;
                this.p5.push();
                this.p5.translate(0, 0, this.zIndex ?? 0);
                this.postDraw();
                this.p5.pop();
            }
            if (!obj.hidden) {
                this.p5.push();
                this.p5.translate(0, 0, obj.zIndex ?? 0);
                obj.postDraw && obj.postDraw();
                this.p5.pop();
            }
        }
        if (!drawn) {
            this.p5.push();
            this.p5.translate(0, 0, this.zIndex ?? 0);
            this.postDraw();
            this.p5.pop();
        }
        this.p5.push();
        this.p5.fill(0);
        this.p5.textSize(24);
        this.p5.text("MouseX: " + Math.round(this.mouseX) + " MouseY: " + Math.round(this.mouseY), 20 - this.p5.width / 2, 40 - this.p5.height / 2);
        this.p5.text(`Frames:  ${this.display_frames.toFixed(1)}`, 20 - this.p5.width / 2, 60 - this.p5.height / 2);
        this.p5.pop();
    }

    disableTimer() {
        this.timer.hidden = true;
        this._scene_manager.disableTimer()
    }

    enableTimer() {
        this.timer.hidden = false;
        this._scene_manager.enableTimer()
    }

    keyPressed(_: KeyboardEvent): void { }
    keyPressed_objects(e: KeyboardEvent): void {
        for (const obj of this.objects) {
            if (!obj.hidden) {
                obj.keyPressed?.(e)
            }
        }
    }

    keyReleased(_: KeyboardEvent): void { }
    keyReleased_objects(e: KeyboardEvent): void {
        for (const obj of this.objects) {
            if (!obj.hidden) {
                obj.keyReleased?.(e);
            }
        }
    }

    mouseClicked(_: MouseEvent): void { }
    mouseClicked_objects(e: MouseEvent): void {
        for (const obj of this.objects) {
            if (!obj.hidden) {
                obj.mouseClicked?.(e);
            }
        }
    }
    mousePressed(_: MouseEvent): void { }
    mousePressed_objects(e: MouseEvent): void {
        for (const obj of this.objects) {
            if (!obj.hidden) {
                obj.mousePressed?.(e);
            }
        }
    }
    mouseReleased(_: MouseEvent): void { }
    mouseReleased_objects(e: MouseEvent): void {
        for (const obj of this.objects) {
            if (!obj.hidden) {
                obj.mouseReleased?.(e);
            }
        }
    }

    onStop() { }
    onStop_objects() {
        this._timer = undefined;
        this._physics.onDestroy();
        for (const obj of this._managers) {
            obj.onDestroy();
        }
        this._managers = [];
        for (const obj of this.objects) {
            obj.onDestroy?.();
        }
        this.objects = [];
        this.assets = new Map();
        this._physics = new WorldPhysics();
        this._physics.scene = this;
    }

    onStart(args?: any) { }
    onStart_objects(args?: any) {
        this._timer = new Timer(this);
        this.add(this._timer);
    }
    reset() { }
}
