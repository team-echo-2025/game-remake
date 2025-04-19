import { Image } from 'p5';
import Page from "../lib/Page";
import ButtonTest, { ButtonTestProps } from "../lib/ui/ButtonTest";
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";
import Slider from "../lib/ui/Slider"
import DropdownMenu from '../lib/ui/DropdownMenu';

export default class CharacterPage extends Page {
    hairStyleButton!: ButtonTest;
    hairColorButton!: ButtonTest;
    hairCustomButton!: ButtonTest;
    tunicButton!: ButtonTest;
    armorButton!: ButtonTest;
    pointyHatButton!: ButtonTest;
    basicCapButton!: ButtonTest;
    back!: ButtonTest;
    private button_sfx!: Sound;
    private sfx_manager!: SoundManager;
    private redHairSlider!: Slider;
    private greenHairSlider!: Slider;
    private blueHairSlider!: Slider;
    dropdown!: DropdownMenu;
    dropdownHair!: DropdownMenu;
    dropdownClothes!: DropdownMenu;
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
        super("character-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf');
        this.setPreview();
    }
    cleanup = () => {
        this.scene.remove(this.hairStyleButton);
        this.scene.remove(this.hairColorButton);
        this.scene.remove(this.hairCustomButton);
        this.scene.remove(this.tunicButton);
        this.scene.remove(this.armorButton);
        this.scene.remove(this.pointyHatButton);
        this.scene.remove(this.basicCapButton);
        this.scene.remove(this.back);
        this.scene.remove(this.dropdown);
        this.scene.remove(this.dropdownClothes);
        this.scene.remove(this.dropdownHair);
        this.scene.remove(this.redHairSlider);
        this.scene.remove(this.greenHairSlider);
        this.scene.remove(this.blueHairSlider);
    }
    setup(): void {
        this.button_sfx = this.scene.add_new.sound("button_sfx")
        const sfx_props: SoundManagerProps = {
            group: "SFX",
            sounds: [this.button_sfx]
        }
        this.sfx_manager = this.scene.add_new.soundmanager(sfx_props);
        //Hat Dropdown
        const hat1: ButtonTestProps = {
            label: "Leather Cap",
            font_key: "jersey",
            callback: () => {
                localStorage.setItem("playerHat", "assets/player_leather_hat.png");
                localStorage.setItem("playerHair", "none");
                this.setPreview();
            },
        };
        const hat2: ButtonTestProps = {
            ...hat1,
            callback: () => {
                localStorage.setItem("playerHat", "assets/player_pointy_hat.png");
                localStorage.setItem("playerHair", "none");
                this.setPreview();
            },
            label: "Pointy Hat"
        }

        this.dropdown = this.scene.add_new.dropdown_menu({
            label: "Hat",
            font_key: "jersey",
            buttons: [
                hat1,
                hat2
            ]
        })
        this.dropdown.x = this.scene.p5.windowWidth / 7;
        this.dropdown.y = -175;
        //Hair Dropdown menu
        const hair1: ButtonTestProps = {
            label: "Change Style",
            font_key: "jersey",
            callback: () => {
                const currentHair = localStorage.getItem("playerHair");
                const newHair = currentHair === "assets/player_hair_short.png"
                    ? "assets/player_hair_bob.png"
                    : "assets/player_hair_short.png";

                localStorage.setItem("playerHair", newHair);
                this.hairPath = localStorage.getItem("playerHair");
                localStorage.setItem("playerHat", "none");
                this.hatPath = localStorage.getItem("playerHat")
                this.setPreview();
            },
        };
        const hair2: ButtonTestProps = {
            ...hair1,
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.set_page("character-page-colors")
            },
            label: "Select Color"
        }

        this.dropdownHair = this.scene.add_new.dropdown_menu({
            label: "Hair",
            font_key: "jersey",
            buttons: [
                hair1,
                hair2
            ]
        })
        this.dropdownHair.x = this.scene.p5.windowWidth / 7;
        this.dropdownHair.y = 0;
        //Clothing Menu
        const clothes1: ButtonTestProps = {
            label: "Blue Tunic",
            font_key: "jersey",
            callback: () => {
                localStorage.setItem("playerClothes", "assets/player_tunic.png");
                this.setPreview();
            },
        };
        const clothes2: ButtonTestProps = {
            ...hair1,
            callback: () => {
                localStorage.setItem("playerClothes", "assets/player_armor.png");
                this.setPreview();
            },
            label: "Yellow Tunic"
        }

        this.dropdownClothes = this.scene.add_new.dropdown_menu({
            label: "Clothes",
            font_key: "jersey",
            buttons: [
                clothes1,
                clothes2
            ]
        })
        this.dropdownClothes.x = this.scene.p5.windowWidth / 7;
        this.dropdownClothes.y = 175;
        // buttons
        this.back = this.scene.add_new.img_button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.set_page("menu-page");
            },
            imageKey: 'test'
        })
        this.back.y = 200;

        // sliders
        this.redHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_red",
            color: "red",
            callback: () => this.setHairColor()
        });
        this.redHairSlider.x = 100;
        this.redHairSlider.y = 100;
        this.greenHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_green",
            color: "green",
            callback: () => this.setHairColor()
        });
        this.greenHairSlider.x = 100;
        this.greenHairSlider.y = 150;
        this.blueHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_blue",
            color: "blue",
            callback: () => this.setHairColor()
        });
        this.blueHairSlider.x = 100;
        this.blueHairSlider.y = 200;

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
                this.set_page("menu-page"); // ...return to main menu
            }
        };
    }

    postDraw(): void {
        const p5 = this.scene.p5;
        this.drawPreview();
        p5.fill(0);
        p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        p5.textSize(75);
        p5.text('Character Customization', 0, -this.scene.p5.windowHeight / 3);
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
    toggleSliders(show: boolean): void {
        this.redHairSlider.slider.elt.hidden = !show;
        this.greenHairSlider.slider.elt.hidden = !show;
        this.blueHairSlider.slider.elt.hidden = !show;
    }
    drawBorder() {

    }
    onDestroy(): void {
        this.cleanup();
    }
}
