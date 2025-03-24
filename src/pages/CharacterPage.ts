import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";
import Sound from "../lib/Sound";
import SoundManager, {SoundManagerProps} from "../lib/SoundManager";
import Slider from "../lib/ui/Slider"

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
    private hairSliderVisible = false;
    private hairColors = [
        { r: 0, g: 0, b: 0 },       // Black
        { r: 139, g: 69, b: 19 },   // Brown
        { r: 255, g: 225, b: 100 }, // Blonde
        { r: 200, g: 100, b: 30 },   // Red
        { r: 150, g: 150, b: 150 }  // Grey
    ];
    private hairColorIndex = 0;
    public red = 255;
    public green = 255;
    public blue = 255;
    constructor() {
        super("character-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
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

        this.scene.remove(this.redHairSlider);
        this.scene.remove(this.greenHairSlider);
        this.scene.remove(this.blueHairSlider);
    }
    setup(): void {
        this.button_sfx = this.scene.add_new.sound("button_sfx")
        const sfx_props: SoundManagerProps= {
            group: "SFX",
            sounds: [this.button_sfx]
        }
        this.sfx_manager = this.scene.add_new.soundmanager(sfx_props);
        this.hairStyleButton = this.scene.add_new.button({
            label: "Change Hair Style",
            font_key: 'jersey',
            callback: () => {
                if (this.scene.scene_manager.playerHair = "assets/player_hair_short.png") {
                    this.scene.scene_manager.playerHair = "assets/player_hair_bob.png";
                } else {
                    this.scene.scene_manager.playerHair = "assets/player_hair_short.png";
                }
                this.scene.scene_manager.playerHat = "none";
            }
        })
        this.hairStyleButton.y = -100;
        this.hairStyleButton.x = -180;
        this.hairColorButton = this.scene.add_new.button({
            label: "Select Color",
            font_key: 'jersey',
            callback: () => {
                this.hairColorIndex = (this.hairColorIndex + 1) % this.hairColors.length;
                const color = this.hairColors[this.hairColorIndex];
                
                this.red = color.r;
                this.green = color.g;
                this.blue = color.b;
            }
        })
        this.hairColorButton.y = -100;
        this.hairCustomButton = this.scene.add_new.button({
            label: "Custom Color",
            font_key: 'jersey',
            callback: () => {
                this.hairSliderVisible = !this.hairSliderVisible;
                this.toggleSliders(this.hairSliderVisible);
                if (this.hairSliderVisible) this.setHairColor();
            }
        })
        this.hairCustomButton.y = -100;
        this.hairCustomButton.x = 180;
        this.tunicButton = this.scene.add_new.button({
            label: "Blue Tunic",
            font_key: 'jersey',
            callback: () => {
                this.scene.scene_manager.playerClothes = "assets/player_tunic.png";
            }
        })
        this.tunicButton.y = 0;
        this.tunicButton.x = 100;
        this.armorButton = this.scene.add_new.button({
            label: "Yellow Tunic",
            font_key: 'jersey',
            callback: () => {
                this.scene.scene_manager.playerClothes = "assets/player_armor.png";
            }
        })
        this.armorButton.y = 0;
        this.armorButton.x = -100;
        this.pointyHatButton = this.scene.add_new.button({
            label: "Pointy Hat",
            font_key: 'jersey',
            callback: () => {
                this.scene.scene_manager.playerHat = "assets/player_pointy_hat.png";
                this.scene.scene_manager.playerHair = "none";
            }
        })
        this.pointyHatButton.y = 100;
        this.pointyHatButton.x = 100;
        this.basicCapButton = this.scene.add_new.button({
            label: "Basic Cap",
            font_key: 'jersey',
            callback: () => {
                this.scene.scene_manager.playerHat = "assets/player_leather_hat.png";
                this.scene.scene_manager.playerHair = "none";
            }
        })
        this.basicCapButton.y = 100;
        this.basicCapButton.x = -100;
        // this.pantsButton = this.scene.add_new.button({
        //     label: "Customize Pants",
        //     font_key: 'jersey',
        //     callback: () => {
        //         this.pantsSliderVisible = !this.pantsSliderVisible;
        //         this.togglePantsSliders(this.pantsSliderVisible);
        //         if (this.pantsSliderVisible) this.setPantsColor();
        //     }
        // })
        // this.pantsButton.y = -100;
        // this.shirtButton = this.scene.add_new.button({
        //     label: "Customize Shirt",
        //     font_key: 'jersey',
        //     callback: () => {
        //         this.shirtSliderVisible = !this.shirtSliderVisible;
        //         this.toggleShirtSliders(this.shirtSliderVisible);
        //         if (this.shirtSliderVisible) this.setShirtColor();
        //     }
        // })
        // this.shirtButton.y = 0;
        this.back = this.scene.add_new.button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.set_page("menu-page");
            }
        })
        this.back.y = 200;

        this.redHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_red",
            callback: () => this.setHairColor()
        });
        this.redHairSlider.x = 550;
        this.redHairSlider.y = 100;
        
        this.greenHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_green",
            callback: () => this.setHairColor()
        });
        this.greenHairSlider.x = 550;
        this.greenHairSlider.y = 140;
        
        this.blueHairSlider = this.scene.add_new.slider({
            scene: this.scene,
            key: "hair_blue",
            callback: () => this.setHairColor()
        });
        this.blueHairSlider.x = 550;
        this.blueHairSlider.y = 180;

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
        const btnX = this.hairColorButton.x;
        const btnY = this.hairColorButton.y;

        p5.push();
        p5.fill(this.red, this.green, this.blue);
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.rectMode("center");
        p5.rect(btnX, btnY - 50, 40, 40); // Draw above the button
        p5.pop();

        p5.fill(0);
        p5.textAlign(this.page_manager.scene.p5.CENTER, this.page_manager.scene.p5.CENTER);
        p5.textSize(75);
        p5.text('Character Customization', 0, -300);
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

    setDifficulty(difficulty: string) {
        console.log(difficulty);
    }
}
