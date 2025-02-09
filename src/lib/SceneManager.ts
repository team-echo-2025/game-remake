import p5 from "p5";
import GameObject from "./GameObject";
import Scene from "./Scene";

export default class SceneManager implements GameObject {
    private p: p5;
    private current_scene?: Scene;
    private loading_scene: Scene;
    private scenes: Map<string, Scene>;
    constructor(p: p5, scenes: (new (name: string) => Scene)[], LoadingScene: new (name: string) => Scene) {
        this.scenes = new Map<string, Scene>();
        this.loading_scene = new LoadingScene(LoadingScene.name);
        this.loading_scene.p5 = p;
        this.loading_scene.scene_manager = this;
        this.p = p;
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
        this.loading_scene.onStart()
        new Promise(async (res) => {
            await this.loading_scene.preload()
            await this.loading_scene.preload_objects()
            res(true);
        }).then(() => {
            this.loading_scene?.setup();
            this.loading_scene?.setup_objects();
        });
        new_scene.start(new_scene.name);
    }

    async start(name: string) {
        const new_scene = this.scenes.get(name);
        if (!new_scene) {
            throw Error(`Scene: ${name} does not exist.`);
        }
        if (this.current_scene) {
            this.current_scene.onStop();
        }
        this.current_scene = this.loading_scene;
        new_scene.onStart();
        await new_scene.preload()
        await new_scene.preload_objects()
        new_scene?.setup();
        new_scene?.setup_objects();
        setTimeout(() => {
            this.current_scene = new_scene;
        }, 500)
    }

    async preload(): Promise<any> { }

    setup(): void { }

    draw(): void {
        this.current_scene?.draw();
        this.current_scene?.draw_objects();
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
}
