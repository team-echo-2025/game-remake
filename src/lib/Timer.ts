import p5 from 'p5';
import GameObject from './GameObject';
import Scene from './Scene';
import SceneManager from './SceneManager';

export default class Timer implements GameObject {
    hidden?: boolean;
    private scene: Scene;
    private timerImage?: p5.Image;
    private _paddingX: number = 0;
    private _paddingY: number = 0;

    set paddingX(num: number) {
        this._paddingX = num;
    }

    get paddingX() {
        return this._paddingX;
    }

    set paddingY(num: number) {
        this._paddingY = num;
    }

    get paddingY() {
        return this._paddingY;
    }

    get width() {
        return this._paddingX + (this.timerImage?.width ?? 50);
    }

    constructor(scene: Scene) {
        this.scene = scene;
        this.timerImage = this.scene.p5.loadImage('assets/timer1.png');
    }

    postDraw(): void {
        const p = this.scene.p5;

        const time_left = this.scene.scene_manager.time_remaining;
        const total_time = SceneManager.DURATION;

        const clamped = Math.max(0, time_left);

        const fraction = clamped / total_time;

        p.push();
        const x = p.width / 2 - this.width - 10;
        const y = -p.height / 2 + 10;

        if (this.timerImage) {
            p.imageMode(p.CORNER);
            p.image(this.timerImage, x, y, this.timerImage.width + this._paddingX, this.timerImage.height + this._paddingY);
        }
        p.translate(this.width / 2, 0);

        const diameter = 30;
        const cx = x - diameter / 2;
        const cy = y + 72;

        // Draw background arc
        p.stroke(150);
        p.strokeWeight(4);
        p.noFill();
        p.arc(cx, cy, diameter, diameter, 0, p.TWO_PI);

        // Draw the fraction arc
        p.stroke(60, 60, 60);
        const startAngle = -p.HALF_PI;
        const endAngle = startAngle + fraction * p.TWO_PI;
        p.arc(cx, cy, diameter, diameter, startAngle, endAngle);

        p.noStroke();
        p.fill(26, 30, 84);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(32);
        const label = "Timer";
        const labelX = cx + 19;
        const labelY = cy - diameter / 2 - 10;
        p.text(label, labelX, labelY);

        const labelWidth = p.textWidth(label);

        p.stroke(26, 30, 84);
        p.strokeWeight(2);

        p.line(
            labelX - labelWidth / 2,
            labelY - 2,
            labelX + labelWidth / 2,
            labelY - 2
        );

        p.noStroke();
        p.fill(26, 30, 84);
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(26);

        const textX = cx + diameter / 2 + 10;
        const textY = cy;

        p.text(`${Math.ceil(clamped)}`, textX, textY);

        p.pop();

    }
}
