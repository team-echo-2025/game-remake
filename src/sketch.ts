import p5 from 'p5';
import Player from './lib/Player';
let player: Player;
const sketch = (p: p5) => {
    p.preload = () => {
        player = new Player(p)
        player.preload();
    };

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, 'webgl');
        player.setup();
    };

    p.keyPressed = (e: KeyboardEvent) => {
        player.keyPressed(e);
    };

    p.keyReleased = (e: KeyboardEvent) => {
        player.keyReleased(e);
    };

    p.draw = () => {
        p.background(135, 206, 235);
        player.draw();
    };
};

const game = new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
