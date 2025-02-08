import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";
import Sound from "../lib/Sound";

export default class KDDevScene extends Scene {
    player: Player;
    return_button: Button;
    play_music_button: Button;
    stop_music_button: Button;
    mute_music_button: Button;
    background_music: Sound;
    constructor() {
        super("kd-dev-scene");
        this.return_button = new Button({
            label: "Exit Dev Scene",
            scene: this,
            font_size: 50,
            callback: () => { this.start("menu-scene") }
        })
        this.play_music_button = new Button({
            label: "Play Music",
            scene: this,
            font_size: 50,
            callback: () => { this.background_music.play() }
        })
        this.stop_music_button = new Button({
            label: "Stop Music",
            scene: this,
            font_size: 50,
            callback: () => { this.background_music.stop() }
        })
        this.mute_music_button = new Button({
            label: "Mute Music",
            scene: this,
            font_size: 50,
            callback: () => { this.background_music.mute() }
        })
        this.background_music = new Sound("assets/background_music.mp3");
        this.player = new Player(this);
    }
    onStart(): void {
        this.add(this.player);
        this.add(this.return_button);
        this.add(this.play_music_button);
        this.add(this.stop_music_button);
        this.add(this.mute_music_button);
        this.add(this.background_music);
    }

    preload(): Promise<any> {
        console.log("begin preload of KD Dev scene")
        return this.background_music.preload();
    }

    
    setup(): void {
    }

    draw() {
        this.return_button.x = -300//this.p5.mouseX - this.p5.width / 2;
        this.return_button.y = -200//this.p5.mouseY - this.p5.height / 2;
        this.play_music_button.x = 300
        this.play_music_button.y = -300
        this.stop_music_button.x = 300
        this.stop_music_button.y = -200
        this.mute_music_button.x = 300
        this.mute_music_button.y = -100
    }
}