import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class MenuPage extends Page {
    play!: ButtonTest;
    setting!: ButtonTest;
    carCuz!: ButtonTest;
    KDbutton!: ButtonTest;
    credits!: ButtonTest;
    physicsTest!: ButtonTest;
    puzzleTest!: ButtonTest;

    constructor() {
        super("menu-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    cleanup() {
        this.scene.remove(this.play);
        this.scene.remove(this.carCuz);
        this.scene.remove(this.KDbutton);
        this.scene.remove(this.setting);
        this.scene.remove(this.credits);
        this.scene.remove(this.physicsTest);
        this.scene.remove(this.puzzleTest);
    }
    setup(): void {
        this.play = this.scene.add_new.button({
            label: "Play!",
            font_key: 'jersey',
            callback: () => {
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
                this.cleanup();
                this.set_page("credits-page");
            }
        })
        this.credits.x = -300
        this.credits.y = 300
        this.physicsTest = this.scene.add_new.button
        ({
            label: "Physics",
            font_key: "jersey",
            callback: () =>
            {
                this.cleanup();
                this.scene.start("physics-scene");
            }
        })
        this.physicsTest.x = 150
        this.physicsTest.y = 300
        this.puzzleTest = this.scene.add_new.button
        ({
            label: "Puzzles",
            font_key: "jersey",
            callback: () =>
            {
                this.cleanup();
                this.scene.start("puzzle-dev-scene");
            }
        })
        this.puzzleTest.x = 0
        this.puzzleTest.y = 300
    }
}
