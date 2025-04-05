import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";
import Sound from "../lib/Sound";
import SoundManager, {SoundManagerProps} from "../lib/SoundManager";
import Slider from "../lib/ui/Slider";

export default class SettingPage extends Page {
    private mute!: ButtonTest;
    private keybinds!: ButtonTest;
    private back!: ButtonTest;
    private isMuted: boolean = false;
    private bgm_slider!: Slider;
    private sfx_slider!: Slider;
    //state below needs to be initialized to assets that already exist in scene
    private background_music!: Sound;
    private bgm_manager!: SoundManager;
    private button_sfx!: Sound;
    private sfx_manager!: SoundManager;
    constructor() {
        super("settings-page")
    }
    preload(): any {
    }
    cleanup = () => {
        this.scene.remove(this.mute)
        this.scene.remove(this.keybinds)
        this.scene.remove(this.back)
        this.scene.remove(this.bgm_slider);
        this.scene.remove(this.sfx_slider);
    }
    setup(): void {
        // this.scene.get_asset("background_music").load();
        // this.scene.get_asset("button_sfx").load()
        this.background_music = this.scene.add_new.sound("background_music")
        this.button_sfx = this.scene.add_new.sound("button_sfx")

        const bgm_props: SoundManagerProps= {
            group: "BGM",
            sounds: [this.background_music]
        }
        const sfx_props: SoundManagerProps= {
            group: "SFX",
            sounds: [this.button_sfx]
        }
        this.bgm_manager = this.scene.add_new.soundmanager(bgm_props);
        this.sfx_manager = this.scene.add_new.soundmanager(sfx_props);
        this.mute = this.scene.add_new.img_button({
            label: "Mute",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                //this.cleanup();
                this.handleMute();
            },
            imageKey : "test"
        })
        this.mute.x = 0;
        this.mute.y = -100;
        this.keybinds = this.scene.add_new.img_button({
            label: "Keybinds",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("keybinds-page");
            },
            imageKey : "test"
        })
        this.keybinds.x = 0;
        this.keybinds.y = 0;
        this.back = this.scene.add_new.img_button({
            label: "Back",
            font_key: 'jersey',
            callback: () => {
                this.button_sfx.play();
                this.cleanup();
                this.set_page("menu-page");
            },
            imageKey : "test"
        })
        this.back.x = 0;
        this.back.y = 100;
        this.bgm_slider = this.scene.add_new.slider({
            scene: this.scene,
            key: "BGM",
            callback: (volume: string) => {
                if(!this.isMuted){
                    this.bgm_manager.updateVolume(volume);
                    this.button_sfx.play();
                }

            }
        })
        this.bgm_slider.x = 250
        this.bgm_slider.y = 150
        
        this.sfx_slider = this.scene.add_new.slider({
            scene: this.scene,
            key: "SFX",
            callback: (volume: string) => {
                if(!this.isMuted){
                    this.sfx_manager.updateVolume(volume);
                    this.button_sfx.play();
                }
                
            }
        })
        
        this.sfx_slider.x = 250
        this.sfx_slider.y = 350
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") { // When ESC is pressed...
            this.cleanup();
            this.set_page("menu-page"); // ...return to main menu
        }
    };

    private handleMute(): void {
        this.isMuted = !this.isMuted; // Toggle mute state
        document.dispatchEvent(new CustomEvent("onmute", {
            detail: { mute: this.isMuted }
        }));
        localStorage.setItem("muted", this.isMuted + "")

        // Update button label dynamically
        this.mute.label = this.isMuted ? "Unmute" : "Mute";
        // this.bgm_manager.setupVolume()
        // this.sfx_manager.setupVolume()
    }
}
