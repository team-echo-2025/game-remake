import p5 from 'p5';
import GameObject from './GameObject';

export default class Payer implements GameObject {
    player: any;
    pressed_keys: any = {};
    setup(p: p5): void {
        p.background(135, 206, 235);
        this.player = p.square(0, 0, 100, 0, 0);
    }

    keyPressed(e: KeyboardEvent): void {
        this.pressed_keys[e.key] = true;
    }


    keyReleased(e: KeyboardEvent): void {
        this.pressed_keys[e.key] = false;
    }

    draw(p: p5): void {
        if (this.pressed_keys['a']) {
            console.log('hello')
        }
    }
}
