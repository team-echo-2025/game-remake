import p5 from 'p5';
import GameObject from './GameObject';

export default class Menu implements GameObject {
    private imgBackground!: p5.Image;
    private font!: p5.Font;
    private clickCooldown = 0;
    private mute = false;
    
    private MENU = 0;
    private WORLD = 0;
    private DIFFICULTY = 0;

    constructor(private p: p5) {}

    preload(): void {
        this.font = this.p.loadFont('assets/fonts/jersey.ttf');
        this.imgBackground = this.p.loadImage('/assets/background.png');
    }

    setup(): void {
        this.p.rectMode(this.p.CENTER);
        window.addEventListener("keydown", (e) => this.muteFunc(e));
    }

    draw(): void {
        // if (this.clickCooldown > 0) this.clickCooldown--;

        this.p.background(200);

        switch (this.MENU) {
            case 0: this.drawMainMenu(); break;
            case 1: this.drawWorldSelect(); break;
            case 2: this.drawDifficultySelect(); break;
            case 3: this.drawSettingsMenu(); break;
            case 4: this.drawCharacterCustomization(); break;
            case 5: this.drawMainMenu(); break;
            case 6: this.drawKeybinds(); break;
            case 99: break; // In-game
        }
    }
// Return the current menu code
getMenuState(): number {
    return this.MENU;
}

// Change the menu code
setMenuState(menu: number): void {
    this.MENU = menu;
}


// Return the selected difficulty
getDiff(): number {
    return this.DIFFICULTY;
}

// Return the selected world
getWorld(): number {
    return this.WORLD;
}

    private drawButton(label: string, x: number, y: number, w: number, h: number): void {
        this.p.fill(0);
        this.p.rect(x, y, w, h);
        this.p.fill(255);
        this.p.textSize(26);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(label, x, y);
    }

    private drawMainMenu(): void {
        this.p.textFont(this.font);
        const buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        const buttonWidth = 200;
        const buttonHeight = 75;
        const spacing = 100;

        this.drawButton("PLAY", buttonX, buttonY, buttonWidth, buttonHeight);
        this.drawButton("SETTINGS", buttonX, buttonY + spacing, buttonWidth, buttonHeight);
        this.drawButton("CUSTOMIZE", buttonX, buttonY + 2 * spacing, buttonWidth, buttonHeight);
    }

    private drawWorldSelect(): void {
        this.p.textFont(this.font);
        const buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        const buttonWidth = 200;
        const buttonHeight = 75;
        const spacing = 100;

        this.drawButton("WORLD 1", buttonX, buttonY, buttonWidth, buttonHeight);
        this.drawButton("WORLD 2", buttonX, buttonY + spacing, buttonWidth, buttonHeight);
        this.drawButton("WORLD 3", buttonX, buttonY + 2 * spacing, buttonWidth, buttonHeight);
    }

    private drawDifficultySelect(): void {
        this.p.textFont(this.font);
        const buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        const buttonWidth = 200;
        const buttonHeight = 75;
        const spacing = 100;

        this.drawButton("EASY", buttonX, buttonY, buttonWidth, buttonHeight);
        this.drawButton("NORMAL", buttonX, buttonY + spacing, buttonWidth, buttonHeight);
        this.drawButton("HARD", buttonX, buttonY + 2 * spacing, buttonWidth, buttonHeight);
    }

    private drawSettingsMenu(): void {
        this.p.textFont(this.font);
        const buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        const buttonWidth = 200;
        const buttonHeight = 75;
        const spacing = 100;

        this.drawButton(`MUTE: ${this.mute ? "ON" : "OFF"}`, buttonX, buttonY, buttonWidth, buttonHeight);
        this.drawButton("KEYBINDS", buttonX, buttonY + spacing, buttonWidth, buttonHeight);
        this.drawButton("BACK", buttonX, buttonY + 2 * spacing, buttonWidth, buttonHeight);
    }

    private drawCharacterCustomization(): void {
        this.p.background(255, 0, 0);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text("Character Customization", this.p.width / 2, this.p.height / 2);
    }

    private drawKeybinds(): void {
        this.p.textFont(this.font);
        const buttonX = this.p.width / 2;
        let buttonY = this.p.height / 2;
        const buttonWidth = 300;
        const buttonHeight = 75;
        const spacing = 100;

        this.drawButton(`UP: W`, buttonX, buttonY - spacing, buttonWidth, buttonHeight);
        this.drawButton(`DOWN: S`, buttonX, buttonY, buttonWidth, buttonHeight);
        this.drawButton(`LEFT: A`, buttonX, buttonY + spacing, buttonWidth, buttonHeight);
        this.drawButton(`RIGHT: D`, buttonX, buttonY + 2 * spacing, buttonWidth, buttonHeight);
    }

    muteFunc(e: KeyboardEvent): void {
        if (e.key.toLowerCase() === 'm') {
            this.mute = !this.mute;
        }
    }

    mouseClicked(): void {
        // if (this.clickCooldown > 0) return;
        const buttonX = this.p.width / 2;

        const clickHandler = (yStart: number, menuTarget: number) => {
            if (this.p.mouseX > buttonX - 100 && this.p.mouseX < buttonX + 100 &&
                this.p.mouseY > yStart && this.p.mouseY < yStart + 75) {
                this.MENU = menuTarget;
                // this.clickCooldown = 10;
            }
        };

        switch (this.MENU) {
            case 0:
                clickHandler(this.p.height / 2, 1);
                clickHandler(this.p.height / 2 + 100, 3);
                clickHandler(this.p.height / 2 + 200, 4);
                break;
            case 1:
                clickHandler(this.p.height / 2, 2);
                break;
            case 2:
                clickHandler(this.p.height / 2, 99);
                clickHandler(this.p.height / 2 + 100, 99);
                clickHandler(this.p.height / 2 + 200, 99);
                break;
            case 3:
                clickHandler(this.p.height / 2, this.MENU);
                clickHandler(this.p.height / 2 + 100, 6);
                clickHandler(this.p.height / 2 + 200, 0);
                break;
            case 4:
                clickHandler(this.p.height / 2, 1);
                clickHandler(this.p.height / 2 + 100, 3);
                clickHandler(this.p.height / 2 + 200, 4);
                break;
        }
    }
}
