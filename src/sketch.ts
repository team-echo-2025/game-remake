import p5 from 'p5';
import Player from './lib/Player';
import Menu from './lib/MainMenu';
// import SettingsMenu from './lib/SettingsMenu';

let menu: Menu;
let player: Player;
// let setting: SettingsMenu;


const sketch = (p: p5) => {
    p.preload = () => {
        menu = new Menu(p);
        player = new Player(p);
        menu.preload();
        player.preload();
        // setting = new SettingsMenu(p);
        // setting.preload();
    };

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        menu.setup();
        player.setup();
        // setting.setup();
    };

    p.keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") { // When ESC is pressed...
            menu.setMenuState(0); // ...return to main menu
            // setting.setMenuState(0);
        }
        player.keyPressed(e);
    };

    p.keyReleased = (e: KeyboardEvent) => {
        player.keyReleased(e);
    };

    p.draw = () => {
        p.background(135, 206, 235);
        menu.draw(); // Draw the main menu
        // setting.draw();

        if (menu.getMenuState() === 99) { // 99 means user isn't in a menu (see MainMenu.ts comments)
            player.draw();
        }
    };

    p.mouseClicked = () => {
        menu.mouseClicked();
        // setting.mouseClicked();
    };
};

const game = new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
