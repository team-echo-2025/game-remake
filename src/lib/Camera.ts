import Scene from "./Scene";

export default class Camera {
    x: number;
    y: number;
    test: number = 0;
    scene: Scene;
    constructor(scene: Scene) {
        this.x = 0;
        this.y = 0;
        this.scene = scene;
    }
    lookAt(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    apply_transformation() {
        this.scene.p5.translate(-this.x, -this.y);
    }
}
