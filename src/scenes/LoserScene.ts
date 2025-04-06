import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";
import ButtonTest from "../lib/ui/ButtonTest";
import Scene from "../lib/Scene";

export default class LoserScene extends Scene {
    retry!: ButtonTest;
    mainMenu!: ButtonTest;
    timer_paused: boolean = false;
    scrollOffset: number = 0;
    //added for later
    background_music?: Sound;
    backgroundMusicManager?: SoundManager;
    button_sfx!: Sound;

    constructor() {
        super("loser");
    }
    preload(): any {
        // Load the background music file
        this.loadSound("dontlisten", "assets/funSounds/background_music4.mp3");
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadImage('test', "assets/buttonImages/mossy.png");
    }
    setup(): void {
        this.scene_manager.resetTimer();
        this.scene_manager.disableTimer();
        this.scrollOffset = 0;
        //making buttons
        //Try Again same play-
        this.retry = this.add_new.img_button({
            label: "Try Again!",
            font_key: 'jersey',
            callback: () => {
                // this.button_sfx.play();
                this.cleanup()
                this.start('play-scene')
            },
            imageKey: "test"
        })
        this.retry.x = -this.p5.windowWidth / 3;
        this.retry.y = this.p5.windowHeight / 5;
        this.retry.zIndex = 101;
        //Menu Page
        this.mainMenu = this.add_new.img_button({
            label: "Main Menu",
            font_key: 'jersey',
            callback: () => {
                // this.button_sfx.play();
                this.cleanup()
                this.start('menu-scene')
            },
            imageKey: "test"
        })
        this.mainMenu.x = this.p5.windowWidth / 3;
        this.mainMenu.y = this.p5.windowHeight / 5;
        this.mainMenu.zIndex = 101;
        //
        this.background_music = this.add_new.sound("dontlisten");
        // const bgm_props: SoundManagerProps = {
        //     group: "BGM",
        //     sounds: [this.background_music]
        // }
        this.background_music.play();
        // this.backgroundMusicManager = this.add_new.soundmanager(bgm_props);
        // this.backgroundMusicManager.play();
    }
    cleanup() {
        this.remove(this.retry);
    }
    set_page(arg0: string) {
    }

    postDraw(): void {
        const p = this.p5;
        p.push();
        p.fill(0);
        p.rect(0, 0, p.windowWidth, p.windowHeight);

        const minOffset = p.windowHeight / 4 - 850;
        if (this.scrollOffset > minOffset) {
            this.scrollOffset -= 1;
        }

        p.translate(0, this.scrollOffset);
        this.losingText();
        p.pop();
    }

    losingText(): void {
        const p = this.p5;
        p.fill(255);
        p.textSize(50);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("YOU LOSE :)", 0, -p.windowHeight / 4);
        //
        this.textProperties()
        p.text("Thanks for giving it your best shot but \nyou're simply not good enough", 0, -p.windowHeight / 4 + 100);

        p.text("Those puzzle skills definitely need work.\nMaybe one day you'll be good enough", 0, -p.windowHeight / 4 + 250);

        p.text("I would say click Play Again on the left, but you should really hit the Main Menu button\non the right and try an easier difficulty", 0, -p.windowHeight / 4 + 400);

        p.text("But you should really hit the Main Menu button on the right and try an easier difficulty", 0, -p.windowHeight / 4 + 550);

        p.text("Good luck in future endeavors", 0, -p.windowHeight / 4 + 700);

        p.text("But more importantly, GOODBYE!", 0, -p.windowHeight / 4 + 850);
    }
    textProperties(): void {
        const p = this.p5;
        p.fill(255);
        p.textSize(25);
        p.textAlign(p.CENTER, p.CENTER);
    }
    onStart(): void {
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
    }
    draw(): void {
    }
}