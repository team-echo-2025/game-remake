import GameObject from "../lib/GameObject"
import PhysicsObject from "../lib/physics/PhysicsObject";
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
import BoxCollider from "../lib/physics/BoxCollider";
import Dialogue from "../lib/ui/Dialogue";
import Tasks, { Task } from "../lib/Tasks";

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
    dialogue!: Dialogue;
    tasks!: Tasks;
    state: SceneState = {
        access_puzzle: PuzzleState.notStarted,
    }
    task1?: Task;


    constructor() {
        super("play-scene");
        //this.physics.debug = true;
    }


    onStart(args: StartArgs): void {
        this.camera.zoom = 3;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -425;
        this.player.body.y = args?.starting_pos?.y ?? 218;
        this.physics.addObject(this.player);
    }


    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/LaythsTileMap/world-1.tmx")
        this.loadImage("door", "assets/doors/prison_door.png");
        this.loadImage("puzzle", "assets/puzzleImages/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/puzzleImages/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/puzzleImages/access_circuit_success.png");
        this.loadImage("highlighted-puzzle", "assets/puzzleImages/access_circuit_highlighted.png");
        this.loadSound("background_music", "assets/background_music.mp3");
        this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3");
        this.loadSound("circuit_correct_sfx", "assets/TInterfaceSounds/greanpatchT.mp3");
        this.loadSound("circuit_incorrect_sfx", "assets/TInterfaceSounds/all-processorsT.mp3");
        this.loadSound("circuit_xposition_sfx", "assets/TInterfaceSounds/iciclesT.mp3");
        this.loadImage("tree", "assets/effects/tree_159x163.png");
        this.loadImage("fire", "assets/effects/fire.png");
    }


    setup(): void {
        this.task1 = new Task(this);
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


        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        const offsetX = 32;
        const offsetY = 32;
        this.bounds = new BoxCollider({ x: this.tilemap.x + offsetX / 2 - 16, y: this.tilemap.y + offsetY / 2, w: this.tilemap.width - offsetX - 32, h: this.tilemap.height - offsetX });


        this.door = new Door(this, "door");
        this.door.setup();
        this.door.x = -384;
        this.door.y = 66;

        const leftOfDoor = new PhysicsObject({
            width: 15,
            height: 30,
            mass: Infinity,
        })
        leftOfDoor.body.x = -409;
        leftOfDoor.body.y = 64;
        this.physics.addObject(leftOfDoor);
        const rightOfDoor = new PhysicsObject({
            width: 15,
            height: 30,
            mass: Infinity,
        })
        rightOfDoor.body.x = -360;
        rightOfDoor.body.y = 64;
        this.physics.addObject(rightOfDoor);



        this.createPuzzle();
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
                this.start("playscene-2", {
                    starting_pos: { x: -1136, y: 863 }
                });
            }
        }
        this.physics.addObject(portal1);
        this.dialogue = new Dialogue(this, this.player!);
        // this.dialogue.addDialogue(-425, 218, "Are you safe from SQL injection?");
        this.dialogue.addDialogue(-329, 168, "Find a way to open the door");
        this.dialogue.addDialogue(-331, -19, "Follow the path and you'll find your way eventually");
        this.dialogue.addDialogue(170, -237, "Is there something up there?");
        this.dialogue.setup();
        this.tasks = new Tasks(this, this.task1);
        if (this.state.access_puzzle == PuzzleState.completed) {
            this.access_circuit?.force_solve();
            this.door.open();
            this.task1.completeTask();
        }
    }


    mousePressed(e: MouseEvent): void {
        this.access_circuit?.mousePressed(e);
    }


    mouseReleased(_: MouseEvent): void {
        this.access_circuit?.mouseReleased();
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        this.access_circuit?.keyPressed(e);
        if (e.key === "Escape") {
            if (this.access_circuit && !this.access_circuit.hidden) {
                this.access_circuit.hidden = true;
                this.access_circuit.cleanup();
                if (this.player) this.player.disabled = false;
            } else if (!this.scene_manager.paused) {
                this.scene_manager.page_manager?.set_page("pause-page");
            }
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
        this.door = undefined;
        this.access_circuit = undefined;
    }
    postDraw(): void {
        this.tasks.postDraw();
        if (!this.access_circuit?.hidden) this.access_circuit?.postDraw();
        if (this.player && this.scene_manager.paused) {
            this.player.disabled = true;
        } else if (this.player && !this.scene_manager.paused) {
            if (this.access_circuit && this.access_circuit.hidden) this.player.disabled = false;
        }
    }
    draw(): void {
        if (!this.access_circuit?.hidden) this.access_circuit?.draw();
        this.dialogue.draw();
    }

    createPuzzle(): void {
        this.access_circuit = new AccessCircuit(this, 'puzzle', this.player!);
        // When creating a new puzzle dynamically, call updatePuzzles, pass the new puzzle,
        // and pass the index of the puzzle in the puzzles array of this.tasks that is
        // being replaced (this should really only be used here since AC is the only
        // puzzle you can fail)
        this.access_circuit.x = -288;
        this.access_circuit.y = 43;
        this.access_circuit.setup();
        this.access_circuit.asset.zIndex = 101;
        this.access_circuit.onOpen = () => {
            this.dialogue.killAll();
        }

        this.access_circuit.onCompleted = () => {
            if (this.access_circuit!.state === PuzzleState.failed) {
                this.remove(this.access_circuit!);
                this.createPuzzle();
            } else {
                this.task1?.completeTask();
                this.door!.open();
                this.access_circuit!.force_solve();
                this.state.access_puzzle = PuzzleState.completed;
            }
        };
    }
    reset(): void {
        this.state.access_puzzle = PuzzleState.notStarted;
        this.task1 = undefined;
    }
}



