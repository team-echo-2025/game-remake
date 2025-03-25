import GameObject from './GameObject';
import Scene from './Scene';

export default class Timer implements GameObject {
    private scene!: Scene;
    private timeRemaining!: number; // in-game time remaining (in seconds)
    private lastUpdateTime: number = 0; // last time in-game time was updated (in p5.millis())
    private currentTime!: number; // current time at the time of the last update (in p5.millis())
    private deltaTime!: number; // time between updates

    constructor(scene: Scene, timeRemaining: number) {
        this.scene = scene;
        this.timeRemaining = timeRemaining;
    }

    updateTimer(): void {
        const now = this.scene.p5.millis();
        this.deltaTime = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        this.timeRemaining -= this.deltaTime;
    }

    postDraw(): void {
        if (this.scene.name != "menu-scene" && this.scene.name != "loading-scene") { // timer should not run on certian scenes
            this.updateTimer();
            this.scene.p5.push();
            this.scene.p5.fill(255, 0, 0);
            this.scene.p5.textSize(24);
            this.scene.p5.textAlign(this.scene.p5.RIGHT, this.scene.p5.TOP);
            let timeDisplay = Math.ceil(this.timeRemaining); // rounding up to whole second
            this.scene.p5.text(`Time Left: ${timeDisplay}s`, this.scene.p5.width / 2 - 20, -this.scene.p5.height / 2 + 20);
            this.scene.p5.pop();
        }
    }
}