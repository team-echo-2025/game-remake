import Scene from './Scene';

export default class Timer {
    private scene: Scene;
    private timeRemaining: number;
    private lastUpdateTime: number = 0;
    private isActive: boolean = false;

    constructor(scene: Scene, duration: number) {
        this.scene = scene;
        this.timeRemaining = duration;
        this.lastUpdateTime = scene.p5.millis();
        this.isActive = true;
    }

    update(): void {
        if (!this.isActive) return;
        const now = this.scene.p5.millis();
        const delta = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        this.timeRemaining -= delta;

        if (this.timeRemaining <= 0) {
            this.isActive = false;
            this.scene.scene_manager.clearTimer();
            this.scene.start("menu-scene");
        }
    }

    postDraw(): void {
        if (!this.isActive) return;
        const p = this.scene.p5;
        p.push();
        p.fill(255, 0, 0);
        p.textSize(24);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(`Time Left: ${Math.ceil(this.timeRemaining)}s`, p.width / 2 - 20, -p.height / 2 + 20);
        p.pop();
    }
}
