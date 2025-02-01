import p5 from 'p5';
import GameObject from './GameObject';

export default class Payer implements GameObject {
    player: any;
    pressed_keys: any = {};
    x: number = 0;
    y: number = 0;
    setup(p: p5): void {
    }

    keyPressed(e: KeyboardEvent): void {
        this.pressed_keys[e.key] = true;
    }


    keyReleased(e: KeyboardEvent): void {
        this.pressed_keys[e.key] = false;
    }

    draw(p: p5): void {
        p.background(135, 206, 235);
        if (this.pressed_keys['w']) {
            this.y -= 1;
        }
        if (this.pressed_keys['a']) {
            this.x -= 1;
        }
        if (this.pressed_keys['s']) {
            this.y += 1;
        }
        if (this.pressed_keys['d']) {
            this.x += 1;
        }
        p.fill(255, 0, 0);
        p.circle(this.x, this.y, 30);
    }
}
