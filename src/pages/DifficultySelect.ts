import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";
import Puzzle from "../lib/Puzzle"
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";

export default class DifficultyPage extends Page {
    easy!: ButtonTest;
    normal!: ButtonTest;
    hard!: ButtonTest;
    back!: ButtonTest;
    set_difficulty!: Puzzle;
    private button_sfx!: Sound;
    private sfx_manager!: SoundManager;
    constructor() {
        super("difficulty-page")
        this.set_difficulty = new Puzzle(this.scene);
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    cleanup = () => {
        this.scene.remove(this.easy)
        this.scene.remove(this.normal)
        this.scene.remove(this.hard)
        this.scene.remove(this.back)
        console.log(this.scene, "TNERIONTIERS")
        this.scene.scene_manager.resetTimer();
    }
    setup(): void {
        this.button_sfx = this.scene.add_new.sound("button_sfx")
        const sfx_props: SoundManagerProps = {
            group: "SFX",
            sounds: [this.button_sfx]
        }
        this.sfx_manager = this.scene.add_new.soundmanager(sfx_props);
        this.easy = this.scene.add_new.img_button({
            label: "Easy",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.scene.start("play-scene");
                this.setDifficulty("easy");
            },
            imageKey: "test"
        })
        this.easy.y = -100;
        this.normal = this.scene.add_new.img_button({
            label: "Normal",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.scene.start("play-scene");
                this.setDifficulty("normal");
            },
            imageKey: "test"
        })
        this.hard = this.scene.add_new.img_button({
            label: "Hard",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.scene.start("play-scene");
                this.setDifficulty("hard");
            },
            imageKey: "test"
        })
        this.hard.y = 100;
        this.back = this.scene.add_new.img_button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup()
                this.set_page("menu-page");
            },
            imageKey: "test"
        })
        this.keyPressed = (e: KeyboardEvent) => {
            if (e.key === "Escape") { // When ESC is pressed...
                this.cleanup();
                this.set_page("menu-page"); // ...return to main menu
            }
        };
        this.back.y = 200;
    }
    setDifficulty(difficulty: string) {
        this.set_difficulty.setDifficulty(difficulty);
        this.scene.scene_manager.resetTimer();
    }
}
