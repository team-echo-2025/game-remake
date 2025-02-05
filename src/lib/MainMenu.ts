import p5, { Font, Image } from 'p5';
import GameObject from './GameObject';
import Scene from './Scene';

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

    constructor(private scene: Scene) { }

    async preload(): Promise<any> {
        await new Promise((resolve, reject) => {
            this.font = this.scene.p5.loadFont('assets/fonts/jersey.ttf', (font: Font) => resolve(font), () => reject('Failed to load font'));
        }).catch(console.error);

        await new Promise((resolve, reject) => {
            this.imgBackground = this.scene.p5.loadImage('/assets/background.png', (img: Image) => resolve(img), () => reject('Failed to load background'));
        }).catch(console.error);

        await new Promise((resolve, reject) => {
            this.imgButton = this.scene.p5.loadImage('/assets/Button_Flesh.png', (img: Image) => resolve(img), () => reject('Failed to load button'));
        }).catch(console.error);
        this.imgButton.width = 350;
        this.imgButton.height = this.imgButton.width / 4;
    }

    setup(): void {
        this.scene.p5.textFont(this.font)
        this.scene.p5.rectMode(this.scene.p5.CENTER);
        window.addEventListener('keydown', (e) => this.toggleMute(e));
    }

    draw(): void {
        this.scene.p5.image(this.imgBackground, -this.scene.p5.width / 2, -this.scene.p5.height / 2, this.scene.p5.width, this.scene.p5.height);
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

        let buttonX = this.scene.p5.width / 2;
        let buttonY = this.scene.p5.height / 2;

        const buttonClicked = (yOffset: number) =>
            this.scene.p5.mouseX > buttonX - 100 && this.scene.p5.mouseX < buttonX + 100 &&
            this.scene.p5.mouseY > buttonY + yOffset - 37 && this.scene.p5.mouseY < buttonY + yOffset + 37;

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
            case 2: // Difficulty select
                if (buttonClicked(0)) { this.menuState = 99; this.difficulty = 0; }
                else if (buttonClicked(100)) { this.menuState = 99; this.difficulty = 1; }
                else if (buttonClicked(200)) { this.menuState = 99; this.difficulty = 2; }
                break;
            case 3: // Settings
                if (buttonClicked(0)) this.handleMute();
                else if (buttonClicked(100)) this.menuState = 6;
                else if (buttonClicked(200)) this.menuState = 0;
                break;
        }
    }

    private drawMainMenu(): void {
        this.scene.p5.textFont(this.font);
        this.scene.p5.fill(255);
        this.scene.p5.textSize(200);
        this.scene.p5.text('Exit Paradox', 0, - 200);
        this.drawButton('PLAY', 0);
        this.drawButton('SETTINGS', 100);
        this.drawButton('CUSTOMIZE', 200);
    }

    private drawWorldSelect(): void {
        this.scene.p5.textFont(this.font);
        this.scene.p5.fill(255);
        this.scene.p5.textSize(200);
        this.scene.p5.text('Exit Paradox', 0, - 200);
        this.drawButton('WORLD 1', 0);
        this.drawButton('WORLD 2', 100);
        this.drawButton('WORLD 3', 200);
    }

    private drawDifficultySelect(): void {
        this.scene.p5.textFont(this.font);
        this.scene.p5.fill(255);
        this.scene.p5.textSize(200);
        this.scene.p5.text('Exit Paradox', 0, - 200);
        this.drawButton('EASY', 0);
        this.drawButton('NORMAL', 100);
        this.drawButton('HARD', 200);
    }

    private drawSettingsMenu(): void {
        this.scene.p5.textFont(this.font);
        this.scene.p5.fill(255);
        this.scene.p5.textSize(200);
        this.scene.p5.text('Exit Paradox', 0, - 200);
        this.drawButton(`MUTE: ${this.mute ? 'ON' : 'OFF'}`, 0);
        this.drawButton('KEYBINDS', 100);
        this.drawButton('BACK', 200);
    }

    private drawCustomization(): void {
        this.scene.p5.textFont(this.font);
        this.scene.p5.background(135, 206, 235);
        this.scene.p5.fill(0);
        this.scene.p5.textSize(50);
        this.scene.p5.text('Character Customization', this.scene.p5.width / 2, this.scene.p5.height / 2);
    }

    private drawKeybinds(): void {
        this.drawButton('UP: W', -100);
        this.drawButton('DOWN: S', 0);
        this.drawButton('LEFT: A', 100);
        this.drawButton('RIGHT: D', 200);
    }

    private drawButton(label: string, yOffset: number): void {
        let buttonX = this.scene.p5.width / 2;
        let buttonY = this.scene.p5.height / 2 + yOffset;

        this.scene.p5.textFont(this.font);
        //const img = this.scene.p5.image(this.imgButton, -this.imgButton.width / 2, +yOffset + this.imgButton.height / 2);
        const button = this.scene.p5.createButton(label, "1")
        button.style(`background-image`, `url(${this.imgButton})`)
        button.position(buttonX, buttonY);
        this.scene.p5.fill(255);
        this.scene.p5.textSize(25);
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.text(label, buttonX, buttonY);
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
