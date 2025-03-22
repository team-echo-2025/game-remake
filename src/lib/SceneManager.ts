import p5 from "p5";
import GameObject from "./GameObject";
import Scene from "./Scene";

export default class SceneManager implements GameObject {
    private p: p5;
    private current_scene?: Scene;
    private loading_scene: Scene;
    private scenes: Map<string, Scene>;
    public difficulty: string;
    private timeRemaining!: number; // in-game time remaining (in seconds)
    private lastUpdateTime: number = 0; // last time in-game time was updated (in p5.millis())
    private currentTime!: number; // current time at the time of the last update (in p5.millis())
    private deltaTime!: number; // time between updates

    constructor(p: p5, scenes: (new (name: string) => Scene)[], LoadingScene: new (name: string) => Scene) {
        this.scenes = new Map<string, Scene>();
        this.loading_scene = new LoadingScene(LoadingScene.name);
        this.loading_scene.p5 = p;
        this.loading_scene.scene_manager = this;
        this.p = p;
        this.difficulty = "easy"; // default difficulty
        if (scenes.length <= 0) {
            throw new Error("No scenes specified.");
        }
        for (const UnloadedScene of scenes) {
            const scene_instance = new UnloadedScene(UnloadedScene.name);
            scene_instance.p5 = this.p;
            scene_instance.scene_manager = this;
            this.scenes.set(scene_instance.name, scene_instance);
        }

        const new_scene = this.scenes.values().next().value!;
        new Promise(async (res) => {
            this.loading_scene.onStart()
            await this.loading_scene.preload()
            await this.loading_scene.preload_objects()
            res(true);
        }).then(() => {
            this.loading_scene?.setup_objects();
            this.loading_scene?.setup();
            this.loading_scene?.postSetup()
            this.loading_scene?.postSetup_objects();
            this.start(new_scene.name);
        });
    }

    async start(name: string, args?: any) {
        const new_scene = this.scenes.get(name);
        if (!new_scene) {
            throw Error(`Scene: ${name} does not exist.`);
        }
        if (this.current_scene) {
            this.current_scene.onStop();
            this.current_scene.onStop_objects();
        }
        this.current_scene = this.loading_scene;
        console.log("after new_scene onStart")
        new_scene.onStart(args);
        await new_scene.preload()
        console.log("after new scene preload")
        await new_scene.preload_objects()
        console.log("after new scene preload objects")
        new_scene?.setup_objects();
        console.log("after new scene setup objects")
        new_scene?.setup();
        new_scene?.postSetup();
        new_scene?.postSetup_objects();
        this.current_scene = new_scene;
        console.log("after current scene = new scene")
    }

    async preload(): Promise<any> { }

    setup(): void { }

    draw(): void {
        this.current_scene?.p5.push()
        this.current_scene?.camera.apply_transformation();
        this.current_scene?.draw();
        this.current_scene?.draw_objects();
        this.current_scene?.update();
        this.current_scene?.update_objects();
        this.current_scene?.p5.pop()
        this.current_scene?.p5.push();
        this.current_scene?.postDraw();
        this.current_scene?.postDraw_objects();
        this.current_scene?.p5.pop();
    }

    postSetup(): void {
        this.current_scene?.postSetup();
        this.current_scene?.postSetup_objects();
    }

    keyPressed(e: KeyboardEvent): void {
        this.current_scene?.keyPressed(e);
        this.current_scene?.keyPressed_objects(e);
    }

    keyReleased(e: KeyboardEvent): void {
        this.current_scene?.keyReleased(e);
        this.current_scene?.keyReleased_objects(e);
    }

    mouseClicked(e: MouseEvent): void {
        this.current_scene?.mouseClicked_objects(e);
        this.current_scene?.mouseClicked(e);
    }
    mousePressed(e: MouseEvent): void {
        this.current_scene?.mousePressed_objects(e);
        this.current_scene?.mousePressed(e);
    }
    mouseReleased(e: MouseEvent): void {
        this.current_scene?.mouseReleased_objects(e);
        this.current_scene?.mouseReleased(e);
    }

    set_time(time: number): void {
        this.timeRemaining = time;
    }
    get_time(): number {
        return this.timeRemaining;
    }
    set_update_time(time: number): void {
        this.lastUpdateTime = time;
    }
    get_update_time(): number {
        return this.lastUpdateTime;
    }
    set_current_time(time: number): void {
        this.currentTime = time;
    }
    get_current_time(): number {
        return this.currentTime;
    }
    set_delta_time(time: number): void {
        this.deltaTime = time;
    }
    get_delta_time(): number {
        return this.deltaTime;
    }
    updateTimer(): void {
        const now = this.p.millis();
        this.deltaTime = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        this.timeRemaining -= this.deltaTime;
    }    
}
