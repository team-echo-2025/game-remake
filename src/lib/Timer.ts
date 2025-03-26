import GameObject from './GameObject';
import Scene from './Scene';

export default class Timer implements GameObject {
    hidden?: boolean | undefined;
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    postDraw(): void {
        const p = this.scene.p5;
        p.push();
        p.fill(255, 0, 0);
        p.textSize(24);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(`Time Left: ${Math.ceil(this.scene.scene_manager.time_remaining)}s`, p.width / 2 - 20, -p.height / 2 + 20);
        p.pop();
    }
}
