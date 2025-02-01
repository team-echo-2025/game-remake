import p5 from 'p5';
import Player from './lib/Player';
const player = new Player();
const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        player.setup(p);
    };

    p.keyPressed = (e: KeyboardEvent) => {
        console.log(e)
    }

    p.draw = () => {
        player.draw(p);
    };
};

const game = new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
