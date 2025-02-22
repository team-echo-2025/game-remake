import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Sound from "../lib/Sound";
import DropdownMenu from "../lib/ui/DropdownMenu";
import ButtonTest, { ButtonTestProps } from "../lib/ui/ButtonTest";

export default class KDDevScene extends Scene {
    player!: Player;
    return_button!: ButtonTest;
    play_music_button!: ButtonTest;
    stop_music_button!: ButtonTest;
    mute_music_button!: ButtonTest;
    background_music!: Sound;
    dropMenu!: DropdownMenu;
    constructor() {
        super("kd-dev-scene");
        this.background_music = new Sound("assets/background_music.mp3");
        this.player = new Player(this);
    }
    onStart(): void {
        this.physics.addObject(this.player)
        this.add(this.background_music);
    }

    preload(): any {
        console.log("begin preload of KD Dev scene")
        this.background_music.preload();
        this.loadFont("jersey", 'assets/fonts/jersey.ttf');
    }

    mouseClicked(_: MouseEvent): void {
        if (this.player.shooting) return;
        const obj = this.physics.raycast();
        if (obj) {
            this.physics.remove(obj);
        }
    }

    setup(): void {
        const button1: ButtonTestProps = {
            label: "test nothing",
            font_key: "jersey",
            font_size: 50,
        };
        const button2: ButtonTestProps = {
            ...button1,
            callback: () => { this.start("menu-scene") },
            label: "to menu"
        }
        const button3: ButtonTestProps = {
            ...button1,
            label: "this big massive button does nothing"
        }

        this.dropMenu = this.add_new.dropdown_menu({
            label: "Show Dev Scenes",
            font_key: "jersey",
            font_size: 50,
            buttons: [
                button1,
                button2,
                button3
            ]
        })
        this.return_button = this.add_new.button({
            label: "Exit Dev Scene",
            font_key: "jersey",
            font_size: 50,
            callback: () => { this.start("menu-scene") }
        })
        this.play_music_button = this.add_new.button({
            label: "Play Music",
            font_key: "jersey",
            font_size: 50,
            callback: () => { this.background_music.play() }
        })
        this.stop_music_button = this.add_new.button({
            label: "Stop Music",
            font_key: "jersey",
            font_size: 50,
            callback: () => { this.background_music.stop() }
        })
        this.mute_music_button = this.add_new.button({
            label: "Mute Music",
            font_key: "jersey",
            font_size: 50,
            callback: () => { this.background_music.mute() }
        })
        this.return_button.x = -300//this.p5.mouseX - this.p5.width / 2;
        this.return_button.y = 200//this.p5.mouseY - this.p5.height / 2;
        this.play_music_button.x = 300
        this.play_music_button.y = -300
        this.stop_music_button.x = 300
        this.stop_music_button.y = -200
        this.mute_music_button.x = 300
        this.mute_music_button.y = -100
        this.dropMenu.y = -200
        this.dropMenu.x = -200
    }
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };
}
