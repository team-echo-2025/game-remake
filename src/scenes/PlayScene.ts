import Player from "../lib/Player";
import Scene from "../lib/Scene";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import Tilemap from "../lib/tilemap/Tilemap";
import ButtonTest from "../lib/ui/ButtonTest";
import Sound from "../lib/Sound";
import SoundManager, {SoundManagerProps} from "../lib/SoundManager";
export default class PlayScene extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    aCircuit!: AccessCircuit;
    button!: ButtonTest;
    private background_music!: Sound;
    private bgm_manager!: SoundManager;
    private button_sfx!: Sound;
    private circuit_correct_sfx!: Sound;
    private circuit_xposition_sfx!: Sound;
    private circuit_incorrect_sfx!: Sound;
    private sfx_manager!: SoundManager;

    constructor() {
        super("play-scene");
        this.background_music = new Sound("assets/background_music.mp3");
        this.button_sfx = new Sound("assets/TInterfaceSounds/light-switch.mp3");
        this.circuit_correct_sfx = new Sound("assets/TInterfaceSounds/greanpatchT.mp3");
        this.circuit_xposition_sfx = new Sound("assets/TInterfaceSounds/iciclesT.mp3");
        this.circuit_incorrect_sfx = new Sound("assets/TInterfaceSounds/all-processorsT.mp3");
    }

    onStart(): void {
        this.add(this.background_music);//loaded sounds first in case of issues with trying to give references to puzzles
        this.add(this.button_sfx);
        this.add(this.circuit_correct_sfx);
        this.add(this.circuit_incorrect_sfx);
        this.add(this.circuit_xposition_sfx);
        this.physics.debug = false;
        this.player = new Player(this);
        this.physics.addObject(this.player);
        this.aCircuit = new AccessCircuit(this, this.circuit_correct_sfx,this.circuit_incorrect_sfx,this.circuit_xposition_sfx,this.button_sfx);
        this.aCircuit.hidden = true;
        this.add(this.aCircuit);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/first-tilemap/outside.tmx")
    }

    setup(): void {
        this.button = this.add_new.button({
            label: "Puzzle",
            font_key: "jersey",
            callback: () => {
                this.button_sfx.play();
                this.aCircuit.hidden = false;
            }
        });
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })

        const bgm_props: SoundManagerProps= {
            group: "BGM",
            sounds: [this.background_music]
        }
        const sfx_props: SoundManagerProps= {
            group: "SFX",
            sounds: [
                this.button_sfx,
                this.circuit_correct_sfx,
                this.circuit_incorrect_sfx,
                this.circuit_xposition_sfx
            ]
        }
        this.bgm_manager = this.add_new.soundmanager(bgm_props);
        this.sfx_manager = this.add_new.soundmanager(sfx_props);
        this.bgm_manager.play();
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "Escape" && !this.aCircuit.hidden) {
            this.aCircuit.hidden = true;
        } else if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
    }
}
