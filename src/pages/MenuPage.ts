import Page from "../lib/Page";
import Sound from "../lib/Sound";
import ButtonTest, { ButtonTestProps } from "../lib/ui/ButtonTest";
import DropdownMenu from "../lib/ui/DropdownMenu";
import SplashText, { SplashTextProps } from "../lib/ui/SplashText";

export default class MenuPage extends Page {
    play!: ButtonTest;
    setting!: ButtonTest;
    carCuz!: ButtonTest;
    KDbutton!: ButtonTest;
    credits!: ButtonTest;
    physicsTest!: ButtonTest;
    physicsTest2!: ButtonTest;
    puzzleTest!: ButtonTest;
    button_sfx!: Sound;
    dropdown!: DropdownMenu;
    splashtext!: SplashText;

    constructor() {
        super("menu-page")
    }
    preload(): any {
        this.scene.loadImage('test', "assets/buttonImages/mossy.png");
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
        this.dropdown.onDestroy();
        this.scene.remove(this.dropdown);
        this.scene.remove(this.splashtext);
        this.scene.remove(this.physicsTest2);
    }
    setup() {
        this.button_sfx = this.scene.add_new.sound("button_sfx")
        const button1: ButtonTestProps = {
            label: "Scene 1",
            font_key: "jersey",
            callback: () => { this.scene.start("play-scene") },
        };
        const button2: ButtonTestProps = {
            ...button1,
            callback: () => { this.scene.start("playscene-2") },
            label: "Scene 2"
        }
        const button3: ButtonTestProps = {
            ...button1,
            label: "Scene 3",
            callback: () => { this.scene.start("playscene-3") },
        }
        const button4: ButtonTestProps = {
            ...button1,
            label: "Scene 4",
            callback: () => { this.scene.start("drive-to-survive") },
        }
        const button5: ButtonTestProps = {
            ...button1,
            label: "Scene 5",
            callback: () => { this.scene.start("playscene-4") },
        }
        this.dropdown = this.scene.add_new.dropdown_menu({
            label: "Show Dev Scenes",
            font_key: "jersey",
            buttons: [
                button1,
                button2,
                button3,
                button4,
                button5,
            ]
        })
        this.dropdown.y = -200
        this.dropdown.x = -200
        this.play = this.scene.add_new.img_button({
            label: "Play!",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.set_page('difficulty-page')
            },
            imageKey: "test"
        })
        this.play.x = 0;
        this.play.y = -100;
        this.setting = this.scene.add_new.img_button({
            label: "Settings",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("settings-page");
            },
            imageKey: "test"
        })
        this.setting.x = 0;
        this.setting.y = 0;
        this.carCuz = this.scene.add_new.img_button({
            label: "Character Customization",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("character-page");
            },
            imageKey: "test"
        })
        this.carCuz.x = 0;
        this.carCuz.y = 100;


        // const changeLater = this.scene.add_new.img_button({
        //     label: "FUCK",
        //     font_key: 'jersey',
        //     callback: () => {
        //         this.button_sfx.play();
        //         this.cleanup();
        //         this.set_page("settings-page");
        //     },
        //     imageKey : "test"
        // })
        // changeLater.x = 0;
        // changeLater.y = 0;



        this.KDbutton = this.scene.add_new.img_button({
            label: "KD DEV",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.scene.start("kd-dev-scene")
            },
            imageKey: "test"
        })
        this.KDbutton.x = 300
        this.KDbutton.y = 300
        this.credits = this.scene.add_new.img_button({
            label: "Credits",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("credits-page");
            },
            imageKey: "test"
        })
        this.credits.x = -300
        this.credits.y = 300
        this.physicsTest = this.scene.add_new.img_button({
            label: "Physics",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.scene.start("physics-scene");
            },
            imageKey: "test"
        })
        this.physicsTest.x = 0
        this.physicsTest.y = 300
        this.physicsTest2 = this.scene.add_new.img_button({
            label: "Physics2",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.scene.start("physics-scene2");
            },
            imageKey: "test"
        })
        this.physicsTest2.x = 150
        // this.puzzleTest = this.scene.add_new.button({
        //     label: "Puzzles",
        //     font_key: "jersey",
        //     callback: () => {
        //         this.button_sfx.play();
        //         this.cleanup();
        //         this.scene.start("puzzle-dev-scene");
        //     }
        // })
        // this.puzzleTest.x = 0
        // this.puzzleTest.y = 300 
        this.physicsTest2.y = 300

        const splashprop: SplashTextProps = {
            label: "testtesttesttest",
            font_key: "minecraftia",
            font_size: 22
        }
        this.splashtext = this.scene.add_new.splashtext(splashprop);
        this.scene.p5.push();
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.textSize(150);
        const width = this.scene.p5.textWidth("EXIT PARADOX");
        this.scene.p5.pop();
        this.splashtext.x = width / 2 - 70;
        this.splashtext.y = -250;
    }
    postDraw(): void {
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.push();
        this.scene.p5.textSize(150);
        this.scene.p5.fill(0);
        this.scene.p5.text('EXIT PARADOX', -10, -290);
        this.scene.p5.text('EXIT PARADOX', -5, -295);

        this.scene.p5.fill(255);
        this.scene.p5.text('EXIT PARADOX', 0, -300);
        this.scene.p5.pop();
    }
}
