import p5 from "p5";
import GameObject from "./GameObject";
import Scene from "./Scene";

const DURATION = 300;
export default class SceneManager implements GameObject {
    private p: p5;
    private current_scene?: Scene;
    private loading_scene: Scene;
    private scenes: Map<string, Scene>;

    private timer_start: number;
    private _time_remaining: number;
    private timer_paused: boolean = false;

    get time_remaining(): number {
        return this._time_remaining;
    }

    public difficulty: string;
    public playerHair = "none";
    public playerClothes = "assets/player_tunic.png";
    public playerHat = "none";
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
        this.timer_start = p.millis();
        this._time_remaining = DURATION;
    }

    async start(name: string, args?: any) {
        const new_scene = this.scenes.get(name);
        if (!new_scene) {
            throw Error(`Scene: ${name} does not exist.`);
        }
        if (this.current_scene) {
            this.disableTimer();
            this.current_scene.onStop();
            this.current_scene.onStop_objects();
        }
        this.current_scene = this.loading_scene;
        this.enableTimer();
        new_scene.onStart_objects(args);
        new_scene.onStart(args);
        await new_scene.preload()
        await new_scene.preload_objects()
        new_scene?.setup_objects();
        new_scene?.setup();
        new_scene?.postSetup();
        new_scene?.postSetup_objects();
        this.current_scene = new_scene;
    }

    async preload(): Promise<any> { }

    setup(): void { }

    draw(): void {
        // timer stuff 
        if (this.current_scene) {
            if (this.timer_paused) {
                this.timer_start = this.current_scene.p5.millis();
            } else {
                const now = this.current_scene.p5.millis();
                const delta = (now - this.timer_start) / 1000;
                this.timer_start = now;
                this._time_remaining -= delta;

                if (this._time_remaining <= 0) {
                    this.timer_paused = true;
                    this._time_remaining = DURATION;
                    this.start("menu-scene");
                }
            }
        }
        this.current_scene?.p5.push()
        this.current_scene?.camera.apply_transformation();
        this.current_scene?.draw_objects();
        this.current_scene?.update();
        this.current_scene?.update_objects();
        this.current_scene?.p5.pop()
        this.current_scene?.p5.push();
        this.current_scene?.postDraw_objects();
        this.current_scene?.p5.pop();
    }

    resetTimer(): void {
        this.timer_start = this.current_scene?.p5.millis() ?? 0;
    }

    disableTimer(): void {
        this.timer_paused = true;
    }

    enableTimer(): void {
        this.timer_paused = false;
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
}
