import p5 from 'p5';
import GameObject from './GameObject';

/*
Menu Codes:
0 = Main menu
1 = World Select
2 = Difficulty
3 = Settings
4 = Customization
6 = Keybinds
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
    private imgBackground!: p5.Image;
    private imgButton!: p5.Image;
    private font!: p5.Font;
    private mute = false;

    private menuState = 0;
    private world = 0;
    private difficulty = 0;

    constructor(private p: p5) {}

    preload(): void {
        this.font = this.p.loadFont('assets/fonts/jersey.ttf');
        this.imgBackground = this.p.loadImage('/assets/background.png');
        this.imgButton = this.p.loadImage('/assets/Button_Flesh.png');
    }

    setup(): void {
        this.p.rectMode(this.p.CENTER);
        window.addEventListener('keydown', (e) => this.toggleMute(e));
    }

    draw(): void {
        this.p.background(this.imgBackground);
        switch (this.menuState) {
            case 0: this.drawMainMenu(); break;
            case 1: this.drawWorldSelect(); break;
            case 2: this.drawDifficultySelect(); break;
            case 3: this.drawSettingsMenu(); break;
            case 4: this.drawCustomization(); break;
            case 6: this.drawKeybinds(); break;
        }
    }

    mouseClicked(): void {

        let buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;

        const buttonClicked = (yOffset: number) => 
            this.p.mouseX > buttonX - 100 && this.p.mouseX < buttonX + 100 &&
            this.p.mouseY > buttonY + yOffset - 37 && this.p.mouseY < buttonY + yOffset + 37;

        switch (this.menuState) {
            case 0: // Main menu
                if (buttonClicked(0)) this.menuState = 1;
                else if (buttonClicked(100)) this.menuState = 3;
                else if (buttonClicked(200)) this.menuState = 4;
                break;
            case 1: // World select
                if (buttonClicked(0)) { this.menuState = 2; this.world = 0; }
                else if (buttonClicked(100)) { this.menuState = 2; this.world = 0; }
                else if (buttonClicked(200)) { this.menuState = 2; this.world = 0; }
                break;
            case 2: // Difficulty select menu
                if (buttonClicked(0)) { this.menuState = 99; this.difficulty = 0; }
                else if (buttonClicked(100)) { this.menuState = 99; this.difficulty = 1; }
                else if (buttonClicked(200)) { this.menuState = 99; this.difficulty = 2; }
                break;
            case 3: // Settings menu
                if (buttonClicked(0)) this.handleMute();
                else if (buttonClicked(100)) this.menuState = 6;
                else if (buttonClicked(200)) this.menuState = 0;
                break;
            case 6: //Keybinds menu
                if (buttonClicked(300)) this.menuState = 3;
        }
    }

    private drawMainMenu(): void {
        this.p.textFont(this.font);
        this.p.fill(255);
        this.p.textSize(200);
        this.p.text('Exit Paradox', this.p.width / 2, (this.p.height / 2) - 200);
        this.drawButton('PLAY', 0);
        this.drawButton('SETTINGS', 100);
        this.drawButton('CUSTOMIZE', 200);
    }

    private drawWorldSelect(): void {
        this.p.fill(255);
        this.p.textSize(200);
        this.p.text('Exit Paradox', this.p.width / 2, (this.p.height / 2) - 200);
        this.drawButton('WORLD 1', 0);
        this.drawButton('WORLD 2', 100);
        this.drawButton('WORLD 3', 200);
    }

    private drawDifficultySelect(): void {
        this.p.fill(255);
        this.p.textSize(200);
        this.p.text('Exit Paradox', this.p.width / 2, (this.p.height / 2) - 200);
        this.drawButton('EASY', 0);
        this.drawButton('NORMAL', 100);
        this.drawButton('HARD', 200);
    }

    private drawSettingsMenu(): void {
        this.p.fill(255);
        this.p.textSize(200);
        this.p.text('Exit Paradox', this.p.width / 2, (this.p.height / 2) - 200);
        this.drawButton(`MUTE: ${this.mute ? 'ON' : 'OFF'}`, 0);
        this.drawButton('KEYBINDS', 100);
        this.drawButton('BACK', 200);
    }

    private drawCustomization(): void {
        this.p.background(135, 206, 235);
        this.p.fill(0);
        this.p.textSize(50);
        this.p.text('Character Customization', this.p.width / 2, this.p.height / 2);
    }

    private drawKeybinds(): void {
        this.drawButton('UP: W', -100);
        this.drawButton('DOWN: S', 0);
        this.drawButton('LEFT: A', 100);
        this.drawButton('RIGHT: D', 200);
        this.drawButton('BACK', 300);
    }

    private drawButton(label: string, yOffset: number): void {
        let buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2 + yOffset;
        let buttonWidth = 200;
        let buttonHeight = 75;

        this.p.image(this.imgButton, (this.p.width / 2) - 100, this.p.height / 2 + yOffset - 75 / 2 + 10, 200, 75);
        this.p.fill(255);
        this.p.textSize(25);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(label, buttonX, buttonY);
    }

    private toggleMute(e: KeyboardEvent): void {
        if (e.key.toLowerCase() === 'm') {
            this.handleMute();
        }
    }

    private handleMute() {
        this.mute = !this.mute;
            document.dispatchEvent(new CustomEvent("onmute", {
                detail: {
                    mute: this.mute
                }
            }))
    }

    getMenuState(): number { return this.menuState; }
    setMenuState(menu: number): void { this.menuState = menu; }

    getDifficulty(): number { return this.difficulty; }
    setDifficulty(difficulty: number): void { this.difficulty = difficulty; }

    getWorld(): number { return this.world; }
    setWorld(world: number): void { this.world = world; }

    isMuted(): boolean { return this.mute; }
}
