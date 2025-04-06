import { Image } from 'p5';
import Page from "../lib/Page";
import ButtonTest, { ButtonTestProps } from "../lib/ui/ButtonTest";
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";
import Slider from "../lib/ui/Slider"
import DropdownMenu from '../lib/ui/DropdownMenu';

export default class CharacterPageColors extends Page {
    hairStyleButton!: ButtonTest;
    hairColorButton!: ButtonTest;
    hairCustomButton!: ButtonTest;
    back!: ButtonTest;
    private button_sfx!: Sound;
    private sfx_manager!: SoundManager;
    private redHairSlider!: Slider;
    private greenHairSlider!: Slider;
    private blueHairSlider!: Slider;
    private hairSliderVisible = false;
    private hairColors = [
        { r: 0, g: 0, b: 0 },       // Black
        { r: 139, g: 69, b: 19 },   // Brown
        { r: 255, g: 225, b: 100 }, // Blonde
        { r: 200, g: 100, b: 30 },  // Red
        { r: 150, g: 150, b: 150 }  // Grey
    ];
    private hairColorIndex = 0;
    private hairPath = localStorage.getItem("playerHair");
    private clothesPath = localStorage.getItem("playerClothes");
    private hatPath = localStorage.getItem("playerHat");
    private playerFrames: Image[] = [];
    private hairFrames: Image[] = [];
    private clothesFrames: Image[] = [];
    private hatFrames: Image[] = [];
    private playerAnimIndex = 0;
    private playerLastFrameTime = 0;
    public red = 255;
    public green = 255;
    public blue = 255;
    constructor() {
        super("character-page-colors")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf');
        this.setPreview();
    }
    cleanup = () => {
        this.scene.remove(this.redHairSlider);
        this.scene.remove(this.greenHairSlider);
        this.scene.remove(this.blueHairSlider);
        this.scene.remove(this.back);
        this.scene.remove(this.hairColorButton);
        this.scene.remove(this.hairCustomButton);
    }
    setup(): void {
        console.log("colors setup");
        this.button_sfx = this.scene.add_new.sound("button_sfx")
        const sfx_props: SoundManagerProps = {
            group: "SFX",
            sounds: [this.button_sfx]
        }
        this.sfx_manager = this.scene.add_new.soundmanager(sfx_props);
        // buttons
        //back
        this.back = this.scene.add_new.img_button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.set_page("character-page");
            },
            imageKey: 'test'
        })
        this.back.y = 200;
        //preset color
        this.hairColorButton = this.scene.add_new.button({
            label: "Random Color",
            font_key: 'jersey',
            callback: () => {
                this.hairColorIndex = (this.hairColorIndex + 1) % this.hairColors.length;
                const color = this.hairColors[this.hairColorIndex];
        
                this.red = color.r;
                this.green = color.g;
                this.blue = color.b;
        
                this.redHairSlider.slider.value(this.red / 255);
                this.greenHairSlider.slider.value(this.green / 255);
                this.blueHairSlider.slider.value(this.blue / 255);
        
                this.setHairColor();
            }
        });  
        this.hairColorButton.y = -50;
        this.hairColorButton.x = this.scene.p5.windowWidth/7;
        //rgb slider button
        this.hairCustomButton = this.scene.add_new.button({
            label: "Custom Color",
            font_key: 'jersey',
            callback: () => {
                this.hairSliderVisible = !this.hairSliderVisible;
                this.toggleSliders(this.hairSliderVisible);
                if (this.hairSliderVisible) this.setHairColor();
            }
        })
        this.hairCustomButton.y = 50;
        this.hairCustomButton.x = this.scene.p5.windowWidth/7;

        // sliders
        this.redHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_red",
            color: "red",
            callback: () => this.setHairColor()
        });
        this.redHairSlider.x = this.scene.p5.windowWidth/2 - this.scene.p5.windowWidth/12;
        this.redHairSlider.y = this.scene.p5.windowHeight/4 + this.scene.p5.windowHeight/15 + 10;

        this.greenHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_green",
            color: "green",
            callback: () => this.setHairColor()
        });
        this.greenHairSlider.x = this.scene.p5.windowWidth/2 - this.scene.p5.windowWidth/12;
        this.greenHairSlider.y = this.scene.p5.windowHeight/4 + this.scene.p5.windowHeight/10 + 8;
        this.blueHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_blue",
            color: "blue",
            callback: () => this.setHairColor()
        });
        this.blueHairSlider.x = this.scene.p5.windowWidth/2 - this.scene.p5.windowWidth/12;
        this.blueHairSlider.y = this.scene.p5.windowHeight/4 + this.scene.p5.windowHeight/8 + 13;

        const storedHair = localStorage.getItem("hairColor");
        if (storedHair) {
            const { r, g, b } = JSON.parse(storedHair);
            this.red = r;
            this.green = g;
            this.blue = b;

            this.redHairSlider.slider.value(r / 255);
            this.greenHairSlider.slider.value(g / 255);
            this.blueHairSlider.slider.value(b / 255);
        }

        this.toggleSliders(false);

        this.keyPressed = (e: KeyboardEvent) => {
            if (e.key === "Escape") { // When ESC is pressed...
                this.cleanup();
                this.set_page("character-page");
            }
        };
    }

    postDraw(): void {
        const p5 = this.scene.p5;
        this.drawPreview();
        p5.fill(0);
        p5.textAlign(this.page_manager.scene.p5.CENTER, this.page_manager.scene.p5.CENTER);
        p5.textSize(75);
        p5.text('Character Customization', 0, -this.scene.p5.windowHeight/3);
        p5.textSize(50);
    }

    setPreview(): void {
        this.playerAnimIndex = 0;
        this.playerFrames = [];
        this.hairFrames = [];
        this.clothesFrames = [];
        this.hatFrames = [];

        this.hairPath = localStorage.getItem("playerHair");
        this.clothesPath = localStorage.getItem("playerClothes");
        this.hatPath = localStorage.getItem("playerHat");

        this.scene.p5.loadImage('assets/player.png', (img) => {
            for (let i = 0; i < 6; i++) {
                this.playerFrames.push(img.get(i * 64, 64 * 4, 64, 64));
            }
        });

        if (this.hairPath && this.hairPath !== "none") {
            this.scene.p5.loadImage(this.hairPath, (img) => {
                for (let i = 0; i < 6; i++) {
                    this.hairFrames.push(img.get(i * 64, 64 * 4, 64, 64));
                }
            });
        }
        if (!this.hairPath) {
            this.scene.p5.loadImage('assets/player_hair_short.png', (img) => {
                for (let i = 0; i < 6; i++) {
                    this.hairFrames.push(img.get(i * 64, 64 * 4, 64, 64));
                }
            });
        }

        if (this.clothesPath) {
            this.scene.p5.loadImage(this.clothesPath, (img) => {
                for (let i = 0; i < 6; i++) {
                    this.clothesFrames.push(img.get(i * 64, 64 * 4, 64, 64));
                }
            });
        }
        if (!this.clothesPath) {
            this.scene.p5.loadImage('assets/player_tunic.png', (img) => {
                for (let i = 0; i < 6; i++) {
                    this.clothesFrames.push(img.get(i * 64, 64 * 4, 64, 64));
                }
            });
        }

        if (this.hatPath && this.hatPath !== "none") {
            this.scene.p5.loadImage(this.hatPath, (img) => {
                for (let i = 0; i < 6; i++) {
                    this.hatFrames.push(img.get(i * 64, 64 * 4, 64, 64));
                }
            });
        }
    }
    drawPreview(): void {
        const p5 = this.scene.p5;
        const now = p5.millis();
        if (now - this.playerLastFrameTime > 150) {
            this.playerAnimIndex = (this.playerAnimIndex + 1) % 6;
            this.playerLastFrameTime = now;
        }

        p5.push();
        p5.imageMode(p5.CENTER);
        const x = -p5.windowWidth / 8;
        const y = 0;
        const size = 64 * 5;

        if (this.allFramesReady(this.playerFrames)) {
            p5.image(this.playerFrames[this.playerAnimIndex], x, y, size, size);
        }
        if (this.allFramesReady(this.clothesFrames)) {
            p5.tint(255);
            p5.image(this.clothesFrames[this.playerAnimIndex], x, y, size, size);
        }
        if (this.allFramesReady(this.hairFrames)) {
            p5.tint(this.red, this.green, this.blue);
            p5.image(this.hairFrames[this.playerAnimIndex], x, y, size, size);
            p5.noTint();
        }
        if (this.allFramesReady(this.hatFrames)) {
            p5.tint(255);
            p5.image(this.hatFrames[this.playerAnimIndex], x, y, size, size);
        }

        p5.noTint();
        p5.pop();
    }
    // trying to fix glitch where sprites disappear on hair-to-hat change
    allFramesReady(frames: Image[]): boolean {
        return frames.length === 6 && frames.every(f => f !== undefined);
    }

    setHairColor(): void {
        this.red = Math.floor((this.redHairSlider.slider.value() as number) * 255);
        this.green = Math.floor((this.greenHairSlider.slider.value() as number) * 255);
        this.blue = Math.floor((this.blueHairSlider.slider.value() as number) * 255);
        localStorage.setItem("hairColor", JSON.stringify({ r: this.red, g: this.green, b: this.blue }));
    }
    setHatColor(): void {
        this.red = Math.floor((this.redHairSlider.slider.value() as number) * 255);
        this.green = Math.floor((this.greenHairSlider.slider.value() as number) * 255);
        this.blue = Math.floor((this.blueHairSlider.slider.value() as number) * 255);
        localStorage.setItem("hatColor", JSON.stringify({ r: this.red, g: this.green, b: this.blue }));
    }
    setClothingColor(): void {
        this.red = Math.floor((this.redHairSlider.slider.value() as number) * 255);
        this.green = Math.floor((this.greenHairSlider.slider.value() as number) * 255);
        this.blue = Math.floor((this.blueHairSlider.slider.value() as number) * 255);
        localStorage.setItem("clothesColor", JSON.stringify({ r: this.red, g: this.green, b: this.blue }));
    }
    
    toggleSliders(show: boolean): void {
        this.redHairSlider.slider.elt.hidden = !show;
        this.greenHairSlider.slider.elt.hidden = !show;
        this.blueHairSlider.slider.elt.hidden = !show;
    }
    drawBorder(){

    }
}
