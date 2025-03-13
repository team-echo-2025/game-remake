import GameObject from "../lib/GameObject";
import PhysicsObject from "../lib/physics/PhysicsObject";
import Rectangle from "../lib/physics/Rectangle";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import { PuzzleState } from "../lib/Puzzle";
import Scene from "../lib/Scene";
import Spritesheet from "../lib/Spritesheet";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";

class Door implements GameObject {
    private _x: number = 0;
    private _y: number = 0;
    zIndex?: number | undefined = 49;
    asset_key: string;
    asset!: Spritesheet;
    scene: Scene;
    physics_object!: PhysicsObject;

    get x() {
        return this._x;
    }

    set x(_x: number) {
        this._x = _x;
        this.asset.x = _x;
        this.physics_object.body.x = this.x;
    }

    get y() {
        return this._y;
    }

    set y(_y: number) {
        this._y = _y;
        this.asset.y = _y;
        this.physics_object.body.y = this.y - 10;
    }

    constructor(scene: Scene, door_key: string) {
        this.asset_key = door_key;
        this.scene = scene;
    }

    setup() {
        this.asset = this.scene.add_new.spritesheet(this.asset_key, 8, 1, 500);
        this.asset.zIndex = this.zIndex ?? 0;
        this.asset.end_col = 4;
        this.physics_object = new PhysicsObject({
            width: this.asset.width + 30,
            height: this.asset.height / 2,
            mass: Infinity,
        });
        this.scene.physics.addObject(this.physics_object);
    }

    open() {
        this.asset.once(true);
        this.scene.physics.remove(this.physics_object);
    }
}

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>

type SceneState = {
    access_puzzle: PuzzleState;
}

export default class PlayScene extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    door?: Door;
    access_circuit?: AccessCircuit;
    private background_music!: Sound;
    private button_sfx!: Sound;
    private bgm_manager!: SoundManager;
    private sfx_manager!: SoundManager;
    state: SceneState = {
        access_puzzle: PuzzleState.notStarted,
    }

    constructor() {
        super("play-scene");
        this.physics.debug = false;
        //this.physics.debug = true;
    }

    onStart(args: StartArgs): void {
        this.camera.zoom = 3;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -425;
        this.player.body.y = args?.starting_pos?.y ?? 218;
        this.physics.addObject(this.player);
        this.set_time(300); // set time limit for scene
        this.set_update_time(this.p5.millis()); // time since last update to timer
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/LaythsTileMap/world-1.tmx")
        this.loadImage("door", "assets/doors/prison_door.png");
        this.loadImage("puzzle", "assets/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/access_circuit_success.png");
        this.loadImage("highlighted-puzzle", "assets/access_circuit_highlighted.png");
        this.loadSound("background_music", "assets/background_music.mp3");
        this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3");
        this.loadSound("circuit_correct_sfx", "assets/TInterfaceSounds/greanpatchT.mp3");
        this.loadSound("circuit_incorrect_sfx", "assets/TInterfaceSounds/all-processorsT.mp3");
        this.loadSound("circuit_xposition_sfx", "assets/TInterfaceSounds/iciclesT.mp3");
        this.loadImage("tree", "assets/effects/tree_159x163.png");
        this.loadImage("fire", "assets/effects/fire.png");
    }

    setup(): void {
        this.background_music = this.add_new.sound("background_music");
        this.button_sfx = this.add_new.sound("button_sfx");

        const bgm_props: SoundManagerProps = {
            group: "BGM",
            sounds: [this.background_music]
        }
        const sfx_props: SoundManagerProps = {
            group: "SFX",
            sounds: [this.button_sfx]
        }
        this.bgm_manager = this.add_new.soundmanager(bgm_props);
        this.sfx_manager = this.add_new.soundmanager(sfx_props);
        this.bgm_manager.play();

        const tree_test = this.add_new.spritesheet("tree", 8, 8, 1000);
        tree_test.start_col = 1;
        tree_test.end_col = 3;
        tree_test.end_row = 7;
        tree_test.zIndex = 49;
        tree_test.x = -185;
        tree_test.y = -165;
        tree_test.play();
        const fire = this.add_new.spritesheet("fire", 5, 5, 1000);
        fire.start_col = 0;
        fire.end_col = 4;
        fire.end_row = 2;
        fire.zIndex = 51;
        fire.x = -380;
        fire.y = 160;
        fire.play();

        this.access_circuit = new AccessCircuit(this, 'puzzle', this.player!);
        this.access_circuit.x = -280;
        this.access_circuit.y = 70;
        this.access_circuit?.setup();
        this.access_circuit.asset.zIndex = 101;

        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        const offsetX = 32;
        const offsetY = 32;
        this.bounds = new Rectangle({ x: this.tilemap.x + offsetX / 2 - 16, y: this.tilemap.y + offsetY / 2, w: this.tilemap.width - offsetX - 32, h: this.tilemap.height - offsetX });

        this.door = new Door(this, "door");
        this.door.setup();
        this.door.x = -384;
        this.door.y = 66;
        this.access_circuit.onCompleted = () => {
            this.door!.open();
            this.state.access_puzzle = PuzzleState.completed;
        }
        const portal1 = new PhysicsObject({
            width: 300,
            height: 32,
            mass: Infinity,
        })
        portal1.overlaps = true;
        portal1.body.x = 350;
        portal1.body.y = -360;
        portal1.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start("dungeon-1", {
                    starting_pos: { x: -1767, y: 863 }
                });
            }
        }
        this.physics.addObject(portal1);
        if (this.state.access_puzzle == PuzzleState.completed) {
            this.access_circuit.force_solve();
            this.door.open();
        }
    }

    mousePressed(_: MouseEvent): void {
        this.access_circuit?.mousePressed();
    }

    mouseReleased(_: MouseEvent): void {
        this.access_circuit?.mouseReleased();
    }



    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        this.access_circuit?.keyPressed(e);
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
        this.door = undefined;
        this.access_circuit = undefined;
    }

    postDraw(): void {
        this.access_circuit?.postDraw();
        this.set_current_time(this.p5.millis());
        this.set_delta_time((this.get_current_time() - this.get_update_time()) / 1000); // convert to seconds
        this.set_update_time(this.get_current_time());
        this.set_time(this.get_time() - this.get_delta_time());
        if (this.get_time() <= 0) {
            this.start("menu-scene");
            return;
        }
        this.p5.push();
        this.p5.fill(255, 0, 0);
        this.p5.textSize(24);
        this.p5.textAlign(this.p5.RIGHT, this.p5.TOP);
        let timeDisplay = Math.ceil(this.get_time()); // rounding up to whole second
        this.p5.text(`Time Left: ${timeDisplay}s`, this.p5.width / 2 - 20, -this.p5.height / 2 + 20);
        this.p5.pop();
    }

    draw(): void {
        this.access_circuit?.draw();
    }
}
