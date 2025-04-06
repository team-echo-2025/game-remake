import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";
import ButtonTest from "../lib/ui/ButtonTest";
import Page from "../lib/Page";

export default class WinnerPage extends Page {
    retry!: ButtonTest;
    mainMenu!: ButtonTest;
    timer_paused: boolean = false;
    scrollOffset: number = 0;
    //added for later
    background_music?: Sound;
    backgroundMusicManager?: SoundManager;
    button_sfx!: Sound;
    zIndex?: number | undefined = 300;

    constructor() {
        super("non-loser");
    }
    preload(): any {
        // Load the background music file
        this.scene.loadSound("dontlisten", "assets/funSounds/background_music4.mp3");
        this.scene.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.scene.loadImage('test', "assets/buttonImages/mossy.png");
    }
    setup(): void {
        for (const manager of this.scene.managers) {
            manager.stop();
        }
        this.scene.scene_manager.resetTimer();
        this.scene.scene_manager.disableTimer();
        this.scrollOffset = 0;
        //making buttons
        //Try Again same play-
        this.retry = this.scene.add_new.img_button({
            label: "Play Again!",
            font_key: 'jersey',
            callback: () => {
                // this.button_sfx.play();
                this.cleanup()
                window.location.href = "https://www.youtube.com/watch?v=5Y-HoOFMlpI&pp=ygUaaG93IHRvIHN0b3AgYmVpbmcgYW5ub3lpbmc%3D";
            },
            imageKey: "test"
        })
        this.retry.x = -this.scene.p5.windowWidth / 3;
        this.retry.y = this.scene.p5.windowHeight / 5;
        this.retry.zIndex = 301;
        //Menu Page
        this.mainMenu = this.scene.add_new.img_button({
            label: "Main Menu",
            font_key: 'jersey',
            callback: () => {
                // this.button_sfx.play();
                //this.cleanup()
                this.scene.start('menu-scene')
            },
            imageKey: "test"
        })
        this.mainMenu.x = this.scene.p5.windowWidth / 3;
        this.mainMenu.y = this.scene.p5.windowHeight / 5;
        this.mainMenu.zIndex = 301;
        //
        this.background_music = this.scene.add_new.sound("dontlisten");
        // const bgm_props: SoundManagerProps = {
        //     group: "BGM",
        //     sounds: [this.background_music]
        // }
        this.background_music.play();
        // this.backgroundMusicManager = this.add_new.soundmanager(bgm_props);
        // this.backgroundMusicManager.play();
    }
    cleanup() {
        this.scene.remove(this.retry);
    }

    postDraw(): void {
        const p = this.scene.p5;
        p.push();
        p.fill(137, 150, 240);
        p.rectMode(p.CENTER);
        p.rect(0, 0, p.windowWidth, p.windowHeight);

        //const minOffset = p.windowHeight / 4 - 850;
        const minOffset = p.windowHeight / 4 - 1500;
        p.push()

        p.translate(0, this.scrollOffset);
        this.losingText();
        p.pop();
        p.push();
        p.fill(0);
        p.textSize(50);
        p.textAlign(p.CENTER, p.CENTER);
        if (this.scrollOffset > minOffset) {
            p.translate(0, this.scrollOffset);
        } else {
            p.translate(0, minOffset);
        }
        p.text("YOU WIN :(", 0, -p.windowHeight / 4 + 1500);
        p.pop();
        p.pop();
        this.scrollOffset -= 1;
    }

    losingText(): void {
        const p = this.scene.p5;
        p.fill(0);
        p.textSize(50);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("YOU WIN :(", 0, -p.windowHeight / 4);
        //
        this.textProperties()
        p.text("You can't win..", 0, -p.windowHeight / 4 + 100);

        p.text("You were supossed to lose and only lose", 0, -p.windowHeight / 4 + 250);

        p.text("I guess you should probably choose a harder difficulty", 0, -p.windowHeight / 4 + 400);

        p.text("Because I know you didn't win on hard", 0, -p.windowHeight / 4 + 550);

        p.text("Enjoy the song", 0, -p.windowHeight / 4 + 700);
        p.text("But more importantly, GOODBYE!", 0, -p.windowHeight / 4 + 850);

    }
    textProperties(): void {
        const p = this.scene.p5;
        p.fill(0);
        p.textSize(25);
        p.textAlign(p.CENTER, p.CENTER);
    }
    onStart(): void {
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.scene.start("menu-scene");
        }
    };

    onStop(): void {
    }
    draw(): void {
    }
}
