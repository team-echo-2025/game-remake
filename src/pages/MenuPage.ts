import Page from "../lib/Page";
import Sound from "../lib/Sound";
import ButtonTest, { ButtonTestProps } from "../lib/ui/ButtonTest";
import DropdownMenu from "../lib/ui/DropdownMenu";

export default class MenuPage extends Page {
    play!: ButtonTest;
    setting!: ButtonTest;
    carCuz!: ButtonTest;
    KDbutton!: ButtonTest;
    credits!: ButtonTest;
    physicsTest!: ButtonTest;
    puzzleTest!: ButtonTest;
    button_sfx!: Sound;
    dropdown!: DropdownMenu;

    constructor() {
        super("menu-page")
    }
    cleanup() {
        this.scene.remove(this.play);
        this.scene.remove(this.setting);
        this.scene.remove(this.carCuz);
        this.scene.remove(this.KDbutton);
        this.scene.remove(this.credits);
        this.scene.remove(this.physicsTest);
        this.scene.remove(this.puzzleTest);
        this.scene.remove(this.button_sfx);
        this.scene.remove(this.dropdown);
    }
    setup() {
        console.log("IN SETUP IN MENU")
        this.button_sfx = this.scene.add_new.sound("button_sfx")
        const button1: ButtonTestProps = {
            label: "Scene 1",
            font_key: "jersey",
            callback: () => { this.scene.start("play-scene") },
        };
        const button2: ButtonTestProps = {
            ...button1,
            callback: () => { this.scene.start("dungeon-1") },
            label: "Scene 2"
        }
        const button3: ButtonTestProps = {
            ...button1,
            label: "Scene 3",
            callback: () => { this.scene.start("dungeon-2") },
        }

        this.dropdown = this.scene.add_new.dropdown_menu({
            label: "Show Dev Scenes",
            font_key: "jersey",
            buttons: [
                button1,
                button2,
                button3
            ]
        })
        this.dropdown.y = -200
        this.dropdown.x = -200
        this.play = this.scene.add_new.button({
            label: "Play!",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.set_page('world-select-page')
            }
        })
        this.play.x = 0;
        this.play.y = -100;
        this.setting = this.scene.add_new.button({
            label: "Settings",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("settings-page");
            }
        })
        this.setting.x = 0;
        this.setting.y = 0;
        this.carCuz = this.scene.add_new.button({
            label: "Character Customization",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("settings-page");
            }
        })
        this.carCuz.x = 0;
        this.carCuz.y = 100;
        this.KDbutton = this.scene.add_new.button({
            label: "KD DEV",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.scene.start("kd-dev-scene")
            }
        })
        this.KDbutton.x = 300
        this.KDbutton.y = 300
        this.credits = this.scene.add_new.button({
            label: "Credits",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                console.log("switching to credits");
                this.set_page("credits-page");
            }
        })
        this.credits.x = -300
        this.credits.y = 300
        this.physicsTest = this.scene.add_new.button({
            label: "Physics",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.scene.start("physics-scene");
            }
        })
        this.physicsTest.x = 150
        this.physicsTest.y = 300
        this.puzzleTest = this.scene.add_new.button({
            label: "Puzzles",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.scene.start("puzzle-dev-scene");
            }
        })
        this.puzzleTest.x = 0
        this.puzzleTest.y = 300
    }
    postDraw(): void {
        this.page_manager.scene.p5.fill(0);
        this.page_manager.scene.p5.textAlign(this.page_manager.scene.p5.CENTER, this.page_manager.scene.p5.CENTER);
        this.page_manager.scene.p5.textSize(75);
        this.page_manager.scene.p5.text('EXIT PARADOX', 0, -300);
    }
}
