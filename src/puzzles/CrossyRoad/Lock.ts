import Scene from "../../lib/Scene";
import Spritesheet from "../../lib/Spritesheet";

export default class Lock extends Spritesheet {
    private _locked: boolean = true;
    get locked() {
        return this._locked;
    }
    constructor(scene: Scene) {
        super("lock", 17, 1);
        this.scene = scene;
        scene.add(this);
    }

    preload(): any {
        this.scene.loadImage("lock", "assets/locks/lock-spritesheet.png");
    }

    setup(): void {
        super.setup();
        this.end_col = 8;
    }

    unlock() {
        this._locked = false;
        this.once(true);
    }
}
