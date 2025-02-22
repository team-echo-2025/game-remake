import RigidBody from "./physics/RigidBody";
import Scene from "./Scene";

export default class Camera {
    x: number;
    y: number;
    test: number = 0;
    scene: Scene;
    _follow: RigidBody | undefined;
    constructor(scene: Scene) {
        this.x = 0;
        this.y = 0;
        this.scene = scene;
    }
    lookAt(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    follow(body: RigidBody) {
        this._follow = body;
    }
    apply_transformation() {
        if (this._follow) {
            this.x = this._follow.x;
            this.y = this._follow.y;
        }
        this.scene.p5.translate(-this.x, -this.y);
    }
}
