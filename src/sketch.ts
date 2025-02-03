import p5 from 'p5';
import Player from './lib/Player';
import Menu from './lib/MainMenu';
import MusicManager from './lib/MusicManager';

let menu: Menu;
let player: Player;
let background_music: MusicManager;


const sketch = (p: p5) => {
    p.preload = () => {
        menu = new Menu(p);
        player = new Player(p);
        background_music = new MusicManager("assets/background_music.mp3", "onmute");
        menu.preload();
        player.preload();
        background_music.preload();
    };

    p.setup = () => {
        background_music.setup();
        p.createCanvas(window.innerWidth, window.innerHeight);
        menu.setup();
        player.setup();
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
        p.background(135, 206, 235);
        menu.draw(); // Draw the main menu

        if (menu.getMenuState() === 99) { // 99 means user isn't in a menu (see MainMenu.ts comments)
            player.draw();
        }
    };

    p.mouseClicked = () => {
        menu.mouseClicked();
    };
};

const game = new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
