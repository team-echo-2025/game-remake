import p5 from 'p5';
import Player from './lib/Player';
import Menu from './lib/MainMenu';

const player = new Player();
let menu: Menu;

const sketch = (p: p5) => {
    p.preload = () => {
        menu = new Menu(p);
        menu.preload();
    };

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        menu.setup();
        player.setup(p);
    };

    p.keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") { // When ESC is pressed...
            menu.setMenuState(0); // ...return to main menu
        }
        player.keyPressed(e);
    };

    p.keyReleased = (e: KeyboardEvent) => {
        player.keyReleased(e);
    };

    p.draw = () => {
        menu.draw(); // Draw the main meun

        if (menu.getMenuState() === 99) { // 99 means user isn't in a menu (see MainMenu.ts comments)
            player.draw(p);
        }
    };

    p.mouseClicked = () => {
        menu.mouseClicked();
    };
};

const game = new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
