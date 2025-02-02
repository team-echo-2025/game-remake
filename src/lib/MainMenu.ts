import p5 from 'p5';
import GameObject from './GameObject';

export default class Menu implements GameObject {
    private imgBackground!: p5.Image;
    private font!: p5.Font;
    private clickCooldown = 0;
    private mute = false;

    private menuState = 0;
    private world = 0;
    private difficulty = 0;

    constructor(private p: p5) {}

    preload(): void {
        this.font = this.p.loadFont('assets/fonts/jersey.ttf');
        this.imgBackground = this.p.loadImage('/assets/background.png');
    }

    setup(): void {
        this.p.rectMode(this.p.CENTER);
        window.addEventListener('keydown', (e) => this.toggleMute(e));
    }

    draw(): void {
        if (this.clickCooldown > 0) this.clickCooldown--;

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
        if (this.clickCooldown > 0) return;

        let buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        let buttonWidth = 200;
        let buttonHeight = 75;

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
                break;
            case 2: // Difficulty select
                if (buttonClicked(0)) { this.menuState = 99; this.difficulty = 0; }
                else if (buttonClicked(100)) { this.menuState = 99; this.difficulty = 1; }
                else if (buttonClicked(200)) { this.menuState = 99; this.difficulty = 2; }
                break;
            case 3: // Settings
                if (buttonClicked(100)) this.menuState = 6;
                else if (buttonClicked(200)) this.menuState = 0;
                break;
        }

        this.clickCooldown = 10;
    }

    private drawMainMenu(): void {
        this.drawButton('PLAY', 0);
        this.drawButton('SETTINGS', 100);
        this.drawButton('CUSTOMIZE', 200);
    }

    private drawWorldSelect(): void {
        this.drawButton('WORLD 1', 0);
    }

    private drawDifficultySelect(): void {
        this.drawButton('EASY', 0);
        this.drawButton('NORMAL', 100);
        this.drawButton('HARD', 200);
    }

    private drawSettingsMenu(): void {
        this.drawButton(`MUTE: ${this.mute ? 'ON' : 'OFF'}`, 0);
        this.drawButton('KEYBINDS', 100);
        this.drawButton('BACK', 200);
    }

    private drawCustomization(): void {
        this.p.background(255, 0, 0);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.text('Character Customization', this.p.width / 2, this.p.height / 2);
    }

    private drawKeybinds(): void {
        this.drawButton('UP: W', -100);
        this.drawButton('DOWN: S', 0);
        this.drawButton('LEFT: A', 100);
        this.drawButton('RIGHT: D', 200);
    }

    private drawButton(label: string, yOffset: number): void {
        let buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2 + yOffset;
        let buttonWidth = 200;
        let buttonHeight = 75;

        this.p.fill(0);
        this.p.rect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.p.fill(255);
        this.p.textSize(40);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(label, buttonX, buttonY);
    }

    private toggleMute(e: KeyboardEvent): void {
        if (e.key.toLowerCase() === 'm') this.mute = !this.mute;
    }

    getMenuState(): number { return this.menuState; }
    setMenuState(menu: number): void { this.menuState = menu; }

    getDifficulty(): number { return this.difficulty; }
    setDifficulty(difficulty: number): void { this.difficulty = difficulty; }

    getWorld(): number { return this.world; }
    setWorld(world: number): void { this.world = world; }

    isMuted(): boolean { return this.mute; }
}
