import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Button, { ButtonProps } from "../lib/ui/Button";
import Sound from "../lib/Sound";
import DropdownMenu from "../lib/ui/DropdownMenu";

export default class KDDevScene extends Scene {
    player: Player;
    return_button: Button;
    play_music_button: Button;
    stop_music_button: Button;
    mute_music_button: Button;
    background_music: Sound;
    dropMenu: DropdownMenu;
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

        const button1:ButtonProps = {
            label: "test",
            scene: this,
            font_size: 50,
            callback: () => {}
        };
        const button2:ButtonProps = {
            ...button1, 
            callback: () => { this.start("menu-scene") },
            label: "Im so tired"
        }
        const button3:ButtonProps = {
            ...button1, 
            label: "nice throbber mate"
        }

        this.dropMenu = new DropdownMenu({
            label: "Show Dev Scenes",
            scene: this,
            font_size: 50,
            buttons:[
                button1,
                button2,
                button3
            ]
        })
    }
    onStart(): void {
        this.add(this.player);
        this.add(this.return_button);
        this.add(this.play_music_button);
        this.add(this.stop_music_button);
        this.add(this.mute_music_button);
        this.add(this.background_music);
        this.add(this.dropMenu)
    }

    preload(): Promise<any> {
        console.log("begin preload of KD Dev scene")
        return this.background_music.preload();
    }

    
    setup(): void {
        this.return_button.x = -300//this.p5.mouseX - this.p5.width / 2;
        this.return_button.y = 200//this.p5.mouseY - this.p5.height / 2;
        this.play_music_button.x = 300
        this.play_music_button.y = -300
        this.stop_music_button.x = 300
        this.stop_music_button.y = -200
        this.mute_music_button.x = 300
        this.mute_music_button.y = -100
        this.dropMenu.y= -200
        this.dropMenu.x= -200
    }

    draw() {
        
        
    }
}