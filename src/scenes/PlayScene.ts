import Player from "../lib/Player";
import Scene from "../lib/Scene";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import BlockSlide from "../puzzles/BlockSlide/BlockSlide";
import Tilemap from "../lib/tilemap/Tilemap";
import ButtonTest from "../lib/ui/ButtonTest";
import Sound from "../lib/Sound";
import SoundManager, {SoundManagerProps} from "../lib/SoundManager";
export default class PlayScene extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    aCircuit!: AccessCircuit;
    bSlide!: BlockSlide;
    aCircuitButton!: ButtonTest;
    bSlideButton!: ButtonTest;
    private background_music!: Sound;
    // private bgm_manager!: SoundManager;
    // private button_sfx!: Sound;
    // private circuit_correct_sfx!: Sound;
    // private circuit_xposition_sfx!: Sound;
    // private circuit_incorrect_sfx!: Sound;
    // private sfx_manager!: SoundManager;

    constructor() {
        super("play-scene");
        //this.background_music = new Sound("assets/background_music.mp3");
        //this.button_sfx = new Sound("assets/TInterfaceSounds/light-switch.mp3");
        //this.circuit_correct_sfx = new Sound("assets/TInterfaceSounds/greanpatchT.mp3");
        //this.circuit_xposition_sfx = new Sound("assets/TInterfaceSounds/iciclesT.mp3");
        //this.circuit_incorrect_sfx = new Sound("assets/TInterfaceSounds/all-processorsT.mp3");
    }

    onStart(): void {
        //this.physics.debug = true;
        this.player = new Player(this);
        this.physics.addObject(this.player);
        this.aCircuit = new AccessCircuit(this);
        this.bSlide = new BlockSlide(this);
        this.aCircuit.hidden = true;
        this.bSlide.hidden = true;
        this.add(this.aCircuit);
        this.add(this.bSlide);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/first-tilemap/outside.tmx")
        //this.loadSound("background_music", "assets/background_music.mp3")
        //this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3")
    }

    setup(): void {
        //this.get_asset("background_music").load();
        //this.get_asset("button_sfx").load()
        //this.background_music = this.add_new.sound("background_music")
        //this.button_sfx = this.add_new.sound("button_sfx")

        // const bgm_props: SoundManagerProps= {
        //     group: "BGM",
        //     sounds: [this.background_music]
        // }
        // const sfx_props: SoundManagerProps= {
        //     group: "SFX",
        //     sounds: [this.button_sfx]
        // }
        // this.bgm_manager = this.add_new.soundmanager(bgm_props);
        // this.sfx_manager = this.add_new.soundmanager(sfx_props);


        this.aCircuitButton = this.add_new.button({
            label: "Access Circuit",
            font_key: "jersey",
            callback: () => {
                //this.button_sfx.play();
                this.aCircuit.hidden = false;
            }
        });
        this.bSlideButton = this.add_new.button({
            label: "Block Slide",
            font_key: "jersey",
            callback: () => {
                this.bSlide.hidden = false;
            }
        });
        this.bSlideButton.y = 100;
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })

        // const bgm_props: SoundManagerProps= {
        //     group: "BGM",
        //     sounds: [this.background_music]
        // }
        // const sfx_props: SoundManagerProps= {
        //     group: "SFX",
        //     sounds: [
        //         this.button_sfx,
        //         this.circuit_correct_sfx,
        //         this.circuit_incorrect_sfx,
        //         this.circuit_xposition_sfx
        //     ]
        // }
        // this.bgm_manager = this.add_new.soundmanager(bgm_props);
        // this.sfx_manager = this.add_new.soundmanager(sfx_props);
        // this.bgm_manager.play();
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "Escape" && !this.aCircuit.hidden) {
            this.aCircuit.hidden = true;
        } else if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    mouseClicked(_: MouseEvent): void {
        if (this.player?.shooting) return;
        const obj = this.physics.raycast();
        if (obj) {
            this.physics.remove(obj);
        }
    }

    memorySizeOf(obj: any) {
        var bytes = 0;

        function sizeOf(obj: any) {
            if (obj !== null && obj !== undefined) {
                switch (typeof obj) {
                    case "number":
                        bytes += 8;
                        break;
                    case "string":
                        bytes += obj.length * 2;
                        break;
                    case "boolean":
                        bytes += 4;
                        break;
                    case "object":
                        var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                        if (objClass === "Object" || objClass === "Array") {
                            for (var key in obj) {
                                if (!obj.hasOwnProperty(key)) continue;
                                sizeOf(obj[key]);
                            }
                        } else bytes += obj.toString().length * 2;
                        break;
                }
            }
            return bytes;
        }

        function formatByteSize(bytes: any) {
            if (bytes < 1024) return bytes + " bytes";
            else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
            else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
            else return (bytes / 1073741824).toFixed(3) + " GiB";
        }

        return formatByteSize(sizeOf(obj));
    }

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
    }
}
