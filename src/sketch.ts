import p5 from 'p5';
import Player from './lib/Player';

let MENU = 0;
let imgLogo: p5.Image;
const player = new Player();

const sketch = (p: p5) => {
    p.preload = () => {
        imgLogo = p.loadImage('/logo.png');
    };

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.rectMode(p.CENTER);
        player.setup(p);
    };

    p.keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            MENU = 0;
        }
        player.keyPressed(e);
    };

    p.keyReleased = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            MENU = 0;
        }
        player.keyReleased(e);
    };

    p.draw = () => {
        p.background(imgLogo);

        if (MENU === 0) {
            drawMainMenu(p);
        } else if (MENU === 1) {
            p.background(0, 255, 0);
            p.fill(0);
            p.textSize(20);
            p.text('Difficulty settings go here', p.width / 2, 30);
        } else if (MENU === 2) {
            p.background(255, 0, 255);
            p.textSize(30);
            p.fill(0);
            p.text('Settings', p.width / 2, 150);
        } else if (MENU === 3) {
            p.background(255, 0, 0);
            p.textSize(50);
            p.fill(255);
            p.text('Character Customization', p.width / 2, p.height / 2);
        }

        if (MENU !== 0) {
            player.draw(p);
        }
    };

    p.mouseClicked = () => {
        if (MENU === 0) {
            let buttonX = p.width / 2;

            if (p.mouseX > buttonX - 100 && p.mouseX < buttonX + 100) {
                if (p.mouseY > p.height / 2 - 37 && p.mouseY < p.height / 2 + 37) {
                    MENU = 1; // Play
                } else if (p.mouseY > p.height / 2 + 63 && p.mouseY < p.height / 2 + 137) {
                    MENU = 2; // Settings
                } else if (p.mouseY > p.height / 2 + 163 && p.mouseY < p.height / 2 + 237) {
                    MENU = 3; // Customize
                }
            }
        }
    };
};

function drawMainMenu(p: p5) {
    p.textFont('Courier New');

    // Button dimensions
    let buttonWidth = 200;
    let buttonHeight = 75;
    let buttonX = p.width / 2;
    let buttonY = p.height / 2;

    // Play Button
    p.fill(0);
    p.rect(buttonX, buttonY, buttonWidth, buttonHeight);
    p.fill(255);
    p.textSize(50);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('PLAY', buttonX, buttonY);

    // Settings Button
    p.fill(0);
    p.rect(buttonX, buttonY + 100, buttonWidth, buttonHeight);
    p.fill(255);
    p.textSize(26);
    p.text('SETTINGS', buttonX, buttonY + 100);

    // Customize Button
    p.fill(0);
    p.rect(buttonX, buttonY + 200, buttonWidth, buttonHeight);
    p.fill(255);
    p.textSize(26);
    p.text('CUSTOMIZE', buttonX, buttonY + 200);
}

const game = new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
