import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Sound from "../lib/Sound";
import DropdownMenu from "../lib/ui/DropdownMenu";
import ButtonTest, { ButtonTestProps } from "../lib/ui/ButtonTest";
import Slider from "../lib/ui/Slider";
import SoundManager,{ SoundManagerProps } from "../lib/SoundManager";

export default class KDDevScene extends Scene {
    player!: Player;
    return_button!: ButtonTest;
    play_music_button!: ButtonTest;
    stop_music_button!: ButtonTest;
    mute_music_button!: ButtonTest;
    manager_play_button!: ButtonTest;
    manager_stop_button!: ButtonTest;
    manager_mute_button!: ButtonTest;
    dropMenu!: DropdownMenu;
    background_music!: Sound;
    bgm_manager!: SoundManager;
    background_slider!: Slider;
    private button_sfx!: Sound;
    private sfx_manager!: SoundManager;

    constructor() {
        super("kd-dev-scene");
        //this.button_sfx = new Sound("assets/TInterfaceSounds/light-switch.mp3");
        //this.background_music = new Sound("assets/background_music.mp3");
        this.player = new Player(this);
    }
    onStart(): void {
        this.physics.addObject(this.player)
        this.add(this.background_music);
        //this.add(this.background_music);
        //this.add(this.button_sfx);
        //this.bgm_manager.add(this.background_music);
    }

    preload(): any {
        console.log("begin preload of KD Dev scene")
        this.loadFont("jersey", 'assets/fonts/jersey.ttf');
        this.loadSound("background_music", "assets/background_music.mp3");
        this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3");
    }

    mouseClicked(_: MouseEvent): void {
        if (this.player.shooting) return;
        const obj = this.physics.raycast();
        if (obj) {
            this.physics.remove(obj);
        }
    }

    setup(): void {
        //this.get_asset("background_music").load();
        //this.get_asset("button_sfx").load()
        this.background_music = this.add_new.sound("background_music");
        this.button_sfx = this.add_new.sound("button_sfx");
        const bgm_props: SoundManagerProps= {
            group: "BGM",
            sounds: [this.background_music]
        }
        const sfx_props: SoundManagerProps= {
            group: "SFX",
            sounds: [this.button_sfx]
        } 
        this.bgm_manager = this.add_new.soundmanager(bgm_props);
        this.sfx_manager = this.add_new.soundmanager(sfx_props);
       const button1: ButtonTestProps = {
            label: "test nothing",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.button_sfx.play()
            }
        };
        const button2: ButtonTestProps = {
            ...button1,
            callback: () => { 
                this.start("menu-scene");
                this.button_sfx.play()
            },
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
            ],
            callback:()=> {this.button_sfx.play()}
        })
        this.return_button = this.add_new.button({
            label: "Exit Dev Scene",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.start("menu-scene");
                this.button_sfx.play();
            }
        })
        this.play_music_button = this.add_new.button({
            label: "Play Music",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.background_music.play();
                this.button_sfx.play()
            }
        })
        this.stop_music_button = this.add_new.button({
            label: "Stop Music",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.background_music.stop() 
                this.button_sfx.play()
            }
        })
        this.mute_music_button = this.add_new.button({
            label: "Mute Music",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.background_music.mute() 
                this.button_sfx.play()
            }
        })
        this.manager_play_button = this.add_new.button({
            label: "Play Manager",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.bgm_manager.play();
                this.button_sfx.play();
            }
        })
        this.manager_stop_button = this.add_new.button({
            label: "Stop Manager",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.bgm_manager.stop();
                this.button_sfx.play();
             }
        })
        this.manager_mute_button = this.add_new.button({
            label: "Mute Manager",
            font_key: "jersey",
            font_size: 50,
            callback: () => { 
                this.bgm_manager.mute();
                this.button_sfx.play()
            }
        })
        this.background_slider = this.add_new.slider({
            scene: this,
            key: "BGM",
            callback: (volume: string) => { 
                this.bgm_manager.updateVolume(volume)
                this.button_sfx.play()
            }
        })
        

        this.return_button.x = -300//this.p5.mouseX - this.p5.width / 2;
        this.return_button.y = 200//this.p5.mouseY - this.p5.height / 2;
        this.play_music_button.x = 550
        this.play_music_button.y = -300
        this.play_music_button.width = 80
        this.stop_music_button.x = 550
        this.stop_music_button.y = -200
        this.stop_music_button.width = 80
        this.mute_music_button.x = 550
        this.mute_music_button.y = -100
        this.mute_music_button.width = 80

        this.manager_play_button.x = 300
        this.manager_play_button.y = -300
        this.manager_play_button.width = 80
        this.manager_stop_button.x = 300
        this.manager_stop_button.y = -200
        this.manager_stop_button.width = 80
        this.manager_mute_button.x = 300
        this.manager_mute_button.y = -100
        this.manager_mute_button.width = 80

        this.dropMenu.y = -200
        this.dropMenu.x = -200
        this.background_slider.x = 100
        this.background_slider.y = 100
        
    }
    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };
}
