import p5 from 'p5';
import GameObject from './GameObject';

/*
Menu Codes:
0 = Main menu
1 = World Select
2 = Difficulty
3 = Settings
4 = CUstomization
99 = Game (no longer in a menu)
*/

/*
World Codes:
0 = Demo
1 = World 1
2 = World 2
3 = World 3
*/

export default class Menu implements GameObject {
    private imgBackground!: p5.Image; // The logo will be assigned in preload()
    private MENU = 0;
    private WORLD = 0;
    private DIFFICULTY = 0;
    private clickCooldown = 0; // Click debounce on menus
    private font!: p5.Font;

    constructor(private p: p5) { }

    preload(): void {
        this.font = this.p.loadFont('assets/fonts/jersey.ttf');
        this.imgBackground = this.p.loadImage('/assets/background.png');
    }

    setup(): void {
        this.p.rectMode(this.p.CENTER);
    }

    draw(): void {
        if (this.clickCooldown > 0) {
            this.clickCooldown--;
        }


        switch (this.MENU) {
            case 0:
                this.drawMainMenu();
                break;
            case 1:
                this.drawWorldSelect();
                break;
            case 2:
                this.drawDifficultySelect();
                break;
            case 3:
                this.p.background(255, 0, 255);
                this.p.fill(0);
                this.p.textSize(30);
                this.p.text('Settings', this.p.width / 2, 150);
                break;
            case 4:
                this.p.background(255, 0, 0);
                this.p.fill(255);
                this.p.textSize(50);
                this.p.text('Character Customization', this.p.width / 2, this.p.height / 2);
                break;
            case 99:
                // No longer in a menu
                break;
        }
    }

    mouseClicked(): void {
        if (this.clickCooldown > 0) return;

        let buttonX = this.p.width / 2;

        switch (this.MENU) {
            case 0: // Main menu
                if (this.p.mouseX > buttonX - 100 && this.p.mouseX < buttonX + 100) {
                    if (this.p.mouseY > this.p.height / 2 - 37 && this.p.mouseY < this.p.height / 2 + 37) {
                        this.MENU = 1; // Play (goes to world select)
                    } else if (this.p.mouseY > this.p.height / 2 + 63 && this.p.mouseY < this.p.height / 2 + 137) {
                        this.MENU = 3; // Settings
                    } else if (this.p.mouseY > this.p.height / 2 + 163 && this.p.mouseY < this.p.height / 2 + 237) {
                        this.MENU = 4; // Customize
                    }
                }
                break;

            case 1: // World Select (all lead to demo world)
                if (this.p.mouseX > buttonX - 100 && this.p.mouseX < buttonX + 100) {
                    if (this.p.mouseY > this.p.height / 2 - 37 && this.p.mouseY < this.p.height / 2 + 37) {
                        this.MENU = 2;
                        this.WORLD = 0;
                    } else if (this.p.mouseY > this.p.height / 2 + 63 && this.p.mouseY < this.p.height / 2 + 137) {
                        this.MENU = 2;
                        this.DIFFICULTY = 0;
                    } else if (this.p.mouseY > this.p.height / 2 + 163 && this.p.mouseY < this.p.height / 2 + 237) {
                        this.MENU = 2;
                        this.DIFFICULTY = 0;
                    }
                }
                break;

            case 2: // Difficulty select
                if (this.p.mouseX > buttonX - 100 && this.p.mouseX < buttonX + 100) {
                    if (this.p.mouseY > this.p.height / 2 - 37 && this.p.mouseY < this.p.height / 2 + 37) {
                        this.MENU = 99;
                        this.DIFFICULTY = 0;
                    } else if (this.p.mouseY > this.p.height / 2 + 63 && this.p.mouseY < this.p.height / 2 + 137) {
                        this.MENU = 99;
                        this.DIFFICULTY = 1;
                    } else if (this.p.mouseY > this.p.height / 2 + 163 && this.p.mouseY < this.p.height / 2 + 237) {
                        this.MENU = 99;
                        this.DIFFICULTY = 2;
                    }
                }
                break;
        }

        // Preventing one click from registering as multiple (this was a previous issue)
        this.clickCooldown = 10;
    }

    // Return the current menu code
    getMenuState(): number {
        return this.MENU;
    }

    // Change the menu code
    setMenuState(menu: number): void {
        this.MENU = menu;
    }

    // Return the seelcted difficulty
    getDiff(): number {
        return this.DIFFICULTY;
    }

    // Return the selected world
    getWorld(): number {
        return this.WORLD;
    }

    private drawMainMenu(): void {
        this.p.textFont(this.font);
        let buttonX = this.p.windowWidth / 2;
        let buttonY = this.p.height / 2;
        let buttonWidth = 200;
        let buttonHeight = 75;

        // Play button
        this.p.fill(0);
        this.p.rect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text('PLAY', buttonX, buttonY);

        // Settings button
        this.p.fill(0);
        this.p.rect(buttonX, buttonY + 100, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(26);
        this.p.text('SETTINGS', buttonX, buttonY + 100);

        // Customize button
        this.p.fill(0);
        this.p.rect(buttonX, buttonY + 200, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(26);
        this.p.text('CUSTOMIZE', buttonX, buttonY + 200);
    }

    private drawWorldSelect(): void {
        this.p.textFont(this.font);

        let buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        let buttonWidth = 200;
        let buttonHeight = 75;

        // World 1
        this.p.fill(0);
        this.p.rect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text('WORLD 1', buttonX, buttonY);

        // World 2
        this.p.fill(0);
        this.p.rect(buttonX, buttonY + 100, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.text('WORLD 2', buttonX, buttonY + 100);

        // World 3
        this.p.fill(0);
        this.p.rect(buttonX, buttonY + 200, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.text('WORLD 3', buttonX, buttonY + 200);
    }

    private drawDifficultySelect(): void {
        this.p.textFont(this.font);

        let buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        let buttonWidth = 200;
        let buttonHeight = 75;

        // Easy
        this.p.fill(0);
        this.p.rect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.text('EASY', buttonX, buttonY);

        // Normal
        this.p.fill(0);
        this.p.rect(buttonX, buttonY + 100, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(40);
        this.p.text('NORMAL', buttonX, buttonY + 100);

        // Hard
        this.p.fill(0);
        this.p.rect(buttonX, buttonY + 200, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.text('HARD', buttonX, buttonY + 200);
    }
}
