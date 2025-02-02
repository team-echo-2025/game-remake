import p5 from 'p5';
import Player from './lib/Player';
import Menu from './lib/MainMenu';
import {Howl} from 'howler';

let menu: Menu;
let player: Player;


const sketch = (p: p5) => {
    p.preload = () => {
        menu = new Menu(p);
        player = new Player(p);
        menu.preload();
        player.preload();
    };

    p.setup = () => {
        const sound = new Howl({
            src: "assets/background_music.mp3"
        })
        sound.play();
        document.addEventListener("onmute", (e: any)=>{
            console.log(e.detail)
            if (e.detail.mute) {
                sound.pause();
            } else {
                sound.play();
            }
        });
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
